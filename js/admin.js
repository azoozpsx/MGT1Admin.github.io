/**
 * ===================================================
 * ملف: js/admin.js
 * الوصف: منطق لوحة التحكم الإدارية (Dashboard SPA)
 *
 * للباك اند:
 * ════════════════════════════════════════════════════
 * هذا الملف يُنفّذ نمط MVC كاملاً:
 *   Model     → بيانات المنتجات، الباقات، الرسائل، الفريق
 *   View      → دوال رسم HTML ديناميكياً
 *   Controller → دوال معالجة الأحداث والتواصل مع API
 *
 * نقاط API المطلوبة:
 * ┌──────────────────────────────────────────────────┐
 * │ AUTH                                              │
 * │ POST /api/admin/login                             │
 * │ POST /api/admin/logout                            │
 * │                                                   │
 * │ OVERVIEW                                          │
 * │ GET  /api/admin/stats                             │
 * │ GET  /api/admin/recent-activity                   │
 * │                                                   │
 * │ PRODUCTS                                          │
 * │ GET    /api/admin/products                        │
 * │ POST   /api/admin/products          (إضافة)       │
 * │ PUT    /api/admin/products/{id}     (تعديل)       │
 * │ DELETE /api/admin/products/{id}     (حذف)         │
 * │                                                   │
 * │ BUNDLES (الباقات)                                 │
 * │ GET    /api/admin/bundles                         │
 * │ POST   /api/admin/bundles                         │
 * │ PUT    /api/admin/bundles/{id}                    │
 * │ DELETE /api/admin/bundles/{id}                    │
 * │                                                   │
 * │ MESSAGES (رسائل التواصل)                          │
 * │ GET    /api/admin/messages                        │
 * │ DELETE /api/admin/messages/{id}                   │
 * │ PATCH  /api/admin/messages/{id}/read              │
 * │                                                   │
 * │ TEAM (الفريق)                                     │
 * │ GET    /api/admin/team                            │
 * │ POST   /api/admin/team                            │
 * │ PUT    /api/admin/team/{id}                       │
 * │ DELETE /api/admin/team/{id}                       │
 * │                                                   │
 * │ SETTINGS (الإعدادات)                              │
 * │ GET    /api/admin/settings                        │
 * │ PUT    /api/admin/settings                        │
 * └──────────────────────────────────────────────────┘
 *
 * رابط API الأساسي:
 * غيّر BASE_URL ليطابق رابط الباك اند الخاص بك
 * ════════════════════════════════════════════════════
 */

'use strict';

/* ==========================================
   1. الإعدادات العامة
   ========================================== */

/** للباك اند: غيّر هذا إلى رابط API الفعلي */
const BASE_URL = '/api/admin';

/** عنوان الصفحة الحالية في التوب بار */
const PAGE_TITLES = {
    overview: { title: 'نظرة عامة', breadcrumb: 'لوحة التحكم / الرئيسية' },
    products: { title: 'إدارة المنتجات', breadcrumb: 'لوحة التحكم / المنتجات' },
    bundles:  { title: 'الباقات والعروض', breadcrumb: 'لوحة التحكم / الباقات' },
    messages: { title: 'رسائل العملاء', breadcrumb: 'لوحة التحكم / الرسائل' },
    team:     { title: 'فريق العمل', breadcrumb: 'لوحة التحكم / الفريق' },
    settings: { title: 'إعدادات الموقع', breadcrumb: 'لوحة التحكم / الإعدادات' },
    calculator_settings: { title: 'إعدادات الحاسبة', breadcrumb: 'لوحة التحكم / إعدادات الحاسبة' },
};

/* ==========================================
   2. بيانات افتراضية (Mock Data)
   للباك اند: احذف هذه البيانات وأضف طلبات API حقيقية
   ========================================== */
const MOCK_DATA = {

    stats: {
        products: 7,
        bundles: 3,
        newMessages: 5,
        teamMembers: 4,
        totalProjects: 150,
        revenue: '2.4M'
    },

    products: [
        { id: 1, name: 'ألواح كواترو برو',  category: 'panels',  price: null,  badge: 'جديد',  status: 'active',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB3ZgpP_-iQ5WDnMbX0uGCecMIM0Voirsr_PDsjXZxXP2LMLynX9CmpDhB2Y8leLqOQGE_skHRSKmfAaF9IRC5fe_cjZn3HOQyoQHv7zL9HyvqTQBMYMqJIvTtFeKeD0KEcUBSTs0vB_PXMit7TvKnT6S4LePWH8CoaayUs91UluQKSdQGQ6ufTWiGlNfZSXYJeeEFCppl7FZq3HhXMzGeW0BcpMpp3TW3k7uRq7n_yGZ2sLWBUdxCWeoJGbo0DgZ-M5TtIHjhsws', description: 'تكنولوجيا ثنائية الوجه لامتصاص أشعة الشمس' },
        { id: 2, name: 'بطاريات سديم',      category: 'storage', price: null,  badge: '',      status: 'active',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiUGx5msHzzD9_uEYYf3A9mIhzGOMrfno770nBARsBEu3o8PprI0w6ID-4R9giuuJYJcshvE14j0I-hVC9b20K3bC4uGebpMZayllnAFRX9C8n9zZrGtScrnblSsIH2HYXUhP3xI0wDyK7ATUpYSqeo_9LPHs4SBJf6BFSRBrVpfsxu0TMm_t0t1T9qickBE06XI-rxmGZ9M5ArHl27zUoFyDhkQHabGj4sIWqCPhh', description: 'تخزين طاقة ذكي بكفاءة 96%' },
        { id: 3, name: 'محولات أوبتيما',    category: 'inverters',price: null,  badge: '',      status: 'active',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKmUvxibJaxekEppme_c1mNi3SkqmF6jShHnFk0bDbaxDJ2ypepzBne3mfBcoOBO9qgYnR1gkKtkhjyxyP0Slmj_dNA8uRKO6Vt4SM6xyvOWcVyxSHaEOZdHD4ot--CY1VfskgT2h5459MtwcISE7jxUgHObYNV8dzvTvNcffXaM5nprZ5DbB8XumOP1t7rtZR0RVxc8NmjvbcynR2rVspLAOIb8syk973SjOn9hVXIvqgj2HOWixmZtfGfAobbrE3CSbhPSe0bU', description: 'تحويل طاقة مع تبريد مخصص لمناخ الخليج' },
        { id: 4, name: 'ألواح Vertex S+',   category: 'panels',  price: null,  badge: 'Premium',status: 'active', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy5eaOCJI3G4KDe1Os6KhHRxBk8fw7z7y67EPEMZMeUiD9VnmH6VSknb6NeaztSjFfEOkSbYQrCJmrb2_xCjb1d0S55BqDwzxsKVqV7Fmrx7UOhhtDcTHGW3YrEPkGCsMLMMUbSFsGat5tQtKzm2_odjKMnOeZjFl7Zx20S7f_IETxWexnk78JZHQuqS9wPLjd2Bg7dHoBGcvOJHfRRqNyQSXTwpCQW-BTtFUKnxp_mSXQfX6qNdFiX67stnV7TF3ItLPF01GRIR4', description: 'كفاءة 22.5% وضمان 30 سنة' },
        { id: 5, name: 'محول SunWays',       category: 'inverters',price: 5499,  badge: '',      status: 'active',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAut_U5rdx16X9eFkIWGXLE9CGqnMuVK8lPHCUhEEK8_7VNcRWfX_AAhM0j3kc752tMhhlKy8oxd3juBqCIaPlqZKZJ2FeuBHgwgb3D0PpXwXdqXI1T4hpZRl4IaCpLprF4wEIyf8bTyTZ7QeOf2GNiKJ5rJisPyY2a-6qVoyifgrb6xgIJJ2rKYPQt2HXkibOEcYdRqtvGb8SvEi43GAO6c5_TchJjtNyQhWfk7_pz9fAEBUA-qyl5tYWSkdwfOCvMQWiurRfZLHw', description: 'تحكم ذكي وتوافق مع البطاريات' },
        { id: 6, name: 'بطارية Luna2000',    category: 'storage', price: 12900, badge: '',      status: 'active',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBnkG1-z-GbMnRtdxFlA_JrIvx9uK03iB26L_a1Ez3XILb9LTXQbOrmdFX8oN9AKD8VG8TgdhFGB0XfoM5K0NUQ0yZGRoaytBSmU2YwAt6erUUps8hqpzYxXzxSILO4rJD8VaGI6olya1fSeWTLz8T2mQHpSvveOTQh1BEb0buZ9O-YNh61fC4Mava6WbIu3OTZjiV4G1-wQ2BZxQ49YEkFUfhI_uZFdHMon_zhrRCWwkroWfhPjuUq64OcUAm6T43-cQdMFU4GIc', description: 'سعة تخزين 5 كيلو واط ساعة' },
        { id: 7, name: 'هياكل AL-Pro',       category: 'mounting',price: 1200,  badge: '',      status: 'active',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg7OZKIRCGkAGw0UihKAypHqo3BQoThmyYc2NSV4PCONXHuurikRZfUgqXaivULWdk8e1bJVBbSEjSSs_N_7vYf2b9YgvaGic7VcmDwBqS-YZhDPcBdztGgDrehEm7jFcqmni50QnSiGjcqn7kK9vZAKTeKzefwkV5sc9kqkAQVqheZrb1b7JqDaxK7anuExnLZf73EaE_Mtltuoquyptl5TdOabZrAk7K1yD8IBWMMJBkdcz5hCQVF7LUag3EvA6kFqAeGZ0c4qI', description: 'ألمنيوم مقاوم للتآكل' },
    ],

    bundles: [
        { id: 1, name: 'الباقة الأساسية',     target: 'المنازل الصغيرة',      price: 18500,  power: '5 kW',  panels: 10, batteries: 0, status: 'active',   featured: false },
        { id: 2, name: 'الباقة المتكاملة',    target: 'الفلل والبيوت الكبيرة', price: 42000, power: '10 kW', panels: 20, batteries: 2, status: 'active',   featured: true  },
        { id: 3, name: 'باقة المنشآت',         target: 'المصانع والمستودعات',  price: 115000, power: '30+ kW',panels: 60, batteries: 8, status: 'active',   featured: false },
    ],

    messages: [
        { id: 1, name: 'أحمد السالمي',    email: 'ahmed@example.com',   type: 'residential', message: 'أريد الاستفسار عن نظام شمسي لمنزلي في المكلا',  date: '2024-03-15', read: false },
        { id: 2, name: 'فاطمة العمري',    email: 'fatima@example.com',  type: 'commercial',  message: 'نحتاج عرض سعر لمصنع بسعة 50 كيلو واط',          date: '2024-03-14', read: false },
        { id: 3, name: 'محمد الحضرمي',   email: 'moh@example.com',     type: 'residential', message: 'كيف يمكنني حساب حاجتي من الألواح الشمسية؟',      date: '2024-03-13', read: true  },
        { id: 4, name: 'سالم المهري',     email: 'salem@example.com',   type: 'agricultural',message: 'مشروع ري زراعي يحتاج طاقة شمسية مستمرة',         date: '2024-03-12', read: true  },
        { id: 5, name: 'نور الشحري',      email: 'noor@example.com',    type: 'industrial',  message: 'طلب عرض سعر لمستودع تجاري في سيئون',            date: '2024-03-11', read: true  },
    ],

    team: [
        { id: 1, name: 'م. فيصل العتيبي',  role: 'المؤسس والمدير التنفيذي', status: 'active', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsqXTXv0jI-veu_7hb60LKrMAMP2KNX7YpRUuHw12QW8wsllOOjO2ZpB4TS0-sxwlRDJOZaK2yqtUtHV4NEzx_5tnk2zMvs1rm2Gc96QXZ_yVxFofAtygiaZcY_8XFjzZQ-Uaq2V4Lzefrt_ZRE_T69TFNeRJ5Q01anJFpv3g3DgpL5Tgig3ENUCOrTAl4F6ErRGWLuFmov8Ol4lMQpMvnXyiFjE7XtjP_RT7nWVl6pF0SnBKz5GeIY-9cMRx-TmIo3k7Lu9Uv8GA' },
        { id: 2, name: 'م. سارة القحطاني', role: 'رئيسة قسم الهندسة',       status: 'active', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsqN5tzoBeQHTklTjefvkrpp-26Vj-vPr6tNfxg99VbcWjCJetHVS3HQrT5bu7hV4wROo3adbb1F13G_t4871vXf24b9Dw46IxO6wPNiLOntT12HTLjEcU8_WsZsCeA2aqOaONTkIfCat6egGeCQSkWlJnYDjG3uD3J8k4AKQxh6xLiOKgQ54-R0LstJRCnucagm1JB9W5agxn-aRTWZj51QVaNoojC8l-xQVv8kKWYvh0gSpVQvvjkONMk-uZf_qR1E7LRu24uoM' },
        { id: 3, name: 'خالد بن محمد',     role: 'مدير العمليات',            status: 'active', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTtgiwZs5l3Uu5bgH13ntY-lGgcS6sArdbQ7qLdpb_KOOklwhh23nZMqKGg0oWHJTeO3vi8GgwtjeIROOwT1_9Zvz7-dkgszPe6yK6XHmSoth_O_iQXsKqFAhNGMJKNsCUQMOI0KAjfGdACuRs1dJegwGqrP7oEb8qXu30wGBoHB3U4-BudWlW5avxiuCjJrkiW_3rqXasswlTSzmXaGlZXmDdDW1D8Jk6DF1dJCGkYAxUy84CTZHaTYpkngCRnyuJNIluZfWxuRc' },
        { id: 4, name: 'نورة السديري',     role: 'علاقات المستثمرين',        status: 'active', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaYe-GDcIgWNtrynsSq_eid1RiINfZ1FhWI0Wc3R3AqEqkIRkBLjmD9duSoQFD7sZs3WcvvqjWQRM7KA-tlTZEQiRe8XF4XpXcx3w7bfmZYzdrx-wiXRe_5t4-kWXZOV-jr0iALEipLYWBZDzurD8CMl6j_cMDU1IDdM-BCg9Lzzxf25CVcA7NzdT4GfnRaHFf2SmguwlNxWDqsvs7POlR9Rj3Qx1gI_cOLe8j71BpL0notVpt30vnIvcaqd6KXuG59hE3C6M-Jl0' },
    ],

    settings: {
        company_name_ar:   'المشعبة لمنظومات الطاقة الشمسية',
        company_name_en:   'Mashaba Solar Energy Systems',
        slogan_ar:         'دقة في كل شعاع',
        slogan_en:         'Precision in every ray',
        country:           'اليمن',
        city:              'حضرموت - المكلا',
        address_ar:        'شارع الملك علي، المكلا، حضرموت، اليمن',
        phone:             '+967 5 000 0000',
        email:             'info@mashaba-solar.com',
        support_email:     'support@mashaba-solar.com',
        copyright_year:    '2024',
        vision_year:       '2030',
        facebook_url:      '#',
        twitter_url:       '#',
        instagram_url:     '#',
        whatsapp:          '+967500000000',
        meta_desc_ar:      'المشعبة لمنظومات الطاقة الشمسية - حلول الطاقة المتجددة في اليمن، حضرموت والمكلا',
    }
};

/* ==========================================
   3. حالة التطبيق (App State)
   ========================================== */
const AppState = {
    currentPage: 'overview',
    currentUser: null,
    token: null,
    data: {
        products: [],
        bundles:  [],
        messages: [],
        team:     [],
        settings: {}
    }
};

/* ==========================================
   4. التهيئة عند تحميل الصفحة
   ========================================== */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * للباك اند: تحقق من الجلسة مع السيرفر:
     * GET /api/admin/me → { user: {...} } أو 401
     */
    checkAuth();
    initSidebarNav();
    initMobileSidebar();
    initData();
});

/* ==========================================
   5. التحقق من المصادقة (Auth Check)
   ========================================== */
function checkAuth() {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    const user  = localStorage.getItem('admin_user')  || sessionStorage.getItem('admin_user');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    AppState.token = token;
    AppState.currentUser = user ? JSON.parse(user) : { name: 'المشرف', email: 'admin@admin.com' };

    // تحديث معلومات المستخدم في الواجهة
    const userNameEl = document.getElementById('admin-username');
    const userRoleEl = document.getElementById('admin-user-role');
    if (userNameEl) userNameEl.textContent = AppState.currentUser.name;
    if (userRoleEl) userRoleEl.textContent = 'مشرف النظام';

    const avatarEl = document.getElementById('admin-avatar-initials');
    if (avatarEl && AppState.currentUser.name) {
        avatarEl.textContent = AppState.currentUser.name.charAt(0);
    }
}

/* ==========================================
   6. تهيئة بيانات الصفحة
   ========================================== */
function initData() {
    /**
     * للباك اند: استبدل MOCK_DATA بطلبات API:
     * const data = await apiRequest('/stats');
     */
    AppState.data.products = [...MOCK_DATA.products];
    AppState.data.bundles  = [...MOCK_DATA.bundles];
    AppState.data.messages = [...MOCK_DATA.messages];
    AppState.data.team     = [...MOCK_DATA.team];
    AppState.data.settings = {...MOCK_DATA.settings};

    // رسم الصفحة الحالية
    navigateTo('overview');
}

/* ==========================================
   7. نظام التنقل (Router/Controller)
   ========================================== */
function initSidebarNav() {
    document.querySelectorAll('[data-page]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateTo(page);

            // إغلاق الشريط الجانبي في الهاتف
            const sidebar = document.querySelector('.admin-sidebar');
            if (sidebar) sidebar.classList.remove('open');
        });
    });
}

/**
 * التنقل إلى صفحة
 * هذا هو Router في نمط MVC
 */
function navigateTo(page) {
    // تحديث الحالة
    AppState.currentPage = page;

    // تحديث الروابط النشطة في الشريط الجانبي
    document.querySelectorAll('[data-page]').forEach(function(link) {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // تحديث عنوان الصفحة في التوب بار
    const pageInfo = PAGE_TITLES[page] || { title: page, breadcrumb: '' };
    const titleEl = document.getElementById('topbar-title');
    const breadEl = document.getElementById('topbar-breadcrumb');
    if (titleEl) titleEl.textContent = pageInfo.title;
    if (breadEl) breadEl.textContent = pageInfo.breadcrumb;

    // إخفاء جميع الصفحات
    document.querySelectorAll('.admin-page').forEach(function(p) {
        p.classList.remove('active');
    });

    // إظهار الصفحة المطلوبة
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) {
        pageEl.classList.add('active');
        // رسم محتوى الصفحة
        renderPage(page);
    }
}

/**
 * رسم محتوى الصفحة (View Renderer)
 */
function renderPage(page) {
    switch (page) {
        case 'overview':   renderOverview(); break;
        case 'products':   renderProducts(); break;
        case 'bundles':    renderBundles();  break;
        case 'messages':   renderMessages(); break;
        case 'team':       renderTeam();     break;
        case 'settings':   renderSettings(); break;
        case 'calculator_settings': renderCalculatorSettings(); break;
    }
}

/* ==========================================
   8. VIEWS - دوال رسم الصفحات
   ========================================== */

/** رسم صفحة نظرة عامة */
function renderOverview() {
    const stats = MOCK_DATA.stats;

    // تحديث الإحصائيات
    setElText('stat-products',   stats.products);
    setElText('stat-messages',   stats.newMessages);
    setElText('stat-team',       stats.teamMembers);
    setElText('stat-projects',   '+' + stats.totalProjects);

    // آخر الرسائل
    renderRecentMessages();

    // آخر المنتجات
    renderRecentProducts();
}

/** رسم آخر الرسائل في الداش بورد */
function renderRecentMessages() {
    const container = document.getElementById('recent-messages-list');
    if (!container) return;

    const recent = AppState.data.messages.slice(0, 3);

    if (recent.length === 0) {
        container.innerHTML = '<div class="admin-empty-state"><span class="material-symbols-outlined">mail_outline</span>لا توجد رسائل</div>';
        return;
    }

    container.innerHTML = recent.map(function(msg) {
        return `
            <div class="flex items-start gap-3 py-3 border-b border-gray-50 last:border-none cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                 onclick="navigateTo('messages')" style="cursor:pointer">
                <div class="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-700 font-bold text-sm">
                    ${msg.name.charAt(0)}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                        <span class="font-semibold text-sm truncate">${msg.name}</span>
                        ${!msg.read ? '<span class="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>' : ''}
                    </div>
                    <p class="text-xs text-gray-500 truncate mt-0.5">${msg.message}</p>
                    <span class="text-xs text-gray-400">${msg.date}</span>
                </div>
            </div>
        `;
    }).join('');
}

/** رسم آخر المنتجات في الداش بورد */
function renderRecentProducts() {
    const container = document.getElementById('recent-products-list');
    if (!container) return;

    const recent = AppState.data.products.slice(0, 4);
    const categories = { panels: 'ألواح', storage: 'تخزين', inverters: 'محولات', mounting: 'هياكل' };

    container.innerHTML = recent.map(function(product) {
        return `
            <div class="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-none">
                <img src="${product.image}" alt="${product.name}"
                     class="w-10 h-10 rounded-lg object-cover border border-gray-100"
                     onerror="this.style.background='#f3f4f6'; this.src=''" />
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-sm truncate">${product.name}</p>
                    <p class="text-xs text-gray-400">${categories[product.category] || product.category}</p>
                </div>
                <span class="text-xs font-semibold ${product.status === 'active' ? 'text-green-600' : 'text-gray-400'}">
                    ${product.status === 'active' ? 'نشط' : 'مخفي'}
                </span>
            </div>
        `;
    }).join('');
}

/** ════════════════════════════════
    رسم صفحة المنتجات
    للباك اند: GET /api/admin/products
    ════════════════════════════════ */
function renderProducts() {
    const container = document.getElementById('products-table-body');
    if (!container) return;

    const categories = { panels: 'ألواح شمسية', storage: 'تخزين طاقة', inverters: 'محولات', mounting: 'هياكل تثبيت', accessories: 'إكسسوارات' };

    if (AppState.data.products.length === 0) {
        container.closest('.admin-table-wrapper').innerHTML = '<div class="admin-empty-state"><span class="material-symbols-outlined">inventory_2</span>لا توجد منتجات بعد</div>';
        return;
    }

    container.innerHTML = AppState.data.products.map(function(p) {
        return `
            <tr>
                <td><img src="${p.image}" alt="${p.name}" class="table-thumb" onerror="this.style.background='#f3f4f6'" /></td>
                <td>
                    <div style="font-weight:600">${p.name}</div>
                    <div style="font-size:0.75rem;color:#6b7280;margin-top:2px">${p.description || ''}</div>
                </td>
                <td>${categories[p.category] || p.category}</td>
                <td>${p.price ? p.price.toLocaleString('ar-SA') + ' ر.ي' : '<span style="color:#9ca3af">غير محدد</span>'}</td>
                <td>${p.badge ? `<span class="admin-badge badge-new">${p.badge}</span>` : '-'}</td>
                <td><span class="admin-badge ${p.status === 'active' ? 'badge-active' : 'badge-inactive'}">${p.status === 'active' ? 'نشط' : 'مخفي'}</span></td>
                <td>
                    <div style="display:flex;gap:0.4rem">
                        <button class="btn btn-outline-admin btn-sm" onclick="editProduct(${p.id})" title="تعديل">
                            <span class="material-symbols-outlined" style="font-size:0.85rem">edit</span>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})" title="حذف">
                            <span class="material-symbols-outlined" style="font-size:0.85rem">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/** ════════════════════════════════
    رسم صفحة الباقات
    للباك اند: GET /api/admin/bundles
    ════════════════════════════════ */
function renderBundles() {
    const container = document.getElementById('bundles-table-body');
    if (!container) return;

    container.innerHTML = AppState.data.bundles.map(function(b) {
        return `
            <tr>
                <td style="font-weight:700">${b.name}</td>
                <td>${b.target}</td>
                <td style="font-weight:700;color:#af101a">${b.price.toLocaleString('ar-SA')} ر.ي</td>
                <td>${b.power}</td>
                <td>${b.panels} لوح</td>
                <td>${b.batteries > 0 ? b.batteries + ' وحدة' : '-'}</td>
                <td>${b.featured ? '<span class="admin-badge badge-featured">مميز</span>' : '-'}</td>
                <td><span class="admin-badge ${b.status === 'active' ? 'badge-active' : 'badge-inactive'}">${b.status === 'active' ? 'نشط' : 'مخفي'}</span></td>
                <td>
                    <div style="display:flex;gap:0.4rem">
                        <button class="btn btn-outline-admin btn-sm" onclick="editBundle(${b.id})">
                            <span class="material-symbols-outlined" style="font-size:0.85rem">edit</span>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteBundle(${b.id})">
                            <span class="material-symbols-outlined" style="font-size:0.85rem">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/** ════════════════════════════════
    رسم صفحة الرسائل
    للباك اند: GET /api/admin/messages
    ════════════════════════════════ */
function renderMessages() {
    const container = document.getElementById('messages-table-body');
    if (!container) return;

    const types = { residential: 'سكني', commercial: 'تجاري', industrial: 'صناعي', agricultural: 'زراعي' };

    container.innerHTML = AppState.data.messages.map(function(msg) {
        return `
            <tr style="${!msg.read ? 'background:#fef9f9' : ''}">
                <td>
                    <div style="display:flex;align-items:center;gap:0.5rem">
                        ${!msg.read ? '<span style="width:8px;height:8px;background:#ef4444;border-radius:50%;flex-shrink:0"></span>' : ''}
                        <span style="font-weight:${!msg.read ? '700' : '500'}">${msg.name}</span>
                    </div>
                </td>
                <td dir="ltr" style="text-align:right">${msg.email}</td>
                <td>${types[msg.type] || msg.type}</td>
                <td style="max-width:200px">
                    <span style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.82rem;color:#374151">${msg.message}</span>
                </td>
                <td style="color:#6b7280;font-size:0.8rem">${msg.date}</td>
                <td>
                    <div style="display:flex;gap:0.4rem">
                        <button class="btn btn-outline-admin btn-sm" onclick="viewMessage(${msg.id})" title="عرض">
                            <span class="material-symbols-outlined" style="font-size:0.85rem">visibility</span>
                        </button>
                        ${!msg.read ? `<button class="btn btn-success btn-sm" onclick="markRead(${msg.id})" title="تعليم مقروء">
                            <span class="material-symbols-outlined" style="font-size:0.85rem">mark_email_read</span>
                        </button>` : ''}
                        <button class="btn btn-danger btn-sm" onclick="deleteMessage(${msg.id})" title="حذف">
                            <span class="material-symbols-outlined" style="font-size:0.85rem">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/** ════════════════════════════════
    رسم صفحة الفريق
    للباك اند: GET /api/admin/team
    ════════════════════════════════ */
function renderTeam() {
    const container = document.getElementById('team-table-body');
    if (!container) return;

    container.innerHTML = AppState.data.team.map(function(member) {
        return `
            <tr>
                <td>
                    <img src="${member.photo}" alt="${member.name}"
                         class="table-thumb" style="border-radius:50%"
                         onerror="this.style.background='#f3f4f6'" />
                </td>
                <td style="font-weight:600">${member.name}</td>
                <td style="color:#6b7280">${member.role}</td>
                <td><span class="admin-badge ${member.status === 'active' ? 'badge-active' : 'badge-inactive'}">${member.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                <td>
                    <div style="display:flex;gap:0.4rem">
                        <button class="btn btn-outline-admin btn-sm" onclick="editTeamMember(${member.id})">
                            <span class="material-symbols-outlined" style="font-size:0.85rem">edit</span>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTeamMember(${member.id})">
                            <span class="material-symbols-outlined" style="font-size:0.85rem">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/** ════════════════════════════════
    رسم صفحة الإعدادات
    للباك اند: GET /api/admin/settings
    ════════════════════════════════ */
function renderSettings() {
    const s = AppState.data.settings;
    if (!s) return;

    // تعبئة الحقول بالبيانات الحالية
    const fields = {
        'settings-company-ar':   s.company_name_ar,
        'settings-company-en':   s.company_name_en,
        'settings-slogan-ar':    s.slogan_ar,
        'settings-slogan-en':    s.slogan_en,
        'settings-country':      s.country,
        'settings-city':         s.city,
        'settings-address':      s.address_ar,
        'settings-phone':        s.phone,
        'settings-email':        s.email,
        'settings-support-email':s.support_email,
        'settings-whatsapp':     s.whatsapp,
        'settings-facebook':     s.facebook_url,
        'settings-instagram':    s.instagram_url,
        'settings-meta-desc':    s.meta_desc_ar,
    };

    Object.entries(fields).forEach(function([id, value]) {
        const el = document.getElementById(id);
        if (el && value) el.value = value;
    });
}

/** رسم إعدادات الحاسبة */
function renderCalculatorSettings() {
    // عناصر الحاسبة الحالية مشفرة ثابتاً
    // للباك اند: GET /api/admin/calculator-settings
}

/* ==========================================
   9. CONTROLLERS - معالجة الأحداث
   ========================================== */

/** حذف منتج */
function deleteProduct(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    /**
     * للباك اند:
     * DELETE /api/admin/products/{id}
     */
    AppState.data.products = AppState.data.products.filter(p => p.id !== id);
    renderProducts();
    showToast('تم حذف المنتج بنجاح', 'success');
}

/** تعديل منتج */
function editProduct(id) {
    const product = AppState.data.products.find(p => p.id === id);
    if (!product) return;
    openProductModal(product);
}

/** فتح مودال إضافة/تعديل منتج */
function openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    const isEdit = !!product;
    const titleEl = modal.querySelector('.admin-modal-title');
    if (titleEl) titleEl.textContent = isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد';

    // تعبئة الحقول
    if (isEdit) {
        setFieldValue('modal-product-name', product.name);
        setFieldValue('modal-product-desc', product.description);
        setFieldValue('modal-product-price', product.price || '');
        setFieldValue('modal-product-category', product.category);
        setFieldValue('modal-product-badge', product.badge);
        setFieldValue('modal-product-status', product.status);

        // حفظ ID للتعديل
        modal.dataset.editId = product.id;
    } else {
        modal.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
        delete modal.dataset.editId;
    }

    modal.classList.add('open');
}

/** حفظ المنتج (إضافة أو تعديل) */
function saveProduct() {
    const modal = document.getElementById('product-modal');
    const name     = getFieldValue('modal-product-name');
    const desc     = getFieldValue('modal-product-desc');
    const price    = getFieldValue('modal-product-price');
    const category = getFieldValue('modal-product-category');
    const badge    = getFieldValue('modal-product-badge');
    const status   = getFieldValue('modal-product-status');

    if (!name) { alert('يرجى إدخال اسم المنتج'); return; }

    const editId = modal?.dataset.editId;

    if (editId) {
        // تعديل
        const idx = AppState.data.products.findIndex(p => p.id == editId);
        if (idx >= 0) {
            AppState.data.products[idx] = { ...AppState.data.products[idx], name, description: desc, price: price ? Number(price) : null, category, badge, status };
        }
        showToast('تم تعديل المنتج بنجاح', 'success');
        /**
         * للباك اند:
         * PUT /api/admin/products/{editId}
         * Body: { name, description: desc, price, category, badge, status }
         */
    } else {
        // إضافة
        const newProduct = { id: Date.now(), name, description: desc, price: price ? Number(price) : null, category, badge, status, image: '' };
        AppState.data.products.push(newProduct);
        showToast('تم إضافة المنتج بنجاح', 'success');
        /**
         * للباك اند:
         * POST /api/admin/products
         * Body: { name, description: desc, price, category, badge, status, image }
         */
    }

    closeModal('product-modal');
    renderProducts();
}

/** حذف باقة */
function deleteBundle(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;
    AppState.data.bundles = AppState.data.bundles.filter(b => b.id !== id);
    renderBundles();
    showToast('تم حذف الباقة بنجاح', 'success');
    /**
     * للباك اند: DELETE /api/admin/bundles/{id}
     */
}

/** تعديل باقة */
function editBundle(id) {
    const bundle = AppState.data.bundles.find(b => b.id === id);
    if (!bundle) return;
    openBundleModal(bundle);
}

/** فتح مودال الباقة */
function openBundleModal(bundle = null) {
    const modal = document.getElementById('bundle-modal');
    if (!modal) return;

    const isEdit = !!bundle;
    const titleEl = modal.querySelector('.admin-modal-title');
    if (titleEl) titleEl.textContent = isEdit ? 'تعديل الباقة' : 'إضافة باقة جديدة';

    if (isEdit) {
        setFieldValue('modal-bundle-name',     bundle.name);
        setFieldValue('modal-bundle-target',   bundle.target);
        setFieldValue('modal-bundle-price',    bundle.price);
        setFieldValue('modal-bundle-power',    bundle.power);
        setFieldValue('modal-bundle-panels',   bundle.panels);
        setFieldValue('modal-bundle-batteries',bundle.batteries);
        setFieldValue('modal-bundle-status',   bundle.status);
        modal.dataset.editId = bundle.id;
    } else {
        modal.querySelectorAll('input, select').forEach(el => el.value = '');
        delete modal.dataset.editId;
    }

    modal.classList.add('open');
}

/** حفظ الباقة */
function saveBundle() {
    const modal = document.getElementById('bundle-modal');
    const name      = getFieldValue('modal-bundle-name');
    const target    = getFieldValue('modal-bundle-target');
    const price     = Number(getFieldValue('modal-bundle-price'));
    const power     = getFieldValue('modal-bundle-power');
    const panels    = Number(getFieldValue('modal-bundle-panels'));
    const batteries = Number(getFieldValue('modal-bundle-batteries'));
    const status    = getFieldValue('modal-bundle-status');

    if (!name || !price) { alert('يرجى ملء الحقول الأساسية'); return; }

    const editId = modal?.dataset.editId;

    if (editId) {
        const idx = AppState.data.bundles.findIndex(b => b.id == editId);
        if (idx >= 0) {
            AppState.data.bundles[idx] = { ...AppState.data.bundles[idx], name, target, price, power, panels, batteries, status };
        }
        showToast('تم تعديل الباقة بنجاح', 'success');
    } else {
        AppState.data.bundles.push({ id: Date.now(), name, target, price, power, panels, batteries, status, featured: false });
        showToast('تم إضافة الباقة بنجاح', 'success');
    }

    closeModal('bundle-modal');
    renderBundles();
}

/** عرض رسالة */
function viewMessage(id) {
    const msg = AppState.data.messages.find(m => m.id === id);
    if (!msg) return;

    const types = { residential: 'سكني', commercial: 'تجاري', industrial: 'صناعي', agricultural: 'زراعي' };
    alert(`رسالة من: ${msg.name}\nالبريد: ${msg.email}\nنوع المشروع: ${types[msg.type] || msg.type}\nالتاريخ: ${msg.date}\n\nالرسالة:\n${msg.message}`);

    markRead(id);
}

/** تعليم الرسالة كمقروءة */
function markRead(id) {
    const msg = AppState.data.messages.find(m => m.id === id);
    if (msg) {
        msg.read = true;
        renderMessages();
        updateMessageBadge();
        /**
         * للباك اند: PATCH /api/admin/messages/{id}/read
         */
    }
}

/** حذف رسالة */
function deleteMessage(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    AppState.data.messages = AppState.data.messages.filter(m => m.id !== id);
    renderMessages();
    updateMessageBadge();
    showToast('تم حذف الرسالة', 'success');
    /**
     * للباك اند: DELETE /api/admin/messages/{id}
     */
}

/** تحديث عدد الرسائل في الشريط الجانبي */
function updateMessageBadge() {
    const unread = AppState.data.messages.filter(m => !m.read).length;
    const badge = document.getElementById('messages-badge');
    if (badge) {
        badge.textContent = unread;
        badge.style.display = unread > 0 ? 'inline-block' : 'none';
    }
}

/** تعديل عضو فريق */
function editTeamMember(id) {
    const member = AppState.data.team.find(m => m.id === id);
    if (!member) return;
    openTeamModal(member);
}

/** فتح مودال الفريق */
function openTeamModal(member = null) {
    const modal = document.getElementById('team-modal');
    if (!modal) return;

    const isEdit = !!member;
    const titleEl = modal.querySelector('.admin-modal-title');
    if (titleEl) titleEl.textContent = isEdit ? 'تعديل عضو الفريق' : 'إضافة عضو جديد';

    if (isEdit) {
        setFieldValue('modal-team-name', member.name);
        setFieldValue('modal-team-role', member.role);
        setFieldValue('modal-team-status', member.status);
        setFieldValue('modal-team-photo', member.photo);
        modal.dataset.editId = member.id;
    } else {
        modal.querySelectorAll('input, select').forEach(el => el.value = '');
        delete modal.dataset.editId;
    }

    modal.classList.add('open');
}

/** حفظ عضو الفريق */
function saveTeamMember() {
    const modal  = document.getElementById('team-modal');
    const name   = getFieldValue('modal-team-name');
    const role   = getFieldValue('modal-team-role');
    const status = getFieldValue('modal-team-status');
    const photo  = getFieldValue('modal-team-photo');

    if (!name || !role) { alert('يرجى ملء الاسم والمنصب'); return; }

    const editId = modal?.dataset.editId;

    if (editId) {
        const idx = AppState.data.team.findIndex(m => m.id == editId);
        if (idx >= 0) {
            AppState.data.team[idx] = { ...AppState.data.team[idx], name, role, status, photo };
        }
        showToast('تم تعديل عضو الفريق بنجاح', 'success');
    } else {
        AppState.data.team.push({ id: Date.now(), name, role, status, photo });
        showToast('تم إضافة عضو جديد بنجاح', 'success');
    }

    closeModal('team-modal');
    renderTeam();
}

/** حذف عضو فريق */
function deleteTeamMember(id) {
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) return;
    AppState.data.team = AppState.data.team.filter(m => m.id !== id);
    renderTeam();
    showToast('تم حذف العضو', 'success');
}

/** حفظ الإعدادات */
function saveSettings(e) {
    e && e.preventDefault();

    const newSettings = {
        company_name_ar:   getFieldValue('settings-company-ar'),
        company_name_en:   getFieldValue('settings-company-en'),
        slogan_ar:         getFieldValue('settings-slogan-ar'),
        slogan_en:         getFieldValue('settings-slogan-en'),
        country:           getFieldValue('settings-country'),
        city:              getFieldValue('settings-city'),
        address_ar:        getFieldValue('settings-address'),
        phone:             getFieldValue('settings-phone'),
        email:             getFieldValue('settings-email'),
        support_email:     getFieldValue('settings-support-email'),
        whatsapp:          getFieldValue('settings-whatsapp'),
        facebook_url:      getFieldValue('settings-facebook'),
        instagram_url:     getFieldValue('settings-instagram'),
        meta_desc_ar:      getFieldValue('settings-meta-desc'),
    };

    AppState.data.settings = { ...AppState.data.settings, ...newSettings };

    /**
     * للباك اند:
     * PUT /api/admin/settings
     * Body: newSettings
     * هذا سيحدث معلومات الشركة في قاعدة البيانات
     * وتنعكس التغييرات على الموقع تلقائياً
     */
    showToast('تم حفظ الإعدادات بنجاح ✅', 'success');
}

/* ==========================================
   10. المودالات - فتح وإغلاق
   ========================================== */
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
}

// إغلاق المودال عند النقر خارجه
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('admin-modal-overlay')) {
        e.target.classList.remove('open');
    }
});

/* ==========================================
   11. شريط التنقل للهاتف
   ========================================== */
function initMobileSidebar() {
    const toggleBtn = document.getElementById('mobile-sidebar-toggle');
    const sidebar   = document.querySelector('.admin-sidebar');
    const overlay   = document.getElementById('sidebar-overlay');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('show');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            this.classList.remove('show');
        });
    }
}

/* ==========================================
   12. تسجيل الخروج
   ========================================== */
function logout() {
    if (!confirm('هل تريد تسجيل الخروج؟')) return;

    /**
     * للباك اند:
     * POST /api/admin/logout
     * Authorization: Bearer {token}
     */
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    window.location.href = 'login.html';
}

/* ==========================================
   13. نظام الإشعارات (Toast)
   ========================================== */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.innerHTML = `
        <span class="material-symbols-outlined">${icons[type] || 'info'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-20px)';
        toast.style.transition = '0.3s ease';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3500);
}

/* ==========================================
   14. دوال مساعدة عامة
   ========================================== */
function setElText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setFieldValue(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.value = value;
}

function getFieldValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

/**
 * طلب API عام
 * للباك اند: جميع الطلبات تمر من هنا
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    const token = AppState.token;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        }
    };

    if (data && method !== 'GET') options.body = JSON.stringify(data);

    const response = await fetch(BASE_URL + endpoint, options);

    if (response.status === 401) {
        // انتهت الجلسة
        localStorage.removeItem('admin_token');
        window.location.href = 'login.html';
        return;
    }

    return await response.json();
}
