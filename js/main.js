/**
 * ===================================================
 * ملف: main.js
 * الوصف: كود JavaScript المشترك لجميع صفحات الموقع
 *
 * للباك اند:
 * - هذا الملف يُضمّن في جميع الصفحات
 * - يحتوي على:
 *   1. تحديد الصفحة النشطة في شريط التنقل
 *   2. تأثير ظهور العناصر عند التمرير (Scroll Reveal)
 *   3. إخفاء/إظهار الـ navbar عند التمرير
 *   4. منطق مشترك عام
 *
 * طريقة الاستخدام من الباك اند:
 *   يمكنك تمرير المسار الحالي إلى JavaScript
 *   عبر متغير PHP: <? echo "window.currentPath = '$path';" ?>
 * ===================================================
 */

'use strict';

/* ==========================================
   1. تهيئة الموقع عند تحميل الصفحة
   ========================================== */
document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initScrollReveal();
    initNavbarScrollEffect();
});

/* ==========================================
   2. شريط التنقل (Navbar)
   تحديد الرابط النشط بناءً على رابط الصفحة الحالية
   ========================================== */
function initNavbar() {
    // جلب جميع روابط التنقل
    const navLinks = document.querySelectorAll('.nav-link');

    // الحصول على مسار الصفحة الحالية
    const currentPath = window.location.pathname;

    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');

        // مقارنة رابط القائمة مع الرابط الحالي
        if (href && currentPath.endsWith(href)) {
            link.classList.add('active');
        } else if (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
            link.classList.add('active');
        }
    });
}

/* ==========================================
   3. تأثير ظهور العناصر عند التمرير (Scroll Reveal)
   أي عنصر يحمل class="reveal" سيظهر
   تدريجياً عند الوصول إليه بالتمرير
   ========================================== */
function initScrollReveal() {
    // التحقق من دعم المتصفح للـ IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // في حالة عدم الدعم - إظهار كل العناصر مباشرة
        document.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.add('visible');
        });
        return;
    }

    // إعدادات المراقب
    const observerOptions = {
        threshold: 0.1,      // يبدأ الظهور عند رؤية 10% من العنصر
        rootMargin: '0px 0px -50px 0px'  // هامش سفلي 50px
    };

    // إنشاء المراقب
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // إيقاف المراقبة بعد الظهور لتحسين الأداء
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // مراقبة جميع العناصر التي تحمل class="reveal"
    document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
    });
}

/* ==========================================
   4. تأثير إخفاء/إظهار الـ Navbar عند التمرير
   الـ navbar يختفي عند التمرير للأسفل
   ويظهر عند التمرير للأعلى
   ========================================== */
function initNavbarScrollEffect() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                const currentScrollY = window.scrollY;

                if (currentScrollY < 80) {
                    // في أعلى الصفحة - دائماً يظهر
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.opacity = '1';
                } else if (currentScrollY > lastScrollY) {
                    // يتمرر للأسفل - يختفي
                    navbar.style.transform = 'translateY(-120%)';
                } else {
                    // يتمرر للأعلى - يظهر
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.opacity = '1';
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });

            ticking = true;
        }
    });
}

/* ==========================================
   5. دوال مساعدة عامة (Utility Functions)
   ========================================== */

/**
 * تهيئة إظهار رسالة نجاح أو فشل
 * للباك اند: يمكن استدعاء هذه الدالة بعد
 *             الحصول على رد من API
 *
 * @param {string} elementId - معرف عنصر الرسالة
 * @param {string} type      - 'success' أو 'error'
 * @param {string} message   - نص الرسالة
 */
function showAlert(elementId, type, message) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.textContent = message;
    el.className = type === 'success'
        ? 'success-message visible'
        : 'error-message visible';

    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(function () {
        el.classList.remove('visible');
    }, 5000);
}

/**
 * تنسيق الرقم بالأرقام العربية
 * @param {number} num - الرقم المراد تنسيقه
 * @returns {string}   - الرقم بتنسيق عربي مع فاصل الآلاف
 */
function formatArabicNumber(num) {
    return num.toLocaleString('ar-SA');
}

/**
 * إرسال طلب AJAX (Fetch API)
 * للباك اند: جميع طلبات API تمر عبر هذه الدالة
 *             تأكد من ضبط CORS في الباك اند
 *
 * @param {string} url      - رابط الـ API endpoint
 * @param {string} method   - 'GET' أو 'POST' أو 'PUT' أو 'DELETE'
 * @param {object} data     - البيانات المُرسلة (للـ POST فقط)
 * @returns {Promise}       - البيانات المُستلمة
 */
async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // للباك اند: أضف CSRF token هنا إذا كنت تستخدم Laravel
            // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,

            // للباك اند: أضف Authorization header إذا كنت تستخدم JWT
            // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        // التحقق من حالة الاستجابة
        if (!response.ok) {
            throw new Error('خطأ في الاتصال: ' + response.status);
        }

        return await response.json();

    } catch (error) {
        console.error('خطأ في طلب API:', error);
        throw error;
    }
}

/**
 * تخزين مؤقت بسيط في localStorage
 * للباك اند: يُستخدم لتخزين بيانات API مؤقتاً
 *             لتجنب طلبات متكررة للسيرفر
 */
const Cache = {
    /**
     * تخزين قيمة مع وقت انتهاء الصلاحية
     * @param {string} key      - مفتاح التخزين
     * @param {any}    value    - القيمة المراد تخزينها
     * @param {number} minutes  - مدة الصلاحية بالدقائق (افتراضي: 5)
     */
    set: function (key, value, minutes = 5) {
        const item = {
            value: value,
            expiry: new Date().getTime() + (minutes * 60 * 1000)
        };
        localStorage.setItem('radiant_cache_' + key, JSON.stringify(item));
    },

    /**
     * جلب قيمة مخزنة
     * @param {string} key - مفتاح التخزين
     * @returns {any|null} - القيمة أو null إذا انتهت الصلاحية
     */
    get: function (key) {
        const itemStr = localStorage.getItem('radiant_cache_' + key);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        if (new Date().getTime() > item.expiry) {
            localStorage.removeItem('radiant_cache_' + key);
            return null;
        }
        return item.value;
    },

    /** مسح قيمة محددة */
    remove: function (key) {
        localStorage.removeItem('radiant_cache_' + key);
    }
};

// تصدير الدوال للاستخدام العام
window.RadiantSolar = {
    showAlert,
    formatArabicNumber,
    apiRequest,
    Cache
};
