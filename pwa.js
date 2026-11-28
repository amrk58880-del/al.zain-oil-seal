/* AL ZAIN - تسجيل التطبيق + زر "ثبّت التطبيق" */
(function () {
  "use strict";

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }

  /* لو التطبيق مثبّت ومفتوح كتطبيق، ما نعرضش الزر */
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (standalone) return;

  const css = document.createElement("style");
  css.textContent =
    ".pwa-install{position:fixed;right:16px;bottom:20px;z-index:55;display:none;align-items:center;gap:8px;" +
    "padding:11px 18px;border:0;border-radius:999px;cursor:pointer;font-family:'Cairo',Arial,sans-serif;" +
    "font-size:14px;font-weight:800;color:#1a1200;background:linear-gradient(180deg,#F7D867,#E8B830);" +
    "box-shadow:0 6px 22px rgba(232,184,48,.45)}" +
    ".pwa-install.show{display:inline-flex}" +
    ".pwa-install button{all:unset;cursor:pointer;margin-inline-start:4px;opacity:.6;font-size:16px}" +
    "@media(max-width:800px){.pwa-install{right:12px;bottom:16px;padding:10px 14px;font-size:13px}}";
  document.head.appendChild(css);

  const btn = document.createElement("div");
  btn.className = "pwa-install";
  btn.innerHTML = '<span role="button" tabindex="0">📲 ثبّت التطبيق</span><button type="button" aria-label="إخفاء">×</button>';
  document.body.appendChild(btn);

  const hidden = () => { try { return sessionStorage.getItem("pwaHide") === "1"; } catch (e) { return false; } };
  const hide = () => { btn.classList.remove("show"); try { sessionStorage.setItem("pwaHide", "1"); } catch (e) {} };
  btn.querySelector("button").addEventListener("click", hide);

  let deferred = null;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferred = e;
    if (!hidden()) btn.classList.add("show");
  });

  btn.querySelector("span").addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice.catch(() => {});
    deferred = null;
    btn.classList.remove("show");
  });

  window.addEventListener("appinstalled", () => btn.classList.remove("show"));

  /* iPhone: مفيش زر تثبيت تلقائي، فنوضّح الخطوات */
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (ios && !hidden()) {
    btn.querySelector("span").textContent = "📲 للتثبيت: مشاركة ثم «إضافة إلى الشاشة الرئيسية»";
    btn.classList.add("show");
  }
})();
