const nationalIdInput = document.getElementById("nationalId");
const passwordInput   = document.getElementById("password");
const locationInput   = document.getElementById("location");
const deviceInput     = document.getElementById("device");
const ipInput         = document.getElementById("ip");
const failsInput      = document.getElementById("fails");
const hourInput       = document.getElementById("hour");

const riskScoreEl     = document.getElementById("riskScore");
const riskLevelPill   = document.getElementById("riskLevelPill");
const decisionTextEl  = document.getElementById("decisionText");
const reasonsListEl   = document.getElementById("reasonsList");
const summaryBoxEl    = document.getElementById("summaryBox");

document.getElementById("analyzeBtn").addEventListener("click", () => {

    const id     = nationalIdInput.value.trim();
    const pass   = passwordInput.value.trim();
    const loc    = locationInput.value;
    const dev    = deviceInput.value;
    const ip     = ipInput.value;
    const fails  = Number(failsInput.value);
    const hour   = Number(hourInput.value);

    if (!id || !pass) {
        decisionTextEl.innerHTML = "❗ يرجى إدخال رقم الهوية وكلمة المرور.";
        return;
    }

    const locVal = (loc === "different") ? 1 : 0;
    const devVal = (dev === "new")       ? 1 : 0;
    const ipVal  = (ip === "good") ? 0 : (ip === "suspicious" ? 1 : 2);

    // قواعد الخطورة
    let risk = 0;
    const reasons = [];

    if (locVal) { risk+=25; reasons.push("تسجيل الدخول من منطقة مختلفة."); }
    if (devVal) { risk+=20; reasons.push("الدخول من جهاز جديد غير معروف."); }
    if (ipVal === 1) { risk+=20; reasons.push("عنوان IP مشبوه."); }
    if (ipVal === 2) { risk+=35; reasons.push("عنوان IP سيئ السمعة."); }
    if (fails >= 1) { risk+=10; reasons.push("محاولات فاشلة سابقة."); }
    if (fails >= 3) { risk+=10; reasons.push("عدة محاولات فاشلة."); }
    if (hour < 5 || hour > 23) { risk+=15; reasons.push("وقت دخول غير معتاد."); }

    risk = Math.min(100, risk);

    // حالة آمنة جدًا
    if (!locVal && !devVal && ipVal === 0 && fails <= 1 && hour >= 6 && hour <= 23) {
        risk = Math.min(risk, 25);
    }

    riskScoreEl.textContent = `${risk}%`;

    // القرار
    let level, lines = [];

    if (risk < 35) {
        level = "SAFE";
        lines = [
            "SAFE – السلوك طبيعي.",
            "لا توجد مؤشرات خطورة.",
            "Final decision: ALLOW – السماح بالدخول."
        ];
    }
    else if (risk < 70) {
        level = "SUSPICIOUS";
        lines = [
            "SUSPICIOUS – مستوى خطورة متوسط.",
            "Step-up: مطلوب تحقق حيوي عبر نفاذ (بصمة / وجه).",
            "Nafath result: VERIFIED.",
            "Final decision: ALLOW – السماح بالدخول بعد التحقق."
        ];
    }
    else {
        level = "HIGH RISK";
        lines = [
            "HIGH RISK – مستوى خطورة عالٍ.",
            "تم اكتشاف مؤشرات خطيرة.",
            "Final decision: BLOCK – تم حظر محاولة الدخول."
        ];
    }
    // تلوين مؤشر المستوى مثل قبل
let pillBg = "";
let pillColor = "#000";

if (level === "SAFE") {
    pillBg = "linear-gradient(135deg, #1f8b4d, #a4c639)"; // أخضر
    pillColor = "#000";
} else if (level === "SUSPICIOUS") {
    pillBg = "linear-gradient(135deg, #c7831b, #ffc857)"; // أصفر/برتقالي
    pillColor = "#000";
} else if (level === "HIGH RISK") {
    pillBg = "linear-gradient(135deg, #b3261e, #ff5a5a)"; // أحمر
    pillColor = "#fff";
}

riskLevelPill.textContent = level;
riskLevelPill.style.background = pillBg;
riskLevelPill.style.color = pillColor;
riskLevelPill.style.border = "none";


    riskLevelPill.textContent = level;

    // سطر تحت سطر
    decisionTextEl.innerHTML = lines.join("<br>");

    // أسباب القرار
    reasonsListEl.innerHTML = reasons.map(r => `<li>${r}</li>`).join("");

    // ملخص
    summaryBoxEl.textContent =
        `User: ${id}\nLocation: ${loc}\nDevice: ${dev}\nIP Reputation: ${ip}\nFailed Attempts: ${fails}\nHour: ${hour}`;
});
