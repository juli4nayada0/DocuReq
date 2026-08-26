/* ======================= DATA LAYER ======================= */
const DB = {
  get(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch(e){ return fallback; } },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};

const FEES = {
  'Form 137':0,
  'Form 138':0,
  'Certificate of Graduation / Diploma':0,
  'Certificate of Good Moral Character':80,
  'Transcript of Records (TOR)':100,
  'Certificate of Enrollment / Attendance':60,
  'Certified True Copy (CTC)':70
};
const STATUS_FLOW = ['Pending','Under Review','Approved','Processing','Ready for Pickup','Completed'];
const STATUS_CLASS = {
  'Pending':'badge-pending','Under Review':'badge-review','Approved':'badge-approved','Processing':'badge-processing',
  'Ready for Pickup':'badge-ready','Completed':'badge-completed','Rejected':'badge-rejected'
};

function normalizePhoneInput(value){
  return (value || '').replace(/\D/g, '').slice(0, 11);
}

function formatPhone(value){
  const digits = normalizePhoneInput(value);
  if(!digits) return '';
  if(digits.length <= 4) return digits;
  if(digits.length <= 7) return `${digits.slice(0,4)} ${digits.slice(4)}`;
  return `${digits.slice(0,4)} ${digits.slice(4,7)} ${digits.slice(7)}`;
}

function renderAvatarMarkup(user, size=34){
  const safeName = (user?.name || 'User').replace(/"/g, '&quot;');
  if(user?.avatar){
    return `<div class="avatar" style="width:${size}px;height:${size}px;"><img src="${user.avatar}" alt="${safeName}" /></div>`;
  }
  return `<div class="avatar" style="width:${size}px;height:${size}px;">${(user?.name || '?')[0].toUpperCase()}</div>`;
}

function bindPhoneInput(selector){
  const input = document.querySelector(selector);
  if(!input) return;
  input.setAttribute('inputmode', 'numeric');
  input.setAttribute('maxlength', '14');
  input.value = formatPhone(input.value);
  input.addEventListener('input', ()=>{
    input.value = formatPhone(input.value);
  });
}

function normalizeDocumentNames(){
  const reqs = DB.get('dt_requests',[]);
  const aliases = {
    'Diploma':'Certificate of Graduation / Diploma',
    'Certificate of Enrollment (COE)':'Certificate of Enrollment / Attendance'
  };
  let changed = false;
  reqs.forEach(r=>{
    const replacement = aliases[r.document];
    if(replacement){ r.document = replacement; r.fee = FEES[replacement] || r.fee; changed = true; }
    if(!r.status){ r.status = 'Pending'; changed = true; }
    if(!r.paymentStatus){ r.paymentStatus = 'Unpaid'; changed = true; }
    if(!r.dateRequested){ r.dateRequested = new Date().toISOString().slice(0,10); changed = true; }
    if(r.document && !r.fee && FEES[r.document]){ r.fee = FEES[r.document]; changed = true; }
  });
  if(changed) DB.set('dt_requests', reqs);
}

function seed(){
  if(!DB.get('dt_users')){
    DB.set('dt_users',[
      {name:'Maria Santos', studentId:'2024-00456', email:'student@school.com', contact:'09175550123', password:'student123', role:'student'},
      {name:'Registrar Admin', studentId:'ADMIN-01', email:'admin@school.com', contact:'09175550000', password:'admin123', role:'admin'}
    ]);
  }
  if(!DB.get('dt_requests')){
    const today = new Date();
    const d = n=>{ const x=new Date(today); x.setDate(x.getDate()+n); return x.toISOString().slice(0,10); };
    DB.set('dt_requests',[
      {id:'REQ-10231', studentEmail:'student@school.com', studentName:'Maria Santos', document:'Certificate of Enrollment / Attendance',
        purpose:'Scholarship application', quantity:1, pickupDate:d(-6), remarks:'', fee:60, status:'Completed',
        paymentStatus:'Paid', paymentMethod:'GCash', paymentRef:'PMT-88213', paymentDate:d(-7), dateRequested:d(-8), pickupSlot:null},
      {id:'REQ-10255', studentEmail:'student@school.com', studentName:'Maria Santos', document:'Transcript of Records (TOR)',
        purpose:'College application', quantity:2, pickupDate:d(3), remarks:'Please print on security paper.', fee:200, status:'Processing',
        paymentStatus:'Paid', paymentMethod:'Over the counter', paymentRef:'PMT-88340', paymentDate:d(-1), dateRequested:d(-2), pickupSlot:{date:d(3),time:'10:00 AM – 11:00 AM'}},
      {id:'REQ-10270', studentEmail:'juan.delacruz@school.com', studentName:'Juan Dela Cruz', document:'Certificate of Graduation / Diploma',
        purpose:'Employment requirement', quantity:1, pickupDate:d(5), remarks:'', fee:150, status:'Pending',
        paymentStatus:'Unpaid', paymentMethod:'', paymentRef:'', paymentDate:'', dateRequested:d(0), pickupSlot:null},
      {id:'REQ-10268', studentEmail:'anna.reyes@school.com', studentName:'Anna Reyes', document:'Transcript of Records (TOR)',
        purpose:'Board exam requirement', quantity:1, pickupDate:d(4), remarks:'', fee:100, status:'Under Review',
        paymentStatus:'Paid', paymentMethod:'GCash', paymentRef:'PMT-88401', paymentDate:d(0), dateRequested:d(-1), pickupSlot:null},
      {id:'REQ-10260', studentEmail:'carlo.tan@school.com', studentName:'Carlo Tan', document:'Certificate of Enrollment / Attendance',
        purpose:'Visa application', quantity:1, pickupDate:d(2), remarks:'', fee:60, status:'Ready for Pickup',
        paymentStatus:'Paid', paymentMethod:'GCash', paymentRef:'PMT-88350', paymentDate:d(-2), dateRequested:d(-3), pickupSlot:{date:d(2),time:'1:00 PM – 2:00 PM'}}
    ]);
  }
  normalizeDocumentNames();
  if(!DB.get('dt_notifications')){
    DB.set('dt_notifications',[
      {id:1, title:'Request Approved', desc:'Your Certificate of Enrollment request has been approved.', time:'2 days ago', read:false, type:'approved'},
      {id:2, title:'Payment Received', desc:'We received your payment of ₱200 for REQ-10255.', time:'1 day ago', read:false, type:'payment'},
      {id:3, title:'Document Processing', desc:'Your Transcript of Records is now being processed.', time:'6 hours ago', read:false, type:'processing'},
      {id:4, title:'Document Ready for Pickup', desc:'REQ-10260 is ready for pickup at the Registrar window.', time:'3 hours ago', read:true, type:'ready'},
      {id:5, title:'Announcement', desc:'The Registrar office will be closed on Aug 25 for a system upgrade.', time:'1 week ago', read:true, type:'announce'}
    ]);
  }
  if(!DB.get('dt_logs')){
    DB.set('dt_logs',[
      {user:'Registrar Admin', action:'Approved request', when:'Today, 9:12 AM', desc:'REQ-10268 marked as Under Review'},
      {user:'Registrar Admin', action:'Updated status', when:'Yesterday, 4:40 PM', desc:'REQ-10255 marked as Processing'},
      {user:'Maria Santos', action:'Submitted request', when:'Yesterday, 2:05 PM', desc:'Requested Transcript of Records (TOR) x2'},
      {user:'Registrar Admin', action:'Confirmed payment', when:'2 days ago, 11:20 AM', desc:'PMT-88213 verified for REQ-10231'},
      {user:'Carlo Tan', action:'Scheduled pickup', when:'3 days ago, 1:30 PM', desc:'Selected pickup slot for REQ-10260'}
    ]);
  }
}
seed();

/* ======================= SESSION ======================= */
function getSession(){ return DB.get('dt_session', null) || JSON.parse(sessionStorage.getItem('dt_session')||'null'); }
function setSession(user, remember){
  const s = {email:user.email, role:user.role, name:user.name};
  if(remember){ DB.set('dt_session', s); sessionStorage.removeItem('dt_session'); }
  else{ sessionStorage.setItem('dt_session', JSON.stringify(s)); localStorage.removeItem('dt_session'); }
}
function clearSession(){ localStorage.removeItem('dt_session'); sessionStorage.removeItem('dt_session'); }
function currentUser(){
  const s = getSession(); if(!s) return null;
  return DB.get('dt_users',[]).find(u=>u.email===s.email) || s;
}

/* ======================= TOAST ======================= */
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(()=> t.hidden = true, 2600);
}

/* ======================= AUTH FLOW ======================= */
const loginForm = document.getElementById('login-form');

document.getElementById('forgot-link').onclick = e=>{ e.preventDefault(); toast('Password reset link sent (prototype only).'); };

document.querySelectorAll('.pw-toggle').forEach(btn=>{
  btn.onclick = ()=>{
    const input = document.getElementById(btn.dataset.target);
    const show = input.type==='password';
    input.type = show?'text':'password';
    btn.textContent = show?'Hide':'Show';
  };
});

loginForm.onsubmit = e=>{
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass = document.getElementById('login-password').value;
  const remember = document.getElementById('remember-me').checked;
  const errEl = document.getElementById('login-error');
  const user = DB.get('dt_users',[]).find(u=>u.email.toLowerCase()===email && u.password===pass);
  if(!user){ errEl.textContent='Incorrect email or password. Please try again.'; errEl.hidden=false; return; }
  errEl.hidden=true;
  setSession(user, remember);
  enterApp(user);
};

document.getElementById('logout-btn').onclick = ()=>{
  clearSession();
  document.getElementById('app-shell').hidden = true;
  document.getElementById('auth-screen').hidden = false;
  loginForm.reset();
};

/* ======================= APP ENTRY / ROUTING ======================= */
const STUDENT_NAV = [
  ['dashboard','🏠','Dashboard'],['request','📝','Request Document'],['myrequests','📄','My Requests'],
  ['payments','💳','Payments'],['pickup','📅','Pickup Schedule'],['notifications','🔔','Notifications'],
  ['org','🏛️','Org Chart'],['profile','👤','Profile'],['about','ℹ️','About Us']
];
const ADMIN_NAV = [
  ['a-dashboard','🏠','Dashboard'],['a-requests','📄','Document Requests'],['a-students','🎓','Students'],
  ['a-payments','💳','Payments'],['a-pickup','📅','Pickup Schedule'],['a-reports','📊','Reports & Analytics'],
  ['a-notifications','🔔','Notifications'],['a-logs','🗒️','Activity Logs'],['a-settings','⚙️','Settings'],['org','🏛️','Org Chart'],['about','ℹ️','About Us']
];

let ROLE='student';
let CURRENT_PAGE = 'dashboard';

function syncStudentProfileToRequests(email, user){
  const reqs = DB.get('dt_requests',[]);
  let changed = false;
  reqs.forEach(r=>{
    if(r.studentEmail === email && r.studentName !== user.name){
      r.studentName = user.name; changed = true;
    }
  });
  if(changed) DB.set('dt_requests', reqs);
}

function refreshCurrentView(){
  const shell = document.getElementById('app-shell');
  if(shell && shell.hidden) return;
  if(!CURRENT_PAGE) return;
  const pageToRender = CURRENT_PAGE || (ROLE==='admin' ? 'a-dashboard' : 'dashboard');
  const user = currentUser();
  if(user){
    document.getElementById('topbar-name').textContent = user.name;
    document.getElementById('topbar-avatar').innerHTML = renderAvatarMarkup(user, 34);
  }
  navigate(pageToRender);
}

function enterApp(user){
  document.getElementById('auth-screen').hidden = true;
  document.getElementById('app-shell').hidden = false;
  ROLE = user.role;
  document.getElementById('topbar-avatar').innerHTML = renderAvatarMarkup(user, 34);
  document.getElementById('topbar-name').textContent = user.name;
  document.getElementById('topbar-role').textContent = ROLE==='admin' ? 'Registrar Admin' : 'Student';
  buildSidebar();
  navigate(ROLE==='admin' ? 'a-dashboard' : 'dashboard');
}

function buildSidebar(){
  const nav = document.getElementById('sidebar-nav');
  const items = ROLE==='admin' ? ADMIN_NAV : STUDENT_NAV;
  nav.innerHTML = items.map(([key,icon,label])=>
    `<button class="nav-item" data-page="${key}"><span>${icon}</span><span>${label}</span></button>`
  ).join('');
  nav.querySelectorAll('.nav-item').forEach(btn=> btn.onclick = ()=> navigate(btn.dataset.page));
}

function navigate(page){
  CURRENT_PAGE = page;
  document.querySelectorAll('.nav-item').forEach(b=> b.classList.toggle('active', b.dataset.page===page));
  document.querySelector('.sidebar')?.classList.remove('open');
  const user = currentUser();
  if(user && document.getElementById('topbar-avatar')){
    document.getElementById('topbar-avatar').innerHTML = renderAvatarMarkup(user, 34);
    document.getElementById('topbar-name').textContent = user.name;
  }
  const titles = {
    dashboard:'Dashboard', request:'Request Document', myrequests:'My Requests', payments:'Payments',
      pickup:'Pickup Schedule', notifications:'Notification Center', profile:'My Profile', about:'About Us', org:'Organizational Chart',
    'a-dashboard':'Admin Dashboard', 'a-requests':'Document Requests', 'a-students':'Students',
    'a-payments':'Payments', 'a-pickup':'Pickup Schedule', 'a-reports':'Reports & Analytics',
      'a-notifications':'Notifications', 'a-logs':'Activity Logs', 'a-settings':'Settings', 'org':'Organizational Chart'
  };
  document.getElementById('page-title').textContent = titles[page] || 'Dashboard';
  const renderers = {
    dashboard:renderStudentDashboard, request:renderRequestForm, myrequests:renderMyRequests,
      payments:renderPayments, pickup:renderPickup, notifications:renderNotifications, profile:renderProfile, about:renderAboutUs, org:renderOrgChart,
    'a-dashboard':renderAdminDashboard, 'a-requests':renderAdminRequests, 'a-students':renderAdminStudents,
    'a-payments':renderAdminPayments, 'a-pickup':renderAdminPickup, 'a-reports':renderAdminReports,
    'a-notifications':renderNotifications, 'a-logs':renderAdminLogs, 'a-settings':renderAdminSettings
  };
  (renderers[page]||renderStudentDashboard)();
  updateBellDot();
}

document.getElementById('sidebar-toggle').onclick = ()=> document.querySelector('.sidebar').classList.toggle('open');

/* ======================= HELPERS ======================= */
const $ = sel => document.querySelector(sel);
const page = () => document.getElementById('page-content');
function myRequests(){ const u=currentUser(); return DB.get('dt_requests',[]).filter(r=>r.studentEmail===u.email); }
function fmtMoney(n){
  const value = Number(n) || 0;
  return '₱'+value.toLocaleString();
}
function feeLabel(amount, each=false){
  if(amount === 0) return '<strong>Free</strong>';
  return `<strong>${fmtMoney(amount)}${each ? ' each' : ''}</strong>`;
}
function fmtDate(s){ if(!s) return '—'; const d=new Date(s+'T00:00:00'); return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
function badge(status, extraClass){ return `<span class="badge ${STATUS_CLASS[status]||''} ${extraClass||''}">${status}</span>`; }
function updateBellDot(){
  const unread = DB.get('dt_notifications',[]).some(n=>!n.read);
  document.getElementById('bell-dot').hidden = !unread;
}
document.getElementById('bell-btn').onclick = ()=> navigate(ROLE==='admin' ? 'a-notifications' : 'notifications');

window.addEventListener('storage', (event)=>{
  if(!event.key || !['dt_users','dt_requests','dt_session'].includes(event.key)) return;
  const shell = document.getElementById('app-shell');
  if(shell && !shell.hidden) refreshCurrentView();
});
window.addEventListener('dt-profile-updated', refreshCurrentView);

function openModal(html){
  document.getElementById('modal-box').innerHTML = html;
  document.getElementById('modal-backdrop').hidden = false;
}
document.getElementById('modal-backdrop').addEventListener('click', e=>{
  if(e.target.id==='modal-backdrop') closeModal();
});
function closeModal(){ document.getElementById('modal-backdrop').hidden = true; }

/* ======================= STUDENT: DASHBOARD ======================= */
function renderStudentDashboard(){
  const u = currentUser();
  const reqs = myRequests();
  const pending = reqs.filter(r=>!['Completed','Rejected'].includes(r.status)).length;
  const ready = reqs.filter(r=>r.status==='Ready for Pickup').length;
  const completed = reqs.filter(r=>r.status==='Completed').length;
  const recent = [...reqs].sort((a,b)=> (b.dateRequested || '').localeCompare(a.dateRequested || '')).slice(0,4);

  page().innerHTML = `
    <div class="panel" style="background:linear-gradient(120deg,var(--navy-900),var(--navy-700));color:#fff;border:none;">
      <h2 style="color:#fff;font-size:1.3rem;">Welcome back, ${u.name.split(' ')[0]} 👋</h2>
      <p style="color:#c7d3e8;margin-top:.4rem;font-size:.9rem;">Track your document requests and stay updated on every step.</p>
    </div>
    <div class="grid-cards">
      <div class="stat-card"><div class="stat-label">Total Requests</div><div class="stat-value">${reqs.length}</div></div>
      <div class="stat-card"><div class="stat-label">In Progress</div><div class="stat-value gold">${pending}</div></div>
      <div class="stat-card"><div class="stat-label">Ready for Pickup</div><div class="stat-value">${ready}</div></div>
      <div class="stat-card"><div class="stat-label">Completed</div><div class="stat-value">${completed}</div></div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Recent Requests</h3><button class="btn btn-outline btn-sm" onclick="navigate('myrequests')">View all</button></div>
      ${recent.length ? `<div class="table-wrap"><table><thead><tr><th>ID</th><th>Document</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>${recent.map(r=>`<tr><td>${r.id}</td><td>${r.document}</td><td>${fmtDate(r.dateRequested)}</td><td>${badge(r.status)}</td></tr>`).join('')}</tbody></table></div>`
      : emptyState('📄','No requests yet','Submit your first document request to see it here.')}
    </div>`;
}

function emptyState(icon,title,desc){
  return `<div class="empty-state"><div class="em-icon">${icon}</div><h4>${title}</h4><p style="margin-top:.3rem;">${desc}</p></div>`;
}
function renderQrCard({id, documentName, status='Ready for Pickup', title='My QR Codes', subtitle='Show these QR codes to the registrar window for verification during release.'}){
  const safeId = String(id || 'qr').replace(/[^a-zA-Z0-9]+/g, '-');
  const statusText = status === 'Ready for Pickup' ? 'Ready for Pick Up' : status;
  const payload = `${id}|${documentName}|${status}`;
  return `
    <div class="panel qr-panel">
      <h3 class="section-title qr-title">${title}</h3>
      <p class="qr-subtitle">${subtitle}</p>
      <div class="qr-card">
        <div class="qr-box" id="qr-${safeId}" data-qr="${payload}"></div>
        <div class="qr-id">${id}</div>
        <div class="qr-doc">${documentName}</div>
        <div class="qr-pill ${status === 'Ready for Pickup' ? 'ready' : ''}">${statusText}</div>
      </div>
    </div>`;
}
function renderQrBoxes(){
  document.querySelectorAll('.qr-box').forEach(box => {
    const data = box.dataset.qr;
    if(!data) return;
    box.innerHTML = '';
    box.classList.remove('qr-placeholder');
    if(window.QRCode){
      try {
        new QRCode(box, {
          text: data,
          width: 220,
          height: 220,
          colorDark: '#132a4d',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (err) {
        box.classList.add('qr-placeholder');
      }
    } else {
      box.classList.add('qr-placeholder');
    }
  });
}

/* ======================= STUDENT: REQUEST FORM ======================= */
function renderRequestForm(){
  const selectedDocs = [];

  page().innerHTML = `
    <div class="panel">
      <h3 class="section-title">Request a Document</h3>
      <form id="req-form">
        <div class="form-grid">
          <div class="field full">
            <span>Document Type</span>
            <div id="rf-selected-docs" class="doc-chip-list"></div>
            <button type="button" class="btn btn-outline btn-sm" id="rf-add-doc-btn" style="align-self:flex-start;">Add Document</button>
            <div id="rf-doc-picker" hidden style="margin-top:.6rem;display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;">
              <select id="rf-doc" style="min-width:240px;">
                <option value="">Select a document</option>
                ${Object.keys(FEES).map(d=>`<option value="${d}">${d}</option>`).join('')}
              </select>
              <button type="button" class="btn btn-primary btn-sm" id="rf-confirm-doc">Add</button>
            </div>
          </div>
          <label class="field"><span>Quantity</span><input type="number" id="rf-qty" min="1" value="1"></label>
          <label class="field full"><span>Purpose</span><input type="text" id="rf-purpose" placeholder="e.g. College application" required></label>
          <label class="field"><span>Preferred Pickup Date</span><input type="date" id="rf-date" required></label>
          <label class="field"><span>&nbsp;</span><div class="muted">Processing typically takes 3–5 working days.</div></label>
          <label class="field full"><span>Additional Remarks (optional)</span><textarea id="rf-remarks" rows="2" placeholder="Any special instructions..."></textarea></label>
        </div>
        <div class="summary-box" id="rf-summary">
          <div class="summary-row"><span>Document</span><span>—</span></div>
          <div class="summary-row"><span>Processing Fee</span><span>—</span></div>
          <div class="summary-row total"><span>Total Cost</span><span>—</span></div>
        </div>
        <div style="margin-top:1.2rem;"><button type="submit" class="btn btn-primary">Submit Request</button></div>
      </form>
    </div>`;

  const renderSelectedDocs = ()=>{
    const list = $('#rf-selected-docs');
    if(!selectedDocs.length){
      list.innerHTML = '<span class="muted">No document added yet.</span>';
      return;
    }
    list.innerHTML = selectedDocs.map((doc, idx)=>`
      <span class="doc-chip">
        ${doc}
        <button type="button" class="doc-chip-remove" data-index="${idx}" aria-label="Remove ${doc}">×</button>
      </span>`).join('');
    list.querySelectorAll('.doc-chip-remove').forEach(btn => {
      btn.onclick = () => {
        selectedDocs.splice(Number(btn.dataset.index), 1);
        renderSelectedDocs();
        upd();
      };
    });
  };

  const upd = ()=>{
    const qty = Math.max(1, parseInt($('#rf-qty').value||1));
    if(!selectedDocs.length){
      $('#rf-summary').innerHTML = `
        <div class="summary-row"><span>Document</span><span>—</span></div>
        <div class="summary-row"><span>Processing Fee</span><span>—</span></div>
        <div class="summary-row total"><span>Total Cost</span><span>—</span></div>`;
      return;
    }
    const list = selectedDocs.map(doc=>`${doc} × ${qty}`).join(', ');
    const fee = selectedDocs.reduce((sum, doc)=> sum + FEES[doc]*qty, 0);
    const feeText = selectedDocs.map(doc => {
      const amount = FEES[doc];
      return `${doc}: ${amount === 0 ? feeLabel(amount) : feeLabel(amount, true)}`;
    }).join(' · ');
    $('#rf-summary').innerHTML = `
      <div class="summary-row"><span>Document</span><span>${list}</span></div>
      <div class="summary-row"><span>Processing Fee</span><span>${feeText}</span></div>
      <div class="summary-row total"><span>Total Cost</span><span>${fee === 0 ? feeLabel(0) : feeLabel(fee)}</span></div>`;
  };

  $('#rf-add-doc-btn').onclick = ()=>{
    $('#rf-doc-picker').hidden = !$('#rf-doc-picker').hidden;
    if(!$('#rf-doc-picker').hidden) $('#rf-doc').focus();
  };

  $('#rf-confirm-doc').onclick = ()=>{
    const doc = $('#rf-doc').value;
    if(!doc){ toast('Please select a document type.'); return; }
    if(!selectedDocs.includes(doc)) selectedDocs.push(doc);
    $('#rf-doc').value = '';
    $('#rf-doc-picker').hidden = true;
    renderSelectedDocs();
    upd();
  };

  $('#rf-qty').oninput = upd; renderSelectedDocs(); upd();

  $('#req-form').onsubmit = e=>{
    e.preventDefault();
    const qty=Math.max(1, parseInt($('#rf-qty').value||1));
    if(!selectedDocs.length){ toast('Please add at least one document type.'); return; }
    const u = currentUser();
    const reqs = DB.get('dt_requests',[]);
    const id = 'REQ-'+(10300+reqs.length+Math.floor(Math.random()*90));
    const docLabel = selectedDocs.join(', ');
    const fee = selectedDocs.reduce((sum, doc)=> sum + FEES[doc]*qty, 0);
    reqs.unshift({
      id, studentEmail:u.email, studentName:u.name, document:docLabel, documents:selectedDocs, purpose:$('#rf-purpose').value,
      quantity:qty, pickupDate:$('#rf-date').value, remarks:$('#rf-remarks').value, fee,
      status:'Pending', paymentStatus: fee === 0 ? 'Paid' : 'Unpaid', paymentMethod: fee === 0 ? 'Free' : '', paymentRef: fee === 0 ? 'FREE' : '', paymentDate: fee === 0 ? new Date().toISOString().slice(0,10) : '',
      dateRequested:new Date().toISOString().slice(0,10), pickupSlot:null
    });
    DB.set('dt_requests', reqs);
    addLog(u.name, 'Submitted request', `Requested ${docLabel} x${qty} (${id})`);
    toast(`Request submitted! Reference: ${id}`);
    navigate('myrequests');
  };
}

/* ======================= STUDENT: MY REQUESTS ======================= */
function renderMyRequests(){
  const reqs = [...myRequests()].sort((a,b)=> (b.dateRequested || '').localeCompare(a.dateRequested || '')).slice(0,1);
  page().innerHTML = `
    <div class="panel">
      <div class="panel-head"><h3>My Requests</h3><button class="btn btn-primary btn-sm" onclick="navigate('request')">+ New Request</button></div>
      ${reqs.length ? `<div class="table-wrap"><table><thead><tr>
        <th>Request ID</th><th>Document</th><th>Date</th><th>Status</th><th>Payment</th><th>Pickup</th><th>Actions</th>
        </tr></thead><tbody>
        ${reqs.map(r=>`<tr>
          <td>${r.id}</td><td>${r.document}</td><td>${fmtDate(r.dateRequested)}</td>
          <td>${badge(r.status)}</td><td><span class="badge ${r.paymentStatus==='Paid'?'badge-paid':'badge-unpaid'}">${r.paymentStatus}</span></td>
          <td>${fmtDate(r.pickupDate)}</td>
          <td><button class="btn btn-outline btn-sm" onclick="viewRequest('${r.id}')">Track</button></td>
        </tr>`).join('')}
        </tbody></table></div>`
      : emptyState('📄','No requests yet','Your submitted document requests will appear here.')}
    </div>`;
}

function viewRequest(id){
  const r = DB.get('dt_requests',[]).find(x=>x.id===id);
  if(!r) return;
  const idx = STATUS_FLOW.indexOf(r.status);
  const rejected = r.status==='Rejected';
  openModal(`
    <h3>${r.id} — ${r.document}</h3>
    <p class="muted" style="margin-top:.3rem;">Requested on ${fmtDate(r.dateRequested)} · Qty ${r.quantity}</p>
    <div class="summary-box" style="margin-top:1rem;">
      <div class="summary-row"><span>Purpose</span><span>${r.purpose||'—'}</span></div>
      <div class="summary-row"><span>Preferred Pickup</span><span>${fmtDate(r.pickupDate)}</span></div>
      <div class="summary-row"><span>Payment</span><span>${r.paymentStatus}</span></div>
      <div class="summary-row total"><span>Total Cost</span><span>${fmtMoney(r.fee)}</span></div>
    </div>
    ${rejected ? `<div class="form-error" style="margin-top:1rem;">This request was rejected. Please contact the Registrar's office for details.</div>` :
    `<div class="timeline">
      ${STATUS_FLOW.map((s,i)=>`
        <div class="tl-step ${i<idx?'done':''} ${i===idx?'current':''}">
          <div class="tl-dot">${i<idx?'✓':i+1}</div>
          <div class="tl-body"><div class="tl-title">${s}</div>
          <div class="tl-desc">${statusDesc(s)}</div></div>
        </div>`).join('')}
    </div>`}
    <div class="modal-close-row"><button class="btn btn-outline" onclick="closeModal()">Close</button></div>
  `);
}
function statusDesc(s){
  return {
    'Pending':'Your request has been received and is in queue.',
    'Under Review':'The registrar is verifying your records.',
    'Approved':'Your request has been approved for processing.',
    'Processing':'Your document is being prepared.',
    'Ready for Pickup':'Your document is ready at the Registrar window.',
    'Completed':'Document released. Thank you!'
  }[s]||'';
}

/* ======================= STUDENT: PAYMENTS ======================= */
function renderPayments(){
  const reqs = [...myRequests()].sort((a,b)=> (b.dateRequested || '').localeCompare(a.dateRequested || '')).slice(0,1);
  page().innerHTML = `
    <div class="panel">
      <h3 class="section-title">Payments</h3>
      ${reqs.length? `<div class="table-wrap"><table><thead><tr>
        <th>Request ID</th><th>Amount</th><th>Method</th><th>Reference No.</th><th>Date</th><th>Status</th><th>Action</th>
        </tr></thead><tbody>
        ${reqs.map(r=>`<tr>
          <td>${r.id}</td><td>${fmtMoney(r.fee)}</td><td>${r.paymentMethod||'—'}</td><td>${r.paymentRef||'—'}</td>
          <td>${r.paymentDate?fmtDate(r.paymentDate):'—'}</td>
          <td><span class="badge ${r.paymentStatus==='Paid'?'badge-paid':'badge-unpaid'}">${r.paymentStatus}</span></td>
          <td>${r.paymentStatus==='Paid' ? '<span class="muted">Paid</span>' : `<button class="btn btn-gold btn-sm" onclick="payNow('${r.id}')">Pay Now</button>`}</td>
        </tr>`).join('')}</tbody></table></div>`
      : emptyState('💳','No payments due','Submit a document request to see payment details here.')}
    </div>`;
}
function payNow(id){
  openModal(`
    <h3>Pay for ${id}</h3>
    <p class="muted" style="margin-top:.3rem;">Choose a payment method to simulate payment.</p>
    <div class="form-grid" style="margin-top:1rem;">
      <label class="field"><span>Payment Method</span>
        <select id="pay-method"><option>GCash</option><option>Over the counter</option></select>
      </label>
    </div>
    <div class="modal-close-row">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="confirmPayment('${id}')">Confirm Payment</button>
    </div>`);
}
function confirmPayment(id){
  const reqs = DB.get('dt_requests',[]);
  const r = reqs.find(x=>x.id===id);
  const method = $('#pay-method').value;
  r.paymentStatus='Paid'; r.paymentMethod=method; r.paymentRef='PMT-'+Math.floor(80000+Math.random()*9999);
  r.paymentDate=new Date().toISOString().slice(0,10);
  DB.set('dt_requests', reqs);
  pushNotification('Payment Received', `We received your payment of ${fmtMoney(r.fee)} for ${r.id}.`, 'payment');
  addLog(currentUser().name, 'Made payment', `${r.paymentRef} for ${r.id}`);
  closeModal(); toast('Payment successful!'); renderPayments();
}

/* ======================= STUDENT: PICKUP ======================= */
function renderPickup(){
  const reqs = myRequests().filter(r=>!['Completed','Rejected'].includes(r.status));
  const paidReqs = reqs.filter(r=>r.paymentStatus === 'Paid');
  const qrRequest = paidReqs.find(r=>r.status === 'Ready for Pickup') || paidReqs[0] || null;
  const dates = [1,2,3,4,5].map(n=>{ const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); });
  const times = ['9:00 AM – 10:00 AM','10:00 AM – 11:00 AM','1:00 PM – 2:00 PM','2:00 PM – 3:00 PM'];
  page().innerHTML = `
    ${qrRequest ? renderQrCard({
      id: qrRequest.id,
      documentName: qrRequest.document,
      status: 'Ready for Pickup',
      title: 'My QR Codes',
      subtitle: 'Show these QR codes to the registrar window for verification during release.'
    }) : ''}
    <div class="panel">
      <h3 class="section-title">Schedule Pickup</h3>
      ${reqs.length ? `
      <label class="field"><span>Select Request</span>
        <select id="pk-req">${reqs.map(r=>`<option value="${r.id}">${r.id} — ${r.document}</option>`).join('')}</select>
      </label>
      <p style="margin:1rem 0 .5rem;font-weight:600;font-size:.85rem;">Available Dates</p>
      <div class="chip-row" id="pk-dates">${dates.map(d=>`<button type="button" class="date-chip" data-date="${d}">${fmtDate(d)}</button>`).join('')}</div>
      <p style="margin:0 0 .5rem;font-weight:600;font-size:.85rem;">Available Time Slots</p>
      <div class="slot-grid" id="pk-slots">${times.map(t=>`<button type="button" class="slot-btn" data-time="${t}">${t}</button>`).join('')}</div>
      <div style="margin-top:1.3rem;"><button class="btn btn-primary" id="pk-save">Confirm Schedule</button></div>
      ` : emptyState('📅','Nothing to schedule','Requests ready for pickup scheduling will appear here.')}
    </div>`;
  if(qrRequest) renderQrBoxes();
  if(!reqs.length) return;
  let selDate=null, selTime=null;
  document.querySelectorAll('#pk-dates .date-chip').forEach(b=> b.onclick=()=>{
    document.querySelectorAll('#pk-dates .date-chip').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected'); selDate=b.dataset.date;
  });
  document.querySelectorAll('#pk-slots .slot-btn').forEach(b=> b.onclick=()=>{
    document.querySelectorAll('#pk-slots .slot-btn').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected'); selTime=b.dataset.time;
  });
  $('#pk-save').onclick = ()=>{
    if(!selDate||!selTime){ toast('Please select a date and time slot.'); return; }
    const reqs2 = DB.get('dt_requests',[]);
    const r = reqs2.find(x=>x.id===$('#pk-req').value);
    r.pickupSlot = {date:selDate, time:selTime};
    DB.set('dt_requests', reqs2);
    addLog(currentUser().name, 'Scheduled pickup', `${r.id} → ${fmtDate(selDate)}, ${selTime}`);
    openModal(`
      <h3>Pickup Scheduled ✓</h3>
      <div class="summary-box" style="margin-top:1rem;">
        <div class="summary-row"><span>Request</span><span>${r.id}</span></div>
        <div class="summary-row"><span>Date</span><span>${fmtDate(selDate)}</span></div>
        <div class="summary-row"><span>Time Window</span><span>${selTime}</span></div>
        <div class="summary-row total"><span>Claim Stub</span><span>CLM-${r.id.slice(4)}</span></div>
      </div>
      <p class="muted" style="margin-top:.8rem;">Present this reference and a valid ID at the Registrar window.</p>
      <div class="modal-close-row"><button class="btn btn-primary" onclick="closeModal()">Done</button></div>`);
    renderPickup();
  };
}

/* ======================= NOTIFICATIONS (shared) ======================= */
function pushNotification(title, desc, type){
  const n = DB.get('dt_notifications',[]);
  n.unshift({id:Date.now(), title, desc, time:'Just now', read:false, type});
  DB.set('dt_notifications', n);
}
const NOTIF_ICON = {approved:'✅', payment:'💳', processing:'⚙️', ready:'📦', announce:'📣'};
function renderAboutUs(){
  page().innerHTML = `
    <div class="panel">
      <h3 class="section-title">About Us</h3>
      <div class="about-wrap">
        <div class="about-hero">
          <div class="brand-mark" style="width:62px;height:62px;font-size:1.4rem;">DT</div>
          <div>
            <h4>DocuTrack</h4>
            <p>School Registrar Document Request &amp; Tracking System</p>
          </div>
        </div>
        <div class="about-grid">
          <div class="about-card">
            <h5>Our Mission</h5>
            <p>To make document requests easier, faster, and more transparent for students and school personnel.</p>
          </div>
          <div class="about-card">
            <h5>What We Offer</h5>
            <p>Online document requests, status tracking, payment updates, pickup scheduling, and verified QR release slips.</p>
          </div>
          <div class="about-card">
            <h5>Contact</h5>
            <p>Registrar's Office<br>Guiguinto National Vocational High School<br>Mon–Fri, 8:00 AM – 5:00 PM</p>
          </div>
          <div class="about-card">
            <h5>Purpose</h5>
            <p>We aim to reduce long queues, improve student convenience, and keep every document request clearly organized.</p>
          </div>
        </div>
      </div>
    </div>`;
}

function renderOrgChart(){
  page().innerHTML = `
    <div class="panel">
      <h3 class="section-title">Organizational Chart</h3>
      <div class="org-chart">
        <div class="org-level">
          <div class="org-node"><strong>Registrar</strong><div class="muted">Registrar Admin</div></div>
        </div>
        <div class="org-level">
          <div class="org-node"><strong>Assistant Registrar</strong><div class="muted">Asst. Registrar</div></div>
          <div class="org-node"><strong>Records Officer</strong><div class="muted">Records &amp; Transcripts</div></div>
          <div class="org-node"><strong>Finance / Cashier</strong><div class="muted">Payments</div></div>
        </div>
        <div class="org-level">
          <div class="org-node"><strong>Clerk</strong><div class="muted">Document Processing</div></div>
          <div class="org-node"><strong>Clerk II</strong><div class="muted">Filing</div></div>
          <div class="org-node"><strong>Student Assistants</strong><div class="muted">Counter Support</div></div>
        </div>
      </div>
      <p class="muted" style="margin-top:.6rem;">This chart is a simplified view for the registrar office in this prototype.</p>
    </div>`;
}

function renderNotifications(){
  const list = DB.get('dt_notifications',[]);
  page().innerHTML = `
    <div class="panel">
      <div class="panel-head"><h3>Notification Center</h3><button class="btn btn-outline btn-sm" onclick="markAllRead()">Mark all read</button></div>
      ${list.length ? list.map(n=>`
        <div class="notif-item ${n.read?'':'unread'}" onclick="readNotif(${n.id})">
          <div class="notif-icon">${NOTIF_ICON[n.type]||'🔔'}</div>
          <div><div class="notif-title">${n.title}</div><div class="notif-desc">${n.desc}</div><div class="notif-time">${n.time}</div></div>
        </div>`).join('') : emptyState('🔔','No notifications','You are all caught up.')}
    </div>`;
}
function readNotif(id){
  const list = DB.get('dt_notifications',[]);
  const n = list.find(x=>x.id===id); if(n) n.read=true;
  DB.set('dt_notifications', list); renderNotifications(); updateBellDot();
}
function markAllRead(){
  const list = DB.get('dt_notifications',[]).map(n=>({...n, read:true}));
  DB.set('dt_notifications', list); renderNotifications(); updateBellDot();
}

/* ======================= STUDENT: PROFILE ======================= */
function readFileAsDataUrl(file){
  return new Promise((resolve, reject)=>{
    if(!file || !file.type.startsWith('image/')){
      reject(new Error('Please select a valid image file.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = ()=> reject(new Error('Unable to read image file.'));
    reader.readAsDataURL(file);
  });
}

function renderProfile(){
  const u = currentUser();
  page().innerHTML = `
    <div class="panel profile-panel">
      <div class="profile-header">
        ${renderAvatarMarkup(u, 64)}
        <div><h3>${u.name}</h3><p class="muted">${u.studentId}</p></div>
      </div>
      <div id="profile-view">
        <div class="summary-box profile-summary">
          <div class="summary-row"><span>Full Name</span><span>${u.name}</span></div>
          <div class="summary-row"><span>Student ID</span><span>${u.studentId}</span></div>
          <div class="summary-row"><span>Email</span><span>${u.email}</span></div>
          <div class="summary-row"><span>Contact Number</span><span>${formatPhone(u.contact)}</span></div>
        </div>
        <div class="profile-actions"><button class="btn btn-primary" id="edit-profile-btn">Edit Profile</button></div>
      </div>
    </div>`;
  $('#edit-profile-btn').onclick = ()=>{
    $('#profile-view').innerHTML = `
      <div class="form-grid profile-form-grid">
        <label class="field"><span>Full Name</span><input id="ep-name" value="${u.name}"></label>
        <label class="field"><span>Email</span><input value="${u.email}" disabled></label>
        <label class="field"><span>Contact Number</span><input id="ep-contact" value="${formatPhone(u.contact)}"></label>
        <label class="field full">
          <span>Profile Picture</span>
          <input type="file" id="ep-avatar" accept="image/*">
          ${u.avatar ? `<div style="margin-top:.5rem;"><img src="${u.avatar}" alt="Current profile" style="width:82px;height:82px;border-radius:50%;object-fit:cover;border:1px solid var(--line);" /></div>` : ''}
        </label>
      </div>
      <div class="profile-actions profile-actions-edit">
        <button class="btn btn-primary" id="save-profile-btn">Save Changes</button>
        <button class="btn btn-outline" onclick="renderProfile()">Cancel</button>
      </div>`;
    bindPhoneInput('#ep-contact');
    $('#save-profile-btn').onclick = async ()=>{
      const users = DB.get('dt_users',[]);
      const uu = users.find(x=>x.email===u.email);
      const nextContact = normalizePhoneInput($('#ep-contact').value);
      if(nextContact.length !== 11){
        toast('Phone number must be exactly 11 digits.');
        return;
      }
      uu.name = $('#ep-name').value.trim()||uu.name; uu.contact=nextContact;
      const avatarInput = document.getElementById('ep-avatar');
      if(avatarInput && avatarInput.files && avatarInput.files[0]){
        try {
          uu.avatar = await readFileAsDataUrl(avatarInput.files[0]);
        } catch (error) {
          toast(error.message || 'Unable to upload image.');
          return;
        }
      }
      DB.set('dt_users', users);
      syncStudentProfileToRequests(uu.email, uu);

      const session = getSession();
      if(session && session.email === uu.email){
        const nextSession = { ...session, name: uu.name };
        if(localStorage.getItem('dt_session')) DB.set('dt_session', nextSession);
        else sessionStorage.setItem('dt_session', JSON.stringify(nextSession));
      }

      document.getElementById('topbar-avatar').innerHTML = renderAvatarMarkup(uu, 34);
      document.getElementById('topbar-name').textContent = uu.name;
      window.dispatchEvent(new Event('dt-profile-updated'));
      toast('Profile updated.');
      navigate(CURRENT_PAGE || (ROLE==='admin' ? 'a-dashboard' : 'dashboard'));
    };
  };
}

/* ======================= ADMIN: DASHBOARD ======================= */
function renderAdminDashboard(){
  const reqs = DB.get('dt_requests',[]);
  const total=reqs.length, pending=reqs.filter(r=>r.status==='Pending').length,
    approved=reqs.filter(r=>['Approved','Processing'].includes(r.status)).length,
    ready=reqs.filter(r=>r.status==='Ready for Pickup').length,
    revenue=reqs.filter(r=>r.paymentStatus==='Paid').reduce((s,r)=>s+r.fee,0);
  const recent = [...reqs].sort((a,b)=> (b.dateRequested || '').localeCompare(a.dateRequested || '')).slice(0,6);
  page().innerHTML = `
    <div class="grid-cards">
      <div class="stat-card"><div class="stat-label">Total Requests</div><div class="stat-value">${total}</div></div>
      <div class="stat-card"><div class="stat-label">Pending</div><div class="stat-value gold">${pending}</div></div>
      <div class="stat-card"><div class="stat-label">Approved / Processing</div><div class="stat-value">${approved}</div></div>
      <div class="stat-card"><div class="stat-label">Ready for Pickup</div><div class="stat-value">${ready}</div></div>
      <div class="stat-card"><div class="stat-label">Total Revenue</div><div class="stat-value">${fmtMoney(revenue)}</div></div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Recent Requests</h3><button class="btn btn-outline btn-sm" onclick="navigate('a-requests')">View all</button></div>
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>Student</th><th>Document</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>${recent.map(r=>`<tr><td>${r.id}</td><td>${r.studentName}</td><td>${r.document}</td><td>${fmtDate(r.dateRequested)}</td><td>${badge(r.status)}</td></tr>`).join('')}</tbody></table></div>
    </div>`;
}

/* ======================= ADMIN: REQUESTS ======================= */
function renderAdminRequests(){
  const reqs = DB.get('dt_requests',[]);
  page().innerHTML = `
    <div class="panel">
      <h3 class="section-title">Document Requests</h3>
      <div class="table-wrap"><table><thead><tr>
        <th>Request ID</th><th>Student</th><th>Document</th><th>Date</th><th>Payment</th><th>Status</th><th>Action</th>
        </tr></thead><tbody>
        ${reqs.map(r=>`<tr>
          <td>${r.id}</td><td>${r.studentName}</td><td>${r.document}</td><td>${fmtDate(r.dateRequested)}</td>
          <td><span class="badge ${r.paymentStatus==='Paid'?'badge-paid':'badge-unpaid'}">${r.paymentStatus}</span></td>
          <td>${badge(r.status)}</td>
          <td style="white-space:nowrap;">
            <button class="btn btn-outline btn-sm" onclick="adminViewRequest('${r.id}')">View</button>
          </td>
        </tr>`).join('')}
        </tbody></table></div>
    </div>`;
}
function adminViewRequest(id){
  const r = DB.get('dt_requests',[]).find(x=>x.id===id);
  const idx = STATUS_FLOW.indexOf(r.status);
  const nextStatus = idx>=0 && idx<STATUS_FLOW.length-1 ? STATUS_FLOW[idx+1] : null;
  openModal(`
    <h3>${r.id} — ${r.document}</h3>
    <p class="muted" style="margin-top:.3rem;">${r.studentName} (${r.studentEmail})</p>
    <div class="summary-box" style="margin-top:1rem;">
      <div class="summary-row"><span>Purpose</span><span>${r.purpose||'—'}</span></div>
      <div class="summary-row"><span>Quantity</span><span>${r.quantity}</span></div>
      <div class="summary-row"><span>Payment</span><span>${r.paymentStatus}</span></div>
      <div class="summary-row"><span>Current Status</span><span>${badge(r.status)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${fmtMoney(r.fee)}</span></div>
    </div>
    <div class="modal-close-row" style="flex-wrap:wrap;">
      ${r.status!=='Rejected' && r.status!=='Completed' ? `<button class="btn btn-danger" onclick="setReqStatus('${r.id}','Rejected')">Reject</button>`:''}
      ${nextStatus ? `<button class="btn btn-ok" onclick="setReqStatus('${r.id}','${nextStatus}')">Mark as ${nextStatus}</button>` : ''}
      <button class="btn btn-outline" onclick="closeModal()">Close</button>
    </div>`);
}
function setReqStatus(id, status){
  const reqs = DB.get('dt_requests',[]);
  const r = reqs.find(x=>x.id===id);
  r.status = status;
  DB.set('dt_requests', reqs);
  pushNotification(status==='Rejected'?'Request Rejected':`Request ${status}`, `${r.id} (${r.document}) is now ${status}.`,
    status==='Ready for Pickup'?'ready':status==='Processing'?'processing':'approved');
  addLog(currentUser().name, 'Updated status', `${r.id} marked as ${status}`);
  closeModal(); toast(`${r.id} updated to ${status}.`);
  renderAdminRequests();
}

/* ======================= ADMIN: STUDENTS ======================= */
function renderAdminStudents(){
  const students = DB.get('dt_users',[]).filter(u=>u.role==='student');
  const reqs = DB.get('dt_requests',[]);
  page().innerHTML = `
    <div class="panel">
      <h3 class="section-title">Students</h3>
      <div class="table-wrap"><table><thead><tr><th>Name</th><th>Student ID</th><th>Email</th><th>Contact</th><th>Requests</th></tr></thead>
      <tbody>${students.map(s=>`<tr><td>${s.name}</td><td>${s.studentId}</td><td>${s.email}</td><td>${formatPhone(s.contact)}</td>
        <td>${reqs.filter(r=>r.studentEmail===s.email).length}</td></tr>`).join('')}</tbody></table></div>
    </div>`;
}

/* ======================= ADMIN: PAYMENTS ======================= */
function renderAdminPayments(){
  const reqs = DB.get('dt_requests',[]);
  page().innerHTML = `
    <div class="panel">
      <h3 class="section-title">Payments</h3>
      <div class="table-wrap"><table><thead><tr>
        <th>Request ID</th><th>Student</th><th>Amount</th><th>Method</th><th>Reference</th><th>Status</th>
        </tr></thead><tbody>
        ${reqs.map(r=>`<tr><td>${r.id}</td><td>${r.studentName}</td><td>${fmtMoney(r.fee)}</td><td>${r.paymentMethod||'—'}</td>
          <td>${r.paymentRef||'—'}</td><td><span class="badge ${r.paymentStatus==='Paid'?'badge-paid':'badge-unpaid'}">${r.paymentStatus}</span></td></tr>`).join('')}
        </tbody></table></div>
    </div>`;
}

/* ======================= ADMIN: PICKUP ======================= */
function renderAdminPickup(){
  const reqs = DB.get('dt_requests',[]).filter(r=>r.pickupSlot && r.paymentStatus === 'Paid');
  const qrRequest = reqs[0] || null;
  page().innerHTML = `
    <div class="panel">
      <h3 class="section-title">Pickup Schedule</h3>
      ${reqs.length? `<div class="table-wrap"><table><thead><tr><th>Request ID</th><th>Student</th><th>Document</th><th>Date</th><th>Time Window</th></tr></thead>
      <tbody>${reqs.map(r=>`<tr><td>${r.id}</td><td>${r.studentName}</td><td>${r.document}</td><td>${fmtDate(r.pickupSlot.date)}</td><td>${r.pickupSlot.time}</td></tr>`).join('')}</tbody></table></div>`
      : emptyState('📅','No scheduled pickups yet','Scheduled pickups will appear here.')}
    </div>
    ${qrRequest ? renderQrCard({
      id: qrRequest.id,
      documentName: qrRequest.document,
      status: qrRequest.status,
      title: 'My QR Codes',
      subtitle: 'Show these QR codes to the registrar window for verification during release.'
    }) : ''}`;
  if(qrRequest) renderQrBoxes();
}

/* ======================= ADMIN: REPORTS ======================= */
function renderAdminReports(){
  const reqs = DB.get('dt_requests',[]);
  const byDoc = {}; Object.keys(FEES).forEach(d=> byDoc[d]=0);
  reqs.forEach(r=> byDoc[r.document] = (byDoc[r.document]||0)+1);
  const maxDoc = Math.max(1,...Object.values(byDoc));
  const pending = reqs.filter(r=>['Pending','Under Review'].includes(r.status)).length;
  const approved = reqs.filter(r=>['Approved','Processing','Ready for Pickup','Completed'].includes(r.status)).length;
  const revenue = reqs.filter(r=>r.paymentStatus==='Paid').reduce((s,r)=>s+r.fee,0);
  const weekly = [8,13,10,17,12,6,4]; const maxW = Math.max(...weekly);
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  page().innerHTML = `
    <div class="grid-cards">
      <div class="stat-card"><div class="stat-label">Total Requests</div><div class="stat-value">${reqs.length}</div></div>
      <div class="stat-card"><div class="stat-label">Pending vs Approved</div><div class="stat-value">${pending} / ${approved}</div></div>
      <div class="stat-card"><div class="stat-label">Total Revenue</div><div class="stat-value gold">${fmtMoney(revenue)}</div></div>
    </div>
    <div class="panel">
      <h3 class="section-title">Requests by Document Type</h3>
      <div class="bar-chart">${Object.entries(byDoc).map(([k,v])=>`
        <div class="bar-col"><div class="bar-val">${v}</div><div class="bar-fill" style="height:${(v/maxDoc*100)||2}%;"></div>
        <div class="bar-label">${k.split(' (')[0]}</div></div>`).join('')}</div>
    </div>
    <div class="panel">
      <h3 class="section-title">Requests This Week</h3>
      <div class="bar-chart">${weekly.map((v,i)=>`
        <div class="bar-col"><div class="bar-val">${v}</div><div class="bar-fill" style="height:${v/maxW*100}%;"></div>
        <div class="bar-label">${days[i]}</div></div>`).join('')}</div>
    </div>`;
}

/* ======================= ADMIN: LOGS / SETTINGS ======================= */
function addLog(user, action, desc){
  const logs = DB.get('dt_logs',[]);
  logs.unshift({user, action, when:'Just now', desc});
  DB.set('dt_logs', logs);
}
function renderAdminLogs(){
  const logs = DB.get('dt_logs',[]);
  page().innerHTML = `
    <div class="panel">
      <h3 class="section-title">Activity Logs</h3>
      <div class="table-wrap"><table><thead><tr><th>User</th><th>Action</th><th>Date/Time</th><th>Description</th></tr></thead>
      <tbody>${logs.map(l=>`<tr><td>${l.user}</td><td>${l.action}</td><td>${l.when}</td><td>${l.desc}</td></tr>`).join('')}</tbody></table></div>
    </div>`;
}
function renderAdminSettings(){
  page().innerHTML = `
    <div class="panel" style="max-width:560px;">
      <h3 class="section-title">Settings</h3>
      <label class="field"><span>Processing Fee — Form 137</span><input value="₱120.00" disabled></label>
      <label class="field"><span>Processing Fee — Form 138</span><input value="₱110.00" disabled></label>
      <label class="field"><span>Processing Fee — Certificate of Graduation / Diploma</span><input value="₱150.00" disabled></label>
      <label class="field"><span>Processing Fee — Certificate of Good Moral Character</span><input value="₱80.00" disabled></label>
      <label class="field"><span>Processing Fee — Transcript of Records (TOR)</span><input value="₱100.00" disabled></label>
      <label class="field"><span>Processing Fee — Certificate of Enrollment / Attendance</span><input value="₱60.00" disabled></label>
      <label class="field"><span>Processing Fee — Certified True Copy (CTC)</span><input value="₱70.00" disabled></label>
      <label class="field"><span>Office Hours</span><input value="Mon–Fri, 8:00 AM – 5:00 PM" disabled></label>
      <p class="muted" style="margin-top:.5rem;">Settings are read-only in this prototype.</p>
    </div>`;
}

/* ======================= INIT ======================= */
window.navigate = navigate; // expose for inline onclick handlers
(function init(){
  const session = getSession();
  if(session){
    const u = DB.get('dt_users',[]).find(x=>x.email===session.email);
    if(u){ enterApp(u); return; }
  }
})();