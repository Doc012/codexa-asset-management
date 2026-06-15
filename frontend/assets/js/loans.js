import { getLoansByStatus } from "../../services/loanService.js";
import { getAllLoans } from "../../services/loanService.js";
import { getLoansByUser } from "../../services/loanService.js";

/**
 * get all loans and the numeric value of all loans belonging to a user
 */
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("all-loans-table");
    const allUserLoansCard = document.getElementById("totalLoans");

    try {
        const totalLoans = await getAllLoans();
        const loansByUser = await getLoansByUser(1);
        console.log(loansByUser.length);
        allUserLoansCard.textContent = loansByUser.length;

        tableBody.innerHTML = "";

        totalLoans.forEach(allLoans => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${loanId}</td>
                <td>${userId}</td>
                <td>${assetId}</td>
                <td>${status}</td>
                <td>${requestDate}</td>
                <td>${checkoutDate}</td>
                <td>${dueDate}</td>
            `;
        })

        tableBody.appendChild(row);

    } catch (error) {
        console.error("Failed to render loans", error);
        tableBody.innerHTML = `<tr><td colspan = "7" style="color: red";> Error: ${error.message}</td></tr>`;
    }
});

/**
 * Displaying Pending loans on the loan requests
 */
const loadPendingLoans = (async (status) => {
    const tableBody = document.querySelector("#pendingLoansTable tbody");
    try {
        const pendingLoans = await getLoansByStatus(status);
        tableBody.innerHTML = "";

        pendingLoans.forEach((loan) => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${loan.assetId}</td>
            <td>${loan.userId}</td>
            <td>${loan.requestDate}</td>
            <td>${loan.loanId}</td>
             <td>
                <button class="approve_btn" data-id="${loan.loanId}">Approve</button>
                <button class="reject_btn" data-id="${loan.loanId}">Reject</button>
            </td>`;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.log(`Error: ` + error)
    }
})

/**
 * Displaying loans except the pending ones
 */

const requestLoanHistory = async () => {
    const tableBody = document.querySelector("#all_loans tbody");

    try {
        const allLoans = await getAllLoans();
        tableBody.innerHTML = "";

        const loans = allLoans.filter((loan) => loan.status !== "PENDING");

        loans.forEach((loan) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${loan.assetId}</td>
                <td>${loan.userId}</td>
                <td>${loan.requestDate}</td>
                <td>${loan.loanId}</td>
                <td>${loan.status}</td>`

            tableBody.appendChild(row);
        })
    }catch (error){
        console.log("Error: " + error)
    }
};

loadPendingLoans("PENDING");
requestLoanHistory();
