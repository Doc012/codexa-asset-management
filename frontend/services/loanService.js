// ─── Loan Service ─────────────────────────────────────────────────────────────
import { apiFetch } from "../assets/js/apiFetch.js";

export async function getAllLoans() {
    const response = await apiFetch(`/loans`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function getLoanById(id) {
    const response = await apiFetch(`/loans/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function getLoansByUser(userId) {
    const response = await apiFetch(`/loans/user/${userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function getLoansByStatus(statusValue) {
    const response = await apiFetch(`/loans/status?status=${statusValue}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function createLoan(loanData) {
    const response = await apiFetch(`/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function cancelLoan(id) {
    const response = await apiFetch(`/loans/cancel/${id}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();

}

export async function approveLoan(id) {
    const response = await apiFetch(`/loans/approve/${id}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function checkoutLoan(id) {
    const response = await apiFetch(`/loans/checkout/${id}`, {
        method: "PUT"
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function rejectLoan(id) {
    const response = await apiFetch(`/loans/reject/${id}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function returnLoan(id) {
    const response = await apiFetch(`/loans/return/${id}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function deleteLoan(id) {
    const response = await apiFetch(`/loans/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
}
