/* ── CLOCK ── */
  (function tick(){
    const d = new Date();
    document.getElementById('clk').textContent =
      String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
    setTimeout(tick, 1000);
  })();

  /* ── TYPING ANIMATION ── */
  const phrases = ['VIBE CODER · INDONESIA', 'MAHASISWA · AL-JAELANI', 'DJ MUSIC LOVER · 🎧'];
  let phIdx = 0, chIdx = 0, deleting = false;
  const typeEl = document.getElementById('typeTarget');
  function typeStep() {
    const phrase = phrases[phIdx];
    if (!deleting) {
      typeEl.textContent = phrase.slice(0, ++chIdx);
      if (chIdx === phrase.length) { deleting = true; setTimeout(typeStep, 1800); return; }
    } else {
      typeEl.textContent = phrase.slice(0, --chIdx);
      if (chIdx === 0) { deleting = false; phIdx = (phIdx + 1) % phrases.length; setTimeout(typeStep, 300); return; }
    }
    setTimeout(typeStep, deleting ? 45 : 80);
  }
  setTimeout(typeStep, 600);

  /* ── SCROLL PROGRESS ── */
  document.querySelectorAll('.page').forEach(page => {
    page.addEventListener('scroll', () => {
      if (!page.classList.contains('active')) return;
      const pct = page.scrollTop / (page.scrollHeight - page.clientHeight) * 100;
      document.getElementById('scrollProgress').style.width = pct + '%';
    });
  });

  /* ── COUNT-UP ANIMATION ── */
  function animateCount(el) {
    const target = parseInt(el.dataset.count);
    let cur = 0;
    const step = target / 30;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.round(cur);
      if (cur >= target) clearInterval(timer);
    }, 30);
  }
  function runCountUps() {
    document.querySelectorAll('[data-count]').forEach(animateCount);
  }
  setTimeout(runCountUps, 400);

  /* ── SKILL BARS ANIMATION ── */
  function animateSkills() {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, 300);
    });
  }
  setTimeout(animateSkills, 500);

  /* ── NAV INDICATOR ── */
  function updateIndicator(btn) {
    const nav = document.getElementById('bottomNav');
    const ind = document.getElementById('navIndicator');
    if (!nav || !ind) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    ind.style.left = (btnRect.left - navRect.left) + 'px';
    ind.style.width = btnRect.width + 'px';
  }

  function go(name, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn, .snav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    document.querySelectorAll('[data-page="' + name + '"]').forEach(b => b.classList.add('active'));
    const mobileBtn = document.querySelector('.bottom-nav [data-page="' + name + '"]');
    if (mobileBtn) updateIndicator(mobileBtn);
    // Re-animate skills when switching to home
    if (name === 'home') { setTimeout(animateSkills, 100); setTimeout(runCountUps, 100); }
    document.getElementById('scrollProgress').style.width = '0%';
  }

  window.addEventListener('load', () => {
    const activeBtn = document.querySelector('.bottom-nav .nav-btn.active');
    if (activeBtn) updateIndicator(activeBtn);
  });

  /* ── PROJECT FILTER ── */
  function filterProj(btn, tag) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#projList .proj-card-wrap').forEach(card => {
      const tags = card.dataset.tags || '';
      if (tag === 'all' || tags.includes(tag)) {
        card.style.display = 'contents';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /* ── TOAST ── */
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  /* ── COPY EMAIL ── */
  function copyEmail(e) {
    e.preventDefault(); e.stopPropagation();
    navigator.clipboard.writeText('maddazryu14@gmail.com').then(() => {
      showToast('Email disalin!');
    }).catch(() => {
      showToast('Gagal menyalin');
    });
  }

  /* ── LOGIN MODAL ── */
  const CLOUD_URL  = 'https://1db785a3-a89e-4fec-aadc-1ed958211a87-00-102mzbt022k7s.pike.replit.dev/';
  const AUTH_HASH  = '138d4975ec0c871a3b07eb19ccee9081a25e481fad9733ff1ebbb7728362c680';

  function openLogin() {
    document.getElementById('loginModal').classList.add('show');
    setTimeout(() => document.getElementById('inp-user').focus(), 100);
    document.getElementById('inp-pass').value = '';
    document.getElementById('inp-user').value = '';
    document.getElementById('loginErr').classList.remove('show');
  }
  function closeLogin() {
    document.getElementById('loginModal').classList.remove('show');
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginModal').addEventListener('click', function(e){
      if (e.target === this) closeLogin();
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLogin();
    if (e.key === 'Enter' && document.getElementById('loginModal').classList.contains('show')) doLogin();
  });

  function togglePw() {
    const f = document.getElementById('inp-pass');
    const eye = document.getElementById('pwEye');
    if (f.type === 'password') { f.type = 'text'; eye.textContent = '🙈'; }
    else { f.type = 'password'; eye.textContent = '👁'; }
  }

  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  async function doLogin() {
    const btn  = document.getElementById('loginBtn');
    const user = document.getElementById('inp-user').value.trim();
    const pass = document.getElementById('inp-pass').value;
    if (!user || !pass) { showErr('⚠ Semua field wajib diisi'); return; }
    btn.disabled = true; btn.textContent = 'Memverifikasi...';
    const hash = await sha256(user + ':' + pass);
    if (hash === AUTH_HASH) {
      btn.textContent = '✓ Berhasil! Membuka...';
      btn.style.background = 'linear-gradient(135deg, #00ffb3, #00cc8f)';
      setTimeout(() => {
        window.open(CLOUD_URL, '_blank');
        closeLogin();
        btn.disabled = false; btn.textContent = 'Masuk →'; btn.style.background = '';
      }, 800);
    } else {
      showErr('⚠ Username atau password salah');
      document.getElementById('modalBox').classList.add('shake');
      setTimeout(() => document.getElementById('modalBox').classList.remove('shake'), 400);
      btn.disabled = false; btn.textContent = 'Masuk →';
    }
  }

  function showErr(msg) {
    const err = document.getElementById('loginErr');
    err.textContent = msg; err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 3000);
  }

/* =====================================================================
   FUNCTIONAL UPGRADE LAYER
   ===================================================================== */
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const LS = { get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},
               set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)) };
  const origShowToast = window.showToast || (m=>console.log(m));

  /* ── 1. HASH ROUTING (sharable URLs, back/forward works) ── */
  const validPages = ['home','projects','social'];
  function applyHash(){
    const h = (location.hash.replace('#/','').replace('#','')||'home').toLowerCase();
    if(!validPages.includes(h)) return;
    const btn = document.querySelector('.bottom-nav [data-page="'+h+'"]') || document.querySelector('[data-page="'+h+'"]');
    if(btn && window.go) go(h, btn);
  }
  const _origGo = window.go;
  window.go = function(name, el){ _origGo(name, el); if(location.hash!=='#/'+name) history.pushState(null,'','#/'+name); };
  window.addEventListener('popstate', applyHash);
  window.addEventListener('hashchange', applyHash);
  setTimeout(applyHash, 50);

  /* ── 2. THEME SWITCHER (persisted) ── */
  const THEMES = ['default','violet','coral','cyan','amber'];
  function applyTheme(t){
    if(t==='default') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    LS.set('theme', t);
    $('#themeBtn').innerHTML = '<span class="dot"></span>'+t.toUpperCase();
  }
  applyTheme(LS.get('theme','default'));
  $('#themeBtn').onclick = ()=>{
    const cur = LS.get('theme','default');
    const next = THEMES[(THEMES.indexOf(cur)+1)%THEMES.length];
    applyTheme(next);
    origShowToast('Tema: '+next);
  };

  /* ── 3. WEB SHARE / COPY LINK ── */
  $('#shareBtn').onclick = async ()=>{
    const data = { title:'MaddazXD — Vibe Coder', text:'Portfolio MaddazXD', url:location.href };
    if(navigator.share){ try{ await navigator.share(data); return; }catch(e){} }
    await navigator.clipboard.writeText(location.href);
    origShowToast('Link disalin!');
  };

  /* ── 4. PWA: inline manifest + service worker ── */
  const manifest = {
    name:'MaddazXD Portfolio', short_name:'MaddazXD', start_url:'./', display:'standalone',
    background_color:'#050914', theme_color:'#050914',
    icons:[{src:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='42' fill='%23050914'/%3E%3Ctext x='96' y='128' font-size='100' text-anchor='middle' font-family='monospace' fill='%2300ffb3' font-weight='bold'%3EM%3C/text%3E%3C/svg%3E",sizes:'192x192',type:'image/svg+xml',purpose:'any'}]
  };
  $('#pwaManifest').href = 'data:application/manifest+json,'+encodeURIComponent(JSON.stringify(manifest));
  if('serviceWorker' in navigator && location.protocol.startsWith('http')){
    const swCode = `self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>self.clients.claim());
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open('mxd-v1').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(rr=>{try{c.put(e.request,rr.clone())}catch(_){}return rr}).catch(()=>r))));
});`;
    const blobUrl = URL.createObjectURL(new Blob([swCode],{type:'text/javascript'}));
    navigator.serviceWorker.register(blobUrl).catch(()=>{});
  }
  let deferredPrompt=null;
  window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt=e; $('#installBtn').style.display='inline-flex'; });
  $('#installBtn').onclick = async ()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; $('#installBtn').style.display='none'; };

  /* ── 5. REAL VISITOR COUNTER (counterapi.dev — public, no key) ── */
  (async function(){
    try{
      const r = await fetch('https://api.counterapi.dev/v1/maddazxd/portfolio/up');
      if(!r.ok) return;
      const j = await r.json();
      const pill = document.createElement('span');
      pill.id='visitPill';
      pill.innerHTML='<i class="fa-regular fa-eye"></i> '+(j.count||0).toLocaleString();
      document.querySelector('.s-right').prepend(pill);
    }catch(e){}
  })();

  /* ── 6. REAL WEATHER (Open-Meteo, no key) ── */
  (async function(){
    try{
      // Try geolocation fallback to Jakarta
      const fetchWx = async (lat,lon)=>{
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
        const j = await r.json();
        const t = Math.round(j.current.temperature_2m);
        const codes = {0:'☀',1:'🌤',2:'⛅',3:'☁',45:'🌫',48:'🌫',51:'🌦',53:'🌦',55:'🌧',61:'🌧',63:'🌧',65:'⛈',71:'❄',80:'🌦',95:'⛈'};
        const ic = codes[j.current.weather_code]||'🌡';
        const wx = document.createElement('span'); wx.id='wx'; wx.textContent = ic+' '+t+'°';
        document.querySelector('.s-right').insertBefore(wx, document.getElementById('clk'));
      };
      navigator.geolocation?.getCurrentPosition(
        p=>fetchWx(p.coords.latitude,p.coords.longitude),
        ()=>fetchWx(-6.2,106.8),
        {timeout:3000}
      ) || fetchWx(-6.2,106.8);
    }catch(e){}
  })();

  /* ── 7. COMMAND PALETTE ── */
  function buildCmds(){
    const base = [
      {t:'Profil', s:'Halaman about / skills', ic:'fa-user', act:()=>{location.hash='#/home'}},
      {t:'Proyek', s:'Daftar proyek', ic:'fa-layer-group', act:()=>{location.hash='#/projects'}},
      {t:'Kontak', s:'Social media & email', ic:'fa-satellite-dish', act:()=>{location.hash='#/social'}},
      {t:'Ganti Tema', s:'Putar warna aksen', ic:'fa-palette', act:()=>$('#themeBtn').click()},
      {t:'Bagikan Halaman', s:'Web Share / copy link', ic:'fa-share-nodes', act:()=>$('#shareBtn').click()},
      {t:'Kirim Pesan', s:'Form kontak langsung', ic:'fa-paper-plane', act:()=>openMx('contactModal')},
      {t:'Download vCard', s:'Simpan kontak ke HP', ic:'fa-address-card', act:()=>openMx('qrModal')},
      {t:'Copy Email', s:'maddazryu14@gmail.com', ic:'fa-envelope', act:()=>{navigator.clipboard.writeText('maddazryu14@gmail.com');origShowToast('Email disalin!')}},
    ];
    $$('.proj-card-wrap .proj-card').forEach(c=>{
      const name = c.querySelector('.proj-name')?.textContent?.trim();
      const url = c.getAttribute('href');
      if(!name) return;
      base.push({t:'→ '+name, s:'Buka proyek '+(url?'(eksternal)':'(private)'), ic:'fa-arrow-up-right-from-square',
        act:()=>{ if(url) window.open(url,'_blank'); else if(window.openLogin) openLogin(); }});
    });
    return base;
  }
  let cmds=[], cmdSel=0, cmdFiltered=[];
  function renderCmds(q){
    q = (q||'').toLowerCase().trim();
    cmdFiltered = q ? cmds.filter(c=>(c.t+' '+c.s).toLowerCase().includes(q)) : cmds;
    if(!cmdFiltered.length){ $('#cmdkList').innerHTML='<div class="cmdk-empty">Tidak ada hasil</div>'; return; }
    $('#cmdkList').innerHTML = cmdFiltered.map((c,i)=>
      `<div class="cmdk-item ${i===cmdSel?'sel':''}" data-i="${i}">
        <div class="ic"><i class="fa-solid ${c.ic}"></i></div>
        <div class="meta"><div class="t">${c.t}</div><div class="s">${c.s}</div></div>
        <span class="kbd">↵</span></div>`).join('');
    $$('#cmdkList .cmdk-item').forEach(el=>el.onclick=()=>runCmd(+el.dataset.i));
  }
  function runCmd(i){ const c=cmdFiltered[i]; if(!c) return; closeCmdk(); c.act(); }
  function openCmdk(){ cmds=buildCmds(); cmdSel=0; $('#cmdkInput').value=''; renderCmds(''); $('#cmdk').classList.add('show'); setTimeout(()=>$('#cmdkInput').focus(),30); }
  function closeCmdk(){ $('#cmdk').classList.remove('show'); }
  $('#cmdkOpen').onclick = openCmdk;
  $('#cmdk').onclick = e=>{ if(e.target.id==='cmdk') closeCmdk(); };
  $('#cmdkInput').oninput = e=>{ cmdSel=0; renderCmds(e.target.value); };
  $('#cmdkInput').onkeydown = e=>{
    if(e.key==='ArrowDown'){ e.preventDefault(); cmdSel=Math.min(cmdSel+1,cmdFiltered.length-1); renderCmds($('#cmdkInput').value); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); cmdSel=Math.max(cmdSel-1,0); renderCmds($('#cmdkInput').value); }
    else if(e.key==='Enter'){ e.preventDefault(); runCmd(cmdSel); }
    else if(e.key==='Escape'){ closeCmdk(); }
  };

  /* ── 9. GENERIC MODALS ── */
  window.openMx = id=>{ $('#'+id).classList.add('show'); };
  window.closeMx = id=>{ $('#'+id).classList.remove('show'); };
  $$('.mx-overlay').forEach(o=>o.addEventListener('click',e=>{ if(e.target===o) o.classList.remove('show'); }));

  /* ── 10. CONTACT FORM (FormSubmit AJAX — actually sends email) ── */
  $('#contactFab').onclick = ()=>openMx('contactModal');
  $('#contactForm').addEventListener('submit', async e=>{
    e.preventDefault();
    const btn = $('#contactSubmit'); btn.disabled=true; btn.textContent='Mengirim…';
    try{
      const fd = new FormData(e.target);
      const r = await fetch(e.target.action,{method:'POST',body:fd,headers:{'Accept':'application/json'}});
      if(r.ok){ origShowToast('Pesan terkirim! ✅'); e.target.reset(); closeMx('contactModal'); }
      else { origShowToast('Gagal: '+r.status); }
    }catch(err){ origShowToast('Error jaringan'); }
    btn.disabled=false; btn.textContent='Kirim Pesan →';
  });

  /* ── 11. vCARD + QR ── */
  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:MaddazXD\nN:MaddazXD;;;;\nNICKNAME:Maddaz\nEMAIL:maddazryu14@gmail.com\nURL:${location.origin+location.pathname}\nNOTE:Vibe Coder · Mahasiswa STIES KHAS AL-JAELANI\nEND:VCARD`;
  $('#qrImg').src = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data='+encodeURIComponent(vcard);
  $('#vcardBtn').onclick = ()=>{
    const blob = new Blob([vcard],{type:'text/vcard'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='MaddazXD.vcf'; a.click();
    origShowToast('vCard tersimpan!');
  };

  /* ── 12. BACK-TO-TOP ── */
  function checkTop(){
    const p = document.querySelector('.page.active');
    if(!p) return;
    $('#topFab').style.display = p.scrollTop>400?'flex':'none';
  }
  $$('.page').forEach(p=>p.addEventListener('scroll',checkTop));
  $('#topFab').onclick = ()=>{ document.querySelector('.page.active')?.scrollTo({top:0,behavior:'smooth'}); };

  /* ── 14. PROJECT SEARCH INPUT ── */
  const projList = $('#projList');
  if(projList){
    const search = document.createElement('input');
    search.className='proj-search'; search.placeholder='🔍 Cari proyek (nama / tag)…';
    projList.parentElement.insertBefore(search, projList);
    search.oninput = ()=>{
      const q = search.value.toLowerCase().trim();
      $$('#projList .proj-card-wrap').forEach(c=>{
        const text = c.textContent.toLowerCase();
        c.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
    };
  }

  /* ── 15. GLOBAL KEYBOARD SHORTCUTS ── */
  let gPending=false, gTimer=null;
  document.addEventListener('keydown', e=>{
    if(e.target.matches('input,textarea')) return;
    const meta = e.ctrlKey||e.metaKey;
    if(meta && e.key.toLowerCase()==='k'){ e.preventDefault(); openCmdk(); return; }
    if(e.key.toLowerCase()==='t'){ $('#themeBtn').click(); return; }
    if(e.key.toLowerCase()==='s'){ $('#shareBtn').click(); return; }
    if(e.key.toLowerCase()==='g'){ gPending=true; clearTimeout(gTimer); gTimer=setTimeout(()=>gPending=false,800); return; }
    if(gPending){
      gPending=false;
      const map={h:'home',p:'projects',c:'social'};
      const dest = map[e.key.toLowerCase()];
      if(dest) location.hash='#/'+dest;
    }
    if(e.key==='Escape'){ closeCmdk(); $$('.mx-overlay').forEach(o=>o.classList.remove('show')); }
  });

  /* ── 16. KONAMI EASTER EGG → MATRIX RAIN ── */
  const konami=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx=0;
  document.addEventListener('keydown', e=>{
    if(e.key.toLowerCase()===konami[kIdx].toLowerCase()){ kIdx++; if(kIdx===konami.length){ kIdx=0; matrix(); } }
    else kIdx=0;
  });
  function matrix(){
    const c=$('#mx-canvas'); c.classList.add('on');
    c.width=innerWidth; c.height=innerHeight;
    const ctx=c.getContext('2d');
    const cols=Math.floor(c.width/16); const drops=Array(cols).fill(0);
    const chars='アイウエオカキクケコMaddazXD01';
    const iv=setInterval(()=>{
      ctx.fillStyle='rgba(5,9,20,0.08)'; ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle='#00ffb3'; ctx.font='15px monospace';
      drops.forEach((d,i)=>{ ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*16, d*16);
        if(d*16>c.height && Math.random()>.975) drops[i]=0; drops[i]++; });
    },50);
    origShowToast('🎮 Konami unlocked!');
    setTimeout(()=>{ clearInterval(iv); c.classList.remove('on'); ctx.clearRect(0,0,c.width,c.height); }, 8000);
  }

  /* ── 17. WIRE LOGIN MODAL CLOSE TO ESC (already exists) — extend palette open from existing private project click ── */
})();
