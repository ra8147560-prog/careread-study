/* CareRead study app.
   Flow: start (researcher) > scenario > fixation1 > report > fixation2 > advisor introduction >
         turn 1 > turn 2 > turn 3 with decision > done > questionnaire.
   Each turn: the participant's question, a condition-specific typing status, then the reply.
   Every screen change updates location.hash (#scenario, #report, #advisor, #t1-typing, #t1, ...,
   #t3-decision, #done) so the eye-tracking recording can be segmented by URL, and the position
   of every area of interest (data-aoi) is logged in 1920 x 1080 stage pixels. */
(function () {
  "use strict";
  const CFG = Object.assign({
    minScenarioSeconds: 10, minReportSeconds: 12, fixationSeconds: 2, advisorSeconds: 6,
    typingSeconds: 3, minReplySeconds: 8, decisionUnlockSeconds: 8, redirectSeconds: 4
  }, window.CAREREAD_CONFIG || {});
  const ALL = window.CAREREAD_TEXT;
  const COND = window.CAREREAD_COND || { code: "s1", identity: "ai", style: "task" };
  const params = new URLSearchParams(location.search);
  let lang = params.get("lang") === "en" ? "en" : "zh";
  let T = ALL[lang];

  /* ---------- icons ---------- */
  const I = {
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9-9.5C1.6 7.9 4 4.5 7.5 4.5c2 0 3.4 1.1 4.5 2.6 1.1-1.5 2.5-2.6 4.5-2.6 3.5 0 5.9 3.4 4.5 7C19 16.5 12 21 12 21z"/><path d="M7 12h3l1.5-2.5 2 5L15 12h2"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9-9.5C1.6 7.9 4 4.5 7.5 4.5c2 0 3.4 1.1 4.5 2.6 1.1-1.5 2.5-2.6 4.5-2.6 3.5 0 5.9 3.4 4.5 7C19 16.5 12 21 12 21z"/></svg>',
    clinic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M12 9v6M9 12h6"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9z"/><path d="M19 15l.9 2.1 2.1.9-2.1.9L19 21l-.9-2.1-2.1-.9 2.1-.9z"/></svg>',
    steth: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>'
  };

  /* Original illustrations (no external images): a family physician and an AI assistant. */
  const DOC_SVG = '<svg viewBox="0 0 120 120" aria-hidden="true">' +
    '<rect width="120" height="120" fill="#d7efe8"/>' +
    '<path d="M6 124C8 99 29 88 60 86c31 2 52 13 54 38z" fill="#fff"/>' +
    '<path d="M47 87l13 21 13-21z" fill="#3a9a8c"/>' +
    '<path d="M51 69h18v15c-3 6-15 6-18 0z" fill="#e9b48d"/>' +
    '<path d="M46 87l14 23-8 14H34c2-21 6-31 12-37z" fill="#eef3f6"/>' +
    '<path d="M74 87l-14 23 8 14h18c-2-21-6-31-12-37z" fill="#eef3f6"/>' +
    '<path d="M45 90c-5 12-1 22 9 24" stroke="#4f5f6d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M75 90c5 10 3 16-3 20" stroke="#4f5f6d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<circle cx="71" cy="112" r="5.5" fill="#4f5f6d"/><circle cx="71" cy="112" r="2.6" fill="#cfd8de"/>' +
    '<rect x="84" y="102" width="13" height="3.4" rx="1.7" fill="#3b8fd9"/>' +
    '<ellipse cx="38" cy="52" rx="5" ry="7" fill="#f0c19c"/><ellipse cx="82" cy="52" rx="5" ry="7" fill="#f0c19c"/>' +
    '<ellipse cx="60" cy="50" rx="22" ry="25" fill="#f6cfac"/>' +
    '<path d="M37 49c-3-19 9-28 24-28 15 0 26 9 22 28-2-8-7-12-14-14-8 6-21 8-32 7z" fill="#2a2d31"/>' +
    '<path d="M48 45q5-3 10 0M62 45q5-3 10 0" stroke="#2a2d31" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
    '<circle cx="53" cy="51.5" r="2.5" fill="#2a2d31"/><circle cx="67" cy="51.5" r="2.5" fill="#2a2d31"/>' +
    '<path d="M60 54q-2.5 5 1 6" stroke="#d99a76" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
    '<circle cx="47" cy="60" r="3.6" fill="#f3a98f" opacity=".45"/><circle cx="73" cy="60" r="3.6" fill="#f3a98f" opacity=".45"/>' +
    '<path d="M53 63.5q7 6 14 0" stroke="#b85f4a" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
  const AI_SVG = '<svg viewBox="0 0 120 120" aria-hidden="true">' +
    '<path d="M28 124c2-21 15-31 32-31s30 10 32 31z" fill="rgba(255,255,255,.88)"/>' +
    '<line x1="60" y1="38" x2="60" y2="27" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>' +
    '<circle cx="60" cy="23" r="5.4" fill="#ffe08a"/>' +
    '<rect x="23" y="53" width="7" height="17" rx="3.5" fill="#fff"/><rect x="90" y="53" width="7" height="17" rx="3.5" fill="#fff"/>' +
    '<rect x="29" y="37" width="62" height="49" rx="17" fill="#fff"/>' +
    '<rect x="36" y="45" width="48" height="33" rx="11" fill="#14385e"/>' +
    '<rect x="45" y="53" width="8" height="12" rx="4" fill="#6ee7d8"/><rect x="67" y="53" width="8" height="12" rx="4" fill="#6ee7d8"/>' +
    '<path d="M53 70q7 4.5 14 0" stroke="#6ee7d8" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
    '<path d="M95 14l2.2 6.2 6.2 2.2-6.2 2.2L95 31l-2.2-6.4-6.2-2.2 6.2-2.2z" fill="#fff"/></svg>';

  const $ = (s, r = document) => r.querySelector(s);
  const stage = $("#stage");
  const rec = {
    sessionId: (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)).toUpperCase(),
    participantId: "", condition: COND.code, identity: COND.identity, style: COND.style, lang,
    startedAt: "", screens: [], aoi: {}, decision: "", decisionTimeMs: null, t3ShownAt: null,
    screenWidth: screen.width, screenHeight: screen.height, viewport: innerWidth + "x" + innerHeight,
    userAgent: navigator.userAgent
  };
  const t0 = performance.now();
  const now = () => Math.round(performance.now() - t0);

  /* ---------- scaling: one fixed 1920 x 1080 stage ---------- */
  let scale = 1;
  function fit() {
    scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    const x = (innerWidth - 1920 * scale) / 2, y = (innerHeight - 1080 * scale) / 2;
    stage.style.transform = "translate(" + x + "px," + y + "px) scale(" + scale + ")";
    rec.viewport = innerWidth + "x" + innerHeight;
  }
  addEventListener("resize", fit); fit();
  if (params.get("aoi") === "1") stage.classList.add("aoi-on");

  /* ---------- logging ---------- */
  function log(name) { rec.screens.push({ screen: name, tMs: now(), at: new Date().toISOString() }); }
  function mark(name) { history.replaceState(null, "", location.pathname + location.search + "#" + name); log(name); }
  function show(id, hashName) {
    document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id));
    mark(hashName || id);
    snap(hashName || id, id);
  }
  /* Record every visible AOI rectangle (stage pixels; equal to screen pixels at 1920 x 1080 full screen). */
  function snap(key, screenId) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const sc = document.getElementById(screenId); if (!sc) return;
      const sr = stage.getBoundingClientRect();
      const list = [];
      sc.querySelectorAll("[data-aoi]").forEach(el => {
        if (!el.offsetParent && el.tagName !== "SPAN") return;
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
        list.push([el.dataset.aoi, Math.round((r.left - sr.left) / scale), Math.round((r.top - sr.top) / scale),
          Math.round(r.width / scale), Math.round(r.height / scale)]);
      });
      rec.aoi[key] = list;
    }));
  }
  function unlockAfter(btns, hintEl, sec, waitText, then) {
    btns.forEach(b => { b.disabled = true; });
    if (hintEl) hintEl.textContent = waitText;
    setTimeout(() => { btns.forEach(b => { b.disabled = false; }); if (hintEl) hintEl.textContent = ""; if (then) then(); }, sec * 1000);
  }

  /* ---------- pieces ---------- */
  function avatar(id, size, aoi) {
    const a = aoi ? ' data-aoi="' + aoi + '"' : "";
    if (id === "ai") return '<div class="av ' + size + ' ai"' + a + ">" + AI_SVG + "</div>";
    if (id === "hyb") return '<div class="av ' + size + ' doc"' + a + ">" + DOC_SVG + '<span class="mini">' + I.spark + "</span></div>";
    return '<div class="av ' + size + ' doc"' + a + ">" + DOC_SVG + "</div>";
  }
  function appbar() {
    return '<header class="appbar"><div class="logo">' + I.logo + '</div><span class="app-name">' + T.appName +
      '</span><span class="app-tag">' + T.appTag + '</span><span class="caring">' + I.heart + T.caringFor + "</span></header>";
  }
  function reportCard() {
    const R = T.report;
    const rows = T.rows.map(([k, n, u, ref, v, hi]) =>
      '<div class="lab-row' + (hi ? " high" : "") + '" data-aoi="AOI-R-' + k + '"><span>' + n + '</span><span class="num">' + v +
      '<span class="unit">' + u + '</span></span><span class="ref">' + ref + "</span><span>" +
      (hi ? '<span class="flag">' + R.flagHigh + "</span>" : "") + "</span></div>").join("");
    return '<section class="card report"><div class="rep-top" data-aoi="AOI-R-HEAD"><div><div class="rep-title">' + R.title +
      '</div><div class="rep-clinic">' + I.clinic + R.clinic + '</div></div><div class="rep-patient">' + R.patient.join("<br>") +
      '</div></div><div class="lab"><div class="lab-row lab-head">' + R.cols.map(c => "<span>" + c + "</span>").join("") + "</div>" + rows +
      '</div><div class="rep-note" data-aoi="AOI-R-NOTE">' + I.note + R.note + "</div></section>";
  }
  function probes(s) {
    let n = 0;
    return s.replace(/\{(P\d)\}(.*?)\{\/P\d\}/g, (m, p, txt) => { n++; return '<span class="probe" data-aoi="PROBE-' + p + "-" + n + '">' + txt + "</span>"; });
  }
  function flowStrip() {
    const A = T.advisors[COND.identity];
    const icons = { ai: ["ai", "send"], hyb: ["ai", "doc", "send"], doc: ["doc", "send"] }[COND.identity];
    return A.flow.map((label, i) => {
      const k = icons[i];
      const ic = k === "ai" ? I.spark : k === "doc" ? I.steth : I.send;
      return (i ? '<span class="arr">→</span>' : "") + '<span class="st"><i class="' + k + '">' + ic + "</i>" + label + "</span>";
    }).join("");
  }
  function chatTop(n) {
    const A = T.advisors[COND.identity];
    return '<div class="chat-top"><div class="chat-id" data-aoi="AOI-ID">' + avatar(COND.identity, "md") +
      '<div><div class="nm">' + A.name + '</div><span class="role">' + A.role + "</span></div></div>" +
      '<span class="turn">' + T.turnLabel.replace("{n}", n) + "</span></div>";
  }
  function turnScreen(n) {
    const A = T.advisors[COND.identity], tn = T.turns[n - 1], sty = tn.sty[COND.style];
    const q = (n === 1 ? '<div class="file">' + I.file + T.uploaded + "</div>" : "") + "<div>" + T.questions[n - 1] + "</div>";
    const bottom = n < 3
      ? '<div class="bottom"><span class="hint" id="t' + n + '-hint"></span><button class="btn next" id="t' + n + '-next" data-aoi="AOI-NEXT" disabled>' +
        T.nextPrefix + T.quote[0] + T.questions[n] + T.quote[1] + "</button></div>"
      : '<div class="bottom" data-aoi="AOI-DEC"><span class="q">' + T.decision.q + '</span><span class="hint" id="dc-hint"></span>' +
        '<button class="btn ghost" id="d-check" disabled>' + T.decision.check + '</button><button class="btn" id="d-follow" disabled>' + T.decision.follow + "</button></div>";
    return '<section class="screen" id="t' + n + '">' + appbar() + '<div class="work">' + reportCard() +
      '<section class="card chat">' + chatTop(n) + '<div class="msgs">' +
      '<div class="bubble user" data-aoi="AOI-Q">' + q + "</div>" +
      '<div class="adv">' + avatar(COND.identity, "sm", "AOI-ID-MSG") + '<div class="adv-body">' +
      '<div class="typing"><span class="dots"><i></i><i></i><i></i></span><span class="st">' + A.typing[0] + "</span></div>" +
      '<div class="reply" hidden><div class="bubble adv-msg">' +
      '<p data-aoi="AOI-STY1">' + sty[0] + "</p>" +
      '<p data-aoi="AOI-INFO">' + probes(tn.info) + "</p>" +
      '<p data-aoi="AOI-PLAN">' + tn.plan + "</p>" +
      '<p data-aoi="AOI-STY2">' + sty[1] + "</p></div>" +
      '<div class="tag" data-aoi="AOI-TAG">' + I.info + A.tag + "</div></div>" +
      "</div></div></div></section></div>" + bottom + "</section>";
  }

  /* ---------- build screens ---------- */
  function build() {
    T = ALL[lang]; rec.lang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    const A = T.advisors[COND.identity], S = T.scenario;
    stage.innerHTML =
      /* start */
      '<section class="screen" id="start">' + appbar() +
      '<div class="lang"><button id="l-zh" aria-pressed="' + (lang === "zh") + '">中文</button><button id="l-en" aria-pressed="' + (lang === "en") + '">English</button></div>' +
      '<div class="center"><div class="panel"><h1>' + T.start.title + '</h1><div class="field"><label for="pid">' + T.start.pidLabel +
      '</label><input id="pid" autocomplete="off" placeholder="' + T.start.pidPlaceholder + '"></div><div class="err" id="pid-err"></div><p class="hint">' +
      T.start.note + '</p><div class="cond-chip">Condition ' + COND.code.toUpperCase() + '</div><div class="row-end"><button class="btn" id="go">' + T.start.startBtn + "</button></div></div></div></section>" +
      /* scenario */
      '<section class="screen" id="scenario">' + appbar() + '<div class="center"><div class="panel wide"><h1>' + S.title + "</h1>" +
      S.body.map(p => "<p>" + p + "</p>").join("") +
      '<div class="steps">' + S.steps.map((s, i) => '<div class="step"><b>' + (i + 1) + "</b>" + s + "</div>").join("") + "</div>" +
      '<p class="note-line">' + S.note + "</p>" +
      '<div class="row-end"><span class="hint" id="sc-hint"></span><button class="btn" id="sc-next">' + S.cont + "</button></div></div></div></section>" +
      /* fixation crosses (pupil baseline) */
      '<section class="screen" id="fixation1"><div class="fix"><span>+</span><small>' + T.fixation + "</small></div></section>" +
      '<section class="screen" id="fixation2"><div class="fix"><span>+</span><small>' + T.fixation + "</small></div></section>" +
      /* report only */
      '<section class="screen report-only" id="report">' + appbar() + '<div class="work">' + reportCard() +
      '</div><div class="bottom"><span class="q">' + T.report.lead + '</span><span class="hint" id="rp-hint"></span><button class="btn" id="rp-next">' +
      T.report.cont + "</button></div></section>" +
      /* advisor introduction: makes the assigned Agent Identity salient */
      '<section class="screen" id="advisor">' + appbar() + '<div class="intro"><div class="intro-card">' +
      '<p class="intro-h">' + T.intro.title + "</p>" +
      avatar(COND.identity, "lg", "AOI-IN-AV") +
      '<div class="intro-main"><div data-aoi="AOI-IN-NAME"><div class="intro-name">' + A.name + '</div><span class="role big">' + A.role + "</span></div>" +
      '<p class="intro-bio" data-aoi="AOI-IN-BIO">' + A.bio + "</p>" +
      '<div class="flow-wrap" data-aoi="AOI-IN-FLOW"><div class="flow-label">' + T.intro.flowLabel + '</div><div class="flow">' + flowStrip() + "</div></div></div>" +
      '<div class="greet">' + avatar(COND.identity, "sm") + '<div class="bubble adv-msg" data-aoi="AOI-IN-GREET">' + T.greeting[COND.style] + "</div></div>" +
      '</div></div><div class="bottom"><span class="q"></span><span class="hint" id="in-hint"></span><button class="btn" id="in-next">' + T.intro.start + "</button></div></section>" +
      /* three conversation turns */
      turnScreen(1) + turnScreen(2) + turnScreen(3) +
      /* done */
      '<section class="screen" id="done">' + appbar() + '<div class="center"><div class="panel"><h1>' + T.done.title + "</h1><p>" + T.done.body +
      '</p><p class="hint" id="save-status">' + T.done.saving + '</p><div class="row-end"><button class="btn" id="to-form">' + T.done.btn + "</button></div></div></div></section>";
    wire();
  }

  /* ---------- wiring ---------- */
  function wire() {
    $("#l-zh").onclick = () => { lang = "zh"; build(); show("start"); };
    $("#l-en").onclick = () => { lang = "en"; build(); show("start"); };
    if (params.get("pid")) $("#pid").value = params.get("pid");
    $("#go").onclick = () => {
      const pid = $("#pid").value.trim();
      if (!pid) { $("#pid-err").textContent = T.start.pidError; $("#pid").focus(); return; }
      rec.participantId = pid; rec.startedAt = new Date().toISOString();
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
      show("scenario"); unlockAfter([$("#sc-next")], $("#sc-hint"), CFG.minScenarioSeconds, T.scenario.wait);
    };
    $("#pid").addEventListener("keydown", e => { if (e.key === "Enter") $("#go").click(); });
    $("#sc-next").onclick = () => fixation("fixation1", () => {
      show("report"); unlockAfter([$("#rp-next")], $("#rp-hint"), CFG.minReportSeconds, T.report.wait);
    });
    $("#rp-next").onclick = () => fixation("fixation2", () => {
      show("advisor"); unlockAfter([$("#in-next")], $("#in-hint"), CFG.advisorSeconds, T.intro.wait);
    });
    $("#in-next").onclick = () => turn(1);
    $("#t1-next").onclick = () => turn(2);
    $("#t2-next").onclick = () => turn(3);
    $("#d-follow").onclick = () => decide("follow_plan");
    $("#d-check").onclick = () => decide("check_with_professional");
    $("#to-form").onclick = toForm;
  }
  function fixation(id, next) { show(id); setTimeout(next, CFG.fixationSeconds * 1000); }
  function turn(n) {
    const id = "t" + n, sc = document.getElementById(id), A = T.advisors[COND.identity];
    const typing = $(".typing", sc), status = $(".st", typing), reply = $(".reply", sc);
    show(id, id + "-typing");
    const total = CFG.typingSeconds * 1000;
    A.typing.forEach((txt, i) => setTimeout(() => { status.textContent = txt; }, i * total / A.typing.length));
    setTimeout(() => {
      typing.hidden = true; reply.hidden = false;
      mark(id); snap(id, id);
      if (n < 3) {
        unlockAfter([$("#" + id + "-next")], $("#" + id + "-hint"), CFG.minReplySeconds, T.replyWait);
      } else {
        rec.t3ShownAt = now();
        unlockAfter([$("#d-follow"), $("#d-check")], $("#dc-hint"), CFG.decisionUnlockSeconds, T.decision.wait, () => mark("t3-decision"));
      }
    }, total);
  }
  function decide(choice) {
    rec.decision = choice;
    rec.decisionTimeMs = now() - rec.t3ShownAt;
    show("done");
    save();
    setTimeout(toForm, CFG.redirectSeconds * 1000);
  }

  /* ---------- data ---------- */
  function flat() {
    const d = {};
    rec.screens.forEach((s, i) => { const nx = rec.screens[i + 1]; if (nx) d[s.screen] = (d[s.screen] || 0) + (nx.tMs - s.tMs); });
    const v = k => d[k] || "";
    return {
      sessionId: rec.sessionId, participantId: rec.participantId, condition: rec.condition, identity: rec.identity, style: rec.style, lang: rec.lang,
      startedAt: rec.startedAt, finishedAt: new Date().toISOString(), decision: rec.decision, decisionTimeMs: rec.decisionTimeMs,
      scenarioMs: v("scenario"), reportMs: v("report"), advisorMs: v("advisor"),
      t1Ms: v("t1"), t2Ms: v("t2"), t3Ms: (d["t3"] || 0) + (d["t3-decision"] || 0) || "",
      screenLog: JSON.stringify(rec.screens), aoiMap: JSON.stringify(rec.aoi),
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
