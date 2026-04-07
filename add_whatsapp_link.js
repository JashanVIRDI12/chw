const fs = require('fs');
const path = require('path');
const dir = '/Users/mac/Documents/GitHub/chw';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix contact page specific WhatsApp link
  if (file === 'contact.html') {
    content = content.replace(
      /<a href="#" class="contact-social-link" aria-label="WhatsApp">\s*<i\s*class="fab fa-whatsapp"><\/i><\/a>/g,
      '<a href="https://wa.me/919560369222" target="_blank" class="contact-social-link" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>'
    );
  }

  // Check if whatsapp is already in the footer
  if (!content.includes('fa-whatsapp"')) {
      // It's not in the footer, let's insert it after instagram in the .social-links dive
      content = content.replace(
        /(<a href="[^"]*" target="_blank" class="social-link"><i class="fab fa-instagram"><\/i><\/a>)/,
        '$1\n                    <a href="https://wa.me/919560369222" target="_blank" class="social-link"><i class="fab fa-whatsapp"></i></a>'
      );
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log("WhatsApp links added");
