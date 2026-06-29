import { apiFetch } from "../assets/js/apiFetch.js";

/**
 * Fetches all audit logs from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of all log objects.
 */
export async function getAllLogs() {
    const response = await apiFetch(`/logs`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Fetches a single audit log by its unique identifier.
 * @param {string|number} id - The ID of the log entry to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the log entry object.
 */
async function getLogById(id) {
    const response = await apiFetch(`/logs/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Fetches all audit logs associated with a specific user ID.
 * @param {string|number} id - The ID of the user whose logs are being retrieved.
 * @returns {Promise<Array>} A promise that resolves to an array of log objects for the user.
 */
export async function getUserLogsById(id) {
    const response = await apiFetch(`/logs/user/${id}`);
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Fetches all audit logs visible or restricted to manager-level roles.
 * @returns {Promise<Array>} A promise that resolves to an array of manager logs.
 */
export async function getAllManagerLogs(){
    const response = await apiFetch(`/logs/manager`);
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Submits a request to create a new audit log record.
 * @param {Object} logData - The properties and payload values of the new log entry.
 * @returns {Promise<Object>} A promise that resolves to the newly created log object.
 */
async function createLog(logData) {
    const response = await apiFetch(`/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}