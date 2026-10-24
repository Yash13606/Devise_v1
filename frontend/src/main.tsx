import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";
import { runtimeConfig } from "./lib/runtimeConfig";

// A wrapper that only initializes Auth0 if the domain is configured and is not a placeholder.
// This prevents initialization crashes on connection failure with placeholder values.
const SafeAuth0Provider = ({ children }: { children: ReactNode }) => {
  if (runtimeConfig.isDemo || !runtimeConfig.isConfigured) {
    return <>{children}</>;
  }

  const { authDomain: domain, authClientId: clientId, authAudience: audience } = runtimeConfig;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

createRoot(document.getElementById("root")!).render(
  <SafeAuth0Provider>
    <App />
  </SafeAuth0Provider>
);
