// ===== STATE =====
let students=[
{id:1,student_number:'2024-0001',firstname:'Maria',middlename:'Cruz',lastname:'Santos',suffix:'',course:'BSIT',year_level:'3rd',section:'A',gender:'Female',birthdate:'2003-05-12',email:'maria@univ.edu.ph',contact_number:'09171234567',status:'Active'},
{id:2,student_number:'2024-0002',firstname:'Juan',middlename:'Reyes',lastname:'Dela Cruz',suffix:'',course:'BSCS',year_level:'4th',section:'B',gender:'Male',birthdate:'2002-08-22',email:'juan@univ.edu.ph',contact_number:'09181234567',status:'Active'},
{id:3,student_number:'2024-0003',firstname:'Ana',middlename:'',lastname:'Reyes',suffix:'',course:'BSA',year_level:'2nd',section:'A',gender:'Female',birthdate:'2004-01-15',email:'ana@univ.edu.ph',contact_number:'09191234567',status:'Active'},
{id:4,student_number:'2024-0004',firstname:'Pedro',middlename:'Lopez',lastname:'Garcia',suffix:'Jr.',course:'BSBA',year_level:'1st',section:'C',gender:'Male',birthdate:'2005-03-10',email:'pedro@univ.edu.ph',contact_number:'09201234567',status:'Inactive'}
];
let nextStudentId=5;

let docTypes=[{id:1,name:'Transcript of Records',fee:150,days:5,reqs:'Clearance, ID'},{id:2,name:'Certificate of Enrollment',fee:50,days:2,reqs:'ID'},{id:3,name:'Diploma',fee:500,days:15,reqs:'Clearance, ID, Grad Fee'},{id:4,name:'Certificate of Good Moral',fee:75,days:3,reqs:'ID'},{id:5,name:'Honorable Dismissal',fee:200,days:7,reqs:'Clearance, ID'}];

let requests=[
{id:'REQ-2026-001',student:'Maria Santos',doc:'Transcript of Records',date:'2026-07-28',status:'Ready for Pickup',fee:150,paid:true,history:[{s:'Created',t:'2026-07-28 09:00',by:'Maria Santos'},{s:'Approved',t:'2026-07-28 10:30',by:'Admin'},{s:'Payment Verified',t:'2026-07-28 11:00',by:'Admin'},{s:'Processing',t:'2026-07-28 14:00',by:'Admin'},{s:'Ready for Pickup',t:'2026-07-29 16:00',by:'Admin'}]},
{id:'REQ-2026-002',student:'Juan Dela Cruz',doc:'Certificate of Enrollment',date:'2026-07-29',status:'Processing',fee:50,paid:true,history:[{s:'Created',t:'2026-07-29 08:00',by:'Juan Dela Cruz'},{s:'Approved',t:'2026-07-29 09:00',by:'Admin'},{s:'Payment Verified',t:'2026-07-29 10:00',by:'Admin'},{s:'Processing',t:'2026-07-29 14:00',by:'Admin'}]},
{id:'REQ-2026-003',student:'Ana Reyes',doc:'Diploma',date:'2026-07-29',status:'Pending',fee:500,paid:false,history:[{s:'Created',t:'2026-07-29 10:00',by:'Ana Reyes'}]},
{id:'REQ-2026-004',student:'Pedro Garcia',doc:'Certificate of Good Moral',date:'2026-07-30',status:'Pending',fee:75,paid:false,history:[{s:'Created',t:'2026-07-30 08:00',by:'Pedro Garcia'}]},
{id:'REQ-2026-005',student:'Maria Santos',doc:'Certificate of Enrollment',date:'2026-07-30',status:'Approved',fee:50,paid:false,history:[{s:'Created',t:'2026-07-30 05:15',by:'Maria Santos'},{s:'Approved',t:'2026-07-30 05:30',by:'Admin'}]}
];

let payments=[
{id:'PAY-001',request:'REQ-2026-001',student:'Maria Santos',amount:150,ref:'GCash-78291',date:'2026-07-28',status:'Verified'},
{id:'PAY-002',request:'REQ-2026-002',student:'Juan Dela Cruz',amount:50,ref:'BDO-44521',date:'2026-07-29',status:'Verified'},
{id:'PAY-003',request:'REQ-2026-003',student:'Ana Reyes',amount:500,ref:'',date:'',status:'Payment Pending'},
{id:'PAY-004',request:'REQ-2026-005',student:'Maria Santos',amount:50,ref:'',date:'',status:'Payment Pending'}
];

let schedules=[
{request:'REQ-2026-001',student:'Maria Santos',doc:'Transcript of Records',date:'2026-07-30',time:'10:00 AM',status:'Ready for Pickup'},
{request:'REQ-2026-002',student:'Juan Dela Cruz',doc:'Certificate of Enrollment',date:'2026-07-31',time:'2:00 PM',status:'Processing'}
];

let logs=[
{time:'2026-07-30 05:30',user:'Admin',action:'Approved request REQ-2026-005',type:'approve'},
{time:'2026-07-30 05:15',user:'Maria Santos',action:'Created request REQ-2026-005',type:'create'},
{time:'2026-07-29 14:00',user:'Admin',action:'Verified payment PAY-002',type:'verify'},
{time:'2026-07-29 10:00',user:'Admin',action:'Login',type:'login'},
{time:'2026-07-28 16:00',user:'Admin',action:'Released REQ-2026-001 to Maria Santos',type:'release'}
];

let notifications=[
{id:1,msg:'Request REQ-2026-001 is ready for pickup',time:'2026-07-30 04:00',read:false},
{id:2,msg:'Payment for REQ-2026-002 has been verified',time:'2026-07-29 14:00',read:false},
{id:3,msg:'New request REQ-2026-005 submitted',time:'2026-07-30 05:15',read:false},
{id:4,msg:'Request REQ-2026-003 is pending approval',time:'2026-07-29 10:00',read:true},
{id:5,msg:'System maintenance scheduled for Aug 1',time:'2026-07-28 09:00',read:true}
];

let currentRole='',currentPage='dashboard';
let reqSearch='',reqFilter='All',reqSort='date-desc',reqPageNum=1;
let stuSearch='',stuFilterCourse='All',stuFilterYear='All',stuFilterSection='All',stuPageNum=1;
const PER_PAGE=5;const STU_PER_PAGE=10;
let nextReqNum=6,nextPayNum=5,nextNotifId=6;

// ===== MOBILE MENU =====
function toggleMobileMenu(){
  const sidebar=document.getElementById('sidebar');
  const backdrop=document.getElementById('mobile-menu-backdrop');
  const button=document.getElementById('mobile-menu-toggle');
  const open=sidebar.classList.toggle('open');
  backdrop.classList.toggle('show',open);
  document.body.classList.toggle('menu-open',open);
  if(button){
    button.setAttribute('aria-expanded',open?'true':'false');
    button.innerHTML=open?'<i class="fas fa-times"></i>':'<i class="fas fa-bars"></i>';
  }
}
function closeMobileMenu(){
  const sidebar=document.getElementById('sidebar');
  const backdrop=document.getElementById('mobile-menu-backdrop');
  const button=document.getElementById('mobile-menu-toggle');
  if(!sidebar) return;
  sidebar.classList.remove('open');
  if(backdrop) backdrop.classList.remove('show');
  document.body.classList.remove('menu-open');
  if(button){
    button.setAttribute('aria-expanded','false');
    button.innerHTML='<i class="fas fa-bars"></i>';
  }
}
window.addEventListener('resize',()=>{if(window.innerWidth>768) closeMobileMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeMobileMenu();});

document.addEventListener('click',function(e){
  const link=e.target.closest('#sidebar-nav a');
  if(link && window.innerWidth<=768) closeMobileMenu();
});

// ===== AUTH =====
const CREDENTIALS={admin:{password:'123',role:'admin'},student:{password:'123',role:'student'}};
function handleLogin(){const u=document.getElementById('login-user').value.trim(),p=document.getElementById('login-pass').value,cred=CREDENTIALS[u];if(cred&&cred.password===p){currentRole=cred.role;sessionStorage.setItem('drrts_role',currentRole);document.getElementById('login-error').classList.add('hidden');showApp()}else{document.getElementById('login-error').classList.remove('hidden')}}
function handleLogout(){sessionStorage.removeItem('drrts_role');currentRole='';currentPage='dashboard';document.getElementById('app-container').style.display='none';document.getElementById('login-screen').style.display='flex';document.getElementById('login-user').value='';document.getElementById('login-pass').value=''}
function showApp(){document.getElementById('login-screen').style.display='none';document.getElementById('app-container').style.display='block';document.getElementById('user-avatar').textContent=currentRole==='admin'?'AD':'MS';buildNav();renderPage()}
function buildNav(){
const adminNav=[{page:'dashboard',icon:'fa-tachometer-alt',label:'Dashboard'},{page:'requests',icon:'fa-file-alt',label:'Requests'},{page:'students',icon:'fa-users',label:'Students'},{page:'payments',icon:'fa-credit-card',label:'Payments'},{page:'schedules',icon:'fa-calendar-alt',label:'Schedules'},{page:'doctypes',icon:'fa-folder-open',label:'Document Types'},{page:'notifications',icon:'fa-bell',label:'Notifications'},{page:'reports',icon:'fa-chart-bar',label:'Reports'}];
const studentNav=[{page:'dashboard',icon:'fa-tachometer-alt',label:'Dashboard'},{page:'requests',icon:'fa-file-alt',label:'My Requests'},{page:'payments',icon:'fa-credit-card',label:'Payments'},{page:'schedules',icon:'fa-calendar-alt',label:'Schedule'},{page:'notifications',icon:'fa-bell',label:'Notifications'},{page:'doctypes',icon:'fa-folder-open',label:'Document Types'}];
const items=currentRole==='admin'?adminNav:studentNav;
document.getElementById('sidebar-nav').innerHTML=items.map(i=>`<a href="#" data-page="${i.page}" class="${i.page===currentPage?'active':''}"><i class="fas ${i.icon} w-5"></i>${i.label}</a>`).join('');
document.querySelectorAll('#sidebar-nav a').forEach(a=>{a.addEventListener('click',e=>{e.preventDefault();currentPage=a.dataset.page;activateNav(currentPage);renderPage();document.getElementById('sidebar').classList.remove('open')})});
}
(function(){const saved=sessionStorage.getItem('drrts_role');if(saved){currentRole=saved;showApp()}})();

// ===== UTILITIES =====
function now(){return new Date().toISOString().slice(0,16).replace('T',' ')}
function sanitize(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
function getFullName(s){return [s.firstname,s.middlename,s.lastname,s.suffix].filter(Boolean).join(' ')}
function badge(s){const m={'Pending':'badge-pending','Approved':'badge-approved','Rejected':'badge-rejected','Cancelled':'badge-cancelled','Processing':'badge-processing','Ready for Pickup':'badge-ready','Completed':'badge-completed','Released':'badge-released','Payment Pending':'badge-payment','Verified':'badge-verified','Pending Verification':'badge-pending-verify'};return `<span class="badge ${m[s]||'badge-pending'}">${sanitize(s)}</span>`}
function showToast(msg,type='success'){const t=document.getElementById('toast');t.textContent=msg;t.className='toast toast-'+type;t.style.display='block';setTimeout(()=>t.style.display='none',3500)}
function openModal(html){document.getElementById('modal-content').innerHTML=html;document.getElementById('modal').classList.add('show')}
function closeModal(){document.getElementById('modal').classList.remove('show')}
document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
function addLog(action,type,user){logs.unshift({time:now(),user:user||'Admin',action,type})}
function addNotif(msg){notifications.unshift({id:nextNotifId++,msg,time:now(),read:false});updateNotifBadge()}
function updateNotifBadge(){const c=notifications.filter(n=>!n.read).length;const b=document.getElementById('notif-badge');if(b){b.textContent=c;b.style.display=c?'flex':'none'}}
function activateNav(page){document.querySelectorAll('#sidebar-nav a').forEach(x=>x.classList.remove('active'));const a=document.querySelector(`#sidebar-nav a[data-page="${page}"]`);if(a)a.classList.add('active')}
function getPaymentForReq(id){return payments.find(p=>p.request===id)}
function isLocked(r){return r.status==='Released'||r.status==='Completed'}
function getStats(){const s={pending:0,processing:0,ready:0,completed:0,rejected:0,approved:0,cancelled:0,total:requests.length,revenue:0};requests.forEach(r=>{if(r.status==='Pending')s.pending++;else if(r.status==='Approved')s.approved++;else if(r.status==='Processing')s.processing++;else if(r.status==='Ready for Pickup')s.ready++;else if(r.status==='Released'||r.status==='Completed')s.completed++;else if(r.status==='Rejected')s.rejected++;else if(r.status==='Cancelled')s.cancelled++});s.revenue=payments.filter(p=>p.status==='Verified').reduce((a,p)=>a+p.amount,0);return s}

// ===== RENDER =====
function renderPage(){const c=document.getElementById('content-area');const pages={dashboard:currentRole==='admin'?adminDash:studentDash,requests:requestsPage,payments:paymentsPage,schedules:schedulesPage,students:studentsPage,doctypes:docTypesPage,notifications:notificationsPage,reports:reportsPage};c.innerHTML=(pages[currentPage]||pages.dashboard)();updateNotifBadge();if(currentPage==='dashboard'&&currentRole==='admin')setTimeout(initCharts,60)}

function adminDash(){const st=getStats();return `
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
<div class="stat-card border-l-4 border-yellow-400"><div class="text-2xl font-bold text-yellow-600">${st.pending}</div><div class="text-xs text-gray-500 mt-1">Pending</div></div>
<div class="stat-card border-l-4 border-blue-400"><div class="text-2xl font-bold text-blue-600">${st.processing}</div><div class="text-xs text-gray-500 mt-1">Processing</div></div>
<div class="stat-card border-l-4 border-teal-400"><div class="text-2xl font-bold text-teal-600">${st.ready}</div><div class="text-xs text-gray-500 mt-1">Ready for Pickup</div></div>
<div class="stat-card border-l-4 border-green-400"><div class="text-2xl font-bold text-green-600">${st.completed}</div><div class="text-xs text-gray-500 mt-1">Released/Completed</div></div>
<div class="stat-card border-l-4 border-purple-400"><div class="text-2xl font-bold text-purple-600">${st.approved}</div><div class="text-xs text-gray-500 mt-1">Awaiting Payment</div></div>
<div class="stat-card border-l-4 border-red-400"><div class="text-2xl font-bold text-red-500">${st.rejected}</div><div class="text-xs text-gray-500 mt-1">Rejected</div></div>
<div class="stat-card border-l-4 border-orange-400"><div class="text-2xl font-bold text-orange-500">${st.cancelled}</div><div class="text-xs text-gray-500 mt-1">Cancelled</div></div>
<div class="stat-card border-l-4 border-emerald-400"><div class="text-2xl font-bold text-emerald-600">₱${st.revenue.toLocaleString()}</div><div class="text-xs text-gray-500 mt-1">Revenue</div></div>
</div>
<div class="grid lg:grid-cols-2 gap-4 mb-5">
<div class="bg-white rounded-xl p-5 shadow-sm"><h3 class="font-semibold text-sm mb-3">Requests by Status</h3><canvas id="chartRequests" height="160"></canvas></div>
<div class="bg-white rounded-xl p-5 shadow-sm"><h3 class="font-semibold text-sm mb-3">Revenue by Document</h3><canvas id="chartRevenue" height="160"></canvas></div>
</div>
<div class="grid lg:grid-cols-2 gap-4">
<div class="bg-white rounded-xl p-5 shadow-sm"><h3 class="font-semibold text-sm mb-3">Pending Approvals</h3><table><thead><tr><th>ID</th><th>Student</th><th>Document</th><th>Actions</th></tr></thead><tbody>${requests.filter(r=>r.status==='Pending').slice(0,5).map(r=>`<tr><td class="text-blue-600 font-medium cursor-pointer" onclick="showRequestDetail('${r.id}')">${r.id}</td><td>${sanitize(r.student)}</td><td>${sanitize(r.doc)}</td><td><button onclick="approveRequest('${r.id}')" class="text-green-600 text-xs mr-1" title="Approve"><i class="fas fa-check"></i></button><button onclick="cancelRequest('${r.id}')" class="text-red-600 text-xs" title="Cancel"><i class="fas fa-ban"></i></button></td></tr>`).join('')||'<tr><td colspan="4" class="empty-state">No pending approvals</td></tr>'}</tbody></table></div>
<div class="bg-white rounded-xl p-5 shadow-sm"><h3 class="font-semibold text-sm mb-3">Recent Activity</h3><div class="space-y-3">${logs.slice(0,6).map(l=>`<div class="flex items-start gap-3"><div class="w-2 h-2 mt-2 rounded-full ${l.type==='approve'?'bg-green-500':l.type==='reject'||l.type==='cancel'?'bg-red-500':'bg-blue-500'}"></div><div><div class="text-xs text-gray-800">${sanitize(l.action)}</div><div class="text-[11px] text-gray-400">${l.time} · ${sanitize(l.user)}</div></div></div>`).join('')}</div></div>
</div>`}

function studentDash(){const myReqs=requests.filter(r=>r.student==='Maria Santos');const st={pending:myReqs.filter(r=>r.status==='Pending').length,processing:myReqs.filter(r=>r.status==='Processing').length,ready:myReqs.filter(r=>r.status==='Ready for Pickup').length,done:myReqs.filter(r=>r.status==='Released'||r.status==='Completed').length};
const unpaid=payments.filter(p=>p.student==='Maria Santos'&&p.status==='Payment Pending');
return `
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
<div class="stat-card border-l-4 border-yellow-400"><div class="text-2xl font-bold text-yellow-600">${st.pending}</div><div class="text-xs text-gray-500 mt-1">Pending</div></div>
<div class="stat-card border-l-4 border-blue-400"><div class="text-2xl font-bold text-blue-500">${st.processing}</div><div class="text-xs text-gray-500 mt-1">Processing</div></div>
<div class="stat-card border-l-4 border-teal-400"><div class="text-2xl font-bold text-teal-600">${st.ready}</div><div class="text-xs text-gray-500 mt-1">Ready for Pickup</div></div>
<div class="stat-card border-l-4 border-green-400"><div class="text-2xl font-bold text-green-600">${st.done}</div><div class="text-xs text-gray-500 mt-1">Completed</div></div>
</div>
<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
<button onclick="openNewRequest()" class="bg-blue-600 text-white rounded-xl p-4 text-center hover:bg-blue-700 transition"><i class="fas fa-plus mb-1"></i><div class="text-xs font-medium">New Request</div></button>
<button onclick="currentPage='requests';activateNav('requests');renderPage()" class="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow transition"><i class="fas fa-search text-blue-600 mb-1"></i><div class="text-xs font-medium text-gray-700">Track Request</div></button>
<button onclick="currentPage='schedules';activateNav('schedules');renderPage()" class="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow transition"><i class="fas fa-calendar text-teal-600 mb-1"></i><div class="text-xs font-medium text-gray-700">Schedule</div></button>
<button onclick="currentPage='payments';activateNav('payments');renderPage()" class="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow transition"><i class="fas fa-money-bill text-emerald-600 mb-1"></i><div class="text-xs font-medium text-gray-700">Payments</div></button>
</div>
${unpaid.length?`<div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4"><div class="flex items-center gap-2 text-yellow-800 text-sm font-medium"><i class="fas fa-exclamation-triangle"></i> You have ${unpaid.length} pending payment(s)</div></div>`:''}
<div class="bg-white rounded-xl p-5 shadow-sm mb-4"><h3 class="font-semibold text-sm mb-3">My Requests</h3><table><thead><tr><th>ID</th><th>Document</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>${myReqs.length?myReqs.map(r=>`<tr><td class="text-blue-600 font-medium cursor-pointer" onclick="showRequestDetail('${r.id}')">${r.id}</td><td>${sanitize(r.doc)}</td><td>${r.date}</td><td>${badge(r.status)}</td><td>${r.status==='Approved'&&!r.paid?`<button onclick="openUploadReceipt('${r.id}')" class="text-xs text-emerald-600 font-medium"><i class="fas fa-upload"></i> Pay</button>`:'—'}</td></tr>`).join(''):'<tr><td colspan="5" class="empty-state">No requests yet. Click "New Request" to get started.</td></tr>'}</tbody></table></div>`}

// ===== REQUESTS PAGE =====
function getFilteredRequests(){let res=[...requests];if(currentRole==='student')res=res.filter(r=>r.student==='Maria Santos');if(reqSearch){const q=reqSearch.toLowerCase();res=res.filter(r=>r.id.toLowerCase().includes(q)||r.student.toLowerCase().includes(q)||r.doc.toLowerCase().includes(q))}if(reqFilter!=='All')res=res.filter(r=>r.status===reqFilter);res.sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));return res}

function requestsPage(){
const filtered=getFilteredRequests();const totalPages=Math.max(1,Math.ceil(filtered.length/PER_PAGE));if(reqPageNum>totalPages)reqPageNum=totalPages;const paged=filtered.slice((reqPageNum-1)*PER_PAGE,reqPageNum*PER_PAGE);
const statuses=['All','Pending','Approved','Processing','Ready for Pickup','Released','Cancelled','Rejected'];
return `<div class="bg-white rounded-xl p-5 shadow-sm">
<div class="flex flex-wrap items-center justify-between gap-3 mb-4">
<h3 class="font-semibold text-sm">${currentRole==='student'?'My':'All'} Requests <span class="text-gray-400 font-normal">(${filtered.length})</span></h3>
<div class="flex flex-wrap gap-2">
<input type="text" placeholder="Search..." value="${sanitize(reqSearch)}" class="border rounded-lg px-3 py-1.5 text-xs w-36 focus:outline-none focus:ring-1 focus:ring-blue-400" oninput="reqSearch=this.value;reqPageNum=1;renderPage()">
<select class="border rounded-lg px-2 py-1.5 text-xs focus:outline-none" onchange="reqFilter=this.value;reqPageNum=1;renderPage()">${statuses.map(s=>`<option ${s===reqFilter?'selected':''}>${s}</option>`).join('')}</select>
<button onclick="openNewRequest()" class="btn-primary"><i class="fas fa-plus mr-1"></i>New</button>
</div></div>
<div class="overflow-x-auto"><table><thead><tr><th>ID</th>${currentRole==='admin'?'<th>Student</th>':''}<th>Document</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>${paged.length?paged.map(r=>`<tr><td class="text-blue-600 font-medium cursor-pointer" onclick="showRequestDetail('${r.id}')">${r.id}</td>${currentRole==='admin'?`<td>${sanitize(r.student)}</td>`:''}<td>${sanitize(r.doc)}</td><td>${r.date}</td><td>${badge(r.status)}</td><td class="flex gap-1 flex-wrap">${actionButtons(r)}</td></tr>`).join(''):'<tr><td colspan="6" class="empty-state">No requests found</td></tr>'}</tbody></table></div>
<div class="pagination">${paginationHtml(totalPages,'reqPageNum')}</div></div>`}

function actionButtons(r){
let b=`<button onclick="showRequestDetail('${r.id}')" class="text-blue-600 text-xs" title="View"><i class="fas fa-eye"></i></button>`;
if(currentRole==='admin'&&!isLocked(r)){
if(r.status==='Pending')b+=` <button onclick="approveRequest('${r.id}')" class="text-green-600 text-xs" title="Approve"><i class="fas fa-check"></i></button> <button onclick="cancelRequest('${r.id}')" class="text-red-600 text-xs" title="Cancel"><i class="fas fa-ban"></i></button>`;
if(r.status==='Approved'&&r.paid)b+=` <button onclick="processRequest('${r.id}')" class="text-indigo-600 text-xs" title="Process"><i class="fas fa-cog"></i></button>`;
if(r.status==='Processing')b+=` <button onclick="readyRequest('${r.id}')" class="text-teal-600 text-xs" title="Ready"><i class="fas fa-box-open"></i></button>`;
if(r.status==='Ready for Pickup')b+=` <button onclick="releaseRequest('${r.id}')" class="text-purple-600 text-xs" title="Release"><i class="fas fa-handshake"></i></button>`;
}
if(currentRole==='student'&&r.status==='Approved'&&!r.paid)b+=` <button onclick="openUploadReceipt('${r.id}')" class="text-emerald-600 text-xs"><i class="fas fa-upload"></i></button>`;
return b;
}

function paginationHtml(total,varName){
let h=`<button ${eval(varName)<=1?'disabled':''} onclick="${varName}--;renderPage()"><i class="fas fa-chevron-left"></i></button>`;
for(let i=1;i<=total;i++)h+=`<button class="${i===eval(varName)?'active':''}" onclick="${varName}=${i};renderPage()">${i}</button>`;
h+=`<button ${eval(varName)>=total?'disabled':''} onclick="${varName}++;renderPage()"><i class="fas fa-chevron-right"></i></button>`;
return h;
}

// ===== STUDENTS PAGE =====
let stuSearchTimer=null;

function getStudentsByFilters(){
  let res=[...students];

  if(stuFilterCourse!=='All'){
    res=res.filter(s=>s.course===stuFilterCourse);
  }

  if(stuFilterYear!=='All'){
    res=res.filter(s=>s.year_level===stuFilterYear);
  }

  if(stuFilterSection!=='All'){
    res=res.filter(s=>s.section===stuFilterSection);
  }

  return res;
}

function getFilteredStudents(){
  let res=getStudentsByFilters();
  const q=stuSearch.trim().toLowerCase();

  if(q){
    res=res.filter(s=>{
      const name=getFullName(s).toLowerCase();
      const number=String(s.student_number||'').toLowerCase();
      const email=String(s.email||'').toLowerCase();
      const course=String(s.course||'').toLowerCase();
      const year=String(s.year_level||'').toLowerCase();
      const section=String(s.section||'').toLowerCase();

      return name.includes(q) ||
             number.includes(q) ||
             email.includes(q) ||
             course.includes(q) ||
             year.includes(q) ||
             section.includes(q);
    });
  }

  return res;
}

function resetStudentFilters(showMessage=true){
  stuFilterCourse='All';
  stuFilterYear='All';
  stuFilterSection='All';
  stuPageNum=1;

  if(showMessage){
    showToast('No students matched the selected filters. Filters reset.','error');
  }
}

function updateStudentFilterControls(){
  const course=document.getElementById('student-filter-course');
  const year=document.getElementById('student-filter-year');
  const section=document.getElementById('student-filter-section');

  if(course) course.value=stuFilterCourse;
  if(year) year.value=stuFilterYear;
  if(section) section.value=stuFilterSection;
}

function renderStudentRows(){
  const tbody=document.getElementById('students-table-body');
  const count=document.getElementById('students-count');
  const pagination=document.getElementById('students-pagination');

  if(!tbody) return;

  const filtered=getFilteredStudents();
  const totalPages=Math.max(1,Math.ceil(filtered.length/STU_PER_PAGE));

  if(stuPageNum>totalPages) stuPageNum=totalPages;

  const paged=filtered.slice(
    (stuPageNum-1)*STU_PER_PAGE,
    stuPageNum*STU_PER_PAGE
  );

  if(count) count.textContent=`(${filtered.length})`;

  tbody.innerHTML=paged.length ? paged.map(s=>`<tr>
    <td class="font-medium">${sanitize(s.student_number)}</td>
    <td>${sanitize(getFullName(s))}</td>
    <td>${sanitize(s.course)}</td>
    <td>${sanitize(s.year_level)}</td>
    <td>${sanitize(s.section)}</td>
    <td><span class="badge ${s.status==='Active'?'badge-approved':'badge-rejected'}">${sanitize(s.status)}</span></td>
    <td class="flex gap-1">
      <button onclick="openViewStudent(${s.id})" class="text-blue-600 text-xs" title="View"><i class="fas fa-eye"></i></button>
      <button onclick="openEditStudent(${s.id})" class="text-yellow-600 text-xs" title="Edit"><i class="fas fa-edit"></i></button>
      <button onclick="confirmDeleteStudent(${s.id})" class="text-red-600 text-xs" title="Delete"><i class="fas fa-trash"></i></button>
    </td>
  </tr>`).join('') : '<tr><td colspan="7" class="empty-state">No students found.</td></tr>';

  if(pagination){
    pagination.innerHTML=paginationHtml(totalPages,'stuPageNum');
  }
}

function applyStudentFilter(type,value){
  if(type==='course') stuFilterCourse=value;
  if(type==='year') stuFilterYear=value;
  if(type==='section') stuFilterSection=value;

  stuPageNum=1;

  // Search must not affect whether a filter combination is valid.
  // Only reset when the selected Course + Year + Section has no students.
  if(getStudentsByFilters().length===0){
    resetStudentFilters(true);
  }

  updateStudentFilterControls();
  renderStudentRows();
}

function searchStudents(value){
  stuSearch=value;
  stuPageNum=1;

  clearTimeout(stuSearchTimer);
  stuSearchTimer=setTimeout(()=>{
    if(currentPage==='students'){
      // Update only the table, not the whole page.
      // This keeps the input focused while typing.
      renderStudentRows();
    }
  },120);
}

function studentsPage(){
  if(currentRole!=='admin') return '<div class="empty-state">Access denied</div>';

  const courses=[...new Set(students.map(s=>s.course).filter(Boolean))].sort();
  const years=[...new Set(students.map(s=>s.year_level).filter(Boolean))];
  const sections=[...new Set(students.map(s=>s.section).filter(Boolean))].sort();

  return `<div class="bg-white rounded-xl p-5 shadow-sm">
  <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
    <h3 class="font-semibold text-sm">Students <span id="students-count" class="text-gray-400 font-normal">(${getFilteredStudents().length})</span></h3>
    <div class="flex flex-wrap gap-2">
      <input id="student-search" type="text" placeholder="Search name, ID, email..." value="${sanitize(stuSearch)}" class="border rounded-lg px-3 py-1.5 text-xs w-44 focus:outline-none focus:ring-1 focus:ring-blue-400" oninput="searchStudents(this.value)">

      <select id="student-filter-course" class="border rounded-lg px-2 py-1.5 text-xs" onchange="applyStudentFilter('course',this.value)">
        <option value="All">All Courses</option>
        ${courses.map(c=>`<option value="${sanitize(c)}" ${c===stuFilterCourse?'selected':''}>${sanitize(c)}</option>`).join('')}
      </select>

      <select id="student-filter-year" class="border rounded-lg px-2 py-1.5 text-xs" onchange="applyStudentFilter('year',this.value)">
        <option value="All">All Years</option>
        ${years.map(y=>`<option value="${sanitize(y)}" ${y===stuFilterYear?'selected':''}>${sanitize(y)}</option>`).join('')}
      </select>

      <select id="student-filter-section" class="border rounded-lg px-2 py-1.5 text-xs" onchange="applyStudentFilter('section',this.value)">
        <option value="All">All Sections</option>
        ${sections.map(sc=>`<option value="${sanitize(sc)}" ${sc===stuFilterSection?'selected':''}>${sanitize(sc)}</option>`).join('')}
      </select>
    </div>
  </div>

  <div class="flex gap-2 mb-4">
    <button onclick="openAddStudent()" class="btn-primary"><i class="fas fa-plus mr-1"></i>Manual Add</button>
    <button onclick="openCSVImport()" class="btn-secondary"><i class="fas fa-file-csv mr-1"></i>CSV Import</button>
  </div>

  <div class="overflow-x-auto">
    <table>
      <thead><tr><th>Student No.</th><th>Name</th><th>Course</th><th>Year</th><th>Section</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody id="students-table-body"></tbody>
    </table>
  </div>

  <div id="students-pagination" class="pagination"></div>
  </div>`;
}

function studentFormFields(s){
const g=s||{student_number:'',firstname:'',middlename:'',lastname:'',suffix:'',course:'BSIT',year_level:'1st',section:'A',gender:'Male',birthdate:'',email:'',contact_number:'',status:'Active'};
return `
<div class="grid grid-cols-2 gap-3">
<div><label class="text-xs font-medium text-gray-600 block mb-1">Student Number *</label><input id="sf-snum" type="text" value="${sanitize(g.student_number)}" class="border rounded-lg px-3 py-2 text-sm w-full" placeholder="e.g., 2024-0005"></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">First Name *</label><input id="sf-fname" type="text" value="${sanitize(g.firstname)}" class="border rounded-lg px-3 py-2 text-sm w-full"></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Middle Name</label><input id="sf-mname" type="text" value="${sanitize(g.middlename)}" class="border rounded-lg px-3 py-2 text-sm w-full"></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Last Name *</label><input id="sf-lname" type="text" value="${sanitize(g.lastname)}" class="border rounded-lg px-3 py-2 text-sm w-full"></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Suffix</label><input id="sf-suffix" type="text" value="${sanitize(g.suffix)}" class="border rounded-lg px-3 py-2 text-sm w-full" placeholder="Jr., Sr., III"></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Course *</label><select id="sf-course" class="border rounded-lg px-3 py-2 text-sm w-full">${['BSIT','BSCS','BSA','BSBA','BSEd','BSCE'].map(c=>`<option ${c===g.course?'selected':''}>${c}</option>`).join('')}</select></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Year Level *</label><select id="sf-year" class="border rounded-lg px-3 py-2 text-sm w-full">${['1st','2nd','3rd','4th'].map(y=>`<option ${y===g.year_level?'selected':''}>${y}</option>`).join('')}</select></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Section *</label><select id="sf-section" class="border rounded-lg px-3 py-2 text-sm w-full">${['A','B','C','D','E'].map(sc=>`<option ${sc===g.section?'selected':''}>${sc}</option>`).join('')}</select></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Gender *</label><select id="sf-gender" class="border rounded-lg px-3 py-2 text-sm w-full">${['Male','Female','Other'].map(x=>`<option ${x===g.gender?'selected':''}>${x}</option>`).join('')}</select></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Birthdate</label><input id="sf-bday" type="date" value="${g.birthdate}" class="border rounded-lg px-3 py-2 text-sm w-full"></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Email *</label><input id="sf-email" type="email" value="${sanitize(g.email)}" class="border rounded-lg px-3 py-2 text-sm w-full"></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Contact Number</label><input id="sf-contact" type="text" value="${sanitize(g.contact_number)}" class="border rounded-lg px-3 py-2 text-sm w-full" placeholder="09xxxxxxxxx"></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Status</label><select id="sf-status" class="border rounded-lg px-3 py-2 text-sm w-full">${['Active','Inactive'].map(x=>`<option ${x===g.status?'selected':''}>${x}</option>`).join('')}</select></div>
</div>
<div id="sf-error" class="error-msg hidden mt-2">Please fill in all required fields.</div>`}

function getFormStudent(){
const snum=document.getElementById('sf-snum').value.trim(),fname=document.getElementById('sf-fname').value.trim(),lname=document.getElementById('sf-lname').value.trim(),email=document.getElementById('sf-email').value.trim();
if(!snum||!fname||!lname||!email){document.getElementById('sf-error').classList.remove('hidden');return null}
return{student_number:snum,firstname:fname,middlename:document.getElementById('sf-mname').value.trim(),lastname:lname,suffix:document.getElementById('sf-suffix').value.trim(),course:document.getElementById('sf-course').value,year_level:document.getElementById('sf-year').value,section:document.getElementById('sf-section').value,gender:document.getElementById('sf-gender').value,birthdate:document.getElementById('sf-bday').value,email,contact_number:document.getElementById('sf-contact').value.trim(),status:document.getElementById('sf-status').value};
}

function openAddStudent(){
openModal(`<div class="flex items-center justify-between mb-4"><h3 class="font-bold">Add Student</h3><button onclick="closeModal()" class="text-gray-400 text-lg">&times;</button></div>
<form onsubmit="event.preventDefault();submitAddStudent()"><div class="space-y-3">${studentFormFields()}
<div class="flex gap-2 pt-2"><button type="submit" class="btn-primary flex-1">Save Student</button><button type="button" onclick="closeModal()" class="btn-secondary flex-1">Cancel</button></div>
</div></form>`)}

function submitAddStudent(){const data=getFormStudent();if(!data)return;data.id=nextStudentId++;students.push(data);addLog('Added student: '+data.firstname+' '+data.lastname,'create');closeModal();showToast('Student added');renderPage()}

function openEditStudent(id){const s=students.find(x=>x.id===id);if(!s)return;
openModal(`<div class="flex items-center justify-between mb-4"><h3 class="font-bold">Edit Student</h3><button onclick="closeModal()" class="text-gray-400 text-lg">&times;</button></div>
<form onsubmit="event.preventDefault();submitEditStudent(${id})"><div class="space-y-3">${studentFormFields(s)}
<div class="flex gap-2 pt-2"><button type="submit" class="btn-primary flex-1">Update Student</button><button type="button" onclick="closeModal()" class="btn-secondary flex-1">Cancel</button></div>
</div></form>`)}

function submitEditStudent(id){const data=getFormStudent();if(!data)return;const s=students.find(x=>x.id===id);if(!s)return;Object.assign(s,data);addLog('Updated student: '+data.firstname+' '+data.lastname,'edit');closeModal();showToast('Student updated');renderPage()}

function openViewStudent(id){const s=students.find(x=>x.id===id);if(!s)return;
const sr=requests.filter(r=>r.student===getFullName(s));
openModal(`<div class="flex items-center justify-between mb-4"><h3 class="font-bold">${sanitize(getFullName(s))}</h3><button onclick="closeModal()" class="text-gray-400 text-lg">&times;</button></div>
<div class="grid grid-cols-2 gap-3 text-sm mb-4">
<div><span class="text-gray-500 text-xs">Student No.</span><div class="font-medium">${sanitize(s.student_number)}</div></div>
<div><span class="text-gray-500 text-xs">Course & Year</span><div>${s.course} - ${s.year_level}</div></div>
<div><span class="text-gray-500 text-xs">Section</span><div>${s.section}</div></div>
<div><span class="text-gray-500 text-xs">Gender</span><div>${s.gender}</div></div>
<div><span class="text-gray-500 text-xs">Email</span><div>${sanitize(s.email)}</div></div>
<div><span class="text-gray-500 text-xs">Contact</span><div>${sanitize(s.contact_number)||'—'}</div></div>
<div><span class="text-gray-500 text-xs">Birthdate</span><div>${s.birthdate||'—'}</div></div>
<div><span class="text-gray-500 text-xs">Status</span><div>${badge(s.status==='Active'?'Approved':'Rejected')}</div></div>
</div>
<h4 class="font-semibold text-xs mb-2">Requests (${sr.length})</h4>
<table><thead><tr><th>ID</th><th>Document</th><th>Status</th></tr></thead><tbody>${sr.length?sr.map(r=>`<tr><td class="text-blue-600">${r.id}</td><td>${sanitize(r.doc)}</td><td>${badge(r.status)}</td></tr>`).join(''):'<tr><td colspan="3" class="text-center text-gray-400 py-3">No requests</td></tr>'}</tbody></table>
<div class="flex gap-2 mt-4"><button onclick="closeModal()" class="btn-secondary">Back</button></div>`)}

function confirmDeleteStudent(id){const s=students.find(x=>x.id===id);if(!s)return;
openModal(`<div class="flex items-center justify-between mb-4"><h3 class="font-bold text-red-600">Delete Student</h3><button onclick="closeModal()" class="text-gray-400 text-lg">&times;</button></div>
<p class="text-sm text-gray-600 mb-4">Are you sure you want to delete <strong>${sanitize(getFullName(s))}</strong> (${sanitize(s.student_number)})? This action cannot be undone.</p>
<div class="flex gap-2"><button onclick="deleteStudent(${id})" class="btn-danger flex-1">Yes, Delete</button><button onclick="closeModal()" class="btn-secondary flex-1">Cancel</button></div>`)}

function deleteStudent(id){students=students.filter(x=>x.id!==id);addLog('Deleted student ID '+id,'delete');closeModal();showToast('Student deleted','error');renderPage()}

// CSV Import
function openCSVImport(){
openModal(`<div class="flex items-center justify-between mb-4"><h3 class="font-bold">CSV Import Students</h3><button onclick="closeModal()" class="text-gray-400 text-lg">&times;</button></div>
<div class="space-y-4">
<div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800"><i class="fas fa-info-circle mr-1"></i> Upload a CSV file with columns: student_number, firstname, middlename, lastname, suffix, course, year_level, section, gender, birthdate, email, contact_number. You can import per section or per batch.</div>
<div><label class="text-xs font-medium text-gray-600 block mb-1">Target Section (optional grouping)</label><select id="csv-section" class="border rounded-lg px-3 py-2 text-sm w-full"><option value="">— Auto-detect from CSV —</option>${['A','B','C','D','E'].map(s=>`<option value="${s}">Section ${s}</option>`).join('')}</select></div>
<div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition" onclick="simulateCSVImport()">
<i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
<p class="text-sm text-gray-500">Click to select CSV file or drag and drop</p>
<p class="text-xs text-gray-400 mt-1">Demo: Click to import sample students</p>
</div>
<div id="csv-preview" class="hidden"></div>
<div class="flex gap-2"><button id="csv-confirm-btn" onclick="confirmCSVImport()" class="btn-primary hidden"><i class="fas fa-check mr-1"></i>Confirm Import</button><button onclick="closeModal()" class="btn-secondary">Cancel</button></div>
</div>`)}

let csvPendingRows=[];
function simulateCSVImport(){
const section=document.getElementById('csv-section').value;
csvPendingRows=[
{student_number:'2024-0010',firstname:'Carlo',middlename:'',lastname:'Mendoza',suffix:'',course:'BSIT',year_level:'2nd',section:section||'A',gender:'Male',birthdate:'2004-06-20',email:'carlo@univ.edu.ph',contact_number:'09221234567',status:'Active'},
{student_number:'2024-0011',firstname:'Rica',middlename:'Lim',lastname:'Gonzales',suffix:'',course:'BSIT',year_level:'2nd',section:section||'A',gender:'Female',birthdate:'2004-02-14',email:'rica@univ.edu.ph',contact_number:'09231234567',status:'Active'},
{student_number:'2024-0012',firstname:'Mark',middlename:'',lastname:'Villanueva',suffix:'Jr.',course:'BSCS',year_level:'3rd',section:section||'B',gender:'Male',birthdate:'2003-11-30',email:'mark@univ.edu.ph',contact_number:'09241234567',status:'Active'}
];
document.getElementById('csv-preview').classList.remove('hidden');
document.getElementById('csv-preview').innerHTML=`<div class="text-xs font-medium text-gray-700 mb-2">Preview (${csvPendingRows.length} rows):</div><div class="overflow-x-auto max-h-40 overflow-y-auto border rounded-lg"><table><thead><tr><th>Student No.</th><th>Name</th><th>Course</th><th>Section</th></tr></thead><tbody>${csvPendingRows.map(r=>`<tr><td>${r.student_number}</td><td>${r.firstname} ${r.lastname}</td><td>${r.course}</td><td>${r.section}</td></tr>`).join('')}</tbody></table></div>`;
document.getElementById('csv-confirm-btn').classList.remove('hidden');
}

function confirmCSVImport(){
csvPendingRows.forEach(r=>{r.id=nextStudentId++;students.push(r)});
addLog('Imported '+csvPendingRows.length+' students via CSV','create');
csvPendingRows=[];
closeModal();showToast(students.length+' students total after import');renderPage();
}

// ===== PAYMENTS PAGE =====
function paymentsPage(){const filtered=currentRole==='student'?payments.filter(p=>p.student==='Maria Santos'):payments;
return `<div class="bg-white rounded-xl p-5 shadow-sm"><div class="flex items-center justify-between mb-4"><h3 class="font-semibold text-sm">Payments</h3></div><div class="overflow-x-auto"><table><thead><tr><th>ID</th><th>Request</th>${currentRole==='admin'?'<th>Student</th>':''}<th>Amount</th><th>Reference</th><th>Status</th>${currentRole==='admin'?'<th>Action</th>':''}</tr></thead><tbody>${filtered.map(p=>`<tr><td>${p.id}</td><td class="text-blue-600 cursor-pointer" onclick="showRequestDetail('${p.request}')">${p.request}</td>${currentRole==='admin'?`<td>${sanitize(p.student)}</td>`:''}<td>₱${p.amount}</td><td>${sanitize(p.ref)||'—'}</td><td>${badge(p.status)}</td>${currentRole==='admin'?`<td>${p.status==='Pending Verification'?`<button onclick="verifyPayment('${p.id}')" class="text-green-600 text-xs font-medium"><i class="fas fa-check-circle"></i> Verify</button>`:''}</td>`:''}</tr>`).join('')}</tbody></table></div></div>`}

function schedulesPage(){const filtered=currentRole==='student'?schedules.filter(s=>s.student==='Maria Santos'):schedules;
return `<div class="bg-white rounded-xl p-5 shadow-sm"><div class="flex items-center justify-between mb-4"><h3 class="font-semibold text-sm">Pickup Schedules</h3>${currentRole==='admin'?`<button onclick="openAssignSchedule()" class="btn-primary"><i class="fas fa-plus mr-1"></i>Assign</button>`:''}</div><table><thead><tr><th>Request</th>${currentRole==='admin'?'<th>Student</th>':''}<th>Document</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody>${filtered.length?filtered.map(s=>`<tr><td class="text-blue-600 cursor-pointer" onclick="showRequestDetail('${s.request}')">${s.request}</td>${currentRole==='admin'?`<td>${sanitize(s.student)}</td>`:''}<td>${sanitize(s.doc)}</td><td>${s.date}</td><td>${s.time}</td><td>${badge(s.status)}</td></tr>`).join(''):'<tr><td colspan="6" class="empty-state">No schedules yet</td></tr>'}</tbody></table></div>`}

function docTypesPage(){return `<div class="bg-white rounded-xl p-5 shadow-sm"><div class="flex items-center justify-between mb-4"><h3 class="font-semibold text-sm">Document Types</h3>${currentRole==='admin'?`<button onclick="openAddDocType()" class="btn-primary"><i class="fas fa-plus mr-1"></i>Add</button>`:''}</div><table><thead><tr><th>Document</th><th>Fee</th><th>Processing</th><th>Requirements</th></tr></thead><tbody>${docTypes.map(d=>`<tr><td class="font-medium">${sanitize(d.name)}</td><td>₱${d.fee}</td><td>${d.days} days</td><td class="text-gray-500 text-xs">${sanitize(d.reqs)}</td></tr>`).join('')}</tbody></table></div>`}

function notificationsPage(){return `<div class="bg-white rounded-xl p-5 shadow-sm"><div class="flex items-center justify-between mb-4"><h3 class="font-semibold text-sm">Notifications <span class="text-gray-400 font-normal">(${notifications.filter(n=>!n.read).length} unread)</span></h3><button onclick="markAllRead()" class="text-blue-600 text-xs font-medium hover:underline">Mark all read</button></div><div class="space-y-2">${notifications.map(n=>`<div class="flex items-start gap-3 p-3 rounded-lg border ${n.read?'border-gray-100 bg-white':'border-blue-200 bg-blue-50'} cursor-pointer" onclick="toggleNotifRead(${n.id})"><div class="w-7 h-7 rounded-full ${n.read?'bg-gray-100':'bg-blue-100'} flex items-center justify-center flex-shrink-0"><i class="fas fa-bell text-[11px] ${n.read?'text-gray-400':'text-blue-600'}"></i></div><div class="flex-1"><div class="text-xs">${sanitize(n.msg)}</div><div class="text-[11px] text-gray-400 mt-0.5">${n.time}</div></div>${!n.read?'<span class="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>':''}</div>`).join('')}</div></div>`}

function reportsPage(){const st=getStats();return `<div class="bg-white rounded-xl p-5 shadow-sm"><h3 class="font-semibold text-sm mb-4">Reports Summary</h3><div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4"><div class="stat-card border text-center"><div class="text-lg font-bold">${st.total}</div><div class="text-xs text-gray-500">Total</div></div><div class="stat-card border text-center"><div class="text-lg font-bold text-green-600">${st.completed}</div><div class="text-xs text-gray-500">Completed</div></div><div class="stat-card border text-center"><div class="text-lg font-bold text-emerald-600">₱${st.revenue.toLocaleString()}</div><div class="text-xs text-gray-500">Revenue</div></div><div class="stat-card border text-center"><div class="text-lg font-bold text-red-500">${st.rejected+st.cancelled}</div><div class="text-xs text-gray-500">Rejected/Cancelled</div></div></div><div class="flex gap-2"><button onclick="exportCSV()" class="btn-success"><i class="fas fa-file-csv mr-1"></i>Export CSV</button></div></div>`}

// ===== ACTIONS =====
function approveRequest(id){const r=requests.find(x=>x.id===id);if(!r||r.status!=='Pending')return;r.status='Approved';r.history.push({s:'Approved',t:now(),by:'Admin'});addLog('Approved request '+id,'approve');addNotif('Request '+id+' approved');showToast('Request '+id+' approved');renderPage()}
function cancelRequest(id){const r=requests.find(x=>x.id===id);if(!r||r.status!=='Pending')return;r.status='Cancelled';r.history.push({s:'Cancelled',t:now(),by:'Admin'});addLog('Cancelled request '+id,'cancel');addNotif('Request '+id+' cancelled');showToast('Request '+id+' cancelled','error');renderPage()}
function processRequest(id){const r=requests.find(x=>x.id===id);if(!r||r.status!=='Approved'||!r.paid)return;r.status='Processing';r.history.push({s:'Processing',t:now(),by:'Admin'});addLog('Processing '+id,'process');addNotif('Request '+id+' is now processing');showToast('Processing '+id,'info');renderPage()}
function readyRequest(id){const r=requests.find(x=>x.id===id);if(!r||r.status!=='Processing')return;r.status='Ready for Pickup';r.history.push({s:'Ready for Pickup',t:now(),by:'Admin'});addLog('Marked '+id+' ready','ready');addNotif('Request '+id+' ready for pickup');showToast(id+' ready');renderPage()}
function releaseRequest(id){const r=requests.find(x=>x.id===id);if(!r||r.status!=='Ready for Pickup')return;r.status='Released';r.history.push({s:'Released',t:now(),by:'Admin'});const sched=schedules.find(s=>s.request===id);if(sched)sched.status='Released';addLog('Released '+id,'release');addNotif(id+' released to '+r.student);showToast(id+' released');renderPage()}
function verifyPayment(id){const p=payments.find(x=>x.id===id);if(!p||p.status==='Verified')return;p.status='Verified';p.date=now().slice(0,10);const r=requests.find(x=>x.id===p.request);if(r){r.paid=true;r.history.push({s:'Payment Verified',t:now(),by:'Admin'})}addLog('Verified payment '+id,'verify');addNotif('Payment verified for '+p.request);showToast('Payment verified');renderPage()}
function markAllRead(){notifications.forEach(n=>n.read=true);updateNotifBadge();renderPage()}
function toggleNotifRead(id){const n=notifications.find(x=>x.id===id);if(n){n.read=!n.read;updateNotifBadge();renderPage()}}

// ===== MODALS =====
function showRequestDetail(id){
const r=requests.find(x=>x.id===id);if(!r)return;
const p=getPaymentForReq(id);const sched=schedules.find(x=>x.request===id);const locked=isLocked(r);
openModal(`<div class="flex items-center justify-between mb-4"><h3 class="font-bold text-base">${r.id}</h3><button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-lg">&times;</button></div>
${locked?'<div class="bg-gray-100 text-gray-600 text-xs p-2 rounded mb-3"><i class="fas fa-lock"></i> Read-only</div>':''}
<div class="grid grid-cols-2 gap-3 text-sm mb-4">
<div><span class="text-gray-500 text-xs">Student</span><div class="font-medium">${sanitize(r.student)}</div></div>
<div><span class="text-gray-500 text-xs">Document</span><div class="font-medium">${sanitize(r.doc)}</div></div>
<div><span class="text-gray-500 text-xs">Date</span><div>${r.date}</div></div>
<div><span class="text-gray-500 text-xs">Status</span><div>${badge(r.status)}</div></div>
<div><span class="text-gray-500 text-xs">Fee</span><div>₱${r.fee}</div></div>
<div><span class="text-gray-500 text-xs">Payment</span><div>${badge(p?p.status:'Payment Pending')}</div></div>
${sched?`<div class="col-span-2"><span class="text-gray-500 text-xs">Pickup</span><div>${sched.date} at ${sched.time}</div></div>`:''}</div>
<h4 class="font-semibold text-xs uppercase text-gray-500 mt-4 mb-2">Timeline</h4>
<div class="space-y-2 text-xs border-l-2 border-gray-200 pl-3 ml-1">${r.history.map(h=>`<div class="relative"><div class="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white"></div><div class="font-medium">${h.s}</div><div class="text-gray-400">${h.t} · ${sanitize(h.by)}</div></div>`).join('')}</div>
${!locked&&currentRole==='admin'?`<div class="flex flex-wrap gap-2 border-t pt-3 mt-3">
${r.status==='Pending'?`<button onclick="closeModal();approveRequest('${r.id}')" class="btn-success">Approve</button><button onclick="closeModal();cancelRequest('${r.id}')" class="btn-danger">Cancel Request</button>`:''}
${r.status==='Approved'&&r.paid?`<button onclick="closeModal();processRequest('${r.id}')" class="btn-primary">Process</button>`:''}
${r.status==='Processing'?`<button onclick="closeModal();readyRequest('${r.id}')" class="btn-teal">Mark Ready</button>`:''}
${r.status==='Ready for Pickup'?`<button onclick="closeModal();releaseRequest('${r.id}')" class="btn-primary">Release</button>`:''}
<button onclick="closeModal()" class="btn-secondary">Back</button>
</div>`:`<div class="flex gap-2 mt-4"><button onclick="closeModal()" class="btn-secondary">Back</button></div>`}`)}

function openNewRequest(){
openModal(`<div class="flex items-center justify-between mb-4"><h3 class="font-bold">New Document Request</h3><button onclick="closeModal()" class="text-gray-400 text-lg">&times;</button></div>
<form id="new-req-form" onsubmit="event.preventDefault();submitRequest()"><div class="space-y-3">
${currentRole==='admin'?`<div><label class="text-xs font-medium text-gray-600 block mb-1" for="nr-student">Student</label><select id="nr-student" class="border rounded-lg px-3 py-2 text-sm w-full">${students.filter(s=>s.status==='Active').map(s=>`<option value="${sanitize(getFullName(s))}">${sanitize(getFullName(s))}</option>`).join('')}</select></div>`:`<input type="hidden" id="nr-student" value="Maria Santos">`}
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="nr-doc">Document Type</label><select id="nr-doc" class="border rounded-lg px-3 py-2 text-sm w-full" onchange="updateFeePreview()">${docTypes.map(d=>`<option value="${d.id}">${sanitize(d.name)}</option>`).join('')}</select></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="nr-purpose">Purpose</label><input id="nr-purpose" type="text" class="border rounded-lg px-3 py-2 text-sm w-full" placeholder="e.g., Employment" maxlength="100"><div id="nr-purpose-err" class="error-msg hidden">Required</div></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="nr-copies">Copies</label><input id="nr-copies" type="number" value="1" min="1" max="10" class="border rounded-lg px-3 py-2 text-sm w-full" oninput="updateFeePreview()"></div>
<div id="fee-preview" class="bg-blue-50 p-3 rounded-lg text-xs text-blue-800"><strong>Fee:</strong> ₱${docTypes[0].fee}</div>
<div class="flex gap-2"><button type="submit" class="btn-primary flex-1">Submit Request</button><button type="button" onclick="closeModal()" class="btn-secondary flex-1">Cancel</button></div>
</div></form>`)}

function updateFeePreview(){const docId=parseInt(document.getElementById('nr-doc').value);const copies=Math.max(1,Math.min(10,parseInt(document.getElementById('nr-copies').value)||1));const d=docTypes.find(x=>x.id===docId);if(d)document.getElementById('fee-preview').innerHTML=`<strong>Fee:</strong> ₱${d.fee*copies} (${copies} × ₱${d.fee}) · <strong>Processing:</strong> ${d.days} days`}

function submitRequest(){
const purposeEl=document.getElementById('nr-purpose');const purpose=purposeEl.value.trim();
if(!purpose){purposeEl.classList.add('field-error');document.getElementById('nr-purpose-err').classList.remove('hidden');return}
const studentVal=document.getElementById('nr-student').value;const docId=parseInt(document.getElementById('nr-doc').value);const copies=Math.max(1,parseInt(document.getElementById('nr-copies').value)||1);const d=docTypes.find(x=>x.id===docId);
const id=`REQ-2026-${String(nextReqNum++).padStart(3,'0')}`;const fee=d.fee*copies;
requests.unshift({id,student:studentVal,doc:d.name,date:new Date().toISOString().slice(0,10),status:'Pending',fee,paid:false,history:[{s:'Created',t:now(),by:studentVal}]});
payments.push({id:`PAY-${String(nextPayNum++).padStart(3,'0')}`,request:id,student:studentVal,amount:fee,ref:'',date:'',status:'Payment Pending'});
addLog('Created '+id,'create',studentVal);addNotif('New request '+id+' submitted');
closeModal();showToast(id+' submitted!');renderPage()}

function openUploadReceipt(reqId){const r=requests.find(x=>x.id===reqId);if(!r)return;
openModal(`<div class="flex items-center justify-between mb-4"><h3 class="font-bold">Upload Payment</h3><button onclick="closeModal()" class="text-gray-400 text-lg">&times;</button></div>
<form onsubmit="event.preventDefault();submitReceipt('${reqId}')"><div class="space-y-3">
<div class="bg-gray-50 p-3 rounded-lg text-xs"><strong>${reqId}</strong> · ₱${r.fee}</div>
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="rc-ref">Reference Number</label><input id="rc-ref" type="text" class="border rounded-lg px-3 py-2 text-sm w-full" placeholder="e.g., GCash-12345"><div id="rc-ref-err" class="error-msg hidden">Required</div></div>
<div class="flex gap-2"><button type="submit" class="btn-primary flex-1">Submit Payment</button><button type="button" onclick="closeModal()" class="btn-secondary flex-1">Cancel</button></div>
</div></form>`)}

function submitReceipt(reqId){const refEl=document.getElementById('rc-ref');const ref=refEl.value.trim();if(!ref){refEl.classList.add('field-error');document.getElementById('rc-ref-err').classList.remove('hidden');return}
const p=payments.find(x=>x.request===reqId);if(p){p.ref=ref;p.status='Pending Verification';p.date=new Date().toISOString().slice(0,10)}
const r=requests.find(x=>x.id===reqId);if(r)r.history.push({s:'Payment Submitted',t:now(),by:r.student});
addLog('Payment submitted for '+reqId,'payment',r?r.student:'Student');addNotif('Payment uploaded for '+reqId);
closeModal();showToast('Payment submitted');renderPage()}

function openAssignSchedule(){
const eligible=requests.filter(r=>r.status==='Ready for Pickup'&&!schedules.find(s=>s.request===r.id));
if(!eligible.length){showToast('No eligible requests','info');return}
openModal(`<div class="flex items-center justify-between mb-4"><h3 class="font-bold">Assign Schedule</h3><button onclick="closeModal()" class="text-gray-400 text-lg">&times;</button></div>
<form onsubmit="event.preventDefault();submitSchedule()"><div class="space-y-3">
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="sc-req">Request</label><select id="sc-req" class="border rounded-lg px-3 py-2 text-sm w-full">${eligible.map(r=>`<option value="${r.id}">${r.id} — ${sanitize(r.student)}</option>`).join('')}</select></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="sc-date">Date</label><input id="sc-date" type="date" class="border rounded-lg px-3 py-2 text-sm w-full"><div id="sc-date-err" class="error-msg hidden">Required</div></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="sc-time">Time</label><select id="sc-time" class="border rounded-lg px-3 py-2 text-sm w-full"><option>9:00 AM</option><option>10:00 AM</option><option>11:00 AM</option><option>1:00 PM</option><option>2:00 PM</option><option>3:00 PM</option></select></div>
<div class="flex gap-2"><button type="submit" class="btn-primary flex-1">Assign</button><button type="button" onclick="closeModal()" class="btn-secondary flex-1">Cancel</button></div>
</div></form>`)}

function submitSchedule(){const reqId=document.getElementById('sc-req').value;const date=document.getElementById('sc-date').value;const time=document.getElementById('sc-time').value;
if(!date){document.getElementById('sc-date-err').classList.remove('hidden');return}
const r=requests.find(x=>x.id===reqId);
schedules.push({request:reqId,student:r.student,doc:r.doc,date,time,status:r.status});
r.history.push({s:'Pickup Scheduled: '+date+' '+time,t:now(),by:'Admin'});
addLog('Scheduled '+reqId,'schedule');addNotif('Pickup scheduled for '+reqId);
closeModal();showToast('Schedule assigned');renderPage()}

function openAddDocType(){openModal(`<div class="flex items-center justify-between mb-4"><h3 class="font-bold">Add Document Type</h3><button onclick="closeModal()" class="text-gray-400 text-lg">&times;</button></div>
<form onsubmit="event.preventDefault();submitDocType()"><div class="space-y-3">
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="dt-name">Name</label><input id="dt-name" type="text" class="border rounded-lg px-3 py-2 text-sm w-full" maxlength="60"><div id="dt-name-err" class="error-msg hidden">Required</div></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="dt-fee">Fee (₱)</label><input id="dt-fee" type="number" class="border rounded-lg px-3 py-2 text-sm w-full" min="0"></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="dt-days">Days</label><input id="dt-days" type="number" class="border rounded-lg px-3 py-2 text-sm w-full" min="1"></div>
<div><label class="text-xs font-medium text-gray-600 block mb-1" for="dt-reqs">Requirements</label><input id="dt-reqs" type="text" class="border rounded-lg px-3 py-2 text-sm w-full"></div>
<div class="flex gap-2"><button type="submit" class="btn-primary flex-1">Add</button><button type="button" onclick="closeModal()" class="btn-secondary flex-1">Cancel</button></div>
</div></form>`)}
function submitDocType(){const nameEl=document.getElementById('dt-name');const name=nameEl.value.trim();if(!name){nameEl.classList.add('field-error');document.getElementById('dt-name-err').classList.remove('hidden');return}
docTypes.push({id:docTypes.length+1,name,fee:Math.max(0,parseInt(document.getElementById('dt-fee').value)||0),days:Math.max(1,parseInt(document.getElementById('dt-days').value)||1),reqs:document.getElementById('dt-reqs').value.trim()||'None'});
addLog('Added doc type: '+name,'create');closeModal();showToast('Added');renderPage()}

function exportCSV(){let csv='ID,Student,Document,Date,Status,Fee,Paid\n';requests.forEach(r=>csv+=`"${r.id}","${r.student}","${r.doc}","${r.date}","${r.status}",${r.fee},${r.paid}\n`);const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='drrts_requests.csv';a.click();showToast('Exported')}

// ===== CHARTS =====
let chart1,chart2;
function initCharts(){
const ctx1=document.getElementById('chartRequests');const ctx2=document.getElementById('chartRevenue');
if(!ctx1||!ctx2)return;
if(chart1)chart1.destroy();if(chart2)chart2.destroy();
const st=getStats();
chart1=new Chart(ctx1,{type:'doughnut',data:{labels:['Pending','Approved','Processing','Ready','Done','Rejected','Cancelled'],datasets:[{data:[st.pending,st.approved,st.processing,st.ready,st.completed,st.rejected,st.cancelled],backgroundColor:['#f59e0b','#10b981','#3b82f6','#14b8a6','#6366f1','#ef4444','#f97316']}]},options:{responsive:true,plugins:{legend:{position:'bottom',labels:{font:{size:11}}}}}});
const revByDoc={};payments.filter(p=>p.status==='Verified').forEach(p=>{const r=requests.find(x=>x.id===p.request);if(r){revByDoc[r.doc]=(revByDoc[r.doc]||0)+p.amount}});
chart2=new Chart(ctx2,{type:'bar',data:{labels:Object.keys(revByDoc),datasets:[{label:'₱',data:Object.values(revByDoc),backgroundColor:'#0B5ED7',borderRadius:6}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
}
