// واجهة لوحة الطلبات: قائمة / تغيير الحالة / حذف. محمية بكلمة سر ADMIN_PASSWORD
const crypto = require("crypto");
const { dbReady, redis, clientIp, makeLimiter } = require("./_lib.js");

const tooManyAttempts = makeLimiter(15);

function sameSecret(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

 const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res.status(503).json({ error: "ADMIN_PASSWORD غير مضبوط في إعدادات Vercel" });
  }
  if (!dbReady()) {
    return res.status(503).json({ error: "قاعدة البيانات (Upstash Redis) غير موصولة بالمشروع" });
  }

  if (tooManyAttempts(clientIp(req))) {
    return res.status(429).json({ error: "محاولات كثيرة، انتظر دقيقة" });
  }

  const given = req.headers["x-admin-password"] || "";
  if (!sameSecret(given, expected)) {
    return res.status(401).json({ error: "كلمة السر غير صحيحة" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const id = String(body.id || "").slice(0, 40);

  try {
    if (body.action === "list") {
      const flat = (await redis(["HGETALL", "requests"])) || [];
      const requests = [];
      for (let i = 1; i < flat.length; i += 2) {
        try {
          requests.push(JSON.parse(flat[i]));
        } catch (e) {
          /* تجاهل أي سجل تالف */
        }
      }
      requests.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
      return res.status(200).json({ requests });
    }

    if (body.action === "status" && id) {
      const status = body.status === "done" ? "done" : "new";
      const current = await redis(["HGET", "requests", id]);
      if (!current) return res.status(404).json({ error: "الطلب غير موجود" });
      const item = JSON.parse(current);
      item.status = status;
      await redis(["HSET", "requests", id, JSON.stringify(item)]);
      return res.status(200).json({ ok: true });
    }

    if (body.action === "delete" && id) {
      await redis(["HDEL", "requests", id]);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "أمر غير معروف" });
  } catch (error) {
    console.error("admin error:", error.message);
    return res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
};
