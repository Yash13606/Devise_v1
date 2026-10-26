"""Measured invoice/subscription imports. No inferred usage or currency conversion."""
import csv
import io
import re
from datetime import date
from typing import Annotated, Literal
from uuid import uuid4
from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel, ConfigDict, Field, ValidationError, field_validator, model_validator
from psycopg.types.json import Jsonb
from api.auth import require_member
from api.db import connection
from api.execution import append_audit

router = APIRouter()
# Supported ISO 4217 monetary currencies. Unsupported/unknown codes fail explicitly.
CURRENCIES = frozenset('AED AFN ALL AMD AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BOV BRL BSD BTN BWP BYN BZD CAD CDF CHE CHF CHW CLF CLP CNY COP COU CRC CUP CVE CZK DJF DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GHS GIP GMD GNF GTQ GYD HKD HNL HTG HUF IDR ILS INR IQD IRR ISK JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP LKR LRD LSL LYD MAD MDL MGA MKD MMK MNT MOP MRU MUR MVR MWK MXN MXV MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RON RSD RUB RWF SAR SBD SCR SDG SEK SGD SHP SLE SOS SRD SSP STN SVC SYP SZL THB TJS TMT TND TOP TRY TTD TWD TZS UAH UGX USD USN UYI UYU UYW UZS VED VES VND VUV WST XAF XCD XCG XOF XPF YER ZAR ZMW ZWG'.split())
Text = Annotated[str, Field(min_length=1,max_length=200)]
Minor = Annotated[int, Field(strict=True,ge=0,le=9_000_000_000_000)]


class StrictModel(BaseModel):
    model_config = ConfigDict(extra='forbid',str_strip_whitespace=True)


class SpendRecord(StrictModel):
    source_id: Text
    kind: Literal['invoice','subscription']
    vendor: Text
    amount_minor: Minor
    currency: str
    period_start: date
    period_end: date
    source: Text

    @field_validator('period_start','period_end',mode='before')
    @classmethod
    def explicit_date(cls,value):
        if not isinstance(value,str) or not re.fullmatch(r'[0-9]{4}-[0-9]{2}-[0-9]{2}',value):
            raise ValueError('Billing periods require explicit YYYY-MM-DD dates')
        return value

    @field_validator('currency')
    @classmethod
    def currency_supported(cls,value):
        if value not in CURRENCIES:
            raise ValueError('Unsupported ISO 4217 currency')
        return value

    @model_validator(mode='after')
    def ordered_period(self):
        if self.period_end < self.period_start:
            raise ValueError('period_end must be on or after period_start')
        return self


class SpendImport(StrictModel):
    records: list[SpendRecord] = Field(min_length=1,max_length=100)


class CSVImport(StrictModel):
    csv: str = Field(min_length=1,max_length=262144)


def persist_records(request,member,records):
    accepted = duplicates = 0
    with connection(request.app.state.settings,member.org_id) as conn:
        # Lock one org once so duplicate imports and audit appends share a stable order.
        conn.execute('SELECT pg_advisory_xact_lock(hashtextextended(%s,47110804))',(member.org_id,))
        for record in records:
            payload=record.model_dump(mode='json')
            inserted=conn.execute('INSERT INTO spend_records(id,org_id,source_id,payload) VALUES(%s,%s,%s,%s) ON CONFLICT DO NOTHING RETURNING id',(uuid4(),member.org_id,record.source_id,Jsonb(payload))).fetchone()
            if inserted:
                accepted+=1
            else:
                existing=conn.execute('SELECT payload FROM spend_records WHERE source_id=%s',(record.source_id,)).fetchone()
                if existing['payload'] != payload:
                    raise HTTPException(409,'Conflicting source_id; entire import rolled back')
                duplicates+=1
        if accepted:
            append_audit(conn,member.org_id,'spend_imported',{'subject':member.subject,'accepted':accepted,'duplicates':duplicates})
    return {'accepted':accepted,'duplicates':duplicates}


@router.post('/api/spend/import')
def import_manual(body: SpendImport,request: Request):
    return persist_records(request,require_member(request,admin=True),body.records)


@router.post('/api/spend/import/csv')
def import_csv(body: CSVImport,request: Request):
    member=require_member(request,admin=True)
    if len(body.csv.encode('utf-8')) > 262144:
        raise HTTPException(422,'CSV exceeds 256 KiB')
    columns=set(SpendRecord.model_fields)
    try:
        reader=csv.DictReader(io.StringIO(body.csv,newline=''),strict=True)
        if not reader.fieldnames or set(reader.fieldnames) != columns or len(reader.fieldnames) != len(columns):
            raise ValueError('CSV columns must exactly match the spend record fields')
        records=[]
        for row in reader:
            if len(records) >= 100 or None in row or any(value is None for value in row.values()):
                raise ValueError('CSV must contain 1-100 complete rows')
            amount=row['amount_minor']
            if not re.fullmatch(r'0|[1-9][0-9]{0,12}',amount):
                raise ValueError('amount_minor must be a nonnegative integer')
            row['amount_minor']=int(amount)
            records.append(SpendRecord.model_validate(row))
        if not records:
            raise ValueError('CSV contains no records')
    except (csv.Error,ValueError,ValidationError):
        # Never include invalid cell values/content in logs or error responses.
        raise HTTPException(422,'Invalid CSV: exact columns, 1-100 valid rows, integer amounts and explicit periods/currencies required') from None
    return persist_records(request,member,records)


@router.get('/api/spend')
def spend(request: Request,limit: int=Query(200,ge=1,le=1000),offset: int=Query(0,ge=0,le=1000000)):
    member=require_member(request)
    with connection(request.app.state.settings,member.org_id) as conn:
        rows=conn.execute('SELECT id,org_id,payload,created_at FROM spend_records ORDER BY created_at DESC,id LIMIT %s OFFSET %s',(limit,offset)).fetchall()
        total=conn.execute('SELECT count(*) AS n FROM spend_records').fetchone()['n']
        totals=conn.execute("SELECT payload->>'currency' AS currency,payload->>'period_start' AS period_start,payload->>'period_end' AS period_end,sum((payload->>'amount_minor')::bigint) AS amount_minor FROM spend_records GROUP BY 1,2,3 ORDER BY 1,2,3").fetchall()
    return {'total':total,'records':[{**r['payload'],'id':r['id'],'org_id':r['org_id'],'created_at':r['created_at']} for r in rows],
            'totals':[{**r,'amount_minor':int(r['amount_minor'])} for r in totals],'usage_available':False}
