/**
 * authContext.js
 *
 * The single source of truth for authentication state.
 * - Access token is kept in memory AND mirrored to sessionStorage so it
 *   survives page navigations within the same tab (cleared when tab closes).
 * - User object is mirrored to sessionStorage alongside the token.
 *
 * Every other JS file imports from here. Nothing else stores or reads tokens.
 */

import { API_AUTH_URL } from "./config.js";

const SESSION_TOKEN_KEY = "aq_access_token";
const SESSION_USER_KEY  = "aq_user";

// ── Private state ─────────────────────────────────────────────────────────────
const _state = {
  // Restore from sessionStorage on module load (handles page-navigation reloads)
  accessToken: sessionStorage.getItem(SESSION_TOKEN_KEY) ?? null,
  user: JSON.parse(sessionStorage.getItem(SESSION_USER_KEY) ?? "null"),
};

// ── Internal helpers ──────────────────────────────────────────────────────────

function _setSession(accessToken, user) {
  _state.accessToken = accessToken;
  _state.user        = user;
  sessionStorage.setItem(SESSION_TOKEN_KEY, accessToken);
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
}

function _clearSession() {
  _state.accessToken = null;
  _state.user        = null;
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
}

// ── Getters ───────────────────────────────────────────────────────────────────

export function getAccessToken() {
  return _state.accessToken;
}

export function getUser() {
  return _state.user;
}

export function isLoggedIn() {
  return _state.accessToken !== null;
}

// ── Login ─────────────────────────────────────────────────────────────────────

/**
 * Sends credentials to the backend.
 * On success, stores the access token in memory and returns the user object.
 * The refresh token is stored automatically in an httpOnly cookie by the server.
 *
 * @throws {Error} with a human-readable message on failure
 */
export async function login(email, password) {
  const res = await fetch(`${API_AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // required — lets the browser store the httpOnly cookie
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || "Invalid email or password.");
  }

  const data = await res.json();
  _setSession(data.accessToken, data.user);

  return data.user;
}

// ── Logout ────────────────────────────────────────────────────────────────────

/**
 * Tells the backend to blacklist the current access token and clear the
 * refresh token cookie, then wipes local state.
 */
export async function logout() {
  if (_state.accessToken) {
    await fetch(`${API_AUTH_URL}/logout`, {
      method: "GET",
      headers: { Authorization: `Bearer ${_state.accessToken}` },
      credentials: "include",
    }).catch(() => {}); // fire-and-forget — clear local state regardless
  }

  _clearSession();

  window.location.href = "/pages/auth/login.html";
}

// ── Silent refresh ────────────────────────────────────────────────────────────

/**
 * Called on every protected page load.
 * Uses the httpOnly cookie to silently get a new access token.
 * Returns true if the user is (or becomes) authenticated, false if not.
 */
export async function tryRefresh() {
  // If the token is already in memory (or restored from sessionStorage), no
  // need to hit the network — the module init already loaded it.
  if (_state.accessToken) return true;

  // Fall back to the httpOnly-cookie refresh flow (if backend supports it)
  try {
    const res = await fetch(`${API_AUTH_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();
    _setSession(data.accessToken, data.user);

    return true;
  } catch {
    return false;
  }
}

// ── Register ──────────────────────────────────────────────────────────────────

export async function register(firstName, lastName, email, password) {
  const res = await fetch(`${API_AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Registration failed.");

  return data; // { message: "Registration successful..." }
}

// ── Forgot password ───────────────────────────────────────────────────────────

export async function forgotPassword(email) {
  const res = await fetch(`${API_AUTH_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Request failed.");

  return data; // { message: "If an account with that email exists..." }
}

// ── Reset password ────────────────────────────────────────────────────────────

export async function resetPassword(token, newPassword) {
  const res = await fetch(`${API_AUTH_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Reset failed.");

  return data; // { message: "Password has been reset successfully." }
}

// ── Verify email ──────────────────────────────────────────────────────────────

/**
 * Verifies a user's email address using the token from the verification link.
 * Calls GET /api/v1/auth/verify-email?token=...
 *
 * @throws {Error} with a human-readable message on failure
 */
export async function verifyEmail(token) {
  const res = await fetch(`${API_AUTH_URL}/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Email verification failed.");

  return data; // { message: "Email verified successfully." }
}
