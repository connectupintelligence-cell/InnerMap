const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// I will extract the MDI generation and replace it.
// The MDI generation starts at: let mdi = ""; (line 611)
// And ends before: let finalEspecifica = "";

const regex = /let mdi = "";\s*if \(isHereditary\) \{[\s\S]*?\/\/\s*MDI Condicional extra lines[\s\S]*?\}\s*\}\s*\)\s*;\s*\}/;
// Wait, regex matching might be tricky because of all the nested brackets. I will just do string replacement from exactly what I know is there.

let startStr = `let mdi = "";
        if (isHereditary) {`;
let endStr = `let finalEspecifica = "";`;

let startIndex = appJs.indexOf('let mdi = "";\n        if (isHereditary) {');
let endIndex = appJs.indexOf('let finalEspecifica = "";');

if (startIndex !== -1 && endIndex !== -1) {
    let blockToReplace = appJs.substring(startIndex, endIndex);
    
    let newBlock = `let mdi = "";
        if (isHereditary) {
            mdi = \`Espírito, pensamento que gerou \${artigo} "\${cleanConcept.toLowerCase()}" acabou!\\n\`;
            mdi += \`Espírito, condicionamento de manifestar \${artigo} "\${cleanConcept.toLowerCase()}" acabou!\\n\`;
            mdi += \`Espírito, condicionamento de observar \${artigo} "\${cleanConcept.toLowerCase()}" acabou!\\n\`;
            mdi += \`Espírito, condicionamento de dar utilidade \${prepArtigo} "\${cleanConcept.toLowerCase()}" acabou!\\n\`;
            mdi += \`Espírito, crença sobre \${artigo} "\${cleanConcept.toLowerCase()}" acabou!\\n\`;
            mdi += \`Espírito, hereditariedade recebida de "\${cleanConcept.toLowerCase()}" acabou!\`;

            // MDI Condicional extra lines
            if (hasMdiCondicional && addedMdiBehaviors && addedMdiBehaviors.length > 0) {
                addedMdiBehaviors.forEach(item => {
                    if (item.behavior) {
                        mdi += \`\\nEspírito, condicionamento de \${item.behavior.toLowerCase()} acabou!\`;
                        if (item.sentiment) {
                            mdi += \`\\nEspírito, condicionamento de me sentir \${item.sentiment.toLowerCase()} \${connector} \${cleanConcept.toLowerCase()} acabou!\`;
                        }
                    }
                });
            }
        } else {
            // "A parte do mental que está associada ao tema, pode tirar neste desconforto recente."
            mdi = "";
        }

        `;
        
    appJs = appJs.replace(blockToReplace, newBlock);
} else {
    console.log("Could not find exact block");
}

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=158');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=158');
fs.writeFileSync('index.html', html);

console.log('Fixed MDI completely for recent discomfort');
