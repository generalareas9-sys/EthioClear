// src/hooks/useAuth.js
// Convenience hook for consuming AuthContext. Throws a clear error if
// used outside an <AuthProvider>, instead of silently returning
// undefined and causing confusing crashes elsewhere.

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>.');
  }
  return context;
}
