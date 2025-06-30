# AlfaX10 - Company Website

This is a modern, responsive, performance-optimized website for AlfaX10, a company specializing in developing mobile apps, websites, and custom software services.

## 📋 Overview

This project implements a dark-themed, responsive website with blue and yellow accents. It includes various sections like hero, about, services, projects, testimonials, and a contact form. The website is fully optimized for performance following Google Lighthouse recommendations.

## 🗂️ File Structure

```
alfax10/
├── index.html          # Main HTML file with all website content
├── styles.css          # CSS styling for the website
├── scripts.js          # JavaScript functionality
├── 404.html            # Custom 404 error page
├── sitemap.html        # HTML sitemap for easy navigation
├── sitemap.xml         # XML sitemap for search engines
├── robots.txt          # Instructions for search engine crawlers
├── .htaccess           # Server configuration for performance and security
├── convert_to_webp.py  # Python script to convert PNG images to WebP format
├── minify_assets.py    # Python script to minify CSS and JavaScript files
├── assets/             # Contains images, logos, and other media
│   ├── services/       # Service icons and images
│   └── testimonials/   # Testimonial images
├── Featured_Projects/  # Project showcase images
└── README.md           # This documentation file
```

## 🚀 Getting Started

1. Clone this repository
2. Open the project in your favorite code editor
3. Replace placeholder images in the `assets` folder with actual images
4. Open `index.html` in a web browser to view the website
5. Run the optimization scripts as needed (see Performance Optimization section)

## 🔧 Development Guidelines

### HTML Structure

- The website uses semantic HTML5 elements (`<header>`, `<section>`, `<footer>`, etc.)
- Each section has an ID that corresponds to the navigation links
- Comments are provided throughout the HTML to explain each section
- Images include proper width, height, and loading attributes to prevent layout shifts

### CSS Organization

- CSS uses variables for consistent colors and spacing
- Responsive design with media queries for different screen sizes
- Mobile-first approach with styles for tablets and desktop
- Clean, organized code with comments for each section

### JavaScript Functionality

- Modular JavaScript organized by feature
- Form validation with security measures
- Interactive elements like sliders and mobile menu
- Accessible keyboard navigation
- Image optimization helpers for WebP format support and lazy loading
- All code is well-commented

## 📱 Responsive Design

The website is fully responsive and works on:
- Mobile devices (below 768px)
- Tablets (768px - 992px)
- Desktops (above 992px)

## 🔤 Bilingual Support (English/Arabic)

The website features full bilingual support with the following enhancements:

- Language switcher in the navigation menu (EN | AR)
- RTL (Right-to-Left) layout for Arabic language
- All content is translated and properly displayed in both languages
- Remembers user's language preference with localStorage
- Responsive design that works in both language modes

### RTL Layout Adjustments

Special care has been taken to ensure the Arabic version of the site follows RTL design principles:

- Menu appears on the right side in Arabic mode
- Logo appears on the left side in Arabic mode 
- Testimonials slider direction is reversed for proper RTL navigation
- Form elements and interactive components are properly aligned
- Legal pages (Privacy Policy, Terms of Service, Cookie Policy) support both languages

## 🔒 Security Features

- Form input sanitization to prevent XSS attacks
- Honeypot field for spam protection
- Client-side validation for all form inputs
- Enhanced security headers in .htaccess
- Content Security Policy implementation
- No third-party scripts loaded without proper attributes

## 🚀 Performance Optimization

The website is optimized for performance following Google Lighthouse recommendations:

### Image Optimization

- WebP format used for better compression
- Proper image dimensions specified to prevent layout shifts
- Lazy loading for non-critical images
- Image conversion script included (convert_to_webp.py)
- JavaScript helper to fallback to PNG for browsers without WebP support

### Resource Loading

- Critical CSS inlined for faster rendering
- Async/defer attributes for non-critical JavaScript
- Preload directives for critical assets
- Font loading optimization with `font-display: swap`
- Google Fonts loading optimization with media="print" and onload handler

### Caching and Compression

- Comprehensive caching rules in .htaccess
- Gzip/Brotli compression for text assets
- Cache-Control headers for different resource types
- Content minification with the included minify_assets.py script

### Core Web Vitals

- Optimized Largest Contentful Paint (LCP) through preloaded hero images
- Improved Cumulative Layout Shift (CLS) with predefined image dimensions
- Enhanced First Input Delay (FID) with minimal JavaScript execution

## 🔧 Optimization Scripts

### convert_to_webp.py

Python script to convert PNG images to WebP format:

```
python convert_to_webp.py
```

Requires the Pillow library: `pip install Pillow`

### minify_assets.py

Python script to minify CSS and JavaScript files:

```
python minify_assets.py
```

Requires Node.js and the following packages:
```
npm install terser clean-css-cli
```

## ⚙️ Future Development

This codebase is designed to be modular and easily expandable. Some future additions could include:

- Blog section
- Dynamic project listings
- Authentication system
- Backend API integration
- Additional language support
- Structured data expansion for better SEO

## 🎨 Theme Customization

The website uses CSS variables for easy customization:

```css
:root {
    --bg-dark: #121212;
    --bg-dark-lighter: #1f1f1f;
    --bg-dark-lightest: #2d2d2d;
    --text-white: #ffffff;
    --text-gray: #a0a0a0;
    --accent-blue: #00BFFF;
    --accent-yellow: #FFD700;
    --accent-blue-dark: #0099cc;
    --accent-yellow-dark: #e6c200;
}
```

To change the theme colors, simply update these variables.

## 🧪 Testing

Before deploying to production:
1. Test the website on multiple browsers (Chrome, Firefox, Safari, Edge)
2. Verify responsiveness on different devices
3. Check accessibility using tools like Axe or Lighthouse
4. Validate HTML with the W3C validator
5. Test all interactive features
6. Run Lighthouse audits to verify performance metrics

## 📄 License

This project is created for AlfaX10 and should be used according to the company's guidelines.

---

© 2025 AlfaX10. All rights reserved.
