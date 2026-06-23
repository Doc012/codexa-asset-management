import { getAllLogs } from "../../../services/auditService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("logsTableBody");
  const logScopeFilter = document.getElementById("logScopeFilter");
  const logSearchInput = document.getElementById("logSearchInput");

  let logs = [];

  // Fetch logs once
  try {
    logs = await getAllLogs();
    renderLogs(logs);
  } catch (error) {
    console.error("Failed to render Audit Logs", error);
    tableBody.innerHTML = `<tr><td colspan="8" style="color:red;">Error: ${error.message}</td></tr>`;
  }

  // Render function
  function renderLogs(filteredLogs) {
    tableBody.innerHTML = "";
    if (filteredLogs.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#666;">No logs found</td></tr>`;
      return;
    }

    filteredLogs.forEach(log => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${log.logCreatorEmail}</td>
        <td>${log.actionType}</td>
        <td>${log.entityTitle}</td>
        <td>${log.entityType}</td>
        <td>${log.message}</td>
        <td>${log.newValue}</td>
        <td>${log.oldValue}</td>
        <td>${log.timestamp}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Filter + Search handler
  function applyFilters() {
    const scope = logScopeFilter.value.toLowerCase();
    const searchTerm = logSearchInput.value.toLowerCase();

    const filtered = logs.filter(log => {
      const matchesScope = scope === "all" || log.actionType.toLowerCase() === scope;
      const matchesSearch =
        log.logCreatorEmail.toLowerCase().includes(searchTerm) ||
        log.entityTitle.toLowerCase().includes(searchTerm) ||
        log.entityType.toLowerCase().includes(searchTerm) ||
        log.message.toLowerCase().includes(searchTerm) ||
        log.newValue.toLowerCase().includes(searchTerm) ||
        log.oldValue.toLowerCase().includes(searchTerm) ||
        log.timestamp.toLowerCase().includes(searchTerm);

      return matchesScope && matchesSearch;
    });

    renderLogs(filtered);
  }

  // Event listeners
  logScopeFilter.addEventListener("change", applyFilters);
  logSearchInput.addEventListener("input", applyFilters);
});
