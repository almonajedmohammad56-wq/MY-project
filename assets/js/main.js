let currentLang = 'ar'; 
function initTranslations() {
    if (typeof window.TRANSLATIONS === 'undefined') {
        setTimeout(initTranslations, 100);
        return;
    }
    translatePage();
    console.log(` ${currentLang}`);
}
function translatePage() {
    const html = document.documentElement;
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');

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
}
document.addEventListener('DOMContentLoaded', function() {
    initTranslations(); 
    const sliders = document.querySelectorAll('#featuredEvents, #featuredSlider');
    sliders.forEach((slider) => {
        if (slider) {
            const carouselInstance = new bootstrap.Carousel(slider, {
                interval: 4000,
                pause: 'hover',
                ride: 'carousel'
            });
        }
    });
    window.applyFilters = function() {
        const cat = document.querySelector('#filter-category')?.value || '';
        const loc = document.querySelector('#filter-location')?.value || '';
        const eventWrappers = document.querySelectorAll('.event-wrapper');
        let visibleCount = 0;
        eventWrappers.forEach(wrapper => {
            const card = wrapper.querySelector('.event-card');
            if (!card) return;
            const show = (!cat || card.dataset.category === cat) && (!loc || card.dataset.location === loc);
            wrapper.classList.toggle('hidden', !show);
            if (show) visibleCount++;
        });

        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `(${visibleCount} فعالية)`;
        }
    };
    const toggle = document.querySelector('#darkModeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-theme'));
        });
    }
});
