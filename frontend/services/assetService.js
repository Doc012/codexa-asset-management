import { apiFetch } from "../assets/js/apiFetch.js";

/**
 * Fetches all assets from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of all asset objects.
 */
export async function getAllAssets() {
    const response = await apiFetch(`/assets`);
    return await response.json();
}

/**
 * Fetches a single asset by its unique identifier.
 * @param {string|number} id - The ID of the asset to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the asset object.
 */
export async function getAssetById(id) {
    const response = await apiFetch(`/assets/${id}`);
    
    return await response.json();
}

/**
 * Fetches an asset by its unique serial number.
 * @param {string} serialNumber - The serial number of the asset.
 * @returns {Promise<Object>} A promise that resolves to the found asset object.
 */
export async function getAssetBySerial(serialNumber) {
    const response = await apiFetch(`/assets/serial/${serialNumber}`);
    
    return await response.json();
}

/**
 * Fetches all assets belonging to a specified category.
 * @param {string} category - The category name to filter by.
 * @returns {Promise<Array>} A promise that resolves to an array of assets in the category.
 */
export async function getAssetsByCategory(category) {
    const response = await apiFetch(`/assets/category/${category}`);
    
    return await response.json();
}

/**
 * Submits a request to create a new asset record.
 * @param {Object} assetData - The properties and values of the new asset.
 * @returns {Promise<Object>} A promise that resolves to the newly created asset object.
 */
export async function createAsset(assetData, imageFile) {
    const formData = new FormData();

    formData.append("asset", new Blob(
        [JSON.stringify(assetData)],
        { type: "application/json" }
    ));

    if (imageFile) {
        formData.append("file", imageFile);
    }

    const res = await apiFetch("/assets", {
        method: "POST",
        body: formData,
        headers: {},
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}

/**
 * Updates the fields of an existing asset record by ID.
 * @param {string|number} id - The ID of the asset to modify.
 * @param {Object} assetData - The updated asset data properties.
 * @returns {Promise<Object>} A promise that resolves to the updated asset object.
 */
export async function updateAsset(id, assetData, imageFile) {
    const formData = new FormData();

    formData.append("asset", new Blob(
        [JSON.stringify(assetData)],
        { type: "application/json" }
    ));

    if (imageFile) {
        formData.append("file", imageFile);
    }

    const res = await apiFetch(`/assets/${id}`, {
        method: "PUT",
        body: formData,
        headers: {},
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}

/**
 * Permanently removes an asset record from the database by ID.
 * @param {string|number} id - The ID of the asset to destroy.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion succeeded.
 */
export async function deleteAsset(id) {
    const response = await apiFetch(`/assets/${id}`, {
        method: 'DELETE'
    });
    
    return true;
}

/**
 * Fetches all assets that match a given condition state.
 * @param {string} condition - The condition label to filter by.
 * @returns {Promise<Array>} A promise that resolves to an array of assets matching the condition.
 */
export async function getAssetsByCondition(condition){
    const response = await apiFetch(`/assets/condition/${condition}`);
    
    return await response.json();
}

/**
 * Transition an asset's status to a retired state.
 * @param {string|number} id - The ID of the asset to retire.
 * @returns {Promise<boolean>} A promise that resolves to true if the transition succeeded.
 */
export async function retireAsset(id) {
    const response = await apiFetch(`/assets/${id}/retire`, {
        method: 'PUT'
    });
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
}

/**
 * Reverts a retired or archived asset back into active inventory.
 * @param {string|number} id - The ID of the asset to restore.
 * @returns {Promise<boolean>} A promise that resolves to true if the restoration succeeded.
 */
export async function restoreAsset(id) {
    const response = await apiFetch(`/assets/${id}/restore`, {
        method: 'PUT'
    });
    
    return true;
}

/**
 * Fetches all currently active assets, excluding retired or archived entries.
 * @returns {Promise<Array>} A promise that resolves to an array of active asset objects.
 */
export async function getActiveAssets() {
    const response = await apiFetch(`/assets/active`);
    
    return await response.json();
}