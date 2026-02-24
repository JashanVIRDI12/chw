# Chase Healthcare & Wellness Premium WordPress Theme

A luxury, modern WordPress theme designed specifically for **Chase Healthcare & Wellness Pvt Ltd** - delivering "Care Beyond Cure."

## Theme Features

### 🎨 **Premium Design**
- Modern, luxury healthcare aesthetic
- Professional color palette (Teal, Gold accents)
- Responsive design for all devices
- Smooth animations and transitions
- Glassmorphism effects
- Premium typography (Inter + Playfair Display)

### 📱 **Fully Responsive**
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly navigation
- Adaptive layouts

### ⚡ **Performance Optimized**
- Clean, semantic HTML5
- Optimized CSS with CSS variables
- Minimal JavaScript
- Fast loading times
- SEO-friendly structure

### 🔧 **WordPress Features**
- Custom page templates
- Widget-ready footer (4 widget areas)
- Custom post types (Products, Testimonials)
- Custom navigation menus
- Contact form integration
- Custom logo support

## Installation Instructions

### 1. **Upload Theme**
```bash
# Option A: Upload via WordPress Admin
1. Go to Appearance > Themes > Add New
2. Click "Upload Theme"
3. Choose the theme ZIP file
4. Click "Install Now"

# Option B: Upload via FTP
1. Upload the theme folder to /wp-content/themes/
2. Go to Appearance > Themes in WordPress admin
3. Activate "Chase Healthcare Premium"
```

### 2. **Create Required Pages**
Create the following pages and assign the appropriate templates:

**Pages to Create:**
1. **Home** (Template: Home Page)
2. **About Us** (Template: About Us)
3. **Contact Us** (Template: Contact Us)
4. **FAQs** (Template: FAQs)
5. Surgical Products
6. Vitantra
7. Quality Assurance
8. Industries We Serve
9. Downloads
10. News & Insights
11. Privacy Policy
12. Terms & Conditions

**How to assign templates:**
1. Edit the page in WordPress
2. Look for "Page Attributes" or "Template" in the sidebar
3. Select the appropriate template
4. Click "Update"

### 3. **Set Homepage**
```
1. Go to Settings > Reading
2. Select "A static page" under "Your homepage displays"
3. Choose "Home" as your Homepage
4. Save changes
```

### 4. **Configure Navigation Menu**
```
1. Go to Appearance > Menus
2. Create a new menu called "Primary Menu"
3. Add pages:
   - Home
   - About Us
   - Surgical Products
   - Vitantra (Ayurvedic Products)
   - Quality Assurance
   - Industries We Serve
   - Downloads
   - News & Insights
   - FAQs
   - Contact Us
4. Assign to "Primary Menu" location
5. Save menu
```

### 5. **Add Your Logo**
```
1. Go to Appearance > Customize
2. Click "Site Identity"
3. Upload your logo
4. Recommended size: 200x80px (transparent PNG)
```

### 6. **Update Contact Information**
Edit `footer.php` and `template-contact.php` to add:
- Office address
- Phone number
- Email address
- Social media links

### 7. **Configure Footer Widgets** (Optional)
```
1. Go to Appearance > Widgets
2. Add widgets to Footer Widget Area 1-4
3. Suggested widgets:
   - About Text
   - Recent Posts
   - Custom Menu
   - Contact Info
```

## Page Templates

### **template-home.php** - Homepage
- Hero section with tagline
- Product verticals (Chase & Vitantra)
- Why Choose Us section
- Industries We Serve
- Call-to-action sections

### **template-about.php** - About Us
- Company story
- Mission, Vision, Values
- Why Choose Us features

### **template-contact.php** - Contact Page
- Contact information cards
- Business enquiry form
- Social media links
- Form submission handling

### **template-faqs.php** - FAQs
- Expandable FAQ accordion
- Surgical Products FAQs
- Vitantra Products FAQs

## Customization

### **Colors**
Edit CSS variables in `style.css`:
```css
:root {
    --primary-teal: #006B7D;
    --accent-gold: #D4AF37;
    /* Modify as needed */
}
```

### **Fonts**
Current fonts:
- **Headings:** Playfair Display
- **Body:** Inter

To change fonts, update the Google Fonts import in `style.css`

### **Adding New Pages**
1. Create a new PHP file: `template-yourpage.php`
2. Add template header:
```php
<?php
/**
 * Template Name: Your Page Name
 */
get_header();
?>
<!-- Your content here -->
<?php get_footer(); ?>
```

## Content Sections

### **Brands**
1. **Chase Healthcare & Wellness** - Surgical & Medical Products
   - Tagline: "Care Beyond Cure"
   - Color: Teal (#006B7D)

2. **Vitantra** - Ayurvedic, Herbal & Nutraceuticals
   - Tagline: "Healing from Nature"
   - Color: Green (#28A745)

### **Key Features**
- WHO-GMP Certified
- ISO Compliant
- Ethical Manufacturing
- Wide Product Portfolio
- Strong Distribution Network

## Support & Documentation

### **Theme Structure**
```
chase-healthcare-theme/
├── style.css           # Main stylesheet & theme info
├── functions.php       # Theme functions
├── header.php         # Header template
├── footer.php         # Footer template
├── index.php          # Main template (fallback)
├── template-home.php  # Homepage template
├── template-about.php # About page template
├── template-contact.php # Contact page template
├── template-faqs.php  # FAQs template
└── js/
    └── main.js        # JavaScript functionality
```

### **Contact Form**
The contact form is handled via WordPress admin-post.php. Submissions are emailed to the admin email address set in WordPress settings.

### **Required Plugins**
None required! Theme works out of the box.

**Recommended Plugins:**
- Yoast SEO (for better SEO)
- Contact Form 7 (alternative contact forms)
- Advanced Custom Fields (for custom fields)

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Credits
- **Fonts:** Google Fonts (Inter, Playfair Display)
- **Icons:** Font Awesome 6.4.0
- **Design:** Custom luxury healthcare theme

## Version History
- **1.0.0** - Initial release

## License
This theme is proprietary and created specifically for Chase Healthcare & Wellness Pvt Ltd.

---

**Developed with ❤️ for Chase Healthcare & Wellness**  
*Care Beyond Cure*
