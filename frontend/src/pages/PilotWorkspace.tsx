import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, Shield, Monitor, CreditCard, Settings, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { runtimeConfig } from "@/lib/runtimeConfig";
import { createPilotApi, type Membership, type PilotApi, type PilotProfile, type PilotStats, type PilotDevice, type PilotEvent } from "@/lib/pilotApi";
import { ApiFailure } from "./pilotUi";
import { pilotPanel as panel, pilotSelect as select, pilotDate as date } from "./pilotFormat";
import { PilotGovernance } from "./PilotGovernance";
import { PilotSpend } from "./PilotSpend";
import { PilotSettings } from "./PilotSettings";

const navigation = [
  { name: "Overview", icon: Activity }, { name: "Events", icon: Activity }, { name: "Devices", icon: Monitor },
  { name: "Governance", icon: Shield }, { name: "Spend", icon: CreditCard }, { name: "Settings", icon: Settings },
];

function PilotLogin() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const api = useMemo(() => createPilotApi(runtimeConfig.apiUrl, async () => "", () => ""), []);
  const accounts = useQuery({ queryKey: ["local-accounts"], queryFn: ({ signal }) => api.request<{ accounts: { email: string; name: string }[] }>("/api/local/accounts", { public: true, signal }), retry: false, enabled: runtimeConfig.isLocal });
  const login = useMutation({ mutationFn: (selected: string) => auth.signInLocal(selected) });
  const selected = email || accounts.data?.accounts[0]?.email || "";
  return <main className="pilot-workspace min-h-screen bg-slate-950 p-6 text-slate-100 grid place-items-center">
    <section className={`${panel} w-full max-w-lg`}>
      <p className="text-orange-400">Devise / Windows pilot</p>
      <h1 className="mt-2 text-2xl font-semibold">Sign in to your workspace</h1>
      {runtimeConfig.isLocal ? <>
        <p className="my-4 text-sm text-slate-400">Local development accounts. Sessions and data are served by this machine's API. This login is available only on a loopback development server.</p>
        {accounts.isPending && <p role="status">Connecting to local API…</p>}
        {accounts.error && <ApiFailure error={accounts.error} retry={() => void accounts.refetch()} />}
        {accounts.data && <form onSubmit={event => { event.preventDefault(); login.mutate(selected); }}>
          <label className="grid gap-2">Development account
            <select className={select} value={selected} onChange={event => setEmail(event.target.value)}>
              {accounts.data.accounts.map(account => <option key={account.email} value={account.email}>{account.name} ({account.email})</option>)}
            </select>
          </label>
          {!accounts.data.accounts.length && <p className="my-3">No seeded accounts. Run local setup and retry.</p>}
          <Button className="mt-4" disabled={!selected || login.isPending}>{login.isPending ? "Signing in…" : "Sign in locally"}</Button>
        </form>}
        {login.error && <ApiFailure error={login.error} retry={() => login.mutate(selected)} />}
      </> : <><p className="my-4 text-slate-400">Continue with your organization's configured Auth0 account.</p><Button onClick={auth.signIn}>Sign in with Auth0</Button></>}
    </section>
  </main>;
}

export function PilotWorkspace() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const subject = auth.user?.uid ?? "";
  const [stopped, setStopped] = useState(false);
  useEffect(() => setStopped(false), [subject]);
  const logout = useMutation({ mutationFn: async () => {
    setStopped(true);
    await queryClient.cancelQueries(); queryClient.clear(); await auth.signOut();
  }, onError: () => setStopped(false) });
  // Cancel in-flight reads and remove prior identity data when a session changes or expires.
  useEffect(() => () => { void queryClient.cancelQueries({ queryKey: ["pilot"] }); queryClient.removeQueries({ queryKey: ["pilot"] }); }, [subject, queryClient]);
  if (auth.loading) return <p role="status" className="p-8">Loading your session…</p>;
  if (!auth.user) return <PilotLogin />;
  if (stopped) return <p role="status" className="p-8">Session ended. Signing out…</p>;
  return <><AuthenticatedWorkspace key={subject} onSignOut={() => logout.mutate()} />{logout.error && <ApiFailure error={logout.error} retry={() => logout.mutate()} />}</>;
}

function AuthenticatedWorkspace({ onSignOut }: { onSignOut: () => void }) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [selectedOrg, setSelectedOrg] = useState("");
  const [switching, setSwitching] = useState(false);
  const [tab, setTab] = useState("Overview");
  const organization = useRef("");
  const api = useMemo(() => createPilotApi(runtimeConfig.apiUrl, auth.getAccessToken, () => organization.current, auth.expireSession), [auth.getAccessToken, auth.expireSession]);
  const profile = useQuery({ queryKey: ["pilot", auth.user?.uid, "me"], queryFn: ({ signal }) => api.request<PilotProfile>("/api/me", { unscoped: true, signal }), retry: false });
  const membership = profile.data?.memberships.find(item => item.org_id === selectedOrg) ?? profile.data?.memberships[0];
  organization.current = membership?.org_id ?? "";
  const refresh = useMutation({ mutationFn: async () => {
    await queryClient.cancelQueries({ queryKey: ["pilot"] });
    queryClient.removeQueries({ queryKey: ["pilot"] });
    await auth.refreshSession();
    await profile.refetch();
  } });
  async function changeOrganization(id: string) {
    setSwitching(true);
    await queryClient.cancelQueries({ queryKey: ["pilot", auth.user?.uid, "org"] });
    queryClient.removeQueries({ queryKey: ["pilot", auth.user?.uid, "org"] });
    queryClient.getMutationCache().clear();
    setSelectedOrg(id); setSwitching(false);
  }
  return <div className="pilot-workspace min-h-screen bg-slate-950 text-slate-100">
    <header className="border-b border-slate-800 px-6 py-4 flex flex-wrap items-center gap-4">
      <div className="mr-auto"><p className="text-xl font-bold text-orange-400">devise</p><p className="text-xs text-slate-400">{runtimeConfig.isLocal ? "Local Windows pilot" : "Organization workspace"}</p></div>
      <div className="text-sm"><p>{profile.data?.name ?? auth.user?.displayName}</p><p className="text-slate-400">{profile.data?.email ?? auth.user?.email}</p></div>
      {membership && <label className="grid gap-1 text-xs">Organization<select className={select} value={membership.org_id} disabled={switching} onChange={event => void changeOrganization(event.target.value)}>
        {profile.data?.memberships.map(item => <option key={item.org_id} value={item.org_id}>{item.org_name} · {item.role}</option>)}
      </select></label>}
      <Button variant="outline" disabled={refresh.isPending} onClick={() => refresh.mutate()}><RefreshCw className="mr-2 h-4 w-4" />Refresh session</Button>
      <Button variant="outline" onClick={onSignOut}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
    </header>
    <div className="mx-auto max-w-7xl p-6">
      {refresh.error && <ApiFailure error={refresh.error} retry={() => refresh.mutate()} />}
      {profile.isPending && <p role="status">Connecting to organization API…</p>}
      {profile.error && <ApiFailure error={profile.error} retry={() => void profile.refetch()} />}
      {profile.data && !membership && <section className={panel}><h1 className="text-xl">No organization membership</h1><p className="mt-2 text-slate-400">Ask an operator to provision your membership, then refresh your session.</p></section>}
      {membership && <>
        <nav aria-label="Workspace" className="mb-6 flex flex-wrap gap-2">
          {navigation.map(({ name, icon: Icon }) => <Button key={name} variant={tab === name ? "default" : "ghost"} aria-pressed={tab === name} onClick={() => setTab(name)}><Icon className="mr-2 h-4 w-4" />{name}</Button>)}
        </nav>
        <div className="mb-5 flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold">{tab}</h1><span className="rounded-full bg-slate-800 px-3 py-1 text-xs">{membership.role}</span><p className="ml-auto text-xs text-slate-400">API records · metadata observation · polling every 5 seconds</p></div>
        {switching ? <p role="status">Switching organization…</p> : <OrganizationWorkspace key={membership.org_id} api={api} membership={membership} tab={tab} subject={auth.user?.uid ?? ""} />}
      </>}
    </div>
  </div>;
}

function OrganizationWorkspace({ api, membership, tab, subject }: { api: PilotApi; membership: Membership; tab: string; subject: string }) {
  const prefix = ["pilot", subject, "org", membership.org_id];
  if (tab === "Overview") return <Overview api={api} prefix={prefix} />;
  if (tab === "Events") return <Events api={api} prefix={prefix} />;
  if (tab === "Devices") return <Devices api={api} prefix={prefix} admin={membership.role === "admin"} />;
  if (tab === "Governance") return <PilotGovernance api={api} prefix={prefix} role={membership.role} local={runtimeConfig.isLocal} />;
  if (tab === "Spend") return <PilotSpend api={api} prefix={prefix} admin={membership.role === "admin"} />;
  return <PilotSettings api={api} prefix={prefix} admin={membership.role === "admin"} />;
}

function Overview({ api, prefix }: { api: PilotApi; prefix: string[] }) {
  const stats = useQuery({ queryKey: [...prefix, "stats"], queryFn: ({ signal }) => api.request<PilotStats>("/api/stats", { signal }), retry: false, refetchInterval: 5000 });
  if (stats.isPending) return <p role="status">Loading metrics…</p>;
  if (stats.error) return <ApiFailure error={stats.error} retry={() => void stats.refetch()} />;
  return <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[
    ["Recorded events", stats.data.events], ["Observed tools", stats.data.tools], ["Online devices", stats.data.devices_online], ["Enrolled devices", stats.data.devices_total], ["High risk events", stats.data.high_risk_events],
  ].map(([label, value]) => <Card key={label} className="border-slate-700 bg-slate-900 text-slate-100"><CardHeader><CardTitle className="text-sm font-normal text-slate-400">{label}</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{value}</CardContent></Card>)}</div>
    <p className="mt-6 text-sm text-slate-400">These counts come from the selected organization's API. Observation identifies supported metadata; it does not establish that content was inspected or blocked.</p>
    {stats.data.events === 0 && <section className={`${panel} mt-5`}><h2>No recorded events yet</h2><p className="mt-2 text-slate-400">Enroll a device and start its agent with explicit monitoring consent.</p></section>}
  </>;
}

function Events({ api, prefix }: { api: PilotApi; prefix: string[] }) {
  const [offset, setOffset] = useState(0);
  const events = useQuery({ queryKey: [...prefix, "events", offset], queryFn: ({ signal }) => api.request<{ total: number; events: PilotEvent[] }>(`/api/events?limit=50&offset=${offset}`, { signal }), retry: false, refetchInterval: 5000 });
  return <section className={panel}>
    {events.isPending && <p role="status">Loading recorded events…</p>}
    {events.error && <ApiFailure error={events.error} retry={() => void events.refetch()} />}
    {events.data && <>{events.data.events.length === 0 ? <p>No recorded events</p> : <div className="overflow-auto"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr>{["Time", "Tool / domain", "Risk", "Evidence", "Device"].map(label => <th className="p-3" key={label}>{label}</th>)}</tr></thead><tbody>{events.data.events.map(event => <tr key={event.event_id} className="border-t border-slate-800"><td className="p-3 whitespace-nowrap">{date(event.timestamp)}</td><td className="p-3">{event.tool_name}<p className="text-xs text-slate-400">{event.domain || event.process_name}</p></td><td className="p-3">{event.risk_level}</td><td className="p-3">{event.evidence_method}<p className="text-xs text-slate-400">Confidence {Math.round(event.confidence * 100)}% · {event.source}</p></td><td className="p-3 text-xs">{event.device_id}</td></tr>)}</tbody></table></div>}
      <div className="mt-4 flex items-center gap-4"><Button variant="outline" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - 50))}>Previous</Button><span className="text-sm">{events.data.total} total events</span><Button variant="outline" disabled={offset + 50 >= events.data.total} onClick={() => setOffset(offset + 50)}>Next</Button></div>
    </>}
  </section>;
}

function Devices({ api, prefix, admin }: { api: PilotApi; prefix: string[]; admin: boolean }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const devices = useQuery({ queryKey: [...prefix, "devices"], queryFn: ({ signal }) => api.request<{ devices: PilotDevice[] }>("/api/devices", { signal }), retry: false, refetchInterval: 5000 });
  const enrollment = useMutation({ mutationFn: () => api.request<{ enrollment_token: string; expires_at: string }>("/api/enrollments", { method: "POST", body: { name: name.trim(), expires_in_seconds: 600 } }) });
  const revoke = useMutation({ mutationFn: (id: string) => api.request(`/api/devices/${encodeURIComponent(id)}/revoke`, { method: "POST" }), onSuccess: async () => { setConfirm(""); await queryClient.invalidateQueries({ queryKey: prefix }); } });
  return <div className="grid gap-5">
    <section className={panel}><h2 className="mb-4 text-lg font-semibold">Device enrollment</h2>
      {admin ? <>
        <form className="flex flex-wrap gap-3" onSubmit={event => { event.preventDefault(); enrollment.mutate(); }}><label className="grid gap-2 text-sm">Device name<Input className="border-slate-600 bg-slate-950" value={name} maxLength={120} required onChange={event => setName(event.target.value)} placeholder="Windows workstation" /></label><Button className="self-end" disabled={!name.trim() || enrollment.isPending}>{enrollment.isPending ? "Creating token…" : "Create enrollment token"}</Button></form>
        {enrollment.error && <ApiFailure error={enrollment.error} retry={() => enrollment.mutate()} />}
        {enrollment.data && <div className="mt-4 rounded-lg border border-orange-800 p-4"><p className="font-medium">Single-use enrollment token</p><p className="mt-1 text-sm text-slate-400">Expires {date(enrollment.data.expires_at)}. Copy it into the agent enrollment command on the intended device. This credential is shown only in this session.</p><code className="my-3 block break-all rounded bg-slate-950 p-3 text-sm select-all">{enrollment.data.enrollment_token}</code><Button variant="outline" onClick={() => enrollment.reset()}>Dismiss token</Button></div>}
      </> : <p className="text-slate-400">Administrator permission is required to enroll or revoke devices.</p>}
    </section>
    <section className={panel}><h2 className="mb-4 text-lg font-semibold">Enrolled devices</h2>
      {devices.isPending && <p role="status">Loading devices…</p>}
      {devices.error && <ApiFailure error={devices.error} retry={() => void devices.refetch()} />}
      {revoke.error && <ApiFailure error={revoke.error} retry={() => revoke.mutate(confirm)} />}
      {devices.data?.devices.length === 0 && <p>No enrolled devices</p>}
      {devices.data?.devices.map(device => <article key={device.id} className="flex flex-wrap items-center gap-4 border-t border-slate-800 py-4"><div className="mr-auto"><h3 className="font-semibold">{device.name || device.hostname}</h3><p className="text-sm text-slate-400">{device.hostname} · {device.os_version} · agent {device.agent_version}</p><p className="mt-1 text-xs text-slate-400">Last seen {date(device.last_seen)} · Queue {device.queue_depth} · {device.revoked_at ? "Revoked" : device.monitoring_enabled ? "Monitoring consent enabled" : "Monitoring paused"}</p></div>
        {admin && !device.revoked_at && (confirm === device.id ? <div className="flex gap-2"><Button variant="destructive" disabled={revoke.isPending} onClick={() => revoke.mutate(device.id)}>{revoke.isPending ? "Revoking…" : "Confirm revoke"}</Button><Button variant="outline" disabled={revoke.isPending} onClick={() => setConfirm("")}>Cancel</Button></div> : <Button variant="outline" onClick={() => { revoke.reset(); setConfirm(device.id); }}>Revoke {device.name || device.hostname}</Button>)}
      </article>)}
    </section>
  </div>;
}
