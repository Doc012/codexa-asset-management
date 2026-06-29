const sidebar =
    document.getElementById("sidebar");

document.getElementById("menuBtn")
    .addEventListener("click", () => {

        if (window.innerWidth <= 768) {

            sidebar.classList.toggle("open");

        } else {

            sidebar.classList.toggle("collapsed");
        }
    });

const themeBtn =
    document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    const current =
        document.documentElement
            .getAttribute("data-theme");

    const next =
        current === "dark"
            ? "light"
            : "dark";

    document.documentElement
        .setAttribute("data-theme", next);

    localStorage.setItem(
        "theme",
        next
    );
});

const saved =
    localStorage.getItem("theme");

if (saved) {

    document.documentElement
        .setAttribute("data-theme", saved);
}

new Chart(
    document.getElementById("assetChart"),
    {
        type: "line",
        data: {
            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun"
            ],
            datasets: [{
                label: "Assets",
                data: [
                    300,
                    450,
                    600,
                    850,
                    1000,
                    1248
                ]
            }]
        }
    });

new Chart(
    document.getElementById("categoryChart"),
    {
        type: "doughnut",
        data: {
            labels: [
                "Laptops",
                "Monitors",
                "Printers",
                "Desktops"
            ],
            datasets: [{
                data: [
                    45,
                    25,
                    10,
                    20
                ]
            }]
        }
    });