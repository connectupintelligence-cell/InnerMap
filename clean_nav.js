const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// Remove remaining references to navLib and mLib
const lines = appJs.split('\n');
const filtered = lines.filter(line => !line.includes('navLib') && !line.includes('mLib'));

// Make sure updateActiveNav isn't lingering somewhere
appJs = filtered.join('\n');
appJs = appJs.replace(/updateActiveNav/g, 'switchTab');

fs.writeFileSync('app.js', appJs);
console.log('Fixed app.js');
