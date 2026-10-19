/* Argon Demo — all sample data is synthetic.
   Offline HTML saves locally; the optional same-origin backend syncs demo findings and subscriptions. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const initials = s => (s || 'JL').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
  const iconPaths = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    patch:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8M12 8v8"/>',
    code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"/>',
    config:'<path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="11" cy="17" r="2" fill="currentColor"/>',
    security:'<path d="M3 13c4-6 7-6 10-3s5 3 8-1M3 19c4-6 7-6 10-3s5 3 8-1"/><circle cx="6" cy="6" r="2"/>',
    iam:'<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M10 8h4m-4 4h4m-4 4h4"/>',
    folder:'<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-8 8-8s8 3 8 8"/>',
    search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    edit:'<path d="m4 19 4-.8 11-11a2 2 0 0 0-3-3l-11 11z"/><path d="m14 6 4 4"/>',
    columns:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m6-16v16"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    save:'<path d="M4 3h14l3 3v15H3V3z"/><rect x="7" y="3" width="9" height="6"/><path d="M7 21v-8h10v8"/>',
    file:'<path d="M13 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11z"/><path d="M13 3v8h8"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    back:'<path d="m15 18-6-6 6-6"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 17v4h16v-4"/>',
    check:'<path d="m4 12 5 5L20 6"/>',
    x:'<path d="M5 5l14 14M19 5 5 19"/>',
    download:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',
    shield:'<path d="M12 2 4 6v6c0 6 3 9 8 10 5-1 8-4 8-10V6z"/><path d="m9 12 2 2 4-4"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    paperclip:'<path d="m21 11-9 9a6 6 0 0 1-8-8L14 2a4 4 0 0 1 6 6L9 19a2 2 0 0 1-3-3l9-9"/>',
    external:'<path d="M14 3h7v7m0-7-10 10"/><path d="M20 14v6H4V4h6"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>'
  };
  const ic = (name, size=14) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.info}</svg>`;

  // All identifiers, findings, descriptions, paths and dates below are fictional.
  // This app is an offline training mock-up; nothing is fetched from a backend.
  const appFixtures = [
    {app:'LAB-A',code:'DEMO-APP-001',name:'Aster Sample Portal',resource:'demo-aster-ui-service'},
    {app:'LAB-B',code:'DEMO-APP-002',name:'Cobalt Message Queue',resource:'demo-cobalt-worker'},
    {app:'LAB-C',code:'DEMO-APP-003',name:'Orion Notes Playground',resource:'demo-orion-notes-api'},
    {app:'LAB-D',code:'DEMO-APP-004',name:'Nova Sample Catalog',resource:'demo-nova-catalog-api'},
    {app:'LAB-E',code:'DEMO-APP-005',name:'Pixel Reports Sandbox',resource:'demo-pixel-reports-batch'}
  ];
  const sampleFindings = [
    ['Example missing object-owner check in a sample API','Improper Access Control (CWE-284)',7.6],
    ['Demo search endpoint accepts unsanitized test input','Input Validation (CWE-20)',8.1],
    ['Placeholder configuration contains a training-only secret','Hardcoded Credentials (CWE-798)',8.8],
    ['Mock TLS client skips certificate checks','Certificate Validation (CWE-295)',7.4],
    ['Example expression parser needs input validation','Expression Language Injection (CWE-917)',9.9],
    ['Sample session handler fails an authorization check','Improper Authentication (CWE-287)',9.8],
    ['Synthetic settings file has a sample key string','Use of Hard-coded Key (CWE-321)',8.2],
    ['Demo shared state leaks across mock request contexts','Improper Isolation (CWE-653)',8.2],
    ['Example SQL builder uses string concatenation','SQL Injection (CWE-89)',9.0],
    ['Training-only URL input permits internal mock redirects','Server-Side Request Forgery (CWE-918)',8.5],
    ['Mock user role is loaded from an untrusted form value','Improper Authorization (CWE-285)',8.8],
    ['Example document listing omits a permission filter','Missing Authorization (CWE-862)',7.5],
    ['Placeholder login flow does not invalidate stale tokens','Improper Authentication (CWE-287)',8.0],
    ['Sample application emits excess diagnostic information','Information Exposure (CWE-200)',6.5],
    ['Demo file-import routine requires path normalization','Path Traversal (CWE-22)',8.6],
    ['Example multi-user notes view lacks mock tenant scope','Improper Access Control (CWE-284)',9.1]
  ];
  const simpleUuid = i => {
    const h = (('00000000'+(i*2971+2837).toString(16)).slice(-8) + '7e31' + '4a29' + '8b40' + ('000000000000'+(i*1121+97231).toString(16)).slice(-12));
    return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
  };
  const baseRows = Array.from({length:234}, (_,i) => {
    const app=appFixtures[i%appFixtures.length];
    const finding=sampleFindings[i%sampleFindings.length];
    const score = i<sampleFindings.length?finding[2]:Number((6.4+(i%36)/10).toFixed(1));
    const status=i%9===0?'In Progress':i%23===0?'Resolved':'Not Started';
    return {
      id:`FND-${String(i+1).padStart(5,'0')}`,uuid:simpleUuid(i+1),priority:i%21===0&&i>10?'P2':'P3',
      risk:score>=9?'CRITICAL':score<7?'MEDIUM':'HIGH',
      app:app.app,application:app.code,name:finding[0],resource:app.resource,score,cve:'N/A',
      category:finding[1],business:i%3===0?'Training Lab':'Demo Engineering',
      status,closed:status==='Resolved'?'Closed':'Open',locked:i>10&&i%29===0,
      exposure:'Internal',reviewed:'No',severity:'No',comment:'',planned:'2026-12-15',actual:'',
      age:5+i%28,attachments:[]
    };
  });
  let edits={};try{edits=JSON.parse(localStorage.getItem('argon-v1-local-edits')||'{}')}catch(e){}
  const rows=baseRows.map(r=>({...r,...(edits[r.id]||{})}));
  const columns=[
    {id:'priority',label:'PRIORITY',width:52},
    {id:'risk',label:'RISK RATING',width:56},
    {id:'app',label:'DEMO APP GROUP',width:49},
    {id:'application',label:'DEMO APP CODE',width:89},
    {id:'name',label:'VULNERABILITY NAME',width:174},
    {id:'resource',label:'DEMO RESOURCE',width:118},
    {id:'score',label:'CVSS 3.1 SCORE',width:62},
    {id:'cve',label:'CVE',width:50},
    {id:'category',label:'CATEGORY',width:217},
    {id:'business',label:'BUSINESS UNIT',width:76},
    {id:'status',label:'STATUS',width:91},
    {id:'closed',label:'CLOSED/OPEN',width:82}
  ];
  const navigation=[
    ['Home','home'],['Patch Findings','patch'],['Code Findings','code'],['Config Findings','config'],['Argon Findings','shield'],['Identity Reviews','iam'],['Cases','folder'],['Recommended Cases','shield','faint'],['Closed Exceptions','lock','faint'],['Campaigns','grid','faint'],['Supply Chain','shield','faint'],['My Profile','user']
  ];
  const state={nav:'Argon Findings',view:'list',selectedId:null,sidebarCollapsed:false,filterText:'',filterApp:'All Apps',draftText:'',draftApp:'All Apps',page:1,pageSize:100,sort:'',sortAsc:true,selected:new Set(),showClosed:false,showLocked:false,columnPreset:'Custom',visibleCols:new Set(columns.map(c=>c.id)),filtersOpen:false,filterRisk:'Any risk',filterStatus:'Any status',modal:null,toast:'',attachment:[],showAlert:false};
  const apiEnabled = location.protocol === 'http:' || location.protocol === 'https:';
  let backendReady = false;
  let serverStats = null;
  let toastTimer;
  function notify(message){state.toast=message;renderToast();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{state.toast='';renderToast()},3300)}
  function persist(row){if(apiEnabled)fetch(`/api/findings/${encodeURIComponent(row.id)}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:row.status,comment:row.comment,exposure:row.exposure,reviewed:row.reviewed,severity:row.severity,planned:row.planned,actual:row.actual})}).catch(()=>notify('Server unavailable; changes saved in browser only.'));edits[row.id]={...(edits[row.id]||{}),status:row.status,closed:row.closed,exposure:row.exposure,reviewed:row.reviewed,severity:row.severity,comment:row.comment,planned:row.planned,actual:row.actual,attachments:row.attachments};try{localStorage.setItem('argon-v1-local-edits',JSON.stringify(edits))}catch(e){}}
  function navSide(){return `<aside class="sidebar ${state.sidebarCollapsed?'collapsed':''}">
    <div class="brand"><div class="brand-mark"></div><div class="brand-text">ARGON<br><small>LABS</small></div></div>
    <button class="side-collapse" data-action="collapse">${state.sidebarCollapsed?ic('chevron',11):ic('back',11)}</button>
    <div class="section-title">Overview</div>
    <nav class="side-nav">${navigation.map(([label,name,extra],i)=>`${i===6?'<div class="section-title" style="padding-left:13px">Workflows</div>':''}${i===11?'<div class="section-title" style="padding-left:13px">Account</div>':''}<button class="side-link ${state.nav===label?'active':''} ${extra?'sidebar-faint':''}" data-nav="${escape(label)}" title="${escape(label)}"><div class="nav-icon">${ic(name,16)}</div><span>${escape(label)}</span></button>`).join('')}</nav>
    <div class="side-bottom"><div class="avatar">AM</div><div class="identity"><strong>Alex Morgan (Demo)</strong><small>Training Account<br>Offline Demo</small></div></div></aside>`}
  function topBar(){return `<header class="topbar"><div class="breadcrumbs"><strong>Argon Workspace</strong><span class="sep">›</span>${state.view==='detail'?'<a href="#findings" data-action="go-list">Argon Findings</a><span class="sep">›</span>Finding Detail':escape(state.nav)}</div><div class="topbar-right"><span class="small-note">${backendReady?'API CONNECTED · SYNTHETIC':'FICTIONAL DEMO'}</span><button class="topbar-bell" data-action="alerts" aria-label="Notifications">${ic('bell',18)}</button><div class="top-avatar">AM</div></div></header>`}
  const btn = (txt, action, variant='btn-sm', ico='')=>`<button class="btn ${variant}" data-action="${action}">${ico?ic(ico,12):''}${txt}</button>`;
  function filterContent(){return `<div class="dropdown right" id="filters-popup"><h4>Column Filters</h4><label>Risk rating</label><select id="riskFilter" class="select" style="height:32px;margin-bottom:14px"><option ${state.filterRisk==='Any risk'?'selected':''}>Any risk</option><option ${state.filterRisk==='HIGH'?'selected':''}>HIGH</option><option ${state.filterRisk==='MEDIUM'?'selected':''}>MEDIUM</option><option ${state.filterRisk==='CRITICAL'?'selected':''}>CRITICAL</option></select><label>Status</label><select id="statusFilter" class="select" style="height:32px;margin-bottom:14px"><option ${state.filterStatus==='Any status'?'selected':''}>Any status</option><option ${state.filterStatus==='Not Started'?'selected':''}>Not Started</option><option ${state.filterStatus==='In Progress'?'selected':''}>In Progress</option><option ${state.filterStatus==='Resolved'?'selected':''}>Resolved</option></select><div class="dropdown-actions"><button data-action="reset-filters" class="btn btn-sm">Reset</button><button data-action="apply-filters" class="btn btn-primary btn-sm">Apply</button></div></div>`}
  function filteredRows(){let list=rows.filter(r=>(state.showClosed||r.closed==='Open')&&(state.showLocked||!r.locked));if(state.filterText){let q=state.filterText.toLowerCase();list=list.filter(r=>[r.id,r.uuid,r.app,r.application,r.name,r.resource,r.category,r.cve].some(v=>String(v).toLowerCase().includes(q)))}if(state.filterApp!=='All Apps')list=list.filter(r=>r.app===state.filterApp);if(state.filterRisk!=='Any risk')list=list.filter(r=>r.risk===state.filterRisk);if(state.filterStatus!=='Any status')list=list.filter(r=>r.status===state.filterStatus);if(state.sort){list.sort((a,b)=>{let av=a[state.sort],bv=b[state.sort];let delta=typeof av==='number' ? av-bv:String(av).localeCompare(String(bv));return state.sortAsc?delta:-delta})}return list}
  function pageInfo(list){let total=Math.max(1,Math.ceil(list.length/state.pageSize));if(state.page>total)state.page=total;return {total,paged:list.slice((state.page-1)*state.pageSize,state.page*state.pageSize)}}
  function tableCell(r,id){let v=r[id];if(id==='risk')return `<span class="${v==='CRITICAL'?'risk-critical':'risk-high'}">${escape(v)}</span>`;if(id==='category')return `<span class="cat-tag ${r.score>=9?'indigo':r.score<=7.5?'gray':''}" title="${escape(v)}">${escape(v)}</span>`;if(id==='status')return `<span class="status ${v==='In Progress'?'progress':v==='Resolved'?'fixed':''}"><span class="status-dot"></span>${escape(v)}</span>`;if(id==='cve')return escape(v==='[]'?'[]':v);if(id==='score')return Number(v).toFixed(1);return `<span title="${escape(v)}">${escape(v||'—')}</span>`}
  function listView(){let list=filteredRows();const {total,paged}=pageInfo(list), apps=['All Apps',...new Set(rows.map(r=>r.app))];let pageTxt=`Page ${state.page} of ${total} · ${list.length} total findings`;
    return `<h1 class="page-title">Argon Findings</h1><p class="page-subtitle">Illustrative security findings across invented demo apps. Filter, sort, and turn any row into a tracked remediation case.</p>
    <div class="argon-subscribe-banner"><span><strong>Argon Digest</strong> · Get a daily or weekly summary of synthetic vulnerability findings.</span><button class="argon-subscribe-btn" data-action="subscribe">✉ Subscribe to findings</button></div><div class="panel search-panel"><div class="search-row"><div class="search-box">${ic('search',14)}<input id="keyword" type="search" placeholder="Search UUID / App Code / CVE..." value="${escape(state.draftText)}" autocomplete="off" aria-label="Search findings" /></div><select class="field-select" id="appFilter">${apps.map(a=>`<option ${state.draftApp===a?'selected':''}>${a}</option>`).join('')}</select>${btn('Apply','apply-search','btn-primary btn-sm')}${btn('Clear','clear-search','btn-sm')}</div></div>
    <div class="toolbar"><div class="toolbar-group"><span class="small-note">${ic('columns',11)} Col:</span><div class="chips"><button class="chip ${state.columnPreset==='Default'?'selected':''}" data-action="default-columns">Default (10)</button><button class="chip ${state.columnPreset==='Custom'?'selected':''}" data-action="custom-columns">Custom (12)⌄</button><button class="chip ${state.columnPreset==='All'?'selected':''}" data-action="all-columns">All (12)</button></div><span class="pill-count">${state.visibleCols.size}/12</span></div><div class="toolbar-group"><div class="dropdown-wrap">${btn('Column Filters','toggle-filters','btn-sm','filter')}${state.filtersOpen?filterContent():''}</div>${btn('Edit','edit-selected','btn-sm','edit')}${btn('Bulk Update','bulk-update','btn-sm','columns')}${btn(state.showClosed?'Hide Closed':'Show Closed','toggle-closed','btn-sm', 'eye')}${btn(state.showLocked?'Hide Locked':'Show Locked','toggle-locked','btn-sm','lock')}${btn('Email Digest','subscribe','btn-sm','bell')}</div></div>
    <div class="pagination-top">${btn('‹ Prev','prev','btn-sm')}${btn('Next ›','next','btn-sm')}<span>${pageTxt}</span></div>
    <section class="panel table-panel"><div class="table-scroll"><table class="findings-table"><colgroup><col style="width:36px"/>${columns.filter(c=>state.visibleCols.has(c.id)).map(c=>`<col style="width:${c.width}px"/>`).join('')}</colgroup><thead><tr><th><input id="checkAll" type="checkbox" aria-label="Select all visible rows" ${paged.length>0 && paged.every(r=>state.selected.has(r.id))?'checked':''}></th>${columns.filter(c=>state.visibleCols.has(c.id)).map(c=>`<th class="sortable" data-sort="${c.id}">${escape(c.label)}<span class="sort-marker">${state.sort===c.id?(state.sortAsc?'▲':'▼'):'↕'}</span></th>`).join('')}</tr></thead><tbody>${paged.map(r=>`<tr data-row-id="${r.id}" class="${state.selected.has(r.id)?'selected-row':''}"><td><input type="checkbox" class="row-check" value="${r.id}" ${state.selected.has(r.id)?'checked':''} aria-label="Select ${r.id}" /></td>${columns.filter(c=>state.visibleCols.has(c.id)).map(c=>`<td>${tableCell(r,c.id)}</td>`).join('')}</tr>`).join('')}</tbody></table>${!paged.length?'<div class="empty-state"><h3>No findings found</h3>Try changing the search or column filters.</div>':''}</div><div class="table-bottom"><span>Showing ${paged.length?((state.page-1)*state.pageSize+1):0}–${Math.min(state.page*state.pageSize,list.length)} of ${list.length} findings</span><div class="pagination-top">${btn('‹','prev','btn-sm')}${state.page} / ${total}${btn('›','next','btn-sm')}<select class="field-select" id="pageSize" style="height:30px;min-width:92px;margin-left:8px"><option value="25" ${state.pageSize===25?'selected':''}>25 / page</option><option value="50" ${state.pageSize===50?'selected':''}>50 / page</option><option value="100" ${state.pageSize===100?'selected':''}>100 / page</option></select></div></div></section><p class="demo-banner">100% synthetic sample data · Synthetic data · Email subscriptions require the optional local backend.</p>`
  }
  const detailItems=(r)=>[
    ['UUID',r.uuid],['Demo Application',appFixtures.find(a=>a.app===r.app)?.name||'Demo App'],['Demo App Code',r.application],['Closed/Open',r.closed],['Vulnerability Name',r.name],['Demo Resource Name',r.resource],['Resource Version','v1.0-demo'],['Resource Type','finding'],['CVSS 3.1 Score',r.score.toFixed(1)],['CVSS 3.1 Vector','CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:L'],['CVE',r.cve],['CWEs',r.category.match(/CWE-\d+/)?.[0]||'—'],['Priority 2','—'],['Risk Rating 2','—'],['Category',r.category],['Exploitability',`Attacker with a valid account may exploit the described behavior in ${r.resource}.`],['Novel','yes'],['Confidence','9.0'],['Scan Status','—'],['Business Unit',r.business||'—'],['OSS','—'],['Attack Surface','authenticated'],['Preconditions','Attacker holds an authenticated session with the application’s standard user role.'],['SLA Breached','No'],['SLA Breached Days','—'],['Aging (Days)',r.age],['Scan Date','2026-09-01 09:00:00'],['File Name / Taxonomy','application security scanning'],['Created At','2026-09-01 09:00:00'],['Last Updated','2026-10-01 10:00:00'],['Original Signal Time','2026-09-01 09:00:00'],['Source File',r.sourcePath||'—'],['Code Line',r.lineRange?(r.sourcePath||'')+':'+r.lineRange:'—'],['Repository',r.repositoryUrl||'—'],['Base Branch',r.baseBranch||'—'],['Base Commit',r.baseCommit||'—'],['Rule ID',r.ruleId||'—'],['Scan Run',r.scanRunId||'—'],['Work Item',r.workItemId||'—'],['Triage Result',r.triageResult||'—'],['PR URL',r.prUrl||'—'],['Verification',r.verificationResult||'—'],['Target Status','Open'],['Target Severity','high'],['Target Technology','java'],['Owner / Assignment',r.ownerId||'Application security team'],['Latest Scan Status','Passed / reviewed'],['Original Confidence','High'],['Remediation Recommendation','Implement authorization and ownership validation, add regression tests, and review affected endpoints.']
  ];
  function detailView(){const r=rows.find(x=>x.id===state.selectedId)||rows[0];return `<button class="back-link" data-action="go-list">${ic('back',14)} Back to Argon Findings</button><div class="detail-header"><div><h1 class="page-title">Argon Finding Detail</h1><p class="page-subtitle">View and update remediation status for a sample finding.</p></div><span class="chip" style="background:#fff">${escape(r.id)}</span></div>
  <div class="panel detail-metrics"><div><div class="metric-label">Priority</div><div class="metric-value">${escape(r.priority)}</div></div><div><div class="metric-label">Risk Rating</div><div class="metric-value">${escape(r.risk)}</div></div><div><div class="metric-label">Aging (Days)</div><div class="metric-value">${r.age}</div></div></div>
  <div class="detail-columns"><section class="panel details-card"><h2 class="card-head">${ic('shield',17)} Finding Information</h2>${detailItems(r).slice(0,21).map(([key,value])=>`<div class="detail-row"><div class="key">${escape(key)}</div><div class="value">${escape(value)}</div></div>`).join('')}<h3 class="subsection">Code Line</h3><div class="prose">${escape(r.sourcePath?(r.sourcePath+':'+(r.lineRange||'—')):'unmapped — no verified code location for this demo finding')}</div><h3 class="subsection">Impact</h3><div class="prose">${escape(r.name)}. An authenticated actor may be able to perform an action that falls outside their intended scope. The issue should be verified and remediated by the application owner.</div><h3 class="subsection">Description</h3><div class="prose">The security analysis detected a potentially exploitable weakness in the specified application resource. Under certain conditions, user-controlled values may cross an authorization or validation boundary. This can lead to unexpected access to restricted information or application functions.\n\nThe finding should be confirmed by testing the affected execution path and by reviewing the authorization and input validation implemented around the impacted operation.\n\nThis text is illustrative demo content, not an actual security assessment.</div><h3 class="subsection">Mitigation</h3><div class="prose">Validate that the current principal is authorized to access each referenced object before processing it. Apply centralized access-control checks, minimize privileges, and add automated regression tests. Evaluate any other endpoints that use the same patterns.</div><h3 class="subsection">Recommendation</h3><div class="prose">Prioritize remediation according to the assessed risk, the reachability of the affected code path, and the application’s exposure. Track the fix, its validation evidence, and the targeted closure date.</div><h3 class="subsection">Additional Attributes</h3>${detailItems(r).slice(21).map(([key,value])=>`<div class="detail-row"><div class="key">${escape(key)}</div><div class="value">${escape(value)}</div></div>`).join('')}</section>
  <section class="panel response-card"><h2 class="card-head">${ic('edit',17)} App Owner Response</h2><div class="form-field"><label for="responseStatus">Status ${ic('info',12)}</label><select class="select" id="responseStatus">${['Not Started','In Progress','Resolved','Risk Accepted','False Positive'].map(v=>`<option ${r.status===v?'selected':''}>${v}</option>`).join('')}</select><p id="statusHelp" class="hint">${r.status==='In Progress'?'The application team is evaluating and/or designing and implementing a fix.':'Select the current remediation state of the finding.'}</p></div>
  <div class="form-field"><label for="responseExposure">Exposure *</label><select id="responseExposure" class="select">${['Internal','External','Both','Unknown'].map(v=>`<option ${r.exposure===v?'selected':''}>${v}</option>`).join('')}</select></div>
  <div class="form-field"><label for="responseReviewed">Reviewed</label><select id="responseReviewed" class="select"><option ${r.reviewed==='No'?'selected':''}>No</option><option ${r.reviewed==='Yes'?'selected':''}>Yes</option></select></div>
  <div class="form-field"><label for="responseSeverity">Agree on Severity</label><select id="responseSeverity" class="select"><option ${r.severity==='No'?'selected':''}>No</option><option ${r.severity==='Yes'?'selected':''}>Yes</option><option ${r.severity==='Needs Review'?'selected':''}>Needs Review</option></select></div>
  <div class="form-field"><label for="responseComment">Comments / Evidence</label><textarea class="textarea" id="responseComment" placeholder="Add comments or supporting evidence...">${escape(r.comment)}</textarea></div>
  <div class="form-field"><label>${ic('paperclip',14)} Attachments</label><div class="upload-box"><div>Attach evidence files (screenshots, docs, logs, images).<br><span id="file-names">${r.attachments.length?escape(r.attachments.join(', ')):'Maximum 25 MB per file · local demo only'}</span></div><label class="btn btn-primary btn-sm" for="attachFile" style="color:white;white-space:nowrap;margin:0">${ic('upload',12)} Upload</label><input id="attachFile" type="file" multiple accept="image/*,.txt,.log,.csv,.doc,.docx,.pdf" /></div></div>
  <div class="form-two"><div class="form-field"><label for="plannedDate">Planned Remediation Date</label><input class="input" id="plannedDate" type="date" value="${escape(r.planned)}" /></div><div class="form-field"><label for="actualDate">Actual Closure Date</label><input class="input" id="actualDate" type="date" value="${escape(r.actual)}" /></div></div>
  <div class="form-footer">${btn('Save','save-detail','btn-primary','save')}${btn('Cancel','go-list')}${btn('Create Case','create-case','btn','file')}</div></section></div><p class="demo-banner">Demo · Form saves are local; they also sync when the optional backend is running.</p>`}
  function computeStats(){
    if(serverStats) return serverStats;
    const byStatus={},byRisk={};
    for(const r of rows){byStatus[r.status]=(byStatus[r.status]||0)+1;byRisk[r.risk]=(byRisk[r.risk]||0)+1;}
    const resolved=byStatus['Resolved']||0;
    return {total:rows.length,open:rows.length-resolved,inProgress:byStatus['In Progress']||0,resolved:resolved,critical:byRisk['CRITICAL']||0,high:byRisk['HIGH']||0,medium:byRisk['MEDIUM']||0,byStatus:byStatus,byRisk:byRisk};
  }
  function overviewView(){let st=computeStats();let statuses=['Not Started','In Progress','Resolved'];let max=Math.max(1,...statuses.map(s=>st.byStatus[s]||0));return `<h1 class="page-title">Sandbox Overview</h1><p class="page-subtitle">Security findings and remediation activity across your application portfolio.</p><div class="summary-grid"><div class="panel summary-card"><div class="label">Total Findings</div><div class="number">${st.total}</div><div class="meta">Demo scans</div></div><div class="panel summary-card"><div class="label">Open Findings</div><div class="number">${st.open}</div><div class="meta">In application scope</div></div><div class="panel summary-card"><div class="label">In Progress</div><div class="number">${st.inProgress}</div><div class="meta">AI Brain / owner underway</div></div><div class="panel summary-card"><div class="label">Critical Risk</div><div class="number">${st.critical}</div><div class="meta">Requires attention</div></div></div><div class="dashboard-grid"><div class="panel dashboard-card"><h2 class="card-head">Findings by status</h2>${statuses.map(s=>{let n=st.byStatus[s]||0;return `<div class="bar-row"><span class="bar-label">${s}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/max*100)}%"></div></div><span class="bar-num">${n}</span></div>`}).join('')}<button class="btn btn-primary" data-action="go-list">View Argon Findings ${ic('chevron',12)}</button></div><div class="panel dashboard-card"><h2 class="card-head">Recent Activity</h2>${rows.slice(0,5).map(r=>`<div class="activity"><div class="activity-bubble"></div><div><strong>${escape(r.application)} · ${escape(r.category)}</strong><span>${escape(r.status)} · ${escape(r.id)}</span></div></div>`).join('')}</div></div>`}
  function placeholderView(){return `<div class="panel placeholder-view">${ic('folder',45)}<h2>${escape(state.nav)}</h2><p>This module is represented by a demo placeholder.<br>The Argon Findings list and its remediation detail workflow are interactive.</p><button class="btn btn-primary" data-action="go-list">Open Argon Findings ${ic('chevron',14)}</button></div>`}
  function modalContent(){if(!state.modal)return '';const close=`<button class="modal-close" data-action="close-modal" aria-label="Close">×</button>`;
    if(state.modal==='columns')return `<div class="modal-layer" data-action="dismiss-modal"><div class="modal"><div class="modal-top"><h2 class="modal-title">Customize Table Columns</h2>${close}</div><div class="modal-content"><p style="margin-top:0;color:#718198;font-size:12px">Choose the fields shown in the findings table.</p><div class="check-grid">${columns.map(c=>`<label><input class="column-check" value="${c.id}" type="checkbox" ${state.visibleCols.has(c.id)?'checked':''}>${escape(c.label.replace(/\bCVSS 3.1\b/,'CVSS'))}</label>`).join('')}</div></div><div class="modal-footer">${btn('Cancel','close-modal')}${btn('Apply Columns','apply-columns','btn-primary')}</div></div></div>`;
    if(state.modal==='bulk')return `<div class="modal-layer" data-action="dismiss-modal"><div class="modal"><div class="modal-top"><h2 class="modal-title">Bulk Update Findings</h2>${close}</div><div class="modal-content"><p class="page-subtitle">Update ${state.selected.size} selected finding(s).</p><div class="form-field"><label for="bulkStatus">Remediation status</label><select class="select" id="bulkStatus">${['Not Started','In Progress','Resolved','Risk Accepted','False Positive'].map(s=>`<option>${s}</option>`).join('')}</select></div><div class="form-field"><label for="bulkComment">Optional comment</label><textarea class="textarea" id="bulkComment" placeholder="Comment for selected findings..."></textarea></div></div><div class="modal-footer">${btn('Cancel','close-modal')}${btn('Save Changes','apply-bulk','btn-primary','save')}</div></div></div>`;
    if(state.modal==='case')return `<div class="modal-layer" data-action="dismiss-modal"><div class="modal"><div class="modal-top"><h2 class="modal-title">Create Remediation Case</h2>${close}</div><div class="modal-content"><p class="page-subtitle">Create a local mock case linked to ${escape(state.selectedId||'selected finding')}.</p><div class="form-field"><label for="caseTitle">Case Title</label><input class="input" id="caseTitle" value="Remediate ${escape(state.selectedId||'selected vulnerabilities')}" /></div><div class="form-field"><label for="caseOwner">Assigned Team</label><select class="select" id="caseOwner"><option>Application Owner</option><option>Application Security</option><option>Engineering</option></select></div><div class="form-field"><label for="casePriority">Priority</label><select class="select" id="casePriority"><option>High</option><option>Critical</option><option>Medium</option></select></div><div class="form-field"><label for="caseDescription">Description</label><textarea class="textarea" id="caseDescription">Review and remediate the associated security finding.</textarea></div></div><div class="modal-footer">${btn('Cancel','close-modal')}${btn('Create Case','submit-case','btn-primary','file')}</div></div></div>`;
    if(state.modal==='subscribe')return `<div class="modal-layer" data-action="dismiss-modal"><div class="modal"><div class="modal-top"><h2 class="modal-title">✉ Argon · Email Digest Subscription</h2>${close}</div><div class="modal-content"><p class="page-subtitle">Choose which synthetic findings to receive in a digest. Confirmation is required before any subscription becomes active.</p><div class="argon-form-grid"><div class="form-field"><label for="subEmail">Email address *</label><input class="input" id="subEmail" type="email" maxlength="254" autocomplete="email" placeholder="demo@example.com" required /></div><div class="form-field"><label for="subFrequency">Delivery frequency</label><select class="select" id="subFrequency"><option value="DAILY">Daily (08:00 UTC)</option><option value="WEEKLY">Weekly (Monday)</option></select></div><div class="form-field"><label for="subRisk">Minimum risk rating</label><select class="select" id="subRisk"><option value="HIGH">High and Critical</option><option value="CRITICAL">Critical only</option><option value="MEDIUM">Medium and above</option></select></div><div class="form-field"><label for="subApp">Application scope</label><select class="select" id="subApp"><option value="">All demo applications</option>${appFixtures.map(a=>`<option value="${escape(a.code)}">${escape(a.name)}</option>`).join('')}</select></div></div><p class="argon-form-note">🔒 Synthetic content only. The standalone HTML does not send emails. With the Spring Boot backend running, requests stay on the same origin and messages are saved to a local outbox by default (SMTP disabled).</p></div><div class="modal-footer">${btn('Cancel','close-modal')}${btn('Create Subscription','submit-subscription','btn-primary','bell')}</div></div></div>`;
    if(state.modal==='subscription-confirm')return `<div class="modal-layer"><div class="modal"><div class="modal-top"><h2 class="modal-title">Confirm your Argon subscription</h2>${close}</div><div class="modal-content"><p class="page-subtitle">Activate this synthetic-data digest subscription?</p></div><div class="modal-footer">${btn('Cancel','close-modal')}${btn('Confirm subscription','confirm-subscription','btn-primary')}</div></div></div>`;
    if(state.modal==='subscription-unsubscribe')return `<div class="modal-layer"><div class="modal"><div class="modal-top"><h2 class="modal-title">Unsubscribe from Argon</h2>${close}</div><div class="modal-content"><p class="page-subtitle">Stop receiving this synthetic-data digest?</p></div><div class="modal-footer">${btn('Cancel','close-modal')}${btn('Unsubscribe','unsubscribe','btn-primary')}</div></div></div>`;
    if(state.modal==='alerts')return `<div class="modal-layer" data-action="dismiss-modal"><div class="modal"><div class="modal-top"><h2 class="modal-title">Notifications</h2>${close}</div><div class="modal-content"><p style="color:#718198">No new notifications in the local demo.</p></div><div class="modal-footer">${btn('Close','close-modal')}</div></div></div>`;return '';
  }
  function render(){ $('#app').innerHTML=`<div class="app-shell">${navSide()}<div class="workspace">${topBar()}<main class="main">${state.nav==='Home'?overviewView():state.nav==='Argon Findings'?(state.view==='detail'?detailView():listView()):placeholderView()}</main></div></div>${modalContent()}<div class="demo-ribbon">SYNTHETIC DATA · TRAINING ONLY</div><div id="toast-container"></div>`;renderToast()}
  function renderToast(){const container=$('#toast-container');if(container)container.innerHTML=state.toast?`<div class="toast">${ic('check',20)}<span>${escape(state.toast)}</span></div>`:''}
  function goList(){state.nav='Argon Findings';state.view='list';state.selectedId=null;state.modal=null;history.replaceState(null,'','#findings');render();window.scrollTo({top:0,behavior:'instant'})}
  function goDetail(id){state.nav='Argon Findings';state.view='detail';state.selectedId=id;state.modal=null;history.pushState(null,'',`#finding-${id}`);render();window.scrollTo({top:0,behavior:'instant'})}
  function collectDetail(){let r=rows.find(r=>r.id===state.selectedId);if(!r)return null;r.status=$('#responseStatus').value;r.exposure=$('#responseExposure').value;r.reviewed=$('#responseReviewed').value;r.severity=$('#responseSeverity').value;r.comment=$('#responseComment').value;r.planned=$('#plannedDate').value;r.actual=$('#actualDate').value;r.attachments=[...new Set([...(r.attachments||[]),...state.attachment])];if(r.status==='Resolved')r.closed='Closed';else if(r.closed==='Closed'&&r.status!=='Resolved')r.closed='Open';persist(r);state.attachment=[];return r}
  function handleAction(action,target){switch(action){
    case'collapse':state.sidebarCollapsed=!state.sidebarCollapsed;render();break;
    case'go-list':goList();break;
    case'alerts':state.modal='alerts';render();break;
    case'subscribe':state.modal='subscribe';render();break;
    case'submit-subscription':{
      const email=($('#subEmail')?.value||'').trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){notify('Enter a valid email address.');break}
      if(!apiEnabled){notify('Start the Spring Boot backend to subscribe; offline HTML is read-only.');break}
      const body={email,frequency:$('#subFrequency').value,minRisk:$('#subRisk').value,appCode:$('#subApp').value};
      fetch('/api/subscriptions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
        .then(async res=>{if(!res.ok)throw Error((await res.json().catch(()=>({}))).message||`HTTP ${res.status}`);state.modal=null;render();notify('Subscription requested. Check the configured email or local outbox to confirm.');})
        .catch(err=>notify('Subscription failed: '+err.message));
      break}
    case'confirm-subscription': case'unsubscribe':{
      const token=state.subscriptionToken;const endpoint=action==='confirm-subscription'?'confirm':'unsubscribe';
      if(!token){notify('Missing token.');break}
      fetch(`/api/subscriptions/${endpoint}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token})})
        .then(async res=>{if(!res.ok)throw Error((await res.json().catch(()=>({}))).message||`HTTP ${res.status}`);history.replaceState(null,'',location.pathname);state.modal=null;state.subscriptionToken=null;render();notify(endpoint==='confirm'?'Subscription confirmed.':'Subscription cancelled.');})
        .catch(err=>notify('Unable to update subscription: '+err.message));
      break}

    case'apply-search':state.filterText=($('#keyword')?.value||'').trim();state.filterApp=$('#appFilter')?.value||'All Apps';state.draftText=state.filterText;state.draftApp=state.filterApp;state.page=1;render();break;
    case'clear-search':state.filterText=state.draftText='';state.filterApp=state.draftApp='All Apps';state.filterRisk='Any risk';state.filterStatus='Any status';state.page=1;render();break;
    case'prev':if(state.page>1){state.page--;render()}break;
    case'next':if(state.page<Math.ceil(filteredRows().length/state.pageSize)){state.page++;render()}break;
    case'toggle-filters':state.filtersOpen=!state.filtersOpen;render();break;
    case'apply-filters':state.filterRisk=$('#riskFilter')?.value||'Any risk';state.filterStatus=$('#statusFilter')?.value||'Any status';state.page=1;state.filtersOpen=false;render();break;
    case'reset-filters':state.filterRisk='Any risk';state.filterStatus='Any status';state.page=1;state.filtersOpen=false;render();break;
    case'toggle-closed':state.showClosed=!state.showClosed;state.page=1;render();break;
    case'toggle-locked':state.showLocked=!state.showLocked;state.page=1;render();break;
    case'default-columns':state.columnPreset='Default';state.visibleCols=new Set(columns.filter(c=>!['business','cve'].includes(c.id)).map(c=>c.id));render();break;
    case'custom-columns':state.modal='columns';render();break;
    case'all-columns':state.columnPreset='All';state.visibleCols=new Set(columns.map(c=>c.id));render();break;
    case'apply-columns':{const cs=$$('.column-check:checked').map(n=>n.value);if(!cs.length){notify('Select at least one column.');break}state.visibleCols=new Set(cs);state.columnPreset='Custom';state.modal=null;render();notify('Column preferences applied.');break}
    case'edit-selected':if(state.selected.size===1){goDetail([...state.selected][0])}else if(state.selected.size>1){state.modal='bulk';render()}else notify('Select a finding row to edit.');break;
    case'bulk-update':if(!state.selected.size){notify('Select one or more findings to update.');break}state.modal='bulk';render();break;
    case'apply-bulk':{let s=$('#bulkStatus').value,comment=$('#bulkComment').value.trim();for(let id of state.selected){let r=rows.find(r=>r.id===id);if(r){r.status=s;r.closed=s==='Resolved'?'Closed':'Open';if(comment)r.comment=[r.comment,comment].filter(Boolean).join('\n');persist(r)}}let n=state.selected.size;state.selected.clear();state.modal=null;render();notify(`Updated ${n} finding(s) successfully.`);break}
    case'save-detail':{const r=collectDetail();render();notify(`Response for ${r.id} saved locally.`);break}
    case'create-case':collectDetail();state.modal='case';render();break;
    case'submit-case':{const name=$('#caseTitle').value.trim();if(!name){notify('Please enter a case title.');return}let cs=[];try{cs=JSON.parse(localStorage.getItem('argon-v1-local-cases')||'[]')}catch(e){}const newCase={id:'CASE-'+String(Date.now()).slice(-6),name,owner:$('#caseOwner').value,priority:$('#casePriority').value,description:$('#caseDescription').value,findingId:state.selectedId,created:new Date().toISOString()};cs.push(newCase);if(apiEnabled)fetch('/api/cases',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:name,owner:newCase.owner,priority:newCase.priority,description:newCase.description,findingId:newCase.findingId})}).catch(()=>notify('Case saved in browser; server unavailable.'));try{localStorage.setItem('argon-v1-local-cases',JSON.stringify(cs))}catch(e){}state.modal=null;render();notify('Mock remediation case created locally.');break}
    case'close-modal':state.modal=null;render();break;
    case'dismiss-modal':if(target.classList.contains('modal-layer')){state.modal=null;render()}break;
    default:break;
  }}
  $('#app').addEventListener('click',ev=>{
    const target=ev.target.closest('[data-action]');if(target){ev.preventDefault();handleAction(target.dataset.action,target);return}
    const nav=ev.target.closest('[data-nav]');if(nav){state.nav=nav.dataset.nav;state.view='list';state.selected.clear();state.filtersOpen=false;history.replaceState(null,'',state.nav==='Argon Findings'?'#findings':'#'+encodeURIComponent(state.nav.toLowerCase()));render();window.scrollTo({top:0,behavior:'instant'});return}
    const sort=ev.target.closest('[data-sort]');if(sort){if(state.sort===sort.dataset.sort)state.sortAsc=!state.sortAsc;else{state.sort=sort.dataset.sort;state.sortAsc=true}state.page=1;render();return}
    const row=ev.target.closest('tr[data-row-id]');if(row&&!ev.target.closest('.row-check'))goDetail(row.dataset.rowId);
  });
  $('#app').addEventListener('change',ev=>{
    if(ev.target.id==='checkAll'){const {paged}=pageInfo(filteredRows());for(let r of paged){if(ev.target.checked)state.selected.add(r.id);else state.selected.delete(r.id)}render();return}
    if(ev.target.classList.contains('row-check')){if(ev.target.checked)state.selected.add(ev.target.value);else state.selected.delete(ev.target.value);render();return}
    if(ev.target.id==='pageSize'){state.pageSize=Number(ev.target.value);state.page=1;render();return}
    if(ev.target.id==='appFilter'){state.draftApp=ev.target.value;return}
    if(ev.target.id==='responseStatus'){let x=$('#statusHelp');if(x)x.textContent=ev.target.value==='In Progress'?'The application team is evaluating and/or designing and implementing a fix.':ev.target.value==='Resolved'?'The vulnerability has been fixed and validated.':'Select the current remediation state of the finding.';return}
    if(ev.target.id==='attachFile'){let files=[...ev.target.files];let oversized=files.filter(f=>f.size>25*1024*1024);state.attachment=files.filter(f=>f.size<=25*1024*1024).map(f=>f.name);$('#file-names').textContent=state.attachment.length?state.attachment.join(', '):'No eligible files chosen';if(oversized.length)notify('Files larger than 25 MB are not allowed.');return}
  });
  $('#app').addEventListener('input',ev=>{if(ev.target.id==='keyword')state.draftText=ev.target.value});
  $('#app').addEventListener('keydown',ev=>{if(ev.target.id==='keyword'&&ev.key==='Enter'){ev.preventDefault();handleAction('apply-search',ev.target)}if(ev.key==='Escape'&&state.modal){state.modal=null;render()}});
  window.addEventListener('popstate',()=>{let hash=decodeURIComponent(location.hash);let found=hash.match(/^#finding-(FND-\d+)$/);if(found&&rows.some(r=>r.id===found[1])){state.nav='Argon Findings';state.view='detail';state.selectedId=found[1]}else{state.nav='Argon Findings';state.view='list';state.selectedId=null}render()});
  const found=location.hash.match(/^#finding-(FND-\d+)$/);if(found&&rows.some(r=>r.id===found[1])){state.selectedId=found[1];state.view='detail'}
  // Read-only context bridge for the offline AI demo widget. Exposes synthetic records only.
  window.ArgonDemo = Object.freeze({
    getContext(){
      const visible = filteredRows();
      const selected = state.view === 'detail' ? rows.find(r => r.id === state.selectedId) : null;
      const safeRecord = r => r ? ({
        id:r.id, app:r.app, application:r.application, resource:r.resource,
        name:r.name, score:r.score, risk:r.risk, category:r.category,
        status:r.status, exposure:r.exposure, reviewed:r.reviewed,
        planned:r.planned, comment:r.comment
      }) : null;
      return {
        view:state.view, nav:state.nav, finding:safeRecord(selected),
        filter:state.filterText, applicationFilter:state.filterApp,
        totals:{all:rows.length, visible:visible.length,
          critical:visible.filter(r=>r.risk==='CRITICAL').length,
          high:visible.filter(r=>r.risk==='HIGH').length,
          inProgress:visible.filter(r=>r.status==='In Progress').length,
          notStarted:visible.filter(r=>r.status==='Not Started').length,
          resolved:visible.filter(r=>r.status==='Resolved').length},
        samples:visible.slice(0,8).map(safeRecord)
      };
    },
    insertDraft(text){
      if(state.view!=='detail')return false;
      const field=$('#responseComment');
      if(!field)return false;
      field.value=field.value.trim()?field.value.trim()+'\n\n'+text:text;
      field.focus();
      notify('AI sample draft inserted. Review and click Save to keep it.');
      return true;
    }
  });
  // In backend mode the server acts as the source of truth; file:// remains fully offline.
  if(apiEnabled){
    fetch('/api/findings').then(r=>r.ok?r.json():Promise.reject(Error('unavailable'))).then(serverRows=>{
      if(!Array.isArray(serverRows)||!serverRows.length)return;
      backendReady=true;
      rows.splice(0,rows.length,...serverRows.map(r=>({...r,attachments:[]})));
      render();
    fetch('/api/findings/stats').then(r=>r.ok?r.json():Promise.reject(Error('unavailable'))).then(s=>{serverStats=s;if(state.nav==='Home')render();}).catch(()=>{});
    }).catch(()=>{});
    const params=new URLSearchParams(location.hash.replace(/^#/,''));
    if(params.has('confirm')||params.has('unsubscribe')){
      state.subscriptionToken=params.get('confirm')||params.get('unsubscribe');
      state.modal=params.has('confirm')?'subscription-confirm':'subscription-unsubscribe';
    }
  }
  render();
})();
