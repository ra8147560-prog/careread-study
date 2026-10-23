/* CareRead study app. Flow:
   start (researcher) > scenario > fixation > report > fixation > consultation (typing, then reply) > decision > done.
   Every screen change also changes location.hash so eye-tracking software can segment the recording by URL. */
(function () {
  "use strict";
  const CFG = window.CAREREAD_CONFIG || {};
  const ALL = window.CAREREAD_TEXT;
  const COND = window.CAREREAD_COND || { code: "s1", identity: "ai", style: "task" };
  const params = new URLSearchParams(location.search);
  let lang = params.get("lang") === "en" ? "en" : "zh";
  let T = ALL[lang];

  const ICON = {
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9-9.5C1.6 7.9 4 4.5 7.5 4.5c2 0 3.4 1.1 4.5 2.6 1.1-1.5 2.5-2.6 4.5-2.6 3.5 0 5.9 3.4 4.5 7C19 16.5 12 21 12 21z"/><path d="M7 12h3l1.5-2.5 2 5L15 12h2"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9-9.5C1.6 7.9 4 4.5 7.5 4.5c2 0 3.4 1.1 4.5 2.6 1.1-1.5 2.5-2.6 4.5-2.6 3.5 0 5.9 3.4 4.5 7C19 16.5 12 21 12 21z"/></svg>',
    clinic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M12 9v6M9 12h6"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9z"/><path d="M19 15l.9 2.1 2.1.9-2.1.9L19 21l-.9-2.1-2.1-.9 2.1-.9z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>'
  };

  const $ = (s, r = document) => r.querySelector(s);
  const stage = $("#stage");
  const rec = {
    sessionId: (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)).toUpperCase(),
    participantId: "", condition: COND.code, identity: COND.identity, style: COND.style, lang,
    startedAt: "", screens: [], decision: "", decisionTimeMs: null, replyShownAt: null,
    screenWidth: screen.width, screenHeight: screen.height, viewport: innerWidth + "x" + innerHeight,
    userAgent: navigator.userAgent
  };
  const t0 = performance.now();
  const now = () => Math.round(performance.now() - t0);

  /* ---------- scaling ---------- */
  function fit() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = "scale(" + s + ")";
  }
  addEventListener("resize", fit); fit();
  if (params.get("aoi") === "1") stage.classList.add("aoi-on");

  /* ---------- helpers ---------- */
  function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id));
    history.replaceState(null, "", location.pathname + location.search + "#" + id);
    rec.screens.push({ screen: id, tMs: now(), at: new Date().toISOString() });
  }
  function unlockAfter(btn, hintEl, sec, waitText) {
    btn.disabled = true; if (hintEl) hintEl.textContent = waitText;
    setTimeout(() => { btn.disabled = false; if (hintEl) hintEl.textContent = ""; }, sec * 1000);
  }
  function appbar() {
    return '<header class="appbar"><div class="logo">' + ICON.logo + '</div><span class="app-name">' + T.appName +
      '</span><span class="app-tag">' + T.appTag + '</span><span class="caring">' + ICON.heart + T.caringFor + '</span></header>';
  }
  function markup(s) {
    return s.replace(/\{C\}/g, '<span data-aoi="AOI-A1 conclusion">').replace(/\{\/C\}/g, "</span>")
      .replace(/\{I\}/g, '<span data-aoi="AOI-A2 information">').replace(/\{\/I\}/g, "</span>")
      .replace(/\{S\}/g, '<span data-aoi="AOI-A3 social">').replace(/\{\/S\}/g, "</span>");
  }
  function reportCard() {
    const R = T.report;
    const rows = T.rows.map(([n, u, ref, v, hi]) =>
      '<tr class="' + (hi ? "high" : "") + '"><td>' + n + '</td><td class="num"' + (hi ? ' data-aoi="AOI-C critical"' : "") + ">" + v +
      '<span class="unit">' + u + '</span></td><td class="ref">' + ref + "</td><td>" + (hi ? '<span class="flag">' + R.flagHigh + "</span>" : "") + "</td></tr>").join("");
    return '<section class="card report" data-aoi="AOI-R report"><div class="rep-top"><div><div class="rep-title">' + R.title +
      '</div><div class="rep-clinic">' + ICON.clinic + R.clinic + '</div></div><div class="rep-patient">' + R.patient.join("<br>") +
      '</div></div><table class="lab"><thead><tr>' + R.cols.map(c => "<th>" + c + "</th>").join("") + "</tr></thead><tbody>" + rows +
      '</tbody></table><div class="rep-note">' + ICON.note + R.note + "</div></section>";
  }
  function avatar(id) {
    const a = T.advisors[id];
    if (id === "ai") return '<div class="avatar ai">' + ICON.spark + "</div>";
    if (id === "hyb") return '<div class="avatar hyb">' + a.badge + '<span class="mini">' + ICON.spark + "</span></div>";
    return '<div class="avatar doc">' + a.badge + "</div>";
  }

  /* ---------- build screens ---------- */
  function build() {
    T = ALL[lang]; rec.lang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    const A = T.advisors[COND.identity];
    stage.innerHTML =
      /* start */
      '<section class="screen" id="start">' + appbar() +
      '<div class="lang"><button id="l-zh" aria-pressed="' + (lang === "zh") + '">中文</button><button id="l-en" aria-pressed="' + (lang === "en") + '">English</button></div>' +
      '<div class="center"><div class="panel"><h1>' + T.start.title + '</h1><div class="field"><label for="pid">' + T.start.pidLabel +
      '</label><input id="pid" autocomplete="off" placeholder="' + T.start.pidPlaceholder + '"></div><div class="err" id="pid-err"></div><p class="hint">' +
      T.start.note + '</p><div class="cond-chip">Condition ' + COND.code.toUpperCase() + '</div><div class="row-end"><button class="btn" id="go">' + T.start.startBtn + "</button></div></div></div></section>" +
      /* scenario */
      '<section class="screen" id="scenario">' + appbar() + '<div class="center"><div class="panel"><h1>' + T.scenario.title + "</h1>" +
      T.scenario.body.map(p => "<p>" + p + "</p>").join("") + '<div class="row-end"><span class="hint" id="sc-hint"></span><button class="btn" id="sc-next">' +
      T.scenario.cont + "</button></div></div></div></section>" +
      /* fixation 1 and 2 */
      '<section class="screen" id="fixation1"><div class="fix"><span>+</span><small>' + T.fixation + "</small></div></section>" +
      '<section class="screen" id="fixation2"><div class="fix"><span>+</span><small>' + T.fixation + "</small></div></section>" +
      /* report only */
      '<section class="screen report-only" id="report">' + appbar() + '<div class="work">' + reportCard() + '</div><div class="bottom"><span class="q" id="rp-hint"></span><button class="btn" id="rp-next">' +
      T.report.cont + "</button></div></section>" +
      /* consultation */
      '<section class="screen" id="consult">' + appbar() + '<div class="work">' + reportCard() +
      '<section class="card chat"><div class="chat-head"><span class="dot"></span>' + T.appName + '</div>' +
      '<div class="bubble user"><div class="file">' + ICON.file + T.chat.uploaded + "</div><div>" + T.chat.user + "</div></div>" +
      '<div class="adv"><div data-aoi="AOI-ID identity">' + avatar(COND.identity) + '</div><div class="adv-body"><div class="adv-name" data-aoi="AOI-ID identity">' + A.name +
      '<span class="adv-role">' + A.role + '</span></div><div id="typing" class="typing"><span class="dots"><i></i><i></i><i></i></span>' + T.chat.typing +
      '</div><div id="reply" hidden><div class="bubble adv-msg">' + T.reply[COND.style].map(p => "<p>" + markup(p) + "</p>").join("") +
      '</div><div class="disclosure" data-aoi="AOI-DISC disclosure">' + ICON.info + A.disclosure + "</div></div></div></div></section></div>" +
      '<div class="bottom" data-aoi="AOI-D decision"><span class="q">' + T.decision.q + '</span><span class="hint" id="dc-hint"></span><button class="btn ghost" id="d-check" disabled>' +
      T.decision.check + '</button><button class="btn" id="d-follow" disabled>' + T.decision.follow + "</button></div></section>" +
      /* done */
      '<section class="screen" id="done">' + appbar() + '<div class="center"><div class="panel"><h1>' + T.done.title + "</h1><p>" + T.done.body +
      '</p><p class="hint" id="save-status">' + T.done.saving + '</p><div class="row-end"><button class="btn" id="to-form">' + T.done.btn + "</button></div></div></div></section>";
    wire();
  }

  /* ---------- wiring ---------- */
  function wire() {
    $("#l-zh").onclick = () => { lang = "zh"; build(); show("start"); };
    $("#l-en").onclick = () => { lang = "en"; build(); show("start"); };
    $("#go").onclick = () => {
      const pid = $("#pid").value.trim();
      if (!pid) { $("#pid-err").textContent = T.start.pidError; $("#pid").focus(); return; }
      rec.participantId = pid; rec.startedAt = new Date().toISOString();
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
      show("scenario"); unlockAfter($("#sc-next"), $("#sc-hint"), CFG.minScenarioSeconds || 8, T.scenario.wait);
    };
    $("#pid").addEventListener("keydown", e => { if (e.key === "Enter") $("#go").click(); });
    $("#sc-next").onclick = () => fixation("fixation1", () => {
      show("report"); unlockAfter($("#rp-next"), $("#rp-hint"), CFG.minReportSeconds || 10, T.report.wait);
    });
    $("#rp-next").onclick = () => fixation("fixation2", startConsult);
    $("#d-follow").onclick = () => decide("follow_plan");
    $("#d-check").onclick = () => decide("check_with_professional");
    $("#to-form").onclick = toForm;
  }
  function fixation(id, next) { show(id); setTimeout(next, (CFG.fixationSeconds || 2) * 1000); }
  function startConsult() {
    show("consult");
    rec.screens.push({ screen: "consult-typing", tMs: now(), at: new Date().toISOString() });
    setTimeout(() => {
      $("#typing").hidden = true; $("#reply").hidden = false;
      rec.replyShownAt = now();
      history.replaceState(null, "", location.pathname + location.search + "#consult-reply");
      rec.screens.push({ screen: "consult-reply", tMs: rec.replyShownAt, at: new Date().toISOString() });
      $("#dc-hint").textContent = T.decision.wait;
      setTimeout(() => { $("#d-follow").disabled = false; $("#d-check").disabled = false; $("#dc-hint").textContent = ""; }, (CFG.decisionUnlockSeconds || 5) * 1000);
    }, (CFG.typingSeconds || 3) * 1000);
  }
  function decide(choice) {
    rec.decision = choice;
    rec.decisionTimeMs = now() - rec.replyShownAt;
    show("done");
    save();
    setTimeout(toForm, (CFG.redirectSeconds || 4) * 1000);
  }

  /* ---------- data ---------- */
  function flat() {
    const durations = {};
    rec.screens.forEach((s, i) => { const nx = rec.screens[i + 1]; if (nx) durations[s.screen] = (durations[s.screen] || 0) + (nx.tMs - s.tMs); });
    return {
      sessionId: rec.sessionId, participantId: rec.participantId, condition: rec.condition, identity: rec.identity, style: rec.style, lang: rec.lang,
      startedAt: rec.startedAt, finishedAt: new Date().toISOString(), decision: rec.decision, decisionTimeMs: rec.decisionTimeMs,
      scenarioMs: durations["scenario"] || "", reportMs: durations["report"] || "", consultTypingMs: durations["consult-typing"] || "",
      consultReplyMs: durations["consult-reply"] || "", screenLog: JSON.stringify(rec.screens),
      screen: rec.screenWidth + "x" + rec.screenHeight, viewport: rec.viewport, userAgent: rec.userAgent
    };
  }
  function backup(row, status) {
    try {
      const k = "careread_records"; const all = JSON.parse(localStorage.getItem(k) || "[]");
      const i = all.findIndex(r => r.sessionId === row.sessionId);
      const item = Object.assign({}, row, { uploadStatus: status });
      if (i >= 0) all[i] = item; else all.push(item);
      localStorage.setItem(k, JSON.stringify(all));
    } catch (e) { /* storage unavailable: data still sent online */ }
  }
  function save() {
    const row = flat(); backup(row, "pending");
    const st = $("#save-status");
    if (!CFG.sheetEndpoint) { st.textContent = T.done.offline; return; }
    fetch(CFG.sheetEndpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(row) })
      .then(() => { backup(row, "sent"); st.textContent = T.done.saved; })
      .catch(() => { st.textContent = T.done.offline; });
  }
  function toForm() {
    if (!CFG.formUrl) { $("#save-status").textContent = T.done.noForm; return; }
    const u = new URL(CFG.formUrl);
    u.searchParams.set("usp", "pp_url");
    if (CFG.formEntryParticipant) u.searchParams.set(CFG.formEntryParticipant, rec.participantId);
    if (CFG.formEntryCondition) u.searchParams.set(CFG.formEntryCondition, rec.condition);
    location.href = u.toString();
  }

  build(); show("start");
})();
