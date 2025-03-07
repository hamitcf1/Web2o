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
    const courseItems = document.querySelectorAll('.courses li');
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
