const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// Change from llama-3.1-70b-versatile to llama3-70b-8192
appJs = appJs.replace(/llama-3\.1-70b-versatile/g, 'llama3-70b-8192');

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=162');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=162');
fs.writeFileSync('index.html', html);

console.log("Updated Groq model to llama3-70b-8192");
