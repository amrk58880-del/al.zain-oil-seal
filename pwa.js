/* AL ZAIN - تسجيل التطبيق + شريط "حمّل التطبيق" تحت الهيدر */
(function () {
  "use strict";

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }

  /* لو مفتوح كتطبيق مثبّت، ما نعرضش الشريط */
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (standalone) return;

  /* لو العميل قفل الشريط، ما نظهرهوش تاني لمدة 7 أيام */
  const KEY = "pwaBannerClosedAt", DAYS = 7;
  const closedRecently = () => {
    try {
      const t = Number(localStorage.getItem(KEY) || 0);
      return t && Date.now() - t < DAYS * 864e5;
    } catch (e) { return false; }
  };
  if (closedRecently()) return;

  const css = document.createElement("style");
  css.textContent =
    ".pwa-bar{display:none;align-items:center;gap:10px;padding:8px 4%;direction:rtl;" +
    "background:linear-gradient(90deg,#b8860b,#F7D867 35%,#E8B830 70%,#b8860b);color:#1a1200;" +
    "font-family:'Cairo',Arial,sans-serif;font-size:13px;font-weight:800;line-height:1.4}" +
    ".pwa-bar.show{display:flex}" +
    ".pwa-bar img{width:30px;height:30px;border-radius:50%;background:#fff;object-fit:contain;flex:0 0 30px;" +
    "border:1.5px solid #101C2C}" +
    ".pwa-bar .pwa-txt{flex:1;min-width:0}" +
    ".pwa-bar .pwa-go{flex:0 0 auto;border:0;cursor:pointer;border-radius:999px;padding:5px 16px;" +
    "background:#101C2C;color:#F7D867;font:inherit;font-size:13px}" +
    ".pwa-bar .pwa-x{flex:0 0 auto;border:0;background:none;cursor:pointer;color:#1a1200;opacity:.6;" +
    "font-size:22px;line-height:1;padding:0 4px}" +
    "@media(max-width:800px){.pwa-bar{font-size:12px;gap:8px;padding:7px 3%}" +
    ".pwa-bar .pwa-go{padding:5px 12px;font-size:12px}}";
  document.head.appendChild(css);

  const bar = document.createElement("div");
  bar.className = "pwa-bar";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "تثبيت التطبيق");
  bar.innerHTML =
    '<img src="/Al-Zain%20Oil%20Seal/image/icon-192.png" alt="">' +
    '<span class="pwa-txt">حمّل تطبيق الزين على موبايلك</span>' +
    '<button type="button" class="pwa-go">تثبيت</button>' +
    '<button type="button" class="pwa-x" aria-label="إغلاق">×</button>';

  const header = document.querySelector(".site-header");
  if (header) header.insertAdjacentElement("afterend", bar);
  else document.body.prepend(bar);

  const txt = bar.querySelector(".pwa-txt");
  const go = bar.querySelector(".pwa-go");

  bar.querySelector(".pwa-x").addEventListener("click", () => {
    bar.classList.remove("show");
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
  });

  let deferred = null;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferred = e;
    bar.classList.add("show");
  });

  go.addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice.catch(() => {});
    deferred = null;
    bar.classList.remove("show");
  });

  window.addEventListener("appinstalled", () => bar.classList.remove("show"));

  /* آيفون: مفيش تثبيت تلقائي، فنوضّح الخطوات */
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
    txt.textContent = "للتثبيت: اضغط مشاركة ثم «إضافة إلى الشاشة الرئيسية»";
    go.style.display = "none";
    bar.classList.add("show");
  }
})();
