# Guide to Making Static Changes to the Website

This guide will help you make basic static changes to the website without needing to understand the backend code. The website is built using HTML, CSS, and JavaScript, and this guide will show you how to modify the content safely.

## Table of Contents

1. [File Structure](#file-structure)
2. [Making Text Changes](#making-text-changes)
3. [Updating Images](#updating-images)
4. [Modifying Links](#modifying-links)
5. [Changing Styles](#changing-styles)
6. [Common Tasks](#common-tasks)
7. [Best Practices](#best-practices)

## File Structure

The main files you'll need to work with are located in these directories:

- `/views` - Contains all the HTML templates
- `/public` - Contains static assets like images, CSS, and JavaScript files
  - `/public/css` - CSS files
  - `/public/js` - JavaScript files
  - `/public/images` - Image files

## Making Text Changes

### 1. Changing Page Content

1. Navigate to the `/views` folder
2. Find the HTML file you want to edit (e.g., `index.ejs`, `aboutPI.ejs`)
3. Open the file in a text editor
4. Look for the text you want to change
5. Make your changes
6. Save the file

Example:

```html
<!-- Before -->
<h1>Welcome to Our Research Lab</h1>

<!-- After -->
<h1>Welcome to Our Advanced Research Laboratory</h1>
```

### 2. Changing Navigation Text

1. Open `/views/partials/header.ejs`
2. Find the navigation menu section
3. Edit the text between `<a>` tags
4. Save the file

Example:

```html
<!-- Before -->
<a href="/aboutPI.html">About PI</a>

<!-- After -->
<a href="/aboutPI.html">About Principal Investigator</a>
```

## Updating Images

### 1. Adding New Images

1. Place your new image in the `/public/images` folder
2. Use a descriptive name (e.g., `research-lab-2024.jpg`)
3. Recommended image formats: JPG, PNG, WebP
4. Recommended image size: 1920x1080px or smaller

### 2. Changing Existing Images

1. Find the image in `/public/images`
2. Replace the old image with your new image
3. Keep the same filename to avoid updating HTML
4. Or update the image source in the HTML file

Example:

```html
<!-- Before -->
<img src="/images/old-lab.jpg" alt="Research Lab" />

<!-- After -->
<img src="/images/new-lab.jpg" alt="Modern Research Laboratory" />
```

## Modifying Links

### 1. Changing URLs

1. Find the link in the HTML file
2. Update the `href` attribute
3. Make sure to keep the correct path format

Example:

```html
<!-- Before -->
<a href="https://old-website.com">Visit Website</a>

<!-- After -->
<a href="https://new-website.com">Visit Our New Website</a>
```

### 2. Adding New Links

1. Add the link in the appropriate section
2. Use the correct path format:
   - For internal pages: `/page-name.html`
   - For external sites: `https://website.com`

## Changing Styles

### 1. Modifying Colors

1. Open `/public/css/style.css`
2. Find the color you want to change
3. Update the color value
4. Save the file

Example:

```css
/* Before */
.header {
  background-color: #000000;
}

/* After */
.header {
  background-color: #1a1a1a;
}
```

### 2. Changing Fonts

1. Open `/public/css/style.css`
2. Find the font-family property
3. Update the font name
4. Make sure the font is available (either system font or web font)

Example:

```css
/* Before */
body {
  font-family: Arial, sans-serif;
}

/* After */
body {
  font-family: "Roboto", Arial, sans-serif;
}
```

## Common Tasks

### 1. Updating Contact Information

1. Open `/views/contact.ejs`
2. Find the contact section
3. Update the information
4. Save the file

### 2. Changing Footer Content

1. Open `/views/partials/footer.ejs`
2. Find the section you want to modify
3. Make your changes
4. Save the file

### 3. Updating Social Media Links

1. Open `/views/partials/footer.ejs`
2. Find the social media section
3. Update the links
4. Save the file

## Best Practices

1. **Backup Before Changes**

   - Always make a backup of files before editing
   - Keep track of your changes

2. **File Naming**

   - Use lowercase letters
   - Use hyphens for spaces
   - Be descriptive but concise

3. **Image Guidelines**

   - Optimize images before uploading
   - Use appropriate file formats
   - Keep file sizes reasonable

4. **Code Formatting**

   - Maintain proper indentation
   - Keep HTML tags properly closed
   - Use consistent spacing

5. **Testing**
   - Test changes in a web browser
   - Check all links work
   - Verify images load correctly

## Need Help?

If you encounter any issues or need assistance:

1. Check the file paths are correct
2. Verify HTML syntax is valid
3. Ensure all tags are properly closed
4. Contact the developer for complex changes

Remember: Always make a backup of files before making changes, and test your changes in a web browser before deploying to production.
