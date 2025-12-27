// script.js – Clean & Optimized
// Handles: Search suggestions, mobile menu, sidebar toggle, header scroll, component loading

/* =========================
   SEARCH KEYWORDS
========================= */
const searchKeywords = [
    "Home", "Tutorials", "Library", "Coding Ground", "Contact",
    "Web Development", "Python", "Java", "Data Science", "Machine Learning",
    "JavaScript", "PHP", "C Programming", "SQL", "Android",
    "Online Compiler", "Interview Questions", "Certifications", "Projects"
];

/* =========================
   SEARCH SUGGESTIONS
========================= */
function showSuggestions(value, box) {
    if (!value.trim()) {
        box.classList.remove('show');
        box.innerHTML = '';
        return;
    }

    const filtered = searchKeywords
        .filter(k => k.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);

    if (!filtered.length) {
        box.classList.remove('show');
        box.innerHTML = '';
        return;
    }

    const safe = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safe})`, 'gi');

    box.innerHTML = filtered
        .map(item => `<div>${item.replace(regex, '<strong>$1</strong>')}</div>`)
        .join('');

    box.querySelectorAll('div').forEach(div => {
        div.addEventListener('click', () => {
            const parent = box.closest('.search-box, .mobile-search-top');
            const input = parent?.querySelector('input');
            if (input) input.value = div.textContent.trim();
            box.classList.remove('show');
            console.log('Search:', div.textContent.trim());
        });
    });

    box.classList.add('show');
}

/* =========================
   MAIN INITIALIZER
========================= */
function initApp() {
    const $ = id => document.getElementById(id);

    const desktopSearch = $('desktopSearch');
    const desktopSuggestions = $('desktopSuggestions');
    const mobileSearch = $('mobileSearch');
    const mobileSuggestions = $('mobileSuggestions');

    const hamburger = $('hamburger');
    const mobileMenu = $('mobileMenu');
    const closeMenu = $('closeMenu');

    const sidebar = $('sidebar');
    const sidebarToggle = $('sidebarToggle');
    const closeSidebar = $('closeSidebar');

    const header = $('header');

    // Search
    desktopSearch?.addEventListener('input', e =>
        showSuggestions(e.target.value, desktopSuggestions)
    );
    mobileSearch?.addEventListener('input', e =>
        showSuggestions(e.target.value, mobileSuggestions)
    );

    // Toggle Menu
    hamburger?.addEventListener('click', e => {
        e.stopPropagation();
        mobileMenu?.classList.add('open');
    });

    closeMenu?.addEventListener('click', () =>
        mobileMenu?.classList.remove('open')
    );

    sidebarToggle?.addEventListener('click', e => {
        e.stopPropagation();
        sidebar?.classList.add('open');
    });

    closeSidebar?.addEventListener('click', () =>
        sidebar?.classList.remove('open')
    );

    // Global Click Handler (merged & clean)
    document.addEventListener('click', e => {
        if (!e.target.closest('.search-box, .mobile-search-top')) {
            desktopSuggestions?.classList.remove('show');
            mobileSuggestions?.classList.remove('show');
        }

        if (mobileMenu && !mobileMenu.contains(e.target) && !hamburger?.contains(e.target)) {
            mobileMenu.classList.remove('open');
        }

        if (
            window.innerWidth <= 992 &&
            sidebar &&
            !sidebar.contains(e.target) &&
            !sidebarToggle?.contains(e.target)
        ) {
            sidebar.classList.remove('open');
        }
    });

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/* =========================
   COMPONENT LOADER
========================= */
async function loadComponent(containerId, path) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`${path} not found`);
        document.getElementById(containerId).innerHTML = await res.text();
    } catch (err) {
        console.error(err);
        document.getElementById(containerId).innerHTML =
            `<p style="color:red;padding:20px;">Failed to load ${path}</p>`;
    }
}

/* =========================
   BOOTSTRAP
========================= */
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadComponent('header-container', '/header.html'),
        loadComponent('sidebar-container', '/sidebar.html'),
        loadComponent('footer-container', '/footer.html') // ✅ footer added
    ]);

    initApp(); // single, clean init
});
