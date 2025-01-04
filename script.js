document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sidebar = document.querySelector('.sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mainContent = document.querySelector('.main-content');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    let lastScrollTop = 0;
    let ticking = false;

    // Update active section highlight
    function updateSectionHighlight(section) {
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const sectionBefore = section.querySelector('::before');
        
        if (section.classList.contains('active')) {
            // Update the highlight position and height
            section.style.setProperty('--highlight-top', `${rect.top}px`);
            section.style.setProperty('--highlight-height', `${rect.height}px`);
            
            // Add CSS custom properties for the highlight
            const style = document.createElement('style');
            style.textContent = `
                section.active::before {
                    top: var(--highlight-top);
                    height: var(--highlight-height);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Update active link and section
    function updateActiveLink(currentId) {
        // Remove active class from all sections and links
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.removeProperty('--highlight-top');
            section.style.removeProperty('--highlight-height');
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.style.transform = 'translateX(0)';
        });

        // Add active class to current section and its link
        if (currentId) {
            const currentSection = document.getElementById(currentId);
            const activeLink = document.querySelector(`.nav-links a[href="#${currentId}"]`);
            
            if (currentSection) {
                currentSection.classList.add('active');
                updateSectionHighlight(currentSection);
            }
            
            if (activeLink) {
                activeLink.classList.add('active');
                activeLink.style.transform = 'translateX(5px)';
            }
        }
    }

    // Intersection Observer callback
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0.5) {
                updateActiveLink(entry.target.id);
            }
        });
    };

    // Create and start the observer
    const observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: [0.5]
    });

    // Observe all sections
    sections.forEach(section => observer.observe(section));

    // Handle scroll events with debouncing
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Find the current section
                const current = Array.from(sections).find(section => {
                    const rect = section.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                });

                if (current) {
                    updateActiveLink(current.id);
                    updateSectionHighlight(current);
                }

                ticking = false;
            });
            ticking = true;
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', onScroll, { passive: true });
    // Add resize event listener to update highlight positions
    window.addEventListener('resize', () => {
        const activeSection = document.querySelector('section.active');
        if (activeSection) {
            updateSectionHighlight(activeSection);
        }
    });

    // Handle click events on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            updateActiveLink(targetId);
            
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    });

    // Initial check for active section
    const initialSection = Array.from(sections).find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
    });

    if (initialSection) {
        updateActiveLink(initialSection.id);
    }

    const brandButton = document.querySelector('.nav-brand');
    
    brandButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Function to handle sidebar toggle
    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Save sidebar state to localStorage
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }

    // Handle sidebar toggle click
    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });

    // Load saved sidebar state
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true' && !mediaQuery.matches) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }

    // Handle window resize
    function handleResize() {
        if (mediaQuery.matches) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        } else {
            // Restore saved state on desktop
            const savedState = localStorage.getItem('sidebarCollapsed');
            if (savedState === 'true') {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            }
        }
    }

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
}); 