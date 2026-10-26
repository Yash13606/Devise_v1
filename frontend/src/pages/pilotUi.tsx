import { Button } from "@/components/ui/button";
import { errorMessage } from "./pilotFormat";

export function ApiFailure({ error, retry }: { error: unknown; retry: () => void }) {
  return <div role="alert" className="my-4 rounded-lg border border-red-900 bg-red-950/40 p-4">
    <p>{errorMessage(error)}</p><Button variant="outline" className="mt-3" onClick={retry}>Retry</Button>
  </div>;
}
