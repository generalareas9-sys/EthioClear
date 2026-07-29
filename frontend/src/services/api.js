// src/services/api.js
// Centralized Axios instance. Every API call in the app should import
// this instead of calling axios directly, so auth headers and error
// handling stay consistent everywhere.

import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants.js';

// Base URL points at the EthioClear backend (see backend Module 3 —
// CORS there is configured to allow this frontend's origin).
// Overridable via VITE_API_BASE_URL for different environments.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------
// Request interceptor — automatically attach the JWT access token
// (if one is stored) to every outgoing request.
// ---------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------
// Response interceptor — on a 401 (invalid/expired access token),
// clear stored auth state and send the user back to /login.
//
// Note: this does not attempt silent token refresh yet (no retry with
// the refresh token) — that's left for a later module once the pages
// that consume this are being built. For now it fails safe: any 401
// logs the user out rather than leaving the app in a half-authed state.
// ---------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

      // A full navigation (rather than react-router's navigate) is used
      // here deliberately: this interceptor runs outside any React
      // component, so it has no access to the router context. Reloading
      // to /login also guarantees AuthContext re-initializes cleanly.
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
