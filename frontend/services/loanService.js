import { apiFetch } from "../assets/js/apiFetch.js";

/**
 * Fetches all loan records from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of all loan objects.
 */
export async function getAllLoans() {
    const response = await apiFetch(`/loans`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Fetches a single loan record by its unique identifier.
 * @param {string|number} id - The ID of the loan to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the loan object.
 */
async function getLoanById(id) {
    const response = await apiFetch(`/loans/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Fetches all loans associated with a specific user ID.
 * @param {string|number} userId - The ID of the user whose loans are being retrieved.
 * @returns {Promise<Array>} A promise that resolves to an array of loan objects for the user.
 */
export async function getLoansByUser(userId) {
    const response = await apiFetch(`/loans/user/${userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Fetches all loans matching a given status value.
 * @param {string} statusValue - The status filter parameter value.
 * @returns {Promise<Array>} A promise that resolves to an array of matching loan objects.
 */
export async function getLoansByStatus(statusValue) {
    const response = await apiFetch(`/loans/status?status=${statusValue}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Submits a request to create a new loan configuration.
 * @param {Object} loanData - The data payload properties for the new loan.
 * @returns {Promise<Object>} A promise that resolves to the newly created loan object.
 */
export async function createLoan(loanData) {
    const response = await apiFetch(`/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Transitions a loan's status state to cancelled.
 * @param {string|number} id - The ID of the target loan record.
 * @returns {Promise<Object>} A promise that resolves to the updated loan object context.
 */
export async function cancelLoan(id) {
    const response = await apiFetch(`/loans/cancel/${id}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Transitions a loan's status state to approved.
 * @param {string|number} id - The ID of the target loan record.
 * @returns {Promise<Object>} A promise that resolves to the updated loan object context.
 */
export async function approveLoan(id) {
    const response = await apiFetch(`/loans/approve/${id}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Updates a loan's state to reflect an active physical checkout event.
 * @param {string|number} id - The ID of the target loan record.
 * @returns {Promise<Object>} A promise that resolves to the updated loan object context.
 */
export async function checkoutLoan(id) {
    const response = await apiFetch(`/loans/checkout/${id}`, {
        method: "PUT"
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Transitions a loan's status state to rejected.
 * @param {string|number} id - The ID of the target loan record.
 * @param {string} reason - The reason for rejecting the loan request.
 * @returns {Promise<Object>} A promise that resolves to the updated loan object context.
 */
export async function rejectLoan(id, reason) {
    const response = await apiFetch(`/loans/reject/${id}?reason=${encodeURIComponent(reason)}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Updates a loan's state to reflect a returned physical asset event.
 * @param {string|number} id - The ID of the target loan record.
 * @returns {Promise<Object>} A promise that resolves to the updated loan object context.
 */
export async function returnLoan(id) {
    const response = await apiFetch(`/loans/return/${id}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

/**
 * Permanently deletes a loan tracking record entry by ID.
 * @param {string|number} id - The ID of the loan entry to destroy.
 * @returns {Promise<boolean>} A promise that resolves to true if deletion succeeded.
 */
async function deleteLoan(id) {
    const response = await apiFetch(`/loans/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
}