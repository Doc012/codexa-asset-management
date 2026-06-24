document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".settings-tab-btn");
  const panels = document.querySelectorAll(".settings-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active state from all tabs
      tabButtons.forEach((b) => b.classList.remove("active"));
      // Hide all panels
      panels.forEach((p) => p.classList.remove("active-panel"));

      // Activate clicked tab
      btn.classList.add("active");

      // Show corresponding panel
      const targetId = btn.dataset.target; // same as getAttribute("data-target")
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active-panel");
      }
    });
  });
});
