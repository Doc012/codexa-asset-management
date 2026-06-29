import { getUserById } from "../../../services/userService.js";
import { getAllAssets } from "../../../services/assetService.js";
import { getLoansByUser, createLoan, returnLoan, deleteLoan } from "../../../services/loanService.js";

const CURRENT_USER_ID = 1; 

document.addEventListener("DOMContentLoaded", async () => {
    await hydrateUserProfile();
    await loadAvailableAssets();
    await loadUserLoanHistory();

    const requestForm = document.getElementById("loanRequestForm");
    if (requestForm) {
        requestForm.addEventListener("submit", handleLoanSubmit);
    }
});

/**
 * Hydrates upper stats widgets & welcoming text components
 */
async function hydrateUserProfile() {
    try {
        const user = await getUserById(CURRENT_USER_ID);
        if (!user) return;

        const welcomeHeader = document.querySelector(".welcome-card h1") || document.querySelector(".card.welcome h2");
        const profileInitial = document.getElementById("profileInitial");
        
        if (welcomeHeader) welcomeHeader.textContent = `Welcome Back, ${user.fullName.split(' ')[0]}`;
        if (profileInitial && user.fullName) profileInitial.textContent = user.fullName.charAt(0).toUpperCase();
    } catch (error) {
        console.error("Error setting up user workspace view context:", error);
    }
}

/**
 * Loads inventory into the dynamic interactive request selection table
 */
async function loadAvailableAssets() {
    const tableBody = document.getElementById("requestAssetTableBody");
    const totalAssetsEl = document.getElementById("totalAssets");

    if (!tableBody) return;

    try {
        const assets = await getAllAssets();
        if (totalAssetsEl) totalAssetsEl.textContent = assets.length;

        tableBody.innerHTML = "";

        if (assets.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No inventory available for allocation.</td></tr>`;
            return;
        }

        assets.forEach(asset => {
            const id = asset.assetId || asset.id; 

            tableBody.innerHTML += `
                <tr class="selectable-asset-row" data-id="${id}" data-title="${asset.title}" style="cursor: pointer; transition: background 0.2s;">
                    <td style="text-align: center; width: 60px;">
                        <input type="radio" name="assetRadioSelect" id="radio-${id}" value="${id}" style="cursor: pointer;">
                    </td>
                    <td><strong>${asset.title}</strong></td>
                    <td>${asset.category}</td>
                    <td><code>${asset.serialNumber}</code></td>
                    <td><span style="font-size: 13px; color: var(--muted);">${asset.location}</span></td>
                    <td><span class="status-badge ${asset.condition.toLowerCase()}">${asset.condition}</span></td>
                </tr>`;
        });

        attachTableSelectionListeners();

    } catch (error) {
        console.error("Failed loading request table assets framework:", error);
    }
}

/**
 * Tracks row selection highlights and updates hidden form input parameters
 */
function attachTableSelectionListeners() {
    const rows = document.querySelectorAll(".selectable-asset-row");
    const hiddenInput = document.getElementById("selectedAssetId");
    const statusText = document.getElementById("selectionStatusText");

    rows.forEach(row => {
        row.addEventListener("click", () => {
            const assetId = row.dataset.id;
            const assetTitle = row.dataset.title;
            const radioButton = row.querySelector("input[type='radio']");

            rows.forEach(r => {
                r.style.backgroundColor = "";
                r.style.outline = "";
            });

            row.style.backgroundColor = "#E8F5E9"; 
            row.style.outline = "1px solid var(--primary)";

            if (radioButton) radioButton.checked = true;

            hiddenInput.value = assetId;
            statusText.innerHTML = `Selected: <span style="color: var(--primary); font-weight:700;">${assetTitle}</span>`;
        });
    });
}

/**
 * Handles Form Request Submissions
 */
async function handleLoanSubmit(e) {
    e.preventDefault();
    const hiddenAssetId = document.getElementById("selectedAssetId").value;
    
    if (!hiddenAssetId) {
        alert("Please pick an asset device from the inventory list selection table grid first!");
        return;
    }

    const payload = {
        userId: CURRENT_USER_ID,
        assetId: parseInt(hiddenAssetId)
    };

    try {
        await createLoan(payload);
        alert("Loan Request successfully created!");
        
        document.getElementById("selectedAssetId").value = "";
        document.getElementById("selectionStatusText").textContent = "No asset selected";
        
        await loadAvailableAssets();
        await loadUserLoanHistory(); 
    } catch (error) {
        alert("Could not process request submission configuration logic mapping structure.");
    }
}

/**
 * Loads the explicit loan tracks belonging to our active user
 */
async function loadUserLoanHistory() {
    const loanTable = document.getElementById("loanTable");
    const totalLoansEl = document.getElementById("totalLoans");

    if (!loanTable) return;

    try {
        const userLoans = await getLoansByUser(CURRENT_USER_ID);
        const allAssets = await getAllAssets();
        
        const assetMap = allAssets.reduce((map, item) => {
            map[item.assetId] = item.title;
            return map;
        }, {});

        if (totalLoansEl) totalLoansEl.textContent = userLoans.length;
        loanTable.innerHTML = "";

        if (userLoans.length === 0) {
            loanTable.innerHTML = `<tr><td colspan="8" style="text-align:center;">You have no active or historical loans filed.</td></tr>`;
            return;
        }

        userLoans.forEach(loan => {
            const assetName = assetMap[loan.assetId] || `Asset ID: ${loan.assetId}`;
            const checkout = loan.checkoutDate || `<span style="color:var(--muted); font-style:italic;">Pending Out</span>`;
            const returned = loan.returnDate || `<span style="color:var(--muted);">—</span>`;
            
            let actionMarkup = `<span style="color: var(--muted); font-size:13px;">No actions open</span>`;
            
            if (loan.status === "PENDING") {
                actionMarkup = `<button class="primary-btn cancel-btn" data-id="${loan.loanId}" style="margin-top:0; padding:6px 12px; font-size:13px; background-color: var(--danger);">Cancel</button>`;
            } else if (loan.status === "APPROVED") {
                actionMarkup = `<button class="primary-btn return-btn" data-id="${loan.loanId}" style="margin-top:0; padding:6px 12px; font-size:13px; background-color: #3B82F6;">Return</button>`;
            }

            loanTable.innerHTML += `
                <tr>
                    <td><strong>#LN-${loan.loanId}</strong></td>
                    <td>${assetName}</td>
                    <td>${loan.requestDate}</td>
                    <td>${checkout}</td>
                    <td>${loan.dueDate || "—"}</td>
                    <td>${returned}</td>
                    <td><span class="status-badge ${loan.status.toLowerCase()}">${loan.status}</span></td>
                    <td>${actionMarkup}</td>
                </tr>`;
        });

        attachActionListeners();

    } catch (error) {
        console.error("Failed to compile custom users logs table context:", error);
    }
}

/**
 * Click tracking engine maps elements for Return (Update) & Cancel (Delete) requests
 */
void function attachActionListeners() {
    document.querySelectorAll(".return-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const loanId = e.target.dataset.id;
            if (confirm("Are you ready to submit this item back to physical management inventory?")) {
                try {
                    await returnLoan(loanId);
                    await loadUserLoanHistory();
                } catch (error) {
                    alert("Failed to fire return state execution.");
                }
            }
        });
    });

    document.querySelectorAll(".cancel-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const loanId = e.target.dataset.id;
            if (confirm("Are you certain you wish to withdraw this pending loan registration log?")) {
                try {
                    await deleteLoan(loanId);
                    await loadUserLoanHistory();
                } catch (error) {
                    alert("Failed tracking database clean step withdrawal drop updates.");
                }
            }
        });
    });
}();