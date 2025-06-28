# AlfaX10 - Company Website

This is a modern, responsive website for AlfaX10, a company specializing in developing mobile apps, websites, and custom software services.

## 📋 Overview

This project implements a dark-themed, responsive website with blue and yellow accents. It includes various sections like hero, about, services, projects, testimonials, and a contact form.

## 🗂️ File Structure

```
alfax10/
├── index.html          # Main HTML file with all website content
├── styles.css          # CSS styling for the website
├── scripts.js          # JavaScript functionality
├── assets/             # Contains images, logos, and other media
│   └── logo-placeholder.txt  # Placeholder for logo (replace with actual files)
└── README.md           # This documentation file
```

## 🚀 Getting Started

1. Clone this repository
2. Open the project in your favorite code editor
3. Replace placeholder images in the `assets` folder with actual images
4. Open `index.html` in a web browser to view the website

## 🔧 Development Guidelines

### HTML Structure

- The website uses semantic HTML5 elements (`<header>`, `<section>`, `<footer>`, etc.)
- Each section has an ID that corresponds to the navigation links
- Comments are provided throughout the HTML to explain each section

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
- All code is well-commented

## 📱 Responsive Design

The website is fully responsive and works on:
- Mobile devices (below 768px)
- Tablets (768px - 992px)
- Desktops (above 992px)

## 🔒 Security Features

- Form input sanitization to prevent XSS attacks
- Honeypot field for spam protection
- Client-side validation for all form inputs
- No third-party scripts loaded

## ⚙️ Future Development

This codebase is designed to be modular and easily expandable. Some future additions could include:

- Blog section
- Dynamic project listings
- Authentication system
- Backend API integration
- Multi-language support

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

## 📄 License

This project is created for AlfaX10 and should be used according to the company's guidelines.

---

© 2025 AlfaX10. All rights reserved.
