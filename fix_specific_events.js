const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Fix MDI Block to remove Theme reference if !isHereditary
// The MDI block is generated around line 612
// I will just replace the MDI generation logic to respect isHereditary.
appJs = appJs.replace(
    'let mdi = `Espírito, pensamento que gerou ${artigo} "${cleanConcept.toLowerCase()}" acabou!\\n`;',
    `let mdi = "";
        if (isHereditary) {
            mdi = \`Espírito, pensamento que gerou \${artigo} "\${cleanConcept.toLowerCase()}" acabou!\\n\`;
            mdi += \`Espírito, condicionamento de manifestar \${artigo} "\${cleanConcept.toLowerCase()}" acabou!\\n\`;
            mdi += \`Espírito, as frequências geradas \${connector} "\${cleanConcept.toLowerCase()}" nas minhas vias de memórias, acabaram!\\n\`;
            mdi += \`Espírito, as memórias \${prepArtigo} "\${cleanConcept.toLowerCase()}" das minhas vias de memórias, acabaram!\`;
        } else {
            // "manter apenas os comandos que não precisam do TEMA"
            // Se é fato específico, o bloco de reinterpretação não usa MDI focado em tema.
            mdi = "";
        }
        // Dummy logic to remove the rest of the old MDI string so it doesn't duplicate
        let _mdiOldIgnored = \`Espírito, pensamento que gerou \${artigo} "\${cleanConcept.toLowerCase()}" acabou!\\n\`;`
);

appJs = appJs.replace(
    'mdi += `Espírito, condicionamento de manifestar ${artigo} "${cleanConcept.toLowerCase()}" acabou!\\n`;',
    '// Removed'
);
appJs = appJs.replace(
    'mdi += `Espírito, as frequências geradas ${connector} "${cleanConcept.toLowerCase()}" nas minhas vias de memórias, acabaram!\\n`;',
    '// Removed'
);
appJs = appJs.replace(
    'mdi += `Espírito, as memórias ${prepArtigo} "${cleanConcept.toLowerCase()}" das minhas vias de memórias, acabaram!`;',
    '// Removed'
);

// 2. Fix the Fallback Microação
// Current: microacao: "Escrever o fato em um papel, mentalizar as frases de liberação (MSI/MFI), e depois rasgá-lo, focando na reinterpretação sugerida (MRI)."
const oldMicroacao = 'microacao: "Escrever o fato em um papel, mentalizar as frases de liberação (MSI/MFI), e depois rasgá-lo, focando na reinterpretação sugerida (MRI).",';
const newMicroacao = 'microacao: "Identifique uma atitude prática que contrarie a sua reação automática ao evento. Hoje, escolha responder de forma intencional e pacífica a qualquer gatilho semelhante, mantendo o estado de presença e ancorando sua nova consciência informacional.",';
appJs = appJs.replace(oldMicroacao, newMicroacao);

// 3. Fix generic AI Fallback in buildDeclarations
// Ensure MSI is empty when !isHereditary
// The code already does this! `if (isHereditary) { ... MSI ... }`
// Let's just make sure it's correct.

// 4. Update index.html version
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=151');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=151');
fs.writeFileSync('index.html', html);
fs.writeFileSync('app.js', appJs);

console.log('Fixed Specific Events Logic and Fallbacks');
