const fs = require('fs');
const path = require('path');
const dir = '/Users/mac/Documents/GitHub/chw';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const footerContent = `
                <div class="social-links">
                    <a href="https://www.facebook.com/share/1DoPvFjgJA/?mibextid=wwXIfr" target="_blank" class="social-link"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://www.instagram.com/chase_healthcare?igsh=MWQ0ZHkzMHdtZnlpdA==" target="_blank" class="social-link"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
                </div>
                <p style="margin-top: 1rem; color: rgba(255, 255, 255, 0.7);"><i class="fas fa-phone-alt" style="margin-right: 0.5rem;"></i> +91 95603 69222</p>`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix contact page specifically
  if (file === 'contact.html') {
    content = content.replace(
      /<a href="[^"]*" class="contact-social-link" aria-label="Facebook">\s*<i\s*class="fab fa-facebook-f"><\/i><\/a>/g,
      '<a href="https://www.facebook.com/share/1DoPvFjgJA/?mibextid=wwXIfr" target="_blank" class="contact-social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>'
    );
    content = content.replace(
      /<a href="[^"]*" class="contact-social-link" aria-label="Instagram">\s*<i\s*class="fab fa-instagram"><\/i><\/a>/g,
      '<a href="https://www.instagram.com/chase_healthcare?igsh=MWQ0ZHkzMHdtZnlpdA==" target="_blank" class="contact-social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>'
    );
  }

  // Remove the block if it already exists to avoid duplicates
  content = content.replace(/<div class="social-links">[\s\S]*?<\/div>\s*/g, '');
  content = content.replace(/<p style="margin-top: 1rem; color: rgba\(255, 255, 255, 0\.7\);"><i class="fas fa-phone-alt" style="margin-right: 0\.5rem;"><\/i> \+91 95603 69222<\/p>\s*/g, '');

  const marker = '<p>Your trusted partner in Ayurvedic, Herbal, and Surgical healthcare solutions.</p>';
  if (content.includes(marker)) {
      const lastIndex = content.lastIndexOf(marker);
      content = content.slice(0, lastIndex + marker.length) + "\n" + footerContent + "\n" + content.slice(lastIndex + marker.length);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log("Done");
