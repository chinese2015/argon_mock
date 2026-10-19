/* Fictional AI assistant UX — deterministic, offline sample responses.
   No LLM service, telemetry, fetch, persistence or external API calls. */
(() => {
  'use strict';
  const bridge = window.ArgonDemo;
  if (!bridge) return;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const icon = (name, size=20) => {
    const paths = {
      spark:'<path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"/><path d="m19 17 .6 2.4L22 20l-2.4.6L19 23l-.6-2.4L16 20l2.4-.6z"/>',
      chat:'<path d="M21 11.6a8.6 8.6 0 0 1-8.6 8.6c-1.4 0-2.9-.4-4.1-1L3 21l1.8-5.2a8.6 8.6 0 1 1 16.2-4.2Z"/>',
      close:'<path d="M5 5l14 14M19 5 5 19"/>',
      send:'<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>',
      refresh:'<path d="M3 11a9 9 0 0 1 15.6-5.7L21 8M21 3v5h-5M21 13a9 9 0 0 1-15.6 5.7L3 16m0 5v-5h5"/>',
      shield:'<path d="m12 2 8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
      arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
      pen:'<path d="m4 20 4-.8L20 7a2 2 0 0 0-3-3L5 16z"/>',
      check:'<path d="m4 12 5 5L20 6"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
  };
  const root = document.createElement('div');
  root.id = 'ai-assistant-root';
  document.body.append(root);

  let isOpen = false;
  let opening = false;
  let draft = '';
  let hasSeenWelcome = false;
  const history = [];
  const nowTime = () => new Date().toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit'});
  const ctx = () => bridge.getContext();
  const detail = c => c.view==='detail' && c.finding;
  const makeMessage = (role, text, options={}) => ({role,text,at:nowTime(),...options});
  const welcome = () => {
    const c=ctx();
    return detail(c) ?
      `I'm your AI Enhance assistant for this **fictional security finding**. I can explain ${c.finding.id}, suggest a remediation plan, or draft an owner response. Everything here stays in your browser.` :
      `Hi! I'm **AI Enhance**. I can summarize the sample findings, surface priorities, and suggest next steps. This is an offline demo using **synthetic data**.`;
  };
  const actionsFor = c => detail(c) ? [
    ['summarize','Summarize finding'],
    ['remediate','Suggest remediation'],
    ['explain','Explain risk'],
    ['draft','Draft owner response']
  ] : [
    ['summarize','Summarize findings'],
    ['prioritize','Prioritize backlog'],
    ['remediate','Remediation playbook'],
    ['explain','Explain risk scores']
  ];
  function buildReply(kind, c) {
    const r=detail(c)?c.finding:null;
    if(kind==='summarize' && r) return {text:
      `**${r.id} · Finding brief**\n\n${r.name}\n\n**Application:** ${r.application} · ${r.app}\n**Resource:** ${r.resource}\n**Risk:** ${r.risk} (CVSS ${Number(r.score).toFixed(1)})\n**Category:** ${r.category}\n**Current status:** ${r.status}\n\n**Suggested next step:** Confirm affected entry points and ownership, then create a regression test before fixing the synthetic example.`};
    if(kind==='summarize') return {text:
      `**Portfolio snapshot · ${c.totals.visible} visible sample findings**\n\n• ${c.totals.critical} Critical · ${c.totals.high} High\n• ${c.totals.inProgress} In progress · ${c.totals.notStarted} Not started · ${c.totals.resolved} Resolved\n${c.filter?`• Active keyword: “${c.filter}”\n`:''}\n**Suggested next step:** Triage the highest scoring unresolved examples first, then confirm exploitability and asset importance. These counts reflect the current demo filters.`};
    if(kind==='prioritize') {
      const top=[...c.samples].filter(x=>x.status!=='Resolved').sort((a,b)=>b.score-a.score).slice(0,4);
      return {text:top.length ? `**Suggested triage order (visible demo rows)**\n\n${top.map((x,i)=>`${i+1}. **${x.id}** · CVSS ${Number(x.score).toFixed(1)} · ${x.name}\n   ${x.application} · ${x.status}`).join('\n')}\n\nOrder is based on CVSS alone for this demo. In production, include exploitability, exposure, business impact, controls, and known exploitation.` : 'No open sample findings are visible in the current view. Try clearing the filters.'};
    }
    if(kind==='remediate' && r) return {text:
      `**Remediation plan · ${r.id}**\n\n1. **Validate:** Reproduce the sample scenario in an isolated test environment.\n2. **Contain:** Review exposed endpoints and enforce least privilege or input constraints as relevant to ${r.category}.\n3. **Fix:** Update the affected code or configuration; add an automated negative-path test.\n4. **Verify:** Run targeted security regression tests and rescan.\n5. **Document:** Record the fix owner, evidence, and target date in the response form.\n\nThis is a generic starting point, not a verified root-cause assessment.`};
    if(kind==='remediate') return {text:
      `**Example remediation workflow**\n\n1. Categorize sample findings by risk, owner, and component.\n2. Create work items for the highest-impact unresolved issues.\n3. Suggest a patch or configuration change and peer-review it.\n4. Add automated regression tests and rescan.\n5. Update remediation status and attach sanitized evidence.\n\nUse the detail-page action to get a context-specific recommendation.`};
    if(kind==='explain' && r) return {text:
      `**Risk explanation · ${r.id}**\n\nThe sample finding is rated **${r.risk}**, with a synthetic CVSS v3.1 base score of **${Number(r.score).toFixed(1)} / 10**.\n\n**What to investigate:** Whether ${r.category} is genuinely reachable; who can trigger it; and which data or operations could be affected.\n\nCVSS captures technical severity, not your organization's full business risk. Exposure, compensating controls, and exploit evidence may change priority.`};
    if(kind==='explain') return {text:
      `**CVSS quick guide**\n\n• **Critical:** 9.0–10.0\n• **High:** 7.0–8.9\n• **Medium:** 4.0–6.9\n• **Low:** 0.1–3.9\n\nA score measures characteristics of a vulnerability, but does not by itself establish exploitability in a specific environment. Combine it with exposure, asset value, and available evidence.`};
    if(kind==='draft' && r){
      const draftText=`Review started for ${r.id} (${r.category}) in ${r.application}. We will validate the finding in a non-production test environment, confirm affected entry points, assign an owner, implement a targeted fix with regression coverage, and document validation evidence. Proposed status: In Progress. Target date: ${r.planned || 'TBD'}.`;
      return {text:`**Suggested owner response — review before using**\n\n${draftText}\n\nYou can insert this into the App Owner Response field using the button below. Nothing will be saved until you click **Save**.`, draft:draftText};
    }
    if(kind==='draft') return {text:'Open a sample finding detail first, then I can prepare an owner response based on its synthetic application, category, and risk.'};
    return {text:`This offline prototype doesn't call a live AI model, so I can only provide scripted, context-aware demo guidance. Choose a quick action below to explore risk summaries, remediation ideas, or owner-response drafting.\n\nFor production, the chat interface can be connected to an approved internal AI endpoint with access controls and data minimization.`};
  }
  const guessIntent = question => {
    const q=question.toLowerCase();
    if(/draft|write|response|comment|备注|整改反馈|生成回复|草拟/.test(q))return 'draft';
    if(/priorit|which.*first|urgent|排序|优先|先处理/.test(q))return 'prioritize';
    if(/remedi|fix|repair|mitigat|patch|修复|建议|怎么改|整改方案/.test(q))return 'remediate';
    if(/score|cvss|risk|rating|why|explain|严重|风险|分数|解释/.test(q))return 'explain';
    if(/summar|overview|brief|summary|当前|总结|概览|摘要|有多少/.test(q))return 'summarize';
    return 'unknown';
  };
  function messageMarkup(msg){
    // Tiny safe markdown renderer: escape first and allow only bold, line breaks, and plain text.
    const formatted=escape(msg.text).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
    return `<div class="ai-message ai-message-${msg.role}">
      ${msg.role==='assistant'?`<span class="ai-message-avatar">${icon('spark',14)}</span>`:''}
      <div class="ai-message-wrap"><div class="ai-bubble-text">${formatted}</div>
      ${msg.draft?`<button class="ai-insert" data-ai-action="insert" data-draft-id="${history.indexOf(msg)}">${icon('pen',14)} Insert into response ${icon('arrow',13)}</button>`:''}
      <div class="ai-message-time">${escape(msg.at)}</div></div></div>`;
  }
  function render() {
    const c=ctx();
    const scope=detail(c)?`${c.finding.id} · Finding detail`:`${c.nav} · Portfolio`;
    const chips=actionsFor(c).map(([id,name])=>`<button class="ai-chip" data-ai-quick="${id}">${icon('spark',12)} ${escape(name)}</button>`).join('');
    root.innerHTML = `
      ${isOpen?`<section class="ai-chat-window ${opening?'ai-chat-opening':''}" role="dialog" aria-modal="false" aria-label="AI Enhance assistant">
        <header class="ai-chat-header"><div class="ai-heading-mark">${icon('spark',24)}</div><div class="ai-heading-text"><div class="ai-heading-name">AI Enhance <span>DEMO</span></div><div class="ai-heading-subtitle"><i></i> Offline assistant · Synthetic data only</div></div>
          <button class="ai-icon-btn" data-ai-action="reset" title="New conversation" aria-label="New conversation">${icon('refresh',17)}</button>
          <button class="ai-icon-btn" data-ai-action="close" title="Close chat" aria-label="Close chat">${icon('close',19)}</button></header>
        <div class="ai-context-bar">${icon('shield',14)} <span>${escape(scope)}</span> <span class="ai-local-chip">LOCAL</span></div>
        <div class="ai-messages" id="ai-messages" role="log" aria-live="polite">${history.map(messageMarkup).join('')}</div>
        <div class="ai-bottom"><div class="ai-quick-title">${icon('spark',13)} QUICK ACTIONS</div>
          <div class="ai-quick-grid">${chips}</div>
          <form id="ai-chat-form"><label class="ai-sr-only" for="ai-chat-input">Ask a question</label><div class="ai-input-wrap"><textarea id="ai-chat-input" rows="1" maxlength="700" placeholder="Ask about findings or remediation...">${escape(draft)}</textarea><button type="submit" class="ai-send" aria-label="Send message" ${draft.trim()?'':'disabled'}>${icon('send',17)}</button></div></form>
          <p class="ai-chat-footnote">${icon('shield',12)} Local simulation · No data sent to external services</p>
        </div>
      </section>`:''}
      <button class="ai-fab" id="ai-fab" data-ai-action="toggle" aria-label="${isOpen?'Close AI Enhance':'Open AI Enhance'}" aria-expanded="${isOpen}">${icon(isOpen?'close':'spark',24)}${!isOpen?'<span class="ai-fab-label">Ask AI</span>':''}</button>`;
    if(isOpen){const box=root.querySelector('#ai-messages');if(box)box.scrollTop=box.scrollHeight;}
  }
  function open(){isOpen=true;opening=true;if(!hasSeenWelcome){history.push(makeMessage('assistant',welcome()));hasSeenWelcome=true;}render();opening=false;root.querySelector('#ai-chat-input')?.focus();}
  function close(){isOpen=false;render();root.querySelector('#ai-fab')?.focus();}
  function respond(kind, question){
    const c=ctx();
    if(!hasSeenWelcome){history.push(makeMessage('assistant',welcome()));hasSeenWelcome=true;}
    history.push(makeMessage('user', question));
    history.push(makeMessage('assistant', buildReply(kind,c).text, {draft:buildReply(kind,c).draft || ''}));
    draft='';render();root.querySelector('#ai-chat-input')?.focus();
  }
  root.addEventListener('click', e=>{
    const quick=e.target.closest('[data-ai-quick]');
    if(quick){const id=quick.dataset.aiQuick;respond(id,quick.textContent.trim());return;}
    const action=e.target.closest('[data-ai-action]');if(!action)return;
    switch(action.dataset.aiAction){
      case 'toggle':isOpen?close():open();break;
      case 'close':close();break;
      case 'reset':history.length=0;hasSeenWelcome=false;draft='';open();break;
      case 'insert':{
        const msg=history[Number(action.dataset.draftId)];
        if(msg?.draft && bridge.insertDraft(msg.draft)){
          action.innerHTML=`${icon('check',14)} Added to response`;
          action.disabled=true;
        } else {
          history.push(makeMessage('assistant','Please open a sample finding detail before inserting a draft.'));
          render();
        }
        break;
      }
    }
  });
  root.addEventListener('input',e=>{
    if(e.target.id!=='ai-chat-input')return;
    draft=e.target.value;
    const send=root.querySelector('.ai-send');if(send)send.disabled=!draft.trim();
    e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,110)+'px';
  });
  root.addEventListener('submit',e=>{
    if(e.target.id!=='ai-chat-form')return;
    e.preventDefault();const val=draft.trim();if(!val)return;
    respond(guessIntent(val),val);
  });
  root.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&isOpen){e.preventDefault();close()}
    if(e.target.id==='ai-chat-input'&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();root.querySelector('#ai-chat-form')?.requestSubmit()}
  });
  render();
})();
