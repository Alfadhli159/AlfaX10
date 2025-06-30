# PNG/JPG to WebP Conversion Script
# This script requires Python and Pillow library
# Install with: pip install Pillow

import os
import sys
import time
import re
import shutil
from PIL import Image, ImageOps, ImageFile

# Enable large image handling
ImageFile.LOAD_TRUNCATED_IMAGES = True

"""
AlfaX10 Website Performance Optimization Tool
============================================

This script helps optimize the AlfaX10 website for better performance 
and SEO scores based on PageSpeed Insights recommendations.

Features:
---------
1. Image Optimization:
   - Convert PNG/JPEG to WebP for better compression
   - Resize large images to improve loading times
   - Add width and height attributes to prevent layout shifts (CLS)
   - Generate HTML tags with proper dimensions and loading attributes

2. SEO Optimization:
   - Generate JSON-LD structured data for improved search engine visibility
   - Create schemas for Organization, Website, and Services

Usage:
------
Run the script and follow the interactive menu to:
1. Convert images to WebP format
2. Generate HTML image tags with proper dimensions
3. Generate JSON-LD structured data for SEO
4. Perform multiple operations at once

Author: Created with GitHub Copilot
Date: June 30, 2025
"""

def convert_to_webp(source_dir, quality=85, resize=None, lossless=False, output_dir=None):
    """
    Convert all PNG and JPEG images in a directory (and its subdirectories) to WebP format
    
    Args:
        source_dir (str): Directory to scan for images
        quality (int): Quality of WebP image (0-100)
        resize (tuple): Optional (width, height) to resize images to
        lossless (bool): Whether to use lossless compression for PNGs
        output_dir (str): Optional directory to save optimized images (preserves folder structure)
    """
    # Count success and failures
    success_count = 0
    failure_count = 0
    skipped_count = 0
    total_size_before = 0
    total_size_after = 0
    
    # Get start time
    start_time = time.time()
    
    # List of image extensions to convert
    image_extensions = ('.png', '.jpg', '.jpeg')

    # Walk through all directories
    print("\nScanning for images...\n")
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            # Check if file has supported image extension
            if file.lower().endswith(image_extensions):
                img_path = os.path.join(root, file)
                webp_path = os.path.splitext(img_path)[0] + '.webp'
                
                # Determine output path (original location or custom output dir)
                if output_dir:
                    # Get relative path from source directory
                    rel_path = os.path.relpath(img_path, source_dir)
                    # Create output path maintaining folder structure
                    webp_path = os.path.join(output_dir, os.path.splitext(rel_path)[0] + '.webp')
                    # Create directories if they don't exist
                    os.makedirs(os.path.dirname(webp_path), exist_ok=True)
                else:
                    webp_path = os.path.splitext(img_path)[0] + '.webp'
                
                # Skip if WebP already exists
                if os.path.exists(webp_path):
                    print(f"Skipping {img_path} (WebP already exists)")
                    skipped_count += 1
                    continue
                
                try:
                    # Get original file size
                    original_size = os.path.getsize(img_path)
                    total_size_before += original_size
                    
                    # Open the image
                    with Image.open(img_path) as img:
                        # Handle transparency correctly for PNGs
                        if img.format == 'PNG' and img.mode in ('RGBA', 'LA'):
                            # Use lossless for PNGs with transparency if specified
                            use_lossless = lossless
                        else:
                            use_lossless = False
                            
                            # Convert palette mode to RGB
                            if img.mode == 'P':
                                img = img.convert('RGB')
                        
                        # Resize if requested or if image is larger than 1920px width
                        if resize:
                            img = ImageOps.contain(img, resize, method=Image.LANCZOS)
                        elif img.width > 1920:
                            # Auto-resize large images to 1920px width while preserving aspect ratio
                            new_height = int((1920 / img.width) * img.height)
                            img = img.resize((1920, new_height), Image.LANCZOS)
                            print(f"  Auto-resized from {img.width}×{img.height} to 1920×{new_height}")
                        
                        # Save as WebP
                        img.save(webp_path, 'WEBP', quality=quality, lossless=use_lossless)
                    
                    # Get new file size
                    new_size = os.path.getsize(webp_path)
                    total_size_after += new_size
                    
                    # Calculate size reduction
                    size_reduction = (1 - (new_size / original_size)) * 100
                    
                    print(f"Converted: {img_path} -> {webp_path}")
                    print(f"  Size: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB ({size_reduction:.1f}% reduction)")
                    success_count += 1
                except Exception as e:
                    print(f"Error converting {img_path}: {e}")
                    failure_count += 1
    
    # Calculate time taken
    elapsed_time = time.time() - start_time
    
    # Print summary
    print(f"\nConversion complete in {elapsed_time:.1f} seconds!")
    print(f"Successfully converted: {success_count} images")
    print(f"Failed conversions: {failure_count} images")
    print(f"Skipped (already exist): {skipped_count} images")
    
    if success_count > 0:
        # Calculate total size reduction
        total_reduction = (1 - (total_size_after / total_size_before)) * 100
        print(f"\nTotal size reduction: {total_size_before/1024/1024:.2f}MB -> {total_size_after/1024/1024:.2f}MB ({total_reduction:.1f}% reduction)")
        
        # Calculate average size reduction per image
        avg_reduction = total_reduction / success_count
        print(f"Average reduction per image: {avg_reduction:.1f}%")
    
    return success_count, failure_count, skipped_count

def generate_json_ld(site_url="https://www.alfax10.com"):
    """
    Generate JSON-LD structured data for AlfaX10 website
    """
    current_date = time.strftime("%Y-%m-%d")
    
    # Basic Organization schema
    org_schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "AlfaX10",
        "url": site_url,
        "logo": f"{site_url}/assets/logo-AldaX10.png",
        "description": "AlfaX10 is a company specializing in developing mobile apps, websites, and custom software services.",
        "foundingDate": "2025-01-01",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "Saudi Arabia"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+966553985690",
            "contactType": "customer service",
            "email": "info@alfax10.com"
        },
        "sameAs": []
    }
    
    # WebSite schema
    website_schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "AlfaX10",
        "url": site_url,
        "description": "AlfaX10 - Mobile Apps, Websites & Custom Software Services",
        "potentialAction": {
            "@type": "SearchAction",
            "target": f"{site_url}?s={{search_term_string}}",
            "query-input": "required name=search_term_string"
        }
    }
    
    # Service schema for each service
    services = [
        {
            "name": "Mobile App Development",
            "description": "We build native and cross-platform mobile applications that deliver exceptional user experiences across iOS and Android platforms.",
            "image": f"{site_url}/assets/services/mobile_app_development.webp"
        },
        {
            "name": "Website Design & Development",
            "description": "We create responsive, modern websites with clean code and intuitive user interfaces that drive conversions and engagement.",
            "image": f"{site_url}/assets/services/website_design_development.webp"
        },
        {
            "name": "Custom Software Development",
            "description": "We develop tailored software solutions that solve complex business challenges and streamline operations.",
            "image": f"{site_url}/assets/services/custom_software_development.webp"
        },
        {
            "name": "Tech Consultations",
            "description": "Our experts provide strategic technology consultation to help businesses make informed decisions and implement effective tech solutions.",
            "image": f"{site_url}/assets/services/tech_consultations.webp"
        },
        {
            "name": "Device Installation & Maintenance",
            "description": "We provide professional installation, configuration, and ongoing maintenance services for a wide range of hardware devices and technical equipment.",
            "image": f"{site_url}/assets/services/device_installation_maintenance.webp"
        },
        {
            "name": "UI/UX Design",
            "description": "We create visually stunning, user-centered interface designs that enhance usability, increase engagement, and elevate your brand's digital presence.",
            "image": f"{site_url}/assets/services/ui_design.webp"
        }
    ]
    
    service_schemas = []
    for idx, service in enumerate(services):
        service_schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service["name"],
            "description": service["description"],
            "provider": {
                "@type": "Organization",
                "name": "AlfaX10",
                "url": site_url
            },
            "url": f"{site_url}#services",
            "image": service["image"],
            "position": idx + 1
        }
        service_schemas.append(service_schema)
    
    # Create the HTML output for copying
    html_output = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AlfaX10 Structured Data</title>
    <style>
        body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
        h1 {{ color: #00BFFF; }}
        .schema-container {{ margin-bottom: 30px; }}
        pre {{ background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }}
        .instructions {{ background: #e6f7ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }}
    </style>
</head>
<body>
    <h1>AlfaX10 Structured Data Generator</h1>
    <p>Generated on {time.strftime("%Y-%m-%d at %H:%M:%S")}</p>
    
    <div class="instructions">
        <h2>How to Use This Structured Data</h2>
        <p>Add these JSON-LD script tags to the &lt;head&gt; section of your HTML pages to improve SEO and enable rich results in search engines.</p>
        <p>Each block should be placed in a separate &lt;script&gt; tag as shown below.</p>
    </div>
    
    <div class="schema-container">
        <h2>Organization Schema</h2>
        <p>Add this to your homepage:</p>
        <pre>&lt;script type="application/ld+json"&gt;
{str(org_schema).replace("'", '"').replace("True", "true").replace("False", "false")}
&lt;/script&gt;</pre>
    </div>
    
    <div class="schema-container">
        <h2>Website Schema</h2>
        <p>Add this to your homepage:</p>
        <pre>&lt;script type="application/ld+json"&gt;
{str(website_schema).replace("'", '"').replace("True", "true").replace("False", "false")}
&lt;/script&gt;</pre>
    </div>
    
    <div class="schema-container">
        <h2>Service Schemas</h2>
        <p>Add these to your services section or page:</p>
"""
    
    # Add each service schema
    for service_schema in service_schemas:
        html_output += f"""
        <h3>{service_schema['name']}</h3>
        <pre>&lt;script type="application/ld+json"&gt;
{str(service_schema).replace("'", '"').replace("True", "true").replace("False", "false")}
&lt;/script&gt;</pre>
"""
    
    html_output += """
    </div>
    
    <div class="schema-container">
        <h2>All Services in One Block (Alternative)</h2>
        <p>Instead of individual service blocks, you can use this combined ItemList:</p>
        <pre>&lt;script type="application/ld+json"&gt;
"""
    
    # Generate combined service list schema
    service_list_schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    }
    
    for idx, service in enumerate(services):
        service_list_schema["itemListElement"].append({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
                "@type": "Service",
                "name": service["name"],
                "description": service["description"],
                "url": f"{site_url}#services",
                "provider": {
                    "@type": "Organization",
                    "name": "AlfaX10"
                }
            }
        })
    
    html_output += f"""{str(service_list_schema).replace("'", '"').replace("True", "true").replace("False", "false")}
&lt;/script&gt;</pre>
    </div>
</body>
</html>
"""
    
    # Write the HTML file
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "structured_data_reference.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_output)
    
    print(f"Structured data reference file created: {output_path}")
    print("This file contains JSON-LD structured data for your website to improve SEO.")
    print("Add these scripts to your HTML pages as indicated in the reference file.")
    
    return output_path

def generate_htaccess():
    """
    Generate an optimized .htaccess file with performance and security best practices
    """
    htaccess_content = """# AlfaX10 Optimized .htaccess
# Generated on {date}
# Improves website performance, security, and SEO

# Enable GZIP compression
<IfModule mod_deflate.c>
  # Enable compression for the following file types
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript
  AddOutputFilterByType DEFLATE application/javascript application/x-javascript application/json
  AddOutputFilterByType DEFLATE application/xml application/xhtml+xml application/rss+xml
  AddOutputFilterByType DEFLATE image/svg+xml image/x-icon
</IfModule>

# Browser caching for static assets
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Default expiration: 1 month after request
  ExpiresDefault "access plus 1 month"
  
  # Document HTML
  ExpiresByType text/html "access plus 0 seconds"
  
  # Data
  ExpiresByType text/xml "access plus 0 seconds"
  ExpiresByType application/xml "access plus 0 seconds"
  ExpiresByType application/json "access plus 0 seconds"
  
  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  
  # Media: images, video, audio
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
  ExpiresByType video/ogg "access plus 1 year"
  ExpiresByType video/webm "access plus 1 year"
  ExpiresByType audio/ogg "access plus 1 year"
  ExpiresByType audio/mp4 "access plus 1 year"
  
  # Web fonts
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType font/otf "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType application/font-woff "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
  ExpiresByType application/vnd.ms-fontobject "access plus 1 year"
</IfModule>

# Add security headers
<IfModule mod_headers.c>
  # HTTP Strict Transport Security (HSTS)
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  
  # X-Content-Type-Options
  Header always set X-Content-Type-Options "nosniff"
  
  # X-Frame-Options
  Header always set X-Frame-Options "SAMEORIGIN"
  
  # X-XSS-Protection
  Header always set X-XSS-Protection "1; mode=block"
  
  # Content Security Policy (CSP)
  # Customize this according to your website's needs
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://www.google-analytics.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; object-src 'none'"
  
  # Referrer Policy
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  
  # Permissions Policy
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  
  # Cache Control for static assets
  <FilesMatch "\\.(ico|pdf|jpg|jpeg|png|webp|gif|svg|js|css|woff|woff2|ttf|otf)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>

# Enable Keep-Alive
<IfModule mod_headers.c>
  Header set Connection keep-alive
</IfModule>

# Protect against malicious requests
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_METHOD} ^(HEAD|TRACE|DELETE|TRACK) [NC]
  RewriteRule ^(.*)$ - [F,L]
  RewriteCond %{HTTP_USER_AGENT} ^$ [OR]
  RewriteCond %{HTTP_USER_AGENT} (libwww-perl|wget|python|nikto|curl|scan|java|winhttp) [NC,OR]
  RewriteCond %{HTTP_USER_AGENT} (winhttp|HTTrack|clshttp|archiver|loader|email|harvest|extract|grab|miner) [NC,OR]
  RewriteCond %{HTTP_USER_AGENT} (netmechanic|analyzer|spam|spider|indexer|phpcrawl|enigma|php|crawl) [NC]
  RewriteRule ^.* - [F,L]
</IfModule>

# Error document handling
ErrorDocument 404 /404.html

# Disable server signature
ServerSignature Off
"""

    # Format with current date
    htaccess_content = htaccess_content.format(date=time.strftime("%Y-%m-%d"))
    
    # Write .htaccess file
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".htaccess")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(htaccess_content)
    
    print(f".htaccess file created: {output_path}")
    print("This file includes:")
    print("- Browser caching rules for static assets")
    print("- GZIP compression for text and HTML files")
    print("- Security headers (CSP, HSTS, X-Frame-Options)")
    print("- Protection against malicious requests")
    print("- Performance optimizations")
    
    return output_path

def generate_html_image_tags(source_dir):
    """
    Scan for images and generate HTML tags with proper width and height attributes
    """
    print("\nGenerating HTML image tags with proper dimensions...\n")
    
    # List of image extensions to process
    image_extensions = ('.png', '.jpg', '.jpeg', '.webp')
    
    # Store image information
    image_data = []
    
    # Walk through all directories
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            # Check if file has supported image extension
            if file.lower().endswith(image_extensions):
                img_path = os.path.join(root, file)
                
                # Make path relative to source directory
                rel_path = os.path.relpath(img_path, source_dir)
                # Fix path format for web URLs (forward slashes)
                web_path = rel_path.replace('\\', '/')
                
                try:
                    # Open the image to get dimensions
                    with Image.open(img_path) as img:
                        width, height = img.size
                        alt_text = os.path.splitext(os.path.basename(img_path))[0].replace('_', ' ').replace('-', ' ').title()
                        
                        # Determine if image should be lazy loaded (anything not in first screen)
                        # Simple heuristic: logo and hero images are not lazy loaded
                        is_critical = 'logo' in img_path.lower() or 'hero' in img_path.lower()
                        
                        # Store the image data
                        image_data.append({
                            'path': web_path,
                            'width': width,
                            'height': height,
                            'alt': alt_text,
                            'is_critical': is_critical
                        })
                        
                except Exception as e:
                    print(f"Error processing {img_path}: {e}")
    
    # Create HTML file with the image tags
    html_output_path = os.path.join(source_dir, 'image_tags_reference.html')
    
    with open(html_output_path, 'w') as f:
        f.write('<!DOCTYPE html>\n<html lang="en">\n<head>\n')
        f.write('    <meta charset="UTF-8">\n')
        f.write('    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
        f.write('    <title>Image Tags Reference</title>\n')
        f.write('    <style>\n')
        f.write('        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }\n')
        f.write('        h1 { color: #00BFFF; }\n')
        f.write('        .image-entry { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }\n')
        f.write('        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }\n')
        f.write('        img { max-width: 300px; height: auto; border: 1px solid #ddd; }\n')
        f.write('        .path { font-family: monospace; color: #0066cc; }\n')
        f.write('        .dimensions { font-weight: bold; }\n')
        f.write('    </style>\n')
        f.write('</head>\n<body>\n')
        f.write('    <h1>AlfaX10 Image Tags Reference</h1>\n')
        f.write('    <p>Generated on ' + time.strftime("%Y-%m-%d at %H:%M:%S") + '</p>\n')
        f.write('    <p>This file contains HTML image tags with proper width and height attributes for all images in the project.</p>\n\n')
        
        # Output each image entry
        for img in image_data:
            f.write('    <div class="image-entry">\n')
            f.write(f'        <h2>{img["alt"]}</h2>\n')
            f.write(f'        <p class="path">Path: {img["path"]}</p>\n')
            f.write(f'        <p class="dimensions">Dimensions: {img["width"]}×{img["height"]} pixels</p>\n')
            
            # Show preview of the image
            f.write(f'        <img src="{img["path"]}" alt="{img["alt"]}" width="{img["width"]}" height="{img["height"]}">\n\n')
            
            # HTML tag for copying
            html_tag = f'<img src="{img["path"]}" alt="{img["alt"]}" width="{img["width"]}" height="{img["height"]}"'
            if not img["is_critical"]:
                html_tag += ' loading="lazy"'
            if img["is_critical"]:
                html_tag += ' fetchpriority="high"'
            html_tag += '>'
            
            f.write('        <p>HTML Tag:</p>\n')
            f.write(f'        <pre>{html_tag}</pre>\n')
            f.write('    </div>\n\n')
        
        f.write('</body>\n</html>')
    
    print(f"HTML reference file created: {html_output_path}")
    print(f"This file contains proper image tags for {len(image_data)} images with correct dimensions.")
    print("Use these tags to prevent layout shifts and improve Core Web Vitals.")

def minify_assets(source_dir):
    """
    Create minified versions of CSS and JS files in the provided directory
    """
    print("\nMinifying CSS and JS assets...\n")
    
    css_count = 0
    js_count = 0
    total_original_size = 0
    total_minified_size = 0
    
    # Walk through directories
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            if file.endswith('.css') and not file.endswith('.min.css'):
                file_path = os.path.join(root, file)
                minified_path = os.path.join(root, os.path.splitext(file)[0] + '.min.css')
                
                try:
                    # Read original file
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Get original size
                    original_size = len(content)
                    total_original_size += original_size
                    
                    # Basic CSS minification
                    # Remove comments
                    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
                    # Remove whitespace
                    content = re.sub(r'\s+', ' ', content)
                    # Remove spaces around operators
                    content = re.sub(r'\s*([{};,:])\s*', r'\1', content)
                    # Remove unnecessary spaces
                    content = re.sub(r'\s+', ' ', content)
                    # Remove leading and trailing whitespace
                    content = content.strip()
                    
                    # Get minified size
                    minified_size = len(content)
                    total_minified_size += minified_size
                    
                    # Write minified file
                    with open(minified_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    # Calculate reduction
                    reduction = (1 - (minified_size / original_size)) * 100
                    
                    print(f"Minified CSS: {file} → {os.path.basename(minified_path)}")
                    print(f"  Size: {original_size/1024:.1f}KB → {minified_size/1024:.1f}KB ({reduction:.1f}% reduction)")
                    
                    css_count += 1
                    
                except Exception as e:
                    print(f"Error minifying {file}: {e}")
            
            elif file.endswith('.js') and not file.endswith('.min.js'):
                file_path = os.path.join(root, file)
                minified_path = os.path.join(root, os.path.splitext(file)[0] + '.min.js')
                
                try:
                    # Read original file
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Get original size
                    original_size = len(content)
                    total_original_size += original_size
                    
                    # Basic JS minification
                    # Remove single-line comments
                    content = re.sub(r'//.*?\\n', '\\n', content)
                    # Remove multi-line comments
                    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
                    # Remove whitespace around operators
                    content = re.sub(r'\s+([=+\-*/&|<>!?:;,(){}\\[\\]])\s+', r'\1', content)
                    # Collapse multiple whitespace
                    content = re.sub(r'\s+', ' ', content)
                    # Remove unnecessary whitespace
                    content = re.sub(r';\s+', ';', content)
                    content = re.sub(r'{\s+', '{', content)
                    content = re.sub(r'\s+}', '}', content)
                    # Remove leading and trailing whitespace
                    content = content.strip()
                    
                    # Get minified size
                    minified_size = len(content)
                    total_minified_size += minified_size
                    
                    # Write minified file
                    with open(minified_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    # Calculate reduction
                    reduction = (1 - (minified_size / original_size)) * 100
                    
                    print(f"Minified JS: {file} → {os.path.basename(minified_path)}")
                    print(f"  Size: {original_size/1024:.1f}KB → {minified_size/1024:.1f}KB ({reduction:.1f}% reduction)")
                    
                    js_count += 1
                    
                except Exception as e:
                    print(f"Error minifying {file}: {e}")
    
    # Print summary
    if css_count > 0 or js_count > 0:
        print(f"\nMinification complete!")
        print(f"Minified {css_count} CSS and {js_count} JS files")
        
        # Calculate total reduction
        if total_original_size > 0:
            total_reduction = (1 - (total_minified_size / total_original_size)) * 100
            print(f"Total size reduction: {total_original_size/1024:.1f}KB → {total_minified_size/1024:.1f}KB ({total_reduction:.1f}% reduction)")
    else:
        print("No CSS or JS files found to minify.")
    
    return css_count + js_count

def generate_seo_meta_tags(site_title, site_description, site_url):
    """
    Generate SEO meta tags for the website
    """
    seo_tags = f"""<!-- SEO Meta Tags -->
<meta name="title" content="{site_title}">
<meta name="description" content="{site_description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="{site_url}">
<meta property="og:title" content="{site_title}">
<meta property="og:description" content="{site_description}">
<meta property="og:image" content="{site_url}/assets/hero1.webp">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="{site_url}">
<meta property="twitter:title" content="{site_title}">
<meta property="twitter:description" content="{site_description}">
<meta property="twitter:image" content="{site_url}/assets/hero1.webp">

<!-- Canonical URL -->
<link rel="canonical" href="{site_url}">

<!-- Preconnect to required origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload critical assets -->
<link rel="preload" href="{site_url}/assets/hero1.webp" as="image" fetchpriority="high">
<link rel="preload" href="{site_url}/styles.css" as="style">
<link rel="preload" href="{site_url}/scripts.js" as="script">
"""
    
    # Write to a file
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "seo_meta_tags.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(seo_tags)
    
    print(f"\nSEO meta tags file created: {output_path}")
    print("Copy these tags into the <head> section of your HTML pages.")
    
    return output_path

if __name__ == "__main__":
    source_directory = "."  # Current directory
    
    print("AlfaX10 Website Optimization Tool")
    print("=====================================")
    print("🚀 This tool helps optimize your website for better performance, SEO, and PageSpeed scores")
    print("✅ Features:")
    print("  - Convert PNG/JPEG to WebP format for better compression")
    print("  - Generate HTML image tags with proper width/height attributes")
    print("  - Auto-resize large images to improve loading times")
    print("  - Create JSON-LD structured data for better SEO")
    print("  - Generate optimized .htaccess with caching and security headers")
    print("  - Minify CSS and JS files for faster loading")
    print("  - Create SEO meta tags for better search engine visibility")
    print()
    
    # Ask for directory path (default to current directory)
    user_dir = input(f"Enter website directory path (press Enter for current directory): ")
    if user_dir.strip():
        source_directory = user_dir
    
    # Display menu
    while True:
        print("\n📋 Choose an operation:")
        print("1. Convert images to WebP format")
        print("2. Generate HTML image tags reference")
        print("3. Generate JSON-LD structured data (SEO)")
        print("4. Generate .htaccess file with performance and security settings")
        print("5. Minify CSS and JS files")
        print("6. Generate SEO meta tags")
        print("7. Full website optimization (options 1, 2, 3, 4, 5)")
        print("8. Exit")
        
        choice = input("\nEnter your choice (1-8): ")
        
        if choice == "8":
            print("Exiting program.")
            sys.exit(0)
            
        elif choice in ["1", "4"]:  # WebP conversion
            # Ask for quality
            try:
                quality = int(input("\nEnter WebP quality (1-100, default 85): ") or "85")
                quality = max(1, min(100, quality))  # Ensure quality is between 1-100
            except ValueError:
                print("Invalid quality value, using default (85)")
                quality = 85
            
            # Ask about resizing
            resize_option = input("Resize large images? (y/n, default: n): ").lower()
            resize_dimensions = None
            if resize_option == 'y':
                try:
                    width = int(input("Enter maximum width in pixels (or 0 to keep aspect ratio): "))
                    height = int(input("Enter maximum height in pixels (or 0 to keep aspect ratio): "))
                    
                    if width > 0 and height > 0:
                        resize_dimensions = (width, height)
                    elif width > 0:
                        resize_dimensions = (width, width)  # Square based on width
                    elif height > 0:
                        resize_dimensions = (height, height)  # Square based on height
                except ValueError:
                    print("Invalid dimensions, images will not be resized")
            
            # Ask about lossless mode for PNGs
            lossless_option = input("Use lossless compression for PNGs? (y/n, default: n): ").lower()
            lossless = lossless_option == 'y'
            
            # Confirm before proceeding
            print(f"\nAbout to scan '{os.path.abspath(source_directory)}' for images to convert.")
            print(f"Quality: {quality}")
            if resize_dimensions:
                print(f"Resize to maximum dimensions: {resize_dimensions}")
            print(f"Lossless compression for PNGs: {'Yes' if lossless else 'No'}")
            
            confirm = input("\nProceed with conversion? (y/n): ")
            
            if confirm.lower() == 'y':
                try:
                    convert_to_webp(source_directory, quality, resize_dimensions, lossless)
                except KeyboardInterrupt:
                    print("\nOperation cancelled by user.")
                    continue
                except Exception as e:
                    print(f"\nAn error occurred: {e}")
                    continue
        
        if choice in ["2", "4"]:  # Generate HTML tags
            try:
                print("\nGenerating HTML image tags reference file...")
                generate_html_image_tags(source_directory)
            except KeyboardInterrupt:
                print("\nOperation cancelled by user.")
                continue
            except Exception as e:
                print(f"\nAn error occurred while generating HTML tags: {e}")
                continue
        
        if choice == "3":  # Generate JSON-LD structured data
            try:
                # Ask for website URL
                site_url = input("\nEnter your website URL (default: https://www.alfax10.com): ").strip() or "https://www.alfax10.com"
                
                # Ensure URL doesn't end with a slash
                if site_url.endswith("/"):
                    site_url = site_url[:-1]
                
                # Generate structured data
                print("\nGenerating JSON-LD structured data...")
                output_path = generate_json_ld(site_url)
                
                # Ask if the user wants to open the file
                open_file = input("\nWould you like to open the generated file? (y/n): ").lower()
                if open_file == 'y':
                    try:
                        import webbrowser
                        webbrowser.open(f"file:///{output_path}")
                    except Exception as e:
                        print(f"Could not open file automatically: {e}")
                        print(f"Please open manually: {output_path}")
            except KeyboardInterrupt:
                print("\nOperation cancelled by user.")
                continue
            except Exception as e:
                print(f"\nAn error occurred while generating structured data: {e}")
                continue
                
        # Handle .htaccess generation
        if choice == "4":
            try:
                print("\nGenerating .htaccess file with performance and security settings...")
                output_path = generate_htaccess()
                
                print("\nReview the .htaccess file and upload it to your web server.")
                print("WARNING: Test the .htaccess file in a staging environment first to ensure it doesn't break your site.")
            except Exception as e:
                print(f"\nAn error occurred while generating .htaccess: {e}")
                continue
        
        # Handle CSS and JS minification
        if choice == "5":
            try:
                print("\nMinifying CSS and JS files...")
                minify_assets(source_directory)
            except KeyboardInterrupt:
                print("\nOperation cancelled by user.")
                continue
            except Exception as e:
                print(f"\nAn error occurred while minifying assets: {e}")
                continue
        
        # Handle SEO meta tags generation
        if choice == "6":
            try:
                # Ask for website title and description
                site_title = input("\nEnter website title (default: AlfaX10 - Mobile Apps, Websites & Custom Software): ").strip() or "AlfaX10 - Mobile Apps, Websites & Custom Software"
                site_description = input("\nEnter website description (default: AlfaX10 specializes in mobile app development, website design, and custom software solutions): ").strip() or "AlfaX10 specializes in mobile app development, website design, and custom software solutions"
                site_url = input("\nEnter your website URL (default: https://www.alfax10.com): ").strip() or "https://www.alfax10.com"
                
                # Ensure URL doesn't end with a slash
                if site_url.endswith("/"):
                    site_url = site_url[:-1]
                
                # Generate SEO meta tags
                print("\nGenerating SEO meta tags...")
                output_path = generate_seo_meta_tags(site_title, site_description, site_url)
                
                # Ask if the user wants to open the file
                open_file = input("\nWould you like to open the generated file? (y/n): ").lower()
                if open_file == 'y':
                    try:
                        import webbrowser
                        webbrowser.open(f"file:///{output_path}")
                    except Exception as e:
                        print(f"Could not open file automatically: {e}")
                        print(f"Please open manually: {output_path}")
            except KeyboardInterrupt:
                print("\nOperation cancelled by user.")
                continue
            except Exception as e:
                print(f"\nAn error occurred while generating SEO meta tags: {e}")
                continue
        
        # Handle full website optimization
        if choice == "7":
            try:
                print("\n🚀 Starting full website optimization...\n")
                
                # 1. Ask for quality and resize settings for WebP conversion
                quality = int(input("\nEnter WebP quality (1-100, default 85): ") or "85")
                quality = max(1, min(100, quality))
                
                # Ask about separate output directory
                use_output_dir = input("\nSave optimized images to a separate directory? (y/n, default: n): ").lower()
                output_directory = None
                if use_output_dir == 'y':
                    output_dir_name = input("Enter output directory name (default: optimized_assets): ").strip() or "optimized_assets"
                    output_directory = os.path.join(source_directory, output_dir_name)
                    print(f"Optimized images will be saved to: {output_directory}")
                
                # Set default resize dimensions for large images (max width 1920px)
                resize_dimensions = (1920, 1080)
                print("\nLarge images will be resized to maximum width of 1920px while preserving aspect ratio.")
                
                # Ask about lossless mode for PNGs
                lossless = True
                print("PNGs with transparency will use lossless compression to preserve quality.")
                
                # 2. Convert images to WebP
                print("\nStep 1: Converting images to WebP format...")
                convert_to_webp(source_directory, quality, resize_dimensions, lossless, output_directory)
                
                # 3. Generate HTML image tags reference
                print("\nStep 2: Generating HTML image tags with proper dimensions...")
                generate_html_image_tags(source_directory if not output_directory else output_directory)
                
                # 4. Generate JSON-LD structured data
                print("\nStep 3: Generating JSON-LD structured data...")
                site_url = input("\nEnter your website URL (default: https://www.alfax10.com): ").strip() or "https://www.alfax10.com"
                if site_url.endswith("/"):
                    site_url = site_url[:-1]
                generate_json_ld(site_url)
                
                # 5. Generate .htaccess file
                print("\nStep 4: Generating .htaccess file...")
                generate_htaccess()
                
                # 6. Minify CSS and JS files
                print("\nStep 5: Minifying CSS and JS files...")
                minify_assets(source_directory)
                
                # 7. Generate SEO meta tags
                print("\nStep 6: Generating SEO meta tags...")
                site_title = "AlfaX10 - Mobile Apps, Websites & Custom Software"
                site_description = "AlfaX10 specializes in mobile app development, website design, and custom software solutions"
                generate_seo_meta_tags(site_title, site_description, site_url)
                
                print("\n✅ Full website optimization complete!")
                print("Review the generated files and implement the changes on your website.")
                
            except KeyboardInterrupt:
                print("\nOperation cancelled by user.")
                continue
            except Exception as e:
                print(f"\nAn error occurred during full website optimization: {e}")
                continue
        
        if choice not in ["1", "2", "3", "4", "5", "6", "7", "8"]:
            print("\nInvalid choice. Please enter a number between 1 and 8.")
            
        # Ask if user wants to perform another operation
        if choice in ["1", "2", "3", "4", "5", "6", "7"]:
            another = input("\nWould you like to perform another operation? (y/n): ")
            if another.lower() != 'y':
                print("\nThank you for using the AlfaX10 Website Optimization Tool!")
                break
