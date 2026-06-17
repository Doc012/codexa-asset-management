import { getLoansByStatus } from "../../services/loanService.js";
import { getAllLoans } from "../../services/loanService.js";
import { getLoansByUser } from "../../services/loanService.js";

/**
 * VIEW ALL PENDING STAFF's loan when logged in
 */

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("pendingTableBody");

    try {
        const loansByUser = await getLoansByUser(1);

        tableBody.innerHTML = "";

        loansByUser.forEach(loan => {
            if (loan.status !== "PENDING") {
                return false;
            }
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${loan.loanId}</td>
                <td>${loan.status}</td>
                <td>${loan.requestDate}</td>
                <td>${loan.dueDate}</td>
                <td>
                    <button class="return-btn" style="background-color: #e67e22; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Return Asset</button>
                </td>
            `;
            tableBody.appendChild(row);
        })



    } catch (error) {
        console.error("Failed to render loans", error);
        tableBody.innerHTML = `<tr><td colspan = "5" style="color: red";> Error: ${error.message}</td></tr>`;
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

        if (getUserLoans && overdueElement) {
            overdueElement.textContent = totalOverDue;
        }

    } catch (error) {
        console.log(`Error: ${error}`);
    }

});

document.addEventListener("DOMContentLoaded", async () => {
    const allUserLoansCard = document.getElementById("totalLoans");
    const userId = 1;

    try {
        const loansByUser = await getLoansByUser(1);
        
        if(loansByUser && allUserLoansCard){
            allUserLoansCard.textContent = loansByUser.length;
        }

    }catch (error){
        console.log(`Error: ${error}`)
    }
    
});


/**
 * View loan history for user:
 */
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("historyTableBody");

    try {
        const loansByUser = await getLoansByUser(1);
        tableBody.innerHTML = "";

        loansByUser.forEach(loan => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${loan.title}</td>
                <td>${loan.category}</td>
                <td>${loan.requestDate}</td>
                <td>${loan.dueDate}</td>
                <td>${loan.status}</td>
            `

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to render LOANS", error);
        tableBody.innerHTML = `<tr><td colspan = "5" style="color: red";> Error: ${error.message}</td></tr>`;
    }
})
