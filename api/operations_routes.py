"""Scoped real settings, metadata exports and explicit bounded retention maintenance."""
from datetime import datetime,timezone,timedelta
import argparse
from dataclasses import replace
import json
from pathlib import Path
import re
import psycopg
from uuid import UUID,uuid4
from fastapi import APIRouter,HTTPException,Request
from pydantic import Field,model_validator
from psycopg.types.json import Jsonb
from api.auth import require_human,require_member
from api.db import connection
from api.execution import append_audit
from api.spend_routes import StrictModel,Minor,CURRENCIES

router=APIRouter()


class Profile(StrictModel):
    name: str=Field(min_length=1,max_length=120)


class OrganizationSettings(StrictModel):
    retention_days: int=Field(default=30,strict=True,ge=1,le=3650)
    poll_interval_seconds: int=Field(default=30,strict=True,ge=5,le=3600)
    heartbeat_interval_seconds: int=Field(default=30,strict=True,ge=5,le=3600)
    monitoring_enabled: bool=Field(default=True,strict=True)
    budget_minor: Minor|None=None
    budget_currency: str|None=None

    @model_validator(mode='after')
    def budget_pair(self):
        if (self.budget_minor is None) != (self.budget_currency is None) or (self.budget_currency is not None and self.budget_currency not in CURRENCIES):
            raise ValueError('Budget requires both integer minor units and supported currency, or both null')
        return self


class Empty(StrictModel):
    pass


class RetentionDelete(StrictModel):
    preview_id: UUID
    confirmation: str

    @model_validator(mode='after')
    def confirmed(self):
        if self.confirmation != 'DELETE EXPIRED EVENTS':
            raise ValueError('Explicit deletion confirmation required')
        return self


def read_settings(conn,org_id):
    row=conn.execute('SELECT settings FROM organizations WHERE id=%s',(org_id,)).fetchone()
    if not row:
        raise HTTPException(404,'Organization not found')
    return OrganizationSettings.model_validate({k:v for k,v in row['settings'].items() if k in OrganizationSettings.model_fields}).model_dump()


@router.get('/api/profile')
def profile(request: Request):
    user=require_human(request)
    with connection(request.app.state.settings,subject=user.subject) as conn:
        row=conn.execute('SELECT subject,email,name FROM users WHERE subject=%s',(user.subject,)).fetchone()
    return row or {'subject':user.subject,'email':user.email,'name':user.name}


@router.patch('/api/profile')
def update_profile(body: Profile,request: Request):
    member=require_member(request)
    with connection(request.app.state.settings,member.org_id,subject=member.subject) as conn:
        row=conn.execute('UPDATE users SET name=%s WHERE subject=%s RETURNING subject,email,name',(body.name,member.subject)).fetchone()
        if not row:
            raise HTTPException(409,'Profile must first be provisioned by an operator')
        append_audit(conn,member.org_id,'profile_updated',{'subject':member.subject})
    return row


@router.get('/api/settings')
def settings(request: Request):
    member=require_member(request)
    with connection(request.app.state.settings,member.org_id) as conn:
        return read_settings(conn,member.org_id)


@router.patch('/api/settings')
def update_settings(body: OrganizationSettings,request: Request):
    member=require_member(request,admin=True)
    values=body.model_dump()
    with connection(request.app.state.settings,member.org_id) as conn:
        conn.execute('UPDATE organizations SET settings=settings || %s WHERE id=%s',(Jsonb(values),member.org_id))
        conn.execute('UPDATE devices SET config_version=config_version+1')
        append_audit(conn,member.org_id,'settings_updated',{'subject':member.subject,'settings':values})
    return values


@router.get('/api/team')
def team(request: Request):
    member=require_member(request)
    with connection(request.app.state.settings,member.org_id) as conn:
        rows=conn.execute('SELECT u.subject,u.email,u.name,m.role FROM memberships m JOIN users u ON u.subject=m.subject WHERE m.org_id=%s ORDER BY u.name,u.subject',(member.org_id,)).fetchall()
    return {'members':rows,'provisioning':'operator_only','invitations_available':False}


@router.post('/api/privacy/retention/preview')
def retention_preview(body: Empty,request: Request):
    member=require_member(request,admin=True)
    now=datetime.now(timezone.utc)
    with connection(request.app.state.settings,member.org_id) as conn:
        values=read_settings(conn,member.org_id)
        cutoff=now-timedelta(days=values['retention_days'])
        rows=conn.execute('SELECT event_id FROM events WHERE received_at<%s ORDER BY received_at,event_id LIMIT 1001',(cutoff,)).fetchall()
        ids=[r['event_id'] for r in rows[:1000]]
        preview_id=uuid4()
        expires=now+timedelta(minutes=5)
        conn.execute('DELETE FROM retention_previews WHERE expires_at<%s',(now,))
        conn.execute('INSERT INTO retention_previews(id,org_id,subject,event_ids,cutoff,expires_at) VALUES(%s,%s,%s,%s,%s,%s)',(preview_id,member.org_id,member.subject,ids,cutoff,expires))
        append_audit(conn,member.org_id,'retention_previewed',{'subject':member.subject,'preview_id':str(preview_id),'eligible_count':len(ids),'cutoff':cutoff.isoformat()})
    return {'preview_id':preview_id,'eligible_count':len(ids),'has_more':len(rows)>1000,'cutoff':cutoff,'expires_at':expires,'confirmation':'DELETE EXPIRED EVENTS'}


@router.post('/api/privacy/retention/delete')
def retention_delete(body: RetentionDelete,request: Request):
    member=require_member(request,admin=True)
    with connection(request.app.state.settings,member.org_id) as conn:
        row=conn.execute('SELECT * FROM retention_previews WHERE id=%s AND subject=%s FOR UPDATE',(body.preview_id,member.subject)).fetchone()
        if not row:
            raise HTTPException(404,'Retention preview not found')
        if row['used_at'] or row['expires_at']<=datetime.now(timezone.utc):
            raise HTTPException(409,'Retention preview is expired or already used')
        # Recheck current retention as well: lengthening it after preview cannot remove newer events.
        current_cutoff=datetime.now(timezone.utc)-timedelta(days=read_settings(conn,member.org_id)['retention_days'])
        result=conn.execute('DELETE FROM events WHERE event_id=ANY(%s) AND received_at<%s AND received_at<%s',(row['event_ids'],row['cutoff'],current_cutoff))
        deleted=result.rowcount
        conn.execute('UPDATE retention_previews SET used_at=now() WHERE id=%s',(body.preview_id,))
        append_audit(conn,member.org_id,'retention_deleted',{'subject':member.subject,'preview_id':str(body.preview_id),'deleted':deleted,'cutoff':row['cutoff'].isoformat()})
    return {'deleted':deleted}


@router.get('/api/export')
def export_metadata(request: Request):
    member=require_member(request,admin=True)
    with connection(request.app.state.settings,member.org_id) as conn:
        data={'schema_version':1,'org_id':member.org_id,'exported_at':datetime.now(timezone.utc),'settings':read_settings(conn,member.org_id)}
        queries={
            'devices':'SELECT id,org_id,name,hostname,os_version,agent_version,last_seen,queue_depth,revoked_at,monitoring_enabled FROM devices ORDER BY id LIMIT 1001',
            'events':'SELECT event_id,device_id,received_at,payload FROM events ORDER BY received_at,event_id LIMIT 1001',
            'spend':'SELECT id,org_id,payload,created_at FROM spend_records ORDER BY created_at,id LIMIT 1001',
            'audit':'SELECT sequence,kind,metadata,created_at,previous_hash,entry_hash FROM audit_entries ORDER BY sequence LIMIT 1001'}
        for key,query in queries.items():
            rows=conn.execute(query).fetchall()
            if len(rows)>1000:
                raise HTTPException(409,'Export exceeds 1000 rows per section; use a scoped operator export')
            if key=='events':
                # Do not export unexpected content from older/directly written rows.
                allowed={'event_id','timestamp','tool_name','domain','category','vendor','risk_level','source','process_name','evidence_method','confidence'}
                rows=[{**row,'payload':{k:v for k,v in row['payload'].items() if k in allowed}} for row in rows]
            data[key]=rows
    return data


def provision_member(settings,org_id,subject,email,name,role):
    """Operator-only bootstrap with the private migration DSN; never an HTTP action."""
    org_id=str(UUID(str(org_id)))
    if not settings.database_admin_url:
        raise ValueError('Explicit DATABASE_ADMIN_URL is required for operator provisioning')
    if not isinstance(subject,str) or not subject.startswith('auth0|') or not 7<len(subject)<=200:
        raise ValueError('An exact verified Auth0 user subject is required')
    if role not in {'admin','member','viewer'}:
        raise ValueError('Unsupported membership role')
    if not isinstance(email,str) or len(email)>254 or not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+',email):
        raise ValueError('A valid verified user email is required')
    profile=Profile(name=name)
    with psycopg.connect(settings.database_admin_url) as conn:
        if not conn.execute('SELECT 1 FROM organizations WHERE id=%s',(org_id,)).fetchone():
            raise ValueError('Organization must already exist; provisioning cannot invent a tenant')
        existing=conn.execute('SELECT email FROM users WHERE subject=%s',(subject,)).fetchone()
        if existing and existing[0] != email:
            raise ValueError('Existing identity email differs; resolve identity explicitly before provisioning')
        conn.execute('INSERT INTO users(subject,email,name) VALUES(%s,%s,%s) ON CONFLICT(subject) DO NOTHING',(subject,email,profile.name))
        conn.execute('INSERT INTO memberships(org_id,subject,role) VALUES(%s,%s,%s) ON CONFLICT(org_id,subject) DO UPDATE SET role=excluded.role',(org_id,subject,role))
        # The audit helper requires a tenant-scoped non-bypass connection, even for operator actions.
        conn.execute('SET LOCAL ROLE devise_app')
        conn.execute("SELECT set_config('app.org_id',%s,true)",(org_id,))
        from psycopg.rows import dict_row
        conn.row_factory=dict_row
        append_audit(conn,org_id,'membership_provisioned',{'actor':'operator','subject':subject,'role':role})
    return {'org_id':org_id,'subject':subject,'role':role}


def main():
    from api.config import Settings
    parser=argparse.ArgumentParser(description='Operator-only membership provisioning; verify the Auth0 identity and organization before running.')
    parser.add_argument('command',choices=['provision-member'])
    parser.add_argument('--config',type=Path,help='Private database configuration; never upload this file')
    parser.add_argument('--org-id',required=True)
    parser.add_argument('--subject',required=True)
    parser.add_argument('--email',required=True)
    parser.add_argument('--name',required=True)
    parser.add_argument('--role',required=True,choices=['admin','member','viewer'])
    args=parser.parse_args()
    configured=Settings.from_env()
    if args.config:
        values=json.loads(args.config.read_text())
        configured=replace(configured,database_url=values['runtime_dsn'],database_admin_url=values['admin_dsn'])
    result=provision_member(configured,args.org_id,args.subject,args.email,args.name,args.role)
    print(json.dumps(result))


if __name__=='__main__':
    main()
