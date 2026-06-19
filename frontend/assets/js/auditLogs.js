import { getUserLogsById } from "../../services/auditService.js";
import { getAllUsersByRole } from "../../services/userService.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("log-table-body");

    try {
        const { getAllLogs } = await import("../../services/auditService.js")
        const logs = await getAllLogs();
        tableBody.innerHTML = "";

        logs.forEach(log => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${log.logId}</td>
                <td>${log.userId}</td>
                <td>${log.entityType}</td>
                <td>${log.entityId}</td>
                <td>${log.actionType}</td>
                <td>${log.timestamp}</td>
                <td>${log.oldValue}</td>
                <td>${log.newValue}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to render ASSETS", error);
        tableBody.innerHTML = `<tr><td colspan = "8" style="color: red";> Error: ${error.message}</td></tr>`;
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    const userLogContainer = document.getElementById("user_log");
    const userId = 4;

    try {
        const usersLogs = await getUserLogsById(userId);
        const newUserLogs = usersLogs.slice(0, 4);
        userLogContainer.innerHTML = "";

        newUserLogs.forEach((obj) => {
            if (userLogContainer && obj) {
                const li = document.createElement("li");
                li.textContent = `${obj.message} - ${obj.timestamp}`
                userLogContainer.appendChild(li);
            }

        });


    } catch (error) {
        console.log("Error: " + error);
    }
});