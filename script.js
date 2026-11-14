/* AL ZAIN OIL SEAL */
const CONFIG = {
  whatsappNumber: "201114087380",
  currency: "ج.م",
  // مسار دالة الذكاء الاصطناعي (Vercel: /api/quote-ai | Netlify: /.netlify/functions/quote-ai)
  aiEndpoint: "/api/quote-ai"
};

/* طرق الدفع - عدّل الأرقام والبيانات هنا فقط */
const PAYMENT_METHODS = {
  cod:      { label: "الدفع عند الاستلام", note: "" },
  vodafone: { label: "فودافون كاش",  note: "حوّل على رقم فودافون كاش: 01061983419 ثم أرسل صورة التحويل على واتساب." },
  instapay: { label: "إنستا باي",    note: "حوّل عبر إنستا باي على الرقم: 01061983419 ثم أرسل صورة التحويل على واتساب." },
  bank:     { label: "تحويل بنكي",   note: "رقم الحساب البنكي: 1740001000020202 - بعد التحويل أرسل صورة الإيصال على واتساب." }
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
  { id: "couplings", label: "كبالنج" },
  { id: "air-curtains", label: "ستائر هواء" },
  { id: "pneumatic-seals", label: "سيلات هواء" },
  { id: "adhesives", label: "لواصق" },
  { id: "rust-removers", label: "مزيلات صدأ" }
];


const products = [
  {id:1,name:"أويل سيل",category:"oil-seal",categoryLabel:"أويل سيل",description:"مانع تسرب للاستخدامات الميكانيكية والصناعية.",size:"مقاسات متعددة",price:85,image:"./Al-Zain%20Oil%20Seal/image/اويل سيلات.png",tag:"الأكثر طلبًا"},
  {id:2,name:"أورينج مطاطي",category:"O-rings",categoryLabel:"أورينجات",description:"حلقات إحكام بمقاسات متعددة.",size:"مقاسات متعددة",price:45,image:"./Al-Zain%20Oil%20Seal/image/اورنجات.png",tag:""},
  {id:3,name:"جوانات صناعية",category:"gaskets",categoryLabel:"جوانات تصنيع",description:"جوانات لتطبيقات الإحكام الصناعية.",size:"حسب المقاس",price:65,image:"./Al-Zain%20Oil%20Seal/image/جوانات تصنيع.png",tag:""},
  {id:4,name:"ميكانيكال سيل",category:"mechanical",categoryLabel:"ميكانيكال سيل",description:"قطع إحكام ميكانيكية حسب المقاس والمواصفات.",size:"حسب المقاس",price:180,image:"./Al-Zain%20Oil%20Seal/image/ميكانيكال.png",tag:""},
  {id:5,name:"سيلات هيدروليك",category:"Hydraulic-Seals",categoryLabel:"سيلات هيدروليك",description:"مكونات إحكام للأنظمة الهيدروليكية.",size:"مقاسات متعددة",price:95,image:"./Al-Zain%20Oil%20Seal/image/سيلات هيدروليك.png",tag:""},
  {id:6,name:"خراطيم هيدروليك",category:"valves",categoryLabel:"خراطيم",description:"خراطيم للاستخدامات الصناعية والهيدروليكية.",size:"حسب الطول والمقاس",price:160,image:"./Al-Zain%20Oil%20Seal/image/خراطيم هيدروليك.png",tag:""},
  {id:7,name:"سيور صناعية",category:"belts",categoryLabel:"سيور",description:"سيور نقل حركة لمجموعة متنوعة من التطبيقات.",size:"أطوال ومقاسات مختلفة",price:160,image:"./Al-Zain%20Oil%20Seal/image/سيور واحزمه.png",tag:""},
  {id:8,name:"كبالنج",category:"couplings",categoryLabel:"كبالنج",description:"جزء ميكانيكي أساسي في نظام نقل الحركة.",size:"حسب المقاس",price:180,image:"./Al-Zain%20Oil%20Seal/image/كبالنج.png",tag:""},
  {id:9,name:"أويل سيل سوستة حراري",category:"oil-seal",categoryLabel:"أويل سيل",description:"أويل سيل بسوستة مقاوم للحرارة العالية.",size:"حسب المقاس",price:null,image:"./Al-Zain%20Oil%20Seal/image/heat-oil-seal.jpg",tag:""},
  {id:10,name:"ستائر هواء",category:"air-curtains",categoryLabel:"ستائر هواء",description:"ستائر هواء للأبواب والمداخل الصناعية والتجارية.",size:"حسب العرض",price:null,image:"./Al-Zain%20Oil%20Seal/image/air-curtain.jpg",tag:""},
  {id:11,name:"سيلات هواء",category:"pneumatic-seals",categoryLabel:"سيلات هواء",description:"سيلات للأسطوانات والأنظمة الهوائية.",size:"مقاسات متعددة",price:null,image:"./Al-Zain%20Oil%20Seal/image/pneumatic-seals.jpg",tag:""},
  {id:12,name:"لواصق لوكتايت",category:"adhesives",categoryLabel:"لواصق",description:"لواصق ومواد تثبيت وإحكام للاستخدامات الصناعية.",size:"أنواع وعبوات مختلفة",price:null,image:"./Al-Zain%20Oil%20Seal/image/loctite.jpg",tag:""},
  {id:13,name:"ميكانيكال سيل حراري",category:"mechanical",categoryLabel:"ميكانيكال سيل",description:"ميكانيكال سيل يتحمل درجات الحرارة العالية للمضخات والمعدات.",size:"حسب المقاس",price:null,image:"./Al-Zain%20Oil%20Seal/image/mechanical-heat.jpg",tag:""},
  {id:14,name:"ميكانيكالات سيل",category:"mechanical",categoryLabel:"ميكانيكال سيل",description:"تشكيلة ميكانيكال سيل بأنواع ومقاسات متعددة.",size:"مقاسات متعددة",price:null,image:"./Al-Zain%20Oil%20Seal/image/mechanical-seals.jpg",tag:""},
  {id:15,name:"سيلات فيتون أويل TC",category:"oil-seal",categoryLabel:"أويل سيل",description:"أويل سيل فيتون TC مقاوم للحرارة والزيوت.",size:"مقاسات متعددة",price:null,image:"./Al-Zain%20Oil%20Seal/image/viton-oil-seal.jpg",tag:""},
  {id:16,name:"سيليكون حراري",category:"adhesives",categoryLabel:"لواصق",description:"سيليكون RTV مقاوم للحرارة لتصنيع الجوانات والإحكام.",size:"عبوات مختلفة",price:null,image:"./Al-Zain%20Oil%20Seal/image/thermal-silicone.jpg",tag:""},
  {id:17,name:"أطقم أورينجات",category:"O-rings",categoryLabel:"أورينجات",description:"علب أورينجات مطاطية بمقاسات متنوعة.",size:"أطقم بمقاسات متعددة",price:null,image:"./Al-Zain%20Oil%20Seal/image/oring-kits.jpg",tag:""},
  {id:18,name:"مزيلات صدأ",category:"rust-removers",categoryLabel:"مزيلات صدأ",description:"بخاخات لإزالة الصدأ وتشحيم وحماية الأجزاء المعدنية.",size:"عبوات مختلفة",price:null,image:"./Al-Zain%20Oil%20Seal/image/rust-remover.jpg",tag:""},
  {id:19,name:"كاوتشة كوبلن رابر",category:"couplings",categoryLabel:"كبالنج",description:"كاوتشة كوبلن رابر لامتصاص الاهتزاز ونقل الحركة بين العمود والموتور.",size:"حسب مقاس الكوبلن",price:null,image:"./Al-Zain%20Oil%20Seal/image/coupling-rubber.jpg",tag:""},
  {id:20,name:"كاوتشة كوبلن GR",category:"couplings",categoryLabel:"كبالنج",description:"كاوتشة كوبلن GR (Coupling Rubber GR) بمقاسات متعددة.",size:"حسب مقاس الكوبلن",price:null,image:"./Al-Zain%20Oil%20Seal/image/coupling-rubber-gr.jpg",tag:""}
];


/* كتالوج الميكانيكال سيل: أسماء الأصناف من العمود الأول في ملف PDF. لا يتضمن أرقام رمق الصنف. */
const mechanicalCatalog = [
  { id: 1, name: "MS-155-12" },
  { id: 2, name: "MS-155-14" },
  { id: 3, name: "MS-155-15" },
  { id: 4, name: "MS-155-16" },
  { id: 5, name: "MS-155-18" },
  { id: 6, name: "MS-155-20" },
  { id: 7, name: "MS-155-22" },
  { id: 8, name: "MS-155-25" },
  { id: 9, name: "MS-155-28" },
  { id: 10, name: "MS-155-30" },
  { id: 11, name: "MS-155-32" },
  { id: 12, name: "MS-155-35" },
  { id: 13, name: "MS-155-40" },
  { id: 14, name: "MS-301-12" },
  { id: 15, name: "MS-301-13" },
  { id: 16, name: "MS-301-14" },
  { id: 17, name: "MS-301-17" },
  { id: 18, name: "MS-301-20" },
  { id: 19, name: "MS-301-24" },
  { id: 20, name: "MS-301-25" },
  { id: 21, name: "MS-301-28" },
  { id: 22, name: "MS-301-30" },
  { id: 23, name: "MS-301-35" },
  { id: 24, name: "MS-301-40" },
  { id: 25, name: "MS-301-45" },
  { id: 26, name: "MS-301-50" },
  { id: 27, name: "MS-551C-18" },
  { id: 28, name: "MS-551C-22" },
  { id: 29, name: "MS-551C-28" },
  { id: 30, name: "MS-551C-32" },
  { id: 31, name: "MS-551C-45" },
  { id: 32, name: "MS-58U-30" },
  { id: 33, name: "MS-58U-35" },
  { id: 34, name: "MS-58U-38" },
  { id: 35, name: "MS-58U-40" },
  { id: 36, name: "MS-58U-45" },
  { id: 37, name: "MS-58U-50" },
  { id: 38, name: "MS-960-14" },
  { id: 39, name: "MS-960-20" },
  { id: 40, name: "MS-960-22" },
  { id: 41, name: "MS-960-25" },
  { id: 42, name: "MS-960-28" },
  { id: 43, name: "MS-960-30" },
  { id: 44, name: "MS-960-32" },
  { id: 45, name: "MS-960-35" },
  { id: 46, name: "MS-960-40" },
  { id: 47, name: "MS-960-43" },
  { id: 48, name: "MS-960-50" },
  { id: 49, name: "MS-960-55" },
  { id: 50, name: "MS-960-60" },
  { id: 51, name: "MS-960-70" },
  { id: 52, name: "MS-CR-12" },
  { id: 53, name: "MS-CR-16" },
  { id: 54, name: "MS-CR-22" },
  { id: 55, name: "MS-M7N-30" },
  { id: 56, name: "MS-M7N-33" },
  { id: 57, name: "MS-M7N-35" },
  { id: 58, name: "MS-M7N-40" },
  { id: 59, name: "MS-M7N-43" },
  { id: 60, name: "MS-M7N-45" },
  { id: 61, name: "MS-M7N-50" },
  { id: 62, name: "MS-M7N-55" },
  { id: 63, name: "MS-M7N-60" },
  { id: 64, name: "MS-M7N-65" },
  { id: 65, name: "MS-MG1-12" },
  { id: 66, name: "MS-MG1-14" },
  { id: 67, name: "MS-MG1-16" },
  { id: 68, name: "MS-MG1-18" },
  { id: 69, name: "MS-MG12-12" },
  { id: 70, name: "MS-MG1-22" },
  { id: 71, name: "MS-MG12-22" },
  { id: 72, name: "MS-MG12-28" },
  { id: 73, name: "MS-MG12-30" },
  { id: 74, name: "MS-MG12-40" },
  { id: 75, name: "MS-MG12-48" },
  { id: 76, name: "MS-MG1-25" },
  { id: 77, name: "MS-MG1-28" },
  { id: 78, name: "MS-MG1-30" },
  { id: 79, name: "MS-MG1-32" },
  { id: 80, name: "MS-MG13-28" },
  { id: 81, name: "MS-MG13-38" },
  { id: 82, name: "MS-MG1-35" },
  { id: 83, name: "MS-MG1-40" },
  { id: 84, name: "MS-MG1-45" },
  { id: 85, name: "MS-MG1-50" },
  { id: 86, name: "ميكانيكال سيل FG-20" },
  { id: 87, name: "ميكانيكال سيل FG-25" },
  { id: 88, name: "ميكانيكال سيل FG-28" },
  { id: 89, name: "ميكانيكال سيل FG-30" },
  { id: 90, name: "ميكانيكال سيل FG-35" },
  { id: 91, name: "ميكانيكال سيل FG-40" },
  { id: 92, name: "ميكانيكال سيل FG-45" },
  { id: 93, name: "ميكانيكال سيل FG-55" },
  { id: 94, name: "ميكانيكال سيل هرمي 12" },
  { id: 95, name: "ميكانيكال سيل هرمي 14" },
  { id: 96, name: "ميكانيكال سيل هرمي 15" },
  { id: 97, name: "ميكانيكال سيل هرمي 16" },
  { id: 98, name: "ميكانيكال سيل هرمي18" },
  { id: 99, name: "ميكانيكال سيل هرمي20" },
  { id: 100, name: "ميكانيكال سيل هرمي 22" },
  { id: 101, name: "ميكانيكال سيل هرمي 24" },
  { id: 102, name: "ميكانيكال سيل هرمي 25" },
  { id: 103, name: "ميكانيكال سيل هرمي 28" },
  { id: 104, name: "ميكانيكال سيل هرمي 30" },
  { id: 105, name: "ميكانيكال سيل هرمي 32" },
  { id: 106, name: "ميكانيكال سيل هرمي 35" },
  { id: 107, name: "ميكانيكال سيل هرمي 38" },
  { id: 108, name: "ميكانيكال سيل هرمي 40" },
  { id: 109, name: "ميكانيكال سيل هرمي قاعدة عالية 22" },
  { id: 110, name: "ميكانيكال سيل مضغوط12" },
  { id: 111, name: "ميكانيكال سيل مضغوط13" },
  { id: 112, name: "ميكانيكال سيل مضغوط14" },
  { id: 113, name: "ميكانيكال سيل مضغوط15" },
  { id: 114, name: "ميكانيكال سيل مضغوط16" },
  { id: 115, name: "ميكانيكال سيل مضغوط17" },
  { id: 116, name: "ميكانيكال سيل مضغوط18" },
  { id: 117, name: "ميكانيكال سيل مضغوط20" },
  { id: 118, name: "ميكانيكال سيل مضغوط22" },
  { id: 119, name: "ميكانيكال سيل مضغوط24" },
  { id: 120, name: "ميكانيكال سيل مضغوط25" },
  { id: 121, name: "ميكانيكال سيل مضغوط28" },
  { id: 122, name: "ميكانيكال سيل مضغوط30" },
  { id: 123, name: "ميكانيكال سيل مضغوط32" },
  { id: 124, name: "ميكانيكال سيل مضغوط35" },
  { id: 125, name: "ميكانيكال سيل مضغوط38" },
  { id: 126, name: "ميكانيكال سيل مضغوط40" },
  { id: 127, name: "ميكانيكال سيل مضغوط45" },
  { id: 128, name: "ميكانيكال سيل مضغوط50" },
  { id: 129, name: "ميكانيكال سيل عدل16" },
  { id: 130, name: "ميكانيكال سيل عدل18" },
  { id: 131, name: "ميكانيكال سيل عدل20" },
  { id: 132, name: "ميكانيكال سيل عدل22" },
  { id: 133, name: "ميكانيكال سيل عدل24" },
  { id: 134, name: "ميكانيكال سيل عدل25" },
  { id: 135, name: "ميكانيكال سيل عدل28" },
  { id: 136, name: "ميكانيكال سيل عدل30" },
  { id: 137, name: "ميكانيكال سيل عدل32" },
  { id: 138, name: "ميكانيكال سيل عدل35" },
  { id: 139, name: "ميكانيكال سيل عدل38" },
  { id: 140, name: "ميكانيكال سيل عدل40" },
  { id: 141, name: "ميكانيكال سيل عدل50" },
  { id: 142, name: "ميكانيكال سيل عدل55" },
  { id: 143, name: "ميكانيكال سيل FG-50" },
  { id: 144, name: "ميكانيكال سيل FG-38" },
  { id: 145, name: "MS-960-45" },
  { id: 146, name: "MS-M7N-22" },
  { id: 147, name: "ميكانيكال سيل زراعي14" },
  { id: 148, name: "MS-MG13-32" },
  { id: 149, name: "MS-551C-20" },
  { id: 150, name: "ميكانيكال سيل FG-32" },
  { id: 151, name: "MS-MG13-30" },
  { id: 152, name: "MS-551B-19" },
  { id: 153, name: "MS-MG1-55" },
  { id: 154, name: "ميكانيكال سيل FG-22" },
  { id: 155, name: "ميكانيكال سيل FG-24" },
  { id: 156, name: "ميكانيكال سيل FG-18" },
  { id: 157, name: "MS-551C-15" },
  { id: 158, name: "ميكانيكال سيل FG-16" },
  { id: 159, name: "ميكانيكال سيل عدل14" },
  { id: 160, name: "ميكانيكال سيل كونكورد19" },
  { id: 161, name: "MS-M7N-48" },
  { id: 162, name: "ميكانيكال سيل FG-15" },
  { id: 163, name: "ميكانيكال سيل FG-14" },
  { id: 164, name: "ميكانيكال سيل FG-60" },
  { id: 165, name: "ميكانيكال سيل زراعي12" },
  { id: 166, name: "ميكانيكال سيل هريم قاعدة عالية 30" },
  { id: 167, name: "ميكانيكال سيل FG-75" },
  { id: 168, name: "MS-MG1-60" },
  { id: 169, name: "MS-MG1-33" },
  { id: 170, name: "MS-960-42" },
  { id: 171, name: "ميكانيكال سيل عدل12" },
  { id: 172, name: "ميكانيكال سيل هرمي 17" },
  { id: 173, name: "ميكانيكال سيل هرمي قاعدة عالية 24" },
  { id: 174, name: "ميكانيكال سيل هرمي قاعدة عالية 28" },
  { id: 175, name: "ميكانيكال سيل هرمي قاعدة عالية 32" },
  { id: 176, name: "ميكانيكال سيل عدل 20 بروحين" },
  { id: 177, name: "ميكانيكال سيل عدل 25 بروحين" },
  { id: 178, name: "ميكانيكال سيل عدل 30 بروحين" },
  { id: 179, name: "ميكانيكال سيل مضغوط55" },
  { id: 180, name: "MS-551B-22" },
  { id: 181, name: "MS-551B-24" },
  { id: 182, name: "MS-551B-25" },
  { id: 183, name: "MS-551B-28" },
  { id: 184, name: "MS-551B-30" },
  { id: 185, name: "MS-551B-35" },
  { id: 186, name: "MS-551B-40" },
  { id: 187, name: "MS-551B-50" },
  { id: 188, name: "قاعدة عالية MS-155-22" },
  { id: 189, name: "MS-58U-55" },
  { id: 190, name: "MS-551B-32" },
  { id: 191, name: "ميكانيكال سيل زراعي17" },
  { id: 192, name: "MS-551B-33" },
  { id: 193, name: "MS-551B-38" },
  { id: 194, name: "MS-551B-20" },
  { id: 195, name: "MS-551B-12" },
  { id: 196, name: "فالنشة MS-CR-12" },
  { id: 197, name: "فالنشة MS-CR-16" },
  { id: 198, name: "ميكانيكال سيل زراعي18" },
  { id: 199, name: "MS-551B-16" },
  { id: 200, name: "MS-551B-18" },
  { id: 201, name: "MS-551B-14" },
  { id: 202, name: "ميكانيكال سيل هرمي 19" },
  { id: 203, name: "ميكانيكال سيل هرمي 33" },
  { id: 204, name: "MS-960-75" },
  { id: 205, name: "MS-58U-22" },
  { id: 206, name: "MS-58U-24" },
  { id: 207, name: "MS-58U-65" },
  { id: 208, name: "قاعدة عالية سيليكون G9-65" },
  { id: 209, name: "MS-MG1-90" },
  { id: 210, name: "MS-MG1-100" },
  { id: 211, name: "MS-MG1-95" },
  { id: 212, name: "MS-MG13-45" },
  { id: 213, name: "MS-MG13-25" },
  { id: 214, name: "MS-MG13-24" },
  { id: 215, name: "MS-MG13-48" },
  { id: 216, name: "MS-MG13-20" },
  { id: 217, name: "MS-MG12-65" },
  { id: 218, name: "MS-MG13-40" },
  { id: 219, name: "MS-MG13-12" },
  { id: 220, name: "ميكانيكال سيل عدل 35 بروحين" },
  { id: 221, name: "ميكانيكال سيل عدل17" },
  { id: 222, name: "ميكانيكال سيل 25-1527 مم" },
  { id: 223, name: "ميكانيكال سيل عدل 12 بروحين" },
  { id: 224, name: "ميكانيكال سيل عدل 14 بروحين" },
  { id: 225, name: "ميكانيكال سيل عدل 16 بروحين" },
  { id: 226, name: "ميكانيكال سيل عدل 17 بروحين" },
  { id: 227, name: "ميكانيكال سيل عدل 18 بروحين" },
  { id: 228, name: "ميكانيكال سيل عدل 40 بروحين" },
  { id: 229, name: "ميكانيكال سيل زراعي16" },
  { id: 230, name: "ميكانيكال سيل هوندا 30م F12" },
  { id: 231, name: "ميكانيكال سيل هوندا 36م F16" },
  { id: 232, name: "ميكانيكال سيل هوندا 40م F20" },
  { id: 233, name: "MS-960-15" },
  { id: 234, name: "ميكانيكال سيل كونكورد25" },
  { id: 235, name: "ميكانيكال سيل هوندا 20م" },
  { id: 236, name: "قاعدة طبق G60-22" },
  { id: 237, name: "ميكانيكال سيل طبق 40 مم" },
  { id: 238, name: "ميكانيكال سيل طبق 36 مم" },
  { id: 239, name: "ميكانيكال سيل طبق 30 مم" },
  { id: 240, name: "ميكانيكال سيل طبق 28 مم" },
  { id: 241, name: "MS-MG13-16" },
  { id: 242, name: "ZX-50" },
  { id: 243, name: "قاعدة مياكنياكل T3BO-50" },
  { id: 244, name: "قاعدة مياكنياكل G9-40" },
  { id: 245, name: "قاعدة مياكنياكل T3BO-33" },
  { id: 246, name: "قاعدة مياكنياكل T3BO-38 SS" },
  { id: 247, name: "قاعدة مياكنياكل G9-32" },
  { id: 248, name: "قاعدة مياكنياكل T3BO-55 SS" },
  { id: 249, name: "قاعدة مياكنياكل T3BO-22" },
  { id: 250, name: "قاعدة مياكنياكل T3BO-18 SS" },
  { id: 251, name: "قاعدة مياكنياكل G60-43" },
  { id: 252, name: "قاعدة مياكنياكل G60-40" },
  { id: 253, name: "قاعدة مياكنياكل G60-18" },
  { id: 254, name: "قاعدة مياكنياكل G60-60" },
  { id: 255, name: "قاعدة ميكانيكال سيل فلات SS 5.5-46-25" },
  { id: 256, name: "MS-960-2.500" },
  { id: 257, name: "مروحة MS-CR-16" },
  { id: 258, name: "ميكانيكال سيل عدل 35 بروحين حراري" },
  { id: 259, name: "ميكانيكال سيل عدل 1.000" },
  { id: 260, name: "ميكانيكال سيل عدل 40 بروحين حراري" },
  { id: 261, name: "MS-J9N-40" },
  { id: 262, name: "MS-FL158-30" },
  { id: 263, name: "MS-FL1527-30" },
  { id: 264, name: "MS-MG2100-28" },
  { id: 265, name: "MS-58U-100" },
  { id: 266, name: "ميكانيكال سيل عدل 1.500" },
  { id: 267, name: "ميكانيكال سيل عدل 45 بروحيني" },
  { id: 268, name: "ميكانيكال سيل هرمي قاعدة عالية 17" },
  { id: 269, name: "ميكانيكال سيل عدل15" },
  { id: 270, name: "MS-FG13-40" },
  { id: 271, name: "MS-FG13-32" },
  { id: 272, name: "MS-MG13-55" },
  { id: 273, name: "ميكانيكال سيل عدل 13" },
  { id: 274, name: "قاعدة ميكانيكال سيل T7G9-16 MM VITON" },
  { id: 275, name: "MS-FG12-38" },
  { id: 276, name: "MS-58U-18" },
  { id: 277, name: "ميكانيكال سيل تيفلون 35 مم" },
  { id: 278, name: "MS-155-13" },
  { id: 279, name: "MS-M7N-100" },
  { id: 280, name: "MS-FG13-38" },
  { id: 281, name: "ميكانيكال سيل عدل 25 بروحين حراري" },
  { id: 282, name: "ميكانيكال سيل حراري فليجيت 35 مم" },
  { id: 283, name: "MS-MG-2100-32" },
  { id: 284, name: "MS-FG13-55" },
  { id: 285, name: "ميكانيكال سيل عدل 30 بروحين حراري" },
  { id: 286, name: "MS-MG2100-42" },
  { id: 287, name: "قاعدة خابور 40" },
  { id: 288, name: "ميكانيكال سيل كارتريدج 35" },
  { id: 289, name: "MS-551B-17" }
];

/* مكان الصور: داخل فولدر Al-Zain Oil Seal (أو على الجهاز) = image/ ، ومن جذر الموقع = Al-Zain%20Oil%20Seal/image/ */
const IMG_BASE = decodeURIComponent(location.pathname).includes("/Al-Zain Oil Seal/") ? "image/" : "Al-Zain%20Oil%20Seal/image/";
const imgSrc = path => String(path).replace(/^(\.\/)?image\//, IMG_BASE);

let cart = [];
const $ = selector => document.querySelector(selector);
const productGrid = $("#productGrid");
const categoryFilter = $("#categoryFilter");
const searchInput = $("#searchInput");
const sizeSearchInput = $("#sizeSearchInput");
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

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[ؤئ]/g, "ء")
    .replace(/[ـ]/g, "")
    .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[×*]/g, " ")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderProducts() {
  const query = normalizeSearchText(searchInput.value);
  const category = categoryFilter.value;
  const sizeQuery = sizeSearchInput ? sizeSearchInput.value.trim() : "";
  let sizeCategories = null;

  if (sizeQuery) {
    const nums = parseNumbers(sizeQuery);
    if (nums.length && SIZE_LIST.length) {
      const found = searchSizes(nums, "all");
      const types = new Set([...found.exact, ...found.partial].map(item => item.type));
      if (types.size) sizeCategories = types;
    }
  }

  const matchesSize = product => !sizeQuery || (sizeCategories
    ? sizeCategories.has(product.category)
    : `${product.name} ${product.size}`.toLowerCase().includes(sizeQuery.toLowerCase()));

  // البحث في المنتجات الظاهرة يكون باسم الصنف/التصنيف فقط، وليس الوصف أو رقم الصنف.
  const filtered = products.filter(product => {
    const matchesCategory = category === "all" || product.category === category;
    const searchableName = normalizeSearchText(`${product.name} ${product.categoryLabel}`);
    const matchesQuery = !query || searchableName.includes(query);
    return matchesCategory && matchesQuery && matchesSize(product);
  });

  // كتالوج الميكانيكال: البحث في اسم الصنف بالعمود الأول من PDF فقط.
  let catalogMatches = [];
  // لا نعرض أصناف الكتالوج عند فتح الصفحة؛ تظهر فقط بعد كتابة بحث في خانة اسم الصنف.
  if (query && (category === "all" || category === "mechanical")) {
    catalogMatches = mechanicalCatalog.filter(item => {
      const searchableName = normalizeSearchText(`ميكانيكال سيل ${item.name}`);
      const matchesName = !query || searchableName.includes(query);
      if (!matchesName) return false;
      if (!sizeQuery) return true;
      const sizeNumbers = parseNumbers(sizeQuery);
      if (!sizeNumbers.length) return normalizeSearchText(item.name).includes(normalizeSearchText(sizeQuery));
      if (sizeCategories && !sizeCategories.has("mechanical")) return false;
      const itemNumbers = parseNumbers(item.name);
      return sizeNumbers.every(number => itemNumbers.includes(number));
    });
  }

  // نعرض كل النتائج المطابقة حتى لا تختفي أصناف من الكتالوج عن العميل.
  const shownCatalogMatches = catalogMatches;
  const productCards = filtered.map(product => `
    <article class="product-card" data-category="${escapeHtml(product.category)}">
      <div class="product-visual">
        ${product.tag ? `<span class="product-tag">${escapeHtml(product.tag)}</span>` : ""}
        <img src="${escapeHtml(imgSrc(product.image))}" alt="${escapeHtml(product.name)}" loading="lazy">
      </div>
      <div class="product-info">
        <p class="product-category">${escapeHtml(product.categoryLabel)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="product-bottom">
          <span class="price" hidden></span>
          <button class="quote-product" data-quote="${product.id}">طلب عرض سعر ↗</button>
          <button class="add-button" data-add="${product.id}" aria-label="أضف ${escapeHtml(product.name)} إلى السلة">+</button>
        </div>
      </div>
    </article>
  `).join("");

  const catalogCards = shownCatalogMatches.map(item => `
    <article class="product-card mechanical-catalog-card" data-category="mechanical">
      <div class="product-info">
        <p class="product-category">ميكانيكال سيل - من الكتالوج</p>
        <h3>${escapeHtml(item.name)}</h3>
        <p>صنف من كتالوج الميكانيكال سيل. اطلب عرض سعر للتأكد من التوفر والمواصفات.</p>
        <div class="product-bottom">
          <span class="price" hidden></span>
          <button class="quote-product" data-catalog-quote="${item.id}">طلب عرض سعر ↗</button>
        </div>
      </div>
    </article>
  `).join("");

  const catalogNotice = catalogMatches.length && query
    ? `<p class="catalog-results-note" style="grid-column:1/-1">نتائج كتالوج الميكانيكال سيل: ${catalogMatches.length} صنف</p>`
    : "";

  productGrid.innerHTML = productCards + catalogNotice + catalogCards;

  const empty = $("#emptyState");
  const hasResults = filtered.length > 0 || catalogMatches.length > 0;
  empty.hidden = hasResults;
  if (!hasResults) {
    if (sizeQuery) {
      empty.replaceChildren(document.createTextNode("لم نجد منتجات بهذا المقاس في القائمة، وده لا يعني إنه غير متوفر. "));
      const button = makeEl("button", "quote-product", "اطلب عرض سعر بهذا المقاس ↗");
      button.type = "button";
      button.dataset.sizeEmptyQuote = "1";
      empty.appendChild(button);
    } else if (query) {
      empty.textContent = "لم نجد صنفًا بهذا الاسم في المنتجات أو كتالوج الميكانيكال سيل.";
    } else {
      empty.textContent = "لا توجد منتجات في هذا التصنيف.";
    }
  }

  revealOnScroll(productGrid.querySelectorAll(".product-card"));
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
  if (!product) return;

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
    return sum + (product.price || 0) * item.quantity;
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

/* ===== طرق الدفع ===== */
function getPayment() {
  const key = document.querySelector('input[name="payment"]:checked')?.value || "cod";
  return PAYMENT_METHODS[key] || PAYMENT_METHODS.cod;
}

function updatePaymentNote() {
  $("#paymentNote").textContent = getPayment().note;
}

function cartMessage(asQuote = false) {
  const rows = cart.map(item => {
    const product = products.find(row => row.id === item.id);
    return `- ${product.name} | الكمية: ${item.quantity}`;
  }).join("\n");

  const payment = asQuote ? "" : `طريقة الدفع: ${getPayment().label}\n`;

  return `مرحبًا AL ZAIN OIL SEAL،
${asQuote ? "أرغب في طلب عرض سعر للمنتجات التالية:" : "أرغب في تأكيد طلب المنتجات التالية:"}
${rows}
${payment}
يرجى تأكيد التوفر والسعر النهائي وتكلفة الشحن.`;
}

/* ===== حفظ الطلبات لتظهر في لوحة admin.html ===== */
function saveRequest(payload) {
  try {
    fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  } catch (error) {}
}

function cartItemsText() {
  return cart.map(item => {
    const product = products.find(row => row.id === item.id);
    return `${product.name} × ${item.quantity}`;
  }).join("\n");
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

/* ===== طلب عرض السعر بالذكاء الاصطناعي ===== */
const AI_BTN_TEXT = "✨ املأ البيانات تلقائيًا بالذكاء الاصطناعي";

async function aiFillQuote() {
  const aiBtn = $("#aiFillBtn");
  const text = $("#aiText").value.trim();
  if (!text) return showToast("اكتب طلبك أولًا في المربع");

  const form = $("#quoteForm");
  const box = $("#aiMissing");
  aiBtn.disabled = true;
  aiBtn.textContent = "جارٍ التحليل...";
  box.hidden = true;

  try {
    if (location.protocol === "file:") {
      throw new Error("الذكاء الاصطناعي لا يعمل من ملف على الجهاز، يعمل فقط بعد رفع الموقع على Vercel.");
    }

    let res;
    try {
      res = await fetch(CONFIG.aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
    } catch (netErr) {
      throw new Error("تعذر الاتصال بالسيرفر. تأكد من اتصال الإنترنت.");
    }

    const data = await res.json().catch(() => ({}));

    if (res.status === 404 || res.status === 405) {
      throw new Error("دالة الذكاء الاصطناعي غير موجودة على الموقع (الملف api/quote-ai.js غير مرفوع أو الموقع ليس على Vercel). (" + res.status + ")");
    }
    if (!res.ok) throw new Error((data.error || "خطأ غير معروف") + " (" + res.status + ")");

    if (data.product)  form.elements.product.value  = data.product;
    if (data.specs)    form.elements.specs.value    = data.specs;
    if (data.quantity) form.elements.quantity.value = data.quantity;
    if (data.details)  form.elements.details.value  = data.details;

    if (Array.isArray(data.missing) && data.missing.length) {
      box.textContent = "⚠️ ينقصنا: " + data.missing.join("، ");
      box.hidden = false;
    }
    showToast("تم ملء البيانات، راجعها قبل الإرسال");
  } catch (err) {
    box.textContent = "⚠️ " + err.message + " يمكنك ملء البيانات يدويًا.";
    box.hidden = false;
  } finally {
    aiBtn.disabled = false;
    aiBtn.textContent = AI_BTN_TEXT;
  }
}

/* ===== البحث بالمقاس ===== */
function parseNumbers(value) {
  const latin = String(value)
    .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/٫/g, ".");
  return (latin.match(/\d+(?:\.\d+)?/g) || []).map(Number);
}

const SIZE_LIST = (typeof SIZES !== "undefined" && Array.isArray(SIZES) ? SIZES : [])
  .map(item => ({ type: item.t || "", note: item.n || "", nums: parseNumbers(item.s || "") }))
  .filter(item => item.nums.length);

function sizeText(nums) {
  return nums.join(" × ") + " مم";
}

function categoryLabel(id) {
  return (categories.find(category => category.id === id) || {}).label || "";
}

function searchSizes(nums, type) {
  const pool = SIZE_LIST.filter(item => type === "all" || item.type === type);
  const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
  const key = a => [...a].sort((x, y) => x - y).join("|");

  const exact = pool.filter(item => same(item.nums, nums));
  const prefix = pool.filter(item =>
    item.nums.length > nums.length && nums.every((v, i) => item.nums[i] === v));
  const reordered = pool.filter(item =>
    !exact.includes(item) && item.nums.length === nums.length && key(item.nums) === key(nums));

  return { exact, partial: [...prefix, ...reordered].slice(0, 30) };
}

function makeEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function quoteButton(label, type, nums, className) {
  const button = makeEl("button", className, label);
  button.type = "button";
  button.dataset.sizeQuote = "1";
  button.dataset.type = type;
  button.dataset.size = sizeText(nums);
  return button;
}

function renderSizeResults(nums, type) {
  const box = $("#sizeResults");
  const { exact, partial } = searchSizes(nums, type);
  box.replaceChildren();

  box.appendChild(makeEl("p", "size-title", "نتيجة البحث عن: " + sizeText(nums)));

  const addRows = (items, heading) => {
    if (!items.length) return;
    box.appendChild(makeEl("p", "size-sub", heading));
    items.forEach(item => {
      const row = makeEl("div", "size-row");
      row.appendChild(makeEl("span", "size-type", categoryLabel(item.type) || "منتج"));
      row.appendChild(makeEl("strong", "size-value", sizeText(item.nums)));
      if (item.note) row.appendChild(makeEl("span", "size-note", item.note));
      row.appendChild(quoteButton("اطلب عرض سعر", item.type, item.nums, "btn btn-outline size-btn"));
      box.appendChild(row);
    });
  };

  addRows(exact, "✓ مقاس مطابق");
  addRows(partial, "مقاسات قريبة");

  if (!exact.length) {
    box.appendChild(makeEl("p", "size-empty",
      "لم نجد هذا المقاس في القائمة المعروضة على الموقع، وده لا يعني إنه غير متوفر. اطلب عرض سعر ونرد عليك بالتوفر والسعر."));
  }

  box.appendChild(quoteButton("لم تجد مقاسك؟ اطلب عرض سعر بهذا المقاس", type === "all" ? "" : type, nums, "btn btn-gold size-btn size-cta"));
}

function setupSizeFinder() {
  const select = $("#sizeType");
  if (!select) return;

  const all = document.createElement("option");
  all.value = "all";
  all.textContent = "كل الأنواع";
  select.appendChild(all);

  categories.filter(category => category.id !== "all").forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.label;
    select.appendChild(option);
  });

  $("#sizeForm").addEventListener("submit", event => {
    event.preventDefault();
    const nums = parseNumbers($("#sizeInput").value);
    if (!nums.length) return showToast("اكتب المقاس بالأرقام، مثال: 25×40×7");
    renderSizeResults(nums, select.value);
  });

  $("#sizeResults").addEventListener("click", event => {
    const button = event.target.closest("[data-size-quote]");
    if (!button) return;

    const form = $("#quoteForm");
    const label = categoryLabel(button.dataset.type);
    if (label) form.elements.product.value = label;
    form.elements.specs.value = button.dataset.size;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    form.elements.customer.focus({ preventScroll: true });
  });
}

/* ===== ظهور العناصر عند التمرير (مطلوب لتنسيقات .scroll-reveal و .is-visible في extras.css) ===== */
const revealObserver = ("IntersectionObserver" in window)
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" })
  : null;

function revealOnScroll(elements) {
  elements.forEach(element => {
    if (element.classList.contains("is-visible")) return;
    element.classList.add("scroll-reveal");
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add("is-visible");
  });
}

/* ===== الشريط المتحرك أعلى الصفحة ===== */
function setupAnnouncement() {
  const bar = document.querySelector(".announcement");
  const track = bar && bar.querySelector(".announcement-track");
  const first = track && track.querySelector(".announcement-group");
  if (!first) return;

  track.querySelectorAll("[data-clone]").forEach(node => node.remove());
  track.style.animation = "none";
  bar.style.justifyContent = "flex-start";

  const width = first.getBoundingClientRect().width;
  if (!width) return;

  const copies = Math.ceil(bar.clientWidth / width) + 1;
  for (let i = 0; i < copies; i++) {
    const clone = first.cloneNode(true);
    clone.dataset.clone = "1";
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  track.style.setProperty("--shift", width + "px");
  track.style.animation = `announcementScroll ${Math.max(12, width / 60)}s linear infinite`;
}

/* ===== الفيديو: زر الصوت + تشغيل الفيديو وهو ظاهر فقط ===== */
function setupVideos() {
  const frames = document.querySelectorAll(".media-frame");

  const syncButtons = () => {
    frames.forEach(frame => {
      const video = frame.querySelector("video");
      const button = frame.querySelector(".sound-btn");
      if (!video || !button) return;
      button.textContent = video.muted ? "🔇" : "🔊";
      button.setAttribute("aria-label", video.muted ? "تشغيل الصوت" : "كتم الصوت");
    });
  };

  frames.forEach(frame => {
    const video = frame.querySelector("video");
    const button = frame.querySelector(".sound-btn");
    if (!video) return;

    if (button) {
      button.addEventListener("click", () => {
        video.muted = !video.muted;
        if (!video.muted) {
          frames.forEach(other => {
            const otherVideo = other.querySelector("video");
            if (otherVideo && otherVideo !== video) otherVideo.muted = true;
          });
          video.play().catch(() => {});
        }
        syncButtons();
      });
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      }, { threshold: 0.25 }).observe(video);
    }
  });

  syncButtons();
}

/* خيارات طريقة الدفع في فورم عرض السعر (من نفس قائمة PAYMENT_METHODS) */
function setupQuotePayment() {
  const select = $("#quotePayment");
  if (!select) return;
  Object.entries(PAYMENT_METHODS).forEach(([key, method]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = method.label;
    select.appendChild(option);
  });
}

/* تشغيل المتجر */
setupQuotePayment();
setupSizeFinder();
setupCategories();
renderProducts();
renderCart();
updatePaymentNote();
$("#year").textContent = new Date().getFullYear();
revealOnScroll(document.querySelectorAll(".benefits, .media-section, .quote-section, .about-section, .manager-section, .contact-strip"));
setupAnnouncement();
setupVideos();

searchInput.addEventListener("input", renderProducts);
if (sizeSearchInput) sizeSearchInput.addEventListener("input", renderProducts);

$("#emptyState").addEventListener("click", event => {
  if (!event.target.closest("[data-size-empty-quote]")) return;
  const form = $("#quoteForm");
  const nums = parseNumbers(sizeSearchInput ? sizeSearchInput.value : "");
  form.elements.specs.value = nums.length ? sizeText(nums) : (sizeSearchInput ? sizeSearchInput.value.trim() : "");
  const label = categoryFilter.value !== "all" ? categoryLabel(categoryFilter.value) : "";
  if (label) form.elements.product.value = label;
  form.scrollIntoView({ behavior: "smooth", block: "center" });
  form.elements.customer.focus({ preventScroll: true });
});

window.addEventListener("load", setupAnnouncement);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(setupAnnouncement);
let announcementTimer;
window.addEventListener("resize", () => {
  clearTimeout(announcementTimer);
  announcementTimer = setTimeout(setupAnnouncement, 250);
});
categoryFilter.addEventListener("change", () => selectCategory(categoryFilter.value));

categoryChips.addEventListener("click", event => {
  const chip = event.target.closest("[data-category]");
  if (chip) selectCategory(chip.dataset.category);
});

productGrid.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const quote = event.target.closest("[data-quote]");
  const catalogQuote = event.target.closest("[data-catalog-quote]");

  if (add) addToCart(Number(add.dataset.add));

  if (catalogQuote) {
    const item = mechanicalCatalog.find(row => row.id === Number(catalogQuote.dataset.catalogQuote));
    if (item) {
      const form = $("#quoteForm");
      form.elements.product.value = `ميكانيكال سيل - ${item.name}`;
      form.elements.specs.value = "";
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      form.elements.specs.focus({ preventScroll: true });
    }
  }

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

$("#paymentMethods").addEventListener("change", updatePaymentNote);

$("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) return showToast("السلة فارغة، أضف المنتجات أولًا");
  saveRequest({ type: "order", items: cartItemsText(), payment: getPayment().label });
  openWhatsApp(cartMessage(false));
});

$("#quoteCartButton").addEventListener("click", () => {
  if (!cart.length) return showToast("السلة فارغة، أضف المنتجات أولًا");
  saveRequest({ type: "cart-quote", items: cartItemsText() });
  openWhatsApp(cartMessage(true));
});

$("#aiFillBtn").addEventListener("click", aiFillQuote);

$("#quoteForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const paymentLabel = PAYMENT_METHODS[data.get("payment")]?.label || "غير محددة";

  const message = `مرحبًا AL ZAIN OIL SEAL، أريد طلب عرض سعر.
الاسم/الشركة: ${data.get("customer")}
رقم الهاتف: ${data.get("phone")}
المنتج: ${data.get("product")}
المقاس/المواصفات: ${data.get("specs") || "غير محدد"}
الكمية: ${data.get("quantity")}
طريقة الدفع المفضلة: ${paymentLabel}
تفاصيل إضافية: ${data.get("details") || "لا توجد"}
برجاء تأكيد السعر والتوفر.`;


  saveRequest({
    type: "quote",
    customer: data.get("customer"),
    phone: data.get("phone"),
    product: data.get("product"),
    specs: data.get("specs"),
    quantity: data.get("quantity"),
    payment: paymentLabel,
    details: data.get("details")
  });

  openWhatsApp(message);
});

const WA_GREETING = "مرحبًا AL ZAIN OIL SEAL، أريد الاستفسار عن المنتجات والأسعار.";

["#contactWhatsapp"].forEach(selector => {
  const el = $(selector);
  if (!el) return;
  el.addEventListener("click", event => {
    event.preventDefault();
    openWhatsApp(WA_GREETING);
  });
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


/* مسارات بديلة للصور: تجرّب أماكن مختلفة (تعمل على الموقع وعلى الجهاز) */
document.addEventListener("error", event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement)) return;

  const tried = Number(img.dataset.retry || 0);
  const current = new URL(img.getAttribute("src"), location.href).href;
  const file = decodeURIComponent(current.split("/").pop().split("?")[0]);
  const swapped = /^logo\.png$/i.test(file) ? (file === "Logo.png" ? "logo.png" : "Logo.png") : file;
  const name = encodeURIComponent(file);
  const alt = encodeURIComponent(swapped);

  const options = [
    "Al-Zain%20Oil%20Seal/image/" + name,
    "image/" + name,
    name,
    "Al-Zain%20Oil%20Seal/image/" + alt,
    "image/" + alt,
    alt
  ]
    .map(path => new URL(path, location.href).href)
    .filter((href, i, list) => href !== current && list.indexOf(href) === i);

  if (tried < options.length) {
    img.dataset.retry = tried + 1;
    img.src = options[tried];
  }
}, true);
