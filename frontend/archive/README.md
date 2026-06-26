<!-- //_______// FRONTEND AUTH SETUP \\_______\\ -->

### 1. config.js
The foundation — defines the API base URLs everything else imports.

### 2. authContext.js
- `sessionStorage` restore on module load
- `_setSession` / `_clearSession` helpers
- `login()` → calls backend, stores token + user
- `logout()` → calls backend, wipes session, redirects
- `tryRefresh()` → restores session from memory or cookie
- `register()`, `forgotPassword()`, `resetPassword()`, `verifyEmail()`

### 3. authGuard.js
Consumes `authContext`. Defines who can go where:
- `ROLE_DASHBOARDS` map — the single source of truth for role → page routing
- `requireRole(["ADMIN"])` — enforces auth + role on protected pages
- `requireAuth()` — alias for any authenticated role
- `requireGuest()` — bounces logged-in users away from login/register

### 4. apiFetch.js
Wraps `fetch()` for all **protected API calls** — attaches the Bearer token, handles silent 401 refresh + retry.

### 5. Auth page scripts (the user-facing flows)
Read in this order (simplest → most complex):
- login.js — calls `login()`, redirects by role
- register.js — calls `register()`
- forgotPassword.js — calls `forgotPassword()`
- resetPassword.js — reads `?token=`, calls `resetPassword()`
- verifyEmail.js — reads `?token=`, calls `verifyEmail()`

### 6. Guard modules (how pages enforce RBAC)
- admin.guard.js
- manager.guard.js
- staff.guard.js
These are the simplest files — each is just one line that calls `requireRole` with the correct role. They're the entry point on every private page.
<!-- ============================================================================================================================================= -->

<!-- ________// SSL \\__________ -->
## Local HTTPS Setup (required for refresh token cookie)

Run this command from the `backend/` directory:

### Windows
```powershell
& "C:\Program Files\Java\jdk-25.0.2\bin\keytool.exe" -genkeypair -alias assetiq -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore src/main/resources/assetiq.p12 -validity 365 -dname "CN=localhost" -storepass assetiq123
```

### Mac/Linux
```bash
keytool -genkeypair -alias assetiq -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore src/main/resources/assetiq.p12 -validity 365 -dname "CN=localhost" -storepass assetiq123
```

Then open https://localhost:8443/swagger-ui.html in your browser and click
**Advanced → Proceed to localhost** to trust the certificate.