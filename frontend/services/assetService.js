// ─── Asset Service ────────────────────────────────────────────────────────────
import { API_BASE_URL } from "../assets/js/config.js";

export async function getAllAssets() {
    const response = await fetch(`${API_BASE_URL}/assets`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function getAssetById(id) {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function getAssetById(id) {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function getAssetBySerial(serialNumber) {
    const response = await fetch(`${API_BASE_URL}/assets/serial/${serialNumber}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function getAssetsByCategory(category) {
    const response = await fetch(`${API_BASE_URL}/assets/category/${category}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function createAsset(assetData) {
    const response = await fetch(`${API_BASE_URL}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function updateAsset(id, assetData) {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

export async function deleteAsset(id) {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
}