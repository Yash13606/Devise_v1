import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.tsx";
import "./index.css";

// Fall back to stubs so Auth0Provider never receives undefined.
// With placeholder values the OIDC discovery request fails quickly
// (DNS NXDOMAIN ~100ms) and Auth0 sets isLoading=false, so the
// landing page renders. Replace these in frontend/.env with real creds.
const domain =
  (import.meta.env.VITE_AUTH0_DOMAIN as string) ||
  "dev-placeholder.us.auth0.com";
const clientId =
  (import.meta.env.VITE_AUTH0_CLIENT_ID as string) ||
  "placeholder_client_id";
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience,
    }}
  >
    <App />
  </Auth0Provider>
);
