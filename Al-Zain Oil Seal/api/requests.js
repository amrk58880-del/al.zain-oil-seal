// استقبال طلبات العملاء (عرض سعر / طلب من السلة) وحفظها لتظهر في لوحة admin.html
const { dbReady, redis, clientIp, makeLimiter } = require("./_lib.js");

const limited = makeLimiter(6);

const TYPES = ["quote", "order", "cart-quote"];

function str(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!dbReady()) {
    console.error("Redis is not configured");
    return res.status(503).json({ error: "التخزين غير مفعّل" });
  }

  if (limited(clientIp(req))) {
    return res.status(429).json({ error: "طلبات كثيرة" });
  }

  const b = req.body && typeof req.body === "object" ? req.body : {};
  const type = TYPES.includes(b.type) ? b.type : "quote";

  const request = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    type,
    status: "new",
    customer: str(b.customer, 120),
    phone: str(b.phone, 30),
    product: str(b.product, 300),
    specs: str(b.specs, 300),
    quantity: Math.max(1, Math.min(100000, parseInt(b.quantity, 10) || 1)),
    details: str(b.details, 1000),
    items: str(b.items, 1500),
    payment: str(b.payment, 60)
  };

  // طلب عرض السعر لازم يحتوي على بيانات أساسية
  if (type === "quote" && (!request.customer || !request.phone || !request.product)) {
    return res.status(400).json({ error: "بيانات ناقصة" });
  }
  if (type !== "quote" && !request.items) {
    return res.status(400).json({ error: "السلة فارغة" });
  }

  try {
    await redis(["HSET", "requests", request.id, JSON.stringify(request)]);
    return res.status(200).json({ ok: true, id: request.id });
  } catch (error) {
    console.error("save request failed:", error.message);
    return res.status(500).json({ error: "تعذر حفظ الطلب" });
  }
};
