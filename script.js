// Load staff from storage
let staff = JSON.parse(localStorage.getItem('staff')) || [];
let attendance = JSON.parse(localStorage.getItem('attendance')) || [];

// Show today's date
function showDate() {
    const dateElem = document.getElementById('date');
    if (dateElem) {
        dateElem.textContent = new Date().toLocaleDateString();
    }
}

// Display staff list for attendance
function displayStaffForAttendance() {
    const container = document.getElementById('staffList');
    if (!container) return;
    
    const today = new Date().toLocaleDateString();
    const todayAttendance = attendance.find(a => a.date === today) || {};
    
    container.innerHTML = '<h3>Mark Attendance</h3>';
    staff.forEach((member, index) => {
        const isPresent = todayAttendance[member.name] || false;
        container.innerHTML += `
            <div>
                ${member.name} (${member.role})
                <label>Present: <input type="checkbox" id="chk_${index}" ${isPresent ? 'checked' : ''}></label>
            </div>
        `;
    });
}

// Save today's attendance
function saveAttendance() {
    const today = new Date().toLocaleDateString();
    const todayRecord = {};
    
    staff.forEach((member, index) => {
        const chk = document.getElementById(`chk_${index}`);
        if (chk) {
            todayRecord[member.name] = chk.checked;
        }
    });
    
    // Remove old record for today if exists
    const filtered = attendance.filter(a => a.date !== today);
    filtered.push({ date: today, records: todayRecord });
    attendance = filtered;
    
    localStorage.setItem('attendance', JSON.stringify(attendance));
    alert('Attendance saved!');
}

// Add new staff
function addStaff() {
    const name = document.getElementById('staffName')?.value;
    const role = document.getElementById('staffRole')?.value;
    
    if (name && role) {
        staff.push({ name, role });
        localStorage.setItem('staff', JSON.stringify(staff));
        displayStaffList();
        document.getElementById('staffName').value = '';
        document.getElementById('staffRole').value = '';
    } else {
        alert('Please fill both fields');
    }
}

// Display staff list (for manage page)
function displayStaffList() {
    const container = document.getElementById('staffList');
    if (!container) return;
    
    container.innerHTML = '';
    staff.forEach((member, index) => {
        container.innerHTML += `
            <div>
                ${member.name} - ${member.role}
                <button onclick="removeStaff(${index})">Remove</button>
            </div>
        `;
    });
}

// Remove staff
function removeStaff(index) {
    if (confirm('Remove this staff member?')) {
        staff.splice(index, 1);
        localStorage.setItem('staff', JSON.stringify(staff));
        displayStaffList();
    }
}

// Generate report
function generateReport() {
    const start = document.getElementById('startDate')?.value;
    const end = document.getElementById('endDate')?.value;
    const container = document.getElementById('reportResult');
    
    if (!start || !end) {
        container.innerHTML = '<p>Please select start and end dates</p>';
        return;
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const filteredAttendance = attendance.filter(a => {
        const aDate = new Date(a.date);
        return aDate >= startDate && aDate <= endDate;
    });
    
    if (filteredAttendance.length === 0) {
        container.innerHTML = '<p>No attendance records in this period</p>';
        return;
    }
    
    let html = '<h3>Attendance Report</h3><table border="1"><tr><th>Date</th>';
    
    // Add staff headers
    staff.forEach(member => {
        html += `<th>${member.name}</th>`;
    });
    html += '</tr>';
    
    // Add each day's records
    filteredAttendance.forEach(day => {
        html += `<tr><td>${day.date}</td>`;
        staff.forEach(member => {
            const present = day.records[member.name] ? '✅' : '❌';
            html += `<td>${present}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</table>';
    container.innerHTML = html;
}

// Initialize pages based on which page is open
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '/attendance-system/') {
    showDate();
    displayStaffForAttendance();
}
if (window.location.pathname.includes('staff.html')) {
    displayStaffList();
}
