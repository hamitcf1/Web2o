function setupContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return; // Exit if modal doesn't exist

    const contactBtns = document.querySelectorAll('.contact-btn');
    const closeBtn = modal.querySelector('.close');
    if (!closeBtn) return; // Exit if close button doesn't exist

    contactBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Only setup modal if document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupContactModal);
} else {
    setupContactModal();
}