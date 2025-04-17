// main.js - Hoveniersbedrijf W. Smulders

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initTabs();
    initProjectFilters();
    initTestimonialSlider();
    initModals();
    initScrollAnimations();
    initMobileNav();
});

// Header scroll effect
function initHeader() {
    const header = document.getElementById('header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initial check (in case page is loaded scrolled down)
    if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                let target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Mobile Navigation
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.querySelector('.nav__list');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navList.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }
}

// Services Tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.services__tab-btn');
    const tabPanes = document.querySelectorAll('.services__tab-pane');
    
    if (tabButtons.length && tabPanes.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show corresponding tab pane
                const target = this.getAttribute('data-target');
                const pane = document.getElementById(target);
                if (pane) {
                    pane.classList.add('active');
                }
            });
        });
    }
}

// Project Filters
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.projects__filter-btn');
    const projectItems = document.querySelectorAll('.projects__item');
    
    if (filterButtons.length && projectItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter projects
                const filter = this.getAttribute('data-filter');
                
                projectItems.forEach(item => {
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
            });
        });
    }
}

// Testimonials Slider
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials__slider');
    const slides = document.querySelectorAll('.testimonials__slide');
    const prevBtn = document.querySelector('.testimonials__arrow--prev');
    const nextBtn = document.querySelector('.testimonials__arrow--next');
    const dotsContainer = document.querySelector('.testimonials__dots');
    
    if (slides.length && slider) {
        let currentSlide = 0;
        
        // Initialize slider
        function initSlider() {
            // Create dots
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('testimonials__dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            
            // Set initial slide
            goToSlide(0);
        }
        
        // Go to specific slide
        function goToSlide(slideIndex) {
            // Update current slide
            currentSlide = slideIndex;
            
            // Calculate position
            const slideWidth = slides[0].offsetWidth;
            slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            
            // Update dots
            document.querySelectorAll('.testimonials__dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Previous slide
        function prevSlide() {
            let slide = currentSlide - 1;
            if (slide < 0) slide = slides.length - 1;
            goToSlide(slide);
        }
        
        // Next slide
        function nextSlide() {
            let slide = currentSlide + 1;
            if (slide >= slides.length) slide = 0;
            goToSlide(slide);
        }
        
        // Set up event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Auto slide (optional)
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause auto slide on hover
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
        
        // Initialize
        initSlider();
        
        // Handle responsive behavior
        window.addEventListener('resize', () => {
            goToSlide(currentSlide);
        });
    }
}

// Modal Windows
function initModals() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const projectLinks = document.querySelectorAll('.projects__link');
    
    if (modal && projectLinks.length) {
        // Open modal
        projectLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const projectId = this.getAttribute('data-project');
                loadProjectDetails(projectId); // Function to load specific project details
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Function to close modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Function to load project details (mock data for now)
        function loadProjectDetails(projectId) {
            // This would typically fetch data from a database or API
            // For now, we'll use dummy content that's already in the HTML
            
            // Initialize slider in modal after loading content
            initModalSlider();
        }
        
        // Project modal slider
        function initModalSlider() {
            const modalSlider = document.querySelector('.project-modal__slider');
            const modalNavItems = document.querySelectorAll('.project-modal__slider-nav-item');
            
            if (modalSlider && modalNavItems.length) {
                modalNavItems.forEach((item, index) => {
                    item.addEventListener('click', function() {
                        // Remove active class from all nav items
                        modalNavItems.forEach(navItem => navItem.classList.remove('active'));
                        
                        // Add active class to clicked nav item
                        this.classList.add('active');
                        
                        // Show corresponding slide
                        const slides = modalSlider.querySelectorAll('.project-modal__slide');
                        if (slides[index]) {
                            slides.forEach(slide => slide.style.display = 'none');
                            slides[index].style.display = 'block';
                        }
                    });
                });
                
                // Set first item as active
                if (modalNavItems[0]) {
                    modalNavItems[0].click();
                }
            }
        }
    }
}



// Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let valid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            if (!name.value.trim()) {
                showError(name, 'Vul uw naam in');
                valid = false;
            } else {
                removeError(name);
            }
            
            if (!email.value.trim()) {
                showError(email, 'Vul uw e-mailadres in');
                valid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Vul een geldig e-mailadres in');
                valid = false;
            } else {
                removeError(email);
            }
            
            if (!message.value.trim()) {
                showError(message, 'Vul uw bericht in');
                valid = false;
            } else {
                removeError(message);
            }
            
            if (valid) {
                // Form is valid, show success message
                const formSubmit = document.querySelector('.contact__form-submit');
                const successMessage = document.createElement('div');
                successMessage.classList.add('contact__form-success');
                successMessage.textContent = 'Uw bericht is succesvol verstuurd. We nemen zo snel mogelijk contact met u op.';
                
                formSubmit.insertAdjacentElement('beforebegin', successMessage);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
        
        // Helper functions
        function showError(input, message) {
            const formGroup = input.closest('.contact__form-group');
            
            // Remove any existing error messages
            removeError(input);
            
            // Add error class to form group
            formGroup.classList.add('error');
            
            // Create error message
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('contact__form-error');
            errorMessage.textContent = message;
            
            // Insert error message after input
            input.insertAdjacentElement('afterend', errorMessage);
        }
        
        function removeError(input) {
            const formGroup = input.closest('.contact__form-group');
            formGroup.classList.remove('error');
            
            const errorMessage = formGroup.querySelector('.contact__form-error');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }
});

// Add before/after slider functionality
function initBeforeAfterSlider() {
    const sliders = document.querySelectorAll('.before-after-slider');
    
    if (sliders.length) {
        sliders.forEach(slider => {
            const beforeImage = slider.querySelector('.before-image');
            const afterImage = slider.querySelector('.after-image');
            const sliderHandle = slider.querySelector('.slider-handle');
            const container = slider;
            
            let isDragging = false;
            
            // Set initial position (50%)
            function setInitialPosition() {
                const width = container.offsetWidth;
                const position = width / 2;
                
                beforeImage.style.width = position + 'px';
                sliderHandle.style.left = position + 'px';
            }
            
            // Handle drag events
            function startDrag(e) {
                e.preventDefault();
                isDragging = true;
            }
            
            function drag(e) {
                if (!isDragging) return;
                
                let position;
                if (e.type === 'mousemove') {
                    position = e.clientX - container.getBoundingClientRect().left;
                } else {
                    position = e.touches[0].clientX - container.getBoundingClientRect().left;
                }
                
                // Constrain position to container
                if (position < 0) position = 0;
                if (position > container.offsetWidth) position = container.offsetWidth;
                
                // Update before image and handle position
                beforeImage.style.width = position + 'px';
                sliderHandle.style.left = position + 'px';
            }
            
            function stopDrag() {
                isDragging = false;
            }
            
            // Add event listeners
            sliderHandle.addEventListener('mousedown', startDrag);
            sliderHandle.addEventListener('touchstart', startDrag);
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag);
            
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
            
            // Set initial position
            setInitialPosition();
            
            // Update on window resize
            window.addEventListener('resize', setInitialPosition);
        });
    }
}

// Initialize seasonal elements based on current date
function initSeasonalElements() {
    const date = new Date();
    const month = date.getMonth(); // 0-11 (Jan-Dec)
    
    let season;
    if (month >= 2 && month <= 4) {
        season = 'spring';
    } else if (month >= 5 && month <= 7) {
        season = 'summer';
    } else if (month >= 8 && month <= 10) {
        season = 'autumn';
    } else {
        season = 'winter';
    }
    
    // Apply seasonal class to body
    document.body.classList.add(`season-${season}`);
    
    // Update hero background based on season
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
        heroBg.style.backgroundImage = `url('../img/hero-${season}.jpg')`;
    }
    
    // You could also update color schemes, icons, and other elements based on season
}

// Initialize weather-based elements
function initWeatherEffects() {
    // This would typically connect to a weather API
    // For demo purposes, we'll just add a random effect
    
    const effects = ['sunny', 'cloudy', 'rainy'];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    
    document.body.classList.add(`weather-${randomEffect}`);
    
    // Add weather visual effect to hero section
    if (randomEffect === 'rainy') {
        addRainEffect();
    } else if (randomEffect === 'sunny') {
        addSunshineEffect();
    }
}

// Function to add rain effect
function addRainEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const rainContainer = document.createElement('div');
    rainContainer.classList.add('rain-effect');
    
    // Create raindrops
    for (let i = 0; i < 50; i++) {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');
        
        // Random position, size and animation delay
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        raindrop.style.animationDelay = `${Math.random() * 2}s`;
        
        rainContainer.appendChild(raindrop);
    }
    
    hero.appendChild(rainContainer);
}

// Function to add sunshine effect
function addSunshineEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const sunshineContainer = document.createElement('div');
    sunshineContainer.classList.add('sunshine-effect');
    
    const sun = document.createElement('div');
    sun.classList.add('sun');
    
    sunshineContainer.appendChild(sun);
    hero.appendChild(sunshineContainer);
}

// Call additional init functions for enhanced features
document.addEventListener('DOMContentLoaded', function() {
    initBeforeAfterSlider();
    initSeasonalElements();
    // Uncomment to add weather effects
    // initWeatherEffects();
});