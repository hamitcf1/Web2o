function setupContactModal() {
    const modal = document.getElementById('contact-modal');
    const contactBtns = document.querySelectorAll('.contact-btn');
    const closeBtn = modal.querySelector('.close');

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

document.addEventListener('DOMContentLoaded', setupContactModal); 