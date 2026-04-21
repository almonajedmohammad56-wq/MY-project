
let currentLang = localStorage.getItem('siteLang') || 'ar';

function initTranslations() {
    if (typeof window.TRANSLATIONS === 'undefined') {
        console.error('translations.js not loaded!');
        setTimeout(initTranslations, 100);
        return;
    }

    translatePage();
    setupLanguageSwitchers();
    console.log(`✅ Translations initialized for: ${currentLang}`);
}

function translatePage() {
    const html = document.documentElement;
    
    // Switch layout
    if (currentLang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        document.body.classList.remove('ltr');
        document.body.classList.add('rtl');
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl');
        document.body.classList.add('ltr');
    }

    // Translate data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const translations = window.TRANSLATIONS[currentLang];
        if (translations && translations[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[key];
            } else {
                el.textContent = translations[key];
            }
        }
    });

    // Special cases: multi-line
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.dataset.i18nHtml;
        const translations = window.TRANSLATIONS[currentLang];
        if (translations && translations[key]) {
            el.innerHTML = translations[key].replace(/\\n/g, '<br>');
        }
    });

    // Translate selects dynamically
    translateSelects();
    translateAlerts();
}

function translateSelects() {
    // Category filter
    const catSelect = document.querySelector('#filter-category');
    if (catSelect) {
        const options = ['categories.program', 'categories.sport', 'categories.kids', 'categories.culture'];
        catSelect.innerHTML = `<option value="">${window.TRANSLATIONS[currentLang]['filter.category'] || ''}</option>`;
        options.forEach(key => {
            const opt = document.createElement('option');
            opt.value = key.split('.').pop();
            opt.textContent = window.TRANSLATIONS[currentLang][key] || '';
            catSelect.appendChild(opt);
        });
    }

    // Location filter  
    const locSelect = document.querySelector('#filter-location');
    if (locSelect) {
        const options = ['locations.opera', 'locations.center', 'locations.hemk'];
        locSelect.innerHTML = `<option value="">${window.TRANSLATIONS[currentLang]['filter.location'] || ''}</option>`;
        options.forEach(key => {
            const opt = document.createElement('option');
            opt.value = key.split('.').pop().replace('damas', '');
            opt.textContent = window.TRANSLATIONS[currentLang][key] || '';
            locSelect.appendChild(opt);
        });
    }
}

function translateAlerts() {
    // Override showAlert with language
    window.showTranslatedAlert = function(msgKey, type) {
        const translations = window.TRANSLATIONS[currentLang];
        const msg = translations[msgKey] || msgKey;
        showAlert(msg, type);
    };
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('siteLang', lang);
    
    // Visual feedback
    document.querySelectorAll('#flag-ar, #flag-en').forEach(flag => {
        flag.style.opacity = flag.id === `flag-${lang}` ? '1' : '0.5';
        flag.style.transform = flag.id === `flag-${lang}` ? 'scale(1.1)' : 'scale(1)';
    });
    
    translatePage();
    
    // Re-apply filters to update counts
    if (typeof applyFilters === 'function') applyFilters();
    
    console.log(`🌐 Language switched to: ${lang}`);
}

function setupLanguageSwitchers() {
    document.getElementById('flag-ar')?.addEventListener('click', () => switchLanguage('ar'));
    document.getElementById('flag-en')?.addEventListener('click', () => switchLanguage('en'));
    
    // Initial visual state
    switchLanguage(currentLang);
}

// ===== ORIGINAL FUNCTIONALITY (Enhanced) =====
document.addEventListener('DOMContentLoaded', function() {
    // Init translations FIRST
    initTranslations();

    // Sliders (unchanged)
    const sliders = document.querySelectorAll('#featuredEvents, #featuredSlider');
    sliders.forEach((slider) => {
        if (slider) {
            const inner = slider.querySelector('.carousel-inner');
            if (inner && !slider.querySelector('.carousel-indicators')) {
                const indicatorsList = document.createElement('ol');
                indicatorsList.className = 'carousel-indicators';
                const itemCount = inner.querySelectorAll('.carousel-item').length;
                for (let i = 0; i < itemCount; i++) {
                    const indicator = document.createElement('li');
                    indicator.dataset.bsTarget = '#' + slider.id;
                    indicator.dataset.bsSlideTo = i;
                    indicator.className = i === 0 ? 'active' : '';
                    indicator.setAttribute('aria-label', `Slide ${i + 1}`);
                    indicatorsList.appendChild(indicator);
                }
                slider.insertBefore(indicatorsList, inner);
            }

            const carouselInstance = new bootstrap.Carousel(slider, {
                interval: 4000,
                wrap: true,
                pause: 'hover',
                keyboard: true,
                touch: true,
                ride: 'carousel'
            });

            slider.addEventListener('mouseenter focusin', () => carouselInstance.pause());
            slider.addEventListener('mouseleave focusout', () => carouselInstance.cycle());
        }
    });

    // Events Filter (ENHANCED for translation)
    window.applyFilters = function() {  // Make global for translation trigger
        const filterCategory = document.querySelector('#filter-category');
        const filterLocation = document.querySelector('#filter-location');
        const filterDate = document.querySelector('#filter-date');
        const eventsRow = document.getElementById('events-row');
        const noResults = document.getElementById('no-results');
        const resultsCount = document.getElementById('results-count');
        const eventWrappers = document.querySelectorAll('.event-wrapper');

        if (eventsRow) eventsRow.classList.add('filtering');

        setTimeout(() => {
            const cat = (filterCategory?.value || '').toLowerCase().trim();
            const loc = (filterLocation?.value || '').toLowerCase().trim();
            const date = filterDate?.value || '';

            let visibleCount = 0;
            let countText = currentLang === 'ar' 
                ? `(${visibleCount} فعالي${visibleCount === 1 ? 'ة' : 'يات'})`
                : `(${visibleCount} event${visibleCount === 1 ? '' : 's'})`;

            eventWrappers.forEach(wrapper => {
                const card = wrapper.querySelector('.event-card');
                if (!card) return;

                const cardCat = (card.dataset.category || '').toLowerCase().trim();
                const cardLoc = (card.dataset.location || '').toLowerCase().trim();
                const cardDate = card.dataset.date || '';

                let show = true;
                if (cat && cardCat !== cat) show = false;
                if (loc && cardLoc !== loc) show = false;
                if (date && cardDate !== date) show = false;

                wrapper.classList.toggle('hidden', !show);
                if (show) visibleCount++;
            });

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
            if (resultsCount) {
                resultsCount.textContent = currentLang === 'ar' 
                    ? `(${visibleCount} فعالي${visibleCount === 1 ? 'ة' : 'يات'})`
                    : `(${visibleCount} event${visibleCount === 1 ? '' : 's'})`;
            }

            if (eventsRow) eventsRow.classList.remove('filtering');
        }, 200);
    };

    const filterCategory = document.querySelector('#filter-category');
    const filterLocation = document.querySelector('#filter-location');
    const filterDate = document.querySelector('#filter-date');
    const clearFilters = document.querySelector('#clear-filters');

    if (filterCategory) filterCategory.addEventListener('change', window.applyFilters);
    if (filterLocation) filterLocation.addEventListener('change', window.applyFilters);
    if (filterDate) {
        filterDate.addEventListener('change', window.applyFilters);
        filterDate.addEventListener('input', () => setTimeout(window.applyFilters, 300));
    }
    if (clearFilters) {
        clearFilters.addEventListener('click', () => {
            if (filterCategory) filterCategory.value = '';
            if (filterLocation) filterLocation.value = '';
            if (filterDate) filterDate.value = '';
            window.applyFilters();
        });
    }
    window.applyFilters();

    // MULTILINGUAL Contact Form
    const contactForm = document.querySelector('#contactForm');
    const formAlert = document.querySelector('#formAlert');
    
    window.showAlert = function(msg, type) {
        if (formAlert) {
            formAlert.innerHTML = `
                <div class="alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show" role="alert">
                    ${msg}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            formAlert.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert(msg);
        }
    };

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.querySelector('#name').value.trim();
            const email = document.querySelector('#email').value.trim();
            const message = document.querySelector('#message').value.trim();

            if (!name || name.length < 2) {
                window.showTranslatedAlert('alert.name-error', 'danger');
                return;
            }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                window.showTranslatedAlert('alert.email-error', 'danger');
                return;
            }
            if (!message || message.length < 10) {
                window.showTranslatedAlert('alert.message-error', 'danger');
                return;
            }

            setTimeout(() => {
                window.showTranslatedAlert('alert.success', 'success');
                contactForm.reset();
            }, 500);
        });
    }

    // Dark mode with localStorage persistence (RTL/LTR compatible)
    function updateDarkMode() {
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkMode', isDark);
        const icon = document.querySelector('#theme-icon');
        if (icon) {
            icon.textContent = isDark ? '☀️' : '🌙';
        }
    }

    // Load saved theme
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-theme');
    }

    // Toggle handler
    const toggle = document.querySelector('#darkModeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            updateDarkMode();
        });
    }

    // Event navigation (unchanged)
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-primary[href*="event"], .btn-primary[data-event-id]')) {
            e.preventDefault();
            const eventId = e.target.dataset.eventId || 'event1';
            window.location.href = `event.html#${eventId}`;
        }
    });

    console.log('🚀 main.js loaded - FULL BILINGUAL SUPPORT ENABLED');
});

