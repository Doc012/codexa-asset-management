// ─── Loan Service ─────────────────────────────────────────────────────────────
import { API_BASE_URL } from "../assets/js/config.js";

export async function getAllLoans() {
    const response = await fetch(`${API_BASE_URL}/loans`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function getLoanById(id) {
    const response = await fetch(`${API_BASE_URL}/loans/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function getLoansByUser(userId) {
    const response = await fetch(`${API_BASE_URL}/loans/user/${userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function getLoansByStatus(statusValue) {
    const response = await fetch(`${API_BASE_URL}/loans/status?status=${statusValue}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function createLoan(loanData) {
    const response = await fetch(`${API_BASE_URL}/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function approveLoan(id) {
    const response = await fetch(`${API_BASE_URL}/loans/${id}/approve`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function rejectLoan(id) {
    const response = await fetch(`${API_BASE_URL}/loans/${id}/reject`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function returnLoan(id) {
    const response = await fetch(`${API_BASE_URL}/loans/${id}/return`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function deleteLoan(id) {
    const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
}

import { API_BASE_URL } from "../config.js";

export async function getAllLoans() {
    const response = await fetch(`${API_BASE_URL}/loans`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function getLoanById(id) {
    const response = await fetch(`${API_BASE_URL}/loans/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function getLoansByUser(userId) {
    const response = await fetch(`${API_BASE_URL}/loans/user/${userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function createLoan(loanData) {
    const response = await fetch(`${API_BASE_URL}/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function returnLoan(id) {
    const response = await fetch(`${API_BASE_URL}/loans/${id}/return`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function deleteLoan(id) {
    const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
}