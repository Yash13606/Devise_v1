import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PilotApi } from "@/lib/pilotApi";
import { ApiFailure } from "./pilotUi";
import { pilotPanel, pilotSelect } from "./pilotFormat";

interface SpendRecord { id?: string; source_id: string; kind: "invoice" | "subscription"; vendor: string; amount_minor: number; currency: string; period_start: string; period_end: string; source: string }
interface SpendTotal { currency: string; period_start: string; period_end: string; amount_minor: number }
interface ImportResult { accepted: number; duplicates: number }
const blankRecord: SpendRecord = { source_id: "", kind: "invoice", vendor: "", amount_minor: 0, currency: "", period_start: "", period_end: "", source: "" };
function money(amount: number, currency: string) {
  try {
    const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency });
    return formatter.format(amount / 10 ** formatter.resolvedOptions().maximumFractionDigits);
  } catch { return `${currency} ${amount} minor units`; }
}

export function PilotSpend({ api, prefix, admin }: { api: PilotApi; prefix: string[]; admin: boolean }) {
  const queryClient = useQueryClient();
  const [csv, setCsv] = useState("");
  const [offset, setOffset] = useState(0);
  const [fileError, setFileError] = useState<Error | null>(null);
  const [record, setRecord] = useState<SpendRecord>({ ...blankRecord });
  const spend = useQuery({ queryKey: [...prefix, "spend", offset], queryFn: ({ signal }) => api.request<{ total: number; records: SpendRecord[]; totals: SpendTotal[]; usage_available: false }>(`/api/spend?limit=200&offset=${offset}`, { signal }), retry: false });
  const invalidate = async () => { await queryClient.invalidateQueries({ queryKey: [...prefix, "spend"] }); };
  const importCsv = useMutation({ mutationFn: () => {
    if (new Blob([csv]).size > 256 * 1024) throw new Error("CSV exceeds the 256 KiB limit");
    return api.request<ImportResult>("/api/spend/import/csv", { method: "POST", body: { csv } });
  }, onSuccess: invalidate });
  const importManual = useMutation({ mutationFn: () => api.request<ImportResult>("/api/spend/import", { method: "POST", body: { records: [record] } }), onSuccess: invalidate });
  return <div className="grid gap-5">
    <section className={pilotPanel}><h2 className="text-lg font-semibold">Measured spend</h2><p className="my-3 text-sm text-slate-400">Imported invoice and subscription amounts, grouped by exact currency and billing period. Usage and verified savings are unavailable.</p>
      {spend.isPending && <p role="status">Loading spend records…</p>}{spend.error && <ApiFailure error={spend.error} retry={() => void spend.refetch()} />}
      {spend.data && <><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{spend.data.totals.map(total => <article key={`${total.currency}-${total.period_start}-${total.period_end}`} className="rounded-lg bg-slate-950 p-4"><p className="text-xs text-slate-400">{total.currency} · {total.period_start} through {total.period_end}</p><p className="mt-3 text-2xl font-semibold">{money(total.amount_minor, total.currency)}</p></article>)}</div>
        {spend.data.records.length === 0 ? <p className="mt-4">No imported spend records</p> : <div className="mt-5 overflow-auto"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr>{["Vendor", "Amount", "Billing period", "Source"].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead><tbody>{spend.data.records.map(item => <tr key={item.id ?? item.source_id} className="border-t border-slate-800"><td className="p-3">{item.vendor}<p className="text-xs text-slate-400">{item.kind}</p></td><td className="p-3 whitespace-nowrap">{money(item.amount_minor, item.currency)} {item.currency}</td><td className="p-3 whitespace-nowrap">{item.period_start} — {item.period_end}</td><td className="p-3">{item.source}<p className="text-xs text-slate-400">ID: {item.source_id}</p></td></tr>)}</tbody></table></div>}
        <div className="mt-4 flex flex-wrap items-center gap-3"><Button variant="outline" disabled={!offset} onClick={() => setOffset(Math.max(0, offset - 200))}>Previous records</Button><span className="text-sm text-slate-400">{spend.data.total} records · totals cover all records</span><Button variant="outline" disabled={offset + 200 >= spend.data.total} onClick={() => setOffset(offset + 200)}>Next records</Button></div>
      </>}
    </section>
    {admin ? <>
      <section className={pilotPanel}><h2 className="text-lg font-semibold">Import CSV</h2><p className="my-3 text-sm text-slate-400">Maximum 100 records and 256 KiB. Stable source IDs make retries idempotent. Amounts use integer minor units (for example, cents for USD).</p><p className="mb-3 overflow-auto font-mono text-xs text-slate-400">source_id,kind,vendor,amount_minor,currency,period_start,period_end,source</p>
        <label className="mb-4 grid gap-2 text-sm">CSV file<Input type="file" accept=".csv,text/csv" onChange={event => {
          const file = event.target.files?.[0]; if (!file) return;
          setFileError(null);
          if (file.size > 256 * 1024) { setFileError(new Error("CSV exceeds the 256 KiB limit")); return; }
          void file.text().then(setCsv).catch(() => setFileError(new Error("Unable to read CSV file")));
        }} /></label>
        {fileError && <p role="alert" className="my-3 text-red-300">{fileError.message}</p>}
        <form className="grid gap-3" onSubmit={event => { event.preventDefault(); importCsv.mutate(); }}><label className="grid gap-2 text-sm">CSV records<Textarea rows={5} value={csv} onChange={event => setCsv(event.target.value)} /></label><Button className="justify-self-start" disabled={!csv.trim() || importCsv.isPending}>{importCsv.isPending ? "Importing…" : "Import CSV"}</Button></form>
        {importCsv.error && <ApiFailure error={importCsv.error} retry={() => importCsv.mutate()} />}{importCsv.data && <p role="status" className="mt-3">Accepted {importCsv.data.accepted} · Duplicates {importCsv.data.duplicates}</p>}
      </section>
      <section className={pilotPanel}><h2 className="text-lg font-semibold">Add invoice or subscription</h2><form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={event => { event.preventDefault(); importManual.mutate(); }}>
        <label className="grid gap-2 text-sm">Record type<select className={pilotSelect} value={record.kind} onChange={event => setRecord({ ...record, kind: event.target.value as SpendRecord["kind"] })}><option value="invoice">Invoice</option><option value="subscription">Subscription</option></select></label>
        {([ ["source_id", "Stable source ID"], ["vendor", "Vendor"], ["source", "Source"], ["currency", "Currency (ISO 4217)"] ] as const).map(([key, label]) => <label className="grid gap-2 text-sm" key={key}>{label}<Input required maxLength={key === "currency" ? 3 : 200} pattern={key === "currency" ? "[A-Z]{3}" : undefined} value={record[key]} onChange={event => setRecord({ ...record, [key]: key === "currency" ? event.target.value.toUpperCase() : event.target.value })} /></label>)}
        <label className="grid gap-2 text-sm">Amount (integer minor units)<Input type="number" required min={0} step={1} max={9000000000000} value={record.amount_minor} onChange={event => setRecord({ ...record, amount_minor: Number(event.target.value) })} /></label>
        <label className="grid gap-2 text-sm">Period start<Input required type="date" value={record.period_start} onChange={event => setRecord({ ...record, period_start: event.target.value })} /></label><label className="grid gap-2 text-sm">Period end<Input required type="date" min={record.period_start} value={record.period_end} onChange={event => setRecord({ ...record, period_end: event.target.value })} /></label>
        <Button className="justify-self-start" disabled={importManual.isPending}>{importManual.isPending ? "Saving…" : "Save spend record"}</Button>
      </form>{importManual.error && <ApiFailure error={importManual.error} retry={() => importManual.mutate()} />}{importManual.data && <p role="status" className="mt-3">Accepted {importManual.data.accepted} · Duplicates {importManual.data.duplicates}</p>}</section>
    </> : <p className="text-sm text-slate-400">Administrator permission is required to import spend records.</p>}
  </div>;
}
