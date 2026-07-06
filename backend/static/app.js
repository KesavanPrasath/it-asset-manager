const API_URL = '/api/assets';

// READ: Pull assets from API and draw them inside the table body
async function loadAssets() {
    const response = await fetch(API_URL);
    const assets = await response.json();
    const tableBody = document.getElementById('assetTableBody');
    tableBody.innerHTML = ''; 

    assets.forEach(asset => {
        // Determine the color class using helping function
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
       
                <button class="btn-action-save" onclick="updateAsset('${asset.serial}')">Save Changes</button>
                <button class="btn-action-remove" onclick="deleteAsset('${asset.serial}')">Remove</button>
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

// Ensuring table records draw upon page render
window.onload = loadAssets;

// UTILITY: Parses active DOM inventory items and downloads a formatted CSV audit report
function exportCSVReport() {
    const tableBody = document.getElementById('assetTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    
    // Check if there is actual data to export
    if (rows.length === 0) {
        alert('No asset inventory records available to export.');
        return;
    }

    // Set up the CSV headers
    let csvContent = "Device Name,Serial Number,Current Status\n";

    // Loop over each row inside the visible table array
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        // Skiped hidden rows if the user filtered the view
        if (row.style.display === 'none') continue;

        // Extract values accurately from inputs and text cells
        const nameInput = row.querySelector('input[id^="name-"]');
        const statusInput = row.querySelector('input[id^="status-"]');
        
        const name = nameInput ? nameInput.value.replace(/,/g, "") : "";
        const serial = row.cells[1] ? row.cells[1].textContent.trim() : "";
        const status = statusInput ? statusInput.value.trim() : "";

        // Append line item
        csvContent += `${name},${serial},${status}\n`;
    }

    // Created a data blob link and trigger a native browser download block
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "Sysco_Labs_IT_Asset_Report.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}