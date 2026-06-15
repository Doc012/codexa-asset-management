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
 * All STAFF's Due soon loans
 * 
 */
document.addEventListener("DOMContentLoaded", async () => {
    const dueSoonElement = document.getElementById("total_requests");
    const userId = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {

        const loansDue = await getLoansByUser(userId);

        const total = loansDue.filter((loan) => {
            if (!loan || loan.status !== "APPROVED" || !loan.dueDate) {
                return false;
            }
            const dueDate = new Date(loan.dueDate);
            const diff = dueDate - today;

            const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));

            return daysRemaining >= 0 && daysRemaining <= 8;
        });

        const totalDueLoans = total.length;

        if (dueSoonElement && loansDue) {
            dueSoonElement.textContent = totalDueLoans;
        }

    } catch (error) {
        console.log(`Error: ${error}`)
    }

});

/**
 * All STAFF's overdue loans
 */

document.addEventListener("DOMContentLoaded", async () => {
    const overdueElement = document.getElementById("overdue");
    const userId = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const getUserLoans = await getLoansByUser(userId);

        const total = getUserLoans.filter((loan) => {
            const dueDate = new Date(loan.dueDate);
            const diff = today - dueDate;

            const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));

            return daysRemaining <= 0;

        });

        const totalOverDue = total.length;

        if(getUserLoans && overdueElement){
            overdueElement.textContent = totalOverDue;
        }

    } catch (error) {
        console.log(`Error: ${error}`);
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
    } catch (error) {
        console.log("Error: " + error)
    }
};

loadPendingLoans("PENDING");
requestLoanHistory();
