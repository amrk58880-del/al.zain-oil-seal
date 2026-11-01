// أدوات مشتركة لدوال الطلبات (الملفات التي تبدأ بـ _ لا تُعتبر روابط عامة في Vercel)

const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

function dbReady() {
  return Boolean(URL_ && TOKEN);
}

// تنفيذ أمر Redis عبر REST، مثال: redis(["HSET", "requests", "id1", "{...}"])
async function redis(command) {
  const response = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    throw new Error(data.error || `Redis HTTP ${response.status}`);
  }
  return data.result;
}

function clientIp(req) {
  return (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
}

// حد بسيط للطلبات: max طلب كل دقيقة لكل IP
function makeLimiter(max) {
  const hits = new Map();
  return (ip) => {
    const now = Date.now();
    const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
    arr.push(now);
    hits.set(ip, arr);
    return arr.length > max;
  };
}

module.exports = { dbReady, redis, clientIp, makeLimiter };
