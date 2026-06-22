import { getLoansByStatus } from "../../services/loanService.js";
import { getAllLoans } from "../../services/loanService.js";
import { getLoansByUser } from "../../services/loanService.js";
import { cancelLoan } from "../../services/loanService.js";

/**
 * VIEW ALL PENDING STAFF's loan when logged in
 */

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("pendingTableBody");

    try {
        const loansByUser = await getLoansByUser(4);

        tableBody.innerHTML = "";

        loansByUser.forEach(loan => {
            if (loan.status !== "PENDING") {
                return false;
            }
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${loan.title}</td>
                <td>${loan.category}</td>
                <td>${loan.requestDate}</td>
                <td>${loan.status}</td>
                <td>
                    <button class="cancel_btn" data-id="${loan.loanId}">cancel loan</button>
                </td>`
            ;

            const cancelBtn = row.querySelector(".cancel_btn");
            if(cancelBtn){
                cancelBtn.addEventListener("click", async()=> {
                    showConfirmationModal(async()=> {
                        await loanCancellation(loan.loanId);
                        console.log(loan.status);
                    })
                })
            }
            tableBody.appendChild(row);

            });

    } catch (error) {
        console.error("Failed to render loans", error);
        tableBody.innerHTML = `<tr><td colspan = "5" style="color: red";> Error: ${error.message}</td></tr>`;
    }
});

/**
 * cancel loan method
 */

const loanCancellation = async(id) => {
    try {
        await cancelLoan(id);
        window.location.reload();
    }catch (error){
        console.log(`Error: ${error}`);
    }
}


/**
 * View loan history for user:
 * Rejected and Returned
 */
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("historyTableBody");
    
    try {
        const loansByUser = await getLoansByUser(4);
        tableBody.innerHTML = "";

        loansByUser.forEach(loan => {
            if(loan.status === "PENDING" || loan.status === "APPROVED"){
                return false;
            }
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
});

/**
 * View all active Loans
 * APPROVED and not Returned
 */
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("activeTableBody");
    
    try {
        const loansByUser = await getLoansByUser(4);
        tableBody.innerHTML = "";

        loansByUser.forEach(loan => {
            if(loan.status === "PENDING" || loan.status === "REJECTED" || loan.status === "RETURNED" || loan.status === "CANCELLED"){
                return false;
            }
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
});

/**
 * All STAFF's Due soon loans
 * 
 */
document.addEventListener("DOMContentLoaded", async () => {
    const dueSoonElement = document.getElementById("total_requests");
    const userId = 4;
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



document.addEventListener("DOMContentLoaded", async () => {
    const dueSoonElement = document.getElementById("total_requests");
    const userId = 4;
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
    const userId = 4;
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
/**
 * All loans of the user
 */
document.addEventListener("DOMContentLoaded", async () => {
    const allUserLoansCard = document.getElementById("totalLoans");
    const userId = 4;

    try {
        const loansByUser = await getLoansByUser(4);
        
        if(loansByUser && allUserLoansCard){
            allUserLoansCard.textContent = loansByUser.length;
        }

    }catch (error){
        console.log(`Error: ${error}`)
    }
    
});


function showConfirmationModal(onConfirm) {
    const modal = document.getElementById("btnConfirmation");

    modal.style.display = "flex";

    document.getElementById("confirmBtn").onclick = async () => {
        await onConfirm();
        modal.style.display = "none";
    };

    document.getElementById("cancelBtn").onclick = () => {
        modal.style.display = "none";
    };
}


