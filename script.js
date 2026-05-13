// Simple Attendance System
let staff = [];
let attendance = [];

// Load data from localStorage
function loadData() {
    let savedStaff = localStorage.getItem('staff');
    let savedAttendance = localStorage.getItem('attendance');
    
    if (savedStaff) {
        staff = JSON.parse(savedStaff);
    } else {
        staff = [];
    }
    
    if (savedAttendance) {
        attendance = JSON.parse(savedAttendance);
    } else {
        attendance = [];
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('staff', JSON.stringify(staff));
    localStorage.setItem('attendance', JSON.stringify(attendance));
}

// Show today's date
function showDate() {
    let today = new Date();
    let dateString = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear();
    let dateElem = document.getElementById('date');
    if (dateElem) {
        dateElem.textContent = dateString;
    }
}

// Display staff with checkboxes (for index.html)
function displayStaffForAttendance() {
    let container = document.getElementById('staffList');
    if (!container) return;
    
    loadData();
    
    let today = new Date();
    let todayString = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear();
    
    // Find today's attendance record
    let todayRecord = null;
    for (let i = 0; i < attendance.length; i++) {
        if (attendance[i].date === todayString) {
            todayRecord = attendance[i];
            break;
        }
    }
    
    if (staff.length === 0) {
        container.innerHTML = '<p>No staff added yet. Go to Manage Staff to add people.</p>';
        return;
    }
    
    let html = '<h3>Mark Attendance</h3>';
    for (let i = 0; i < staff.length; i++) {
        let isChecked = false;
        if (todayRecord && todayRecord.records[staff[i].name]) {
            isChecked = true;
        }
        html += '<div>';
        html += staff[i].name + ' (' + staff[i].role + ') ';
        html += '<label>Present: <input type="checkbox" id="chk_' + i + '" ' + (isChecked ? 'checked' : '') + '></label>';
        html += '</div>';
    }
    
    container.innerHTML = html;
}

// Save attendance
function saveAttendance() {
    loadData();
    
    let today = new Date();
    let todayString = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear();
    
    let records = {};
    for (let i = 0; i < staff.length; i++) {
        let chk = document.getElementById('chk_' + i);
        if (chk) {
            records[staff[i].name] = chk.checked;
        }
    }
    
    // Check if we already have a record for today
    let found = false;
    for (let i = 0; i < attendance.length; i++) {
        if (attendance[i].date === todayString) {
            attendance[i].records = records;
            found = true;
            break;
        }
    }
    
    if (!found) {
        attendance.push({
            date: todayString,
            records: records
        });
    }
    
    saveData();
    alert('Attendance saved successfully!');
}

// Add staff (for staff.html)
function addStaff() {
    let nameInput = document.getElementById('staffName');
    let roleInput = document.getElementById('staffRole');
    
    let name = nameInput ? nameInput.value : '';
    let role = roleInput ? roleInput.value : '';
    
    if (name && role) {
        loadData();
        staff.push({ name: name, role: role });
        saveData();
        displayStaffList();
        
        if (nameInput) nameInput.value = '';
        if (roleInput) roleInput.value = '';
    } else {
        alert('Please enter both name and role');
    }
}

// Display staff list (for staff.html)
function displayStaffList() {
    let container = document.getElementById('staffList');
    if (!container) return;
    
    loadData();
    
    if (staff.length === 0) {
        container.innerHTML = '<p>No staff members added yet.</p>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < staff.length; i++) {
        html += '<div>';
        html += staff[i].name + ' - ' + staff[i].role;
        html += ' <button onclick="removeStaff(' + i + ')">Remove</button>';
        html += '</div>';
    }
    container.innerHTML = html;
}

// Remove staff
function removeStaff(index) {
    if (confirm('Remove this staff member?')) {
        loadData();
        staff.splice(index, 1);
        saveData();
        displayStaffList();
    }
}

// Generate report (for reports.html)
function generateReport() {
    let startInput = document.getElementById('startDate');
    let endInput = document.getElementById('endDate');
    let container = document.getElementById('reportResult');
    
    if (!startInput || !endInput || !container) return;
    
    let start = startInput.value;
    let end = endInput.value;
    
    if (!start || !end) {
        container.innerHTML = '<p>Please select both start and end dates</p>';
        return;
    }
    
    loadData();
    
    // Convert dates for comparison
    let startParts = start.split('-');
    let endParts = end.split('-');
    let startDateStr = parseInt(startParts[2]) + '/' + parseInt(startParts[1]) + '/' + startParts[0];
    let endDateStr = parseInt(endParts[2]) + '/' + parseInt(endParts[1]) + '/' + endParts[0];
    
    // Filter attendance by date range
    let filteredAttendance = [];
    for (let i = 0; i < attendance.length; i++) {
        let attDate = attendance[i].date;
        let attParts = attDate.split('/');
        let attDateStr = attParts[2] + '-' + attParts[1] + '-' + attParts[0];
        
        if (attDateStr >= start && attDateStr <= end) {
            filteredAttendance.push(attendance[i]);
        }
    }
    
    if (filteredAttendance.length === 0) {
        container.innerHTML = '<p>No attendance records in this period. Make sure you have saved attendance for these dates.</p>';
        return;
    }
    
    // Build report table
    let html = '<h3>Attendance Report</h3>';
    html += '<table border="1">';
    html += '<tr><th>Date</th>';
    
    for (let i = 0; i < staff.length; i++) {
        html += '<th>' + staff[i].name + '</th>';
    }
    html += '</tr>';
    
    for (let i = 0; i < filteredAttendance.length; i++) {
        html += '<tr>';
        html += '<td>' + filteredAttendance[i].date + '</td>';
        for (let j = 0; j < staff.length; j++) {
            let present = filteredAttendance[i].records[staff[j].name];
            html += '<td>' + (present ? '✅' : '❌') + '</td>';
        }
        html += '</tr>';
    }
    
    html += '</table>';
    container.innerHTML = html;
}

// Page initialization
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '/attendance-system/') {
    showDate();
    displayStaffForAttendance();
}
if (window.location.pathname.includes('staff.html')) {
    displayStaffList();
}
