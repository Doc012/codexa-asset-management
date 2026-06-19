import { getLoansByStatus } from "../../../services/loanService.js";
import { getAllLoans } from "../../../services/loanService.js";
import { approveLoan } from "../../../services/loanService.js";
import { rejectLoan } from "../../../services/loanService.js";

/**
 * get all loans and the numeric value of all loans belonging to a MANAGER
 */
// document.addEventListener("DOMContentLoaded", async () => {
//     const tableBody = document.getElementById("all-loans-table");
//     const allLoansElement = document.getElementById("all-loans");

//     try {
//         const allLoans = await getAllLoans();
//         const totalLoans = allLoans.length;
//         allLoansElement.innerHTML = totalLoans;

//         tableBody.innerHTML = "";

//         allLoans.forEach(allLoans => {
//             const row = document.createElement("tr");

//             row.innerHTML = `
//                 <td>${loanId}</td>
//                 <td>${userId}</td>
//                 <td>${assetId}</td>
//                 <td>${status}</td>
//                 <td>${requestDate}</td>
//                 <td>${checkoutDate}</td>
//                 <td>${dueDate}</td>
//             `;
//         })

//         tableBody.appendChild(row);

//     } catch (error) {
//         console.error("Failed to render loans", error);
//         tableBody.innerHTML = `<tr><td colspan = "7" style="color: red";> Error: ${error.message}</td></tr>`;
//     }
// });

/**
 * Displaying Pending loans on the loan requests
 * THE MANAGER
 */

document.addEventListener("DOMContentLoaded", async () => {
    const numOfPendingLoans = document.querySelector("#pending-loans-number")
    const numOfApprovedLoans = document.querySelector("#approved-loans");
    const numOfRejectedLoans = document.querySelector("#rejected-loans")

    const firstRow = document.querySelector(".row-details1")
    const secRow = document.querySelector(".row-details2")
    const lastRow = document.querySelector(".row-details3")
    try {
        const pendingLoans = await getLoansByStatus("PENDING");

        const totalPendingLoans = pendingLoans.length;
        numOfPendingLoans.textContent = totalPendingLoans;

        const approvedLoans = await getLoansByStatus("APPROVED");
        const totalApproved = approvedLoans.length;
        numOfApprovedLoans.textContent = totalApproved;

        const rejectedLoans = await getLoansByStatus("REJECTED");
        const totalRejected = rejectedLoans.length;
        numOfRejectedLoans.textContent = totalRejected;



        if (firstRow) {
            firstRow.textContent = `${totalPendingLoans} Employee loan requests require approval`;
        }
        if (secRow) {
            secRow.textContent = `${totalApproved} Assets flagged with bad/poor conditions requiring formal retirement status conversion.`;
        }
        if (lastRow) {
            lastRow.textContent = `${totalRejected} Review real-time system performance data.`;
        }

    } catch (error) {
        console.log(`Error: ` + error)
    }
});

/**
 * Manager can view Pending loans
 * Accept or Reject
 */

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#pendingLoansTableBody");
    try {
        const pendingLoans = await getLoansByStatus("PENDING");

        tableBody.innerHTML = "";

        pendingLoans.forEach((loan) => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${loan.title}</td>
            <td>${loan.requesterEmail}</td>
            <td>${loan.requestDate}</td>
            <td>${loan.department}</td>
             <td>
                <button class="approve_btn" data-id="${loan.loanId}">Approve</button>
                <button class="reject_btn" data-id="${loan.loanId}">Reject</button>
            </td>`;

            const approveLoanBtn = row.querySelector(".approve_btn");
            const rejectBtn = row.querySelector(".reject_btn");

            if (approveLoanBtn) {
                approveLoanBtn.addEventListener("click", async () => {
                    showConfirmationModal(async () => {
                        await loanApproval(loan.loanId);
                    })
                });
            }

            if (rejectBtn) {
                rejectBtn.addEventListener("click", async () => {
                    showConfirmationModal(async () => {
                        await loanRejection(loan.loanId)
                    });
                });
            }

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.log(`Error: ` + error)
    }
});
/**
 * Approve and reject loans
 */

const loanApproval = async (loanId) => {
    try {
        await approveLoan(loanId);
        window.location.reload();
    } catch (error) {
        console.log(`Error: ${error}`)
    }
};

/**
 * Reject loan
 */
const loanRejection = async (loanId) => {
    try {
        await rejectLoan(loanId);
        window.location.reload();
    } catch (error) {
        console.log(`Error: ${error}`)
    }
};

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


/**
 * All Active loans
 * Can be Returned
 */
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#active-loans-body");
    try {
        const pendingLoans = await getLoansByStatus("APPROVED");

        tableBody.innerHTML = "";

        pendingLoans.forEach((loan) => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${loan.title}</td>
            <td>${loan.requesterEmail}</td>
            <td>${loan.requestDate}</td>
            <td>${loan.department}</td>
             <td>
                <button class="approve_btn" data-id="${loan.loanId}">Return</button>
            </td>`;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.log(`Error: ` + error)
    }
});

/**
 * Historical loans
 * All returned and rejected loans
 */

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#historical-loans");
    try {
        const allLoans = await getAllLoans();

        tableBody.innerHTML = "";

        allLoans.forEach((loan) => {
            if (loan.status === "PENDING" || loan.status === "APPROVED") {
                return false;
            }
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${loan.title}</td>
            <td>${loan.requesterEmail}</td>
            <td>${loan.requestDate}</td>
            <td>${loan.department}</td>
             <td>
                ${loan.status}
            </td>`;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.log(`Error: ` + error)
    }
});


/**
 * Displaying loans except the pending ones
 */

// const requestLoanHistory = async () => {
//     const tableBody = document.querySelector("#all_loans tbody");

//     try {
//         const allLoans = await getAllLoans();
//         tableBody.innerHTML = "";

//         const loans = allLoans.filter((loan) => loan.status !== "PENDING");

//         loans.forEach((loan) => {
//             const row = document.createElement("tr");

//             row.innerHTML = `
//                 <td>${loan.assetId}</td>
//                 <td>${loan.userId}</td>
//                 <td>${loan.requestDate}</td>
//                 <td>${loan.loanId}</td>
//                 <td>${loan.status}</td>`

//             tableBody.appendChild(row);
//         })
//     } catch (error) {
//         console.log("Error: " + error)
//     }
// };

// requestLoanHistory();




function switchTab(event, tabId) {
    // 1. Hide all active dashboard tab content containers
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active-content'));

    // 2. Remove highlighted active navigation button classes
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // 3. Mount current configurations active targets
    document.getElementById(tabId).classList.add('active-content');
    event.currentTarget.classList.add('active');
}