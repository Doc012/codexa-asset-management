/**
 * manager.guard.js
 * Include as the first <script type="module"> on every manager page.
 * Blocks access for any user who is not a MANAGER.
 */
import { requireRole } from "../authGuard.js";

await requireRole(["MANAGER"]);
