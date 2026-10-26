import { Link, useLocation } from "react-router-dom";
import { runtimeConfig, liveDataMessage } from "@/lib/runtimeConfig";
import type { ReactNode } from "react";

export function SetupRequired({ feature }: { feature?: string } = {}) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center p-6">
      <section className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-8">
        <p className="text-sm font-semibold text-orange-400">Devise pilot</p>
        <h1 className="mt-2 text-2xl font-bold">{feature ?? (runtimeConfig.isConfigured ? "Live monitoring is not connected" : "Live configuration is required")}</h1>
        <p className="mt-4 text-slate-300">{feature ? "This preview does not run scans or change files. You can return to the website or browse the read-only dashboard." : liveDataMessage}</p>
        {runtimeConfig.issues.length > 0 && <>
          <p className="mt-5 text-sm">Missing or invalid settings:</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
            {runtimeConfig.issues.map(key => <li key={key}>{key}</li>)}
          </ul>
        </>}
        <p className="mt-5 text-sm text-slate-400">For a read-only UI preview, follow the demo setup in the project README. No device monitoring runs in demo mode.</p>
        <Link to="/" className="mt-6 inline-block text-orange-300 underline">Return to the website</Link>
      </section>
    </main>
  );
}

export function ReadOnlyPreview({ children }: { children: ReactNode }) {
  if (!runtimeConfig.isDemo) return <>{children}</>;
  return <fieldset disabled className="min-w-0 border-0 p-0"
    onClickCapture={event => { event.preventDefault(); event.stopPropagation(); }}
    onSubmitCapture={event => { event.preventDefault(); event.stopPropagation(); }}>
    <legend className="mb-4 text-sm text-amber-800">Read-only preview. No changes are saved or executed.</legend>
    {children}
  </fieldset>;
}

export function PreviewNotice() {
  const { pathname } = useLocation();
  if (!runtimeConfig.isDemo && (runtimeConfig.isLocal || /^\/(dashboard|mcp|login|signup)(\/|$)/.test(pathname))) return null;
  return <aside role="status" className="fixed bottom-4 right-4 z-[100] max-w-sm rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-lg">
    {runtimeConfig.isDemo
      ? "Demo preview — read-only sample screens. No live monitoring or saved changes."
      : "Pilot preview — product illustrations and sample metrics are not verified customer results."}
  </aside>;
}
