const fs   = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const vars = {};

env.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) vars[key.trim()] = rest.join('=').trim();
});

const output = `const CHW_CONFIG = {
    SUPABASE_URL:  '${vars.SUPABASE_URL  || ''}',
    SUPABASE_ANON: '${vars.SUPABASE_ANON || ''}'
};
`;

fs.writeFileSync(path.join(__dirname, 'js', 'config.js'), output);
console.log('✓ js/config.js generated from .env');
