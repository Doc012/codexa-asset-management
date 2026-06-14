import { getLoansByStatus } from "../../services/loanService.js";
import { getAllLoans } from "../../services/loanService.js";

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
