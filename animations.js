// Gestion des animations au défilement
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in, .rotate-in');
        this.init();
    }

    init() {
        // Observer pour les animations
        this.createObserver();
        
        // Animation au chargement initial
        this.checkVisibility();
        
        // Réinitialiser les animations lors du rechargement
        window.addEventListener('beforeunload', () => {
            this.elements.forEach(el => {
                el.classList.remove('visible');
            });
        });
    }

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animation de progression pour les barres de compétence
                    if (entry.target.classList.contains('skill-bar')) {
                        this.animateSkillBar(entry.target);
                    }
                    
                    // Animation de compteur
                    if (entry.target.classList.contains('counter')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, options);

        this.elements.forEach(el => {
            observer.observe(el);
        });
    }

    checkVisibility() {
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
            
            if (isVisible) {
                el.classList.add('visible');
            }
        });
    }

    animateSkillBar(bar) {
        const fill = bar.querySelector('.progress-fill');
        const percent = bar.getAttribute('data-percent');
        
        if (fill) {
            setTimeout(() => {
                fill.style.width = percent + '%';
            }, 300);
        }
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 secondes
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    }
}

// Animation de particules pour le background
class ParticleAnimation {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.createParticles();
        });
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `rgba(100, 255, 218, ${Math.random() * 0.5 + 0.1})`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Mise à jour de la position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Rebond sur les bords
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            // Dessin de la particule
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // Connexions entre particules
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Animation de texte typewriter
class Typewriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.init();
    }

    init() {
        setTimeout(() => this.type(), 500);
    }

    type() {
        const current = this.textIndex % this.texts.length;
        const fullText = this.texts[current];

        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.currentText = fullText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === fullText.length) {
            typeSpeed = 2000; // Pause à la fin
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex++;
            typeSpeed = 500; // Pause avant nouveau texte
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Animation de timeline interactive
class TimelineAnimation {
    constructor(container) {
        this.container = container;
        this.items = container.querySelectorAll('.timeline-item');
        this.init();
    }

    init() {
        this.items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            
            // Animation au clic
            item.addEventListener('click', () => {
                this.activateItem(item);
            });
        });

        // Activer le premier élément
        if (this.items.length > 0) {
            this.activateItem(this.items[0]);
        }
    }

    activateItem(activeItem) {
        this.items.forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
        
        // Animation de focus
        activeItem.style.transform = 'scale(1.05)';
        setTimeout(() => {
            activeItem.style.transform = 'scale(1)';
        }, 300);
    }
}

// Initialisation des animations
document.addEventListener('DOMContentLoaded', function() {
    // Animations au défilement
    new ScrollAnimations();
    
    // Animation de particules (optionnelle)
    // new ParticleAnimation();
    
    // Animation typewriter pour les titres
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    typewriterElements.forEach(element => {
        const texts = JSON.parse(element.getAttribute('data-typewriter'));
        new Typewriter(element, texts);
    });
    
    // Animation de timeline
    const timelines = document.querySelectorAll('.timeline-container');
    timelines.forEach(timeline => {
        new TimelineAnimation(timeline);
    });
    
    // Effet de parallaxe avancé
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax-speed') || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Animation de curseur personnalisé
    const customCursor = document.querySelector('.custom-cursor');
    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            customCursor.classList.add('click');
        });
        
        document.addEventListener('mouseup', () => {
            customCursor.classList.remove('click');
        });
    }
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ScrollAnimations,
        ParticleAnimation,
        Typewriter,
        TimelineAnimation
    };
}