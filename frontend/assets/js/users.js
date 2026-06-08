async function getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("user-table-body");

    try {
        const users = await getAllUsers();
        tableBody.innerHTML = ""; // Clear loader

        users.forEach(user => {
            const row = document.createElement("tr");
            
            // Explicitly map properties to your JSON response keys
            row.innerHTML = `
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.department}</td>
                <td><strong>${user.role}</strong></td>
            `;
            
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to render users:", error);
        tableBody.innerHTML = `<tr><td colspan="4" style="color: red;">Error: ${error.message}</td></tr>`;
    }
});
