// import { getAllAssets,

//  } from "../../services/assetService.js";

// // get all assets
// document.addEventListener("DOMContentLoaded", async () => {
//     const tableBody = document.getElementById("asset-table-body");

//     try {
//         const { getAllAssets } = await import("../../services/assetService.js")
//         const assets = await getAllAssets();
//         tableBody.innerHTML = "";

//         assets.forEach(asset => {
//             const row = document.createElement("tr");

//             row.innerHTML = `
//                 <td>${asset.title}</td>
//                 <td>${asset.category}</td>
//                 <td>${asset.serialNumber}</td>
//                 <td>${asset.acquisitionDate}</td>
//                 <td>${asset.cost}</td>
//                 <td>${asset.location}</td>
//                 <td>${asset.condition}</td>
//                 <td>${asset.photoPath}</td>
//             `;

//             tableBody.appendChild(row);
//         });

//     } catch(error) {
//         console.error("Failed to render ASSETS", error);
//         tableBody.innerHTML = `<tr><td colspan = "8" style="color: red";> Error: ${error.message}</td></tr>`;
//     }
// })

// const form = document.getElementById("create-asset-form");
// form.addEventListener("submit", async(e) => {
//     e.preventDefault;

//     const formData = new FormData(form);

//     const assetData = {
//         title: formData.get("title"),
//         category: formData.get("category"),
//         serialNumber: formData.get("serialNumber"),
//         acquisitionDate: formData.get("acquisitionDate"),
//         cost: parseFloat(formData.get("cost")),
//         location: formData.get("location"),
//         condition: formData.get("condition"),
//         photoPath: formData.get("photoPath"),
//     };

//     try {
//         await createAsset(assetData);
//         alert("Asset Created Successfully");

//         window.location.href = "assets.html"
//     } catch(error){
//         alert(error.message)
//     }
// })

import {
  getAllAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from '../../services/assetService.js';

let selectedAssetId = null;

// Load data on page load
window.onload = loadAssets;

// ✅ LOAD ALL
async function loadAssets() {
  try {
    const assets = await getAllAssets();

    const list = document.getElementById('assetList');
    list.innerHTML = '';

    assets.forEach((asset) => {
      const li = document.createElement('li');

      li.innerHTML = `
                <strong>${asset.title}</strong> (${asset.category})
                <br>
                Serial: ${asset.serialNumber}
                <br>
                Cost: ${asset.cost}
                <br>
                <button onclick="editAsset(${asset.assetId})">Edit</button>
                <button onclick="removeAsset(${asset.assetId})">Delete</button>
                <hr>
            `;

      list.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading assets:', error);
  }
}

// ✅ SAVE (CREATE / UPDATE)
window.saveAsset = async function () {
  const asset = {
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    serialNumber: document.getElementById('serialNumber').value,
    acquisitionDate: document.getElementById('acquisitionDate').value,
    cost: parseFloat(document.getElementById('cost').value),
    location: document.getElementById('location').value,
    condition: document.getElementById('condition').value,
    photoPath: document.getElementById('photoPath').value,
  };

  try {
    if (selectedAssetId) {
      await updateAsset(selectedAssetId, asset);
    } else {
      await createAsset(asset);
    }

    clearForm();
    loadAssets();
  } catch (error) {
    console.error('Save failed:', error);
  }
};

// ✅ EDIT
window.editAsset = async function (id) {
  try {
    const asset = await getAssetById(id);

    selectedAssetId = id;

    document.getElementById('title').value = asset.title;
    document.getElementById('category').value = asset.category;
    document.getElementById('serialNumber').value = asset.serialNumber;
    document.getElementById('acquisitionDate').value = asset.acquisitionDate;
    document.getElementById('cost').value = asset.cost;
    document.getElementById('location').value = asset.location;
    document.getElementById('condition').value = asset.condition;
    document.getElementById('photoPath').value = asset.photoPath;
  } catch (error) {
    console.error('Edit failed:', error);
  }
};

// ✅ DELETE
window.removeAsset = async function (id) {
  try {
    await deleteAsset(id);
    loadAssets();
  } catch (error) {
    console.error('Delete failed:', error);
  }
};

// ✅ CLEAR FORM
function clearForm() {
  selectedAssetId = null;
  document.querySelectorAll('input').forEach((i) => (i.value = ''));
}
