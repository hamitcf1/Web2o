const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = document.querySelector('.theme-icon');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
});

document.addEventListener('DOMContentLoaded', () => {
    // Get all nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Function to update active link
    const updateActiveLink = () => {
        const fromTop = window.scrollY;
        
        navLinks.forEach(link => {
            const section = document.querySelector(link.hash);
            
            if (
                section.offsetTop <= fromTop + 150 &&
                section.offsetTop + section.offsetHeight > fromTop + 150
            ) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}); 

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contact-modal');
    const ctaButton = document.querySelector('.cta-button');
    const modalClose = document.querySelector('.modal-close');

    // Open modal
    ctaButton.addEventListener('click', () => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Animate course items when they come into view
    const courseItems = document.querySelectorAll('.courses li, .course-item');
    const courseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                courseObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    courseItems.forEach(item => {
        courseObserver.observe(item);
    });
}); 

function handleScrollAnimation() {
    const elements = document.querySelectorAll('.scroll-animation');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => observer.observe(element));
}

document.addEventListener('DOMContentLoaded', handleScrollAnimation); 

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
}); 

// Animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    const animatedElements = document.querySelectorAll('.animate');
    animatedElements.forEach((el) => observer.observe(el));
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.querySelector(".location").addEventListener("mouseenter", function () {
    let icon = this.querySelector("i");
    let icons = ["<i class='fa-solid fa-sun'></i>", "<i class='fa-solid fa-umbrella-beach'></i>", '<i class="fas fa-map-marker-alt"></i>']; 
    let index = 0;

    // Store the original FontAwesome icon class
    let originalClass = icon.className;

    let interval = setInterval(() => {
        if (index < icons.length) {
            if (index < 2) {
                icon.className = "";  // Remove FontAwesome class
                icon.innerHTML = icons[index]; // Replace with flag
            } else {
                icon.className = originalClass; // Restore FontAwesome class
                icon.innerHTML = ""; // Remove emoji text
            }
            index++;
        } else {
            clearInterval(interval); // Stop after cycling
        }
    }, 600);
});

// Stop animation on mouse leave
document.querySelector(".location").addEventListener("mouseleave", function () {
    let icon = this.querySelector("i");
    icon.className = originalClass; // Restore original FontAwesome class
    icon.innerHTML = ""; // Remove emoji text
});

const techStack = document.querySelector(".logos");
let isDragging = false;
let startX, scrollLeft;
let autoScrollSpeed = 1; // Adjust speed
let autoScroll;
let isAutoScrolling = true; // Track auto-scroll state

function startDragging(e) {
    isDragging = true;
    isAutoScrolling = false; // Stop auto-scroll
    clearInterval(autoScroll);
    startX = e.pageX - techStack.offsetLeft;
    scrollLeft = techStack.scrollLeft;
    techStack.style.cursor = "grabbing";
}

function stopDragging() {
    isDragging = false;
    techStack.style.cursor = "grab";
    isAutoScrolling = true; // Restart auto-scroll
    startAutoScroll();
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - techStack.offsetLeft;
    const walk = (x - startX) * 2; // Adjust sensitivity
    techStack.scrollLeft = scrollLeft - walk;
}

// Auto-Scroll Logic (Fixed Infinite Loop)
function startAutoScroll() {
    autoScroll = setInterval(() => {
        if (isAutoScrolling) {
            techStack.scrollLeft += autoScrollSpeed;
            if (techStack.scrollLeft >= techStack.scrollWidth / 2) {
                techStack.scrollLeft = 0; // Reset for infinite effect
            }
        }
    }, 20);
}

// Event Listeners
techStack.addEventListener("mousedown", startDragging);
window.addEventListener("mouseup", stopDragging);
techStack.addEventListener("mousemove", drag);

// Start Auto-Scroll on Load
startAutoScroll();

// Animate course items
function animateCourses() {
    const courseItems = document.querySelectorAll('.courses li, .course-item');
    courseItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, 100 * index);
    });
}

// Call animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    animateHero();
    animateAbout();
    animateTimeline();
    animateProjects();
    animateCourses();
    animateReviews();
    animateContact();
});

document.querySelector(".dropbtn").addEventListener("click", function () {
    document.querySelector(".dropdown-content").classList.toggle("show");
});

document.querySelector(".dropbtn").addEventListener("click", function () {
    document.querySelector(".dropdown-content").classList.toggle("show");
});

// Dynamic layout: set number of columns based on total card count and viewport
(function(){
    function debounce(fn, wait) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
    }

    function adjustProjectGrid() {
        const grid = document.querySelector('.project-grid');
        if (!grid) return;
        const count = grid.querySelectorAll('.project-card').length;
        if (count === 0) return;

        // Prefer two rows when there are between 3 and 8 cards (user requested behavior)
        let desiredRows = 1;
        if (count > 1 && count <= 8) desiredRows = 2;
        else if (count > 8) desiredRows = 2; // try to keep rows small; JS will cap by width

        let columns = Math.ceil(count / desiredRows);

        // Cap columns by how many can fit given min column width
        const gridWidth = grid.clientWidth || document.documentElement.clientWidth;
        const minColWidth = 220; // must match CSS minmax min
        const maxFit = Math.max(1, Math.floor(gridWidth / minColWidth));
        columns = Math.min(columns, maxFit);

        // Cap to reasonable number to avoid too many small columns
        columns = Math.min(columns, 6);

        grid.style.setProperty('--project-columns', columns);
    }

    const debouncedAdjust = debounce(adjustProjectGrid, 120);
    window.addEventListener('resize', debouncedAdjust);
    document.addEventListener('DOMContentLoaded', () => { adjustProjectGrid();
        // observe changes to the grid (e.g., dynamic adds/removes)
        const grid = document.querySelector('.project-grid');
        if (grid) {
            const mo = new MutationObserver(() => adjustProjectGrid());
            mo.observe(grid, { childList: true });
        }
    });
})();

// Adaptive typography: scale card title/description to keep consistent layout
(function(){
    function debounce(fn, wait) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
    }

    function fitCardText(card) {
        const title = card.querySelector('.project-title h3');
        const desc = card.querySelector('.project-content p');
        const image = card.querySelector('.project-image');
        const links = card.querySelector('.project-links');
        const content = card.querySelector('.project-content');
        if (!title || !desc || !content) return;

        const cs = getComputedStyle(document.documentElement);
        const rootFont = parseFloat(cs.fontSize) || 16;

        // sizes in px
        const maxTitle = 1.6 * rootFont; // px
        const minTitle = 1.0 * rootFont;
        const maxDesc = 1.05 * rootFont;
        const minDesc = 0.8 * rootFont;

        // available vertical space for title + desc
        const contentStyle = getComputedStyle(content);
        const paddingTop = parseFloat(contentStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(contentStyle.paddingBottom) || 0;

        const imageH = image ? image.offsetHeight : 0;
        const linksH = links ? links.offsetHeight : 0;

        const available = card.clientHeight - imageH - linksH - paddingTop - paddingBottom - 18; // small safety gap

        // start with max sizes
        let titlePx = maxTitle;
        let descPx = maxDesc;

        // helper to apply sizes
        function apply() {
            card.style.setProperty('--title-size', Math.round(titlePx) + 'px');
            card.style.setProperty('--desc-size', Math.round(descPx) + 'px');
        }

        apply();

        // measure heights
        function measuredHeight() {
            // force reflow
            const tH = title.scrollHeight;
            const dH = desc.scrollHeight;
            return tH + dH;
        }

        let totalH = measuredHeight();
        let iter = 0;
        // reduce desc first, then title if needed
        while (totalH > available && iter < 30) {
            if (descPx > minDesc + 0.5) {
                descPx *= 0.94;
            } else if (titlePx > minTitle + 0.5) {
                titlePx *= 0.95;
            } else {
                // can't reduce further
                break;
            }
            apply();
            totalH = measuredHeight();
            iter++;
        }

        // if there's a lot of spare space, nudge sizes up to max
        iter = 0;
        while (totalH < available - 24 && iter < 10) {
            let increased = false;
            if (descPx < maxDesc) { descPx = Math.min(maxDesc, descPx * 1.04); increased = true; }
            if (titlePx < maxTitle && totalH < available - 24) { titlePx = Math.min(maxTitle, titlePx * 1.03); increased = true; }
            if (!increased) break;
            apply();
            totalH = measuredHeight();
            iter++;
        }

        // Final clamp to ensure not smaller than min
        titlePx = Math.max(minTitle, Math.min(maxTitle, titlePx));
        descPx = Math.max(minDesc, Math.min(maxDesc, descPx));
        apply();
    }

    function adjustAll() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(fitCardText);
    }

    const debounced = debounce(adjustAll, 120);
    window.addEventListener('resize', debounced);
    document.addEventListener('DOMContentLoaded', () => {
        adjustAll();
        const grid = document.querySelector('.project-grid');
        if (grid) {
            const mo = new MutationObserver(debounced);
            mo.observe(grid, { childList: true, subtree: true });
        }
    });
})();
