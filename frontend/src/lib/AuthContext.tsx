import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { runtimeConfig } from "./runtimeConfig";

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
}

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Main Provider Switcher ────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  if (runtimeConfig.isDemo) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }

  if (!runtimeConfig.isConfigured) {
    const unavailable = () => { throw new Error("Live authentication is not configured."); };
    return <AuthContext.Provider value={{ user: null, session: null, loading: false,
      signIn: unavailable, signUp: unavailable, signOut: async () => {}, isDemoMode: false }}>
      {children}
    </AuthContext.Provider>;
  }

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
