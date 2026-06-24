/**
 * apiFetch.js
 *
 * Drop-in replacement for fetch() on all protected API calls.
 * - Automatically attaches the Authorization: Bearer header
 * - On 401 (expired token), silently refreshes once and retries
 * - On refresh failure, redirects to login
 *
 * Usage:
 *   import { apiFetch } from "../apiFetch.js";
 *   const res = await apiFetch("/users");
 *   const data = await res.json();
 */

import { API_BASE_URL }               from "./config.js";
import { getAccessToken, tryRefresh, logout } from "./authContext.js";

let _isRefreshing = false; // guard against infinite refresh loops

export async function apiFetch(path, options = {}) {
  const url     = `${API_BASE_URL}${path}`;
  const headers = buildHeaders(options.headers);

  const res = await fetch(url, { ...options, headers, credentials: "include" });

  // Token expired — try a silent refresh once, then retry the original request
  if (res.status === 401 && !_isRefreshing) {
    _isRefreshing = true;

    const refreshed = await tryRefresh();
    _isRefreshing   = false;

    if (refreshed) {
      // Retry with the new access token
      const retryHeaders = buildHeaders(options.headers);
      return fetch(url, { ...options, headers: retryHeaders, credentials: "include" });
    }

    // Refresh token also expired — force logout
    await logout();
    return;
  }

  return res;
}

function buildHeaders(extra = {}) {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}
