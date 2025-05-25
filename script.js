document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 2px 20px rgba(138, 43, 226, 0.1)';
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for all animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that need animations
    document.querySelectorAll('.feature-card, .metric-card, .pricing-card, .trial-feature, .fade-in-up, .timeline-item, .impact-card, .team-member, .value-card, .counter').forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        if (hero) {
            hero.style.backgroundPositionY = `${scroll * 0.5}px`;
        }
    });

    // Interactive features showcase
    const featureItems = document.querySelectorAll('.feature-item');
    const previewImages = document.querySelectorAll('.preview-image');

    // Set initial active states
    if (featureItems.length > 0 && previewImages.length > 0) {
        featureItems[0].classList.add('active');
        previewImages[0].classList.add('active');
    }

    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Remove active class from all items and images
            featureItems.forEach(i => i.classList.remove('active'));
            previewImages.forEach(img => img.classList.remove('active'));

            // Add active class to current item and corresponding image
            item.classList.add('active');
            const feature = item.dataset.feature;
            const correspondingImage = document.querySelector(`.preview-image[data-feature="${feature}"]`);
            if (correspondingImage) {
                correspondingImage.classList.add('active');
            }
        });

        // Add touch support for mobile devices
        item.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default touch behavior
            item.dispatchEvent(new Event('mouseenter'));
        });
    });

    // Smooth image preview hover effect
    const featuresPreview = document.querySelector('.features-preview');
    if (featuresPreview) {
        let rafId = null;
        
        featuresPreview.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 1024) return; // Disable effect on mobile/tablet

            const activeImage = featuresPreview.querySelector('.preview-image.active img');
            if (activeImage) {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }

                rafId = requestAnimationFrame(() => {
                    const rect = featuresPreview.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const moveX = (x - centerX) / centerX * 10;
                    const moveY = (y - centerY) / centerY * 10;
                    
                    activeImage.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
                });
            }
        });

        featuresPreview.addEventListener('mouseleave', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }

            const activeImage = featuresPreview.querySelector('.preview-image.active img');
            if (activeImage) {
                activeImage.style.transform = 'scale(1) translate(0, 0)';
            }
        });
    }

    // Interactive features highlight
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            featureCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // CTA hover effect
    const ctaButton = document.querySelector('.cta .btn-primary');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', (e) => {
            const x = e.pageX - ctaButton.offsetLeft;
            const y = e.pageY - ctaButton.offsetTop;
            
            ctaButton.style.setProperty('--x', `${x}px`);
            ctaButton.style.setProperty('--y', `${y}px`);
        });
    }

    // Add CSS variables for animations
    document.documentElement.style.setProperty('--animate-duration', '0.6s');
    document.documentElement.style.setProperty('--animate-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Update mobile menu visibility on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            navLinks.style.removeProperty('display');
        }
    });

    // Features Carousel
    function initFeaturesCarousel() {
        const carousel = document.querySelector('.features-carousel');
        const slides = document.querySelectorAll('.feature-slide');
        const dots = document.querySelectorAll('.nav-dot');
        let currentSlide = 0;
        let interval;

        function showSlide(index) {
            // Hide all slides first
            slides.forEach(slide => {
                slide.style.display = 'none';
                slide.classList.remove('active');
            });

            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            });

            // Show current slide and activate dot
            slides[index].style.display = 'grid';
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            dots[index].setAttribute('aria-selected', 'true');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function startAutoSlide() {
            if (interval) {
                clearInterval(interval);
            }
            interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
                startAutoSlide(); // Reset the timer when manually changing slides
            });
        });

        // Initialize first slide and start auto-rotation
        showSlide(0);
        startAutoSlide();

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            if (interval) {
                clearInterval(interval);
            }
        });

        carousel.addEventListener('mouseleave', startAutoSlide);

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            if (interval) {
                clearInterval(interval);
            }
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchEndX - touchStartX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe right - previous slide
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                } else {
                    // Swipe left - next slide
                    currentSlide = (currentSlide + 1) % slides.length;
                }
                showSlide(currentSlide);
            }
        }

        // Keyboard navigation
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
                startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
                startAutoSlide();
            }
        });
    }

    // Initialize the carousel
    initFeaturesCarousel();

    // Add hover effect to feature visuals
    const featureSlides = document.querySelectorAll('.feature-slide');
    featureSlides.forEach(slide => {
        const visual = slide.querySelector('.feature-visual');
        if (visual) {
            visual.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 1024) return;

                const rect = visual.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / centerX * 10;
                const moveY = (y - centerY) / centerY * 10;
                
                const img = visual.querySelector('img');
                if (img) {
                    img.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
                }
            });

            visual.addEventListener('mouseleave', () => {
                const img = visual.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1) translate(0, 0)';
                }
            });
        }
    });

    // Add hover effect to feature stats
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        stat.addEventListener('mouseenter', () => {
            const number = stat.querySelector('.stat-number');
            if (number) {
                number.style.transform = 'scale(1.1)';
                number.style.color = 'var(--secondary-color)';
            }
        });

        stat.addEventListener('mouseleave', () => {
            const number = stat.querySelector('.stat-number');
            if (number) {
                number.style.transform = 'scale(1)';
                number.style.color = 'var(--primary-color)';
            }
        });
    });

    // Initialize Vanilla Tilt
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
    });

    // Counter animation
    function animateCounter(counterElement) {
        const target = parseInt(counterElement.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counterElement.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    // Form animations
    const formInputs = document.querySelectorAll('.floating-label input, .floating-label textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Particle animation
    function createParticles() {
        const particles = document.querySelector('.hero-particles');
        if (!particles) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particles.appendChild(particle);
        }
    }

    // Initialize particles on load
    window.addEventListener('load', createParticles);

    // Dark mode toggle
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const body = document.body;

    function updateTheme(e) {
        if (e.matches) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    }

    prefersDarkScheme.addListener(updateTheme);
    updateTheme(prefersDarkScheme);
}); 