const API_URL = "http://localhost:8080/api/v1/assets";

const assetCarousel =
document.getElementById("assetCarousel");

document.addEventListener("DOMContentLoaded", () => {

    loadAssets();
    initializeCarousel();

});

async function loadAssets() {

    try {

        const response =
        await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load assets");
        }

        const assets =
        await response.json();

        renderAssets(assets);

    } catch(error) {

        console.error(error);

        assetCarousel.innerHTML = `
            <div class="error-card">
                Failed to load assets.
            </div>
        `;

    }

}

function renderAssets(assets) {

    assetCarousel.innerHTML = "";

    assets.forEach(asset => {

        const available =
            asset.assetStatus === "AVAILABLE" ||
            asset.assetStatus === null;

        assetCarousel.innerHTML += `

        <div class="asset-card ${available ? '' : 'unavailable'}">

            <div class="asset-image">

                <img
                    src="${asset.photoPath}"
                    alt="${asset.title}"
                >

                ${
                    available
                    ?
                    `
                    <span class="asset-status">
                        AVAILABLE
                    </span>
                    `
                    :
                    `
                    <div class="asset-overlay">
                        ${asset.assetStatus}
                    </div>
                    `
                }

            </div>

            <div class="asset-details">

                <div class="asset-title">
                    ${asset.title}
                </div>

                <div class="asset-meta">
                    ${asset.category}
                </div>

                <div class="asset-meta">
                    ${asset.condition}
                </div>

                <div class="asset-meta">
                    ${asset.serialNumber}
                </div>

                <div class="asset-meta">
                     ${asset.location}
                </div>

                <button
                    class="request-btn"
                    data-id="${asset.assetId}"
                    ${!available ? 'disabled' : ''}
                >
                    ${
                        available
                        ?
                        'Request Loan'
                        :
                        'Unavailable'
                    }
                </button>

            </div>

        </div>

        `;

    });

}

function attachRequestHandlers() {

    document
    .querySelectorAll(".request-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const assetId =
            button.dataset.id;

            openLoanModal(assetId);

        });

    });

}

function openLoanModal(assetId) {

    const modal =
    document.getElementById("btnConfirmation");

    const confirmBtn =
    document.getElementById("confirmBtn");

    modal.style.display = "flex";

    confirmBtn.onclick = async () => {

        try {

            console.log(
                "Request loan for asset:",
                assetId
            );

            modal.style.display = "none";

        }
        catch(error) {

            console.error(error);

        }

    };

}

function initializeCarousel() {

    const carousel =
    document.getElementById("assetCarousel");

    const leftBtn =
    document.querySelector(".left-arrow");

    const rightBtn =
    document.querySelector(".right-arrow");

    leftBtn?.addEventListener("click", () => {

        carousel.scrollBy({
            left: -400,
            behavior: "smooth"
        });

    });

    rightBtn?.addEventListener("click", () => {

        carousel.scrollBy({
            left: 400,
            behavior: "smooth"
        });

    });

}