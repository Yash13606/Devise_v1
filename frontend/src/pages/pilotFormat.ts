export const pilotPanel = "rounded-xl border border-slate-700 bg-slate-900 p-5";
export const pilotSelect = "rounded-md border border-slate-600 bg-slate-950 p-2 text-slate-100";
export const pilotDate = (value: string | null | undefined) => value ? new Date(value).toLocaleString() : "Not yet reported";
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : "The request failed. Retry when the API is available.";
