/* =========================================================
   AL ZAIN - بحث ذكي + طلب عرض سعر متعدد المنتجات
   يتحمّل بعد script.js مباشرة (بيستخدم دوال وبيانات script.js)
========================================================= */
(function () {
  "use strict";

  const form = document.getElementById("quoteForm");
  if (!form) return;

  /* ---------- أدوات مساعدة ---------- */
  const isNum = t => /^\d+(\.\d+)?$/.test(t);
  const compactText = s => normalizeSearchText(s).replace(/[^a-z0-9.\u0600-\u06FF]/g, "");
  const MECH_RE = /ميكانيك|مياكنياك|قاعدة|فالنشة|فالنشه|مروحة/;

  /* =========================================================
     1) طلب عرض السعر: منتجات متعددة
  ========================================================= */
  let items = [];
  let photoFile = null;
  let photoUrl = "";

  const box = document.createElement("div");
  box.className = "sq-multi";
  box.innerHTML =
    '<button type="button" class="btn btn-outline-dark btn-full" id="sqAdd">＋ أضف هذا المنتج للطلب</button>' +
    '<p class="sq-hint">يمكنك إضافة أكثر من منتج في طلب واحد، ولكل منتج مقاسه وكميته وملاحظاته.</p>' +
    '<div id="sqItems" class="sq-items"></div>' +
    '<label class="sq-photo">📷 صورة القطعة المطلوبة (اختياري)' +
    '<input type="file" id="sqPhoto" accept="image/*"></label>' +
    '<div id="sqPhotoPrev" class="sq-prev" hidden></div>';

  const qtyRow = form.elements.quantity && form.elements.quantity.closest(".form-row");
  (qtyRow || form.elements.product.closest("label")).after(box);

  const list = box.querySelector("#sqItems");
  const photoInput = box.querySelector("#sqPhoto");
  const photoPrev = box.querySelector("#sqPhotoPrev");

  /* زر عائم يوضّح عدد المنتجات في الطلب */
  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "sq-fab";
  fab.hidden = true;
  fab.addEventListener("click", () => {
    const target = document.getElementById("quote") || form;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.body.appendChild(fab);

  function render() {
    list.innerHTML = items.map((it, i) =>
      '<div class="sq-row" data-i="' + i + '">' +
        '<div class="sq-row-head"><b>' + (i + 1) + ". " + escapeHtml(it.name) + "</b>" +
        '<button type="button" class="sq-del" data-del="' + i + '" aria-label="حذف المنتج">×</button></div>' +
        '<div class="sq-row-fields">' +
          '<input data-f="specs" value="' + escapeHtml(it.specs) + '" placeholder="المقاس / المواصفات">' +
          '<input data-f="qty" type="number" min="1" value="' + it.qty + '" aria-label="الكمية">' +
          '<input data-f="note" value="' + escapeHtml(it.note) + '" placeholder="ملاحظات (اختياري)">' +
        "</div></div>"
    ).join("");

    form.elements.product.required = items.length === 0;
    fab.hidden = items.length === 0;
    fab.textContent = "📋 طلب عرض السعر (" + items.length + ")";
  }

  function addItem(item) {
    const same = items.find(x => x.name === item.name && x.specs === item.specs);
    if (same) same.qty += item.qty;
    else items.push(item);
    render();
    showToast("تمت إضافة «" + item.name + "» إلى طلب عرض السعر (" + items.length + ")");
  }

  function addFromComposer() {
    const name = form.elements.product.value.trim();
    if (!name) return false;
    addItem({
      name,
      specs: form.elements.specs.value.trim(),
      qty: Math.max(1, parseInt(form.elements.quantity.value, 10) || 1),
      note: ""
    });
    form.elements.product.value = "";
    form.elements.specs.value = "";
    form.elements.quantity.value = 1;
    return true;
  }

  box.querySelector("#sqAdd").addEventListener("click", () => {
    if (!addFromComposer()) showToast("اكتب اسم المنتج أولًا");
    else form.elements.product.focus({ preventScroll: true });
  });

  list.addEventListener("input", e => {
    const row = e.target.closest("[data-i]");
    const field = e.target.dataset.f;
    if (!row || !field) return;
    const it = items[Number(row.dataset.i)];
    if (!it) return;
    it[field] = field === "qty"
      ? Math.max(1, parseInt(e.target.value, 10) || 1)
      : e.target.value;
  });

  list.addEventListener("click", e => {
    const del = e.target.closest("[data-del]");
    if (!del) return;
    items.splice(Number(del.dataset.del), 1);
    render();
  });

  /* صورة القطعة */
  photoInput.addEventListener("change", () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoFile = photoInput.files && photoInput.files[0] ? photoInput.files[0] : null;
    photoPrev.replaceChildren();
    if (!photoFile) { photoPrev.hidden = true; return; }
    photoUrl = URL.createObjectURL(photoFile);
    const img = document.createElement("img");
    img.src = photoUrl;
    img.alt = "صورة القطعة";
    photoPrev.appendChild(img);
    photoPrev.hidden = false;
  });

  /* رسالة التأكيد بعد الإرسال */
  function showConfirm(count, withPhoto, file) {
    const old = form.querySelector(".sq-confirm");
    if (old) old.remove();

    const c = document.createElement("div");
    c.className = "sq-confirm";
    c.setAttribute("role", "status");

    const t = document.createElement("strong");
    t.textContent = "✅ تم تجهيز طلبك (" + count + " منتج) وفتح واتساب";
    const p = document.createElement("p");
    p.textContent = "اضغط «إرسال» داخل واتساب لإتمام الطلب، وسنرد عليك بالسعر والتوفر في أقرب وقت.";
    c.append(t, p);

    if (withPhoto) {
      const p2 = document.createElement("p");
      p2.textContent = "📷 لا تنسَ إرفاق صورة القطعة في المحادثة.";
      c.appendChild(p2);
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn btn-outline-dark";
        b.textContent = "📷 أرسل الصورة عبر واتساب";
        b.addEventListener("click", () =>
          navigator.share({ files: [file], text: "صورة القطعة المطلوبة" }).catch(() => {}));
        c.appendChild(b);
      }
    }

    const x = document.createElement("button");
    x.type = "button";
    x.className = "sq-confirm-x";
    x.setAttribute("aria-label", "إغلاق");
    x.textContent = "×";
    x.addEventListener("click", () => c.remove());
    c.appendChild(x);

    form.prepend(c);
    c.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* الإرسال (نمسك الحدث قبل معالج script.js القديم) */
  document.addEventListener("submit", e => {
    if (e.target !== form) return;
    e.preventDefault();
    e.stopPropagation();

    addFromComposer();
    if (!items.length) return showToast("أضف منتجًا واحدًا على الأقل");

    const data = new FormData(form);
    const pay = PAYMENT_METHODS[data.get("payment")];
    const paymentLabel = pay ? pay.label : "غير محددة";
    const total = items.reduce((s, it) => s + it.qty, 0);

    const lines = items.map((it, k) =>
      (k + 1) + ") " + it.name +
      " | المقاس: " + (it.specs || "غير محدد") +
      " | الكمية: " + it.qty +
      (it.note ? " | ملاحظات: " + it.note : "")
    ).join("\n");

    const message =
      "مرحبًا AL ZAIN OIL SEAL، أريد طلب عرض سعر.\n" +
      "الاسم/الشركة: " + data.get("customer") + "\n" +
      "رقم الهاتف: " + data.get("phone") + "\n" +
      "المنتجات المطلوبة (" + items.length + "):\n" + lines + "\n" +
      "طريقة الدفع المفضلة: " + paymentLabel + "\n" +
      "تفاصيل إضافية: " + (data.get("details") || "لا توجد") + "\n" +
      (photoFile ? "📷 سأرفق صورة القطعة في المحادثة.\n" : "") +
      "برجاء تأكيد السعر والتوفر.";

    saveRequest({
      type: "quote",
      customer: data.get("customer"),
      phone: data.get("phone"),
      product: items.map(it => it.name + " × " + it.qty).join(" | "),
      specs: items.map(it => it.specs || "-").join(" | "),
      quantity: total,
      payment: paymentLabel,
      details: (data.get("details") || "") + (data.get("details") ? "\n" : "") + lines,
      items: items.map(it => ({ name: it.name, specs: it.specs, qty: it.qty, note: it.note }))
    });

    openWhatsApp(message);
    showConfirm(items.length, !!photoFile, photoFile);

    items = [];
    form.elements.details.value = "";
    photoInput.value = "";
    photoFile = null;
    if (photoUrl) { URL.revokeObjectURL(photoUrl); photoUrl = ""; }
    photoPrev.replaceChildren();
    photoPrev.hidden = true;
    render();
  }, true);

  render();
  window.alzainAddItem = addItem; /* يستخدمها المساعد */

  /* =========================================================
     2) البحث الذكي: اقتراحات أثناء الكتابة
  ========================================================= */
  let INDEX = null;

  function buildIndex() {
    const out = [];
    const push = (name, label, addName, code) => out.push({
      name, label, addName,
      norm: normalizeSearchText(name + " " + label + " " + (code || "")),
      compact: compactText(name + " " + (code || "")),
      nums: parseNumbers(name)
    });

    products.forEach(p => push(p.name, p.categoryLabel || "", p.name, p.code));
    mechanicalCatalog.forEach(i =>
      push(i.name, "ميكانيكال سيل", MECH_RE.test(i.name) ? i.name : "ميكانيكال سيل " + i.name));
    oilSealCatalog.forEach(i => push(i.name, "أويل سيل", i.name));
    italianSealCatalog.forEach(i => push(i.name, "أويل سيل إيطالي", i.name));
    taiwanSealCatalog.forEach(i => push(i.name, "أويل سيل تايواني", i.name));
    couplingCatalog.forEach(i => push(i.name, "كبالنج", i.name));
    return out;
  }

  function parseQuery(v) {
    const norm = normalizeSearchText(v);
    return {
      norm,
      tokens: norm.split(" ").filter(Boolean),
      compact: compactText(v),
      hasLetters: /[a-zA-Z\u0600-\u06FF]/.test(v)
    };
  }

  function matches(e, q) {
    const ok = q.tokens.every(t => isNum(t) ? e.nums.includes(Number(t)) : e.norm.includes(t));
    if (ok) return true;
    return q.hasLetters && q.compact.length >= 3 && e.compact.includes(q.compact);
  }

  function suggest(value) {
    const q = parseQuery(value);
    if (!q.tokens.length) return [];
    if (!INDEX) INDEX = buildIndex();
    const found = [];
    for (const e of INDEX) {
      if (matches(e, q)) { found.push(e); if (found.length >= 60) break; }
    }
    found.sort((a, b) => (a.norm.startsWith(q.norm) ? 0 : 1) - (b.norm.startsWith(q.norm) ? 0 : 1));
    return found.slice(0, 8);
  }

  function attachSuggest(input) {
    if (!input) return;
    const wrap = input.closest(".search-box") || input.parentElement;
    const dd = document.createElement("div");
    dd.className = "sq-suggest";
    dd.hidden = true;
    wrap.appendChild(dd);
    let results = [];
    const hide = () => { dd.hidden = true; };

    input.addEventListener("input", () => {
      if (input.dataset.sqSkip) { delete input.dataset.sqSkip; hide(); return; }
      const v = input.value.trim();
      if (!v) return hide();
      results = suggest(v);
      if (!results.length) return hide();
      dd.innerHTML = results.map((e, i) =>
        '<div class="sq-item" role="option" data-i="' + i + '">' +
          '<span class="sq-name">' + escapeHtml(e.name) + "</span>" +
          '<span class="sq-tag">' + escapeHtml(e.label) + "</span>" +
          '<button type="button" class="sq-add" data-add="' + i + '">＋ للطلب</button>' +
        "</div>"
      ).join("");
      dd.hidden = false;
    });

    dd.addEventListener("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const add = ev.target.closest("[data-add]");
      const row = ev.target.closest("[data-i]");
      if (add) {
        const e = results[Number(add.dataset.add)];
        if (e) addItem({ name: e.addName, specs: "", qty: 1, note: "" });
        return;
      }
      if (row) {
        const e = results[Number(row.dataset.i)];
        if (!e) return;
        input.dataset.sqSkip = "1";
        input.value = e.name;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        hide();
      }
    });

    document.addEventListener("click", ev => { if (!wrap.contains(ev.target)) hide(); });
    input.addEventListener("keydown", ev => { if (ev.key === "Escape") hide(); });
  }

  attachSuggest(searchInput);
  attachSuggest(sizeSearchInput);

  /* =========================================================
     3) لو المقاس مش موجود: أقرب المقاسات
  ========================================================= */
  let simResults = [];

  function sizeDistance(itemNums, q) {
    const n = q.length;
    let d = 0;
    for (let i = 0; i < n; i++) d += Math.abs(itemNums[i] - q[i]);
    if (itemNums.length === n) {
      const a = [...itemNums].sort((x, y) => x - y);
      const b = [...q].sort((x, y) => x - y);
      let d2 = 0;
      for (let i = 0; i < n; i++) d2 += Math.abs(a[i] - b[i]);
      d = Math.min(d, d2);
    }
    return d + (itemNums.length - n) * 5;
  }

  function simName(it) {
    const n = it.note || "";
    return it.type === "mechanical" && !MECH_RE.test(n) ? "ميكانيكال سيل " + n : n;
  }

  function enhanceEmpty() {
    const empty = document.getElementById("emptyState");
    if (!empty) return;
    empty.querySelectorAll(".sq-similar").forEach(n => n.remove());
    if (empty.hidden || !sizeSearchInput) return;

    const raw = sizeSearchInput.value.trim();
    if (!raw || /[a-zA-Z\u0600-\u06FF]/.test(raw)) return;
    const q = parseNumbers(raw);
    if (!q.length || !SIZE_LIST.length) return;

    const cat = categoryFilter.value;
    let pool = SIZE_LIST.filter(it => it.nums.length >= q.length && (cat === "all" || it.type === cat));
    if (!pool.length) pool = SIZE_LIST.filter(it => it.nums.length >= q.length);

    const seen = new Set();
    simResults = pool
      .map(it => ({ it, d: sizeDistance(it.nums, q) }))
      .sort((a, b) => a.d - b.d)
      .filter(x => {
        const key = x.it.note;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6)
      .map(x => x.it);

    if (!simResults.length) return;

    const wrap = document.createElement("div");
    wrap.className = "sq-similar";
    const title = document.createElement("p");
    title.textContent = "لم نجد هذا المقاس بالضبط، وهذه أقرب المقاسات في الكتالوج:";
    wrap.appendChild(title);

    simResults.forEach((it, i) => {
      const row = document.createElement("div");
      row.className = "sq-sim-row";
      const name = document.createElement("span");
      name.className = "sq-name";
      name.textContent = simName(it);
      const size = document.createElement("span");
      size.className = "sq-tag";
      size.textContent = sizeText(it.nums);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sq-add";
      btn.dataset.sim = String(i);
      btn.textContent = "＋ للطلب";
      row.append(name, size, btn);
      wrap.appendChild(row);
    });
    empty.appendChild(wrap);
  }

  const emptyBox = document.getElementById("emptyState");
  if (emptyBox) {
    emptyBox.addEventListener("click", e => {
      const b = e.target.closest("[data-sim]");
      if (!b) return;
      const it = simResults[Number(b.dataset.sim)];
      if (it) addItem({ name: simName(it), specs: sizeText(it.nums), qty: 1, note: "" });
    });
  }

  /* نلف renderProducts عشان الاستدعاءات الداخلية (التصنيفات) تمر علينا */
  if (typeof renderProducts === "function") {
    const original = renderProducts;
    renderProducts = function () {
      original.apply(this, arguments);
      enhanceEmpty();
    };
  }
  /* المستمعين القديمة ماسكة النسخة الأصلية، فنضيف مستمعين بعدها */
  searchInput.addEventListener("input", enhanceEmpty);
  if (sizeSearchInput) sizeSearchInput.addEventListener("input", enhanceEmpty);
})();
