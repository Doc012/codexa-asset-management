document.addEventListener("DOMContentLoaded", () => {
    const navButton = document.getElementById("nav-button");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector("main");
    const headerProfile = document.getElementById("header-profile");

    // Check if the user closed the sidebar during a previous visit
    if (localStorage.getItem("sidebar-collapsed") === "true") {
        applyCollapse();
    }

    if (navButton) {
        navButton.addEventListener("click", () => {
            // Toggle classes on click
            sidebar.classList.toggle("collapsed");
            mainContent.classList.toggle("collapsed");
            headerProfile.classList.toggle("collapsed");
            navButton.classList.toggle("collapsed");

            // Save the state to memory so it stays across page refreshes
            const isCollapsed = sidebar.classList.contains("collapsed");
            localStorage.setItem("sidebar-collapsed", isCollapsed);
        });
    }

    function applyCollapse() {
        sidebar.classList.add("collapsed");
        mainContent.classList.add("collapsed");
        headerProfile.classList.add("collapsed");
        navButton.classList.add("collapsed");
    }
});
