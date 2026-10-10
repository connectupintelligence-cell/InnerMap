const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// Replace switchTab for mAgenda
appJs = appJs.replace(/switchTab\(mAgenda, sectionAgenda\);/g, 'switchTab(mAgenda, sectionAgenda);\n            renderLibrary();\n            renderStats();');

// Remove mLib listener entirely
appJs = appJs.replace(/if \(mLib\) \{[\s\S]*?\}\s*/, '');

fs.writeFileSync('app.js', appJs);
console.log('Done.');
