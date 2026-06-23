import { getUserLogsById } from "../../../services/auditService.js";
import { getAllUsersByRole } from "../../../services/userService.js";
import { getAllLogs } from "../../../services/auditService.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("adminRecentLogsBody");
    
    try {
        const logs = await getAllLogs();
        const slicedLogs = logs.slice(0, 4);
        tableBody.innerHTML = "";

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

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to render Audit Logs", error);
        tableBody.innerHTML = `<tr><td colspan = "4" style="color: red";> Error: ${error.message}</td></tr>`;
    }

});


// document.addEventListener("DOMContentLoaded", async () => {
//     const userLogContainer = document.getElementById("user_log");
//     const userId = 4;

//     try {
//         const usersLogs = await getUserLogsById(userId);
//         const newUserLogs = usersLogs.slice(0, 4);
//         userLogContainer.innerHTML = "";

//         newUserLogs.forEach((obj) => {
//             if (userLogContainer && obj) {
//                 const li = document.createElement("li");
//                 li.textContent = `${obj.message} - ${obj.timestamp}`
//                 userLogContainer.appendChild(li);
//             }

//         });


//     } catch (error) {
//         console.log("Error: " + error);
//     }
// });