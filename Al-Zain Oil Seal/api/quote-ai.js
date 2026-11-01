const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 8;
}

// يمكن تغيير الموديل من Vercel (Environment Variables) باسم GEMINI_MODEL بدون تعديل الكود
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

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

async function callGemini(apiKey, text, fast, signal) {
  const generationConfig = {
    temperature: 0.2,
    maxOutputTokens: 2000,
    responseMimeType: "application/json"
  };

  // تقليل زمن "التفكير" لتسريع الرد؛ لو الموديل لا يدعمها نعيد المحاولة بدونها
  if (fast) generationConfig.thinkingConfig = { thinkingLevel: "low" };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig
      }),
      signal
    }
  );

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

const VERSION = "v3-2026-11-01";

module.exports = async function handler(req, res) {
  // فحص سريع: افتح /api/quote-ai في المتصفح لمعرفة النسخة المنشورة والموديلات المتاحة
  if (req.method === "GET") {
    const info = { version: VERSION, model: MODEL, hasKey: Boolean(process.env.GEMINI_API_KEY) };

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
    return res.status(429).json({
      error: "طلبات كتير في وقت قصير. استنى دقيقة وجرب تاني."
    });
  }

  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";

  if (!text) {
    return res.status(400).json({ error: "اكتب تفاصيل المنتج المطلوب." });
  }

  if (text.length > 1500) {
    return res.status(400).json({
      error: "الطلب طويل جدًا. اختصر التفاصيل وجرب تاني."
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return res.status(503).json({
      error: "خدمة الذكاء الاصطناعي غير مفعّلة حاليًا. تواصل معنا عبر واتساب."
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    let { response, data } = await callGemini(apiKey, text, true, controller.signal);

    if (response.status === 400) {
      console.error("Retry without thinkingConfig:", data?.error?.message);
      ({ response, data } = await callGemini(apiKey, text, false, controller.signal));
    }

    clearTimeout(timeout);

    if (!response.ok) {
      console.error("Gemini API Error:", response.status, MODEL, data?.error?.message);

      if (response.status === 401 || response.status === 403) {
        return res.status(503).json({
          error: "مفتاح الذكاء الاصطناعي غير صالح أو غير مفعّل."
        });
      }

      if (response.status === 429) {
        return res.status(503).json({
          error: "وصلنا للحد المجاني من الطلبات مؤقتًا. حاول بعد قليل."
        });
      }

      return res.status(502).json({
        error: "حصلت مشكلة في خدمة الذكاء الاصطناعي. حاول مرة أخرى."
      });
    }

    const candidate = data?.candidates?.[0];
    const raw = candidate?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    if (!raw) {
      console.error("Empty Gemini reply. finishReason:", candidate?.finishReason, JSON.stringify(data?.usageMetadata || {}));
      return res.status(502).json({
        error: "لم يصل رد من الذكاء الاصطناعي. حاول مرة أخرى."
      });
    }

    let result;

    try {
      result = JSON.parse(raw);
    } catch (error) {
      console.error("Invalid Gemini JSON response. finishReason:", candidate?.finishReason);
      return res.status(502).json({
        error: "تعذر فهم طلبك. اكتب تفاصيل المنتج بطريقة أوضح."
      });
    }

    return res.status(200).json({
      product: String(result.product || ""),
      specs: String(result.specs || ""),
      quantity: Math.max(1, parseInt(result.quantity, 10) || 1),
      details: String(result.details || ""),
      missing: Array.isArray(result.missing) ? result.missing.map(String) : []
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error("Gemini Connection Error:", error.name, error.message);

    if (error.name === "AbortError") {
      return res.status(504).json({
        error: "الذكاء الاصطناعي اتأخر في الرد. حاول مرة أخرى."
      });
    }

    return res.status(503).json({
      error: "تعذر الاتصال بالذكاء الاصطناعي. تأكد من الإنترنت وحاول مرة أخرى."
    });
  }
};
