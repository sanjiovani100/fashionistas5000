# Website Pages Database Structure

## Overview
This document outlines how to structure the content for the website's main pages in Supabase. We recommend using a hybrid approach with a main pages table for common content and specialized tables for section-specific data.

## Main Pages Table
A central table to manage core page content and metadata. This should store:

### Common Page Elements
- Page identifier/slug (e.g., 'home', 'about')
- Page title
- Meta description
- Meta keywords
- Last updated timestamp
- Publishing status
- Page order/priority
- Cache settings
- Access permissions
- Version history

### Content Blocks
Rather than storing all content in one field, break it into logical blocks:
- Hero section content
- Main content sections
- Sidebar content
- Footer content
- Custom scripts
- Custom styles

## Specialized Content Tables

### Home Page Content
Separate tables for dynamic home page elements:
- Featured Events Table
  - Event highlights
  - Promotional content
  - Call-to-action buttons
  - Featured images
  - Priority ordering

- News & Updates Table
  - Announcements
  - Latest news
  - Upcoming events
  - Publication dates
  - Display duration

### About Page Content
Dedicated table for about page specific content:
- Company history
- Team member profiles
- Mission statements
- Vision statements
- Company values
- Achievements
- Timeline events
- Office locations

### Sponsors Page Content
Multiple tables for sponsor management:
- Sponsor Profiles
  - Company details
  - Logo assets
  - Contact information
  - Partnership level
  - Active status

- Sponsorship Packages
  - Package details
  - Benefits list
  - Pricing information
  - Availability status
  - Terms and conditions

### Designers Page Content
Specialized tables for designer information:
- Designer Profiles
  - Biography
  - Portfolio images
  - Collections
  - Awards
  - Social media links
  - Show history

- Designer Collections
  - Collection details
  - Season information
  - Gallery images
  - Launch dates
  - Showcase events

### Models Page Content
Dedicated tables for model information:
- Model Profiles
  - Portfolio images
  - Biography
  - Statistics
  - Experience
  - Availability

- Model Categories
  - Specializations
  - Show types
  - Experience levels
  - Booking rates

### Contact Page Content
Tables for managing contact information:
- Contact Forms
  - Form fields
  - Validation rules
  - Submission routing
  - Auto-response settings

- Office Locations
  - Address details
  - Contact numbers
  - Operating hours
  - Map coordinates

## Content Management Features

### Version Control
Track content changes with:
- Change history
- Author information
- Revision notes
- Rollback points
- Publication status

### Media Management
Organize media assets with:
- Image galleries
- Video content
- Document libraries
- Asset categories
- Usage tracking

### SEO Management
Track SEO elements including:
- Page metadata
- URL structures
- Sitemap data
- Redirect rules
- Search keywords

## Integration Considerations

### Social Media
Manage social integration with:
- Social feed displays
- Share buttons
- Social metrics
- Platform connections

### Analytics
Track page performance with:
- View counts
- User engagement
- Conversion tracking
- A/B test results
- Performance metrics

## Security and Access Control

### User Permissions
Manage content access with:
- Role-based access
- Edit permissions
- Approval workflows
- Content restrictions
- User tracking

### Content Protection
Secure sensitive content with:
- Access controls
- Content encryption
- Download restrictions
- Watermarking
- Usage tracking

## Best Practices

### Content Organization
- Use consistent structure across pages
- Implement clear content hierarchies
- Maintain content relationships
- Enable easy content updates
- Support multiple languages

### Performance
- Implement efficient caching
- Optimize media delivery
- Manage content size
- Monitor load times
- Enable CDN support

### Maintenance
- Regular content audits
- Backup procedures
- Archive strategies
- Update workflows
- Quality checks

Remember: This structure allows for flexible content management while maintaining consistency across the site. Use Supabase's row-level security to control access to different content types and implement proper backup procedures for all content. 