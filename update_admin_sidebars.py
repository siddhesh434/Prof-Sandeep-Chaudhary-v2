import os
import re

# Define the admin pages that need updating (excluding already updated ones)
pages_to_update = [
    'book.ejs',
    'chapters.ejs',
    'projects.ejs',
    'patents.ejs',
    'researchMembers.ejs',
    'keyTechnology.ejs',
    'facilities.ejs',
    'extension.ejs',
    'eResources.ejs',
    'dissertations.ejs',
    'latest_news.ejs',
    'homeHighlights.ejs',
    'control.ejs',
    'cvGenerator.ejs',
    'files.ejs',
    'formData.ejs'
]

base_path = r'c:\Users\Hp\Desktop\Projects\sandeep sir\Prof-Sandeep-Chaudhary-v2\views\admin'

# Pattern to match the old sidebar (from <aside id="sidebar" to </aside>)
sidebar_pattern = re.compile(
    r'(\s*<!-- Sidebar.*?-->.*?<aside id="sidebar".*?</aside>)',
    re.DOTALL
)

def update_admin_page(filename):
    """Update a single admin page with new sidebar"""
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Determine the current page path
    page_path = f'/admin/{filename.replace(".ejs", ".html")}'
    
    # New sidebar include
    new_sidebar = f'''    <!-- New Collapsible Sidebar -->
    <%- include('../partials/admin-sidebar', {{ adminID: 'admin123', currentPage: '{page_path}' }}) %>'''
    
    # Replace the old sidebar
    updated_content = sidebar_pattern.sub(new_sidebar, content)
    
    if updated_content == content:
        print(f"No changes made to {filename} - pattern not found")
        return False
    
    # Write the updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"✓ Updated {filename}")
    return True

def main():
    """Update all admin pages"""
    print("Starting batch update of admin pages...")
    print(f"Total pages to update: {len(pages_to_update)}\n")
    
    updated_count = 0
    failed_count = 0
    
    for page in pages_to_update:
        if update_admin_page(page):
            updated_count += 1
        else:
            failed_count += 1
    
    print(f"\n{'='*50}")
    print(f"Update complete!")
    print(f"Successfully updated: {updated_count}")
    print(f"Failed: {failed_count}")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
