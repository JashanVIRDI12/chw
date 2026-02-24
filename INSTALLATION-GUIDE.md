# Chase Healthcare Theme - Quick Installation Guide

## Option 1: Already Viewing! ✅
You already have `preview.html` open in your browser - this IS your theme working!
- No WordPress needed
- Fully functional
- Can be customized directly

---

## Option 2: Install on WordPress

### Prerequisites:
- WordPress installed (local or live server)
- Admin access to WordPress

### Installation Steps:

#### **Step 1: Create Theme ZIP**
```bash
cd /Users/mac/Desktop
zip -r chase-healthcare-theme.zip chase-healthcare-theme -x "*.DS_Store" -x "preview.html"
```

#### **Step 2: Install via WordPress Admin**
1. Log into WordPress Admin
2. Go to **Appearance → Themes**
3. Click **Add New** button
4. Click **Upload Theme** button
5. Click **Choose File** and select `chase-healthcare-theme.zip`
6. Click **Install Now**
7. Click **Activate**

#### **Step 3: Create Pages**
Create these pages with their templates:

**Homepage:**
- Pages → Add New
- Title: "Home"
- Template: Select "Home Page" from Template dropdown
- Publish

**Other Pages:**
- About Us (Template: About Us)
- Contact Us (Template: Contact Us)
- FAQs (Template: FAQs)
- Quality Assurance (Template: Quality Assurance)
- Downloads (Template: Downloads)

#### **Step 4: Set Homepage**
1. Settings → Reading
2. Select "A static page" 
3. Homepage: Select "Home"
4. Save Changes

#### **Step 5: Configure Navigation**
1. Appearance → Menus
2. Create menu: "Primary Menu"
3. Add pages to menu
4. Assign to "Primary Menu" location
5. Save Menu

---

## Option 3: Use as Static HTML Site (No WordPress)

### What You Already Have:
The `preview.html` file in your theme folder is a complete website!

### To Deploy:
1. **Upload to web server:**
   - Upload entire `chase-healthcare-theme` folder
   - Point domain to `preview.html`

2. **Use GitHub Pages (Free):**
   ```bash
   cd /Users/mac/Desktop/chase-healthcare-theme
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub, then:
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   # Enable GitHub Pages in repo settings
   ```

3. **Use Netlify (Free):**
   - Drag and drop `chase-healthcare-theme` folder to netlify.com
   - Set `preview.html` as homepage
   - Done!

---

## Quick Test on Local WordPress

### Using MAMP/XAMPP (Mac):

1. **Install MAMP** (if you don't have it):
   - Download from mamp.info
   - Install and start servers

2. **Install WordPress:**
   - Download WordPress from wordpress.org
   - Extract to `/Applications/MAMP/htdocs/chasehealthcare`
   - Visit `http://localhost:8888/chasehealthcare`
   - Follow WordPress installation

3. **Install Theme:**
   - Copy theme folder to `/Applications/MAMP/htdocs/chasehealthcare/wp-content/themes/`
   - Activate in WordPress admin

### Using Local by Flywheel (Easiest):

1. **Download Local** (free):
   - localwp.com
   - Install Local app

2. **Create New Site:**
   - Click "+" to create site
   - Name: "Chase Healthcare"
   - Choose preferred settings
   - Wait for setup

3. **Install Theme:**
   - Click "Admin" to open WordPress
   - Go to Appearance → Themes → Add New → Upload
   - Upload your theme ZIP
   - Activate

---

## Customization Tips

### Update Contact Info:
Edit these files:
- `footer.php` - Footer contact details
- `template-contact.php` - Contact page info

### Change Colors:
Edit `style.css` at the top:
```css
:root {
    --primary-teal: #006B7D;  /* Change this */
    --accent-gold: #D4AF37;   /* And this */
}
```

### Add Your Logo:
- WordPress: Appearance → Customize → Site Identity
- HTML: Replace text in `preview.html` header with `<img>` tag

---

## Support

**Theme Files Location:** `/Users/mac/Desktop/chase-healthcare-theme`

**Preview URL:** `file:///Users/mac/Desktop/chase-healthcare-theme/preview.html`

**Need Help?** 
- Check README.md for detailed documentation
- All template files are well-commented
- CSS uses clear variable names

---

## What's Already Working:

✅ Responsive design (mobile, tablet, desktop)  
✅ Smooth animations and transitions  
✅ Interactive navigation with mobile menu  
✅ FAQ accordion functionality  
✅ Contact form (WordPress only)  
✅ Back to top button  
✅ Hover effects on cards  
✅ SEO-friendly HTML structure  

**You're ready to go! 🚀**
