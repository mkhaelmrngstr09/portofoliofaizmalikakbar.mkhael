(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const toast = $("#toast");
  let toastTimer;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  // Theme toggle; save preference only when browser storage is available.
  const savedTheme = (() => { try { return localStorage.getItem("mkhael-theme"); } catch { return null; } })();
  if (savedTheme === "light") document.documentElement.dataset.theme = "light";
  function updateThemeButton() {
    const light = document.documentElement.dataset.theme === "light";
    $("#themeIcon").textContent = light ? "☾" : "☼";
    $("#themeToggle").setAttribute("aria-label", light ? "Aktifkan mode gelap" : "Aktifkan mode terang");
  }
  updateThemeButton();
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    if (next === "dark") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = "light";
    try { localStorage.setItem("mkhael-theme", next); } catch {}
    updateThemeButton();
    notify(`Mode ${next === "light" ? "terang" : "gelap"} aktif`);
  });

  // Mobile navigation.
  const nav = $("#nav");
  $("#menuToggle").addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    $("#menuToggle").setAttribute("aria-expanded", String(open));
  });
  $$("#nav a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
  }));

  // Pointer-controlled 3D cube (CSS transform stays local to the cube).
  const core = $("#core3d"), cube = $(".core-cube", core);
  let dragging = false, startX = 0, startY = 0, rotX = -15, rotY = -25;
  core.addEventListener("pointerdown", e => {
    dragging = true; startX = e.clientX; startY = e.clientY;
    core.setPointerCapture?.(e.pointerId);
    cube.style.animation = "none";
  });
  core.addEventListener("pointermove", e => {
    if (!dragging) return;
    rotY += (e.clientX - startX) * .8; rotX -= (e.clientY - startY) * .8;
    startX = e.clientX; startY = e.clientY;
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  const stopDrag = () => { dragging = false; };
  core.addEventListener("pointerup", stopDrag);
  core.addEventListener("pointercancel", stopDrag);
  core.addEventListener("click", () => {
    if (Math.abs(rotX) < 25 && Math.abs(rotY + 25) < 25) { rotX += 30; rotY += 45; }
    cube.style.animation = "none";
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  core.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); rotY += 45; cube.style.animation = "none"; cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`; }
  });

  // Project filtering and accessible detail modal.
  const projectDetails = {
    mkhael: {type:"WEB EXPERIENCE · 01", title:"MKHAEL Web Portal", desc:"Portal digital yang menyatukan identitas, karya, dan eksperimen. Gunakan proyek ini untuk menautkan website utama, halaman profil, dan demo yang sudah dipublikasikan.", tags:["HTML","CSS","JavaScript","Responsive UI"]},
    logic: {type:"INTERACTIVE CONCEPT · 02", title:"Logic Arena", desc:"Konsep permainan tantangan logika dengan level, streak, progres, dan pengalaman multiplayer. Tambahkan tautan demo ketika prototipe sudah tersedia.", tags:["Game Logic","UI/UX","Prototype"]},
    empire: {type:"GAME CONCEPT · 03", title:"Empire Zero", desc:"Konsep permainan strategi dan ekonomi. Pemain membuat keputusan terkait sumber daya, properti, dan perkembangan wilayah.", tags:["Game Design","Economy","3D Concept"]},
    ruana: {type:"SYSTEM CONCEPT · 04", title:"Ruana OS", desc:"Eksplorasi antarmuka sistem operasi konseptual dengan terminal, panel, dan bahasa visual minimalis.", tags:["Interface","Concept","Terminal"]}
  };
  const modal = $("#projectModal");
  function openProject(key) {
    const p = projectDetails[key]; if (!p) return;
    $("#modalType").textContent = p.type; $("#modalTitle").textContent = p.title; $("#modalDesc").textContent = p.desc;
    $("#modalTags").replaceChildren(...p.tags.map(tag => { const el = document.createElement("span"); el.textContent = tag; return el; }));
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; $("#modalClose").focus();
  }
  function closeProject() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  $$(".project-card").forEach(card => {
    card.addEventListener("click", () => openProject(card.dataset.project));
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProject(card.dataset.project); } });
  });
  $("#modalClose").addEventListener("click", closeProject);
  $("#modalDone").addEventListener("click", closeProject);
  modal.addEventListener("click", e => { if (e.target.dataset.close === "true") closeProject(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) closeProject(); else if (e.key === "Escape" && photoLightbox?.classList.contains("open")) closePhoto(); });
  $$(".filter").forEach(button => button.addEventListener("click", () => {
    $$(".filter").forEach(b => b.classList.toggle("active", b === button));
    $$(".project-card").forEach(card => card.classList.toggle("hidden", button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter));
  }));

  // Simulated local terminal: commands do not run on the computer/server.
  const output = $("#terminalOutput"), input = $("#terminalInput");
  const commands = {
    help: () => ["Perintah yang tersedia:", "  help       — tampilkan bantuan", "  about      — tentang MKHAEL", "  projects   — daftar proyek", "  skills     — bidang yang dieksplorasi", "  date       — tanggal lokal perangkat", "  contact    — info kontak", "  clear      — bersihkan layar", "  theme      — ganti tema tampilan", "  whoami     — identitas sesi", "Catatan: terminal ini simulasi browser, bukan shell sungguhan."],
    about: () => ["MKHAEL / Digital Portfolio", "Kreator digital yang mengeksplorasi web, teknologi, dan ide kreatif.", "Prinsip: curious → build → iterate."],
    projects: () => ["PROJECT INDEX", "01  MKHAEL Web Portal   [WEB]", "02  Logic Arena         [CONCEPT]", "03  Empire Zero         [GAME]", "04  Ruana OS            [SYSTEM CONCEPT]", "Ketik 'projects' hanya menampilkan daftar contoh di portofolio."],
    skills: () => ["AREAS OF EXPLORATION", "HTML & CSS          / BUILDING", "JavaScript          / LEARNING", "UI / UX Design      / EXPLORING", "Creative Technology / EXPLORING"],
    date: () => [`Tanggal perangkat: ${new Date().toLocaleString("id-ID")}`],
    contact: () => ["CONTACT CHANNEL", "Email contoh: hello@mkhael.dev", "Edit alamat email ini di index.html sebelum dipublikasikan."],
    whoami: () => ["guest@mkhael-portfolio", "Access level: public visitor", "Environment: client-side demo"],
    clear: () => { output.replaceChildren(); return []; },
    theme: () => { $("#themeToggle").click(); return ["Tema tampilan telah diganti."]; }
  };
  function addTerminalLine(text, className = "") {
    const p = document.createElement("p"); p.textContent = text; if (className) p.className = className; output.appendChild(p);
  }
  $("#terminalForm").addEventListener("submit", e => {
    e.preventDefault();
    const raw = input.value.trim(); if (!raw) return;
    addTerminalLine(`guest@mkhael:~$ ${raw}`, "term-cyan");
    const cmd = raw.toLowerCase().split(/\s+/)[0];
    if (commands[cmd]) commands[cmd]().forEach((line, i) => addTerminalLine(line, i === 0 ? "term-green" : ""));
    else if (cmd === "sudo" || cmd === "rm") addTerminalLine("Akses ditolak. Ini hanya simulasi terminal portofolio.", "term-error");
    else addTerminalLine(`Perintah '${cmd}' tidak dikenal. Ketik 'help' untuk bantuan.`, "term-error");
    output.scrollTop = output.scrollHeight; input.value = ""; input.focus();
  });
  $("#clearTerminal").addEventListener("click", () => { output.replaceChildren(); addTerminalLine("Layar dibersihkan. Ketik 'help' untuk daftar perintah.", "term-muted"); input.focus(); });

  // Optional ambient synth sound generated locally with Web Audio; starts only after user click.
  let audioContext = null, oscillator = null, gain = null, musicOn = false;
  $("#musicToggle").addEventListener("click", async () => {
    const button = $("#musicToggle");
    if (musicOn) {
      try { gain?.gain.setTargetAtTime(0, audioContext.currentTime, .08); } catch {}
      oscillator?.stop(); oscillator = null; gain = null; musicOn = false;
      button.setAttribute("aria-pressed", "false"); button.lastChild.textContent = " Musik: OFF"; notify("Musik latar dimatikan"); return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) throw new Error("Web Audio tidak didukung browser ini");
      audioContext = audioContext || new AudioCtx();
      await audioContext.resume();
      oscillator = audioContext.createOscillator(); gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 420;
      oscillator.type = "sine"; oscillator.frequency.value = 110;
      gain.gain.value = 0.018; oscillator.connect(filter); filter.connect(gain); gain.connect(audioContext.destination); oscillator.start();
      musicOn = true; button.setAttribute("aria-pressed", "true"); button.lastChild.textContent = " Musik: ON"; notify("Ambient tone aktif — klik lagi untuk mematikan");
    } catch (err) { notify("Audio tidak tersedia di browser ini"); }
  });


  // Photo lightbox for the personal journey gallery.
  const photoLightbox = $("#photoLightbox");
  function openPhoto(button) {
    $("#lightboxImage").src = button.dataset.photo;
    $("#lightboxImage").alt = button.querySelector("img")?.alt || "";
    $("#lightboxCaption").textContent = button.dataset.caption || "";
    photoLightbox.classList.add("open");
    photoLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#photoLightboxClose").focus();
  }
  function closePhoto() {
    photoLightbox.classList.remove("open");
    photoLightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    $("#lightboxImage").src = "";
  }
  $$(".journey-photo").forEach(button => button.addEventListener("click", () => openPhoto(button)));
  $("#photoLightboxClose")?.addEventListener("click", closePhoto);
  photoLightbox?.addEventListener("click", e => { if (e.target.dataset.photoClose === "true") closePhoto(); });

  // Reveal animations and footer date.
  $("#year").textContent = new Date().getFullYear();
  const revealTargets = $$(".section-head,.about-grid,.stat-grid,.work-intro,.filter-row,.project-card,.skills-grid,.terminal-layout,.contact-card");
  revealTargets.forEach(el => el.classList.add("reveal"));
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), {threshold: .08});
    revealTargets.forEach(el => observer.observe(el));
  } else revealTargets.forEach(el => el.classList.add("visible"));
})();