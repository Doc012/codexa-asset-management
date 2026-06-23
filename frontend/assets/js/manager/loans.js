import { getLoansByStatus } from "../../../services/loanService.js";
import { getAllLoans } from "../../../services/loanService.js";
import { approveLoan } from "../../../services/loanService.js";
import { rejectLoan } from "../../../services/loanService.js";
import { returnLoan } from "../../../services/loanService.js";
import { checkoutLoan } from "../../../services/loanService.js";

/**
 * get all loans and the numeric value of all loans in the system
 */
document.addEventListener("DOMContentLoaded", async () => {
    await allDashboardCards();
    await allPendingLoans();
    await allActiveLoans();
    await checkingOutLoans();
    await historicalLoans();
});

/**
 * This for the Dashboard cards for Mangager's dashbaord.
 */
const allDashboardCards = async () => {
    const numOfPendingLoans = document.querySelector("#pending-loans-number")
    const numOfApprovedLoans = document.querySelector("#approved-loans");
    const numOfRejectedLoans = document.querySelector("#rejected-loans")
    const allLoansElement = document.querySelector("#all-loans");


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

        const allLoans = await getAllLoans();
        const totalLoans = allLoans.length;
        allLoansElement.textContent = totalLoans;


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
};

/**
 * Manager can view Pending loans
 * Accept or Reject
 */
const allPendingLoans = async () => {
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
};
/**
 * Approve loans
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


/**
 * All Active loans
 * Can be Returned
 */
const allActiveLoans = async()=> {
    const tableBody = document.querySelector("#active-loans-body");
    try {
        const pendingLoans = await getLoansByStatus("APPROVED");

        tableBody.innerHTML = "";

        pendingLoans.forEach((loan) => {
            console.log(loan);
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${loan.title}</td>
            <td>${loan.requesterEmail}</td>
            <td>${loan.requestDate}</td>
            <td>${loan.department}</td>
             <td>
                <button class="return_btn" data-id="${loan.loanId}">Return</button>
            </td>`;

            const returnBtn = row.querySelector(".return_btn")
            if (returnBtn) {
                returnBtn.addEventListener("click", async () => {
                    showConfirmationModal(async () => {
                        await loanReturn(loan.loanId);
                    });
                });
            }

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.log(`Error: ` + error)
    }
};

/**
 * This method is used to return an asset
 * @param {*} loanId loan id
 */
const loanReturn = async (loanId) => {
    try {
        await returnLoan(loanId);
        window.location.reload();
    } catch (error) {
        console.log(`Error ${error}`)
    }
};

/**
 * Checkout loans
 */

const checkingOutLoans = async()=>{
    const tableBody = document.querySelector("#checkout-loan-body");

    try {
        const approvedLoans = await getLoansByStatus("APPROVED");
        const filteredLoans = approvedLoans.filter(
            loan => loan.assetStatus !== "LOANED"
        );

        tableBody.innerHTML = "";

        filteredLoans.forEach(loan => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${loan.title}</td>
            <td>${loan.requesterEmail}</td>
            <td>${loan.requestDate}</td>
            <td>${loan.department}</td>
            <td>${loan.assetStatus}</td>
            <td>
                <button class="checkout_btn" data-id="${loan.loanId}">Checkout</button>
            </td>`;
            const checkoutBtn = row.querySelector(".checkout_btn");
            if (checkoutBtn) {
                checkoutBtn.addEventListener("click", () => {
                    showConfirmationModal(async () => {
                        await loanCheckout(loan.loanId);

                    });
                });
            }
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.log(`Error: ${error}`);
    }
};

/**
 * Used to checkout a loan when collected
 * @param {*} id  loan id
 */
const loanCheckout = async (id) => {
    try {
        await checkoutLoan(id);
        window.location.reload();
    } catch (error) {
        console.log(`Error: ${error}`);
    }
};

/**
 * Historical loans
 * All returned and rejected loans
 */

const historicalLoans = async()=> {
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
};


/**
 * Allows a user to switch between tabs in the loans page
 * @param {*} event 
 * @param {*} tabId 
 */
function switchTab(event, tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active-content'));
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active-content');
    event.currentTarget.classList.add('active');
}

/**
 * User for a confirmation for a user action 
 * @param {*} onConfirm 
 */
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