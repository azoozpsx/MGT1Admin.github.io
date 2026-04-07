/**
 * ===================================================
 * ملف: contact.js
 * الوصف: منطق نموذج التواصل في صفحة "من نحن"
 *
 * للباك اند:
 * - النموذج يُرسل بيانات التواصل إلى:
 *   POST /api/contact
 *
 * البيانات المُرسلة (JSON):
 * {
 *   "name": "اسم العميل",
 *   "email": "email@example.com",
 *   "project_type": "سكني | تجاري | صناعي | زراعي",
 *   "message": "نص الرسالة"
 * }
 *
 * الاستجابة المتوقعة:
 * {
 *   "success": true,
 *   "message": "تم استلام رسالتك بنجاح"
 * }
 *
 * أو في حالة الخطأ:
 * {
 *   "success": false,
 *   "errors": {
 *     "email": "البريد الإلكتروني غير صحيح"
 *   }
 * }
 * ===================================================
 */

'use strict';

/* ==========================================
   رابط API للتواصل
   للباك اند: عدّل هذا الرابط
   ========================================== */
// للباك اند: غيّر هذا الرابط إلى العنوان الفعلي
const CONTACT_API_URL = '/api/contact';

/* ==========================================
   تهيئة نموذج التواصل عند تحميل الصفحة
   ========================================== */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleContactSubmit);

    // تنظيف أخطاء التحقق عند التعديل
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
        field.addEventListener('input', function () {
            clearFieldError(this);
        });
    });
});

/* ==========================================
   معالجة إرسال نموذج التواصل
   ========================================== */
async function handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('contact-submit-btn');

    // 1. جمع بيانات النموذج
    const formData = {
        name:         form.querySelector('#contact-name')?.value.trim(),
        email:        form.querySelector('#contact-email')?.value.trim(),
        project_type: form.querySelector('#contact-project-type')?.value,
        message:      form.querySelector('#contact-message')?.value.trim(),
    };

    // 2. التحقق من صحة البيانات (Client-side validation)
    const errors = validateContactForm(formData);
    if (Object.keys(errors).length > 0) {
        showFormErrors(form, errors);
        return;
    }

    // 3. عرض حالة التحميل
    setSubmitLoading(submitBtn, true);

    try {
        /**
         * للباك اند:
         * هنا يتم إرسال البيانات للسيرفر.
         * يمكنك تغيير هذا الكود للاتصال بـ API الخاص بك.
         *
         * مثال مع Laravel:
         * const response = await fetch('/api/contact', {
         *     method: 'POST',
         *     headers: {
         *         'Content-Type': 'application/json',
         *         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
         *     },
         *     body: JSON.stringify(formData)
         * });
         */

        // === محاكاة الإرسال (سيُستبدل بطلب API حقيقي) ===
        await simulateApiCall(formData);
        // ===================================================

        // 4. نجاح الإرسال
        showSuccessMessage();
        form.reset();

    } catch (error) {

        // 5. فشل الإرسال
        if (error.validationErrors) {
            // أخطاء من الباك اند
            showFormErrors(form, error.validationErrors);
        } else {
            // خطأ عام في الشبكة
            showNetworkError();
        }

    } finally {
        setSubmitLoading(submitBtn, false);
    }
}

/* ==========================================
   التحقق من صحة بيانات النموذج (Client-side)
   للباك اند: هذا تحقق على الفرونت اند فقط.
              تأكد من إجراء تحقق مماثل
              على الباك اند (Server-side) أيضاً!
   ========================================== */
function validateContactForm(data) {
    const errors = {};

    // التحقق من الاسم
    if (!data.name || data.name.length < 2) {
        errors.name = 'يرجى إدخال اسمك الكامل';
    }

    // التحقق من البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    // التحقق من الرسالة
    if (!data.message || data.message.length < 10) {
        errors.message = 'يرجى كتابة رسالة لا تقل عن 10 أحرف';
    }

    return errors;
}

/* ==========================================
   دوال تحديث الواجهة
   ========================================== */

/** إظهار أخطاء التحقق على الحقول */
function showFormErrors(form, errors) {
    Object.keys(errors).forEach(function (field) {
        const input = form.querySelector(`#contact-${field}`);
        const errorEl = form.querySelector(`#error-${field}`);

        if (input) input.classList.add('input-error');
        if (errorEl) {
            errorEl.textContent = errors[field];
            errorEl.classList.add('visible');
        }
    });

    // التمرير إلى أول خطأ
    const firstError = form.querySelector('.input-error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
    }
}

/** مسح خطأ حقل معين عند التعديل */
function clearFieldError(field) {
    field.classList.remove('input-error');
    const fieldId = field.id.replace('contact-', '');
    const errorEl = document.getElementById('error-' + fieldId);
    if (errorEl) errorEl.classList.remove('visible');
}

/** تغيير حالة زر الإرسال (تحميل / عادي) */
function setSubmitLoading(btn, isLoading) {
    if (!btn) return;

    if (isLoading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.innerHTML = '<span style="display:inline-block;width:1rem;height:1rem;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin-slow 0.8s linear infinite;margin-inline-end:0.5rem;"></span> جاري الإرسال...';
    } else {
        btn.disabled = false;
        btn.textContent = btn.dataset.originalText || 'إرسال الطلب';
    }
}

/** إظهار رسالة نجاح الإرسال */
function showSuccessMessage() {
    const msg = document.getElementById('contact-success-msg');
    if (msg) {
        msg.classList.add('visible');
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // إخفاء بعد 6 ثواني
        setTimeout(function () {
            msg.classList.remove('visible');
        }, 6000);
    }
}

/** إظهار خطأ الشبكة */
function showNetworkError() {
    const errorAlert = document.getElementById('contact-network-error');
    if (errorAlert) {
        errorAlert.classList.add('visible');
        setTimeout(function () {
            errorAlert.classList.remove('visible');
        }, 5000);
    } else {
        alert('حدث خطأ في الاتصال، يرجى المحاولة لاحقاً أو التواصل عبر الهاتف.');
    }
}

/* ==========================================
   محاكاة طلب API (للعرض فقط)
   للباك اند: احذف هذه الدالة عند ربط API حقيقي
   ========================================== */
function simulateApiCall(data) {
    console.log('📤 بيانات النموذج المُرسلة (محاكاة):', data);
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            // محاكاة نجاح الإرسال 95% من الوقت
            if (Math.random() > 0.05) {
                resolve({ success: true, message: 'تم استلام رسالتك بنجاح' });
            } else {
                reject(new Error('خطأ في الشبكة'));
            }
        }, 1500); // تأخير 1.5 ثانية لمحاكاة الشبكة
    });
}

/* ==========================================
   زر CTA في الصفحة الرئيسية
   (بدء الحساب من الصفحة الرئيسية)
   ========================================== */
document.addEventListener('DOMContentLoaded', function () {
    const ctaForm = document.getElementById('cta-email-form');
    if (!ctaForm) return;

    ctaForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = document.getElementById('cta-email-input');
        const email = emailInput ? emailInput.value.trim() : '';

        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            /**
             * للباك اند: هنا يمكن:
             * 1. تخزين البريد في قائمة الرسائل البريدية
             *    POST /api/newsletter { email }
             * 2. أو توجيه المستخدم لحاسبة الطاقة
             */
            // حالياً: توجيه لصفحة الحاسبة
            window.location.href = 'pages/calculator.html';
        } else {
            emailInput && emailInput.classList.add('input-error');
        }
    });
});
