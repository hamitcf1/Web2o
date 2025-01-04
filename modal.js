document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contact-modal');
    const ctaButton = document.querySelector('.cta-button');
    const modalClose = document.querySelector('.modal-close');

    if (!modal || !ctaButton || !modalClose) {
        console.error('Required modal elements not found');
        return;
    }

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

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}); 