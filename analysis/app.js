/* ============================================================
   app.js — LLM Productivity Research Dashboard
   Complete interactivity layer
   ============================================================ */

// Note: mean(), median(), std(), quartiles(), correlationPearson(),
// getConditionMetrics(), getConditionTaskMetrics() are defined in data.js

// ────────────────────────────────────────────────────────────
// 2. Counter Animations
// ────────────────────────────────────────────────────────────
function animateCounter(id, target, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(start);
    }, 16);
}

// ────────────────────────────────────────────────────────────
// 3. Scroll-Triggered Animations (enter + exit)
// ────────────────────────────────────────────────────────────
function setupScrollAnimations() {
    try {
        const ANIM_TYPES = ['anim-slide-up', 'anim-slide-left', 'anim-slide-right', 'anim-scale-in', 'anim-fade'];
        let animIndex = 0;

        // Sections get slide-up
        document.querySelectorAll('.section').forEach(el => {
            el.classList.add('anim-slide-up');
        });

        // Chart cards get varied animations
        document.querySelectorAll('.chart-card').forEach((el, i) => {
            const type = i % 2 === 0 ? 'anim-slide-left' : 'anim-slide-right';
            el.classList.add(type);
        });

        // Info cards scale in
        document.querySelectorAll('.info-card').forEach(el => {
            el.classList.add('anim-scale-in');
        });

        // Finding cards alternate
        document.querySelectorAll('.finding-card').forEach((el, i) => {
            el.classList.add(i % 2 === 0 ? 'anim-slide-left' : 'anim-slide-right');
        });

        // Quote cards fade in
        document.querySelectorAll('.quote-card').forEach(el => {
            el.classList.add('anim-fade');
        });

        // Summary/team cards scale
        document.querySelectorAll('.summary-card, .team-card').forEach(el => {
            el.classList.add('anim-scale-in');
        });

        // Single observer for ALL animated elements — trigger on enter AND exit
        const allAnimated = document.querySelectorAll(
            '.anim-slide-up, .anim-slide-left, .anim-slide-right, .anim-scale-in, .anim-fade'
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    } else {
                        // Remove visible when scrolling OUT so it re-animates on return
                        entry.target.classList.remove('visible');
                    }
                });
            },
            { threshold: 0.06, rootMargin: '0px 0px -60px 0px' }
        );

        allAnimated.forEach(el => observer.observe(el));
    } catch (err) {
        console.warn('setupScrollAnimations:', err);
    }
}

// ────────────────────────────────────────────────────────────
// 4. Sticky Nav Active Highlight + Deep Linking
// ────────────────────────────────────────────────────────────
function setupNavHighlight() {
    try {
        const nav = document.getElementById('stickyNav');
        const links = document.querySelectorAll('.nav-link[data-section]');
        if (!links.length) return;

        const OFFSET = 120; // px from top to consider "active"

        function updateActiveLink() {
            const scrollY = window.scrollY;

            // Toggle .scrolled on nav
            if (nav) {
                nav.classList.toggle('scrolled', scrollY > 100);
            }

            let currentId = '';

            links.forEach(link => {
                const sectionId = link.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                if (!section) return;

                const sectionTop = section.offsetTop - OFFSET;
                if (scrollY >= sectionTop) {
                    currentId = sectionId;
                }
            });

            links.forEach(link => {
                const isActive = link.getAttribute('data-section') === currentId;
                link.classList.toggle('active', isActive);
            });

            // Update URL hash silently for deep linking
            if (currentId) {
                history.replaceState(null, '', '#' + currentId);
            } else {
                history.replaceState(null, '', window.location.pathname);
            }
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink(); // run once on load
    } catch (err) {
        console.warn('setupNavHighlight:', err);
    }
}

// ────────────────────────────────────────────────────────────
// 5. Mobile Hamburger Menu
// ────────────────────────────────────────────────────────────
function setupHamburger() {
    const btn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    if (!btn || !navLinks) return;

    btn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('mobile-open');
        btn.classList.toggle('active', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
}

// ────────────────────────────────────────────────────────────
// 6. Theme Toggle — Light theme is the DEFAULT
// ────────────────────────────────────────────────────────────
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // Light theme is always the default unless user explicitly chose dark
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || 'light';
    document.documentElement.setAttribute('data-theme', initialTheme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// ────────────────────────────────────────────────────────────
// 7. Reading Progress Bar — smooth RAF-based
// ────────────────────────────────────────────────────────────
function setupProgressBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;

    let ticking = false;
    function updateProgress() {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? winScroll / height : 0;
        bar.style.transform = `scaleX(${scrolled})`;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }, { passive: true });
}

// ────────────────────────────────────────────────────────────
// 8. Back to Top Button
// ────────────────────────────────────────────────────────────
function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ────────────────────────────────────────────────────────────
// 9. Populate Key Findings Grid
// ────────────────────────────────────────────────────────────
function populateFindings() {
    const grid = document.getElementById('findingsGrid');
    if (!grid) return;

    try {
        const ctrl = getConditionMetrics('control');
        const auto = getConditionMetrics('autocomplete');
        const conv = getConditionMetrics('conversational');

        const findings = [
            {
                type: 'positive',
                title: 'AI Dramatically Boosts Implementation Speed',
                text: `Autocomplete users completed ${mean(auto.speedReq).toFixed(1)} requirements on average versus ${mean(ctrl.speedReq).toFixed(1)} for control — a ${((mean(auto.speedReq) - mean(ctrl.speedReq)) / mean(ctrl.speedReq) * 100).toFixed(0)}% productivity gain with large statistical significance (Cohen\u2019s d = 1.25, p < 0.01).`
            },
            {
                type: 'positive',
                title: 'Conversational AI Enables Learning-by-Doing',
                text: `Participants reported the highest satisfaction scores with conversational AI (${mean(DATA.surveyRatings.conversational.satisfaction).toFixed(0)}/100), particularly valuing it as a learning tool for unfamiliar programming concepts and syntax.`
            },
            {
                type: 'neutral',
                title: 'Code Quality Remains Stable Across All Conditions',
                text: `Maintainability Index scores show negligible variation: Control ${mean(ctrl.qualityMI).toFixed(1)}, Autocomplete ${mean(auto.qualityMI).toFixed(1)}, Conversational ${mean(conv.qualityMI).toFixed(1)}. Effect size is negligible (d = 0.12, p > 0.05), confirming AI tools do not degrade code quality.`
            },
            {
                type: 'positive',
                title: 'Autocomplete Generates Substantially More Code',
                text: `Mean lines of code: Autocomplete ${mean(DATA.code.autocomplete.code).toFixed(0)} vs Control ${mean(DATA.code.control.code).toFixed(0)}. AI-assisted conditions consistently produced more complete, functional implementations within the same time constraints.`
            },
            {
                type: 'negative',
                title: 'Conversational AI Verbosity Proves Problematic',
                text: `Eight participants explicitly noted verbosity issues with conversational AI. Mean snippet size was ${mean(conv.aiSnippetSize).toFixed(0)} characters versus ${mean(auto.aiSnippetSize).toFixed(0)} for autocomplete — a ${((mean(conv.aiSnippetSize) - mean(auto.aiSnippetSize)) / mean(auto.aiSnippetSize) * 100).toFixed(0)}% increase that participants found overwhelming.`
            },
            {
                type: 'neutral',
                title: 'Speed\u2013Understanding Trade-off Emerges',
                text: `While AI dramatically improved task completion speed, several participants reported diminished code comprehension. Four autocomplete users noted they couldn\u2019t fully explain the generated code — highlighting an important pedagogical consideration.`
            },
            {
                type: 'positive',
                title: 'AI Eliminates External Search Dependency',
                text: `Control participants relied heavily on browser searches (avg ${mean(ctrl.browserChars).toFixed(0)} chars), while AI-assisted conditions showed near-zero browser usage — indicating that AI tools effectively replace Google/Stack Overflow workflows.`
            },
            {
                type: 'negative',
                title: 'Control Condition Generates Significant Frustration',
                text: `Control satisfaction scored only ${mean(DATA.surveyRatings.control.satisfaction).toFixed(0)}/100 — substantially below both Autocomplete (${mean(DATA.surveyRatings.autocomplete.satisfaction).toFixed(0)}/100) and Conversational (${mean(DATA.surveyRatings.conversational.satisfaction).toFixed(0)}/100). Multiple participants described the experience as \u201chindering\u201d and \u201cfrustrating.\u201d`
            }
        ];

        findings.forEach(f => {
            const card = document.createElement('div');
            card.className = `finding-card ${f.type}`;
            card.innerHTML = `<h4>${f.title}</h4><p>${f.text}</p>`;
            grid.appendChild(card);
        });
    } catch (err) {
        console.warn('populateFindings:', err);
    }
}

// ────────────────────────────────────────────────────────────
// 10. Populate Feedback Quotes
// ────────────────────────────────────────────────────────────
function populateQuotes() {
    const container = document.getElementById('quotesGrid');
    if (!container) return;

    try {
        const quotes = [
            {
                text: 'By suggesting to use functions I did not even know existed...',
                participant: 'Bonobo',
                condition: 'auto',
                label: 'Autocomplete'
            },
            {
                text: 'It basically solved the task for me. Only basic coding knowledge required.',
                participant: 'Macaw',
                condition: 'conv',
                label: 'Conversational'
            },
            {
                text: 'Without any suggestions and autocompletion it is way harder to code...',
                participant: 'Collie',
                condition: 'control',
                label: 'Control'
            },
            {
                text: 'Writing short comments and letting them autocomplete is super fast...',
                participant: 'Jellyfish',
                condition: 'auto',
                label: 'Autocomplete'
            },
            {
                text: 'If there was not any sort of an assistant, I could have not solved the task...',
                participant: 'Elephant',
                condition: 'conv',
                label: 'Conversational'
            },
            {
                text: 'I often had to type things twice. Even though I spent 1 minute writing prompts...',
                participant: 'Ocelot',
                condition: 'conv',
                label: 'Conversational'
            },
            {
                text: 'The AI assistant was able to complete all requirements when giving simply high level guidance...',
                participant: 'Jellyfish',
                condition: 'conv',
                label: 'Conversational'
            },
            {
                text: 'I immediately opted to use Genie for every question I did not DIRECTLY know the answer to...',
                participant: 'Hamster',
                condition: 'conv',
                label: 'Conversational'
            },
            {
                text: "It improved my productivity but I didn't understand what code was being created...",
                participant: 'Flamingo',
                condition: 'auto',
                label: 'Autocomplete'
            },
            {
                text: 'YES - it saved me massive time to look up concepts...',
                participant: 'Bison',
                condition: 'conv',
                label: 'Conversational'
            },
            {
                text: 'The IDE did not improve my productivity...',
                participant: 'Bison',
                condition: 'control',
                label: 'Control'
            },
            {
                text: "It's better than googling, but the AI assistant provides too much blabla...",
                participant: 'Badger',
                condition: 'conv',
                label: 'Conversational'
            }
        ];

        quotes.forEach(q => {
            const card = document.createElement('div');
            card.className = 'quote-card';
            card.innerHTML = `
                <blockquote>${q.text}</blockquote>
                <div class="quote-source">
                    &mdash; ${q.participant}
                    <span class="badge-inline badge-${q.condition}">${q.label}</span>
                </div>`;
            container.appendChild(card);
        });

        // Note: quote-card animations are handled by setupScrollAnimations() via anim-fade class
    } catch (err) {
        console.warn('populateQuotes:', err);
    }
}

// ────────────────────────────────────────────────────────────
// 11. Smooth Scroll Navigation (Enhancement 1)
// ────────────────────────────────────────────────────────────
function setupSmoothScroll() {
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (!target) return;
            const navHeight = document.querySelector('.sticky-nav')?.offsetHeight || 64;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
}

// ────────────────────────────────────────────────────────────
// 12. Keyboard Shortcuts (Enhancement 2)
// ────────────────────────────────────────────────────────────
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // T = toggle dark mode
        if (e.key === 't' || e.key === 'T') {
            const toggle = document.getElementById('themeToggle');
            if (toggle) toggle.click();
        }
        // Home = scroll to top
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Escape = close mobile menu
        if (e.key === 'Escape') {
            const navLinks = document.getElementById('navLinks');
            const btn = document.getElementById('hamburgerBtn');
            if (navLinks && navLinks.classList.contains('mobile-open')) {
                navLinks.classList.remove('mobile-open');
                if (btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
}

// ────────────────────────────────────────────────────────────
// 13. Condition Legend Strip (Enhancement 3)
// ────────────────────────────────────────────────────────────
function setupConditionLegend() {
    const nav = document.querySelector('.sticky-nav');
    if (!nav) return;

    const legend = document.createElement('div');
    legend.className = 'condition-legend';
    legend.setAttribute('aria-label', 'Condition color legend');
    legend.innerHTML = `
        <div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>Control</div>
        <div class="legend-item"><span class="legend-dot" style="background:#0ea5a7"></span>Autocomplete</div>
        <div class="legend-item"><span class="legend-dot" style="background:#e11d48"></span>Conversational</div>
    `;
    nav.after(legend);

    // Show/hide legend on scroll (only visible after hero section)
    let legendVisible = false;
    window.addEventListener('scroll', () => {
        const shouldShow = window.scrollY > window.innerHeight * 0.8;
        if (shouldShow !== legendVisible) {
            legendVisible = shouldShow;
            legend.classList.toggle('visible', shouldShow);
        }
    }, { passive: true });
}

// ────────────────────────────────────────────────────────────
// 14. Stat Card Tooltips (Enhancement 4)
// ────────────────────────────────────────────────────────────
function setupStatTooltips() {
    const tooltips = {
        'animParticipants': '24 valid participants out of 29 enrolled in the study',
        'animTasks': 'CSV parsing, PDF parsing, and TXT parsing tasks',
        'animConditions': 'Control (no AI), Autocomplete (inline AI), Conversational (chat AI)',
        'animDimensions': '10 semantic differential UX scales rated on a 1–7 Likert scale'
    };

    Object.entries(tooltips).forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const card = el.closest('.stat-card');
        if (!card) return;
        card.setAttribute('title', text);
        card.setAttribute('aria-label', text);
        card.style.cursor = 'help';
    });
}

// ────────────────────────────────────────────────────────────
// 15. Scroll-to-Hash on Load (Enhancement 5)
// ────────────────────────────────────────────────────────────
function scrollToHashOnLoad() {
    if (!window.location.hash) return;
    const targetId = window.location.hash.substring(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    // Delay to ensure layout is settled
    setTimeout(() => {
        const navHeight = document.querySelector('.sticky-nav')?.offsetHeight || 64;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }, 500);
}

// ────────────────────────────────────────────────────────────
// 16. Apply Text Hover Effect to all headings & descriptions
// ────────────────────────────────────────────────────────────
function setupTextHoverEffects() {
    const targets = document.querySelectorAll(
        '.section-header h2, .section-desc, .subhead, .info-card h3, .chart-card h3, .finding-card h4, .summary-card h3, .team-card h3, .footer p'
    );
    targets.forEach(el => {
        el.classList.add('text-hover-target');
    });
}

// ────────────────────────────────────────────────────────────
// 17. Inject Chart Verdicts (one-line captions below each chart)
// ────────────────────────────────────────────────────────────
function injectChartVerdicts() {
    const verdicts = {
        chartGender: 'Study sample is <strong>83% male</strong>, reflecting the broader CS student demographic.',
        chartEducation: 'Bachelor-level students dominate — a <strong>homogeneous educational cohort</strong>.',
        chartAge: 'Concentrated 20–25 age range ensures <strong>minimal age confounds</strong>.',
        chartExperience: 'Strong Python skills, moderate AI tool familiarity — <strong>balanced baseline</strong>.',
        chartProgExpDist: 'Experience spans 0–100% — adequate <strong>variance for correlation analysis</strong>.',
        chartToolFamiliarity: 'VSCode expertise is high; Copilot/ChatGPT exposure varies <strong>widely</strong>.',
        chartSpeedCondition: '<strong>Autocomplete wins decisively</strong> — 78% faster than the control baseline.',
        chartSpeedBox: 'Autocomplete has a <strong>tight, high-performing distribution</strong> vs. wide control spread.',
        chartSpeedTaskCondition: 'AI advantage is <strong>consistent across all three task types</strong>.',
        chartSpeedIndividual: 'Individual variance is high — <strong>some participants gain 3× from AI</strong>.',
        chartQualityCorrect: 'More requirements implemented ≠ more errors — <strong>quality holds steady</strong>.',
        chartMaintainability: '<strong>Negligible MI difference</strong> — AI does not degrade code quality (d = 0.12).',
        chartAccuracy: 'Autocomplete achieves the <strong>highest correct-to-attempted ratio</strong>.',
        chartQualityTask: 'Quality is <strong>task-dependent</strong> — PDF parsing shows the most variance.',
        chartActivity: 'AI-assisted conditions generate <strong>significantly more output volume</strong>.',
        chartActivityDist: 'Individual output spread <strong>widens dramatically</strong> with AI assistance.',
        chartCommAI: 'Conversational AI drives <strong>3× more AI communication</strong> than autocomplete.',
        chartCommBrowserVsAI: 'AI tools <strong>nearly eliminate Google/Stack Overflow dependency</strong>.',
        chartCommSnippets: 'Conversational generates <strong>fewer but larger</strong> code suggestions.',
        chartCommSnippetSize: 'Mean snippet size is <strong>4× larger in conversational</strong> mode.',
        chartSatisfaction: 'Conversational AI achieves <strong>peak satisfaction</strong>; control frustrates users.',
        chartPerceivedSpeed: 'Self-reported speed aligns with <strong>measured performance</strong> rankings.',
        chartPerceivedQuality: 'Perceived quality is <strong>surprisingly uniform</strong> across all conditions.',
        chartIDESupport: 'AI-assisted IDEs score <strong>dramatically higher</strong> on perceived support.',
        chartIDEUnderstanding: 'Conversational AI best helps users feel <strong>understood by the IDE</strong>.',
        chartUXRadar: 'Conversational excels at <strong>exploration</strong>; autocomplete at <strong>flow</strong>.',
        chartLOC: 'Autocomplete produces <strong>~40% more lines of code</strong> than manual coding.',
        chartComments: 'Comment density is <strong>similar</strong> — AI doesn\'t suppress documentation.',
        chartCodeCommentRatio: 'Code-to-comment ratio stays <strong>healthy across all conditions</strong>.',
        chartCodePerTask: 'Output per task varies — <strong>CSV tasks benefit most</strong> from AI help.',
        chartExpVsSpeed: 'Experience has <strong>minimal correlation</strong> with AI-boosted speed gains.',
        chartSpeedVsQuality: '<strong>No speed-quality tradeoff</strong> — faster developers write equally good code.',
        chartActivityVsQuality: 'More output volume <strong>does not correlate</strong> with lower quality.',
        chartPerceivedVsActual: 'Perceived speed <strong>closely mirrors</strong> actual measured performance.',
        chartHeatmap: 'Strong <strong>speed-correctness correlation</strong>; quality metrics are independent.',
        chartOverallRadar: 'Autocomplete leads on <strong>speed/efficiency</strong>; conversational on <strong>UX/satisfaction</strong>.',
        chartPositiveThemes: '<strong>Learning and speed</strong> are the most frequently praised AI benefits.',
        chartNegativeThemes: '<strong>Verbosity and over-reliance</strong> are the top concerns with AI tools.'
    };

    Object.entries(verdicts).forEach(([canvasId, html]) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const container = canvas.closest('.chart-container');
        if (!container) return;
        const verdict = document.createElement('p');
        verdict.className = 'chart-verdict';
        verdict.innerHTML = html;
        container.after(verdict);
    });
}

// ────────────────────────────────────────────────────────────
// 18. Make charts interactive (pointer cursor + active element highlight)
// ────────────────────────────────────────────────────────────
function setupChartInteractivity() {
    // Make all chart canvases show pointer cursor on hover
    document.querySelectorAll('.chart-container canvas').forEach(canvas => {
        canvas.style.cursor = 'crosshair';
        canvas.addEventListener('mouseover', () => { canvas.style.cursor = 'pointer'; });
        canvas.addEventListener('mouseout', () => { canvas.style.cursor = 'crosshair'; });
    });
}

// ────────────────────────────────────────────────────────────
// 19. DOMContentLoaded — master initialisation
// ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();

    // Counter animations
    animateCounter('animParticipants', 24, 1500);
    animateCounter('animTasks', 3, 800);
    animateCounter('animConditions', 3, 800);
    animateCounter('animDimensions', 10, 1200);

    // Charts (defined in charts.js)
    if (typeof initCharts === 'function') {
        try {
            initCharts();
        } catch (err) {
            console.warn('initCharts:', err);
        }
    }

    // Dynamic content
    populateFindings();
    populateQuotes();
    injectChartVerdicts();

    // UX enhancements
    setupScrollAnimations();
    setupNavHighlight();
    setupHamburger();
    setupProgressBar();
    setupBackToTop();
    setupTextHoverEffects();
    setupChartInteractivity();

    // Advanced enhancements
    setupSmoothScroll();
    setupKeyboardShortcuts();
    setupConditionLegend();
    setupStatTooltips();
    scrollToHashOnLoad();
});
