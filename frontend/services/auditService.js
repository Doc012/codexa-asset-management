// ─── Audit Log Service ────────────────────────────────────────────────────────

async function getAllLogs() {
    const response = await fetch(`${API_BASE_URL}/logs`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function getLogById(id) {
    const response = await fetch(`${API_BASE_URL}/logs/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function createLog(logData) {
    const response = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}