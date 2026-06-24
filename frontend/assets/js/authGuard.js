import { tryRefresh, isLoggedIn, getUser } from "./authContext.js";

const ROLE_DASHBOARDS = {
  ADMIN:   "/pages/private/admin/dashboard.html",
  MANAGER: "/pages/private/manager/dashboard.html",
  STAFF:   "/pages/private/user/dashboard.html",
};

export async function requireRole(allowedRoles) {
  if (!isLoggedIn()) {
    const refreshed = await tryRefresh();
    if (!refreshed) {
      window.location.href = "/pages/auth/login.html";
      return null;
    }
  }

  const user = getUser();

  if (!allowedRoles.includes(user.role)) {
    window.location.href = ROLE_DASHBOARDS[user.role] ?? "/pages/auth/login.html";
    return null;
  }

  return user;
}

export async function requireAuth() {
  return requireRole(Object.keys(ROLE_DASHBOARDS));
}

export async function requireGuest() {
  if (isLoggedIn()) {
    const user = getUser();
    window.location.href = ROLE_DASHBOARDS[user.role] ?? "/index.html";
    return;
  }

  const refreshed = await tryRefresh();
  if (refreshed) {
    const user = getUser();
    window.location.href = ROLE_DASHBOARDS[user.role] ?? "/index.html";
  }
}
