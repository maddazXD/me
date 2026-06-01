/* ── CLOCK ── */
(function tick() {
  const d = new Date();
  document.getElementById("clk").textContent =
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0");
  setTimeout(tick, 1000);
})();

/* ── TYPING ANIMATION ── */
const phrases = [
  "VIBE CODER · INDONESIA",
  "MAHASISWA · AL-JAELANI",
  "DJ MUSIC LOVER · 🎧",
];
let phIdx = 0,
  chIdx = 0,
  deleting = false;
const typeEl = document.getElementById("typeTarget");
function typeStep() {
  const phrase = phrases[phIdx];
  if (!deleting) {
    typeEl.textContent = phrase.slice(0, ++chIdx);
    if (chIdx === phrase.length) {
      deleting = true;
      setTimeout(typeStep, 1800);
      return;
    }
  } else {
    typeEl.textContent = phrase.slice(0, --chIdx);
    if (chIdx === 0) {
      deleting = false;
      phIdx = (phIdx + 1) % phrases.length;
      setTimeout(typeStep, 300);
      return;
    }
  }
  setTimeout(typeStep, deleting ? 45 : 80);
}
setTimeout(typeStep, 600);

/* ── SCROLL PROGRESS ── */
let scrollTicking = false;
const progressBar = document.getElementById("scrollProgress");
document.querySelectorAll(".page").forEach((page) => {
  page.addEventListener(
    "scroll",
    () => {
      if (!page.classList.contains("active")) return;
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const rawPct =
            page.scrollTop / (page.scrollHeight - page.clientHeight);
          const pct = Math.max(0, Math.min(1, rawPct)) || 0;
          progressBar.style.transform = `scaleX(${pct})`;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true },
  );
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
  document.querySelectorAll("[data-count]").forEach(animateCount);
}
setTimeout(runCountUps, 400);

/* ── SKILL BARS ANIMATION ── */
function animateSkills() {
  document.querySelectorAll(".skill-fill").forEach((bar) => {
    setTimeout(() => {
      bar.style.width = bar.dataset.pct + "%";
    }, 300);
  });
}
setTimeout(animateSkills, 500);

/* ── NAV INDICATOR ── */
function updateIndicator(btn) {
  const nav = document.getElementById("bottomNav");
  const ind = document.getElementById("navIndicator");
  if (!nav || !ind) return;
  const navRect = nav.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  ind.style.left = btnRect.left - navRect.left + "px";
  ind.style.width = btnRect.width + "px";
}

function go(name, el) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn, .snav-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("page-" + name).classList.add("active");
  document
    .querySelectorAll('[data-page="' + name + '"]')
    .forEach((b) => b.classList.add("active"));
  const mobileBtn = document.querySelector(
    '.bottom-nav [data-page="' + name + '"]',
  );
  if (mobileBtn) updateIndicator(mobileBtn);
  if (name === "home") {
    setTimeout(animateSkills, 100);
    setTimeout(runCountUps, 100);
  }
  document.getElementById("scrollProgress").style.transform = "scaleX(0)";
}

window.addEventListener("load", () => {
  const activeBtn = document.querySelector(".bottom-nav .nav-btn.active");
  if (activeBtn) updateIndicator(activeBtn);
});

/* ── PROJECT FILTER ── */
function filterProj(btn, tag) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll("#projList .proj-card-wrap").forEach((card) => {
    const tags = card.dataset.tags || "";
    if (tag === "all" || tags.includes(tag)) {
      card.style.display = "contents";
    } else {
      card.style.display = "none";
    }
  });
}

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

/* ── COPY EMAIL ── */
function copyEmail(e) {
  e.preventDefault();
  e.stopPropagation();
  navigator.clipboard
    .writeText("maddazryu14@gmail.com")
    .then(() => {
      showToast("Email disalin!");
    })
    .catch(() => {
      showToast("Gagal menyalin");
    });
}

/* ── LOGIN MODAL ── */
const CLOUD_URL =
  "https://1db785a3-a89e-4fec-aadc-1ed958211a87-00-102mzbt022k7s.pike.replit.dev/";
const AUTH_HASH =
  "138d4975ec0c871a3b07eb19ccee9081a25e481fad9733ff1ebbb7728362c680";

function openLogin() {
  document.getElementById("loginModal").classList.add("show");
  setTimeout(() => document.getElementById("inp-user").focus(), 100);
  document.getElementById("inp-pass").value = "";
  document.getElementById("inp-user").value = "";
  document.getElementById("loginErr").classList.remove("show");
}
function closeLogin() {
  document.getElementById("loginModal").classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginModal").addEventListener("click", function (e) {
    if (e.target === this) closeLogin();
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLogin();
  if (
    e.key === "Enter" &&
    document.getElementById("loginModal").classList.contains("show")
  )
    doLogin();
});

function togglePw() {
  const f = document.getElementById("inp-pass");
  const eye = document.getElementById("pwEye");
  if (f.type === "password") {
    f.type = "text";
    eye.textContent = "🙈";
  } else {
    f.type = "password";
    eye.textContent = "👁";
  }
}

async function sha256(str) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function doLogin() {
  const btn = document.getElementById("loginBtn");
  const user = document.getElementById("inp-user").value.trim();
  const pass = document.getElementById("inp-pass").value;
  if (!user || !pass) {
    showErr("⚠ Semua field wajib diisi");
    return;
  }
  btn.disabled = true;
  btn.textContent = "Memverifikasi...";
  const hash = await sha256(user + ":" + pass);
  if (hash === AUTH_HASH) {
    btn.textContent = "✓ Berhasil! Membuka...";
    btn.style.background = "linear-gradient(135deg, #00ffb3, #00cc8f)";
    setTimeout(() => {
      window.open(CLOUD_URL, "_blank");
      closeLogin();
      btn.disabled = false;
      btn.textContent = "Masuk →";
      btn.style.background = "";
    }, 800);
  } else {
    showErr("⚠ Username atau password salah");
    document.getElementById("modalBox").classList.add("shake");
    setTimeout(
      () => document.getElementById("modalBox").classList.remove("shake"),
      400,
    );
    btn.disabled = false;
    btn.textContent = "Masuk →";
  }
}

function showErr(msg) {
  const err = document.getElementById("loginErr");
  err.textContent = msg;
  err.classList.add("show");
  setTimeout(() => err.classList.remove("show"), 3000);
}

/* =====================================================================
   FUNCTIONAL UPGRADE LAYER
   ===================================================================== */
(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const LS = {
    get: (k, d) => {
      try {
        return JSON.parse(localStorage.getItem(k)) ?? d;
      } catch (e) {
        return d;
      }
    },
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  };
  const origShowToast = window.showToast || ((m) => console.log(m));

  /* ── 1. HASH ROUTING (sharable URLs, back/forward works) ── */
  const validPages = ["home", "projects", "tools", "social"];
  function applyHash() {
    const h = (
      location.hash.replace("#/", "").replace("#", "") || "home"
    ).toLowerCase();
    if (!validPages.includes(h)) return;
    const btn =
      document.querySelector('.bottom-nav [data-page="' + h + '"]') ||
      document.querySelector('[data-page="' + h + '"]');
    if (btn && window.go) go(h, btn);
  }
  const _origGo = window.go;
  window.go = function (name, el) {
    _origGo(name, el);
    if (location.hash !== "#/" + name) history.pushState(null, "", "#/" + name);
  };
  window.addEventListener("popstate", applyHash);
  window.addEventListener("hashchange", applyHash);
  setTimeout(applyHash, 50);

  /* ── 2. THEME SWITCHER (persisted) ── */
  const THEMES = ["default", "violet", "coral", "cyan", "amber"];
  function applyTheme(t) {
    if (t === "default") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
    LS.set("theme", t);
  }
  applyTheme(LS.get("theme", "default"));
  const themeBtn = $("#themeBtn");
  if (themeBtn) {
    themeBtn.onclick = () => {
      const cur = LS.get("theme", "default");
      const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
      applyTheme(next);
      origShowToast("Tema: " + next);
    };
  }

  /* ── 3. WEB SHARE / COPY LINK ── */
  const shareBtn = $("#shareBtn");
  if (shareBtn) {
    shareBtn.onclick = async () => {
      const data = {
        title: "MaddazXD — Vibe Coder",
        text: "Portfolio MaddazXD",
        url: location.href,
      };
      if (navigator.share) {
        try {
          await navigator.share(data);
          return;
        } catch (e) {}
      }
      await navigator.clipboard.writeText(location.href);
      origShowToast("Link disalin!");
    };
  }

  /* ── 4. PWA: inline manifest + service worker ── */
  const manifest = {
    name: "MaddazXD Portfolio",
    short_name: "MaddazXD",
    start_url: "./",
    display: "standalone",
    background_color: "#050914",
    theme_color: "#050914",
    icons: [
      {
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='42' fill='%23050914'/%3E%3Ctext x='96' y='128' font-size='100' text-anchor='middle' font-family='monospace' fill='%2300ffb3' font-weight='bold'%3EM%3C/text%3E%3C/svg%3E",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
  const pwaManifest = $("#pwaManifest");
  if (pwaManifest)
    pwaManifest.href =
      "data:application/manifest+json," +
      encodeURIComponent(JSON.stringify(manifest));
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    const swCode = `self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>self.clients.claim());
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open('mxd-v1').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(rr=>{try{c.put(e.request,rr.clone())}catch(_){}return rr}).catch(()=>r))));
});`;
    const blobUrl = URL.createObjectURL(
      new Blob([swCode], { type: "text/javascript" }),
    );
    navigator.serviceWorker.register(blobUrl).catch(() => {});
  }
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const iBtn = $("#installBtn");
    if (iBtn) iBtn.style.display = "inline-flex";
  });
  const installBtn = $("#installBtn");
  if (installBtn) {
    installBtn.onclick = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      $("#installBtn").style.display = "none";
    };
  }

  /* ── 5. REAL VISITOR COUNTER (counterapi.dev — public, no key) ── */
  (async function () {
    try {
      const r = await fetch(
        "https://api.counterapi.dev/v1/maddazxd/portfolio/up",
      );
      if (!r.ok) return;
      const j = await r.json();
      const pill = document.createElement("span");
      pill.id = "visitPill";
      pill.innerHTML =
        '<i class="fa-regular fa-eye"></i> ' + (j.count || 0).toLocaleString();
      document.querySelector(".s-right").prepend(pill);
    } catch (e) {}
  })();

  /* ── 6. REAL WEATHER & LOCATION ── */
  (async function () {
    try {
      const wxCodes = {
        0: "Cerah",
        1: "Sebagian Cerah",
        2: "Berawan",
        3: "Mendung",
        45: "Berkabut",
        48: "Berkabut",
        51: "Gerimis",
        53: "Gerimis",
        55: "Gerimis Lebat",
        61: "Hujan Ringan",
        63: "Hujan",
        65: "Hujan Lebat",
        71: "Salju",
        80: "Hujan",
        95: "Badai Petir",
      };
      const wxIcons = {
        0: "☀",
        1: "🌤",
        2: "⛅",
        3: "☁",
        45: "🌫",
        48: "🌫",
        51: "🌦",
        53: "🌦",
        55: "🌧",
        61: "🌧",
        63: "🌧",
        65: "⛈",
        71: "❄",
        80: "🌦",
        95: "⛈",
      };
      const getCity = async (lat, lon) => {
        try {
          const r = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`,
          );
          const j = await r.json();
          return (
            j.locality || j.city || j.principalSubdivision || "Lokasi Anda"
          );
        } catch (e) {
          return "Lokasi Anda";
        }
      };
      const fetchWx = async (lat, lon, explicitCity = null) => {
        try {
          const city = explicitCity || (await getCity(lat, lon));
          const r = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`,
          );
          const j = await r.json();
          const t = Math.round(j.current.temperature_2m);
          const code = j.current.weather_code;
          const wxContainer = document.getElementById("weather-widget");
          if (wxContainer) {
            wxContainer.innerHTML = `
              <div class="wx-inner">
                <div class="wx-loc" title="Lokasi dideteksi dari IP atau GPS"><i class="fa-solid fa-location-dot"></i> ${city}</div>
                <div class="wx-div"></div>
                <div class="wx-wthr">
                  <span class="wx-icon">${wxIcons[code] || "🌡"}</span>
                  <span class="wx-desc">${wxCodes[code] || "Cuaca"}</span>
                </div>
                <div class="wx-div"></div>
                <div class="wx-temp">${t}°C</div>
              </div>
            `;
          }
        } catch (e) {
          const wxContainer = document.getElementById("weather-widget");
          if (wxContainer)
            wxContainer.innerHTML =
              '<span class="wx-loc" style="font-size:10px;color:gray"><i class="fa-solid fa-cloud"></i> Cuaca tidak tersedia</span>';
        }
      };
      const fallbackIP = async () => {
        try {
          // Menggunakan ipapi.co yang support HTTPS
          const r = await fetch("https://ipapi.co/json/");
          const j = await r.json();
          if (j && j.latitude && j.longitude) {
            fetchWx(j.latitude, j.longitude, j.city);
          } else {
            throw new Error("RateLimited");
          }
        } catch (e) {
          try {
            const r2 = await fetch("https://get.geojs.io/v1/ip/geo.json");
            const j2 = await r2.json();
            if (j2 && j2.latitude && j2.longitude) {
              fetchWx(j2.latitude, j2.longitude, j2.city);
            } else {
              fetchWx(-6.2, 106.8, "Jakarta (Default)");
            }
          } catch (e2) {
            fetchWx(-6.2, 106.8, "Jakarta (Default)");
          }
        }
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (p) => fetchWx(p.coords.latitude, p.coords.longitude),
          fallbackIP,
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        );
      } else {
        fallbackIP();
      }
    } catch (e) {}
  })();

  /* ── 9. GENERIC MODALS ── */
  window.openMx = (id) => {
    const el = $("#" + id);
    if (el) el.classList.add("show");
  };
  window.closeMx = (id) => {
    const el = $("#" + id);
    if (el) el.classList.remove("show");
  };
  $$(".mx-overlay").forEach((o) =>
    o.addEventListener("click", (e) => {
      if (e.target === o) o.classList.remove("show");
    }),
  );

  /* ── 10. CONTACT FORM ── */
  const contactFab = $("#contactFab");
  if (contactFab) contactFab.onclick = () => openMx("contactModal");
  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = $("#contactSubmit");
      btn.disabled = true;
      btn.textContent = "Mengirim…";
      try {
        const fd = new FormData(e.target);
        const r = await fetch(e.target.action, {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" },
        });
        if (r.ok) {
          origShowToast("Pesan terkirim! ✅");
          e.target.reset();
          closeMx("contactModal");
        } else {
          origShowToast("Gagal: " + r.status);
        }
      } catch (err) {
        origShowToast("Error jaringan");
      }
      btn.disabled = false;
      btn.textContent = "Kirim Pesan →";
    });
  }

  /* ── 11. vCARD + QR ── */
  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:MaddazXD\nN:MaddazXD;;;;\nNICKNAME:Maddaz\nEMAIL:maddazryu14@gmail.com\nURL:${location.origin + location.pathname}\nNOTE:Vibe Coder · Mahasiswa STIES KHAS AL-JAELANI\nEND:VCARD`;
  const qrImg = $("#qrImg");
  if (qrImg)
    qrImg.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" +
      encodeURIComponent(vcard);
  const vcardBtn = $("#vcardBtn");
  if (vcardBtn) {
    vcardBtn.onclick = () => {
      const blob = new Blob([vcard], { type: "text/vcard" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "MaddazXD.vcf";
      a.click();
      origShowToast("vCard tersimpan!");
    };
  }

  /* ── 14. PROJECT SEARCH INPUT ── */
  const projList = $("#projList");
  if (projList) {
    const search = document.createElement("input");
    search.className = "proj-search";
    search.placeholder = "🔍 Cari proyek (nama / tag)…";
    projList.parentElement.insertBefore(search, projList);
    search.oninput = () => {
      const q = search.value.toLowerCase().trim();
      $$("#projList .proj-card-wrap").forEach((c) => {
        const text = c.textContent.toLowerCase();
        c.style.display = !q || text.includes(q) ? "" : "none";
      });
    };
  }

  /* ── 15. GLOBAL KEYBOARD SHORTCUTS ── */
  let gPending = false,
    gTimer = null;
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input,textarea")) return;
    const meta = e.ctrlKey || e.metaKey;
    if (meta && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCmdk();
      return;
    }
    if (e.key.toLowerCase() === "t") {
      const tBtn = $("#themeBtn");
      if (tBtn) tBtn.click();
      return;
    }
    if (e.key.toLowerCase() === "s") {
      const sBtn = $("#shareBtn");
      if (sBtn) sBtn.click();
      return;
    }
    if (e.key.toLowerCase() === "g") {
      gPending = true;
      clearTimeout(gTimer);
      gTimer = setTimeout(() => (gPending = false), 800);
      return;
    }
    if (gPending) {
      gPending = false;
      const map = { h: "home", p: "projects", t: "tools", c: "social" };
      const dest = map[e.key.toLowerCase()];
      if (dest) location.hash = "#/" + dest;
    }
    if (e.key === "Escape") {
      closeCmdk();
      $$(".mx-overlay").forEach((o) => o.classList.remove("show"));
    }
  });

  /* ── 16. KONAMI EASTER EGG → MATRIX RAIN ── */
  const konami = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let kIdx = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === konami[kIdx].toLowerCase()) {
      kIdx++;
      if (kIdx === konami.length) {
        kIdx = 0;
        matrix();
      }
    } else kIdx = 0;
  });
  function matrix() {
    const c = $("#mx-canvas");
    if (!c) return;
    c.classList.add("on");
    c.width = innerWidth;
    c.height = innerHeight;
    const ctx = c.getContext("2d");
    const cols = Math.floor(c.width / 16);
    const drops = Array(cols).fill(0);
    const chars = "アイウエオカキクケコMaddazXD01";
    const iv = setInterval(() => {
      ctx.fillStyle = "rgba(5,9,20,0.08)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#00ffb3";
      ctx.font = "15px monospace";
      drops.forEach((d, i) => {
        ctx.fillText(
          chars[Math.floor(Math.random() * chars.length)],
          i * 16,
          d * 16,
        );
        if (d * 16 > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 50);
    origShowToast("🎮 Konami unlocked!");
    setTimeout(() => {
      clearInterval(iv);
      c.classList.remove("on");
      ctx.clearRect(0, 0, c.width, c.height);
    }, 8000);
  }
})();

/* ── 18. iOS YOUTUBE MUSIC PLAYER (DJ TIKTOK VIRAL) ── */
let ytTracks = [];
let ytCur = 0;
let ytPlayerObj = null;
let ytIsReady = false;
let ytProgressTimer = null;

function extractYtId(link) {
  if (!link) return null;
  const match = link.match(
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
  );
  return match && match[2].length === 11 ? match[2] : link; // fallback return link assumes it might be ID
}

async function initMusicPlayer() {
  const fallbackPlaylist = [
    {
      url: "https://youtu.be/GNROoGfQiNQ",
      title: "DJ TIKTOK VIRAL 2026 MENGKANE",
      artist: "DJ Lokal Jedag Jedug",
    },
    {
      url: "https://youtu.be/kU93g3S75lY",
      title: "DJ CINTA TERAKHIRKU (FULL BASS)",
      artist: "DJ Opus Remix",
    },
    {
      url: "https://youtu.be/I9yH7gH959I",
      title: "DJ PARTY KAMU NANYA VIRAL",
      artist: "DJ Pargoy 2026",
    },
    {
      url: "https://youtu.be/W0pDqz3sK74",
      title: "DJ SIAL MAHALINI SLOW BASS",
      artist: "DJ Nofin Asia",
    },
    {
      url: "https://youtu.be/Y5F3a7h-M3I",
      title: "DJ RUNKAD ENTE KADANG KADANG",
      artist: "DJ Breakbeat Terbaru",
    },
    {
      url: "https://youtu.be/qQYw0sZ229c",
      title: "DJ ACAN ACAN X POK AME AME",
      artist: "DJ Cantik FYP",
    },
    {
      url: "https://youtu.be/R3nF98v-320",
      title: "DJ KU BERLAYAR DI LAUTAN",
      artist: "DJ Tiktok Viral",
    },
    {
      url: "https://youtu.be/2V4y4z93z7I",
      title: "DJ ENGKOL FULL SENYUM",
      artist: "Jedag Jedug Vibe",
    },
    {
      url: "https://youtu.be/F7u7d8x06kE",
      title: "DJ CECAK ROWO REMIX 2026",
      artist: "DJ Kampung Halaman",
    },
    {
      url: "https://youtu.be/bC4w8p105B8",
      title: "DJ MENDUNG TANPO UDAN",
      artist: "DJ Keroncong EDM",
    },
  ];

  try {
    let res = await fetch("playlist.json").catch(() => null);
    if (!res || !res.ok) {
      res = await fetch("public/playlist.json").catch(() => null);
    }
    if (res && res.ok) {
      const data = await res.json();
      if (data && data.length > 0) ytTracks = data;
    }
  } catch (err) {
    console.error("Gagal memuat playlist JSON:", err);
  }

  if (ytTracks.length === 0) {
    // Fallback jika fetch gagal
    ytTracks = fallbackPlaylist;
  }

  const ytScript = document.createElement("script");
  ytScript.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(ytScript);
}
initMusicPlayer();

window.onYouTubeIframeAPIReady = function () {
  const vId = extractYtId(
    ytTracks[ytCur].url || ytTracks[ytCur].link || ytTracks[ytCur].id,
  );
  ytPlayerObj = new YT.Player("yt-player", {
    height: "0",
    width: "0",
    videoId: vId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      showinfo: 0,
      origin: window.location.origin,
      enablejsapi: 1,
    },
    events: {
      onReady: onYtReady,
      onStateChange: onYtStateChange,
    },
  });
};

function ytFmt(sec) {
  if (!sec) return "0:00";
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toString().padStart(2, "0");
  return m + ":" + s;
}

function onYtReady(event) {
  ytIsReady = true;
  updateYtUI();
}

function updateYtUI() {
  const t = ytTracks[ytCur];
  const titleEl = document.getElementById("sp-title");
  const artistEl = document.getElementById("sp-artist");
  const coverEl = document.getElementById("sp-cover");
  const bgEl = document.getElementById("ios-player-bg");
  if (titleEl) titleEl.textContent = t.title;
  if (artistEl) artistEl.textContent = t.artist;
  const vId = extractYtId(t.url || t.link || t.id);
  const imgUrl = `https://img.youtube.com/vi/${vId}/hqdefault.jpg`;
  if (coverEl) coverEl.src = imgUrl;
  if (bgEl) bgEl.style.backgroundImage = `url(${imgUrl})`;
}

function ytSyncProgress() {
  if (!ytIsReady || !ytPlayerObj.getCurrentTime) return;
  const state = ytPlayerObj.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    const cur = ytPlayerObj.getCurrentTime();
    const dur = ytPlayerObj.getDuration();
    const curEl = document.getElementById("sp-curr");
    const totEl = document.getElementById("sp-total");
    const fillEl = document.getElementById("sp-progress-fill");

    if (curEl) curEl.textContent = ytFmt(cur);
    if (dur > 0) {
      if (totEl) totEl.textContent = ytFmt(dur);
      if (fillEl) fillEl.style.width = (cur / dur) * 100 + "%";
    } else {
      if (totEl) totEl.textContent = "LIVE";
      if (fillEl) fillEl.style.width = "100%";
    }
  }
}

function onYtStateChange(event) {
  const playBtn = document.getElementById("sp-play");
  if (!playBtn) return;
  if (event.data === YT.PlayerState.PLAYING) {
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    clearInterval(ytProgressTimer);
    ytProgressTimer = setInterval(ytSyncProgress, 1000);
  } else {
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    clearInterval(ytProgressTimer);
  }
  if (event.data === YT.PlayerState.ENDED) {
    ytNext();
  }
}

function ytNext() {
  if (!ytIsReady) return;
  ytCur = (ytCur + 1) % ytTracks.length;
  const vId = extractYtId(
    ytTracks[ytCur].url || ytTracks[ytCur].link || ytTracks[ytCur].id,
  );
  ytPlayerObj.loadVideoById(vId);
  ytPlayerObj.playVideo();
  updateYtUI();
}

function ytPrev() {
  if (!ytIsReady) return;
  ytCur = (ytCur - 1 + ytTracks.length) % ytTracks.length;
  const vId = extractYtId(
    ytTracks[ytCur].url || ytTracks[ytCur].link || ytTracks[ytCur].id,
  );
  ytPlayerObj.loadVideoById(vId);
  ytPlayerObj.playVideo();
  updateYtUI();
}

function ytTogglePlay() {
  if (!ytIsReady) return;
  const state = ytPlayerObj.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    ytPlayerObj.pauseVideo();
  } else {
    ytPlayerObj.playVideo();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const playBtnEl = document.getElementById("sp-play");
  if (playBtnEl) playBtnEl.addEventListener("click", ytTogglePlay);
  const nextBtnEl = document.getElementById("sp-next");
  if (nextBtnEl) nextBtnEl.addEventListener("click", ytNext);
  const prevBtnEl = document.getElementById("sp-prev");
  if (prevBtnEl) prevBtnEl.addEventListener("click", ytPrev);

  const seekBarEl = document.getElementById("sp-seek-bar");
  if (seekBarEl) {
    seekBarEl.addEventListener("click", (e) => {
      if (!ytIsReady || !ytPlayerObj.getDuration) return;
      const dur = ytPlayerObj.getDuration();
      if (dur <= 0) return;
      const rect = seekBarEl.getBoundingClientRect();
      const perc = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      ytPlayerObj.seekTo(perc * dur, true);
      const fillEl = document.getElementById("sp-progress-fill");
      if (fillEl) fillEl.style.width = perc * 100 + "%";
    });
  }
});

/* ── 19. TOOLS: POMODORO TIMER ── */
let pomoT = 25 * 60;
let pomoTimer = null;
let pomoRunning = false;
let pomoCurrentMode = 25;

function updatePomoDisplay() {
  const m = Math.floor(pomoT / 60)
    .toString()
    .padStart(2, "0");
  const s = (pomoT % 60).toString().padStart(2, "0");
  const dM = document.getElementById("pomoMin");
  const dS = document.getElementById("pomoSec");
  if (dM) dM.textContent = m;
  if (dS) dS.textContent = s;
}

window.setPomoMode = function (min, btn) {
  if (pomoRunning) return window.showToast("Stop timer dulu!");
  document
    .querySelectorAll(".pomo-mode-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  pomoCurrentMode = min;
  pomoT = min * 60;
  updatePomoDisplay();
};

document.addEventListener("DOMContentLoaded", () => {
  const btnStart = document.getElementById("pomoStart");
  const btnReset = document.getElementById("pomoReset");

  if (btnStart) {
    btnStart.addEventListener("click", () => {
      if (pomoRunning) {
        clearInterval(pomoTimer);
        pomoRunning = false;
        btnStart.innerHTML = '<i class="fa-solid fa-play"></i> Mulai';
      } else {
        pomoRunning = true;
        btnStart.innerHTML = '<i class="fa-solid fa-pause"></i> Jeda';
        pomoTimer = setInterval(() => {
          if (pomoT > 0) {
            pomoT--;
            updatePomoDisplay();
          } else {
            clearInterval(pomoTimer);
            pomoRunning = false;
            btnStart.innerHTML = '<i class="fa-solid fa-play"></i> Mulai';
            if (window.showToast) window.showToast("Waktu habis!");
            const a = new Audio(
              "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
            );
            a.volume = 0.5;
            a.play().catch((e) => {});
          }
        }, 1000);
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      clearInterval(pomoTimer);
      pomoRunning = false;
      if (btnStart)
        btnStart.innerHTML = '<i class="fa-solid fa-play"></i> Mulai';
      pomoT = pomoCurrentMode * 60;
      updatePomoDisplay();
    });
  }

  /* ── 20. TOOLS: QUICK NOTES ── */
  const notesTa = document.getElementById("quickNotes");
  if (notesTa) {
    const saved = localStorage.getItem("mx_quicknotes");
    if (saved) notesTa.value = saved;
    let saveTimeout = null;
    notesTa.addEventListener("input", () => {
      const status = document.getElementById("notesStatus");
      if (status)
        status.innerHTML = '<i class="fa-solid fa-pen"></i> Mengetik...';
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        localStorage.setItem("mx_quicknotes", notesTa.value);
        if (status)
          status.innerHTML = '<i class="fa-solid fa-check"></i> Tersimpan';
      }, 800);
    });
  }

  window.clearNotes = function () {
    if (confirm("Hapus semua catatan?")) {
      const ta = document.getElementById("quickNotes");
      if (ta) {
        ta.value = "";
        localStorage.removeItem("mx_quicknotes");
        const status = document.getElementById("notesStatus");
        if (status)
          status.innerHTML = '<i class="fa-solid fa-check"></i> Kosong';
      }
    }
  };

  /* ── 21. TOOLS: GITHUB FETCH ── */
  window.fetchGithubRepos = async function (username) {
    const list = document.getElementById("ghReposList");
    if (!list) return;
    list.innerHTML =
      '<div style="color:var(--sub);font-size:12px;grid-column:1/-1"><i class="fa-solid fa-spinner fa-spin"></i> Memuat repositori...</div>';
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      if (data.length === 0) {
        list.innerHTML =
          '<div style="color:var(--sub);font-size:12px;grid-column:1/-1">Tidak ada repositori publik.</div>';
        return;
      }
      list.innerHTML = data
        .map(
          (repo) => `
        <a href="${repo.html_url}" target="_blank" style="display:flex; flex-direction:column; padding:16px; background:rgba(0,0,0,0.2); border:1px solid var(--border2); border-radius:12px; text-decoration:none; transition:.2s" onmouseover="this.style.borderColor='var(--accent)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--border2)'; this.style.transform='none'">
          <div style="color:var(--accent); font-weight:700; font-size:15px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:flex-start">
            <span style="word-break:break-all"><i class="fa-brands fa-github"></i> ${repo.name}</span>
            <span style="font-size:10px; color:var(--text); background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:12px; border: 1px solid rgba(255,255,255,0.1)">${repo.visibility}</span>
          </div>
          <div style="color:var(--sub); flex:1; font-size:12px; margin-bottom:12px; line-height:1.5">${repo.description || "Tidak ada deskripsi"}</div>
          <div style="display:flex; gap:12px; font-size:11px; color:var(--sub); align-items:center; border-top: 1px solid var(--border2); padding-top: 12px; margin-top: auto">
            ${repo.language ? `<span style="display:flex; align-items:center; gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:var(--accent)"></div> ${repo.language}</span>` : ""}
            <span><i class="fa-regular fa-star" style="color:gold"></i> ${repo.stargazers_count}</span>
            <span><i class="fa-code-fork" style="font-family:'FontAwesome'"></i> ${repo.forks_count}</span>
          </div>
        </a>
      `,
        )
        .join("");
    } catch (err) {
      list.innerHTML =
        '<div style="color:#ff4a4a;font-size:12px;grid-column:1/-1"><i class="fa-solid fa-circle-exclamation"></i> Gagal memuat repositori GitHub.</div>';
    }
  };

  // Auto fetch
  setTimeout(() => {
    if (window.fetchGithubRepos) window.fetchGithubRepos("maddazxd");
  }, 1000);
});
