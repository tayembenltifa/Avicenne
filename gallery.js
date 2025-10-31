// Gestion de la galerie d'images
class Gallery {
    constructor(container) {
        this.container = container;
        this.images = container.querySelectorAll('.gallery-item');
        this.modal = document.getElementById('gallery-modal');
        this.modalImage = this.modal?.querySelector('.modal-image');
        this.modalCaption = this.modal?.querySelector('.modal-caption');
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.images.forEach((image, index) => {
            image.addEventListener('click', () => {
                this.openModal(index);
            });
        });

        // Navigation du modal
        if (this.modal) {
            const prevBtn = this.modal.querySelector('.modal-prev');
            const nextBtn = this.modal.querySelector('.modal-next');
            const closeBtn = this.modal.querySelector('.modal-close');

            prevBtn?.addEventListener('click', () => this.navigate(-1));
            nextBtn?.addEventListener('click', () => this.navigate(1));
            closeBtn?.addEventListener('click', () => this.closeModal());

            // Navigation au clavier
            document.addEventListener('keydown', (e) => {
                if (!this.modal.style.display || this.modal.style.display === 'none') return;
                
                switch(e.key) {
                    case 'ArrowLeft':
                        this.navigate(-1);
                        break;
                    case 'ArrowRight':
                        this.navigate(1);
                        break;
                    case 'Escape':
                        this.closeModal();
                        break;
                }
            });

            // Fermer en cliquant à l'extérieur
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
    }

    openModal(index) {
        this.currentIndex = index;
        this.updateModal();
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    navigate(direction) {
        this.currentIndex += direction;
        
        if (this.currentIndex < 0) {
            this.currentIndex = this.images.length - 1;
        } else if (this.currentIndex >= this.images.length) {
            this.currentIndex = 0;
        }
        
        this.updateModal();
    }

    updateModal() {
        const currentImage = this.images[this.currentIndex];
        const imgSrc = currentImage.querySelector('img').src;
        const caption = currentImage.getAttribute('data-caption') || '';

        this.modalImage.src = imgSrc;
        this.modalCaption.textContent = caption;

        // Animation de transition
        this.modalImage.style.opacity = '0';
        setTimeout(() => {
            this.modalImage.style.opacity = '1';
        }, 50);
    }
}

// Filtrage de galerie
class GalleryFilter {
    constructor(container) {
        this.container = container;
        this.filters = container.querySelectorAll('.gallery-filter');
        this.items = container.querySelectorAll('.gallery-item');
        this.init();
    }

    init() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const filterValue = filter.getAttribute('data-filter');
                this.filterItems(filterValue);
                
                // Mettre à jour les filtres actifs
                this.filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
            });
        });
    }

    filterItems(filter) {
        this.items.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Effet de lumière sur les images
class LightEffect {
    constructor(container) {
        this.container = container;
        this.items = container.querySelectorAll('.gallery-item');
        this.init();
    }

    init() {
        this.items.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                this.createLightEffect(e, item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.removeLightEffect(item);
            });
        });
    }

    createLightEffect(e, item) {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const light = item.querySelector('.light-effect') || document.createElement('div');
        light.className = 'light-effect';
        light.style.left = x + 'px';
        light.style.top = y + 'px';
        
        if (!item.querySelector('.light-effect')) {
            item.appendChild(light);
        }
    }

    removeLightEffect(item) {
        const light = item.querySelector('.light-effect');
        if (light) {
            light.remove();
        }
    }
}

// Animation de grille mosaïque
class MosaicGrid {
    constructor(container) {
        this.container = container;
        this.items = container.querySelectorAll('.gallery-item');
        this.init();
    }

    init() {
        this.arrangeGrid();
        window.addEventListener('resize', () => this.arrangeGrid());
    }

    arrangeGrid() {
        const containerWidth = this.container.clientWidth;
        const columns = Math.max(2, Math.floor(containerWidth / 250));
        
        this.items.forEach((item, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            
            // Animation d'apparition en cascade
            item.style.animationDelay = `${(row + col) * 0.1}s`;
        });
    }
}

// Initialisation de la galerie
document.addEventListener('DOMContentLoaded', function() {
    const galleryContainers = document.querySelectorAll('.gallery-grid');
    
    galleryContainers.forEach(container => {
        new Gallery(container);
        
        // Initialiser le filtrage si présent
        const filterContainer = container.closest('.gallery-section');
        if (filterContainer && filterContainer.querySelector('.gallery-filters')) {
            new GalleryFilter(filterContainer);
        }
        
        // Effets supplémentaires
        new LightEffect(container);
        new MosaicGrid(container);
    });
    
    // Chargement progressif des images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Gallery,
        GalleryFilter,
        LightEffect,
        MosaicGrid
    };
}