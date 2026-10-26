
/* AL ZAIN OIL SEAL */
const CONFIG = {
  whatsappNumber: "201114087380",
  currency: "ج.م"
};

const categories = [
  { id: "all", label: "الكل" },
  { id: "oil-seal", label: "أويل سيل" },
  { id: "O-rings", label: "أورينجات" },
  { id: "gaskets", label: "جوانات تصنيع" },
  { id: "belts", label: "سيور" },
  { id: "mechanical", label: "ميكانيكال سيل" },
  { id: "Hydraulic-Seals", label: "سيلات هيدروليك" },
  { id: "valves", label: "خراطيم" },
  { id: "couplings", label: "كبالنج" }
];


const products = [
  {id:1,name:"أويل سيل",category:"oil-seal",categoryLabel:"أويل سيل",description:"مانع تسرب للاستخدامات الميكانيكية والصناعية.",size:"مقاسات متعددة",price:85,image:"./image/اويل سيلات.png",tag:"الأكثر طلبًا"},
  {id:2,name:"أورينج مطاطي",category:"O-rings",categoryLabel:"أورينجات",description:"حلقات إحكام بمقاسات متعددة.",size:"مقاسات متعددة",price:45,image:"./image/اورنجات.png",tag:""},
  {id:3,name:"جوانات صناعية",category:"gaskets",categoryLabel:"جوانات تصنيع",description:"جوانات لتطبيقات الإحكام الصناعية.",size:"حسب المقاس",price:65,image:"./image/جوانات تصنيع.png",tag:""},
  {id:4,name:"ميكانيكال سيل",category:"mechanical",categoryLabel:"ميكانيكال سيل",description:"قطع إحكام ميكانيكية حسب المقاس والمواصفات.",size:"حسب المقاس",price:180,image:"./image/ميكانيكال.png",tag:""},
  {id:5,name:"سيلات هيدروليك",category:"Hydraulic-Seals",categoryLabel:"سيلات هيدروليك",description:"مكونات إحكام للأنظمة الهيدروليكية.",size:"مقاسات متعددة",price:95,image:"./image/سيلات هيدروليك.png",tag:""},
  {id:6,name:"خراطيم هيدروليك",category:"valves",categoryLabel:"خراطيم",description:"خراطيم للاستخدامات الصناعية والهيدروليكية.",size:"حسب الطول والمقاس",price:160,image:"./image/خراطيم هيدروليك.png",tag:""},
  {id:7,name:"سيور صناعية",category:"belts",categoryLabel:"سيور",description:"سيور نقل حركة لمجموعة متنوعة من التطبيقات.",size:"أطوال ومقاسات مختلفة",price:160,image:"./image/سيور واحزمه.png",tag:""},
  {id:8,name:"كبالنج",category:"couplings",categoryLabel:"كبالنج",description:"جزء ميكانيكي أساسي في نظام نقل الحركة.",size:"حسب المقاس",price:180,image:"./image/كبالنج.png",tag:""}
];


let cart = [];
const $ = selector => document.querySelector(selector);
const productGrid = $("#productGrid");
const categoryFilter = $("#categoryFilter");
const searchInput = $("#searchInput");
const categoryChips = $("#categoryChips");
const cartBackdrop = $("#cartBackdrop");
let toastTimeout;

function money(value) {
  return `${Number(value).toLocaleString("ar-EG")} ${CONFIG.currency}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
}

function setupCategories() {
  categoryFilter.innerHTML = categories.map(category =>
    `<option value="${escapeHtml(category.id)}">${escapeHtml(category.label)}</option>`
  ).join("");

  categoryChips.innerHTML = categories.map(category =>
    `<button class="chip${category.id === "all" ? " active" : ""}" type="button" data-category="${escapeHtml(category.id)}">${escapeHtml(category.label)}</button>`
  ).join("");
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesCategory =
      category === "all" || product.category === category;

    const matchesQuery =
      `${product.name} ${product.categoryLabel} ${product.description} ${product.size}`
        .toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card" data-category="${escapeHtml(product.category)}">
      <div class="product-visual">
        ${product.tag ? `<span class="product-tag">${escapeHtml(product.tag)}</span>` : ""}
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
      </div>
      <div class="product-info">
        <p class="product-category">${escapeHtml(product.categoryLabel)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="product-bottom">
          <span class="price" hidden></span>
          ${product.price == null
            ? `<button class="quote-product" data-quote="${product.id}">طلب عرض سعر ↗</button>`
            : `<button class="add-button" data-add="${product.id}" aria-label="أضف ${escapeHtml(product.name)} إلى السلة">+</button>`}
        </div>
      </div>
    </article>
  `).join("");

  $("#emptyState").hidden = filtered.length !== 0;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product || product.price == null) return;

  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({id, quantity:1});

  renderCart();
  showToast(`تمت إضافة «${product.name}» إلى السلة`);
}

function changeQuantity(id, delta) {
  const item = cart.find(row => row.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(row => row.id !== id);
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#cartCount").textContent = count;
  $("#cartEmpty").hidden = cart.length > 0;

  $("#cartItems").innerHTML = cart.map(item => {
    const product = products.find(row => row.id === item.id);

    return `
      
<div class="cart-item">
    <div>
        <h4>${escapeHtml(product.name)}</h4>
        <div class="cart-item-actions">
            <button class="qty-btn" data-qty="${item.id}" data-delta="-1">−</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" data-qty="${item.id}" data-delta="1">+</button>
            <button class="remove-btn" data-remove="${item.id}">حذف</button>
        </div>
    </div>
</div>`;

  }).join("");

  const total = cart.reduce((sum, item) => {
    const product = products.find(row => row.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  $("#cartTotal").textContent = money(total);
}

function whatsappUrl(message) {
  const number = CONFIG.whatsappNumber.replace(/\D/g, "");
  if (!number) {
    showToast("أضف رقم واتساب الشركة في ملف script.js");
    return null;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message) {
  const url = whatsappUrl(message);
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

function cartMessage(asQuote = false) {
  const rows = cart.map(item => {
    const product = products.find(row => row.id === item.id);
    return `- ${product.name} | الكمية: ${item.quantity}`;
  }).join("\n");

  const total = cart.reduce((sum, item) => {
    return sum + products.find(row => row.id === item.id).price * item.quantity;
  }, 0);

  return `مرحبًا AL ZAIN OIL SEAL،
${asQuote ? "أرغب في طلب عرض سعر للمنتجات التالية:" : "أرغب في تأكيد طلب المنتجات التالية:"}
${rows}
${asQuote ? "" : `الإجمالي التقريبي: ${total} ${CONFIG.currency}\n`}
يرجى تأكيد التوفر والسعر النهائي وتكلفة الشحن.`;
}

function openCart() {
  cartBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  $("#closeCart").focus();
}

function closeCart() {
  cartBackdrop.hidden = true;
  document.body.style.overflow = "";
}

function selectCategory(category) {
  categoryFilter.value = category;
  categoryChips.querySelectorAll(".chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === category);
  });
  renderProducts();
}

/* تشغيل المتجر */
setupCategories();
renderProducts();
renderCart();
$("#year").textContent = new Date().getFullYear();

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", () => selectCategory(categoryFilter.value));

categoryChips.addEventListener("click", event => {
  const chip = event.target.closest("[data-category]");
  if (chip) selectCategory(chip.dataset.category);
});

productGrid.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const quote = event.target.closest("[data-quote]");

  if (add) addToCart(Number(add.dataset.add));

  if (quote) {
    const product = products.find(row => row.id === Number(quote.dataset.quote));
    $("#quoteForm").elements.product.value = product.name;
    $("#quoteForm").scrollIntoView({behavior:"smooth", block:"center"});
    $("#quoteForm").elements.specs.focus({preventScroll:true});
  }
});

$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);

cartBackdrop.addEventListener("click", event => {
  if (event.target === cartBackdrop) closeCart();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !cartBackdrop.hidden) closeCart();
});

$("#cartItems").addEventListener("click", event => {
  const qty = event.target.closest("[data-qty]");
  const remove = event.target.closest("[data-remove]");

  if (qty) changeQuantity(Number(qty.dataset.qty), Number(qty.dataset.delta));
  if (remove) removeFromCart(Number(remove.dataset.remove));
});

$("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) return showToast("السلة فارغة، أضف المنتجات أولًا");
  openWhatsApp(cartMessage(false));
});

$("#quoteCartButton").addEventListener("click", () => {
  if (!cart.length) return showToast("السلة فارغة، أضف المنتجات أولًا");
  openWhatsApp(cartMessage(true));
});

$("#quoteForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);

  const message = `مرحبًا AL ZAIN OIL SEAL، أريد طلب عرض سعر.
الاسم/الشركة: ${data.get("customer")}
رقم الهاتف: ${data.get("phone")}
المنتج: ${data.get("product")}
المقاس/المواصفات: ${data.get("specs") || "غير محدد"}
الكمية: ${data.get("quantity")}
تفاصيل إضافية: ${data.get("details") || "لا توجد"}
برجاء تأكيد السعر والتوفر.`;

  openWhatsApp(message);
});

$("#contactWhatsapp").addEventListener("click", event => {
  event.preventDefault();
  openWhatsApp("مرحبًا AL ZAIN OIL SEAL، أريد الاستفسار عن المنتجات والأسعار.");
});

$("#menuToggle").addEventListener("click", () => {
  const nav = $("#mainNav");
  const open = nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(open));
});

$("#mainNav").addEventListener("click", event => {
  if (event.target.closest("a")) {
    $("#mainNav").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
  }
});
