/* =========================================================
   AL ZAIN - مساعد الزين (شات ذكي)
   يتحمّل بعد script.js و smart-quote.js
========================================================= */
(function () {
  "use strict";
  if (typeof products === "undefined" || typeof normalizeSearchText !== "function") return;

  const ENDPOINT = "/api/assistant";
  const MECH_RE = /ميكانيك|مياكنياك|قاعدة|فالنشة|فالنشه|مروحة/;
  const STOP = new Set(["محتاج","عايز","عاوز","اريد","ابغي","مقاس","ايه","اي","هو","هي","في","من","علي","على","عن","الي","الى","لو","ده","دي","دا","بديل","للقطعه","للقطعة","القطعه","القطعة","صنف","نوع","انواع","الفرق","بين","انسب","استخدام","معين","لازم","ممكن","عندكم","عندك","مع","او","و","فيه","كام","سعر","اسعار","اعرف","اللي","ان","انا","لي","ليا","عشان","بتاع"]);

  /* ---------- فهرس الكتالوج ---------- */
  let INDEX = null;
  function buildIndex() {
    const out = [];
    const push = (name, label, addName) => out.push({
      name, label, addName,
      norm: normalizeSearchText(name + " " + label),
      nums: parseNumbers(name)
    });
    products.forEach(p => push(p.name, p.categoryLabel || "", p.name));
    mechanicalCatalog.forEach(i => push(i.name, "ميكانيكال سيل", MECH_RE.test(i.name) ? i.name : "ميكانيكال سيل " + i.name));
    oilSealCatalog.forEach(i => push(i.name, "أويل سيل", i.name));
    italianSealCatalog.forEach(i => push(i.name, "أويل سيل إيطالي", i.name));
    taiwanSealCatalog.forEach(i => push(i.name, "أويل سيل تايواني", i.name));
    couplingCatalog.forEach(i => push(i.name, "كبالنج", i.name));
    return out;
  }

  const sortNums = a => [...a].sort((x, y) => x - y);
  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    const x = sortNums(a), y = sortNums(b);
    return x.every((v, i) => v === y[i]);
  }
  function distance(a, b) {
    const x = sortNums(a), y = sortNums(b);
    return x.reduce((s, v, i) => s + Math.abs(v - y[i]), 0);
  }

  function candidates(text) {
    if (!INDEX) INDEX = buildIndex();
    const nums = parseNumbers(text);
    const words = normalizeSearchText(text).split(" ")
      .map(w => w.replace(/^ال/, ""))
      .filter(w => w.length >= 2 && !STOP.has(w) && !/^[\dx.]+$/.test(w));

    const scored = [];
    for (const e of INDEX) {
      const w = words.filter(t => e.norm.includes(t)).length;
      const n = nums.filter(v => e.nums.includes(v)).length;
      const exact = nums.length >= 2 && sameSet(e.nums, nums);
      const score = w * 2 + n * 3 + (exact ? 10 : 0);
      if (score > 0 && (nums.length === 0 || n > 0 || w > 1)) scored.push({ e, score, exact });
    }
    scored.sort((a, b) => b.score - a.score);

    const out = scored.slice(0, 10).map(s => s.e);
    const hasExact = scored.some(s => s.exact);

    /* مفيش مقاس مطابق؟ نضيف أقرب المقاسات */
    if (nums.length >= 3 && !hasExact) {
      INDEX.filter(e => /أويل/.test(e.label) && e.nums.length === nums.length)
        .map(e => ({ e, d: distance(e.nums, nums) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 5)
        .forEach(x => { if (!out.includes(x.e)) out.push(Object.assign({}, x.e, { near: true })); });
    }
    return out.slice(0, 15);
  }

  /* ---------- إضافة للطلب ---------- */
  function addToQuote(e) {
    if (typeof window.alzainAddItem === "function") {
      window.alzainAddItem({ name: e.addName, specs: "", qty: 1, note: "" });
      return;
    }
    const form = document.getElementById("quoteForm");
    if (!form) return;
    form.elements.product.value = e.addName;
    if (typeof showToast === "function") showToast("تم وضع «" + e.name + "» في نموذج عرض السعر");
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function goToQuote() {
    const t = document.getElementById("quote") || document.getElementById("quoteForm");
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    close();
  }

  /* ---------- الواجهة ---------- */
  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "az-launcher";
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = '<span aria-hidden="true">💬</span> اسأل المساعد';

  const panel = document.createElement("section");
  panel.className = "az-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "مساعد الزين");
  panel.innerHTML =
    '<header class="az-head"><div><strong>مساعد الزين</strong><small>يساعدك تختار الصنف وتجهّز طلبك</small></div>' +
    '<button type="button" class="az-x" aria-label="إغلاق">×</button></header>' +
    '<div class="az-log" aria-live="polite"></div>' +
    '<div class="az-chips"></div>' +
    '<div class="az-form"><input class="az-input" maxlength="500" placeholder="اكتب سؤالك أو المقاس..." aria-label="رسالتك">' +
    '<button type="button" class="az-send">إرسال</button></div>';

  document.body.append(panel, launcher);

  const log = panel.querySelector(".az-log");
  const chips = panel.querySelector(".az-chips");
  const input = panel.querySelector(".az-input");
  const sendBtn = panel.querySelector(".az-send");

  const SAMPLES = [
    "محتاج أويل سيل مقاس 30 × 45 × 8",
    "إيه الفرق بين أنواع الميكانيكال سيل؟",
    "محتاج بديل لأويل سيل 10×62×40",
    "أنسب أويل سيل لمكان حرارته عالية؟"
  ];
  SAMPLES.forEach(s => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "az-chip";
    b.textContent = s;
    b.addEventListener("click", () => send(s));
    chips.appendChild(b);
  });

  function open() {
    panel.hidden = false;
    launcher.hidden = true;
    launcher.setAttribute("aria-expanded", "true");
    if (!log.children.length)
      bubble("bot", "أهلًا بحضرتك في AL ZAIN 👋\nاكتب المقاس أو اسأل عن أي صنف، وأنا أرشّحلك المناسب وأجهّز معاك طلب عرض السعر.");
    input.focus();
  }
  function close() {
    panel.hidden = true;
    launcher.hidden = false;
    launcher.setAttribute("aria-expanded", "false");
  }
  launcher.addEventListener("click", open);
  panel.querySelector(".az-x").addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) close(); });

  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function bubble(who, text) {
    const b = document.createElement("div");
    b.className = "az-msg az-" + who;
    b.textContent = text;
    log.appendChild(b);
    scrollDown();
    return b;
  }

  function renderPicks(items, withQuote) {
    const box = document.createElement("div");
    box.className = "az-picks";
    items.forEach(e => {
      const row = document.createElement("div");
      row.className = "az-pick";
      const name = document.createElement("span");
      name.className = "az-pick-name";
      name.textContent = e.name;
      const tag = document.createElement("span");
      tag.className = "az-pick-tag";
      tag.textContent = e.near ? "أقرب مقاس" : e.label;
      const add = document.createElement("button");
      add.type = "button";
      add.className = "az-add";
      add.textContent = "＋ للطلب";
      add.addEventListener("click", () => {
        addToQuote(e);
        add.textContent = "✓ أُضيف";
        add.disabled = true;
      });
      row.append(name, tag, add);
      box.appendChild(row);
    });
    if (withQuote) {
      const q = document.createElement("button");
      q.type = "button";
      q.className = "az-quote";
      q.textContent = "📋 كمّل طلب عرض السعر";
      q.addEventListener("click", goToQuote);
      box.appendChild(q);
    }
    log.appendChild(box);
    scrollDown();
  }

  /* ---------- المحادثة ---------- */
  const history = [];
  let busy = false;

  async function send(raw) {
    const text = String(raw || "").trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    input.value = "";
    chips.hidden = true;

    bubble("me", text);
    history.push({ role: "user", content: text });

    /* البحث المحلي بآخر رسالتين عشان المتابعات ("وعايزه حراري") تفهم السياق */
    const context = history.filter(m => m.role === "user").slice(-2).map(m => m.content).join(" ");
    const cands = candidates(context);
    const typing = bubble("bot az-typing", "بيكتب...");

    try {
      if (location.protocol === "file:") throw new Error("offline");

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-10),
          candidates: cands.map((c, i) => ({ i, name: c.name, label: c.label, near: !!c.near }))
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "error");

      typing.remove();
      bubble("bot", data.reply);
      history.push({ role: "assistant", content: data.reply });

      const picked = (data.picks || []).map(i => cands[i]).filter(Boolean);
      if (picked.length || data.quote) renderPicks(picked, true);
    } catch (err) {
      typing.remove();
      const msg = cands.length
        ? "المساعد مش متاح دلوقتي، لكن دي أقرب نتائج من الكتالوج:"
        : "المساعد مش متاح دلوقتي. ممكن تبعت طلبك من نموذج عرض السعر وهنرد عليك.";
      bubble("bot", msg);
      history.push({ role: "assistant", content: msg });
      if (cands.length) renderPicks(cands.slice(0, 5), true);
    } finally {
      busy = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.addEventListener("click", () => send(input.value));
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); send(input.value); }
  });
})();
