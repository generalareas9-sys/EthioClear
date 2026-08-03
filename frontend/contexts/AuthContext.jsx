// src/contexts/AuthContext.jsx
// Authentication context — the single source of truth for "who is
// logged in" across the app. Provides login(), register(), logout(),
// currentUser, isAuthenticated, and loading.
//
// login()/register()/logout() call the real backend endpoints
// (backend Module 4). The Login and Register pages (frontend Module 2)
// call these functions directly rather than talking to Axios themselves.

import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export const AuthContext = createContext(undefined);

function readStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // Corrupted/unexpected localStorage content — treat as logged out.
    return null;
  }
}

function clearAuthStorage() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  // Starts true: on first mount we synchronously check localStorage
  // for a previous session before the app decides what to render.
  const [loading, setLoading] = useState(true);

  // Hydrate auth state from localStorage on first load. There is no
  // backend "whoami" endpoint yet to revalidate the token against, so
  // this trusts the locally stored token/user until either a request
  // gets a 401 (see services/api.js) or the user logs out.
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUser = readStoredUser();

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setCurrentUser(storedUser);
    }
    setLoading(false);
  }, []);

  /**
   * Logs in against the backend and persists the resulting session.
   * Throws on failure (invalid credentials, network error, etc.) —
   * callers (a future Login page) are responsible for catching this
   * and showing an error to the user.
   */
  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken: newAccessToken, refreshToken } = response.data.data;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    setAccessToken(newAccessToken);
    setCurrentUser(user);

    return user;
  }, []);

  /**
   * Registers a new applicant account against the backend. Does not
   * log the user in — the backend's /auth/register endpoint only
   * creates the account (see backend Module 4), it doesn't return
   * tokens. Callers should redirect to /login on success.
   * Throws on failure (duplicate email, validation errors, etc.).
   */
  const register = useCallback(async ({ fullName, email, phoneNumber, password }) => {
    const response = await api.post('/auth/register', { fullName, email, phoneNumber, password });
    return response.data.data.user;
  }, []);

  /**
   * Logs out: revokes the refresh token server-side (best effort —
   * network/API errors here are swallowed since the user is logging
   * out regardless) and clears all local session state.
   */
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch {
      // Ignore — we clear local state regardless of whether the
      // server call succeeded, so the user is never "stuck" logged in.
    } finally {
      clearAuthStorage();
      setAccessToken(null);
      setCurrentUser(null);
    }
  }, []);

  const value = {
    currentUser,
    accessToken,
    isAuthenticated: Boolean(accessToken && currentUser),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
