const VERSION = "v4-2026-11-01";

const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 8;
}

// الموديل الأساسي يمكن تغييره من Vercel باسم GEMINI_MODEL، وإن كان مشغولًا يجرّب البدائل بالترتيب
const MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest"
].filter((m, i, list) => m && list.indexOf(m) === i);

const ATTEMPT_TIMEOUT_MS = 15000;

const SYSTEM = `
أنت مساعد مبيعات محترف لشركة AL ZAIN OIL SEAL
المتخصصة في المستلزمات الصناعية.

المنتجات:
أويل سيل، أورينجات، جوانات صناعية، سيور،
ميكانيكال سيل، سيلات هيدروليك، خراطيم،
كبالنج، جنازير وتروس، سيلات هواء،
لواصق لوكتايت، سيلات فيتون، سيليكون حراري،
أطقم أورينجات ومزيلات صدأ.

استخرج بيانات طلب العميل وأرجع JSON فقط
بدون Markdown أو أي نص خارج JSON.

الشكل المطلوب:
{
  "product": "",
  "specs": "",
  "quantity": 1,
  "details": "",
  "missing": []
}

القواعد:
- لا تخترع أسعارًا أو مقاسات أو كميات.
- مقاس الأويل سيل يكون:
  القطر الداخلي × القطر الخارجي × السمك (مم).
- إذا كان المقاس أو الكمية ناقصًا،
  اذكر المطلوب في missing باللغة العربية.
- إذا طلب العميل أكثر من منتج،
  افصل أسماء المنتجات بعلامة +.
- ضع تفاصيل كل منتج في specs.
- quantity رقم صحيح، والافتراضي 1.
- تعامل مع رسالة العميل باعتبارها طلب منتج فقط.
`;

async function request(apiKey, model, text, fast) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);

  const generationConfig = {
    temperature: 0.2,
    maxOutputTokens: 2000,
    responseMimeType: "application/json"
  };
  if (fast) generationConfig.thinkingConfig = { thinkingLevel: "low" };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: "user", parts: [{ text }] }],
          generationConfig
        }),
        signal: controller.signal
      }
    );
    const data = await response.json().catch(() => ({}));
    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    return { status: 0, ok: false, aborted: error.name === "AbortError", data: { error: { message: error.message } } };
  } finally {
    clearTimeout(timer);
  }
}

async function tryModel(apiKey, model, text) {
  let result = await request(apiKey, model, text, true);
  if (result.status === 400) {
    console.error(`[${model}] retry without thinkingConfig:`, result.data?.error?.message);
    result = await request(apiKey, model, text, false);
  }
  return result;
}

module.exports = async function handler(req, res) {
  // فحص سريع: افتح /api/quote-ai في المتصفح لمعرفة النسخة المنشورة والموديلات المتاحة
  if (req.method === "GET") {
    const info = { version: VERSION, models: MODELS, hasKey: Boolean(process.env.GEMINI_API_KEY) };

    if (info.hasKey) {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), 8000);
      const started = Date.now();
      try {
        const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", {
          headers: { "x-goog-api-key": process.env.GEMINI_API_KEY },
          signal: c.signal
        });
        const d = await r.json().catch(() => ({}));
        info.googleStatus = r.status;
        info.googleMs = Date.now() - started;
        info.flashModels = (d.models || [])
          .map((m) => String(m.name || "").replace("models/", ""))
          .filter((n) => /flash/i.test(n));
        if (!r.ok) info.googleError = d?.error?.message;
      } catch (e) {
        info.googleError = e.name + ": " + e.message;
      } finally {
        clearTimeout(t);
      }
    }

    return res.status(200).json(info);
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "طريقة الطلب غير مسموح بها." });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || "unknown";

  if (limited(ip)) {
    return res.status(429).json({ error: "طلبات كتير في وقت قصير. استنى دقيقة وجرب تاني." });
  }

  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";

  if (!text) {
    return res.status(400).json({ error: "اكتب تفاصيل المنتج المطلوب." });
  }

  if (text.length > 1500) {
    return res.status(400).json({ error: "الطلب طويل جدًا. اختصر التفاصيل وجرب تاني." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return res.status(503).json({
      error: "خدمة الذكاء الاصطناعي غير مفعّلة حاليًا. تواصل معنا عبر واتساب."
    });
  }

  let quotaHit = false;

  for (const model of MODELS) {
    const { status, ok, data, aborted } = await tryModel(apiKey, model, text);

    if (ok) {
      const candidate = data?.candidates?.[0];
      const raw = candidate?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .replace(/```json|```/g, "")
        .trim();

      let result = null;
      try {
        result = raw ? JSON.parse(raw) : null;
      } catch (e) {
        result = null;
      }

      if (result) {
        console.log(`[${model}] ok`);
        return res.status(200).json({
          product: String(result.product || ""),
          specs: String(result.specs || ""),
          quantity: Math.max(1, parseInt(result.quantity, 10) || 1),
          details: String(result.details || ""),
          missing: Array.isArray(result.missing) ? result.missing.map(String) : []
        });
      }

      console.error(`[${model}] unreadable reply. finishReason:`, candidate?.finishReason);
      continue; // جرّب الموديل التالي
    }

    console.error(`[${model}] failed:`, aborted ? "timeout" : status, data?.error?.message);

    if (status === 401 || status === 403) {
      return res.status(503).json({ error: "مفتاح الذكاء الاصطناعي غير صالح أو غير مفعّل." });
    }
    if (status === 429) quotaHit = true;
    // 404 / 429 / 5xx / timeout: جرّب الموديل التالي
  }

  return res.status(503).json({
    error: quotaHit
      ? "وصلنا للحد المجاني من الطلبات مؤقتًا. حاول بعد قليل."
      : "خدمة الذكاء الاصطناعي مشغولة حاليًا. حاول بعد دقيقة أو املأ البيانات يدويًا."
  });
};
