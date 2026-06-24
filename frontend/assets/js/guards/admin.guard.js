/**
 * admin.guard.js
 * Include as the first <script type="module"> on every admin page.
 * Blocks access for any user who is not an ADMIN.
 */
import { requireRole } from "../authGuard.js";

await requireRole(["ADMIN"]);
