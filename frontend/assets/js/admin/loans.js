import {
  getLoansByStatus,
  getAllLoans,
  approveLoan,
  checkoutLoan,
  returnLoan,
  rejectLoan,
} from "../../../services/loanService.js";

/**
 * Cached data (IMPORTANT for search)
 */
let pendingLoans = [];
let activeLoans = [];
let checkoutLoans = [];
let historicalLoans = [];

/**
 * Init
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadAllData();
  setupSearch();
});

/**
 * Load everything once
 */
async function loadAllData() {
  const [pending, approved, all] = await Promise.all([
    getLoansByStatus("PENDING"),
    getLoansByStatus("APPROVED"),
    getAllLoans(),
  ]);

  pendingLoans = pending;
  activeLoans = approved;

  checkoutLoans = approved.filter((l) => l.assetStatus !== "LOANED");

  historicalLoans = all.filter(
    (l) => l.status !== "PENDING" && l.status !== "APPROVED",
  );

  renderAll();
}

/**
 * SEARCH
 */
function setupSearch() {
  const input = document.getElementById("loanSearchInput");
  if (!input) return;

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase().trim();
    renderAll(query);
  });
}

/**
 * MASTER FILTER
 */
function filter(data, query) {
  if (!query) return data;

  return data.filter(
    (l) =>
      (l.title && l.title.toLowerCase().includes(query)) ||
      (l.requesterEmail && l.requesterEmail.toLowerCase().includes(query)) ||
      (l.department && l.department.toLowerCase().includes(query)) ||
      (l.loanId && String(l.loanId).includes(query)) ||
      (l.requestDate && l.requestDate.includes(query)),
  );
}

/**
 * RENDER ALL TABS
 */
function renderAll(query = "") {
  renderPending(filter(pendingLoans, query));
  renderActive(filter(activeLoans, query));
  renderCheckout(filter(checkoutLoans, query));
  renderHistory(filter(historicalLoans, query));
}

/**
 * PENDING
 */
function renderPending(data) {
  const body = document.querySelector("#pendingLoansTableBody");
  if (!body) return;

  body.innerHTML = "";

  data.forEach((loan) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${loan.title}</td>
            <td>${loan.requesterEmail}</td>
            <td>${loan.requestDate}</td>
            <td>${loan.department}</td>
            <td>
                <button class="approve_btn">Approve</button>
                <button class="reject_btn">Reject</button>
            </td>
        `;

    row.querySelector(".approve_btn").onclick = () =>
      showConfirmationModal(() => loanApproval(loan.loanId));

    row.querySelector(".reject_btn").onclick = () =>
      showConfirmationModal(() => loanRejection(loan.loanId));

    body.appendChild(row);
  });
}

/**
 * ACTIVE
 */
function renderActive(data) {
  const body = document.querySelector("#active-loans-body");
  if (!body) return;

  body.innerHTML = "";

  data.forEach((loan) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${loan.title}</td>
            <td>${loan.requesterEmail}</td>
            <td>${loan.requestDate}</td>
            <td>${loan.dueDate}</td>
            <td>${loan.department}</td>
            <td><button class="return_btn">Return</button></td>
        `;

    row.querySelector(".return_btn").onclick = () =>
      showConfirmationModal(() => loanReturn(loan.loanId));

    body.appendChild(row);
  });
}

/**
 * CHECKOUT
 */
function renderCheckout(data) {
  const body = document.querySelector("#checkout-loan-body");
  if (!body) return;

  body.innerHTML = "";

  data.forEach((loan) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${loan.title}</td>
            <td>${loan.requesterEmail}</td>
            <td>${loan.requestDate}</td>
            <td>${loan.department}</td>
            <td><button class="checkout_btn">Checkout</button></td>
        `;

    row.querySelector(".checkout_btn").onclick = () =>
      showConfirmationModal(() => loanCheckout(loan.loanId));

    body.appendChild(row);
  });
}

function loanStatusClass(status) {
  const map = {
    PENDING:   "pending",
    APPROVED:  "approved",
    REJECTED:  "rejected",
    CANCELLED: "cancelled",
    RETURNED:  "returned",
  };
  return map[status] ?? "";
}

/**
 * HISTORY
 */
function renderHistory(data) {
  const body = document.querySelector("#historical-loans");
  if (!body) return;
 
  body.innerHTML = "";
 
  data.forEach((loan) => {
    const row = document.createElement("tr");
 
    row.innerHTML = `
      <td>${loan.title}</td>
      <td>${loan.requesterEmail}</td>
      <td>${loan.requestDate}</td>
      <td>${loan.department}</td>
      <td>
        <span class="status-badge ${loanStatusClass(loan.status)}">
          ${formatLoanStatus(loan.status)}
        </span>
      </td>
    `;
 
    body.appendChild(row);
  });
}

function formatLoanStatus(status) {
  if (!status) return "—";
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}


/**
 * ACTIONS
 */
const loanApproval = async (id) => {
  await approveLoan(id);
  location.reload();
};

const loanRejection = async (id) => {
  await rejectLoan(id);
  location.reload();
};

const loanReturn = async (id) => {
  await returnLoan(id);
  location.reload();
};

const loanCheckout = async (id) => {
  await checkoutLoan(id);
  location.reload();
};

/**
 * MODAL
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

/**
 * Loans card on dashboard
 */
document.addEventListener("DOMContentLoaded", async () => {
  const loansCounter = document.getElementById("totalLoansCard");

  if (loansCounter) {
    try {
      const loans = await getAllLoans();
      const totalLoans = loans.length;

      loansCounter.textContent = totalLoans;
    } catch (error) {
      console.error("Failed to render ASSETS", error);
      loansCounter.textContent = "Error";
    }
  }
});

/**
 * Loans Overdue card on dashboard
 */
document.addEventListener("DOMContentLoaded", async () => {
  const loansOverdueCard = document.getElementById("loansOverdueCard");

  try {
    const loans = await getAllLoans();
    const today = new Date();

    const overdueLoans = loans.filter((loan) => {
      const dueDate = new Date(loan.dueDate);
      return dueDate < today && loan.status !== "RETURNED";
    });

    if (loansOverdueCard) {
      loansOverdueCard.textContent = overdueLoans.length;
    }
  } catch (error) {
    console.error("FAILED TO CALCULATE OVERDUE LOANS", error);
  }
});
