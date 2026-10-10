const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace('["Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7"]', '["Dia 1 - VIDRO", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7"]');
fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/v130/g, 'v131');
fs.writeFileSync('index.html', html);
