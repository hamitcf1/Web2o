function setupContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) {
        console.error("❌ Modal not found: #contact-modal");
        return;
    }

    const contactBtns = document.querySelectorAll('.contact-btn, #omer_ozan_cayli');
    console.log("🟢 Found clickable elements:", contactBtns);

    if (contactBtns.length === 0) {
        console.error("❌ No clickable elements found!");
        return;
    }

    const closeBtn = modal.querySelector('.modal-close');
    if (!closeBtn) {
        console.error("❌ Close button not found inside modal.");
        return;
    }

    // Open modal on click
    contactBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("✅ Modal opened!");
            modal.style.display = 'flex';
        });
    });

    // Close modal on button click
    closeBtn.addEventListener('click', () => {
        console.log("✅ Modal closed!");
        modal.style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log("✅ Modal closed by clicking outside!");
            modal.style.display = 'none';
        }
    });
}

// Ensure script runs after DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupContactModal);
