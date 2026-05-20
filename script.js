// Auth State Management
let isLoginMode = true;
const authSection = document.getElementById('authSection');
const welcomeSection = document.getElementById('welcomeSection');
const systemSection = document.getElementById('systemSection');

window.onload = () => {
  const user = localStorage.getItem('hrm_user');
  if (user) {
    welcomeSection.style.display = 'block';
  } else {
    authSection.style.display = 'block';
  }
};

window.logout = function() {
  localStorage.removeItem('hrm_user');
  window.location.reload();
};

const toggleAuthMode = document.getElementById('toggleAuthMode');
const authTitle = document.getElementById('authTitle');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authError = document.getElementById('authError');
const authForm = document.getElementById('authForm');

toggleAuthMode.addEventListener('click', (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  authError.style.display = 'none';
  if (isLoginMode) {
    authTitle.textContent = 'تسجيل الدخول';
    authSubmitBtn.textContent = 'دخول';
    toggleAuthMode.textContent = 'ليس لديك حساب؟ إنشاء حساب جديد';
  } else {
    authTitle.textContent = 'إنشاء حساب جديد';
    authSubmitBtn.textContent = 'تسجيل';
    toggleAuthMode.textContent = 'لديك حساب بالفعل؟ تسجيل الدخول';
  }
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.style.display = 'none';
  
  const username = document.getElementById('authUsername').value.trim();
  const password = document.getElementById('authPassword').value;
  
  if (!username || !password) return;
  
  const endpoint = isLoginMode ? '/api/login' : '/api/register';
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      if (isLoginMode) {
        localStorage.setItem('hrm_user', data.username);
        authSection.style.display = 'none';
        welcomeSection.style.display = 'block';
        authForm.reset();
      } else {
        // After successful registration, switch to login mode
        isLoginMode = true;
        authTitle.textContent = 'تسجيل الدخول';
        authSubmitBtn.textContent = 'دخول';
        toggleAuthMode.textContent = 'ليس لديك حساب؟ إنشاء حساب جديد';
        authError.style.display = 'block';
        authError.style.color = 'var(--primary)';
        authError.textContent = 'تم إنشاء الحساب بنجاح! الرجاء تسجيل الدخول.';
      }
    } else {
      authError.style.display = 'block';
      authError.style.color = 'var(--danger)';
      authError.textContent = data.error || 'حدث خطأ ما';
    }
  } catch (error) {
    authError.style.display = 'block';
    authError.style.color = 'var(--danger)';
    authError.textContent = 'فشل الاتصال بالخادم';
  }
});

// Show system section and hide welcome section
function enterSystem() {
  welcomeSection.style.display = 'none';
  systemSection.style.display = 'block';

  // Load data on start
  fetchEmployees();
  fetchAttendance();
  fetchLeaves();
  fetchPerformance();
}

// Employee Management
let employees = [];
const employeeForm = document.getElementById('employeeForm');
const employeeTable = document.getElementById('employeeTable');

async function fetchEmployees() {
  try {
    const res = await fetch('/api/employees');
    employees = await res.json();
    renderEmployees();
  } catch (error) {
    console.error('Failed to fetch employees:', error);
  }
}

employeeForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  if (name && email) {
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const newEmployee = await res.json();
      employees.push(newEmployee);
      renderEmployees();
      employeeForm.reset();
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  }
});

function renderEmployees() {
  employeeTable.innerHTML = '';
  employees.forEach((emp) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.email}</td>
      <td><button class="delete" onclick="deleteEmployee('${emp._id}')">حذف</button></td>
    `;
    employeeTable.appendChild(tr);
  });
}

window.deleteEmployee = async function(id) {
  try {
    await fetch(`/api/employees?id=${id}`, { method: 'DELETE' });
    employees = employees.filter(emp => emp._id !== id);
    renderEmployees();
  } catch (error) {
    console.error('Failed to delete employee:', error);
  }
};

// Attendance Management
let attendance = [];
const attendanceForm = document.getElementById('attendanceForm');
const attendanceTable = document.getElementById('attendanceTable');

async function fetchAttendance() {
  try {
    const res = await fetch('/api/attendance');
    attendance = await res.json();
    renderAttendance();
  } catch (error) {
    console.error('Failed to fetch attendance:', error);
  }
}

attendanceForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('employeeName').value.trim();
  const date = document.getElementById('date').value;
  const status = document.getElementById('status').value;
  if (name && date && status) {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, status })
      });
      const newRecord = await res.json();
      attendance.push(newRecord);
      renderAttendance();
      attendanceForm.reset();
    } catch (error) {
      console.error('Failed to add attendance:', error);
    }
  }
});

function renderAttendance() {
  attendanceTable.innerHTML = '';
  attendance.forEach((att) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${att.name}</td>
      <td>${att.date}</td>
      <td>${att.status}</td>
      <td><button class="delete" onclick="deleteAttendance('${att._id}')">حذف</button></td>
    `;
    attendanceTable.appendChild(tr);
  });
}

window.deleteAttendance = async function(id) {
  try {
    await fetch(`/api/attendance?id=${id}`, { method: 'DELETE' });
    attendance = attendance.filter(att => att._id !== id);
    renderAttendance();
  } catch (error) {
    console.error('Failed to delete attendance:', error);
  }
};

// Leave Management
let leaves = [];
const leaveForm = document.getElementById('leaveForm');
const leaveTable = document.getElementById('leaveTable');

async function fetchLeaves() {
  try {
    const res = await fetch('/api/leaves');
    leaves = await res.json();
    renderLeaves();
  } catch (error) {
    console.error('Failed to fetch leaves:', error);
  }
}

leaveForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('employeeNameLeave').value.trim();
  const date = document.getElementById('leaveDate').value;
  const type = document.getElementById('leaveType').value;
  if (name && date && type) {
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, type })
      });
      const newLeave = await res.json();
      leaves.push(newLeave);
      renderLeaves();
      leaveForm.reset();
    } catch (error) {
      console.error('Failed to add leave:', error);
    }
  }
});

function renderLeaves() {
  leaveTable.innerHTML = '';
  leaves.forEach((leave) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${leave.name}</td>
      <td>${leave.date}</td>
      <td>${leave.type}</td>
      <td><button class="delete" onclick="deleteLeave('${leave._id}')">حذف</button></td>
    `;
    leaveTable.appendChild(tr);
  });
}

window.deleteLeave = async function(id) {
  try {
    await fetch(`/api/leaves?id=${id}`, { method: 'DELETE' });
    leaves = leaves.filter(leave => leave._id !== id);
    renderLeaves();
  } catch (error) {
    console.error('Failed to delete leave:', error);
  }
};

// Performance Management
let performance = [];
const performanceForm = document.getElementById('performanceForm');
const performanceTable = document.getElementById('performanceTable');

async function fetchPerformance() {
  try {
    const res = await fetch('/api/performance');
    performance = await res.json();
    renderPerformance();
  } catch (error) {
    console.error('Failed to fetch performance:', error);
  }
}

performanceForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('employeeNamePerformance').value.trim();
  const rating = document.getElementById('performanceRating').value;
  if (name && rating) {
    try {
      const res = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating })
      });
      const newPerformance = await res.json();
      performance.push(newPerformance);
      renderPerformance();
      performanceForm.reset();
    } catch (error) {
      console.error('Failed to add performance:', error);
    }
  }
});

function renderPerformance() {
  performanceTable.innerHTML = '';
  performance.forEach((perf) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${perf.name}</td>
      <td>${perf.rating}</td>
      <td><button class="delete" onclick="deletePerformance('${perf._id}')">حذف</button></td>
    `;
    performanceTable.appendChild(tr);
  });
}

window.deletePerformance = async function(id) {
  try {
    await fetch(`/api/performance?id=${id}`, { method: 'DELETE' });
    performance = performance.filter(perf => perf._id !== id);
    renderPerformance();
  } catch (error) {
    console.error('Failed to delete performance:', error);
  }
};
