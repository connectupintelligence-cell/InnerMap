const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Fix state.isHereditary assignments
appJs = appJs.replace(
    /state\.isHereditary = state\.selectedMode === 3 \? false : true;/g,
    'state.isHereditary = (state.selectedMode === 2);'
);

appJs = appJs.replace(
    /state\.isHereditary = true;/g,
    'state.isHereditary = (state.selectedMode === 2);'
);

// 2. Fix the "(que recebi ou recebido)"
appJs = appJs.replace(
    /que recebi ou recebido/g,
    'que recebi'
);

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=155');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=155');
fs.writeFileSync('index.html', html);

console.log('Fixed isHereditary logic and grammar');
