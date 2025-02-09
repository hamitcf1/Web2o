// Create an Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Add animation class when element is in view
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, {
    threshold: 0.1, // Trigger when at least 10% of the element is visible
    rootMargin: '50px' // Start animation slightly before element comes into view
});

// Observe all elements with animate class
document.addEventListener('DOMContentLoaded', () => {
    // Get all elements to animate
    const animatedElements = document.querySelectorAll('.animate');
    
    // Start observing each element
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Add this to your existing script.js or create a new animations.js file
document.addEventListener('scroll', () => {
    // Add class to navbar when scrolling
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}); 