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
// 3. Scroll-Triggered Animations (bidirectional, varied)
// ────────────────────────────────────────────────────────────
function setupScrollAnimations() {
    try {
        const animClasses = ['anim-slide-up', 'anim-slide-left', 'anim-slide-right', 'anim-scale-in', 'anim-fade'];

        // Sections get slide-up
        document.querySelectorAll('.section-header').forEach(el => {
            el.classList.add('anim-slide-up');
        });

        // Chart cards get varied animations
        document.querySelectorAll('.chart-card').forEach((el, i) => {
            el.classList.add(animClasses[i % animClasses.length]);
        });

        // Info cards alternate left/right
        document.querySelectorAll('.info-card').forEach((el, i) => {
            el.classList.add(i % 2 === 0 ? 'anim-slide-left' : 'anim-slide-right');
        });

        // Finding cards scale in
        document.querySelectorAll('.finding-card').forEach(el => {
            el.classList.add('anim-scale-in');
        });

        // Quote cards fade
        document.querySelectorAll('.quote-card').forEach(el => {
            el.classList.add('anim-fade');
        });

        // Summary cards scale
        document.querySelectorAll('.summary-card').forEach(el => {
            el.classList.add('anim-scale-in');
        });

        // Team cards slide up
        document.querySelectorAll('.team-card').forEach(el => {
            el.classList.add('anim-slide-up');
        });

        // Condition cards
        document.querySelectorAll('.condition').forEach((el, i) => {
            el.classList.add('anim-slide-up');
            el.style.transitionDelay = `${i * 80}ms`;
        });

        // Bidirectional observer — adds 'visible' on enter, removes on exit
        const allAnimated = document.querySelectorAll(
            '.anim-slide-up, .anim-slide-left, .anim-slide-right, .anim-scale-in, .anim-fade'
        );
        if (!allAnimated.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    } else {
                        // Remove visible when scrolling OUT — bidirectional
                        entry.target.classList.remove('visible');
                    }
                });
            },
            { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
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
// 6. Dark Mode Toggle
// ────────────────────────────────────────────────────────────
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // Default to light theme — only use dark if explicitly saved
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
// 7. Reading Progress Bar (smooth rAF-based)
// ────────────────────────────────────────────────────────────
function setupProgressBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;

    let ticking = false;
    function updateBar() {
        const winScroll = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? winScroll / docHeight : 0;
        bar.style.transform = `scaleX(${progress})`;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateBar);
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

        // Observe newly created quote cards for fade-in animation
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        container.querySelectorAll('.quote-card').forEach(card => {
            card.classList.add('fade-in-section');
            observer.observe(card);
        });
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
// 14. Card Tooltips & Verdicts (Enhancement 4)
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

    // Add generic verdict tooltips to info cards
    document.querySelectorAll('.info-card, .finding-card').forEach(card => {
        if (!card.hasAttribute('title')) {
            const heading = card.querySelector('h3, h4');
            if (heading) {
                card.setAttribute('title', `Verdict: Key insight regarding ${heading.textContent.trim()}`);
            }
        }
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
// 16. DOMContentLoaded — master initialisation
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

    // UX enhancements
    setupScrollAnimations();
    setupNavHighlight();
    setupHamburger();
    setupProgressBar();
    setupBackToTop();

    // Advanced enhancements
    setupSmoothScroll();
    setupKeyboardShortcuts();
    setupConditionLegend();
    setupStatTooltips();
    scrollToHashOnLoad();

    // Text hover effects
    setupTextHover();

    // Chart interactions
    setupChartFullscreen();

    // Card tilt effect
    setupCardTilt();

    // Staggered card entries
    setupStaggeredEntries();

    // Active section counter
    setupActiveSectionCounter();
});

// ────────────────────────────────────────────────────────────
// 17. Global Text Hover Effect
// ────────────────────────────────────────────────────────────
function setupTextHover() {
    // Apply subtle hover effect to all content text
    const selectors = [
        '.info-card h3', '.info-card p',
        '.section-desc',
        '.finding-card h4', '.finding-card p',
        '.summary-card h4', '.summary-card p',
        '.quote-card p', '.quote-card blockquote',
        '.team-card h4', '.team-card p',
        '.chart-verdict',
        '.fact-list li'
    ];
    document.querySelectorAll(selectors.join(', ')).forEach(el => {
        el.classList.add('text-hover-target');
    });
}

// ────────────────────────────────────────────────────────────
// 18. Chart Fullscreen on Double-Click
// ────────────────────────────────────────────────────────────
function setupChartFullscreen() {
    document.querySelectorAll('.chart-card').forEach(card => {
        card.addEventListener('dblclick', () => {
            if (card.classList.contains('chart-fullscreen')) {
                card.classList.remove('chart-fullscreen');
                document.body.style.overflow = '';
            } else {
                // Close any other fullscreen chart first
                document.querySelectorAll('.chart-fullscreen').forEach(c => {
                    c.classList.remove('chart-fullscreen');
                });
                card.classList.add('chart-fullscreen');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Escape closes fullscreen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.chart-fullscreen').forEach(c => {
                c.classList.remove('chart-fullscreen');
            });
            document.body.style.overflow = '';
        }
    });

    // Add hint text
    document.querySelectorAll('.chart-container').forEach(container => {
        container.setAttribute('title', 'Double-click to fullscreen');
    });
}

// ────────────────────────────────────────────────────────────
// 19. Card 3D Tilt Effect
// ────────────────────────────────────────────────────────────
function setupCardTilt() {
    // Exclude chart cards because continuous 3D transforms break Chart.js canvas mouse tracking
    const cards = document.querySelectorAll('.glass:not(.chart-card)');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ────────────────────────────────────────────────────────────
// 20. Staggered Card Entry Delays
// ────────────────────────────────────────────────────────────
function setupStaggeredEntries() {
    document.querySelectorAll('.card-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.glass');
        cards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 100}ms`;
        });
    });
}

// ────────────────────────────────────────────────────────────
// 21. Active Section Counter Display
// ────────────────────────────────────────────────────────────
function setupActiveSectionCounter() {
    const sections = document.querySelectorAll('.section[id]');
    const totalSections = sections.length;
    if (totalSections === 0) return;

    // Create counter element
    const counter = document.createElement('div');
    counter.className = 'section-counter';
    counter.innerHTML = '<span class="sc-current">1</span> / <span class="sc-total">' + totalSections + '</span>';
    document.body.appendChild(counter);

    const currentSpan = counter.querySelector('.sc-current');
    let currentSection = 1;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + window.innerHeight / 3;
        let activeIndex = 1;
        sections.forEach((sec, i) => {
            if (sec.offsetTop <= scrollY) {
                activeIndex = i + 1;
            }
        });
        if (activeIndex !== currentSection) {
            currentSection = activeIndex;
            currentSpan.textContent = currentSection;
        }
        // Show only when scrolled past hero
        counter.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
    }, { passive: true });
}
