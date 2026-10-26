import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PilotApi } from "@/lib/pilotApi";
import { ApiFailure } from "./pilotUi";
import { pilotDate, pilotPanel, pilotSelect } from "./pilotFormat";

type Outcome = "allow" | "block" | "warn" | "redact" | "review";
interface Policy { id: string; name: string; outcome: Outcome; enabled?: boolean; tool_name?: string; action?: string; text_pattern?: string; replacement?: string; data_class?: "credentials" | "email" }
interface Review { review_id: string; status: string; subject: string; policy_version: number; created_at: string; expires_at: string; decision: string }
interface AuditEntry { sequence: number; kind: string; metadata: Record<string, unknown>; created_at: string; previous_hash: string; entry_hash: string }
interface AuditPage { entries: AuditEntry[]; has_more: boolean; next_before_sequence: number | null; order: "descending"; chain_scope: "partial_window" }
interface Execution { execution_id: string; decision: string; status: string; policy_version: number; result?: unknown; review_id?: string; continuation_token?: string; expires_at?: string }

export function PilotGovernance({ api, prefix, role, local }: { api: PilotApi; prefix: string[]; role: string; local: boolean }) {
  const queryClient = useQueryClient();
  const admin = role === "admin";
  const canExecute = admin || role === "member";
  const [name, setName] = useState("");
  const [outcome, setOutcome] = useState<Outcome>("block");
  const [tool, setTool] = useState("");
  const [action, setAction] = useState("");
  const [pattern, setPattern] = useState("");
  const [dataClass, setDataClass] = useState<"" | "credentials" | "email">("");
  const [replacement, setReplacement] = useState("[REDACTED]");
  const [text, setText] = useState("");
  const [execution, setExecution] = useState<Execution | null>(null);
  const [auditBefore, setAuditBefore] = useState<number | null>(null);
  const fixtureRequest = useRef<{ request_id: string; rpc: { jsonrpc: "2.0"; id: string; method: "tools/call"; params: { name: "echo"; arguments: { text: string } } } } | null>(null);
  const policies = useQuery({ queryKey: [...prefix, "policies"], queryFn: ({ signal }) => api.request<{ version: number; policies: Policy[] }>("/api/policies", { signal }), retry: false });
  const reviews = useQuery({ queryKey: [...prefix, "reviews"], queryFn: ({ signal }) => api.request<{ reviews: Review[] }>("/api/reviews", { signal }), retry: false, refetchInterval: 5000 });
  const audit = useQuery({ queryKey: [...prefix, "audit", auditBefore], queryFn: ({ signal }) => api.request<AuditPage>(`/api/audit${auditBefore === null ? "" : `?before_sequence=${auditBefore}`}`, { signal }), retry: false, refetchInterval: auditBefore === null ? 5000 : false });
  const invalidate = async () => { await queryClient.invalidateQueries({ queryKey: prefix }); };
  const create = useMutation({ mutationFn: () => api.request("/api/policies", { method: "POST", body: {
    name: name.trim(), outcome, ...(tool.trim() ? { tool_name: tool.trim() } : {}), ...(action.trim() ? { action: action.trim() } : {}),
    ...(dataClass ? { data_class: dataClass } : {}),
    ...(pattern.trim() ? { text_pattern: pattern.trim() } : {}), ...(outcome === "redact" ? { replacement } : {}),
  } }), onSuccess: async () => { setName(""); await invalidate(); } });
  const disable = useMutation({ mutationFn: (id: string) => api.request(`/api/policies/${encodeURIComponent(id)}`, { method: "DELETE" }), onSuccess: invalidate });
  const decide = useMutation({ mutationFn: ({ id, approved }: { id: string; approved: boolean }) => api.request(`/api/reviews/${encodeURIComponent(id)}/${approved ? "approve" : "reject"}`, { method: "POST" }), onSuccess: invalidate });
  const execute = useMutation({ mutationFn: () => {
    setExecution(null);
    if (!fixtureRequest.current) throw new Error("Prepare an explicit fixture request first");
    return api.request<Execution>("/api/mcp/execute", { method: "POST", body: fixtureRequest.current });
  }, onSuccess: async result => { setExecution(result); await invalidate(); } });
  const continueWarning = useMutation({ mutationFn: () => api.request<Execution>("/api/mcp/continue", { method: "POST", body: { continuation_token: execution?.continuation_token } }), onSuccess: async result => { setExecution(result); await invalidate(); } });
  return <div className="grid gap-5">
    <section className={pilotPanel}><h2 className="text-lg font-semibold">Organization policies</h2><p className="mt-2 text-sm text-slate-400">Version {policies.data?.version ?? "unavailable"}. Policies apply to the supported request integration. Desktop detections remain observations.</p>
      {policies.isPending && <p role="status" className="mt-4">Loading policies…</p>}
      {policies.error && <ApiFailure error={policies.error} retry={() => void policies.refetch()} />}
      {policies.data?.policies.length === 0 && <p className="mt-4">No policies configured</p>}
      {policies.data?.policies.map(policy => <article className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-700 pt-3" key={policy.id}><div className="mr-auto"><h3 className="font-medium">{policy.name} · {policy.outcome}{policy.enabled === false ? " (disabled)" : ""}</h3><p className="text-sm text-slate-400">Tool {policy.tool_name || "any"} · action {policy.action || "any"} · text {policy.text_pattern || "any"} · data class {policy.data_class || "any"}</p></div>{admin && policy.enabled !== false && <Button variant="outline" disabled={disable.isPending} onClick={() => disable.mutate(policy.id)}>Disable {policy.name}</Button>}</article>)}
      {disable.error && <ApiFailure error={disable.error} retry={() => { if (disable.variables) disable.mutate(disable.variables); }} />}
      {admin ? <form className="mt-5 grid gap-3 border-t border-slate-700 pt-5 sm:grid-cols-2" onSubmit={event => { event.preventDefault(); create.mutate(); }}>
        <label className="grid gap-2 text-sm">Policy name<Input required maxLength={120} value={name} onChange={event => setName(event.target.value)} /></label>
        <label className="grid gap-2 text-sm">Outcome<select className={pilotSelect} value={outcome} onChange={event => setOutcome(event.target.value as Outcome)}>{["allow", "block", "warn", "redact", "review"].map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="grid gap-2 text-sm">Tool name (optional)<Input value={tool} maxLength={120} onChange={event => setTool(event.target.value)} placeholder="echo" /></label>
        <label className="grid gap-2 text-sm">Action (optional)<Input value={action} maxLength={120} onChange={event => setAction(event.target.value)} placeholder="tools/call" /></label>
        <label className="grid gap-2 text-sm">Data class (optional)<select className={pilotSelect} value={dataClass} onChange={event => setDataClass(event.target.value as "" | "credentials" | "email")}><option value="">Any text</option><option value="credentials">Credential patterns</option><option value="email">Email addresses</option></select></label>
        <label className="grid gap-2 text-sm">Literal text to match {outcome === "redact" && !dataClass ? "(required)" : "(optional)"}<Input value={pattern} required={outcome === "redact" && !dataClass} maxLength={256} onChange={event => setPattern(event.target.value)} /></label>
        {outcome === "redact" && <label className="grid gap-2 text-sm">Replacement<Input value={replacement} maxLength={256} onChange={event => setReplacement(event.target.value)} /></label>}
        <p className="text-xs text-slate-400 sm:col-span-2">Fixed text heuristics identify candidate credentials and email addresses in this supported adapter. They do not inspect other apps or guarantee all sensitive data is detected.</p>
        <Button className="justify-self-start" disabled={!name.trim() || (outcome === "redact" && !pattern.trim() && !dataClass) || create.isPending}>{create.isPending ? "Saving policy…" : "Create policy"}</Button>
      </form> : <p className="mt-4 text-sm text-slate-400">Administrator permission is required to change policies.</p>}
      {create.error && <ApiFailure error={create.error} retry={() => create.mutate()} />}
    </section>
    {local && <section className={pilotPanel}><h2 className="text-lg font-semibold">Controlled local MCP fixture</h2><p className="my-3 text-sm text-slate-400">This sends an echo request through the configured policy adapter to an allowlisted loopback test fixture. Requests are denied by default; create an explicit matching allow policy to permit the fixture. It demonstrates this integration only. Execution errors mean the upstream action did not complete successfully.</p>
      {canExecute ? <form className="grid gap-3" onSubmit={event => {
        event.preventDefault(); continueWarning.reset();
        fixtureRequest.current = { request_id: crypto.randomUUID(), rpc: { jsonrpc: "2.0", id: crypto.randomUUID(), method: "tools/call", params: { name: "echo", arguments: { text } } } };
        execute.mutate();
      }}><label className="grid gap-2 text-sm">Fixture text<Textarea value={text} maxLength={10000} onChange={event => setText(event.target.value)} /></label><Button className="justify-self-start" disabled={execute.isPending || continueWarning.isPending}>{execute.isPending ? "Evaluating…" : "Evaluate fixture request"}</Button></form> : <p>Member or administrator permission is required to execute requests.</p>}
      {execute.error && <ApiFailure error={execute.error} retry={() => execute.mutate()} />}
      {execution && <div className="mt-4 rounded-lg bg-slate-950 p-4"><p>Decision: {execution.decision} · Status: {execution.status} · Policy version: {execution.policy_version}</p><p className="mt-1 text-xs text-slate-400">Execution {execution.execution_id}</p>
        {execution.review_id && <p className="mt-2">Administrator review required: {execution.review_id}</p>}
        {execution.continuation_token && <><p className="my-3">Warning requires acknowledgement. Expires {pilotDate(execution.expires_at)}.</p><Button disabled={continueWarning.isPending} onClick={() => continueWarning.mutate()}>{continueWarning.isPending ? "Continuing…" : "Acknowledge warning and continue"}</Button></>}
        {execution.result !== undefined && <pre className="mt-3 overflow-auto whitespace-pre-wrap break-all text-xs">{JSON.stringify(execution.result, null, 2)}</pre>}
      </div>}
      {continueWarning.error && <ApiFailure error={continueWarning.error} retry={() => continueWarning.mutate()} />}
    </section>}
    <section className={pilotPanel}><h2 className="text-lg font-semibold">Review queue</h2>
      {reviews.isPending && <p role="status">Loading reviews…</p>}{reviews.error && <ApiFailure error={reviews.error} retry={() => void reviews.refetch()} />}
      {reviews.data?.reviews.length === 0 && <p className="mt-3 text-slate-400">No pending reviews</p>}
      {reviews.data?.reviews.map(review => <article key={review.review_id} className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-700 pt-3"><div className="mr-auto"><p>{review.status} · {review.review_id}</p><p className="text-xs text-slate-400">Expires {pilotDate(review.expires_at)} · {review.subject} · policy {review.policy_version}</p></div>{admin && review.status === "pending_review" && <><Button disabled={decide.isPending} onClick={() => decide.mutate({ id: review.review_id, approved: true })}>Approve and execute</Button><Button variant="outline" disabled={decide.isPending} onClick={() => decide.mutate({ id: review.review_id, approved: false })}>Reject</Button></>}</article>)}
      {decide.error && <ApiFailure error={decide.error} retry={() => { if (decide.variables) decide.mutate(decide.variables); }} />}
    </section>
    <section className={pilotPanel}><h2 className="text-lg font-semibold">Audit records</h2><p className="mt-2 text-sm text-slate-400">Persisted decision and execution metadata from the organization API.</p>
      <p className="mt-2 text-sm text-slate-400">Newest first. This page is partial history; original sequence and hashes are preserved. Use metadata export for a complete chain within its export limit.</p>
      <div className="mt-3 flex gap-3"><Button variant="outline" disabled={audit.isFetching} onClick={() => { if (auditBefore === null) void audit.refetch(); else setAuditBefore(null); }}>Latest records</Button><Button variant="outline" disabled={audit.isFetching || !audit.data?.has_more || audit.data.next_before_sequence == null} onClick={() => { if (audit.data?.next_before_sequence != null) setAuditBefore(audit.data.next_before_sequence); }}>Older records</Button></div>
      {audit.isPending && <p role="status">Loading audit records…</p>}{audit.error && <ApiFailure error={audit.error} retry={() => void audit.refetch()} />}
      {audit.data?.entries.length === 0 && <p className="mt-3 text-slate-400">No audit records</p>}
      {audit.data?.entries.map(entry => <details key={entry.entry_hash} className="mt-3 rounded-lg bg-slate-950 p-3"><summary className="cursor-pointer text-sm">#{entry.sequence} {entry.kind} · {pilotDate(entry.created_at)}</summary><pre className="mt-3 overflow-auto whitespace-pre-wrap break-all text-xs">{JSON.stringify(entry, null, 2)}</pre></details>)}
    </section>
  </div>;
}
