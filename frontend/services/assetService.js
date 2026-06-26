
import { apiFetch } from "../assets/js/apiFetch.js";

export async function getAllAssets() {
    const response = await apiFetch(`/assets`);
    return await response.json();
}

// export async function getAllAssetsForUsers(users) {
//     const response = await apiFetch(`/assets/user`);
//     if(!response.ok) throw new Error(`HTTP ${response.status}`);
//     return await response.json();
// }

export async function getAssetById(id) {
    const response = await apiFetch(`/assets/${id}`);
    
    return await response.json();
}

// export async function getAssetById(id) {
//     const response = await apiFetch(`/assets/${id}`);
//     
//     return await response.json();
// }

export async function getAssetBySerial(serialNumber) {
    const response = await apiFetch(`/assets/serial/${serialNumber}`);
    
    return await response.json();
}

export async function getAssetsByCategory(category) {
    const response = await apiFetch(`/assets/category/${category}`);
    
    return await response.json();
}

export async function createAsset(assetData) {
    const response = await apiFetch(`/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
    });
    
    return await response.json();
}

export async function updateAsset(id, assetData) {
    const response = await apiFetch(`/assets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
    });
    
    return await response.json();
}

export async function deleteAsset(id) {
    const response = await apiFetch(`/assets/${id}`, {
        method: 'DELETE'
    });
    
    return true;
}

export async function getAssetsByCondition(condition){
    const response = await apiFetch(`/assets/condition/${condition}`);
    
    return await response.json();
}

export async function retireAsset(id) {
    const response = await apiFetch(`/assets/${id}/retire`, {
        method: 'PUT'
    });
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
}

export async function restoreAsset(id) {
    const response = await apiFetch(`/assets/${id}/restore`, {
        method: 'PUT'
    });
    
    return true;
}


export async function getActiveAssets() {
    const response = await apiFetch(`/assets/active`);
    
    return await response.json();
}

