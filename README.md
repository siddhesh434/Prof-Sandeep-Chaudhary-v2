# Sustainable Construction Lab Website

A dynamic website for the SCORE (Sustainable Construction Research) Group led by Prof. Sandeep Chaudhary at IIT Indore, showcasing research work, publications, and project updates.

## Overview

This project is a full-stack web application built using Node.js, Express, and MongoDB, with EJS templating for server-side rendering. The site provides a comprehensive platform for the research lab to share their work, publications, and achievements with an intuitive admin panel for content management.

## Features

- **Dynamic Content Management**: Full CRUD operations for managing publications, projects, patents, and more
- **Admin Panel**: Secure dashboard for content updates without technical knowledge
- **Responsive Design**: Mobile-friendly interface optimized for all devices
- **SEO Optimization**: Built-in SEO features including sitemap and meta tags
- **File Storage System**: Organize and store research papers and documents
- **Publication Management**: Categorized by year with journal impact factors
- **Research Showcase**: Highlight ongoing research, facilities, and lab members

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Frontend**: EJS templates, CSS, JavaScript
- **Authentication**: Express-session with MongoDB store
- **Storage**: File storage with Multer
- **Deployment**: Microsoft Azure with GoDaddy domain integration

## API Endpoints

The website includes several RESTful API endpoints for managing content:

### Publications
- `GET /publications` - Get all publications
- `GET /publications/:id` - Get publication by ID
- `POST /publications` - Create new publication
- `PUT /publications/:id` - Update publication
- `DELETE /publications/:id` - Delete publication

Similar endpoints exist for projects, patents, dissertations, and other content types.

## Admin Panel

The admin panel allows authorized users to:
- Add/edit/delete publications, projects, and other research content
- Upload and manage files and documents
- Update lab member information
- Manage extension activities and collaborations

## Deployment

The website is deployed on Microsoft Azure with domain setup via GoDaddy. Deployment steps:

1. Set up Azure Web App Service
2. Configure continuous deployment from Git repository
3. Set up environment variables in Azure
4. Connect custom domain from GoDaddy to Azure Web App

## SEO Features

- Optimized meta tags for search engines
- Custom robots.txt and sitemap.xml
- Google site verification
- Semantic HTML for better indexing

## Future Enhancements

- Integration with academic APIs (Google Scholar, Scopus)
- Advanced search functionality for publications
- Citation export features
- User analytics dashboard

## Contributors

- [Your Name](https://github.com/yourusername) - Lead Developer

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Prof. Sandeep Chaudhary for project guidance
- IIT Indore for institutional support
