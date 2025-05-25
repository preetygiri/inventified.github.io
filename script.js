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

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .metric-card, .pricing-card, .trial-feature').forEach(el => {
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
            navLinks.style.display = 'none';
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Update mobile menu visibility on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
        } else {
            navLinks.style.display = 'none';
        }
    });

    // Features Carousel
    const featureSlides = document.querySelectorAll('.feature-slide');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let isAnimating = false;

    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        // Remove active class from current slide and dot
        featureSlides[currentSlide].classList.remove('active');
        navDots[currentSlide].classList.remove('active');

        // Update current slide index
        currentSlide = index;

        // Add active class to new slide and dot
        featureSlides[currentSlide].classList.add('active');
        navDots[currentSlide].classList.add('active');

        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Add click handlers to navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (currentSlide !== index) {
                showSlide(index);
            }
        });
    });

    // Auto-advance slides
    let slideInterval = setInterval(() => {
        showSlide((currentSlide + 1) % featureSlides.length);
    }, 5000);

    // Pause auto-advance on hover
    const featuresCarousel = document.querySelector('.features-carousel');
    if (featuresCarousel) {
        featuresCarousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        featuresCarousel.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                showSlide((currentSlide + 1) % featureSlides.length);
            }, 5000);
        });
    }

    // Add hover effect to feature visuals
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
}); 