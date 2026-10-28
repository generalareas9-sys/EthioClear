// src/services/profileService.js
// Profile-related API calls.
//
// BACKEND STATUS (as of Modules 3–8):
// The backend has no GET /profile, PATCH /profile, or PATCH /profile/password
// endpoints — the user's profile is available only via the login response
// (stored in AuthContext/localStorage). The one relevant auth endpoint that
// does exist is POST /auth/logout. There is no password-change route.
//
// This service therefore:
//   - Exports a changePassword() stub that hits the most likely future
//     endpoint (PATCH /auth/password) and surfaces the 404 gracefully.
//   - Does NOT invent fake endpoints.
// The Profile page reads the current user from AuthContext directly.

import api from './api.js';

/**
 * Attempt to change the logged-in user's password.
 * The backend (Modules 1–8) has no password-change endpoint, so this
 * will receive a 404. The Profile page surfaces that with a clear
 * "not available yet" message rather than a broken form.
 */
export async function changePassword({ currentPassword, newPassword }) {
  const response = await api.patch('/auth/password', { currentPassword, newPassword });
  return response.data;
}
