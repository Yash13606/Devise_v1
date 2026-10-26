import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PilotApi } from "@/lib/pilotApi";
import { ApiFailure } from "./pilotUi";
import { pilotDate, pilotPanel } from "./pilotFormat";

interface SettingsData { retention_days: number; poll_interval_seconds: number; heartbeat_interval_seconds: number; monitoring_enabled: boolean; budget_minor: number | null; budget_currency: string | null }
interface Profile { subject: string; email: string; name: string }
interface RetentionPreview { preview_id: string; eligible_count: number; has_more: boolean; cutoff: string; expires_at: string; confirmation: string }

export function PilotSettings({ api, prefix, admin }: { api: PilotApi; prefix: string[]; admin: boolean }) {
  const queryClient = useQueryClient();
  const [confirmation, setConfirmation] = useState("");
  const [downloadError, setDownloadError] = useState<Error | null>(null);
  const profile = useQuery({ queryKey: [...prefix, "profile"], queryFn: ({ signal }) => api.request<Profile>("/api/profile", { signal }), retry: false });
  const settings = useQuery({ queryKey: [...prefix, "settings"], queryFn: ({ signal }) => api.request<SettingsData>("/api/settings", { signal }), retry: false });
  const team = useQuery({ queryKey: [...prefix, "team"], queryFn: ({ signal }) => api.request<{ members: (Profile & { role: string })[]; provisioning: "operator_only"; invitations_available: false }>("/api/team", { signal }), retry: false });
  const preview = useMutation({ mutationFn: () => api.request<RetentionPreview>("/api/privacy/retention/preview", { method: "POST", body: {} }), onSuccess: () => { setConfirmation(""); deletion.reset(); } });
  const deletion = useMutation({ mutationFn: () => api.request<{ deleted: number }>("/api/privacy/retention/delete", { method: "POST", body: { preview_id: preview.data?.preview_id, confirmation } }), onSuccess: async () => { preview.reset(); setConfirmation(""); await queryClient.invalidateQueries({ queryKey: prefix }); } });
  const exportData = useMutation({ mutationFn: () => api.request<Record<string, unknown>>("/api/export"), onSuccess: data => {
    setDownloadError(null);
    try {
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      const link = document.createElement("a"); link.href = url; link.download = "devise-organization-metadata.json"; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setDownloadError(new Error("Download failed. Retry the metadata export.")); }
  } });
  return <div className="grid gap-5">
    <section className={pilotPanel}><h2 className="text-lg font-semibold">Your profile</h2>
      {profile.isPending && <p role="status">Loading profile…</p>}{profile.error && <ApiFailure error={profile.error} retry={() => void profile.refetch()} />}
      {profile.data && <ProfileEditor key={profile.dataUpdatedAt} api={api} data={profile.data} onSaved={() => queryClient.invalidateQueries({ queryKey: ["pilot"] })} />}
    </section>
    <section className={pilotPanel}><h2 className="text-lg font-semibold">Organization settings</h2><p className="my-3 text-sm text-slate-400">Monitoring remains subject to consent on each device. An enabled setting does not establish that an agent is running.</p>
      {settings.isPending && <p role="status">Loading settings…</p>}{settings.error && <ApiFailure error={settings.error} retry={() => void settings.refetch()} />}
      {settings.data && <SettingsEditor key={settings.dataUpdatedAt} api={api} data={settings.data} admin={admin} onSaved={() => queryClient.invalidateQueries({ queryKey: prefix })} />}
    </section>
    <section className={pilotPanel}><h2 className="text-lg font-semibold">Team memberships</h2><p className="my-3 text-sm text-slate-400">Membership provisioning is an operator action. Email invitations and SSO provisioning are disconnected.</p>
      {team.isPending && <p role="status">Loading memberships…</p>}{team.error && <ApiFailure error={team.error} retry={() => void team.refetch()} />}
      {team.data?.members.map(member => <article className="flex flex-wrap gap-3 border-t border-slate-800 py-3" key={member.subject}><span>{member.name} ({member.email})</span><span className="ml-auto text-slate-400">{member.role}</span></article>)}
      {team.data?.members.length === 0 && <p>No team memberships returned</p>}
    </section>
    {admin ? <section className={pilotPanel}><h2 className="text-lg font-semibold">Privacy operations</h2><p className="my-3 text-sm text-slate-400">Export metadata for this organization, or preview and delete expired event records under its retention setting. A deletion preview captures at most 1,000 events and expires after five minutes.</p>
      <div className="flex flex-wrap gap-3"><Button variant="outline" disabled={exportData.isPending} onClick={() => exportData.mutate()}>{exportData.isPending ? "Exporting…" : "Export organization metadata"}</Button><Button variant="outline" disabled={preview.isPending || deletion.isPending} onClick={() => preview.mutate()}>{preview.isPending ? "Preparing preview…" : "Preview expired events"}</Button></div>
      {exportData.error && <ApiFailure error={exportData.error} retry={() => exportData.mutate()} />}{downloadError && <ApiFailure error={downloadError} retry={() => exportData.mutate()} />}
      {preview.error && <ApiFailure error={preview.error} retry={() => preview.mutate()} />}
      {preview.data && <div className="mt-4 rounded-lg border border-red-900 bg-slate-950 p-4"><p>{preview.data.eligible_count} expired events captured · cutoff {pilotDate(preview.data.cutoff)}</p><p className="my-2 text-sm text-slate-400">Expires {pilotDate(preview.data.expires_at)}.{preview.data.has_more ? " More expired events remain beyond this preview." : ""}</p>
        <form className="grid gap-3" onSubmit={event => { event.preventDefault(); deletion.mutate(); }}><label className="grid gap-2 text-sm">Deletion confirmation<Input value={confirmation} onChange={event => setConfirmation(event.target.value)} placeholder={preview.data.confirmation} autoComplete="off" /></label><p className="text-xs text-slate-400">Type {preview.data.confirmation} to permanently delete only the previewed event records.</p><Button variant="destructive" className="justify-self-start" disabled={confirmation !== preview.data.confirmation || !preview.data.eligible_count || deletion.isPending}>{deletion.isPending ? "Deleting…" : "Delete previewed events"}</Button></form>
      </div>}
      {deletion.error && <ApiFailure error={deletion.error} retry={() => deletion.mutate()} />}{deletion.data && <p role="status" className="mt-4">Deleted {deletion.data.deleted} expired events</p>}
    </section> : <p className="text-sm text-slate-400">Administrator permission is required for organization settings, exports and retention deletion.</p>}
  </div>;
}

function ProfileEditor({ api, data, onSaved }: { api: PilotApi; data: Profile; onSaved: () => Promise<unknown> }) {
  const [name, setName] = useState(data.name);
  const save = useMutation({ mutationFn: () => api.request<Profile>("/api/profile", { method: "PATCH", body: { name: name.trim() } }), onSuccess: onSaved });
  return <><p className="my-3 text-sm text-slate-400">{data.email}</p><form className="flex flex-wrap gap-3" onSubmit={event => { event.preventDefault(); save.mutate(); }}><label className="grid gap-2 text-sm">Your name<Input value={name} maxLength={120} required onChange={event => setName(event.target.value)} /></label><Button className="self-end" disabled={!name.trim() || name === data.name || save.isPending}>{save.isPending ? "Saving…" : "Save profile"}</Button></form>{save.error && <ApiFailure error={save.error} retry={() => save.mutate()} />}</>;
}

function SettingsEditor({ api, data, admin, onSaved }: { api: PilotApi; data: SettingsData; admin: boolean; onSaved: () => Promise<unknown> }) {
  const [draft, setDraft] = useState(data);
  const save = useMutation({ mutationFn: () => api.request<SettingsData>("/api/settings", { method: "PATCH", body: draft }), onSuccess: onSaved });
  return <><form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={event => { event.preventDefault(); save.mutate(); }}>
    {([ ["retention_days", "Retention (days)"], ["poll_interval_seconds", "Agent poll interval (seconds)"], ["heartbeat_interval_seconds", "Heartbeat interval (seconds)"] ] as const).map(([key, label]) => <label className="grid gap-2 text-sm" key={key}>{label}<Input disabled={!admin} type="number" min={key === "retention_days" ? 1 : 5} max={key === "retention_days" ? 3650 : 3600} step={1} required value={draft[key]} onChange={event => setDraft({ ...draft, [key]: Number(event.target.value) })} /></label>)}
    <label className="flex items-center gap-3 text-sm"><input disabled={!admin} type="checkbox" checked={draft.monitoring_enabled} onChange={event => setDraft({ ...draft, monitoring_enabled: event.target.checked })} />Permit consented agent monitoring</label>
    <label className="grid gap-2 text-sm">Budget (optional integer minor units)<Input disabled={!admin} type="number" min={0} step={1} value={draft.budget_minor ?? ""} onChange={event => setDraft({ ...draft, budget_minor: event.target.value === "" ? null : Number(event.target.value), ...(event.target.value === "" ? { budget_currency: null } : {}) })} /></label>
    <label className="grid gap-2 text-sm">Budget currency (ISO 4217)<Input disabled={!admin || draft.budget_minor === null} maxLength={3} pattern="[A-Z]{3}" required={draft.budget_minor !== null} value={draft.budget_currency ?? ""} onChange={event => setDraft({ ...draft, budget_currency: event.target.value.toUpperCase() || null })} /></label>
    {admin && <Button className="justify-self-start" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save organization settings"}</Button>}
  </form>{save.error && <ApiFailure error={save.error} retry={() => save.mutate()} />}</>;
}
