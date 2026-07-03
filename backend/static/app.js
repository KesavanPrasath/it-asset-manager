const API_URL = '/api/assets';

// READ: Pull assets from API and draw them inside the table body
async function loadAssets() {
    const response = await fetch(API_URL);
    const assets = await response.json();
    const tableBody = document.getElementById('assetTableBody');
    tableBody.innerHTML = ''; 

    assets.forEach(asset => {
        // Determine the color class using a clean student-style helper function
        const badgeClass = getStatusClass(asset.status);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" id="name-${asset.serial}" value="${asset.name}"></td>
            <td>${asset.serial}</td>
            <td>
                <div class="badge-wrapper">
                    <input type="text" id="status-${asset.serial}" class="status-badge ${badgeClass}" value="${asset.status}" onchange="loadAssets()">
                </div>
            </td>
            <td>
                <button onclick="updateAsset('${asset.serial}')">Save Changes</button>
                <button onclick="deleteAsset('${asset.serial}')">Remove</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Helper function for specific CSS badge colors
// Helper function for specific CSS badge colors
function getStatusClass(statusText) {
    if (!statusText) return '';
    
    const status = statusText.toLowerCase().trim();
    
    if (status === 'available' || status === 'in stock') {
        return 'status-available';
    } else if (status === 'in use' || status === 'deployed') {
        return 'status-inuse';
    } else if (status === 'maintenance') {
        return 'status-maintenance';
    } else if (status === 'broken') {
        return 'status-broken';
    }
    
    return ''; // Fallback default if nothing matches
}
// CREATE: Extract form inputs and submit stringified objects via POST method
async function createAsset() {
    const name = document.getElementById('assetName').value;
    const serial = document.getElementById('assetSerial').value;
    const status = document.getElementById('assetStatus').value;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, serial, status })
    });

    if (response.ok) {
        loadAssets(); 
        document.getElementById('assetName').value = '';
        document.getElementById('assetSerial').value = '';
        document.getElementById('assetStatus').value = '';
    } else {
        alert('Could not add device. Verify required entry parameters.');
    }
}

// UPDATE: Identify item row targets and submit current details via PUT method
async function updateAsset(serial) {
    const updatedName = document.getElementById(`name-${serial}`).value;
    const updatedStatus = document.getElementById(`status-${serial}`).value;

    const response = await fetch(`${API_URL}/${serial}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedName, status: updatedStatus })
    });

    if (response.ok) {
        alert('Device status updated successfully.');
        loadAssets();
    }
}

// DELETE: Issue targeted server instructions via DELETE method
async function deleteAsset(serial) {
    if (confirm('Permanently delete this record?')) {
        const response = await fetch(`${API_URL}/${serial}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadAssets();
        }
    }
}

// FRONTEND FILTER: Real-time query search matching against existing DOM elements
function filterAssets() {
    const query = document.getElementById('assetSearch').value.toLowerCase();
    const tableBody = document.getElementById('assetTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const nameField = row.querySelector('input[id^="name-"]');
        const statusField = row.querySelector('input[id^="status-"]');
        const serialCode = row.cells[1].textContent.toLowerCase();

        const nameValue = nameField ? nameField.value.toLowerCase() : '';
        const statusValue = statusField ? statusField.value.toLowerCase() : '';

        if (nameValue.includes(query) || serialCode.includes(query) || statusValue.includes(query)) {
            row.style.display = ''; 
        } else {
            row.style.display = 'none'; 
        }
    }
}

// Ensure table records draw upon page render
window.onload = loadAssets;