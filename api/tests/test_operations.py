"""Measured operations against the isolated PostgreSQL runtime role, unique fixture tenants."""
from datetime import datetime, timedelta, timezone
from uuid import uuid4
import hashlib
import json
import pytest
import psycopg
from jose import jwt
from fastapi.testclient import TestClient
from api.tests.test_core import settings


@pytest.fixture
def operations(settings):
    from api.manage import migrate
    from api.index import create_app
    migrate(settings)
    orgs = [str(uuid4()), str(uuid4())]
    subjects = ["local|ops-" + str(uuid4()) for _ in range(3)]
    with psycopg.connect(settings.database_admin_url) as conn:
        for org in orgs:
            conn.execute("INSERT INTO organizations(id,name) VALUES(%s,'Operations test')", (org,))
        for i, subject in enumerate(subjects):
            conn.execute("INSERT INTO users(subject,email,name) VALUES(%s,%s,'Operator')", (subject,subject+'@test.invalid'))
            conn.execute("INSERT INTO memberships VALUES(%s,%s,%s)", (orgs[1] if i == 2 else orgs[0],subject,'viewer' if i == 1 else 'admin'))
    app = create_app(settings)
    # The parent owns production factory registration. Exercise missing routes as 404 in RED.
    try:
        from api.spend_routes import router as spend
        from api.operations_routes import router as ops
        for router in (spend, ops):
            if router.routes[0].path not in app.openapi()['paths']:
                app.include_router(router)
                app.openapi_schema = None
    except ModuleNotFoundError:
        pass
    headers = []
    for i, subject in enumerate(subjects):
        token = jwt.encode({'sub':subject,'exp':datetime.now(timezone.utc)+timedelta(minutes=20),'iss':'devise-local','aud':'devise-local-human'},settings.local_auth_secret,algorithm='HS256')
        headers.append({'Authorization':'Bearer '+token,'X-Organization-ID':orgs[1] if i == 2 else orgs[0]})
    try:
        with TestClient(app,base_url='http://127.0.0.1',client=('127.0.0.1',550)) as client:
            yield client, headers, orgs, subjects
    finally:
        # Exact fixture orgs only, on the core fixture's guarded devise_test DSN.
        with psycopg.connect(settings.database_admin_url) as conn:
            fixture_subjects=[r[0] for r in conn.execute('SELECT subject FROM memberships WHERE org_id=ANY(%s::uuid[])',(orgs,)).fetchall()]
            for table in ('audit_entries','executions','policies','policy_versions','retention_previews','spend_records','events','devices','enrollments','memberships'):
                conn.execute('DELETE FROM '+table+' WHERE org_id=ANY(%s::uuid[])',(orgs,))
            conn.execute('DELETE FROM organizations WHERE id=ANY(%s::uuid[])',(orgs,))
            conn.execute('DELETE FROM users WHERE subject=ANY(%s)',(fixture_subjects,))


def record(**overrides):
    return {'source_id':'invoice-1','kind':'invoice','vendor':'Vendor','amount_minor':1234,'currency':'USD','period_start':'2026-09-01','period_end':'2026-09-30','source':'Manual invoice',**overrides}


def test_import_idempotency_conflict_and_atomic_rollback(operations):
    client, (admin, _, beta), *_ = operations
    post = lambda records: client.post('/api/spend/import',headers=admin,json={'records':records})
    assert post([record()]).json() == {'accepted':1,'duplicates':0}
    assert post([record()]).json() == {'accepted':0,'duplicates':1}
    assert post([record(source_id='new'),record(amount_minor=999)]).status_code == 409
    assert len(client.get('/api/spend',headers=admin).json()['records']) == 1
    assert client.get('/api/spend',headers=beta).json()['records'] == []


@pytest.mark.parametrize('changes',[{'amount_minor':-1},{'amount_minor':1.5},{'amount_minor':True},{'amount_minor':'5'},{'currency':'ZZZ'},{'period_end':'2026-08-31'},{'period_start':0},{'source':''},{'role':'admin'}])
def test_import_rejects_unmeasured_or_malformed_records(operations, changes):
    client, (admin, *_), *_ = operations
    assert client.post('/api/spend/import',headers=admin,json={'records':[record(**changes)]}).status_code == 422


def test_totals_never_mix_periods_currencies_and_csv_is_atomic_bounded(operations):
    client, (admin, viewer, _), *_ = operations
    rows=[record(),record(source_id='inr',currency='INR',amount_minor=500),record(source_id='later',period_start='2026-10-01',period_end='2026-10-31',amount_minor=300)]
    assert client.post('/api/spend/import',headers=admin,json={'records':rows}).status_code == 200
    data=client.get('/api/spend',headers=viewer).json()
    assert data['usage_available'] is False
    assert sorted(t['amount_minor'] for t in data['totals']) == [300,500,1234]
    csv='source_id,kind,vendor,amount_minor,currency,period_start,period_end,source\ncsv1,subscription,Vendor,100,USD,2026-09-01,2026-09-30,invoice.csv\ncsv2,invoice,Vendor,-5,USD,2026-09-01,2026-09-30,invoice.csv\n'
    assert client.post('/api/spend/import/csv',headers=admin,json={'csv':csv}).status_code == 422
    assert len(client.get('/api/spend',headers=admin).json()['records']) == 3
    assert client.post('/api/spend/import/csv',headers=admin,json={'csv':csv.replace('-5','5')}).json() == {'accepted':2,'duplicates':0}
    assert client.post('/api/spend/import',headers=viewer,json={'records':[record()]}).status_code == 403
    assert client.post('/api/spend/import/csv',headers=admin,json={'csv':'x'*262145}).status_code == 422
    assert client.post('/api/spend/import',headers=admin,json={'records':[record(source_id=str(i)) for i in range(101)]}).status_code == 422
    too_many=csv.splitlines()[0]+'\n'+'\n'.join([csv.splitlines()[1]]*101)
    assert client.post('/api/spend/import/csv',headers=admin,json={'csv':too_many}).status_code == 422


def test_profile_settings_team_are_persistent_authorized_and_tenant_scoped(operations):
    client, (admin, viewer, beta), orgs, subjects = operations
    settings_body={'retention_days':30,'poll_interval_seconds':15,'heartbeat_interval_seconds':20,'monitoring_enabled':False,'budget_minor':50000,'budget_currency':'USD'}
    assert client.patch('/api/settings',headers=viewer,json=settings_body).status_code == 403
    assert client.patch('/api/settings',headers=admin,json=settings_body).json() == settings_body
    assert client.get('/api/settings',headers=admin).json() == settings_body
    assert client.get('/api/settings',headers=beta).json()['poll_interval_seconds'] == 30
    assert client.patch('/api/settings',headers=admin,json={**settings_body,'retention_days':0}).status_code == 422
    assert client.patch('/api/settings',headers=admin,json={**settings_body,'budget_currency':None}).status_code == 422
    assert client.patch('/api/profile',headers=viewer,json={'name':'Updated Viewer','role':'admin'}).status_code == 422
    assert client.patch('/api/profile',headers=viewer,json={'name':'Updated Viewer'}).json()['name'] == 'Updated Viewer'
    assert client.get('/api/profile',headers=viewer).json()['name'] == 'Updated Viewer'
    team=client.get('/api/team',headers=admin).json()
    assert team['provisioning'] == 'operator_only' and team['invitations_available'] is False
    assert set(m['subject'] for m in team['members']) == set(subjects[:2])
    assert client.get('/api/team',headers={**admin,'X-Organization-ID':orgs[1]}).status_code == 403


def test_retention_only_deletes_captured_expired_tenant_events_and_preserves_audit(operations,settings):
    client, (admin, viewer, beta), orgs, _ = operations
    ids=[uuid4() for _ in range(3)]
    with psycopg.connect(settings.database_admin_url) as conn:
        for i,org in enumerate(orgs):
            device=uuid4()
            conn.execute("INSERT INTO devices(id,org_id,name,token_hash,hostname,os_version,agent_version) VALUES(%s,%s,'PC',%s,'PC','Windows','1')",(device,org,str(uuid4())))
            conn.execute("INSERT INTO events(org_id,event_id,device_id,payload,received_at) VALUES(%s,%s,%s,'{}',now()-interval '40 days')",(org,ids[i],device))
            if i == 0:
                conn.execute("INSERT INTO events(org_id,event_id,device_id,payload) VALUES(%s,%s,%s,'{}')",(org,ids[2],device))
    assert client.post('/api/privacy/retention/preview',headers=viewer,json={}).status_code == 403
    preview=client.post('/api/privacy/retention/preview',headers=admin,json={}).json()
    assert preview['eligible_count'] == 1
    delete={'preview_id':preview['preview_id'],'confirmation':'DELETE EXPIRED EVENTS'}
    assert client.post('/api/privacy/retention/delete',headers=beta,json=delete).status_code == 404
    assert client.post('/api/privacy/retention/delete',headers=admin,json={**delete,'confirmation':'yes'}).status_code == 422
    assert client.post('/api/privacy/retention/delete',headers=admin,json=delete).json() == {'deleted':1}
    assert client.post('/api/privacy/retention/delete',headers=admin,json=delete).status_code == 409
    with psycopg.connect(settings.database_admin_url) as conn:
        assert set(conn.execute('SELECT event_id FROM events WHERE event_id=ANY(%s)',(ids,)).fetchall()) == {(ids[1],),(ids[2],)}
    exported=client.get('/api/export',headers=admin).json()
    assert exported['org_id'] == orgs[0] and exported['spend'] == []
    assert 'token_hash' not in json.dumps(exported)
    assert client.get('/api/export',headers=viewer).status_code == 403
    previous='0'*64
    for entry in exported['audit']:
        assert entry['previous_hash'] == previous
        payload={k:entry[k] for k in ('sequence','kind','metadata','created_at')}
        digest=hashlib.sha256((previous+json.dumps(payload,sort_keys=True,separators=(',',':'),ensure_ascii=True)).encode()).hexdigest()
        assert entry['entry_hash'] == digest
        previous=digest
    assert any(e['kind']=='retention_deleted' for e in exported['audit'])


def test_operations_tables_enforce_rls_and_public_denial(operations,settings):
    client, (admin, _, beta), orgs, _ = operations
    assert client.post('/api/spend/import',headers=admin,json={'records':[record()]}).status_code == 200
    from api.db import connection
    with connection(settings,orgs[1]) as conn:
        assert conn.execute('SELECT count(*) AS n FROM spend_records').fetchone()['n'] == 0
    with pytest.raises(psycopg.errors.InsufficientPrivilege):
        with connection(settings,orgs[1]) as conn:
            conn.execute("INSERT INTO spend_records(id,org_id,source_id,payload) VALUES(%s,%s,'bad','{}')",(uuid4(),orgs[0]))
    with psycopg.connect(settings.database_admin_url) as conn:
        assert conn.execute("SELECT has_table_privilege('public','spend_records','SELECT')").fetchone()[0] is False


def test_operator_provisioning_is_explicit_not_a_tenant_admin_http_escalation(operations,settings):
    client, (admin, _, _), orgs, _ = operations
    from api import operations_routes
    assert hasattr(operations_routes,'provision_member'), 'Operator provisioning is not implemented'
    subject='auth0|ops-'+str(uuid4())
    result=operations_routes.provision_member(settings,orgs[0],subject,subject+'@test.invalid','Provisioned','viewer')
    assert result == {'org_id':orgs[0],'subject':subject,'role':'viewer'}
    assert subject in [m['subject'] for m in client.get('/api/team',headers=admin).json()['members']]
    assert client.post('/api/team',headers=admin,json={'subject':subject,'role':'admin','org_id':orgs[1]}).status_code == 405
    with pytest.raises(ValueError):
        operations_routes.provision_member(settings,orgs[0],'local|bad','bad@test.invalid','Bad','admin')


def test_metadata_export_does_not_leak_unexpected_legacy_event_content(operations,settings):
    client, (admin, _, _), orgs, _ = operations
    with psycopg.connect(settings.database_admin_url) as conn:
        device=uuid4()
        conn.execute("INSERT INTO devices(id,org_id,name,token_hash,hostname,os_version,agent_version) VALUES(%s,%s,'PC',%s,'PC','Windows','1')",(device,orgs[0],str(uuid4())))
        conn.execute("INSERT INTO events(org_id,event_id,device_id,payload) VALUES(%s,%s,%s,%s)",(orgs[0],uuid4(),device,psycopg.types.json.Jsonb({'tool_name':'Known','content':'private legacy prompt','access_token':'private-token'})))
    result=client.get('/api/export',headers=admin)
    assert result.status_code == 200
    assert 'private legacy prompt' not in result.text
    assert 'private-token' not in result.text
    assert result.json()['events'][0]['payload']['tool_name'] == 'Known'
