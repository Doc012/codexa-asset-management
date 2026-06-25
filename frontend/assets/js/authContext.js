// import { API_AUTH_URL } from "./config.j";

const SESSION_TOKEN_KEY = "aq_access_token";
const SESSION_USER_KEY  = "aq_user";

const _state = {
  accessToken: sessionStorage.getItem(SESSION_TOKEN_KEY) ?? null,
  user: JSON.parse(sessionStorage.getItem(SESSION_USER_KEY) ?? "null"),
};

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

export function getAccessToken() {
  return _state.accessToken;
}

export function getUser() {
  return _state.user;
}

export function isLoggedIn() {
  return _state.accessToken !== null;
}

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

export async function logout() {
  if (_state.accessToken) {
    await fetch(`${API_AUTH_URL}/logout`, {
      method: "GET",
      headers: { Authorization: `Bearer ${_state.accessToken}` },
      credentials: "include",
    }).catch(() => {});
  }

  _clearSession();

  window.location.href = "/pages/auth/login.html";
}

export async function tryRefresh() {
  if (_state.accessToken) return true;

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

export async function register(firstName, lastName, email, password, department) {
  const res = await fetch(`${API_AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ firstName, lastName, email, password, department }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Registration failed.");

  return data; 
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_AUTH_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Request failed.");

  return data;
}

export async function resetPassword(token, newPassword) {
  const res = await fetch(`${API_AUTH_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Reset failed.");

  return data;
}

export async function verifyEmail(token) {
  const res = await fetch(`${API_AUTH_URL}/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Email verification failed.");

  return data;
}
