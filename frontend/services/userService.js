async function getAllUsers() {
    const response = await fetch(
        `${API_BASE_URL}/users`
    );

    return await response.json();
}