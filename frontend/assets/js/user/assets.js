import { getAllAssets } from "../../../services/assetService.js";
import { getUser } from "../authContext.js";

import { API_BASE_URL } from "../config.js";
import { createLoan } from "../../../services/loanService.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("user-asset-table-body")) {
    await viewAssetsOnDashboard();
  }

  if (document.getElementById("assetsTableBody")) {
    await assetPage();
  }
});

/**
 * This is for The User viewing assets in their dashboard
 * The user can also see the total number of assets
 */
const viewAssetsOnDashboard = async () => {
  const tableBody = document.getElementById("user-asset-table-body");
  const assetCounter = document.getElementById("totalAssets");

  try {
    const assets = await getAllAssets();
    const slicedAssets = assets.slice(0, 4);
    tableBody.innerHTML = "";

    const totalAssets = assets.length;
    if (assetCounter) {
      assetCounter.textContent = totalAssets;
    }

    slicedAssets.forEach((asset) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${asset.title}</td>
                <td>${asset.category}</td>
                <td>${asset.condition}</td>
                <td>
                    <img src="${asset.photoPath}" alt="Asset Image" style="width: 80px; height: auto;"/>
                </td>
            `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to render ASSETS", error);
    tableBody.innerHTML = `<tr><td colspan = "4" style="color: red";> Error: ${error.message}</td></tr>`;
  }
};

/**
 * Assets page for Staff
 * Allows the user to view available assets and request a loan
 */
const renderAssets = (tableBody, assets) => {
  tableBody.innerHTML = "";

  assets.forEach((asset) => {
    const row = document.createElement("tr");
    const isLoaned = asset.assetStatus === "LOANED";

    if (isLoaned) {
      row.classList.add("row-disabled");
    }

    row.innerHTML = `
            <td>${asset.title}</td>
            <td>
                <div class="table-img-frame">
                    <img class="asset-img"
                         src="${asset.photoPath}"
                         alt="Asset Image"/>
                </div>
            </td>

            <td>${asset.category}</td>
            <td>${asset.assetStatus}</td>
            <td>${asset.condition}</td>

            <td>
                <button class="request-btn"
                        data-id="${asset.assetId}"
                        ${isLoaned ? "disabled" : ""}>
                    ${isLoaned ? "Unavailable" : "Request Loan"}
                </button>
            </td>
        `;

    row
      .querySelector(".request-btn")
      .addEventListener("click", async () => {
        await showConfirmationModal(async () => {
          await requestLoan(asset.assetId);
        });
      });
    tableBody.appendChild(row);
  });
};

/**
 * Filters
 */
const filterAssets = (assets, search, category, condition) => {
  return assets.filter((asset) => {
    const matchesSearch =
      search === "" ||
      asset.title?.toLowerCase().includes(search) ||
      asset.category?.toLowerCase().includes(search) ||
      asset.condition?.toLowerCase().includes(search) ||
      asset.assetStatus?.toLowerCase().includes(search);

    const matchesCategory = category === "ALL" || asset.category === category;

    const matchesCondition = condition === "" || asset.condition === condition;

    return matchesSearch && matchesCategory && matchesCondition;
  });
};

/**
 * Main controller
 */
const assetPage = async () => {
  const tableBody = document.getElementById("assetsTableBody");

  const searchInput = document.getElementById("assetSearch");
  const categoryFilter = document.getElementById("filter-category-select");
  const conditionFilter = document.getElementById("conditionFilter");

  let allAssets = [];

  try {
    allAssets = await getAllAssets();
    renderAssets(tableBody, allAssets);

    const applyFilters = () => {
      const search = searchInput.value.toLowerCase().trim();
      const category = categoryFilter.value;
      const condition = conditionFilter.value;

      const filtered = filterAssets(allAssets, search, category, condition);

      renderAssets(tableBody, filtered);
    };
    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
    conditionFilter.addEventListener("change", applyFilters);
  } catch (error) {
    console.error("Failed to render ASSETS", error);
    tableBody.innerHTML = `<tr><td colspan="6" style="color:red;">Error: ${error.message}</td></tr>`;
  }
};

/**
 * This is for confirmation of a loan request
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

/**
 * REQUEST A loan on an asset that is available
 */
const requestLoan = async (assetId) => {
  const successMessage = document.getElementById("successMessage");
  try {
    await createLoan({
      userId: getUser().id,
      assetId: assetId,
    });

    successMessage.textContent = "Loan was successfully requested";
    successMessage.style.display = "block";

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 20000);

  } catch (error) {
    console.log("Error:", error);
  }
};
