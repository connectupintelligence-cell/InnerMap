const fs = require('fs');

// 1. UPDATE INDEX.HTML
let html = fs.readFileSync('index.html', 'utf8');

const marker = '<h2 class="step-title">A Jornada (Desafio 7 Dias)</h2>';
const adminBtnHTML = '<button id="btn-admin-desafio" class="btn btn-outline" style="display:none; margin: 0 auto 1.5rem auto;" onclick="window.openChallengeConfigModal()">⚙️ Configurar Vídeos da Jornada</button>';

if(!html.includes('btn-admin-desafio')) {
    html = html.replace(marker, marker + '\n                    ' + adminBtnHTML);
}

html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=134');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=134');
fs.writeFileSync('index.html', html);


// 2. UPDATE APP.JS
let appJs = fs.readFileSync('app.js', 'utf8');

const logicHTML = `
            const btnAdminDesafio = document.getElementById("btn-admin-desafio");
            if (btnAdminDesafio) {
                if (state.currentUser && state.currentUser.role === "therapist") {
                    btnAdminDesafio.style.display = "inline-block";
                } else {
                    btnAdminDesafio.style.display = "none";
                }
            }
`;

if (!appJs.includes('btnAdminDesafio.style.display')) {
    appJs = appJs.replace('if (navTherapist) {', logicHTML + '\n            if (navTherapist) {');
    fs.writeFileSync('app.js', appJs);
}

console.log('Update successful');
