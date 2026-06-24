/**
 * staff.guard.js
 * Include as the first <script type="module"> on every staff (user) page.
 * Blocks access for any user who is not STAFF.
 */
import { requireRole } from "../authGuard.js";

await requireRole(["STAFF"]);
