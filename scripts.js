/**
 * AlfaX10 Website Scripts
 * This file contains all the JavaScript functionality for the AlfaX10 website
 * Version: 1.1
 * Date: June 24, 2025
 * Updates: Added bilingual support (English and Arabic) with language switching
 */

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
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
        slider.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
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
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSliderPosition();
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSliderPosition();
        });
    }
    
    // Auto-advance slide every 5 seconds
    let slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
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
        "nav.testimonials": "آراء العملاء",
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
        
        "terms.title": "شروط الخدمة - الفا إكس 10",
        "terms.description": "شروط الخدمة الفا إكس 10 - اقرأ عن الشروط والأحكام لاستخدام خدماتنا.",
        "terms.heading": "شروط الخدمة",
        
        "cookies.title": "سياسة ملفات تعريف الارتباط - الفا إكس 10",
        "cookies.description": "سياسة ملفات تعريف الارتباط الفا إكس 10 - تعرف على كيفية استخدامنا لملفات تعريف الارتباط والتقنيات المماثلة على موقعنا.",
        "cookies.heading": "سياسة ملفات تعريف الارتباط",
    }
};

/**
 * Language Switcher
 * Handles language toggle and content translation
 */
/**
 * Language Switcher
 * Handles language toggle and content translation
 */
function initLanguageSwitcher() {
    const langToggle = document.getElementById('lang-toggle');
    const htmlElement = document.documentElement;
    
    if (!langToggle) {
        console.error('Language toggle button not found!');
        return;
    }
    
    console.log('Language switcher initialized');
    
    // Check if a language preference is saved in localStorage
    const savedLang = localStorage.getItem('alfax10_language') || 'en';
    
    // Set initial language
    setLanguage(savedLang);
    
    // Toggle language on button click
    langToggle.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Language toggle clicked');
        const currentLang = htmlElement.getAttribute('lang') || 'en';
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        console.log(`Switching language from ${currentLang} to ${newLang}`);
        setLanguage(newLang);
    });
    
    /**
     * Set the website language
     * @param {string} lang - The language code ('en' or 'ar')
     */
    function setLanguage(lang) {
        // Update HTML attributes
        htmlElement.setAttribute('lang', lang);
        htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        
        // Update toggle button text
        langToggle.textContent = lang === 'en' ? 'EN | AR' : 'AR | EN';
        
        try {
            // Update all translatable elements
            const elements = document.querySelectorAll('[data-i18n]');
            console.log(`Found ${elements.length} translatable elements`);
            
            elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    // Handle special cases for elements like meta title
                    if (element.tagName === 'TITLE') {
                        element.textContent = translations[lang][key];
                    } else if (element.tagName === 'META' && element.hasAttribute('content')) {
                        element.setAttribute('content', translations[lang][key]);
                    } else {
                        element.textContent = translations[lang][key];
                    }
                } else {
                    console.warn(`Translation not found for key: ${key} in language: ${lang}`);
                }
            });
            
            // Save language preference
            localStorage.setItem('alfax10_language', lang);
            
            // Dispatch an event for other components that might need to react to language change
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
            
            console.log(`Language successfully changed to ${lang}`);
        } catch (error) {
            console.error('Error changing language:', error);
        }
    }
}
