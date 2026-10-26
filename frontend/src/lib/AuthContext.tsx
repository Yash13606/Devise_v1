import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { runtimeConfig } from "./runtimeConfig";
import { createPilotApi, PilotApiError } from "./pilotApi";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  session: AuthUser | null;
  loading: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => Promise<void>;
  isDemoMode: boolean;
  getAccessToken: () => Promise<string>;
  signInLocal: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  expireSession: () => void;
}

const unavailableToken = async (): Promise<string> => { throw new Error("No authenticated API session"); };
const unavailableLocal = async () => { throw new Error("Local login is unavailable in this mode"); };
const noSession = { getAccessToken: unavailableToken, signInLocal: unavailableLocal, refreshSession: unavailableLocal, expireSession: () => {} };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Mock Provider for Local Development ───────────────────────────────────

const MOCK_USER: AuthUser = {
  uid: "mock-user-12345",
  email: "demo@devise.security",
  displayName: "Demo Administrator",
  photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=demo",
};

function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("devise_mock_user");
    // Default to pre-authenticated for seamless first-load developer experience
    if (saved === "none") return null;
    try { return saved ? JSON.parse(saved) : MOCK_USER; }
    catch { return MOCK_USER; }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const signIn = () => {
    localStorage.setItem("devise_mock_user", JSON.stringify(MOCK_USER));
    setUser(MOCK_USER);
  };

  const signUp = () => {
    localStorage.setItem("devise_mock_user", JSON.stringify(MOCK_USER));
    setUser(MOCK_USER);
  };

  const signOut = async () => {
    localStorage.setItem("devise_mock_user", "none");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: user,
        loading,
        signIn,
        signUp,
        signOut,
        isDemoMode: true,
        ...noSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Real Provider for Production (Auth0) ───────────────────────────────────

function RealAuthProvider({ children }: { children: ReactNode }) {
  const {
    user: auth0User,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Map Auth0 user to the shape the rest of the app expects
  const user: AuthUser | null = auth0User
    ? {
        uid: auth0User.sub ?? "",
        email: auth0User.email ?? null,
        displayName: auth0User.name ?? auth0User.nickname ?? null,
        photoURL: auth0User.picture ?? null,
      }
    : null;

  const signIn = () => {
    loginWithRedirect();
  };

  const signUp = () => {
    loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
  };

  const signOut = async () => {
    logout({
      logoutParams: { returnTo: window.location.origin },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: user,
        loading: isLoading,
        signIn,
        signUp,
        signOut,
        isDemoMode: false,
        getAccessToken: () => getAccessTokenSilently(),
        signInLocal: unavailableLocal,
        refreshSession: async () => { await getAccessTokenSilently({ cacheMode: "off" }); },
        expireSession: () => { void loginWithRedirect(); },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const session = useRef<{ token: string; expires: number; email: string } | null>(null);
  const [expiry, setExpiry] = useState(0);
  const expireSession = useCallback(() => { session.current = null; setUser(null); setExpiry(0); }, []);
  const signInLocal = useCallback(async (email: string) => {
    // This endpoint is deliberately restricted by runtime configuration and by the backend.
    expireSession();
    const api = createPilotApi(runtimeConfig.apiUrl, unavailableToken, () => "");
    const result = await api.request<{ access_token: string; expires_in: number }>("/api/local/session", {
      method: "POST", body: { email }, public: true,
    });
    if (!result.access_token || !Number.isFinite(result.expires_in) || result.expires_in <= 0) throw new PilotApiError("Invalid local session", 401);
    const expires = Date.now() + result.expires_in * 1000;
    session.current = { token: result.access_token, expires, email };
    setExpiry(expires);
    setUser({ uid: email, email, displayName: email, photoURL: null });
  }, [expireSession]);
  useEffect(() => {
    if (!expiry) return;
    const timer = setTimeout(expireSession, Math.max(0, expiry - Date.now()));
    return () => clearTimeout(timer);
  }, [expiry, expireSession]);
  const getAccessToken = useCallback(async () => {
    if (!session.current || session.current.expires <= Date.now()) {
      expireSession(); throw new PilotApiError("Session expired. Sign in again.", 401);
    }
    return session.current.token;
  }, [expireSession]);
  return <AuthContext.Provider value={{ user, session: user, loading: false, isDemoMode: false,
    signIn: () => {}, signUp: () => {}, signOut: async () => expireSession(), expireSession,
    getAccessToken, signInLocal,
    refreshSession: async () => { const email = session.current?.email; if (email) await signInLocal(email); else throw new Error("Sign in again"); },
  }}>{children}</AuthContext.Provider>;
}

// ─── Main Provider Switcher ────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  if (runtimeConfig.isDemo) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }

  if (!runtimeConfig.isConfigured) {
    const unavailable = () => { throw new Error("Live authentication is not configured."); };
    return <AuthContext.Provider value={{ user: null, session: null, loading: false,
      signIn: unavailable, signUp: unavailable, signOut: async () => {}, isDemoMode: false, ...noSession }}>
      {children}
    </AuthContext.Provider>;
  }

  if (runtimeConfig.isLocal) return <LocalAuthProvider>{children}</LocalAuthProvider>;

  return <RealAuthProvider>{children}</RealAuthProvider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
