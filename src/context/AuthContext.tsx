"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  user: any;
  token: string | null;
}

export interface AuthContextType {
  user: User | null;
  userId: string | null;
  token: string | null;

  registerUser: (payload: AuthPayload | { user: any; token?: string }) => void;
  loginUser: (payload: AuthPayload) => void;
  logoutUser: () => void;

  getUserData: () => Record<string, any>;
  updateUserData: (updates: Record<string, any>) => void;
  clearUserData: () => void;

  getLinksData: () => any[];
  addLinkToCache: (link: any) => void;
  updateLinkInCache: (linkId: string, updates: any) => void;
  removeLinkFromCache: (linkId: string) => void;
}

const KEY_USER = "user";
const KEY_USER_ID = "userId";
const KEY_TOKEN = "auth_token";

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

const isLocal = typeof window !== "undefined";

const userStorageKey = (id: string) => `user-data-${id}`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const normalizeUser = (u: any): User | null => {
    if (!u) return null;
    return { ...u, id: u.id || u._id };
  };

  // ──────────────────────────────────────────────────────────────
  // STATE
  // ──────────────────────────────────────────────────────────────

  const [user, setUser] = useState<User | null>(() => {
    if (!isLocal) return null;
    try {
      const saved = localStorage.getItem(KEY_USER);
      return saved ? normalizeUser(JSON.parse(saved)) : null;
    } catch {
      return null;
    }
  });

  const [userId, setUserId] = useState<string | null>(() => {
    if (!isLocal) return null;
    return localStorage.getItem(KEY_USER_ID);
  });

  const [token, setToken] = useState<string | null>(() => {
    if (!isLocal) return null;
    return localStorage.getItem(KEY_TOKEN);
  });

  const [userData, setUserData] = useState<Record<string, any>>({});

  // ──────────────────────────────────────────────────────────────
  // LOAD USER-SPECIFIC STORAGE
  // ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLocal || !user?.id) return;

    try {
      const raw = localStorage.getItem(userStorageKey(user.id));
      setUserData(raw ? JSON.parse(raw) : {});
    } catch {
      setUserData({});
    }
  }, [user?.id]);

  // ──────────────────────────────────────────────────────────────
  // PERSIST GLOBAL AUTH STATE
  // ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLocal) return;

    try {
      user
        ? localStorage.setItem(KEY_USER, JSON.stringify(user))
        : localStorage.removeItem(KEY_USER);

      userId
        ? localStorage.setItem(KEY_USER_ID, userId)
        : localStorage.removeItem(KEY_USER_ID);

      token
        ? localStorage.setItem(KEY_TOKEN, token)
        : localStorage.removeItem(KEY_TOKEN);
    } catch {}
  }, [user, userId, token]);

  

  const getUserData = () => userData;

  const updateUserData = (updates: Record<string, any>) => {
    const merged = { ...userData, ...updates };
    setUserData(merged);

    if (isLocal && user?.id) {
      try {
        localStorage.setItem(userStorageKey(user.id), JSON.stringify(merged));
      } catch {}
    }
  };

  const clearUserData = () => {
    setUserData({});
    if (isLocal && user?.id) {
      try {
        localStorage.removeItem(userStorageKey(user.id));
      } catch {}
    }
  };

  
  const registerUser = (payload: any) => {
    const incomingUser = normalizeUser(payload.user);
    const incomingToken = payload.token ?? null;

    if (!incomingUser) return;

    setUser(incomingUser);
    setUserId(incomingUser.id);
    setToken(incomingToken);
  };

  const loginUser = (payload: AuthPayload) => {
    const normalized = normalizeUser(payload.user);
    if (!normalized) return;

    setUser(normalized);
    setUserId(normalized.id);
    setToken(payload.token);
  };

  const logoutUser = () => {
    setUser(null);
    setUserId(null);
    setToken(null);
    clearUserData();

    if (!isLocal) return;

    localStorage.removeItem(KEY_USER);
    localStorage.removeItem(KEY_USER_ID);
    localStorage.removeItem(KEY_TOKEN);
  };


  const getLinksData = () => userData.links || [];

  const addLinkToCache = (link: any) => {
    updateUserData({ links: [...getLinksData(), link] });
  };

  const updateLinkInCache = (linkId: string, updates: any) => {
    const updated = getLinksData().map((l: any) =>
      l.id === linkId ? { ...l, ...updates } : l
    );
    updateUserData({ links: updated });
  };

  const removeLinkFromCache = (linkId: string) => {
    updateUserData({
      links: getLinksData().filter((l: any) => l.id !== linkId),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        token,
        registerUser,
        loginUser,
        logoutUser,
        getUserData,
        updateUserData,
        clearUserData,
        getLinksData,
        addLinkToCache,
        updateLinkInCache,
        removeLinkFromCache,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
