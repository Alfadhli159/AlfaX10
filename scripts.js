/**
 * AlfaX10 Website Scripts
 * This file contains all the JavaScript functionality for the AlfaX10 website
 * Version: 1.1
 * Date: June 24, 2025
 * Updates: Added bilingual support (English and Arabic) with language switching
 */

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    // Check current page for debugging
    const currentPage = window.location.pathname.split('/').pop();
    console.log(`Current page loaded: ${currentPage}`);

    // Force clear any cached language preference for testing
    // Uncomment this line for debugging
    // localStorage.removeItem('alfax10_language');

    // Initialize all components
    initLanguageSwitcher(); // Initialize language switcher first to apply translations
    initMobileMenu();
    initTestimonialSlider();
    initScrollToTop();
    initFormValidation();
    initScrollSpy();
    updateCopyrightYear();
});

/**
 * Mobile Menu Toggle
 * Handles the mobile navigation menu toggle functionality
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links li a');
    
    if (!menuToggle || !navLinks) return;
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when nav link is clicked
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const isMenuOpen = navLinks.classList.contains('active');
        const clickedOnMenu = navLinks.contains(e.target);
        const clickedOnToggle = menuToggle.contains(e.target);
        
        if (isMenuOpen && !clickedOnMenu && !clickedOnToggle) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/**
 * Testimonial Slider
 * Creates a simple slider for testimonials section with dots navigation
 */
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || !slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Function to update slider position
    function updateSliderPosition() {
        // Calculate scroll position
        const slideWidth = slides[0].offsetWidth;
        const scrollAmount = currentSlide * slideWidth;
        
        // Check if RTL mode is active
        const isRTL = document.documentElement.dir === 'rtl';
        
        if (isRTL) {
            // For RTL, we need to scroll to the right side of the slider
            // We calculate the position from the right side
            const totalWidth = slider.scrollWidth;
            const visibleWidth = slider.clientWidth;
            const slideIndex = totalSlides - 1 - currentSlide; // Reverse the index for RTL
            const rtlScrollAmount = slideIndex * slideWidth;
            
            slider.scrollTo({
                left: rtlScrollAmount,
                behavior: 'smooth'
            });
        } else {
            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Add active class to current slide for styling
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Set up click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSliderPosition();
        });
    });
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            // In RTL, the previous and next are visually reversed
            const isRTL = document.documentElement.dir === 'rtl';
            if (isRTL) {
                currentSlide = (currentSlide + 1) % totalSlides;
            } else {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            }
            updateSliderPosition();
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            // In RTL, the previous and next are visually reversed
            const isRTL = document.documentElement.dir === 'rtl';
            if (isRTL) {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            } else {
                currentSlide = (currentSlide + 1) % totalSlides;
            }
            updateSliderPosition();
        });
    }
    
    // Auto-advance slide every 5 seconds
    let slideInterval = setInterval(() => {
        const isRTL = document.documentElement.dir === 'rtl';
        if (isRTL) {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        } else {
            currentSlide = (currentSlide + 1) % totalSlides;
        }
        updateSliderPosition();
    }, 5000);
    
    // Pause auto-advance on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // Resume auto-advance on mouse leave
    slider.addEventListener('mouseleave', () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSliderPosition();
        }, 5000);
    });
    
    // Manual scroll event handling
    slider.addEventListener('scroll', () => {
        clearTimeout(slider.scrollTimeout);
        slider.scrollTimeout = setTimeout(() => {
            const slideWidth = slides[0].offsetWidth;
            const scrollPos = slider.scrollLeft;
            const newIndex = Math.round(scrollPos / slideWidth);
            currentSlide = Math.max(0, Math.min(newIndex, totalSlides - 1));
            
            // Update active dot and slide classes without triggering scroll
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });
        }, 100);
    });
    
    // Initialize position
    updateSliderPosition();
}

/**
 * Back to Top Button
 * Shows/hides the back to top button based on scroll position
 * and handles smooth scrolling to top when clicked
 */
function initScrollToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Form Validation
 * Validates contact form inputs before submission
 * and prevents spam with honeypot field
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check honeypot field (anti-spam)
        const honeypotField = document.getElementById('website');
        if (honeypotField && honeypotField.value) {
            // Likely spam submission, silently reject
            console.log('Spam submission detected');
            contactForm.reset();
            return false;
        }
        
        // Get form fields
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        let isValid = true;
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(elem => {
            elem.style.display = 'none';
            elem.textContent = '';
        });
        
        // Validate name (required)
        if (!validateRequired(nameInput)) {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        }
        
        // Validate email (required, format)
        if (!validateRequired(emailInput)) {
            showError(emailInput, 'Please enter your email');
            isValid = false;
        } else if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject (required)
        if (!validateRequired(subjectInput)) {
            showError(subjectInput, 'Please enter a subject');
            isValid = false;
        }
        
        // Validate message (required)
        if (!validateRequired(messageInput)) {
            showError(messageInput, 'Please enter your message');
            isValid = false;
        }
        
        // If valid, simulate form submission
        if (isValid) {
            // Sanitize inputs (prevent XSS attacks)
            const formData = {
                name: sanitizeInput(nameInput.value),
                email: sanitizeInput(emailInput.value),
                subject: sanitizeInput(subjectInput.value),
                message: sanitizeInput(messageInput.value)
            };
            
            // Here you would typically send the data to a server
            // For this demo, we'll just log it and show a success message
            console.log('Form submission data:', formData);
            
            // Clear form and show success message
            contactForm.reset();
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you! Your message has been sent successfully.';
            successMessage.style.backgroundColor = 'rgba(0, 191, 255, 0.1)';
            successMessage.style.color = '#00BFFF';
            successMessage.style.padding = '15px';
            successMessage.style.borderRadius = '4px';
            successMessage.style.marginTop = '20px';
            
            contactForm.appendChild(successMessage);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }
    });
    
    /**
     * Validates that a field is not empty
     * @param {HTMLElement} input - The input field to validate
     * @returns {boolean} - Whether the field is valid
     */
    function validateRequired(input) {
        return input.value.trim() !== '';
    }
    
    /**
     * Validates email format using regex
     * @param {string} email - The email to validate
     * @returns {boolean} - Whether the email is valid
     */
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Shows error message for an input field
     * @param {HTMLElement} input - The input field with error
     * @param {string} message - The error message to display
     */
    function showError(input, message) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    /**
     * Sanitizes user input to prevent XSS attacks
     * @param {string} input - The user input to sanitize
     * @returns {string} - The sanitized input
     */
    function sanitizeInput(input) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        const reg = /[&<>"'/]/ig;
        return input.replace(reg, match => map[match]);
    }
}

/**
 * Scroll Spy
 * Highlights the active navigation link based on scroll position
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!sections.length || !navLinks.length) return;
    
    // Get current section based on scroll position
    function getCurrentSection() {
        // Add offset for better UX (highlight slightly before reaching the section)
        const scrollPosition = window.scrollY + 100;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            
            if (scrollPosition >= sectionTop) {
                return section.getAttribute('id');
            }
        }
        
        // Default to first section if none match
        return sections[0].getAttribute('id');
    }
    
    // Update active nav link
    function updateActiveLink() {
        const currentSection = getCurrentSection();
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Add active class to CSS
    const styleSheet = document.styleSheets[0];
    const activeRule = `.nav-links a.active { color: var(--accent-yellow) !important; font-weight: 500; }`;
    styleSheet.insertRule(activeRule, styleSheet.cssRules.length);
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveLink);
    
    // Initial update
    updateActiveLink();
}

/**
 * Update Copyright Year
 * Dynamically updates the copyright year in the footer
 */
function updateCopyrightYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Language Switcher
 * Handles switching between English and Arabic languages
 * Uses data-i18n attributes to map elements to translation keys
 */
function initLanguageSwitcher() {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;
    
    // Get saved language preference or default to English
    let currentLang = localStorage.getItem('alfax10_language') || 'en';
    
    // Apply the language settings on page load
    applyLanguage(currentLang);
    
    // Add click event to language toggle button
    langToggle.addEventListener('click', function() {
        // Switch between 'en' and 'ar'
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        console.log(`Switching language from ${currentLang} to ${newLang}`);
        
        // Get current page for special handling
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Check if we're on a legal page
        const isLegalPage = currentPage === 'terms-of-service.html' || 
                         currentPage === 'privacy-policy.html' || 
                         currentPage === 'cookie-policy.html';
        
        // Save the new language preference
        localStorage.setItem('alfax10_language', newLang);
        
        // Special handling for legal pages
        if (isLegalPage) {
            // For legal pages, forcefully apply the new language and then reload
            console.log(`Legal page detected, applying ${newLang} translations and reloading`);
            document.documentElement.setAttribute('lang', newLang);
            document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
            
            if (newLang === 'ar') {
                document.body.classList.add('rtl');
            } else {
                document.body.classList.remove('rtl');
            }
            
            // Add language parameter to URL for more reliable language setting during page reload
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('lang', newLang);
            
            // Reload the page with the language parameter
            window.location.href = currentUrl.toString();
        } else {
            // For normal pages, apply translations without reload
            applyLanguage(newLang);
            currentLang = newLang;
        }
    });
    
    /**
     * Applies the selected language to the page
     * @param {string} lang - The language code ('en' or 'ar')
     */
    function applyLanguage(lang) {
        // Update HTML lang and dir attributes
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        
        // Update toggle button text
        langToggle.textContent = lang === 'en' ? 'EN | AR' : 'AR | EN';
        
        // Add/remove RTL class to body for additional styling
        if (lang === 'ar') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
        
        // Apply translations to all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        console.log(`Found ${elements.length} translatable elements for ${lang} language`);
        
        // Check if we're on the terms of service page and apply special handling
        const isTermsPage = window.location.pathname.includes('terms-of-service.html');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            
            // First try using the main translations object
            if (translations[lang] && translations[lang][key]) {
                // Apply translation based on element type
                if (element.tagName === 'TITLE') {
                    element.textContent = translations[lang][key];
                } else if (element.tagName === 'META' && element.hasAttribute('content')) {
                    element.setAttribute('content', translations[lang][key]);
                } else if (element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) {
                    element.value = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                    // Add a debug class if we're on terms page and in debug mode
                    if (isTermsPage && lang === 'ar' && window.location.search.includes('debug=true')) {
                        element.classList.add('translated-element');
                    }
                }
                console.log(`Applied ${lang} translation for: ${key}`);
            } else {
                console.warn(`No ${lang} translation found for key: ${key}`);
            }
        });
        
        // For Terms of Service page, ensure translations are properly applied for both languages
        if (window.location.pathname.includes('terms-of-service.html')) {
            setTimeout(() => {
                applyTermsTranslations();
            }, 100);
        }
        
        console.log(`Language set to ${lang}`);
    }
}

/**
 * Special function to ensure Terms of Service translations work properly
 * This applies a second pass of translations for the terms content
 */
function applyTermsTranslations() {
    const currentLang = localStorage.getItem('alfax10_language') || 'en';
    
    console.log(`Applying specialized Terms of Service translations for ${currentLang} language`);
    
    // Create a specific backup of translations for terms page
    // This ensures we have fallbacks if the main translations object fails
    const backupArabicTranslations = {
        "terms.heading": "شروط الخدمة",
        "terms.lastUpdated": "آخر تحديث: ٢٩ يونيو ٢٠٢٥",
        "terms.intro.title": "١. مقدمة",
        "terms.intro.text": "مرحبًا بك في الفا إكس 10. تحكم شروط الخدمة هذه (\"الشروط\") استخدامك لموقعنا الإلكتروني الموجود على www.alfax10.com (\"الخدمة\") الذي تديره الفا إكس 10. من خلال الوصول إلى الخدمة أو استخدامها، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من الشروط، فلا يجوز لك الوصول إلى الخدمة.",
        "terms.services.title": "٢. استخدام خدماتنا",
        "terms.services.text": "خدماتنا متنوعة جدًا، لذلك قد تنطبق أحيانًا شروط إضافية أو متطلبات المنتج. ستكون الشروط الإضافية متاحة مع الخدمات ذات الصلة، وتصبح تلك الشروط الإضافية جزءًا من اتفاقك معنا إذا كنت تستخدم تلك الخدمات.",
        "terms.accounts.title": "٣. الحسابات",
        "terms.accounts.accurate": "عند إنشاء حساب معنا، يجب عليك تزويدنا بمعلومات دقيقة وكاملة وحديثة في جميع الأوقات. قد يؤدي عدم القيام بذلك إلى خرق الشروط، مما قد يؤدي إلى الإنهاء الفوري لحسابك على خدمتنا.",
        "terms.accounts.safeguard": "أنت مسؤول عن حماية كلمة المرور التي تستخدمها للوصول إلى الخدمة وعن أي أنشطة أو إجراءات تتم بموجب كلمة المرور الخاصة بك.",
        "terms.accounts.disclose": "أنت توافق على عدم الكشف عن كلمة المرور الخاصة بك لأي طرف ثالث. يجب عليك إخطارنا على الفور عند علمك بأي خرق للأمان أو استخدام غير مصرح به لحسابك."
    };
    
    // Create backup for English translations
    const backupEnglishTranslations = {
        "terms.heading": "Terms of Service",
        "terms.lastUpdated": "Last Updated: June 29, 2025",
        "terms.intro.title": "1. Introduction",
        "terms.intro.text": "Welcome to AlfaX10. These Terms of Service (\"Terms\") govern your use of our website located at www.alfax10.com (the \"Service\") operated by AlfaX10. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.",
        "terms.services.title": "2. Use of Our Services",
        "terms.services.text": "Our Services are very diverse, so sometimes additional terms or product requirements may apply. Additional terms will be available with the relevant Services, and those additional terms become part of your agreement with us if you use those Services.",
        "terms.accounts.title": "3. Accounts",
        "terms.accounts.accurate": "When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.",
        "terms.accounts.safeguard": "You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.",
        "terms.accounts.disclose": "You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account."
    };
    
    // Apply backup translations to elements that might have failed in the main translation process
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (currentLang === 'ar') {
            // For Arabic, apply backup Arabic translations if needed
            if (backupArabicTranslations[key] && 
               (element.textContent.trim() === '' || 
                element.textContent === translations['en'][key])) {
                
                console.log(`Applying Arabic backup translation for: ${key}`);
                element.textContent = backupArabicTranslations[key];
            }
        } else {
            // For English, apply backup English translations if needed
            if (backupEnglishTranslations[key] && 
               (element.textContent.trim() === '' || 
                element.textContent !== translations['en'][key])) {
                
                console.log(`Applying English backup translation for: ${key}`);
                element.textContent = backupEnglishTranslations[key];
            }
        }
    });
    
    // Also apply a delayed second pass for more complex DOM changes
    setTimeout(function() {
        const currentLang = localStorage.getItem('alfax10_language');
        console.log(`Performing delayed second ${currentLang} translation pass`);
        
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            
            if (currentLang === 'ar') {
                // For Arabic, apply backup translations
                if (backupArabicTranslations[key]) {
                    element.textContent = backupArabicTranslations[key];
                }
            } else {
                // For English, ensure English text is applied
                if (backupEnglishTranslations[key]) {
                    element.textContent = backupEnglishTranslations[key];
                }
            }
        });
    }, 1000);
}

/**
 * Image Optimization Helpers
 * Functions to help optimize images on the website
 */

/**
 * Check if the browser supports WebP format
 * @returns {Promise<boolean>} - Whether the browser supports WebP
 */
function checkWebPSupport() {
    return new Promise(resolve => {
        const webp = new Image();
        webp.onload = webp.onerror = function() {
            resolve(webp.height === 1);
        };
        webp.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    });
}

/**
 * Replace PNG images with WebP versions when supported
 * This function looks for PNG images and replaces them with WebP versions
 */
function replaceWithWebP() {
    checkWebPSupport().then(supportsWebP => {
        if (!supportsWebP) return;
        
        // Only replace if browser supports WebP
        const images = document.querySelectorAll('img[src$=".png"]');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                // Create the WebP version path
                const webpSrc = src.replace('.png', '.webp');
                
                // Create a test image to check if the WebP version exists
                const testImg = new Image();
                testImg.onload = function() {
                    // WebP version exists, replace the src
                    img.setAttribute('src', webpSrc);
                    console.log(`Replaced ${src} with ${webpSrc}`);
                };
                testImg.onerror = function() {
                    // WebP version doesn't exist, keep the PNG
                    console.log(`WebP version of ${src} not found`);
                };
                testImg.src = webpSrc;
            }
        });
    });
}

/**
 * Add width and height attributes to images missing them
 * This helps prevent layout shifts during page load
 */
function addMissingImageDimensions() {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
        // If the image is loaded, use its natural dimensions
        if (img.complete) {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                img.setAttribute('width', img.naturalWidth);
                img.setAttribute('height', img.naturalHeight);
                console.log(`Added dimensions to ${img.src}: ${img.naturalWidth}x${img.naturalHeight}`);
            }
        } else {
            // Wait for the image to load
            img.addEventListener('load', function() {
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                    img.setAttribute('width', img.naturalWidth);
                    img.setAttribute('height', img.naturalHeight);
                    console.log(`Added dimensions to ${img.src}: ${img.naturalWidth}x${img.naturalHeight}`);
                }
            });
        }
    });
}

/**
 * Add loading="lazy" to images below the fold
 */
function addLazyLoading() {
    // Select images that don't already have loading attribute and are not critical (like logo)
    const images = document.querySelectorAll('img:not([loading]):not(.logo-image):not([src*="hero"])');
    
    images.forEach(img => {
        // Add lazy loading to images
        img.setAttribute('loading', 'lazy');
        console.log(`Added lazy loading to ${img.src}`);
    });
}

// Run image optimization functions when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure all other critical scripts have run
    setTimeout(() => {
        replaceWithWebP();
        addMissingImageDimensions();
        addLazyLoading();
    }, 500);
});

/**
 * Translations Object
 * Contains all text content in both English and Arabic
 */
const translations = {
    en: {
        // Meta
        "meta.title": "AlfaX10 - Mobile Apps, Websites & Custom Software Services",
        
        // Logo
        "logo.first": "Alfa",
        "logo.second": "X10",
        
        // Navigation
        "nav.home": "Home",
        "nav.about": "About",
        "nav.services": "Services",
        "nav.projects": "Projects",
        "nav.testimonials": "Testimonials",
        "nav.contact": "Contact Us",
        
        // Hero Section
        "hero.title.start": "Building",
        "hero.title.digital": "Digital",
        "hero.title.experiences": "Experiences",
        "hero.title.end": "That Matter",
        "hero.description": "We create innovative mobile apps, websites, and custom software solutions that transform businesses and enhance user experiences.",
        "hero.cta.primary": "Get Started",
        "hero.cta.secondary": "Explore Services",
        
        // About Section
        "about.title.start": "About",
        "about.title.end": "Us",
        "about.mission.title": "Our Mission",
        "about.mission.p1": "At AlfaX10, we're committed to delivering cutting-edge digital solutions that help businesses thrive in today's competitive landscape. Our mission is to transform ideas into powerful, user-centric applications and websites that drive growth and enhance user engagement.",
        "about.mission.p2": "Founded by a team of tech enthusiasts, we combine technical expertise with creative thinking to build solutions that are not just functional but also aesthetically pleasing and intuitive to use.",
        "about.stats.projects": "Projects Completed",
        "about.stats.clients": "Happy Clients",
        "about.stats.experience": "Years of Experience",
        
        // Services Section
        "services.title.our": "Our",
        "services.title.services": "Services",
        
        "services.mobile.title": "Mobile App Development",
        "services.mobile.desc": "We build native and cross-platform mobile applications that deliver exceptional user experiences across iOS and Android platforms.",
        "services.mobile.feature1": "Custom UI/UX Design",
        "services.mobile.feature2": "Native & Hybrid Solutions",
        "services.mobile.feature3": "Performance Optimization",
        "services.mobile.feature4": "Ongoing Support & Maintenance",
        
        "services.web.title": "Website Design & Development",
        "services.web.desc": "We create responsive, modern websites with clean code and intuitive user interfaces that drive conversions and engagement.",
        "services.web.feature1": "Responsive Design",
        "services.web.feature2": "SEO Optimization",
        "services.web.feature3": "Content Management Systems",
        "services.web.feature4": "E-commerce Solutions",
        
        "services.software.title": "Custom Software Development",
        "services.software.desc": "We develop tailored software solutions that solve complex business challenges and streamline operations.",
        "services.software.feature1": "Business Analysis",
        "services.software.feature2": "Custom API Development",
        "services.software.feature3": "Integration Services",
        "services.software.feature4": "Cloud Solutions",
        
        "services.consulting.title": "Tech Consultations",
        "services.consulting.desc": "Our experts provide strategic technology consultation to help businesses make informed decisions and implement effective tech solutions.",
        "services.consulting.feature1": "Technology Assessment",
        "services.consulting.feature2": "Digital Transformation",
        "services.consulting.feature3": "IT Strategy Development",
        "services.consulting.feature4": "Process Optimization",
        
        "services.installation.title": "Installation and Maintenance of Devices",
        "services.installation.desc": "We provide professional installation, configuration, and ongoing maintenance services for a wide range of hardware devices and technical equipment.",
        "services.installation.feature1": "Hardware Setup & Configuration",
        "services.installation.feature2": "Preventative Maintenance",
        "services.installation.feature3": "Troubleshooting & Repair",
        "services.installation.feature4": "Technology Upgrades",
        
        "services.ui.title": "User Interface (UI) Design",
        "services.ui.desc": "We create visually stunning, user-centered interface designs that enhance usability, increase engagement, and elevate your brand's digital presence.",
        "services.ui.feature1": "User Experience Research",
        "services.ui.feature2": "Visual Design & Branding",
        "services.ui.feature3": "Interactive Prototyping",
        "services.ui.feature4": "Accessibility Optimization",
        
        // Projects Section
        "projects.title.featured": "Featured",
        "projects.title.projects": "Projects",
        "projects.badge": "Coming Soon",
        
        "projects.smartapp.title": "Smart App",
        "projects.smartapp.desc": "Smart App – AI Messaging Made Simple\nSmart App is an intelligent mobile tool that helps users generate personalized messages and auto-replies in seconds. Powered by AI and integrated with WhatsApp, it streamlines communication for both personal and business use — saving time and boosting engagement.",
        "projects.smartapp.tag1": "Mobile App",
        "projects.smartapp.tag2": "AI",
        "projects.smartapp.tag3": "IoT",
        
        "projects.tahaqqaq.title": "Tahaqqaq",
        "projects.tahaqqaq.desc": "Tahaqqaq is a smart platform designed to verify the identity and authorization of individuals affiliated with an organization. It ensures secure access and proper role validation during public events, assemblies, or official gatherings.",
        "projects.tahaqqaq.tag1": "Web Platform",
        "projects.tahaqqaq.tag2": "Mobile App",
        "projects.tahaqqaq.tag3": "API",
        
        // Testimonials Section
        "testimonials.title.client": "Client",
        "testimonials.title.testimonials": "Testimonials",
        
        "testimonials.1.content": "Working with AlfaX10 transformed our business. Their mobile app solution increased our customer engagement by 200% within just three months of launch.",
        "testimonials.1.author": "Sarah Al-Hamad",
        "testimonials.1.position": "CEO, TechVentures Inc.",
        
        "testimonials.2.content": "The website AlfaX10 built for us not only looks amazing but also delivers exceptional performance. Our conversion rate has improved significantly since the redesign.",
        "testimonials.2.author": "Mohammed Al-Khamees",
        "testimonials.2.position": "Marketing Director, GrowthLabs",
        
        "testimonials.3.content": "Their team's attention to detail and commitment to quality is unmatched. AlfaX10 delivered our custom software solution ahead of schedule and exceeded all our expectations.",
        "testimonials.3.author": "Fatima Al-Qahtani",
        "testimonials.3.position": "CTO, InnovateTech",
        
        // Contact Section
        "contact.title.get": "Get In",
        "contact.title.touch": "Touch",
        
        "contact.info.title": "Contact Information",
        "contact.info.subtitle": "Have a project in mind? Let's discuss how we can help bring your ideas to life.",
        "contact.info.address": "We work remotely and use virtual offices",
        "contact.info.email": "info@alfax10.com",
        "contact.info.phone": "+966553985690",
        
        "contact.form.name": "Full Name",
        "contact.form.email": "Email Address",
        "contact.form.subject": "Subject",
        "contact.form.message": "Message",
        "contact.form.honeypot": "Website (Leave this empty)",
        "contact.form.submit": "Send Message",
        
        // Footer
        "footer.tagline": "Creating digital experiences that transform businesses and enhance lives.",
        "footer.quicklinks.title": "Quick Links",
        "footer.services.title": "Services",
        "footer.legal.title": "Legal",
        "footer.legal.privacy": "Privacy Policy",
        "footer.legal.terms": "Terms of Service",
        "footer.legal.cookies": "Cookie Policy",
        "footer.copyright": "© 2025 AlfaX10. All rights reserved.",
        "footer.credit": "Designed and developed with ❤ by AlfaX10 Team",
        
        // Legal page translations
        "privacy.title": "Privacy Policy - AlfaX10",
        "privacy.description": "AlfaX10 Privacy Policy - Learn how we collect, use, and protect your personal information.",
        "privacy.heading": "Privacy Policy",
        
        "terms.title": "Terms of Service - AlfaX10",
        "terms.description": "AlfaX10 Terms of Service - Read about the terms and conditions for using our services.",
        "terms.heading": "Terms of Service",
        
        "cookies.title": "Cookie Policy - AlfaX10",
        "cookies.description": "AlfaX10 Cookie Policy - Learn about how we use cookies and similar technologies on our website.",
        "cookies.heading": "Cookie Policy",
        "cookies.lastUpdated": "آخر تحديث: ٢٩ يونيو ٢٠٢٥",
        
        // Terms of Service - Complete Arabic translations
        "terms.title": "شروط الخدمة - الفا إكس 10",
        "terms.description": "شروط الخدمة الفا إكس 10 - اقرأ عن الشروط والأحكام لاستخدام خدماتنا.",
        "terms.heading": "شروط الخدمة",
        "terms.lastUpdated": "آخر تحديث: ٢٩ يونيو ٢٠٢٥",
        
        "terms.intro.title": "١. مقدمة",
        "terms.intro.text": "مرحبًا بك في الفا إكس 10. تحكم شروط الخدمة هذه (\"الشروط\") استخدامك لموقعنا الإلكتروني الموجود على www.alfax10.com (\"الخدمة\") الذي تديره الفا إكس 10. من خلال الوصول إلى الخدمة أو استخدامها، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من الشروط، فلا يجوز لك الوصول إلى الخدمة.",
        
        "terms.services.title": "٢. استخدام خدماتنا",
        "terms.services.text": "خدماتنا متنوعة جدًا، لذلك قد تنطبق أحيانًا شروط إضافية أو متطلبات المنتج. ستكون الشروط الإضافية متاحة مع الخدمات ذات الصلة، وتصبح تلك الشروط الإضافية جزءًا من اتفاقك معنا إذا كنت تستخدم تلك الخدمات.",
        
        "terms.accounts.title": "٣. الحسابات",
        "terms.accounts.accurate": "عند إنشاء حساب معنا، يجب عليك تزويدنا بمعلومات دقيقة وكاملة وحديثة في جميع الأوقات. قد يؤدي عدم القيام بذلك إلى خرق الشروط، مما قد يؤدي إلى الإنهاء الفوري لحسابك على خدمتنا.",
        "terms.accounts.safeguard": "أنت مسؤول عن حماية كلمة المرور التي تستخدمها للوصول إلى الخدمة وعن أي أنشطة أو إجراءات تتم بموجب كلمة المرور الخاصة بك.",
        "terms.accounts.disclose": "أنت توافق على عدم الكشف عن كلمة المرور الخاصة بك لأي طرف ثالث. يجب عليك إخطارنا على الفور عند علمك بأي خرق للأمان أو استخدام غير مصرح به لحسابك.",
        
        "terms.ip.title": "٤. الملكية الفكرية",
        "terms.ip.text": "الخدمة والمحتوى الأصلي والميزات والوظائف الخاصة بها هي وستظل الملكية الحصرية لشركة الفا إكس 10 والمرخصين لها. الخدمة محمية بموجب حقوق الطبع والنشر والعلامات التجارية وقوانين أخرى في كل من الولايات المتحدة والدول الأجنبية. لا يجوز استخدام علاماتنا التجارية وزي التجارة فيما يتعلق بأي منتج أو خدمة دون الموافقة الخطية المسبقة من الفا إكس 10.",
        
        "terms.content.title": "٥. محتوى المستخدم",
        "terms.content.responsibility": "قد تسمح خدمتنا لك بنشر أو ربط أو تخزين أو مشاركة أو إتاحة معلومات معينة أو نص أو رسومات أو مقاطع فيديو أو مواد أخرى (\"المحتوى\"). أنت مسؤول عن المحتوى الذي تنشره على الخدمة، بما في ذلك قانونيته وموثوقيته وملاءمته.",
        "terms.content.license": "من خلال نشر المحتوى على الخدمة، فإنك تمنحنا الحق والترخيص لاستخدام وتعديل وأداء علنًا وعرض علنًا ونسخ وتوزيع هذا المحتوى على الخدمة ومن خلالها. تحتفظ بأي وكل حقوقك في أي محتوى تقدمه أو تنشره أو تعرضه على الخدمة أو من خلالها وأنت مسؤول عن حماية تلك الحقوق.",
        "terms.content.warranty": "أنت تقر وتضمن أن: (1) المحتوى ملكك (أنت تمتلكه) أو لديك الحق في استخدامه ومنحنا الحقوق والترخيص كما هو منصوص عليه في هذه الشروط، و (2) نشر المحتوى الخاص بك على الخدمة أو من خلالها لا ينتهك حقوق الخصوصية، حقوق الدعاية، حقوق الطبع والنشر، حقوق العقود أو أي حقوق أخرى لأي شخص.",
        
        "terms.links.title": "٦. الروابط إلى مواقع أخرى",
        "terms.links.intro": "قد تحتوي خدمتنا على روابط لمواقع ويب أو خدمات تابعة لجهات خارجية لا تملكها أو تتحكم فيها الفا إكس 10.",
        "terms.links.responsibility": "لا تتحكم الفا إكس 10 ولا تتحمل أي مسؤولية عن المحتوى أو سياسات الخصوصية أو الممارسات الخاصة بأي مواقع ويب أو خدمات تابعة لجهات خارجية. أنت تقر وتوافق على أن الفا إكس 10 لن تكون مسؤولة أو ملتزمة، بشكل مباشر أو غير مباشر، عن أي ضرر أو خسارة سببها أو يُزعم أنها ناتجة عن أو مرتبطة باستخدام أو الاعتماد على أي محتوى أو سلع أو خدمات متاحة على أو من خلال أي مواقع أو خدمات من هذا القبيل.",
        "terms.links.advice": "ننصحك بشدة بقراءة الشروط والأحكام وسياسات الخصوصية لأي مواقع ويب أو خدمات تابعة لجهات خارجية تزورها.",
        
        "terms.termination.title": "٧. الإنهاء",
        "terms.termination.suspend": "قد ننهي أو نعلق حسابك على الفور، دون إشعار مسبق أو مسؤولية، لأي سبب من الأسباب، بما في ذلك على سبيل المثال لا الحصر إذا خالفت الشروط.",
        "terms.termination.cease": "عند الإنهاء، سيتوقف حقك في استخدام الخدمة على الفور. إذا كنت ترغب في إنهاء حسابك، فيمكنك ببساطة التوقف عن استخدام الخدمة.",
        
        "terms.liability.title": "٨. حدود المسؤولية",
        "terms.liability.text": "لن تكون الفا إكس 10، ولا مديريها أو موظفيها أو شركائها أو وكلائها أو مورديها أو الشركات التابعة لها، مسؤولة بأي حال من الأحوال عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية، بما في ذلك على سبيل المثال لا الحصر، فقدان الأرباح أو البيانات أو الاستخدام أو الشهرة التجارية أو خسائر غير ملموسة أخرى، ناتجة عن (1) وصولك إلى أو استخدامك للخدمة أو عدم القدرة على الوصول إليها أو استخدامها؛ (2) أي سلوك أو محتوى لأي طرف ثالث على الخدمة؛ (3) أي محتوى تم الحصول عليه من الخدمة؛ و (4) الوصول غير المصرح به أو الاستخدام أو التغيير في إرساليك أو محتواك، سواء كان ذلك بناءً على ضمان أو عقد أو ضرر (بما في ذلك الإهمال) أو أي نظرية قانونية أخرى، سواء تم إبلاغنا بإمكانية حدوث مثل هذا الضرر أم لا.",
        
        "terms.disclaimer.title": "٩. إخلاء المسؤولية",
        "terms.disclaimer.risk": "استخدامك للخدمة يكون على مسؤوليتك الخاصة. يتم تقديم الخدمة \"كما هي\" و\"كما هي متاحة\". يتم تقديم الخدمة بدون ضمانات من أي نوع، سواء كانت صريحة أو ضمنية، بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية للتسويق والملاءمة لغرض معين وعدم الانتهاك أو مسار الأداء.",
        "terms.disclaimer.warranty": "لا تضمن الفا إكس 10 أو الشركات التابعة لها أو المرخصين لها أن أ) الخدمة ستعمل بدون انقطاع أو تكون آمنة أو متاحة في أي وقت أو موقع معين؛ ب) سيتم تصحيح أي أخطاء أو عيوب؛ ج) الخدمة خالية من الفيروسات أو المكونات الضارة الأخرى؛ أو د) نتائج استخدام الخدمة ستلبي متطلباتك.",
        
        "terms.governing.title": "١٠. القانون الحاكم",
        "terms.governing.law": "تخضع هذه الشروط وتُفسر وفقًا لقوانين الولايات المتحدة، بغض النظر عن أحكام تنازع القوانين الخاصة بها.",
        "terms.governing.waiver": "لا يعتبر عدم تطبيقنا لأي حق أو حكم من هذه الشروط تنازلاً عن تلك الحقوق. إذا اعتبر أي حكم من أحكام هذه الشروط غير صالح أو غير قابل للتنفيذ من قبل محكمة، فإن الأحكام المتبقية من هذه الشروط ستظل سارية المفعول.",
        
        "terms.changes.title": "١١. التغييرات على هذه الشروط",
        "terms.changes.modify": "نحتفظ بالحق، وفقًا لتقديرنا الخاص، في تعديل أو استبدال هذه الشروط في أي وقت. إذا كان التنقيح جوهريًا، فسنحاول تقديم إشعار بمدة ٣٠ يومًا على الأقل قبل دخول أي شروط جديدة حيز التنفيذ. ما يشكل تغييرًا جوهريًا سيتم تحديده وفقًا لتقديرنا الخاص.",
        "terms.changes.agreement": "من خلال الاستمرار في الوصول إلى خدمتنا أو استخدامها بعد أن تصبح هذه المراجعات سارية، فإنك توافق على الالتزام بالشروط المنقحة. إذا كنت لا توافق على الشروط الجديدة، فيرجى التوقف عن استخدام الخدمة.",
        
        "terms.contact.title": "١٢. اتصل بنا",
        "terms.contact.questions": "إذا كان لديك أي أسئلة حول هذه الشروط، فيرجى الاتصال بنا:",
        "terms.contact.email": "عبر البريد الإلكتروني: info@alfax10.com",
        "terms.contact.phone": "عبر الهاتف: +1 (555) 123-4567",
        "terms.contact.mail": "عبر البريد: 123 شارع التقنية، جناح 200، مدينة الابتكار"
    },
    ar: {
        // Meta
        "meta.title": "الفا إكس 10 - تطبيقات الموبايل، مواقع الويب وخدمات البرمجيات المخصصة",
        
        // Logo
        "logo.first": "الفا",
        "logo.second": "إكس 10",
        
        // Navigation
        "nav.home": "الرئيسية",
        "nav.about": "من نحن",
        "nav.services": "خدماتنا",
        "nav.projects": "مشاريعنا",
        "nav.testimonials": "آراء عملائنا",
        "nav.contact": "اتصل بنا",
        
        // Hero Section
        "hero.title.start": "نبني",
        "hero.title.digital": "تجارب",
        "hero.title.experiences": "رقمية",
        "hero.title.end": "ذات قيمة",
        "hero.description": "نحن نبتكر تطبيقات موبايل وتصميمات مواقع وحلول برمجية مخصصة تساعد الشركات على التطور وتعزز تجربة المستخدم.",
        "hero.cta.primary": "ابدأ الآن",
        "hero.cta.secondary": "استكشف الخدمات",
        
        // About Section
        "about.title.start": "من",
        "about.title.end": "نحن",
        "about.mission.title": "مهمتنا",
        "about.mission.p1": "في الفا إكس 10، نحن ملتزمون بتقديم حلول رقمية متطورة تساعد الشركات على الازدهار في المشهد التنافسي اليوم. مهمتنا هي تحويل الأفكار إلى تطبيقات ومواقع ويب قوية تركز على المستخدم وتعزز النمو وتحسن تفاعل المستخدم.",
        "about.mission.p2": "تأسست من قبل فريق من الخبراء التقنيين، ونحن نجمع بين الخبرة التقنية والتفكير الإبداعي لبناء حلول ليست عملية فحسب، بل أيضًا جذابة وسهلة الاستخدام.",
        "about.stats.projects": "مشروع منجز",
        "about.stats.clients": "عميل سعيد",
        "about.stats.experience": "سنوات من الخبرة",
        
        // Services Section
        "services.title.our": "خدماتنا",
        "services.title.services": "المميزة",
        
        "services.mobile.title": "تطوير تطبيقات الموبايل",
        "services.mobile.desc": "نقوم ببناء تطبيقات الهاتف المحمول الأصلية وعبر المنصات التي توفر تجارب مستخدم استثنائية على منصات iOS و Android.",
        "services.mobile.feature1": "تصميم واجهة مستخدم مخصصة",
        "services.mobile.feature2": "حلول أصلية وهجينة",
        "services.mobile.feature3": "تحسين الأداء",
        "services.mobile.feature4": "الدعم والصيانة المستمرة",
        
        "services.web.title": "تصميم وتطوير المواقع",
        "services.web.desc": "نقوم بإنشاء مواقع ويب حديثة وسريعة الاستجابة ذات واجهات سهلة الاستخدام تعزز التحويلات والمشاركة.",
        "services.web.feature1": "تصميم متجاوب",
        "services.web.feature2": "تحسين محركات البحث",
        "services.web.feature3": "أنظمة إدارة المحتوى",
        "services.web.feature4": "حلول التجارة الإلكترونية",
        
        "services.software.title": "تطوير البرمجيات المخصصة",
        "services.software.desc": "نحن نطور حلول برمجية مخصصة تعالج تحديات الأعمال المعقدة وتبسط العمليات.",
        "services.software.feature1": "تحليل الأعمال",
        "services.software.feature2": "تطوير واجهات برمجة التطبيقات",
        "services.software.feature3": "خدمات التكامل",
        "services.software.feature4": "حلول سحابية",
        
        "services.consulting.title": "الاستشارات التقنية",
        "services.consulting.desc": "يقدم خبراؤنا استشارات تكنولوجية استراتيجية لمساعدة الشركات على اتخاذ قرارات مستنيرة وتنفيذ حلول تقنية فعالة.",
        "services.consulting.feature1": "تقييم التكنولوجيا",
        "services.consulting.feature2": "التحول الرقمي",
        "services.consulting.feature3": "تطوير استراتيجية تكنولوجيا المعلومات",
        "services.consulting.feature4": "تحسين العمليات",
        
        "services.installation.title": "تركيب وصيانة الأجهزة",
        "services.installation.desc": "نقدم خدمات التركيب والتكوين والصيانة المستمرة لمجموعة واسعة من الأجهزة والمعدات التقنية.",
        "services.installation.feature1": "إعداد وتكوين الأجهزة",
        "services.installation.feature2": "الصيانة الوقائية",
        "services.installation.feature3": "استكشاف الأخطاء وإصلاحها",
        "services.installation.feature4": "ترقيات التكنولوجيا",
        
        "services.ui.title": "تصميم واجهات المستخدم",
        "services.ui.desc": "نقوم بإنشاء تصاميم واجهات مذهلة بصريًا تركز على المستخدم وتعزز قابلية الاستخدام وزيادة المشاركة ورفع مستوى التواجد الرقمي لعلامتك التجارية.",
        "services.ui.feature1": "أبحاث تجربة المستخدم",
        "services.ui.feature2": "التصميم البصري والعلامة التجارية",
        "services.ui.feature3": "إنشاء النماذج التفاعلية",
        "services.ui.feature4": "تحسين إمكانية الوصول",
        
        // Projects Section
        "projects.title.featured": "مشاريعنا",
        "projects.title.projects": "البارزة",
        "projects.badge": "قريباً",
        
        "projects.smartapp.title": "التطبيق الذكي",
        "projects.smartapp.desc": "سمارت آب - المراسلة بالذكاء الاصطناعي بسهولة\nسمارت آب هو أداة ذكية للجوال تساعد المستخدمين على إنشاء رسائل وردود تلقائية مخصصة في ثوانٍ. يعمل بتقنية الذكاء الاصطناعي ومتكامل مع واتساب، مما يبسط التواصل للاستخدام الشخصي والتجاري — يوفر الوقت ويعزز التفاعل.",
        "projects.smartapp.tag1": "تطبيق جوال",
        "projects.smartapp.tag2": "ذكاء اصطناعي",
        "projects.smartapp.tag3": "إنترنت الأشياء",
        
        "projects.tahaqqaq.title": "تحقق",
        "projects.tahaqqaq.desc": "تحقق هي منصة ذكية مصممة للتحقق من هوية وتفويض الأفراد المنتسبين لمؤسسة ما. تضمن الوصول الآمن والتحقق من صحة الأدوار خلال الفعاليات العامة والتجمعات أو المناسبات الرسمية.",
        "projects.tahaqqaq.tag1": "منصة ويب",
        "projects.tahaqqaq.tag2": "تطبيق جوال",
        "projects.tahaqqaq.tag3": "واجهة برمجة التطبيقات",
        
        // Testimonials Section
        "testimonials.title.client": "آراء",
        "testimonials.title.testimonials": "العملاء",
        
        "testimonials.1.content": "العمل مع الفا إكس 10 حوّل أعمالنا. زاد حل تطبيق الهاتف المحمول الخاص بهم من مشاركة العملاء بنسبة 200٪ في غضون ثلاثة أشهر فقط من الإطلاق.",
        "testimonials.1.author": "سارة الحمد",
        "testimonials.1.position": "الرئيس التنفيذي، شركة تيك فينتشرز",
        
        "testimonials.2.content": "موقع الويب الذي بناه الفا إكس 10 لنا لا يبدو رائعًا فحسب، بل يقدم أيضًا أداءً استثنائيًا. تحسن معدل التحويل لدينا بشكل كبير منذ إعادة التصميم.",
        "testimonials.2.author": "محمد الخميس",
        "testimonials.2.position": "مدير التسويق، جروث لابز",
        
        "testimonials.3.content": "اهتمام فريقهم بالتفاصيل والتزامهم بالجودة لا مثيل له. سلّم الفا إكس 10 حل البرمجيات المخصص قبل الموعد المحدد وتجاوز كل توقعاتنا.",
        "testimonials.3.author": "فاطمة القحطاني",
        "testimonials.3.position": "المدير التقني، إنوفيت تيك",
        
        // Contact Section
        "contact.title.get": "تواصل",
        "contact.title.touch": "معنا",
        
        "contact.info.title": "معلومات الاتصال",
        "contact.info.subtitle": "هل لديك مشروع في ذهنك؟ دعنا نناقش كيف يمكننا المساعدة في تحقيق أفكارك.",
        "contact.info.address": "نعمل عن بعد ونستخدم مكاتب افتراضية",
        "contact.info.email": "info@alfax10.com",
        "contact.info.phone": "+966553985690",
        
        "contact.form.name": "الاسم الكامل",
        "contact.form.email": "البريد الإلكتروني",
        "contact.form.subject": "الموضوع",
        "contact.form.message": "الرسالة",
        "contact.form.honeypot": "الموقع الإلكتروني (اتركه فارغًا)",
        "contact.form.submit": "إرسال الرسالة",
        
        // Footer
        "footer.tagline": "إنشاء تجارب رقمية تحول الأعمال وتعزز الحياة.",
        "footer.quicklinks.title": "روابط سريعة",
        "footer.services.title": "خدماتنا",
        "footer.legal.title": "قانوني",
        "footer.legal.privacy": "سياسة الخصوصية",
        "footer.legal.terms": "شروط الخدمة",
        "footer.legal.cookies": "سياسة ملفات تعريف الارتباط",
        "footer.copyright": "© 2025 الفا إكس 10. جميع الحقوق محفوظة.",
        "footer.credit": "تم التصميم والتطوير بواسطة ❤ فريق الفا إكس 10",
        
        // Legal page translations
        "privacy.title": "سياسة الخصوصية - الفا إكس 10",
        "privacy.description": "سياسة الخصوصية الفا إكس 10 - تعرف على كيفية جمع واستخدام وحماية معلوماتك الشخصية.",
        "privacy.heading": "سياسة الخصوصية",
        "privacy.lastUpdated": "آخر تحديث: ٢٩ يونيو ٢٠٢٥",
        
        // Privacy Policy detailed translations
        "privacy.intro.title": "١. مقدمة",
        "privacy.intro.text": "مرحبًا بكم في الفا إكس 10 (\"نحن\" أو \"الخاص بنا\"). نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. ستخبرك سياسة الخصوصية هذه عن كيفية اعتنائنا ببياناتك الشخصية عند زيارتك لموقعنا الإلكتروني وإخبارك عن حقوق الخصوصية الخاصة بك وكيف يحميك القانون.",
        
        "privacy.collect.title": "٢. المعلومات التي نجمعها",
        "privacy.collect.personal.title": "٢.١ المعلومات الشخصية",
        "privacy.collect.personal.intro": "قد نجمع الأنواع التالية من المعلومات الشخصية:",
        "privacy.collect.personal.identity": "بيانات الهوية: تشمل الاسم الأول واسم العائلة واسم المستخدم أو معرف مماثل.",
        "privacy.collect.personal.contact": "بيانات الاتصال: تشمل عنوان الفواتير وعنوان التسليم وعنوان البريد الإلكتروني وأرقام الهواتف.",
        "privacy.collect.personal.transaction": "بيانات المعاملات: تشمل تفاصيل حول المدفوعات من وإليك وتفاصيل أخرى عن المنتجات والخدمات التي اشتريتها منا.",
        "privacy.collect.personal.technical": "البيانات التقنية: تشمل عنوان بروتوكول الإنترنت (IP)، وبيانات تسجيل الدخول الخاصة بك، ونوع وإصدار المتصفح، وإعداد المنطقة الزمنية والموقع، وأنواع وإصدارات المكونات الإضافية للمتصفح، ونظام التشغيل والمنصة، وتقنيات أخرى على الأجهزة التي تستخدمها للوصول إلى هذا الموقع.",
        "privacy.collect.personal.profile": "بيانات الملف الشخصي: تشمل اسم المستخدم وكلمة المرور الخاصة بك، والمشتريات أو الطلبات التي قمت بها، واهتماماتك، وتفضيلاتك، والتعليقات واستجابات الاستطلاع.",
        "privacy.collect.personal.usage": "بيانات الاستخدام: تشمل معلومات حول كيفية استخدامك لموقعنا الإلكتروني ومنتجاتنا وخدماتنا.",
        "privacy.collect.personal.marketing": "بيانات التسويق والاتصالات: تشمل تفضيلاتك في تلقي التسويق منا ومن الأطراف الثالثة وتفضيلات الاتصال الخاصة بك.",
        
        "privacy.collect.cookies.title": "٢.٢ ملفات تعريف الارتباط والتقنيات المماثلة",
        "privacy.collect.cookies.text": "نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتتبع النشاط على خدمتنا والاحتفاظ بمعلومات معينة. لمزيد من التفاصيل، يرجى الاطلاع على <a href=\"cookie-policy.html\">سياسة ملفات تعريف الارتباط</a>.",
        
        "privacy.usage.title": "٣. كيف نستخدم معلوماتك",
        "privacy.usage.intro": "نستخدم معلوماتك الشخصية لهذه الأغراض:",
        "privacy.usage.service": "لتوفير وصيانة خدمتنا",
        "privacy.usage.notifications": "لإرسال إشعارات إليك",
        "privacy.usage.feedback": "لتوفير دعم العملاء والتعليقات",
        "privacy.usage.updates": "لتزويدك بالتحديثات والعروض الخاصة",
        "privacy.usage.monitor": "لمراقبة استخدام خدمتنا",
        "privacy.usage.technical": "لاكتشاف ومنع ومعالجة المشكلات التقنية",
        
        "privacy.sharing.title": "٤. مشاركة معلوماتك",
        "privacy.sharing.text": "قد نشارك معلوماتك مع:",
        "privacy.sharing.providers": "مقدمي الخدمات: لمراقبة وتحليل استخدام خدمتنا وتقديم خدمة العملاء.",
        "privacy.sharing.affiliates": "الشركات التابعة: قد نشارك معلوماتك مع شركاتنا التابعة، وفي هذه الحالة سنطلب من هؤلاء التابعين احترام سياسة الخصوصية هذه.",
        "privacy.sharing.business": "شركاء الأعمال: قد نشارك معلوماتك مع شركاء أعمالنا لتقديم منتجات وخدمات معينة لك.",
        "privacy.sharing.legal": "الالتزامات القانونية: قد نكشف عن معلوماتك الشخصية بحسن نية أننا ملزمون بالقيام بذلك بموجب القانون.",
        
        "privacy.security.title": "٥. أمن البيانات",
        "privacy.security.text": "أمن معلوماتك مهم بالنسبة لنا، ولكن تذكر أنه لا توجد طريقة نقل عبر الإنترنت أو طريقة تخزين إلكتروني آمنة 100٪. بينما نسعى جاهدين لاستخدام وسائل مقبولة تجاريًا لحماية معلوماتك الشخصية، لا يمكننا ضمان أمنها المطلق.",
        
        "privacy.childrens.title": "٦. خصوصية الأطفال",
        "privacy.childrens.text": "لا نتعامل عن قصد مع أي شخص دون سن 18 عامًا. لا نجمع عن قصد معلومات تعريف شخصية من الأطفال دون سن 18 عامًا. إذا كنت أحد الوالدين أو الوصي وكنت تعلم أن طفلك قد زودنا ببيانات شخصية، فيرجى الاتصال بنا.",
        
        "privacy.changes.title": "٧. التغييرات على سياسة الخصوصية هذه",
        "privacy.changes.text": "قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنخطرك بأي تغييرات عن طريق نشر سياسة الخصوصية الجديدة على هذه الصفحة. ننصحك بمراجعة سياسة الخصوصية هذه بشكل دوري لأي تغييرات.",
        
        "privacy.contact.title": "٨. اتصل بنا",
        "privacy.contact.text": "إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا:",
        "privacy.contact.email": "بالبريد الإلكتروني: info@alfax10.com",
        "privacy.contact.phone": "بالهاتف: +1 (555) 123-4567",
        "privacy.contact.mail": "بالبريد العادي: 123 شارع التكنولوجيا، جناح 200، مدينة الابتكار",

        // Additional privacy policy translations
        "privacy.usage.notify": "لإخطارك بالتغييرات في خدمتنا",
        "privacy.usage.account": "للسماح لك بالمشاركة في الميزات التفاعلية لخدمتنا عند اختيارك القيام بذلك",
        "privacy.usage.support": "لتقديم دعم العملاء",
        "privacy.usage.analyze": "لجمع التحليلات أو المعلومات القيمة حتى نتمكن من تحسين خدمتنا",
        "privacy.usage.detect": "لاكتشاف المشكلات التقنية ومنعها ومعالجتها",
        "privacy.usage.business": "لتزويدك بالأخبار والعروض الخاصة والمعلومات العامة حول السلع والخدمات والفعاليات الأخرى التي نقدمها",
        
        "privacy.retention.title": "٥. الاحتفاظ بالبيانات",
        "privacy.retention.text": "سنحتفظ ببياناتك الشخصية فقط طالما كان ذلك ضروريًا لتحقيق الأغراض التي جمعناها من أجلها، بما في ذلك لأغراض تلبية أي متطلبات قانونية أو محاسبية أو إعداد تقارير.",
        
        "privacy.rights.title": "٦. حقوقك",
        "privacy.rights.intro": "في ظل ظروف معينة، لديك حقوق بموجب قوانين حماية البيانات فيما يتعلق ببياناتك الشخصية، بما في ذلك:",
        "privacy.rights.access": "طلب الوصول إلى بياناتك الشخصية",
        "privacy.rights.correction": "طلب تصحيح بياناتك الشخصية",
        "privacy.rights.erasure": "طلب محو بياناتك الشخصية",
        "privacy.rights.object": "الاعتراض على معالجة بياناتك الشخصية",
        "privacy.rights.restriction": "طلب تقييد معالجة بياناتك الشخصية",
        "privacy.rights.transfer": "طلب نقل بياناتك الشخصية",
        "privacy.rights.withdraw": "الحق في سحب الموافقة",
        
        "privacy.thirdparty.title": "٧. روابط الطرف الثالث",
        "privacy.thirdparty.text": "قد تحتوي خدمتنا على روابط لمواقع أخرى لا نديرها. إذا نقرت على رابط جهة خارجية، فسيتم توجيهك إلى موقع تلك الجهة الخارجية. نحن ننصحك بشدة بمراجعة سياسة الخصوصية لكل موقع تزوره.",
        
        // Cookie Policy translations
        "cookies.title": "سياسة ملفات تعريف الارتباط - الفا إكس 10",
        "cookies.description": "سياسة ملفات تعريف الارتباط الفا إكس 10 - تعرف على كيفية استخدامنا لملفات تعريف الارتباط والتقنيات المماثلة على موقعنا.",
        "cookies.heading": "سياسة ملفات تعريف الارتباط",
        "cookies.lastUpdated": "آخر تحديث: ٢٩ يونيو ٢٠٢٥",
        
        // Cookie Policy detailed translations
        "cookies.intro.title": "١. ما هي ملفات تعريف الارتباط",
        "cookies.intro.text": "ملفات تعريف الارتباط هي قطع صغيرة من النص يتم إرسالها إلى متصفح الويب الخاص بك بواسطة موقع الويب الذي تزوره. يتم تخزين ملف تعريف الارتباط في متصفح الويب الخاص بك ويسمح للخدمة أو لطرف ثالث بالتعرف عليك وجعل زيارتك التالية أسهل وجعل الخدمة أكثر فائدة لك.",
        "cookies.intro.types": "يمكن أن تكون ملفات تعريف الارتباط \"دائمة\" أو ملفات تعريف ارتباط \"الجلسة\". تظل ملفات تعريف الارتباط الدائمة على جهاز الكمبيوتر الشخصي أو الجهاز المحمول عندما تكون غير متصل بالإنترنت، بينما يتم حذف ملفات تعريف ارتباط الجلسة بمجرد إغلاق متصفح الويب.",
        
        "cookies.usage.title": "٢. كيف تستخدم الفا إكس 10 ملفات تعريف الارتباط",
        "cookies.usage.place": "عند استخدام الخدمة والوصول إليها، قد نضع عددًا من ملفات تعريف الارتباط في متصفح الويب الخاص بك.",
        "cookies.usage.purposes": "نستخدم ملفات تعريف الارتباط للأغراض التالية:",
        "cookies.usage.functions": "لتمكين وظائف معينة من الخدمة",
        "cookies.usage.analytics": "لتوفير التحليلات",
        "cookies.usage.preferences": "لتخزين تفضيلاتك",
        "cookies.usage.ads": "لتمكين تسليم الإعلانات، بما في ذلك الإعلانات السلوكية",
        "cookies.usage.types": "نستخدم كلاً من ملفات تعريف ارتباط الجلسة وملفات تعريف الارتباط الدائمة على الخدمة ونستخدم أنواعًا مختلفة من ملفات تعريف الارتباط لتشغيل الخدمة:",
        "cookies.usage.essential": "<strong>ملفات تعريف الارتباط الأساسية.</strong> قد نستخدم ملفات تعريف الارتباط الأساسية للمصادقة على المستخدمين ومنع الاستخدام الاحتيالي لحسابات المستخدمين.",
        "cookies.usage.preferences": "<strong>ملفات تعريف ارتباط التفضيلات.</strong> قد نستخدم ملفات تعريف ارتباط التفضيلات لتذكر المعلومات التي تغير الطريقة التي تتصرف بها الخدمة أو تبدو، مثل تفضيل اللغة أو المنطقة التي أنت فيها.",
        "cookies.usage.analytics": "<strong>ملفات تعريف ارتباط التحليلات.</strong> قد نستخدم ملفات تعريف ارتباط التحليلات لتتبع المعلومات حول كيفية استخدام الخدمة حتى نتمكن من إجراء تحسينات. قد نستخدم أيضًا ملفات تعريف ارتباط التحليلات لاختبار إعلانات جديدة أو صفحات أو ميزات أو وظائف جديدة للخدمة لمعرفة كيفية تفاعل مستخدمينا معها.",
        "cookies.usage.marketing": "<strong>ملفات تعريف ارتباط التسويق.</strong> تتبع أنواع ملفات تعريف الارتباط هذه عادات التصفح لديك لتمكيننا من عرض إعلانات من المرجح أن تكون ذات أهمية بالنسبة لك. تستخدم ملفات تعريف الارتباط هذه معلومات حول تاريخ التصفح لديك لتجميعك مع مستخدمين آخرين لديهم اهتمامات مماثلة. بناءً على تلك المعلومات، وبإذننا، يمكن للمعلنين من جهات خارجية وضع ملفات تعريف ارتباط لتمكينهم من عرض إعلانات نعتقد أنها ذات صلة باهتماماتك أثناء وجودك على مواقع ويب تابعة لجهات خارجية.",
        
        "cookies.thirdparty.title": "٣. ملفات تعريف ارتباط الطرف الثالث",
        "cookies.thirdparty.text1": "بالإضافة إلى ملفات تعريف الارتباط الخاصة بنا، قد نستخدم أيضًا ملفات تعريف ارتباط مختلفة من جهات خارجية للإبلاغ عن إحصائيات استخدام الخدمة، وتقديم الإعلانات على الخدمة ومن خلالها، وما إلى ذلك.",
        "cookies.thirdparty.text2": "تشمل هذه الخدمات التابعة لجهات خارجية على سبيل المثال لا الحصر:",
        "cookies.thirdparty.google": "جوجل أناليتكس",
        "cookies.thirdparty.ads": "إعلانات جوجل",
        "cookies.thirdparty.fb": "بيكسل فيسبوك",
        "cookies.thirdparty.linkedin": "لينكد إن إنسايتس",
        "cookies.thirdparty.hotjar": "هوتجار",
        
        "cookies.choices.title": "٤. ما هي خياراتك بخصوص ملفات تعريف الارتباط",
        "cookies.choices.text1": "إذا كنت ترغب في حذف ملفات تعريف الارتباط أو توجيه متصفح الويب الخاص بك لحذف ملفات تعريف الارتباط أو رفضها، فيرجى زيارة صفحات المساعدة الخاصة بمتصفح الويب الخاص بك.",
        "cookies.choices.text2": "يرجى ملاحظة، مع ذلك، أنه إذا قمت بحذف ملفات تعريف الارتباط أو رفضت قبولها، فقد لا تتمكن من استخدام جميع الميزات التي نقدمها، وقد لا تتمكن من تخزين تفضيلاتك، وقد لا تعرض بعض صفحاتنا بشكل صحيح.",
        
        "cookies.manage.title": "٤.١ كيفية إدارة ملفات تعريف الارتباط في متصفحك",
        "cookies.manage.chrome": "لمتصفح الويب كروم، يرجى زيارة هذه الصفحة من جوجل: <a href=\"https://support.google.com/accounts/answer/32050\" target=\"_blank\">https://support.google.com/accounts/answer/32050</a>",
        "cookies.manage.ie": "لمتصفح الويب إنترنت إكسبلورر، يرجى زيارة هذه الصفحة من مايكروسوفت: <a href=\"https://support.microsoft.com/help/17442\" target=\"_blank\">https://support.microsoft.com/help/17442</a>",
        "cookies.manage.firefox": "لمتصفح الويب فايرفوكس، يرجى زيارة هذه الصفحة من موزيلا: <a href=\"https://support.mozilla.org/kb/delete-cookies-remove-info-websites-stored\" target=\"_blank\">https://support.mozilla.org/kb/delete-cookies-remove-info-websites-stored</a>",
        "cookies.manage.safari": "لمتصفح الويب سفاري، يرجى زيارة هذه الصفحة من أبل: <a href=\"https://support.apple.com/guide/safari/manage-cookies-sfri11471\" target=\"_blank\">https://support.apple.com/guide/safari/manage-cookies-sfri11471</a>",
        
        "cookies.contact.title": "٧. اتصل بنا",
        "cookies.contact.questions": "إذا كان لديك أي أسئلة حول ملفات تعريف الارتباط الخاصة بنا، فلا تتردد في الاتصال بنا.",
        "cookies.contact.text": "إذا كان لديك أي أسئلة حول سياسة ملفات تعريف الارتباط هذه، يمكنك الاتصال بنا:",
        "cookies.contact.email": "بالبريد الإلكتروني: info@alfax10.com",
        "cookies.contact.phone": "بالهاتف: +1 (555) 123-4567",
        "cookies.contact.mail": "بالبريد العادي: 123 شارع التكنولوجيا، جناح 200، مدينة الابتكار",
        
        "cookies.consent.title": "٥. موافقة ملفات تعريف الارتباط",
        "cookies.consent.text1": "عند زيارتك لموقعنا لأول مرة، سنطلب موافقتك على استخدامنا لملفات تعريف الارتباط. يمكنك اختيار قبول جميع ملفات تعريف الارتباط، أو رفض ملفات تعريف الارتباط غير الأساسية، أو إدارة تفضيلاتك بشكل فردي.",
        "cookies.consent.text2": "يمكنك تغيير تفضيلات ملفات تعريف الارتباط في أي وقت من خلال النقر على رابط \"إعدادات ملفات تعريف الارتباط\" في تذييل موقعنا الإلكتروني.",
        
        "cookies.changes.title": "٦. التغييرات على سياسة ملفات تعريف الارتباط هذه",
        "cookies.changes.text1": "قد نقوم بتحديث سياسة ملفات تعريف الارتباط الخاصة بنا من وقت لآخر. سنخطرك بأي تغييرات عن طريق نشر سياسة ملفات تعريف الارتباط الجديدة على هذه الصفحة وتحديث تاريخ \"آخر تحديث\" في أعلى سياسة ملفات تعريف الارتباط هذه.",
        "cookies.changes.text2": "ننصحك بمراجعة سياسة ملفات تعريف الارتباط هذه بشكل دوري لمعرفة أي تغييرات. تصبح التغييرات على سياسة ملفات تعريف الارتباط هذه سارية عندما يتم نشرها على هذه الصفحة.",
        
        "cookies.manage.others": "لأي متصفح ويب آخر، يرجى زيارة الصفحات الرسمية لمتصفح الويب الخاص بك."
    }
}
