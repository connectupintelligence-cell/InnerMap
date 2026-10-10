const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Hide "Compreensão do seu Momento"
html = html.replace(
    /<!-- Reflexão empática da IA -->[\s\S]*?<!-- Separador -->/,
    `<!-- Reflexão empática da IA (Ocultada a pedido do usuário) -->
    <div style="display: none;">`
);
html = html.replace(
    /<!-- Separador -->/,
    `</div><!-- Separador -->`
);

// 2. Hide "Uma pergunta para você" and replace with "Quer incluir mais algum fato?"
// We need to find the specific blocks.
html = html.replace(
    /<p style="font-size: 0.78rem; font-weight: 600; color: var\(--color-text-muted\); text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Uma pergunta para voc.*?<\/p>/,
    '<p style="font-size: 0.85rem; font-weight: 600; color: var(--color-primary); text-transform: uppercase; margin: 0;">Quer incluir mais algum fato?</p>'
);

// Hide the ai-pergunta paragraph and TTS button
html = html.replace(
    /<button type="button" class="btn-tts-speak" data-target="ai-pergunta" title="Ouvir pergunta">[\s\S]*?<\/button>/,
    ''
);
html = html.replace(
    /<p id="ai-pergunta" style="font-size: 1rem; color: var\(--color-text\); line-height: 1.6; margin: 0 0 1rem 0; font-weight: 500;"><\/p>/,
    '<p id="ai-pergunta" style="display: none;"></p>'
);

// Remove the separator
html = html.replace(
    /<div style="height: 1px; background: var\(--color-border\); margin: 0 0 1.5rem 0;"><\/div>/,
    '<div style="height: 1px; background: var(--color-border); margin: 0 0 1.5rem 0; display: none;"></div>'
);

// 3. Change flow to Skip Step 2 ("Consciência Informacional")
let appJs = fs.readFileSync('app.js', 'utf8');

// Inside triggerFinalGeneration(), it does showScreen("step2");
// Let's replace it with showScreen("step3");
appJs = appJs.replace(/showScreen\("step2"\);/g, 'showScreen("step3");');

// In selectObjectiveMode(mode) or somewhere, if there are any other references to step2, we could skip them.
// Let's check btn-sentiment-save. It calls triggerFinalGeneration(), which now goes to step 3.
// But wait, what if they click "Voltar"?
// In handleToStep3(), we have showScreen("step3").
// In handleBackToStep2(), we have showScreen("step2"). We should change it to showScreen("step1")!
appJs = appJs.replace(
    /window\.handleBackToStep2\s*=\s*function\(\)\s*\{\s*showScreen\("step2"\);\s*\};/g,
    'window.handleBackToStep2 = function() { showScreen("step1"); };'
);

// Update versions
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=154');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=154');

fs.writeFileSync('index.html', html);
fs.writeFileSync('app.js', appJs);

console.log('UI updated to remove comprehension/questions and skip step 2');
