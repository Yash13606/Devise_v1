import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

// A wrapper that only initializes Auth0 if the domain is configured and is not a placeholder.
// This prevents initialization crashes on connection failure with placeholder values.
const SafeAuth0Provider = ({ children }: { children: ReactNode }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
  const isPlaceholder = !domain || domain.includes("placeholder");

  if (isPlaceholder) {
    return <>{children}</>;
  }

  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

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
