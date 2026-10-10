const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

appJs = appJs.replace(
    'const libraryContainer = document.getElementById("library-container");\n    if (libraryContainer && !libraryContainer.dataset.deleteBound) {\n        libraryContainer.dataset.deleteBound = "true";\n        libraryContainer.addEventListener("click", async (e) => {',
    'const libContEl = document.getElementById("library-container");\n    if (libContEl && !libContEl.dataset.deleteBound) {\n        libContEl.dataset.deleteBound = "true";\n        libContEl.addEventListener("click", async (e) => {'
);

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=157');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=157');
fs.writeFileSync('index.html', html);

console.log('Fixed ReferenceError in renderLibrary');
