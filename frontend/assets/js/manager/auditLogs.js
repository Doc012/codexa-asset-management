// import { getUserLogsById } from "../../services/auditService.js";
import { getAllLogs, getAllManagerLogs } from "../../../services/auditService.js";


/**
 * Getting all LOAN logs for the Manager
 */
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector(".reports-table");
    const downLoadReportsBtn = document.querySelector("#downloadReportBtn");

    try {
        const logs = await getAllManagerLogs();
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

        downLoadReportsBtn.addEventListener("click", ()=> {
            downloadCsv(logs);
        });

    } catch (error) {
        console.error("Failed to render ASSETS", error);
        tableBody.innerHTML = `<tr><td colspan = "7" style="color: red";> Error: ${error.message}</td></tr>`;
    }
});

const downloadCsv = (logs)=> {
    let csv = "Log ID, User ID, Entity Type, Action Type, Timestamp, New Value, Old Value\n";

    logs.forEach(log =>{
        csv += `${log.logId}, ${log.logCreatorEmail}, ${log.entityType}, ${log.actionType}, ${log.timestamp}, ${log.newValue}, ${log.oldValue}\n`
    });

    const blob = new Blob([csv], {type: "text/csv"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    a.download = "loan-report.csv";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
