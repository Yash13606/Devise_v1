from uuid import uuid4, UUID
from fastapi import APIRouter, Request, HTTPException, Query
from psycopg.types.json import Jsonb
from api.auth import require_member
from api.db import connection
from api.policy import PolicyInput, ExecutionInput, ContinuationInput
from api.execution import policy_snapshot,append_audit,execute_new,continue_pending,expire_pending

router=APIRouter()


@router.get("/api/policies")
def policies(request: Request):
    member=require_member(request)
    with connection(request.app.state.settings,member.org_id) as conn:
        version=conn.execute("SELECT version FROM policy_versions WHERE org_id=%s",(member.org_id,)).fetchone()
        rows=conn.execute("SELECT id,name,rule,version,enabled,created_at FROM policies WHERE enabled=true ORDER BY version,id").fetchall()
    return {"version":version["version"] if version else 0,"policies":[{**row,**row["rule"]} for row in rows]}


@router.post("/api/policies")
def create_policy(body: PolicyInput,request: Request):
    member=require_member(request,admin=True)
    policy_id=uuid4()
    with connection(request.app.state.settings,member.org_id) as conn:
        version,_=policy_snapshot(conn,member.org_id)
        active=conn.execute("SELECT count(*) AS n FROM policies WHERE enabled=true").fetchone()["n"]
        if active>=200:
            raise HTTPException(409,"Organization active policy limit of 200 reached")
        version+=1
        conn.execute("UPDATE policy_versions SET version=%s WHERE org_id=%s",(version,member.org_id))
        conn.execute("INSERT INTO policies(id,org_id,name,rule,version) VALUES(%s,%s,%s,%s,%s)",(policy_id,member.org_id,body.name,Jsonb(body.model_dump(exclude_none=True)),version))
        append_audit(conn,member.org_id,"policy_created",{"policy_id":str(policy_id),"version":version,"outcome":body.outcome,"actor":member.subject})
    return {"id":policy_id,"version":version,**body.model_dump()}


@router.delete("/api/policies/{policy_id}")
def delete_policy(policy_id: UUID,request: Request):
    member=require_member(request,admin=True)
    with connection(request.app.state.settings,member.org_id) as conn:
        version,_=policy_snapshot(conn,member.org_id)
        row=conn.execute("UPDATE policies SET enabled=false WHERE id=%s AND enabled=true RETURNING id",(policy_id,)).fetchone()
        if not row:
            raise HTTPException(404,"Policy not found")
        version+=1
        conn.execute("UPDATE policy_versions SET version=%s WHERE org_id=%s",(version,member.org_id))
        append_audit(conn,member.org_id,"policy_disabled",{"policy_id":str(policy_id),"version":version,"actor":member.subject})
    return {"disabled":True,"version":version}


@router.post("/api/mcp/execute")
def execute(body: ExecutionInput,request: Request):
    member=require_member(request)
    if member.role not in {"admin","member"}:
        raise HTTPException(403,"Viewer cannot execute tools")
    return execute_new(request.app.state.settings,member,body)


@router.post("/api/mcp/continue")
def continuation(body: ContinuationInput,request: Request):
    member=require_member(request)
    if member.role not in {"admin","member"}:
        raise HTTPException(403,"Viewer cannot execute tools")
    return continue_pending(request.app.state.settings,member,token=body.continuation_token)


@router.get("/api/reviews")
def reviews(request: Request,limit:int=Query(200,ge=1,le=1000)):
    member=require_member(request)
    expire_pending(request.app.state.settings,member.org_id)
    with connection(request.app.state.settings,member.org_id) as conn:
        rows=conn.execute("SELECT id AS review_id,subject,decision,status,policy_version,created_at,expires_at FROM executions WHERE decision='review' ORDER BY created_at DESC LIMIT %s",(limit,)).fetchall()
    return {"reviews":rows}


@router.post("/api/reviews/{review_id}/approve")
def approve(review_id: UUID,request: Request):
    member=require_member(request,admin=True)
    return continue_pending(request.app.state.settings,member,execution_id=review_id)


@router.post("/api/reviews/{review_id}/reject")
def reject(review_id: UUID,request: Request):
    member=require_member(request,admin=True)
    return continue_pending(request.app.state.settings,member,execution_id=review_id,approve=False)


@router.get("/api/audit")
def audit(request: Request,limit:int=Query(200,ge=1,le=1000),before_sequence:int | None=Query(None,ge=1,le=9223372036854775807)):
    member=require_member(request)
    with connection(request.app.state.settings,member.org_id) as conn:
        cursor_clause = " WHERE sequence < %s" if before_sequence is not None else ""
        parameters = (before_sequence,limit+1) if before_sequence is not None else (limit+1,)
        rows=conn.execute("SELECT sequence,kind,metadata,created_at,previous_hash,entry_hash FROM audit_entries" + cursor_clause + " ORDER BY sequence DESC LIMIT %s",parameters).fetchall()
    has_more = len(rows) > limit
    entries = rows[:limit]
    return {"entries":entries,"has_more":has_more,"next_before_sequence":entries[-1]["sequence"] if has_more else None,
            "order":"descending","chain_scope":"partial_window"}
