// ─── Audit Log Service ────────────────────────────────────────────────────────
import { apiFetch } from "../assets/js/apiFetch.js";

export async function getAllLogs() {
    const response = await apiFetch(`/logs`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function getLogById(id) {
    const response = await apiFetch(`/logs/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function getUserLogsById(id) {
    const response = await apiFetch(`/logs/user/${id}`);
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function getAllManagerLogs(){
    const response = await apiFetch(`/logs/manager`);
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function createLog(logData) {
    const response = await apiFetch(`/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}