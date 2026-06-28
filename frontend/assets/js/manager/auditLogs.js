import { getAllLogs } from "../../../services/auditService.js";

let currentAction = "ALL";
let searchQuery = "";
let filteredLogs = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadLogs();
    setupFilters();
    setupDownload();
});

/**
 * LOAD ALL LOGS
 */
const loadLogs = async () => {
    try {
        const logs = await getAllLogs();
        filteredLogs = logs; 
        renderLogs(logs);
    } catch (error) {
        console.error("Failed to load audit logs:", error);
    }
};

/**
 * APPLY FILTERS
 */
const applyFilters = async () => {
    try {
        let logs = await getAllLogs();

        if (currentAction !== "ALL") {
            logs = logs.filter(log => log.actionType === currentAction);
        }

        if (searchQuery) {
            logs = logs.filter(log => {
                const email = (log.logCreatorEmail).toLowerCase();
                const userId = String(log.userId).toLowerCase();
                const entityType = (log.entityType).toLowerCase();
                const actionType = (log.actionType).toLowerCase();
                const logId = String(log.logId).toLowerCase();

                return (
                    email.includes(searchQuery) ||
                    userId.includes(searchQuery) ||
                    entityType.includes(searchQuery) ||
                    actionType.includes(searchQuery) ||
                    logId.includes(searchQuery)
                );
            });
        }

        filteredLogs = logs;
        renderLogs(logs);

    } catch (error) {
        console.error("Filter error:", error);
    }
};

/**
 * FILTER EVENTS
 */
const setupFilters = () => {
    const actionDropdown = document.querySelector("#actionTypeFilter");
    const searchInput = document.querySelector("#reportSearch");
    

    if (!actionDropdown || !searchInput) {
        console.error("Report filters not found in DOM");
        return;
    }

    actionDropdown.addEventListener("change", (e) => {
        currentAction = e.target.value;
        applyFilters();
    });

    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilters();
    });
};

/**
 * Download only filtered logs
 */
const setupDownload = () => {
    const downloadBtn = document.querySelector("#downloadReportBtn");

    if (!downloadBtn) {
        return;
    }

    downloadBtn.addEventListener("click", () => {
        console.log("Download clicked, exporting:", filteredLogs.length, "logs");
        downloadCsv(filteredLogs);
    });
};

/**
 * RENDER TABLE
 */
const renderLogs = (logs) => {
    const tableBody = document.querySelector(".reports-table");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    logs.forEach(log => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${log.logId}</td>
            <td>${log.logCreatorEmail}</td>
            <td>${log.entityType}</td>
            <td>${log.actionType}</td>
            <td>${log.timestamp}</td>
            <td>${log.newValue}</td>
            <td>${log.oldValue}</td>
        `;

        tableBody.appendChild(row);
    });
};

/**
 * CSV EXPORT
 */
const downloadCsv = (logs) => {
    let csv = "Log ID,Email,Entity Type,Action Type,Timestamp,New Value,Old Value\n";

    logs.forEach(log => {
        csv += `${log.logId},${log.logCreatorEmail},${log.entityType},${log.actionType},${log.timestamp},${log.newValue},${log.oldValue}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered-report.csv";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};