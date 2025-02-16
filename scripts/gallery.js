document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageModal = document.createElement('div');
    imageModal.classList.add('image-modal');
    imageModal.innerHTML = `
        <div class="image-modal-content">
            <button class="image-modal-close" aria-label="Close">
                <span>&times;</span>
            </button>
            <img class="image-modal-img" src="" alt="">
            <div class="image-modal-details">
                <h3 class="image-modal-title"></h3>
                <p class="image-modal-description"></p>
                <div class="image-modal-actions">
                    <button class="download-btn btn">
                        <i class="fas fa-download"></i>
                        <span>Download</span>
                    </button>
                    <button class="new-tab-btn btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>Open in New Tab</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(imageModal);

    const modalImg = imageModal.querySelector('.image-modal-img');
    const modalTitle = imageModal.querySelector('.image-modal-title');
    const modalDescription = imageModal.querySelector('.image-modal-description');
    const downloadButton = imageModal.querySelector('.download-btn');
    const openNewTabButton = imageModal.querySelector('.new-tab-btn');
    const closeButton = imageModal.querySelector('.image-modal-close');

    // Sample gallery images with static text
    const galleryImages = [
        {
            src: '/assets/photos/1.jpg',
            title: 'Harkan',
            description: 'He needs you.',
            tags: ['#Family', '#Harkan', '#Escape']
        },
        {
            src: '/assets/photos/2.jpg',
            title: 'Bon Appetit',
            description: 'The best restaurant in town.',
            tags: ['#French', '#Food', '#Restaurant']
        },
        {
            src: '/assets/photos/3.jpg',
            title: 'Starry Night',
            description: 'Milky way over a peaceful landscape',
            tags: ['#Astronomy', '#Night', '#Stars']
        },
        {
            src: '/assets/photos/4.jpg',
            title: 'Forest Path',
            description: 'Sunlight filtering through dense trees',
            tags: ['#Forest', '#Nature', '#Trees']
        },
        {
            src: '/assets/photos/5.jpg',
            title: 'Snow Mountain',
            description: 'Snow-capped mountain peaks at sunrise',
            tags: ['#Mountains', '#Snow', '#Sunrise']
        },
        {
            src: '/assets/photos/6.jpg',
            title: 'Desert Landscape',
            description: 'Vast desert with rolling sand dunes',
            tags: ['#Desert', '#Landscape', '#Sand']
        },
        {
            src: '/assets/photos/7.jpg',
            title: 'Desert Landscape',
            description: 'Vast desert with rolling sand dunes',
            tags: ['#Desert', '#Landscape', '#Sand']
        },
        {
            src: '/assets/photos/8.jpg',
            title: '',
            description: '',
            tags: ['#', '#', '#']
        },
    ];

    function createGalleryItem(image) {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('project-card', 'animate', 'scale-up');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('project-image');
        imageContainer.style.backgroundImage = `url('${image.src}')`;

        const content = document.createElement('div');
        content.classList.add('project-content');

        const header = document.createElement('div');
        header.classList.add('project-header');

        const title = document.createElement('div');
        title.classList.add('project-title');

        const titleIcon = document.createElement('i');
        titleIcon.classList.add('fas', 'fa-image', 'project-icon');

        const titleText = document.createElement('h3');
        titleText.textContent = image.title;

        title.appendChild(titleIcon);
        title.appendChild(titleText);
        header.appendChild(title);

        const description = document.createElement('p');
        description.textContent = image.description;

        const tags = document.createElement('div');
        tags.classList.add('project-tags');
        tags.innerHTML = image.tags.map(tag => `<span>${tag}</span>`).join('');

        content.appendChild(header);
        content.appendChild(description);
        content.appendChild(tags);

        galleryItem.appendChild(imageContainer);
        galleryItem.appendChild(content);

        // Add click event to open full image
        galleryItem.addEventListener('click', () => {
            modalImg.src = image.src;
            modalTitle.textContent = image.title;
            modalDescription.textContent = image.description;
            
            // Remove any existing event listeners to prevent multiple bindings
            downloadButton.onclick = null;
            openNewTabButton.onclick = null;

            // Add download functionality
            downloadButton.onclick = () => {
                const link = document.createElement('a');
                link.href = image.src;
                link.download = image.title || 'image';
                link.click();
            };

            // Add open in new tab functionality
            openNewTabButton.onclick = () => {
                window.open(image.src, '_blank');
            };

            imageModal.classList.add('show');
        });

        return galleryItem;
    }

    // Populate gallery
    galleryImages.forEach(image => {
        const galleryItem = createGalleryItem(image);
        galleryGrid.appendChild(galleryItem);
    });

    // Close modal when close button is clicked
    closeButton.addEventListener('click', () => {
        imageModal.classList.remove('show');
    });

    imageModal.addEventListener('click', (event) => {
        if (event.target === imageModal) {
            imageModal.classList.remove('show');
        }
    });
});
