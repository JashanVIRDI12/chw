const fs = require('fs');
const path = require('path');
const dir = '/Users/mac/Documents/GitHub/chw';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Facebook link
  content = content.replace(
    /<a href="[^"]*" class="social-link"><i class="fab fa-facebook-f"><\/i><\/a>/g,
    '<a href="https://www.facebook.com/share/1DoPvFjgJA/?mibextid=wwXIfr" target="_blank" class="social-link"><i class="fab fa-facebook-f"></i></a>'
  );

  // Update Instagram link
  content = content.replace(
    /<a href="[^"]*" class="social-link"><i class="fab fa-instagram"><\/i><\/a>/g,
    '<a href="https://www.instagram.com/chase_healthcare?igsh=MWQ0ZHkzMHdtZnlpdA==" target="_blank" class="social-link"><i class="fab fa-instagram"></i></a>'
  );

  // Insert phone number after social-links end if not already present
  if (!content.includes('>+91 95603 69222<')) {
    content = content.replace(
        /(<div class="social-links">[\s\S]*?<\/div>)/,
        '$1\n                <p style="margin-top: 1rem; color: rgba(255, 255, 255, 0.7);"><i class="fas fa-phone-alt" style="margin-right: 0.5rem;"></i> +91 95603 69222</p>'
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Update complete');
