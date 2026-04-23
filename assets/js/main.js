document.addEventListener("DOMContentLoaded", function () {
  // تفعيل السلايدر تلقائيًا
  const carousel = document.querySelector('#featuredEvents');
  if (carousel) {
    new bootstrap.Carousel(carousel, {
      interval: 3000,
      ride: 'carousel'
    });
  }

  /* ====== صفحة الفعاليات (events.html) ====== */
  // فلترة الفعاليات المتقدمة
  const filterCategory = document.getElementById("filter-category");
  const filterLocation = document.getElementById("filter-location");
  const filterDate = document.getElementById("filter-date");
  const cards = document.querySelectorAll(".event-card");

  // دالة فلترة الفعاليات
  function filterEvents() {
    const selectedCategory = filterCategory ? filterCategory.value : "";
    const selectedLocation = filterLocation ? filterLocation.value : "";
    const selectedDate = filterDate ? filterDate.value : "";

    let visibleCount = 0;

    cards.forEach(card => {
      let showCard = true;

      // فلترة حسب التصنيف
      if (selectedCategory && selectedCategory !== "") {
        const cardCategory = card.getAttribute("data-category");
        if (cardCategory !== selectedCategory) {
          showCard = false;
        }
      }

      // فلترة حسب الموقع
      if (selectedLocation && selectedLocation !== "" && showCard) {
        const cardLocation = card.getAttribute("data-location");
        if (cardLocation !== selectedLocation) {
          showCard = false;
        }
      }

      // فلترة حسب التاريخ
      if (selectedDate && selectedDate !== "" && showCard) {
        const cardDate = card.getAttribute("data-date");
        if (cardDate !== selectedDate) {
          showCard = false;
        }
      }

      // إظهار أو إخفاء البطاقة
      if (showCard) {
        card.style.display = "block";
        card.style.animation = "fadeIn 0.5s ease-in-out";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // إظهار رسالة إذا لم توجد نتائج
    showFilterResults(visibleCount);
  }

  // دالة إظهار نتائج الفلترة
  function showFilterResults(count) {
    // إزالة رسالة النتائج السابقة إن وجدت
    const existingMessage = document.getElementById("filter-results-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // إضافة رسالة النتائج
    if (count === 0) {
      const resultsContainer = document.querySelector(".container.py-5");
      if (resultsContainer) {
        const message = document.createElement("div");
        message.id = "filter-results-message";
        message.className = "alert alert-info text-center mt-4";
        message.innerHTML = `
          <i class="fas fa-info-circle"></i>
          <strong>لم يتم العثور على فعاليات</strong><br>
          جرب تغيير معايير البحث أو <button class="btn btn-link p-0" onclick="document.getElementById('clear-filters').click()">مسح الفلاتر</button>
        `;
        resultsContainer.appendChild(message);
      }
    }
  }

  // إضافة مستمعي الأحداث للحقول
  if (filterCategory) {
    filterCategory.addEventListener("change", filterEvents);
  }
  
  if (filterLocation) {
    filterLocation.addEventListener("change", filterEvents);
  }
  
  if (filterDate) {
    filterDate.addEventListener("change", filterEvents);
  }

  // زر مسح الفلاتر
  const clearFiltersBtn = document.getElementById("clear-filters");
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      // مسح جميع الحقول
      if (filterCategory) filterCategory.value = "";
      if (filterLocation) filterLocation.value = "";
      if (filterDate) filterDate.value = "";
      
      // إزالة رسالة النتائج إن وجدت
      const existingMessage = document.getElementById("filter-results-message");
      if (existingMessage) {
        existingMessage.remove();
      }
      
      // إظهار جميع البطاقات
      cards.forEach(card => {
        card.style.display = "block";
        card.style.animation = "fadeIn 0.5s ease-in-out";
      });
    });
  }

  // فلترة الفعاليات القديمة (للتوافق مع الأزرار)
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");
        
        // تحديث حقل التصنيف
        if (filterCategory) {
          filterCategory.value = category;
        }

        cards.forEach(card => {
          if (category === "all" || card.classList.contains(category)) {
            card.style.display = "block";
            card.style.animation = "fadeIn 0.5s ease-in-out";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // إضافة وظيفة showAlert العامة
  window.showAlert = function(msg) {
    const alertBox = document.getElementById("formAlert");
    if (alertBox) {
      alertBox.innerHTML = `<p>${msg}</p>`;
    }
  };

});


 // ========== صفحة تفاصيل الفعالية ==========

// زر "أضف للتقويم"
const addToCalendarBtn = document.getElementById("addToCalendar");
if (addToCalendarBtn) {
  addToCalendarBtn.addEventListener("click", () => {
    alert("تمت إضافة الفعالية إلى التقويم ");
  });
}

// زر "شارك"
const shareEventBtn = document.getElementById("shareEvent");
if (shareEventBtn) {
  shareEventBtn.addEventListener("click", () => {
    alert("تم نسخ رابط الفعالية للمشاركة ");
  });
}

// contact form validation
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const alertBox = document.getElementById("formAlert");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // التحقق من الحقول
      if (name === "" || email === "" || message === "") {
        showAlert("الرجاء ملء جميع الحقول.", "wrong");
        return;
      }

      // التحقق من صيغة البريد
      if (!email.includes("@gmail.com")) {
        alert("رجاءً أدخل بريد صحيح من نوع Gmail");
        return;
      }

      // نجاح
      showAlert("تم إرسال رسالتك بنجاح ", "success");
      form.reset();
    });

    function showAlert(message, type) {
      alertBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
        </div>`;
    }
  }
});document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const themeIcon = document.getElementById("theme-icon");

  // . التحقق من التفضيل المحفوظ عند تحميل الصفحة
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
    if (themeIcon) themeIcon.textContent = "☀️"; // تغيير الأيقونة لشمس
  }

  // . كود الضغط على الزر
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", function () {
      body.classList.toggle("dark-theme");
      
      const isDark = body.classList.contains("dark-theme");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      
      // تحديث الأيقونة
      if (themeIcon) {
        themeIcon.textContent = isDark ? "☀️" : "🌙";
      }
    });
  }
  
  // ... باقي كود السلايدر والفلترة الخاص بك يوضع هنا ...
});
