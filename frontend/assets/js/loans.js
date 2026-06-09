// === Sidebar toggle ===
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

// === Sidebar navigation ===
document.querySelectorAll(".sidebar li").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelector(".sidebar .active")?.classList.remove("active");
    item.classList.add("active");
    loadContent(item.textContent.trim());
  });
});

// === Load content dynamically ===
function loadContent(section) {
  const content = document.getElementById("mainContent");
  switch(section) {
    case "💻 My Assets":
      content.innerHTML = `
        <section class="dashboard-grid">
          <div class="panel">
            <div class="panel-header"><h2>My Assets</h2></div>
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody id="assetTable"></tbody>
            </table>
          </div>
          <div class="panel">
            <div class="panel-header"><h2>Recent Activity</h2></div>
            <div class="activity-list">
              <div class="activity-item">Asset request submitted</div>
              <div class="activity-item">Laptop approved</div>
              <div class="activity-item">Return reminder sent</div>
            </div>
          </div>
        </section>`;
      loadAssets();
      break;
    case "📋 Request Asset":
      content.innerHTML = "<h2>Request Asset Page</h2><p>Form to request assets.</p>";
      break;
    case "🔄 My Loans":
      content.innerHTML = "<h2>Loans Page</h2><p>Loan details here.</p>";
      break;
    case "📦 Returns":
      content.innerHTML = "<h2>Returns Page</h2><p>Return items here.</p>";
      break;
    case "📊 Reports":
      content.innerHTML = "<h2>Reports Page</h2><p>Reports and analytics.</p>";
      break;
    case "⚙ Settings":
      content.innerHTML = "<h2>Settings Page</h2><p>User preferences here.</p>";
      break;
    default:
      content.innerHTML = "<h2>Dashboard</h2><p>Overview of system.</p>";
  }
}

// === Profile dropdown opens on click ===
// Profile dropdown toggle
const profileMenu = document.getElementById("profileMenu");
profileMenu.addEventListener("click", () => {
  profileMenu.classList.toggle("open");
});


// === AI panel slide in/out ===
const aiBtn = document.getElementById("aiBtn");
const aiPanel = document.getElementById("aiPanel");
const closeBtn = document.getElementById("closeAi");
const mainContent = document.getElementById("mainContent");

aiBtn.addEventListener("click", () => {
  aiPanel.classList.add("open");
  mainContent.classList.add("shifted");
});

closeBtn.addEventListener("click", () => {
  aiPanel.classList.remove("open");
  mainContent.classList.remove("shifted");
});

// === AI chat functionality ===
document.querySelector(".submit-btn").addEventListener("click", () => {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");
  const userMsg = input.value.trim();
  if(userMsg) {
    chatBox.innerHTML += `<div><strong>You:</strong> ${userMsg}</div>`;
    chatBox.innerHTML += `<div><strong>AI:</strong> Let me help you with "${userMsg}"...</div>`;
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

// Dictate button placeholder
document.querySelector(".dictate-btn").addEventListener("click", () => {
  alert("Voice dictation feature coming soon!");
});

// Attach button placeholder
document.querySelector(".attach-btn").addEventListener("click", () => {
  alert("Attachment upload feature coming soon!");
});

// === Load assets from database ===
const API = "http://localhost:8080/api/v1/loans"; // Example DB API endpoint
const API_URL = "http://localhost:8080/api/v1/assets";

async function loadAssets(){
  try {
    const response = await fetch(API);
    if(!response.ok) throw new Error("Failed to load assets");

    const assets = await response.json();
    const table = document.getElementById("assetTable");
    if(!table) return;

    table.innerHTML = "";
    assets.forEach(asset => {
      table.innerHTML += `
        <tr>
          <td>${asset.name || "undefined"}</td>
          <td>${asset.category || "undefined"}</td>
          <td>${asset.status}</td>
          <td>${asset.dueDate || "-"}</td>
        </tr>`;
    });
  } catch(error) {
    console.error(error);
  }
}

// // === Load assets from database ===
// const API = "http://localhost:8080/api/v1/assets"; // Adjust endpoint if needed

async function loadAssets(){
  try {
    const response = await fetch(API);
    if(!response.ok) throw new Error("Failed to load assets");

    const assets = await response.json();
    const table = document.getElementById("assetTable");
    if(!table) return;

    table.innerHTML = "";
    assets.forEach(asset => {
      table.innerHTML += `
        <tr>
          <td>${asset.name || "—"}</td>
          <td>${asset.category || "—"}</td>
          <td><span class="status ${asset.status.toLowerCase()}">${asset.status}</span></td>
          <td>${asset.dueDate || "—"}</td>
        </tr>`;
    });
  } catch(error) {
    console.error(error);
  }
}


// === Prevent full page reload on refresh ===
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = '';
});
