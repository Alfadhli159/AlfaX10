# CSS and JavaScript Minifier Script
# This script requires Node.js and the following packages:
# npm install terser clean-css-cli

import os
import subprocess
import re
from datetime import datetime

def check_requirements():
    """Check if Node.js and required packages are installed"""
    try:
        # Check if Node.js is installed
        subprocess.run(['node', '--version'], check=True, stdout=subprocess.PIPE)
        
        # Check if terser is installed
        subprocess.run(['npx', 'terser', '--version'], check=True, stdout=subprocess.PIPE)
        
        # Check if clean-css-cli is installed
        subprocess.run(['npx', 'cleancss', '--version'], check=True, stdout=subprocess.PIPE)
        
        return True
    except subprocess.CalledProcessError:
        print("Error: Node.js, terser, or clean-css-cli is not installed.")
        print("Please install the required dependencies:")
        print("1. Install Node.js from https://nodejs.org/")
        print("2. Install packages with: npm install -g terser clean-css-cli")
        return False
    except FileNotFoundError:
        print("Error: Node.js is not installed or not in PATH.")
        print("Please install Node.js from https://nodejs.org/")
        return False

def minify_js(js_file, output_file=None):
    """Minify a JavaScript file"""
    if output_file is None:
        # Generate minified filename (e.g., script.js -> script.min.js)
        filename, ext = os.path.splitext(js_file)
        output_file = f"{filename}.min{ext}"
    
    print(f"Minifying {js_file} -> {output_file}")
    
    try:
        # Read the original file to extract any header comments
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract header comments (if any)
        header_comments = ""
        header_match = re.search(r'^(/\*\*[\s\S]*?\*/)[\s\S]*', content)
        if header_match:
            header_comments = header_match.group(1)
        
        # Add timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if header_comments:
            header_comments += f"\n/* Minified on {timestamp} */\n"
        else:
            header_comments = f"/* {os.path.basename(js_file)} | Minified on {timestamp} */\n"
        
        # Run terser to minify the JavaScript
        result = subprocess.run(
            ['npx', 'terser', js_file, '--compress', '--mangle'],
            check=True,
            stdout=subprocess.PIPE,
            text=True
        )
        
        # Write the minified content with the header comments
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(header_comments + result.stdout)
        
        # Get file sizes for reporting
        original_size = os.path.getsize(js_file)
        minified_size = os.path.getsize(output_file)
        reduction = (1 - minified_size / original_size) * 100
        
        print(f"✓ JS Minification complete: {original_size:,} bytes → {minified_size:,} bytes ({reduction:.1f}% reduction)")
        return True
    
    except Exception as e:
        print(f"× Error minifying {js_file}: {e}")
        return False

def minify_css(css_file, output_file=None):
    """Minify a CSS file"""
    if output_file is None:
        # Generate minified filename (e.g., style.css -> style.min.css)
        filename, ext = os.path.splitext(css_file)
        output_file = f"{filename}.min{ext}"
    
    print(f"Minifying {css_file} -> {output_file}")
    
    try:
        # Read the original file to extract any header comments
        with open(css_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract header comments (if any)
        header_comments = ""
        header_match = re.search(r'^(/\*[\s\S]*?\*/)[\s\S]*', content)
        if header_match:
            header_comments = header_match.group(1)
        
        # Add timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if header_comments:
            header_comments += f"\n/* Minified on {timestamp} */\n"
        else:
            header_comments = f"/* {os.path.basename(css_file)} | Minified on {timestamp} */\n"
        
        # Run clean-css to minify the CSS
        result = subprocess.run(
            ['npx', 'cleancss', '-O2', css_file],
            check=True,
            stdout=subprocess.PIPE,
            text=True
        )
        
        # Write the minified content with the header comments
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(header_comments + result.stdout)
        
        # Get file sizes for reporting
        original_size = os.path.getsize(css_file)
        minified_size = os.path.getsize(output_file)
        reduction = (1 - minified_size / original_size) * 100
        
        print(f"✓ CSS Minification complete: {original_size:,} bytes → {minified_size:,} bytes ({reduction:.1f}% reduction)")
        return True
    
    except Exception as e:
        print(f"× Error minifying {css_file}: {e}")
        return False

def process_directory(directory):
    """Process all JS and CSS files in a directory"""
    js_files = [f for f in os.listdir(directory) if f.endswith('.js') and not f.endswith('.min.js')]
    css_files = [f for f in os.listdir(directory) if f.endswith('.css') and not f.endswith('.min.css')]
    
    print(f"Found {len(js_files)} JavaScript files and {len(css_files)} CSS files to minify.")
    
    js_success = 0
    css_success = 0
    
    for js_file in js_files:
        if minify_js(os.path.join(directory, js_file)):
            js_success += 1
    
    for css_file in css_files:
        if minify_css(os.path.join(directory, css_file)):
            css_success += 1
    
    print(f"\nSummary: Successfully minified {js_success}/{len(js_files)} JS files and {css_success}/{len(css_files)} CSS files.")
    
    # Ask if user wants to update HTML files to reference minified versions
    if js_success > 0 or css_success > 0:
        update_html = input("\nDo you want to update HTML files to reference minified versions? (y/n): ")
        if update_html.lower() == 'y':
            update_html_references(directory)

def update_html_references(directory):
    """Update HTML files to reference minified CSS and JS files"""
    html_files = [f for f in os.listdir(directory) if f.endswith('.html')]
    
    if not html_files:
        print("No HTML files found.")
        return
    
    print(f"Found {len(html_files)} HTML files to update.")
    
    for html_file in html_files:
        html_path = os.path.join(directory, html_file)
        print(f"Processing {html_file}...")
        
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace CSS references
            css_replacements = 0
            for css_match in re.finditer(r'<link\s+[^>]*href=["\'](.*?\.css)["\'][^>]*>', content):
                css_file = css_match.group(1)
                if '.min.css' not in css_file:
                    min_css = css_file.replace('.css', '.min.css')
                    if os.path.exists(os.path.join(directory, min_css.lstrip('/'))):
                        content = content.replace(css_file, min_css)
                        css_replacements += 1
            
            # Replace JS references
            js_replacements = 0
            for js_match in re.finditer(r'<script\s+[^>]*src=["\'](.*?\.js)["\'][^>]*>', content):
                js_file = js_match.group(1)
                if '.min.js' not in js_file:
                    min_js = js_file.replace('.js', '.min.js')
                    if os.path.exists(os.path.join(directory, min_js.lstrip('/'))):
                        content = content.replace(js_file, min_js)
                        js_replacements += 1
            
            # Write updated content back to file
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  ✓ Updated {html_file}: {css_replacements} CSS and {js_replacements} JS references")
        
        except Exception as e:
            print(f"  × Error updating {html_file}: {e}")

if __name__ == "__main__":
    print("CSS and JavaScript Minifier")
    print("==========================")
    
    if not check_requirements():
        exit(1)
    
    # Ask for directory path (default to current directory)
    directory = input("Enter directory path (press Enter for current directory): ") or "."
    
    if os.path.isdir(directory):
        process_directory(directory)
    else:
        print(f"Error: '{directory}' is not a valid directory.")
