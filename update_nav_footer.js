const fs = require('fs');
const path = require('path');
const dir = '/Users/mac/Documents/GitHub/chw';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldNav = `<a href="catalog.html">Catalogue</a>`;
const newNav = `<div class="nav-dropdown">
                    <a href="#" class="nav-dropdown-trigger">More <i class="fas fa-chevron-down"></i></a>
                    <div class="nav-dropdown-menu">
                        <a href="catalog.html" class="nav-dropdown-item">
                            <div class="nav-dropdown-icon chw-dd"><i class="fas fa-book-open"></i></div>
                            <div class="nav-dropdown-text"><span>Catalogue</span><small>Download product catalogue</small></div>
                        </a>
                        <a href="exhibitions.html" class="nav-dropdown-item">
                            <div class="nav-dropdown-icon vitantra-dd"><i class="fas fa-calendar-alt"></i></div>
                            <div class="nav-dropdown-text"><span>Exhibitions</span><small>Our upcoming events</small></div>
                        </a>
                    </div>
                </div>`;

const oldFooterLink = `<li><a href="contact.html">Contact</a></li>`;
const newFooterLink = `<li><a href="exhibitions.html">Exhibitions</a></li>
                    <li><a href="contact.html">Contact</a></li>`;

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes(oldNav)) {
    content = content.replace(oldNav, newNav);
    changed = true;
  }
  
  if (content.includes(oldFooterLink) && !content.includes('<li><a href="exhibitions.html">Exhibitions</a></li>')) {
    // Only replace the first occurrence in Company column. Wait, is there another contact.html link? 
    // Usually it's `<li><a href="contact.html">Contact</a></li>`. Let's just do replace which replaces first occurrence.
    content = content.replace(oldFooterLink, newFooterLink);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Updated ${file}`);
  }
}
console.log(`Updated ${updatedCount} files.`);
