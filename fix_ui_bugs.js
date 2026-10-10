const fs = require('fs');

// 1. Fix the timer in app.js
let appJs = fs.readFileSync('app.js', 'utf8');

// The line is: `showScreen("step3");`
// We need to replace it with: `showScreen("step3"); startPracticeTimer();`
// BUT `startPracticeTimer` is not hoisted to that scope! It's defined as `function startPracticeTimer()` later inside `initApp()`.
// Since both are inside `initApp()`, `startPracticeTimer` IS hoisted!
// Wait, function declarations inside a block (like `document.addEventListener("DOMContentLoaded", function initApp() {`) ARE hoisted to the top of that block.
// So `startPracticeTimer()` can be called. Let's just do it.

appJs = appJs.replace(
    /showScreen\("step3"\);/g,
    'showScreen("step3");\n                if (typeof startPracticeTimer === "function") startPracticeTimer();'
);

// 2. Remove "btn-ai-pular" and update "btn-ai-continuar" text
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
    /<button type="button" id="btn-ai-pular" class="btn btn-secondary"[\s\S]*?<\/button>/,
    ''
);

html = html.replace(
    /<span>Continuar com mais detalhes →<\/span>/,
    '<span>Avançar para Reorganização →</span>'
);

// We should also remove it from app.js updateContinueButtonText so it doesn't revert to "Continuar..."
// wait, app.js doesn't revert to "Continuar com mais detalhes", it reverts to " Gerar Meus Ajustes Informacionais →" or "Analisar resposta e gerar reorganização →"
// That's fine!

appJs = appJs.replace(
    /btnSpan.textContent = "Continuar com mais detalhes →";/g, // if it exists
    'btnSpan.textContent = "Avançar para Reorganização →";'
);

fs.writeFileSync('app.js', appJs);
fs.writeFileSync('index.html', html);

// Version bump
html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=159');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=159');
fs.writeFileSync('index.html', html);

console.log("Timer fixed and redundant button removed");
