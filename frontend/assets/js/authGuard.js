/**
 * authGuard.js
 *
 * Guards — import the one that matches the page type:
 *
 * Protected pages (role-enforced):
 *   import { requireRole } from "../../authGuard.js";
 *   await requireRole(["ADMIN"]);           // ADMIN only
 *   await requireRole(["MANAGER"]);         // MANAGER only
 *   await requireRole(["STAFF"]);           // STAFF only
 *   await requireRole(["ADMIN","MANAGER"]); // multiple roles allowed
 *
 * Auth pages (login, register — redirect away if already logged in):
 *   import { requireGuest } from "../../authGuard.js";
 *   await requireGuest();
 */

import { tryRefresh, isLoggedIn, getUser } from "./authContext.js";

// Role → dashboard mapping (single source of truth)
const ROLE_DASHBOARDS = {
  ADMIN:   "/pages/private/admin/dashboard.html",
  MANAGER: "/pages/private/manager/dashboard.html",
  STAFF:   "/pages/private/user/dashboard.html",
};

/**
 * Ensures the current user is authenticated AND has one of the allowed roles.
 * - Not authenticated  → redirect to login
 * - Wrong role         → redirect to their own dashboard
 * Returns the user object on success; never returns on failure.
 *
 * @param {string[]} allowedRoles  e.g. ["ADMIN"]
 */
export async function requireRole(allowedRoles) {
  // 1. Ensure authenticated (try silent refresh on page reload)
  if (!isLoggedIn()) {
    const refreshed = await tryRefresh();
    if (!refreshed) {
      window.location.href = "/pages/auth/login.html";
      return null;
    }
  }

  const user = getUser();

  // 2. Enforce role
  if (!allowedRoles.includes(user.role)) {
    window.location.href = ROLE_DASHBOARDS[user.role] ?? "/pages/auth/login.html";
    return null;
  }

  return user;
}

/**
 * Backward-compatible alias — still works for pages that only need auth,
 * not a specific role check (allows any authenticated role).
 */
export async function requireAuth() {
  return requireRole(Object.keys(ROLE_DASHBOARDS));
}

/**
 * Call at the top of auth page scripts (login, register).
 * If the user is already logged in, redirect them to their role-specific dashboard.
 */
export async function requireGuest() {
  if (isLoggedIn()) {
    const user = getUser();
    window.location.href = ROLE_DASHBOARDS[user.role] ?? "/index.html";
    return;
  }

  // Also check if a valid refresh token cookie exists
  const refreshed = await tryRefresh();
  if (refreshed) {
    const user = getUser();
    window.location.href = ROLE_DASHBOARDS[user.role] ?? "/index.html";
  }
}
