/**
 * ===================================================
 * ملف: calculator.js
 * الوصف: منطق حاسبة الطاقة الشمسية
 *
 * للباك اند:
 * ═══════════════════════════════════════════════
 * الحساب الحالي يعمل بالكامل على الفرونت اند
 * لأغراض العرض والتفاعل الفوري.
 *
 * عند ربط الباك اند، غيّر دالة calculateSystem()
 * لترسل البيانات إلى endpoint التالي:
 *   POST /api/calculate
 *   Body: { appliances: [{id, qty, watt}], hours, region_id }
 *   Response: { panels, batteries, daily_kwh, monthly_savings, recommended_products }
 *
 * === بيانات الأجهزة ===
 * كل جهاز له:
 *   - id: معرف فريد
 *   - name: الاسم
 *   - watt: استهلاكه بالواط
 *   - icon: اسم الأيقونة من Material Symbols
 *
 * === معامل الإشعاع الشمسي (Solar Irradiance Factor) ===
 * يختلف حسب المنطقة الجغرافية:
 *   الرياض: 6.5 ساعة شمس فعالة/يوم  (إشعاع مرتفع)
 *   جدة:    5.5 ساعة شمس فعالة/يوم  (إشعاع متوسط)
 *   أبها:   4.5 ساعة شمس فعالة/يوم  (إشعاع متنوع)
 *
 * === معادلة الحساب ===
 *   الاستهلاك اليومي (kWh) = (Σ(واط × عدد × ساعات)) / 1000
 *   عدد الألواح = الاستهلاك اليومي / (قدرة اللوح kW × ساعات إشعاع)
 *   عدد البطاريات = (الاستهلاك الليلي) / (سعة البطارية kWh × كفاءة 0.85)
 * ═══════════════════════════════════════════════
 */

'use strict';

/* ==========================================
   1. بيانات الأجهزة
   للباك اند: هذه البيانات يجب أن تُجلب من:
              GET /api/appliances
              لكنها هنا كبيانات ثابتة للعرض
   ========================================== */
const APPLIANCES = [
    { id: 'led',        name: 'إضاءة LED',       watt: 10,   icon: 'lightbulb',         defaultQty: 12 },
    { id: 'ac',         name: 'مكيف (1.5 طن)',   watt: 1500, icon: 'ac_unit',           defaultQty: 2  },
    { id: 'fridge',     name: 'ثلاجة',            watt: 150,  icon: 'kitchen',           defaultQty: 1  },
    { id: 'tv',         name: 'تلفاز',            watt: 100,  icon: 'tv',               defaultQty: 3  },
    { id: 'microwave',  name: 'مايكروويف',        watt: 1000, icon: 'microwave',         defaultQty: 1  },
    { id: 'laptop',     name: 'أجهزة كمبيوتر',   watt: 60,   icon: 'laptop',           defaultQty: 2  },
    { id: 'pump',       name: 'مضخة مياه',        watt: 750,  icon: 'water_drop',        defaultQty: 1  },
];

/* ==========================================
   2. بيانات المناطق الجغرافية
   للباك اند: يجب أن تُجلب من:
              GET /api/regions
              الحقول: id, name, solar_hours (ساعات الشمس الفعالة يومياً)
   ========================================== */
const REGIONS = [
    { id: 'riyadh', name: 'الرياض - إشعاع مرتفع',  solarHours: 6.5 },
    { id: 'jeddah', name: 'جدة - إشعاع متوسط',      solarHours: 5.5 },
    { id: 'abha',   name: 'أبها - إشعاع متنوع',     solarHours: 4.5 },
];

/* ==========================================
   3. ثوابت الحساب
   ========================================== */
// قدرة اللوح الشمسي الواحد (كيلو واط)
const PANEL_WATT = 0.4;           // 400 واط = 0.4 كيلو واط

// سعة البطارية الواحدة (كيلو واط ساعة)
const BATTERY_KWH = 5;

// كفاءة البطارية
const BATTERY_EFFICIENCY = 0.85;

// نسبة الاستهلاك الليلي (يحتاج بطاريات)
const NIGHT_USAGE_RATIO = 0.4;

// حد التصنيف: "استهلاك متوسط" = أقل من 20 kWh/يوم
const MEDIUM_LOAD_THRESHOLD = 20;

/* ==========================================
   4. حالة التطبيق (State)
   يحتفظ بجميع بيانات الإدخال الحالية
   ========================================== */
const state = {
    // كميات الأجهزة { appliance_id: quantity }
    appliances: {},

    // عدد ساعات التشغيل اليومية
    dailyHours: 8,

    // المنطقة الجغرافية المختارة
    region: 'riyadh',

    // نتائج الحساب
    results: {
        dailyKwh: 0,
        panels: 0,
        batteries: 0,
        loadPercentage: 0,
    }
};

/* ==========================================
   5. تهيئة الصفحة عند التحميل
   ========================================== */
document.addEventListener('DOMContentLoaded', function () {
    initAppliances();
    initRangeSlider();
    initRegionSelector();
    calculateSystem();  // حساب أولي بالقيم الافتراضية
});

/* ==========================================
   6. تهيئة بطاقات الأجهزة
   ========================================== */
function initAppliances() {
    const grid = document.getElementById('appliances-grid');
    if (!grid) return;

    // تعيين القيم الافتراضية
    APPLIANCES.forEach(function (appliance) {
        state.appliances[appliance.id] = appliance.defaultQty;
    });

    // إنشاء بطاقة لكل جهاز
    APPLIANCES.forEach(function (appliance) {
        const card = createApplianceCard(appliance);
        grid.insertBefore(card, grid.lastElementChild); // إدراج قبل زر "جهاز إضافي"
    });
}

/**
 * إنشاء بطاقة جهاز منزلي
 * للباك اند: data-id يُطابق id الجهاز في قاعدة البيانات
 *             data-watt يُستخدم في حسابات الطاقة
 */
function createApplianceCard(appliance) {
    const card = document.createElement('div');
    card.className = 'appliance-card' + (appliance.defaultQty > 0 ? ' selected' : '');
    card.setAttribute('data-id', appliance.id);
    card.setAttribute('data-watt', appliance.watt);

    card.innerHTML = `
        <div class="appliance-icon-wrapper">
            <span class="material-symbols-outlined text-primary text-3xl">${appliance.icon}</span>
        </div>
        <span class="appliance-name">${appliance.name}</span>
        <div class="qty-control">
            <button class="qty-btn" data-action="decrease" data-id="${appliance.id}"
                    aria-label="تقليل عدد ${appliance.name}"
                    ${appliance.defaultQty <= 0 ? 'disabled' : ''}>−</button>
            <span class="qty-value" id="qty-${appliance.id}">${appliance.defaultQty}</span>
            <button class="qty-btn" data-action="increase" data-id="${appliance.id}"
                    aria-label="زيادة عدد ${appliance.name}">+</button>
        </div>
    `;

    // ربط أحداث الأزرار
    card.querySelectorAll('.qty-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // منع حدث النقر على البطاقة
            handleQtyChange(appliance.id, btn.dataset.action);
        });
    });

    // نقر على البطاقة يُعيد تفعيل الجهاز إن كان معطلاً
    card.addEventListener('click', function () {
        if (state.appliances[appliance.id] === 0) {
            handleQtyChange(appliance.id, 'increase');
        }
    });

    return card;
}

/**
 * معالجة تغيير عدد الجهاز
 * @param {string} id     - معرف الجهاز
 * @param {string} action - 'increase' أو 'decrease'
 */
function handleQtyChange(id, action) {
    const current = state.appliances[id] || 0;
    const newQty = action === 'increase' ? current + 1 : Math.max(0, current - 1);

    // تحديث الحالة
    state.appliances[id] = newQty;

    // تحديث الواجهة
    const qtyEl = document.getElementById('qty-' + id);
    if (qtyEl) qtyEl.textContent = newQty;

    // تحديث حالة الزر "-"
    const card = document.querySelector(`[data-id="${id}"].appliance-card`);
    if (card) {
        const decreaseBtn = card.querySelector('[data-action="decrease"]');
        if (decreaseBtn) {
            decreaseBtn.disabled = newQty <= 0;
        }
        // تمييز البطاقة بناءً على الاختيار
        card.classList.toggle('selected', newQty > 0);
    }

    // إعادة الحساب
    calculateSystem();
}

/* ==========================================
   7. تهيئة شريط ساعات التشغيل
   ========================================== */
function initRangeSlider() {
    const slider = document.getElementById('hours-slider');
    const display = document.getElementById('hours-display');

    if (!slider || !display) return;

    slider.min = 4;
    slider.max = 24;
    slider.value = state.dailyHours;
    slider.step = 1;

    slider.addEventListener('input', function () {
        state.dailyHours = parseInt(this.value);
        display.textContent = state.dailyHours + ' ساعات يومياً';

        // تغيير نص العرض حسب القيمة
        if (state.dailyHours <= 6) {
            display.textContent = state.dailyHours + ' ساعات يومياً';
        } else if (state.dailyHours <= 12) {
            display.textContent = state.dailyHours + ' ساعة يومياً';
        } else if (state.dailyHours === 24) {
            display.textContent = '24 ساعة (مستمر)';
        } else {
            display.textContent = state.dailyHours + ' ساعة يومياً';
        }

        calculateSystem();
    });
}

/* ==========================================
   8. تهيئة اختيار المنطقة
   ========================================== */
function initRegionSelector() {
    const select = document.getElementById('region-select');
    if (!select) return;

    select.addEventListener('change', function () {
        state.region = this.value;
        calculateSystem();
    });
}

/* ==========================================
   9. دالة الحساب الرئيسية
   ═══════════════════════════════════════
   للباك اند: استبدل هذه الدالة بطلب API:
   ─────────────────────────────────────
   async function calculateSystem() {
       const data = buildRequestData();
       try {
           showLoadingState();
           const result = await RadiantSolar.apiRequest('/api/calculate', 'POST', data);
           updateResultsUI(result.panels, result.batteries,
                          result.daily_kwh, result.load_percentage);
           updateRecommendations(result.recommended_products);
       } catch (error) {
           console.error('خطأ في الحساب:', error);
       } finally {
           hideLoadingState();
       }
   }
   ═══════════════════════════════════════
   ========================================== */
function calculateSystem() {
    // 1. حساب الاستهلاك الكلي (واط)
    let totalWatt = 0;
    APPLIANCES.forEach(function (appliance) {
        const qty = state.appliances[appliance.id] || 0;
        totalWatt += appliance.watt * qty;
    });

    // 2. حساب الاستهلاك اليومي (كيلو واط ساعة)
    const dailyKwh = (totalWatt * state.dailyHours) / 1000;

    // 3. الحصول على ساعات الشمس للمنطقة المختارة
    const region = REGIONS.find(r => r.id === state.region) || REGIONS[0];
    const solarHours = region.solarHours;

    // 4. حساب عدد الألواح المطلوبة
    // الاستهلاك اليومي ÷ (قدرة اللوح × ساعات الشمس) + 15% هامش أمان
    const rawPanels = dailyKwh / (PANEL_WATT * solarHours);
    const panels = Math.ceil(rawPanels * 1.15);

    // 5. حساب عدد البطاريات (للطاقة الليلية)
    const nightUsage = dailyKwh * NIGHT_USAGE_RATIO;
    const batteries = Math.ceil(nightUsage / (BATTERY_KWH * BATTERY_EFFICIENCY));

    // 6. حساب نسبة الحمل للشريط البياني (من 0 إلى 100)
    const maxKwh = 50; // الحد الأقصى للعرض = 50 kWh
    const loadPercentage = Math.min(100, (dailyKwh / maxKwh) * 100);

    // تخزين النتائج
    state.results = {
        dailyKwh: dailyKwh.toFixed(1),
        loadKw: (totalWatt / 1000).toFixed(1),
        panels: panels,
        batteries: batteries,
        loadPercentage: Math.round(loadPercentage),
    };

    // تحديث الواجهة
    updateResultsUI();

    /**
     * للباك اند: هنا يمكن إضافة:
     * - تحديث التوصيات بناءً على الـ daily_kwh
     * - تتبع الحدث (Analytics/Tracking)
     * - حفظ الجلسة في localStorage
     */
}

/* ==========================================
   10. تحديث واجهة النتائج
   ========================================== */
function updateResultsUI() {
    const r = state.results;

    // تحديث الحمل الكلي
    const loadEl = document.getElementById('result-load-kw');
    if (loadEl) loadEl.textContent = r.loadKw + ' kW';

    // تحديث الاستهلاك اليومي
    const kwhEl = document.getElementById('result-daily-kwh');
    if (kwhEl) kwhEl.textContent = r.dailyKwh + ' kWh';

    // تحديث عدد الألواح
    const panelsEl = document.getElementById('result-panels');
    if (panelsEl) panelsEl.textContent = r.panels + ' لوح';

    // تحديث عدد البطاريات
    const batteriesEl = document.getElementById('result-batteries');
    if (batteriesEl) batteriesEl.textContent = r.batteries + ' وحدة';

    // تحديث شريط الحمل
    const barFill = document.getElementById('load-bar-fill');
    if (barFill) {
        barFill.style.width = r.loadPercentage + '%';
    }

    // تحديث توصية النظام
    updateRecommendationText(parseFloat(r.dailyKwh));
}

/**
 * تحديث نص التوصية بناءً على الاستهلاك
 * للباك اند: استبدل هذه البيانات بنتائج API
 *             GET /api/products/recommend?kwh={X}
 */
function updateRecommendationText(dailyKwh) {
    const descEl = document.getElementById('consumption-description');
    if (!descEl) return;

    let message = '';
    if (dailyKwh < 10) {
        message = 'استهلاكك منخفض، مثالي لأنظمة Radiant Lite الاقتصادية.';
    } else if (dailyKwh < 20) {
        message = 'استهلاكك متوسط ومثالي لأنظمة Radiant Prime السكنية.';
    } else if (dailyKwh < 40) {
        message = 'استهلاكك مرتفع، ننصح بأنظمة Radiant Elite المتكاملة.';
    } else {
        message = 'استهلاك تجاري، تواصل مع فريقنا لحل مخصص.';
    }

    descEl.textContent = message;
}

/* ==========================================
   11. تصدير للاستخدام الخارجي
   للباك اند: يمكنك استدعاء هذه الدوال
              من نقاط API مختلفة
   ========================================== */
window.RadiantCalculator = {
    getState: function () { return state; },
    recalculate: calculateSystem,

    /**
     * تحديث النتائج من API
     * يُستدعى بعد الحصول على رد من الباك اند
     */
    setResults: function (apiResults) {
        updateResultsUI({
            loadKw: apiResults.load_kw,
            dailyKwh: apiResults.daily_kwh,
            panels: apiResults.panels,
            batteries: apiResults.batteries,
            loadPercentage: apiResults.load_percentage
        });
    }
};
