const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

appJs = appJs.replace(/llama-3\.3-70b-versatile/g, 'llama-3.1-70b-versatile');

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=161');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=161');
fs.writeFileSync('index.html', html);

console.log("Downgraded Groq model to llama-3.1-70b-versatile");
