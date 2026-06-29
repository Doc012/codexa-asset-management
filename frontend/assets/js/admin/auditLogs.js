import { getAllLogs } from "../../../services/auditService.js";

let currentAction = "ALL";
let currentEntity = "ALL";
let searchQuery = "";
let allLogs = [];
let filteredLogs = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadLogs();
    setupFilters();
    setupDownload();
});

/* ─── Load ──────────────────────────────────────────────────────────────── */

const loadLogs = async () => {
    try {
        allLogs = await getAllLogs();
        filteredLogs = allLogs;
        renderLogs(allLogs);
    } catch (error) {
        console.error("Failed to load audit logs:", error);
    }
};

/* ─── Filters ───────────────────────────────────────────────────────────── */

const applyFilters = () => {
    filteredLogs = allLogs.filter(log => {
        if (currentAction !== "ALL" && log.actionType !== currentAction) return false;
        if (currentEntity !== "ALL" && log.entityType !== currentEntity) return false;

        if (searchQuery) {
            const haystack = [
                log.logCreatorEmail,
                log.message,
                log.entityType,
                log.actionType,
                String(log.logId),
            ].join(" ").toLowerCase();

            if (!haystack.includes(searchQuery)) return false;
        }

        return true;
    });

    renderLogs(filteredLogs);
};

const setupFilters = () => {
    const searchInput   = document.querySelector("#log-search-input");
    const actionSelect  = document.querySelector("#action-type-select");
    const entitySelect  = document.querySelector("#entity-type-select");

    if (!searchInput || !actionSelect || !entitySelect) {
        console.error("Log filter elements not found in DOM");
        return;
    }

    searchInput.addEventListener("input", e => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilters();
    });

    actionSelect.addEventListener("change", e => {
        currentAction = e.target.value;
        applyFilters();
    });

    entitySelect.addEventListener("change", e => {
        currentEntity = e.target.value;
        applyFilters();
    });
};

/* ─── Render ────────────────────────────────────────────────────────────── */

const ACTION_LABELS = {
    CREATE:    "Create",
    UPDATE:    "Update",
    DELETE:    "Delete",
    APPROVE:   "Approve",
    CHECK_OUT: "Check out",
    CHECK_IN:  "Check in",
    CANCEL:    "Cancel",
};

const formatTimestamp = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })
        + " · "
        + d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
};

const renderLogs = (logs) => {
    const tableBody  = document.querySelector(".reports-table");
    const emptyState = document.getElementById("logsEmptyState");
    const countBadge = document.getElementById("logResultCount");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    countBadge.textContent = `${logs.length} log${logs.length !== 1 ? "s" : ""}`;

    if (logs.length === 0) {
        emptyState.style.display = "flex";
        return;
    }

    emptyState.style.display = "none";

    logs.forEach(log => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><span class="log-id-cell">${log.logId}</span></td>
            <td>
                <span class="action-badge badge-${log.actionType}">
                    <span class="action-dot"></span>
                    ${ACTION_LABELS[log.actionType] ?? log.actionType}
                </span>
            </td>
            <td><span class="entity-chip entity-${log.entityType}">${log.entityType}</span></td>
            <td><span class="log-message-cell" title="${log.message}">${log.message}</span></td>
            <td><span class="log-email-cell" title="${log.logCreatorEmail}">${log.logCreatorEmail}</span></td>
            <td><span class="log-ts-cell">${formatTimestamp(log.timestamp)}</span></td>
        `;

        tableBody.appendChild(row);
    });
};

/* ─── CSV Export ────────────────────────────────────────────────────────── */

const setupDownload = () => {
    const downloadBtn = document.querySelector("#downloadReportBtn");
    if (!downloadBtn) return;
    downloadBtn.addEventListener("click", () => downloadCsv(filteredLogs));
};

const downloadCsv = (logs) => {
    const header = ["Log ID", "Email", "Entity Type", "Action Type", "Timestamp", "Message", "Old Value", "New Value"];
    const rows = logs.map(l =>
        [l.logId, l.logCreatorEmail, l.entityType, l.actionType, l.timestamp, `"${l.message}"`, `"${l.oldValue}"`, `"${l.newValue}"`].join(",")
    );

    const csv  = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href     = url;
    a.download = "audit-logs.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const adminRecentLogstableBody = document.getElementById("adminRecentLogsBody");
    
    try {
        const logs = await getAllLogs();
        const slicedLogs = logs.slice(0, 4);
        adminRecentLogstableBody.innerHTML = "";

        slicedLogs.forEach(log => {
            const row = document.createElement("tr");

            row.innerHTML = 
            `
                <td>${log.logCreatorEmail}</td>
                <td>
                <span class="admin-event-tag tag-delete">${log.actionType}</span>
                <span class="event-summary">${log.message}</span>
                </td>
                <td class="text-right text-muted font-monospace">${log.timestamp}</td>                
            
            `;

            adminRecentLogstableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to render Audit Logs", error);
        tableBody.innerHTML = `<tr><td colspan = "4" style="color: red";> Error: ${error.message}</td></tr>`;
    }