/**
 * ===================================================
 * ملف: tailwind.config.js
 * الوصف: إعدادات Tailwind CSS المشتركة لجميع صفحات
 *        موقع المشعبة للطاقة الشمسية (Radiant Solar)
 * 
 * للباك اند: هذا الملف يحتوي على نظام الألوان الكامل
 *            للموقع. الألوان مبنية على Material Design 3
 *            اللون الرئيسي (primary) = #af101a (أحمر داكن)
 *            اللون الثانوي (secondary) = #4c616c (رمادي مزرق)
 *            اللون الثالث (tertiary) = #005f7b (أزرق شتائي)
 * ===================================================
 */

// يجب تضمين هذا الملف قبل تشغيل Tailwind CDN
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            /**
             * نظام الألوان - مبني على Material Design 3
             * يُستخدم هذا النظام عبر جميع صفحات الموقع
             * للباك اند: عند إضافة لون جديد، أضفه هنا ليتوفر في جميع الصفحات
             */
            colors: {
                // ألوان السطح الرئيسية
                "inverse-surface": "#2d3133",
                "secondary-fixed-dim": "#b4cad6",
                "on-secondary-fixed": "#071e27",
                "on-secondary-fixed-variant": "#354a53",

                // اللون الرئيسي - أحمر المشعبة
                "primary-container": "#d32f2f",
                "inverse-primary": "#ffb3ac",
                "primary": "#af101a",             // اللون الرئيسي للأزرار والعناوين
                "on-primary": "#ffffff",
                "primary-fixed": "#ffdad6",
                "primary-fixed-dim": "#ffb3ac",
                "on-primary-fixed": "#410003",
                "on-primary-fixed-variant": "#930010",
                "on-primary-container": "#fff2f0",
                "surface-tint": "#ba1a20",

                // ألوان السطح
                "on-surface": "#191c1e",
                "surface": "#f7f9fb",
                "surface-container-high": "#e6e8ea",
                "surface-container-highest": "#e0e3e5",
                "surface-container": "#eceef0",
                "surface-container-low": "#f2f4f6",
                "surface-container-lowest": "#ffffff",
                "surface-variant": "#e0e3e5",
                "surface-dim": "#d8dadc",
                "surface-bright": "#f7f9fb",
                "on-surface-variant": "#5b403d",

                // اللون الثانوي
                "on-secondary-container": "#526772",
                "secondary-container": "#cfe6f2",
                "secondary-fixed": "#cfe6f2",
                "on-secondary": "#ffffff",
                "secondary": "#4c616c",

                // اللون الثالث
                "on-tertiary-fixed": "#001f2a",
                "on-tertiary": "#ffffff",
                "on-tertiary-fixed-variant": "#004d65",
                "tertiary-fixed-dim": "#7bd1f8",
                "tertiary-container": "#00799c",
                "on-tertiary-container": "#e9f7ff",
                "tertiary-fixed": "#bee9ff",
                "tertiary": "#005f7b",

                // ألوان الخطأ
                "error-container": "#ffdad6",
                "on-error-container": "#93000a",
                "error": "#ba1a1a",
                "on-error": "#ffffff",

                // خلفية عامة
                "background": "#f7f9fb",
                "on-background": "#191c1e",

                // حدود وخطوط فاصلة
                "outline": "#8f6f6c",
                "outline-variant": "#e4beba",

                // ألوان عكسية
                "inverse-on-surface": "#eff1f3",
            },

            /**
             * نظام نصف الدائرة (Border Radius)
             * يعطي الموقع مظهر حديث ومنحني
             */
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "2rem",
                "xl": "3rem",
                "full": "9999px"
            },

            /**
             * نظام الخطوط
             * IBM Plex Sans Arabic - للنصوص العربية
             * Manrope - للنصوص الإنجليزية والأرقام
             */
            fontFamily: {
                "headline": ["IBM Plex Sans Arabic", "Manrope"],
                "body": ["IBM Plex Sans Arabic", "Manrope"],
                "label": ["IBM Plex Sans Arabic", "Manrope"]
            }
        },
    },
};
