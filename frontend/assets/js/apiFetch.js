import { API_BASE_URL }               from "./config.js";
import { getAccessToken, tryRefresh, logout } from "./authContext.js";

let _isRefreshing = false;

export async function apiFetch(path, options = {}) {
  const url     = `${API_BASE_URL}${path}`;
  const headers = buildHeaders(options.headers);

  const res = await fetch(url, { ...options, headers, credentials: "include" });

  if (res.status === 401 && !_isRefreshing) {
    _isRefreshing = true;

    const refreshed = await tryRefresh();
    _isRefreshing   = false;

    if (refreshed) {
      const retryHeaders = buildHeaders(options.headers);
      return fetch(url, { ...options, headers: retryHeaders, credentials: "include" });
    }

    await logout();
    return;
  }

  return res;
}

function buildHeaders(extra = {}, body) {
  const token = getAccessToken();
  return {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}
