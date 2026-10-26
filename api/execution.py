"""Persist intent before bounded HTTP dispatch; ambiguous attempts never auto-retry."""
import base64
from datetime import datetime, timezone, timedelta
import hashlib
import ipaddress
import json
import secrets
from urllib.parse import urlsplit
from uuid import uuid4
import httpx
from cryptography.fernet import Fernet, InvalidToken
from fastapi import HTTPException
from psycopg.types.json import Jsonb
from api.auth import token_hash
from api.db import connection
from api.policy import evaluate_request


# Request content has a short TTL regardless of an attempt's final/uncertain
# status. Executing/unknown records stay non-retryable and result retention is
# deliberately independent. Shared by scoped access and operator maintenance.
EXPIRE_REQUEST_PAYLOAD_SQL="""UPDATE executions
SET status=CASE WHEN status IN ('pending_review','pending_warning') THEN 'expired' ELSE status END,
    payload_cipher=NULL
WHERE expires_at<=now()
  AND (payload_cipher IS NOT NULL OR status IN ('pending_review','pending_warning'))"""


class UnsupportedSSE(ValueError):
    pass


def canonical(value):
    return json.dumps(value,sort_keys=True,separators=(",", ":"),ensure_ascii=True)


def cipher(settings):
    secret=settings.pending_secret or (settings.local_auth_secret if settings.local_enabled else "")
    if len(secret)<32:
        raise HTTPException(503,"Encrypted execution storage is not configured")
    key=base64.urlsafe_b64encode(hashlib.sha256(("devise-pending-v1:"+secret).encode()).digest())
    return Fernet(key)


def encrypt(settings,value):
    return cipher(settings).encrypt(canonical(value).encode()).decode()


def decrypt(settings,value):
    try:
        return json.loads(cipher(settings).decrypt(value.encode()))
    except (InvalidToken,ValueError,TypeError,AttributeError):
        raise HTTPException(409,"Stored execution content cannot be decrypted; execution refused") from None


def append_audit(conn,org_id,kind,metadata):
    conn.execute("SELECT pg_advisory_xact_lock(hashtextextended(%s,47110802))",(str(org_id),))
    previous=conn.execute("SELECT sequence,entry_hash FROM audit_entries WHERE org_id=%s ORDER BY sequence DESC LIMIT 1",(org_id,)).fetchone()
    sequence=previous["sequence"]+1 if previous else 1
    previous_hash=previous["entry_hash"] if previous else "0"*64
    created=datetime.now(timezone.utc).isoformat()
    payload={"sequence":sequence,"kind":kind,"metadata":metadata,"created_at":created}
    digest=hashlib.sha256((previous_hash+canonical(payload)).encode()).hexdigest()
    conn.execute("INSERT INTO audit_entries(org_id,sequence,kind,metadata,created_at,previous_hash,entry_hash) VALUES(%s,%s,%s,%s,%s,%s,%s)",
                 (org_id,sequence,kind,Jsonb(metadata),created,previous_hash,digest))


def policy_snapshot(conn,org_id):
    conn.execute("INSERT INTO policy_versions(org_id) VALUES(%s) ON CONFLICT DO NOTHING",(org_id,))
    version=conn.execute("SELECT version FROM policy_versions WHERE org_id=%s FOR UPDATE",(org_id,)).fetchone()["version"]
    rules=conn.execute("SELECT * FROM policies WHERE enabled=true ORDER BY version,id").fetchall()
    return version,rules


def public_execution(settings,row,continuation_token=None):
    result={"execution_id":str(row["id"]),"decision":row["decision"],"status":row["status"],"policy_version":row["policy_version"]}
    if row.get("result_cipher"):
        result["result"]=decrypt(settings,row["result_cipher"])
    if row["status"]=="pending_review":
        result["review_id"]=str(row["id"])
    if row.get("expires_at") and row["status"] in {"pending_review","pending_warning"}:
        result["expires_at"]=row["expires_at"]
    if continuation_token:
        result["continuation_token"]=continuation_token
    return result


def validate_upstream(settings):
    target=settings.mcp_upstream_url
    parsed=urlsplit(target)
    try:
        address=ipaddress.ip_address(parsed.hostname or "")
        valid=address.is_loopback
    except ValueError:
        valid=False
    # First supported adapter is intentionally loopback HTTP only. No redirects/DNS aliases.
    if not target or parsed.scheme!="http" or not valid or parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path!="/mcp" or not parsed.port:
        raise HTTPException(503,"Exact loopback HTTP MCP upstream /mcp is not configured")
    return target


def execute_new(settings,member,body):
    target=validate_upstream(settings)
    expire_pending(settings,member.org_id)
    digest=hashlib.sha256(canonical(body.rpc).encode()).hexdigest()
    execution_id=uuid4()
    token=None
    with connection(settings,member.org_id) as conn:
        version,policies=policy_snapshot(conn,member.org_id)
        # Serializes same request IDs across separate users and concurrent transport retries.
        conn.execute("SELECT pg_advisory_xact_lock(hashtextextended(%s,47110803))",(str(member.org_id)+str(body.request_id),))
        existing=conn.execute("SELECT * FROM executions WHERE request_id=%s",(body.request_id,)).fetchone()
        if existing:
            if existing["request_hash"]!=digest or existing["subject"]!=member.subject:
                raise HTTPException(409,"Conflicting execution request ID")
            if existing["status"] in {"executing","pending_warning"}:
                raise HTTPException(409,"Request already attempted or warning token was already issued")
            return public_execution(settings,existing)
        decision,transformed,evidence=evaluate_request(body.rpc,policies)
        expires=datetime.now(timezone.utc)+timedelta(minutes=10)
        status={"block":"blocked","review":"pending_review","warn":"pending_warning"}.get(decision,"executing")
        if decision=="warn":
            token="ct_"+secrets.token_urlsafe(48)
        payload=encrypt(settings,transformed) if decision!="block" else None
        conn.execute("INSERT INTO executions(id,org_id,request_id,subject,request_hash,policy_version,decision,status,payload_cipher,token_hash,expires_at) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                     (execution_id,member.org_id,body.request_id,member.subject,digest,version,decision,status,payload,token_hash(token) if token else None,expires))
        append_audit(conn,member.org_id,"decision",{"execution_id":str(execution_id),"decision":decision,"policy_version":version,"request_hash":digest,"actor":member.subject,**evidence})
        row=conn.execute("SELECT * FROM executions WHERE id=%s",(execution_id,)).fetchone()
    if status!="executing":
        return public_execution(settings,row,token)
    return dispatch(settings,member.org_id,row,target)


def continue_pending(settings,member,execution_id=None,token=None,approve=True):
    target=validate_upstream(settings)
    expire_pending(settings,member.org_id)
    with connection(settings,member.org_id) as conn:
        version,_=policy_snapshot(conn,member.org_id)
        if token:
            row=conn.execute("SELECT * FROM executions WHERE token_hash=%s FOR UPDATE",(token_hash(token),)).fetchone()
        else:
            row=conn.execute("SELECT * FROM executions WHERE id=%s FOR UPDATE",(execution_id,)).fetchone()
        if not row:
            raise HTTPException(404,"Pending execution not found")
        expected="pending_warning" if token else "pending_review"
        if row["status"]=="expired":
            raise HTTPException(410,"Pending execution expired")
        if row["status"]!=expected:
            raise HTTPException(409,"Pending execution was already consumed")
        if token and row["subject"]!=member.subject:
            raise HTTPException(403,"Warning continuation belongs to a different subject")
        if row["expires_at"]<=datetime.now(timezone.utc):
            raise HTTPException(410,"Pending execution expired")
        if row["policy_version"]!=version:
            raise HTTPException(409,"Policy changed; submit a new request for evaluation")
        # Decrypt before changing state so unavailable keys cannot consume approval.
        if approve:
            decrypt(settings,row["payload_cipher"])
        status="executing" if approve else "rejected"
        conn.execute("UPDATE executions SET status=%s,payload_cipher=CASE WHEN %s THEN payload_cipher ELSE NULL END WHERE id=%s",(status,approve,row["id"]))
        append_audit(conn,member.org_id,"warning_acknowledged" if token else "review_approved" if approve else "review_rejected",{"execution_id":str(row["id"]),"actor":member.subject})
        row=dict(row,status=status)
    return dispatch(settings,member.org_id,row,target) if approve else public_execution(settings,row)


def expire_pending(settings,org_id):
    """Access-time ciphertext cleanup; operator maintenance sweeps idle tenants."""
    with connection(settings,org_id) as conn:
        rows=conn.execute(EXPIRE_REQUEST_PAYLOAD_SQL+" RETURNING id").fetchall()
        if rows:
            append_audit(conn,org_id,"pending_expired",{"count":len(rows)})
    return len(rows)


def dispatch(settings,org_id,row,target):
    payload=decrypt(settings,row["payload_cipher"])
    status="failed"
    result=None
    try:
        # Caller bearer credentials are deliberately absent from upstream headers.
        with httpx.Client(timeout=httpx.Timeout(5,connect=2),follow_redirects=False,trust_env=False) as client:
            with client.stream("POST",target,json=payload,headers={"Accept":"application/json,text/event-stream"}) as response:
                if not 200<=response.status_code<300:
                    raise ValueError("upstream_error")
                if response.headers.get("Content-Type","").split(";",1)[0].strip().lower()=="text/event-stream":
                    raise UnsupportedSSE("SSE responses are outside the supported JSON adapter")
                content=bytearray()
                for chunk in response.iter_bytes():
                    content.extend(chunk)
                    if len(content)>512*1024:
                        raise ValueError("upstream_response_too_large")
                if response.status_code in {202,204} and not content and payload["method"]=="notifications/initialized":
                    result={"notification_accepted":True}
                else:
                    result=json.loads(content)
                    if not isinstance(result,dict) or result.get("jsonrpc")!="2.0" or result.get("id")!=payload.get("id") or not ("result" in result or "error" in result):
                        raise ValueError("invalid_jsonrpc_response")
                status="succeeded" if "error" not in result else "failed"
    except httpx.TimeoutException:
        status="unknown"
        result={"error":{"code":"upstream_timeout","message":"Upstream outcome is unknown; this request will not be retried"}}
    except UnsupportedSSE:
        result={"error":{"code":"unsupported_sse_response","message":"Upstream returned SSE; this adapter supports JSON responses only and will not retry this request"}}
    except (httpx.HTTPError,ValueError,json.JSONDecodeError):
        result={"error":{"code":"upstream_failure","message":"Upstream failed or returned an invalid response; this request will not be retried"}}
    with connection(settings,org_id) as conn:
        conn.execute("UPDATE executions SET status=%s,result_cipher=%s,payload_cipher=NULL,completed_at=now() WHERE id=%s AND status='executing'",(status,encrypt(settings,result),row["id"]))
        append_audit(conn,org_id,"execution_result",{"execution_id":str(row["id"]),"status":status})
        saved=conn.execute("SELECT * FROM executions WHERE id=%s",(row["id"],)).fetchone()
    return public_execution(settings,saved)
