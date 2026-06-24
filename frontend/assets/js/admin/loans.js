import { 
    getAllLoans,
    returnLoan,
    rejectLoan,
    approveLoan,
    cancelLoan 
} from "../../../services/loanService.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("loansTableBody");
    const searchInput = document.getElementById("loanSearchInput");
    const statusFilter = document.getElementById("loanStatusFilter");

    let allLoans = []; 

    try {
        allLoans = await getAllLoans();
        renderTable(allLoans);
    } catch(error){
        console.error("Failed to render Loans table", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">Error: ${error.message}</td></tr>`;
    }

    function renderTable(loansToRender) {
        tableBody.innerHTML = "";
        
        if (loansToRender.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #888;">No loans matched your criteria.</td></tr>`;
            return;
        }

        loansToRender.forEach(loan => {
            const row = document.createElement("tr");
            
            const actionButtons = getActionButtonsHTML(loan.status, loan.loanId);

            row.innerHTML = `
                <td class="flex-meta-cell">
                    <div>
                        <span class="cell-primary-title">${loan.title || 'Unknown Asset'}</span>
                        <span class="cell-sub-label code-font">ID: ${loan.assetId}</span>
                    </div>
                </td>
                <td>
                    <span class="cell-primary-title">${loan.requesterEmail.split('@')[0]}</span> 
                    <span class="cell-sub-label">${loan.requesterEmail}</span>
                </td>
                <td>
                    <span class="cell-primary-title">${loan.requestDate || 'N/A'}</span>
                    <span class="cell-sub-label">Due: ${loan.dueDate || 'N/A'}</span>
                </td>
                <td>
                    <span class="status-badge ${getStatusLabel(loan.status)}">${loan.status || 'PENDING'}</span>
                </td>
                <td>
                    <div class="row-actions-group">
                        ${actionButtons}
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function getActionButtonsHTML(status, id) {
        if (!status || status === 'PENDING') {
            return `
                <button class="row-action-btn edit action-approve" data-id="${id}" title="Approve Request">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </button>
                <button class="row-action-btn delete action-reject" data-id="${id}" title="Reject Request">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </button>`;
        }
        if (status === 'APPROVED') {
            return `
                <button class="row-action-btn edit action-return" data-id="${id}" title="Process Return Audit" style="stroke: #2563eb;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                </button>
                <button class="row-action-btn delete action-cancel" data-id="${id}" title="Cancel Active Allocation">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line></svg>
                </button>`;
        }
        return `<span style="font-size: 12px; color:#aaa;">Archived</span>`;
    }

    function filterData() {
        const searchQuery = searchInput.value.toLowerCase().trim();
        const selectedStatus = statusFilter.value;

        const filtered = allLoans.filter(loan => {
            const matchesSearch = 
                (loan.title && loan.title.toLowerCase().includes(searchQuery)) ||
                (loan.assetId && String(loan.assetId).includes(searchQuery)) ||
                (loan.requesterEmail && loan.requesterEmail.toLowerCase().includes(searchQuery));

            const matchesStatus = (selectedStatus === "all") || (loan.status === selectedStatus);

            return matchesSearch && matchesStatus;
        });

        renderTable(filtered);
    }

    searchInput.addEventListener("input", filterData);
    statusFilter.addEventListener("change", filterData);


    tableBody.addEventListener("click", async (event) => {
        const button = event.target.closest(".row-action-btn");
        if (!button) return;

        const loanId = button.dataset.id;
        
        if (button.classList.contains("action-approve")) {
            await approveLoan(loanId);
            window.location.reload();
        } else if (button.classList.contains("action-reject")) {
            await rejectLoan(loanId);
            window.location.reload();
        } else if (button.classList.contains("action-return")) {
            await returnLoan(loanId);
            window.location.reload();
        } else if (button.classList.contains("action-cancel")) {
            await cancelLoan(loanId);
            window.location.reload();
        }
    });

    function getStatusLabel(status) {
        const statusMap = {
            APPROVED: 'good',
            PENDING: 'pending',
            CANCELLED: 'cancelled',
            REJECTED: 'rejected',
            RETURNED: 'returned'
        };
        return statusMap[status] || 'pending';
    }
});



/**
 * Display total amount of loans on dashboard
 */
document.addEventListener("DOMContentLoaded", async () => {
    const loansCard = document.getElementById("totalLoansCard");
    try {
        const allLoans = await getAllLoans();

        const assetCounter = allLoans.length;
        if(loansCard) {
            loansCard.textContent = assetCounter;
        }
    } catch(error) {
        console.error("FAILED TO RENDER TOTAL NUMBER OF LOANS")
    }
});

/**
 * Display overdue loans
 */
document.addEventListener("DOMContentLoaded", async () => {
    const loansOverdueCard = document.getElementById("loansOverdueCard");

    try {
        const loans = await getAllLoans();

        const today = new Date();

        const overdueLoans = loans.filter(loan => {
            const dueDate = new Date(loan.dueDate);

            return dueDate < today && !loan.RETURNED;
        });

        if(loansOverdueCard) {
            loansOverdueCard.textContent = overdueLoans.length;
        }
    } catch(error) {
        console.error("FAILED TO CALCULATE TOTAL OVERDUE LOANS");
    }
});