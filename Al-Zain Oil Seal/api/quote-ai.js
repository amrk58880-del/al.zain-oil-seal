
const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(
    (t) => now - t < 60000
  );

  arr.push(now);
  hits.set(ip, arr);

  return arr.length > 8;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "طريقة الطلب غير مسموح بها."
    });
  }

  const ip = (
    req.headers["x-forwarded-for"] || ""
  ).split(",")[0] || "unknown";

  if (limited(ip)) {
    return res.status(429).json({
      error: "طلبات كتير في وقت قصير. استنى دقيقة وجرب تاني."
    });
  }

  const text =
    typeof req.body?.text === "string"
      ? req.body.text.trim()
      : "";

  if (!text) {
    return res.status(400).json({
      error: "اكتب تفاصيل المنتج المطلوب."
    });
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

  const system = `
أنت مساعد مبيعات محترف لشركة AL ZAIN OIL SEAL
المتخصصة في المستلزمات الصناعية.

المنتجات:
أويل سيل، أورينجات، جوانات صناعية، سيور،
ميكانيكال سيل، سيلات هيدرولييك، خراطيم،
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

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 20000);

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },

        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: system }]
          },

          contents: [
            {
              role: "user",
              parts: [{ text }]
            }
          ],

          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 600,
            responseMimeType: "application/json"
          }
        }),

        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Gemini API Error:",
        response.status,
        data?.error?.message
      );

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

    const raw =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim();

    if (!raw) {
      return res.status(502).json({
        error: "لم يصل رد من الذكاء الاصطناعي. حاول مرة أخرى."
      });
    }

    let result;

    try {
      result = JSON.parse(raw);
    } catch (error) {
      console.error("Invalid Gemini JSON response");

      return res.status(502).json({
        error: "تعذر فهم طلبك. اكتب تفاصيل المنتج بطريقة أوضح."
      });
    }

    return res.status(200).json({
      product: String(result.product || ""),
      specs: String(result.specs || ""),
      quantity: Math.max(
        1,
        parseInt(result.quantity, 10) || 1
      ),
      details: String(result.details || ""),
      missing: Array.isArray(result.missing)
        ? result.missing.map(String)
        : []
    });

  } catch (error) {
    clearTimeout(timeout);

    console.error("Gemini Connection Error:", error.name);

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
