const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. In the catch block of handleAiAnalysis, change how tempTheme is assigned for fallback
const oldTempTheme = 'state.tempTheme = ReorganizationEngine.extractTheme ? ReorganizationEngine.extractTheme(relato) : "Autoconhecimento";';
const newTempTheme = 'state.tempTheme = state.selectedMode === 1 ? "este desconforto recente" : "este padrão";';

if (appJs.includes(oldTempTheme)) {
    appJs = appJs.replace(oldTempTheme, newTempTheme);
} else {
    console.log("Could not find oldTempTheme in catch block!");
}

// 2. Add specific MRI fallback in suggestMriRessignificacao
const oldMriSuggest = 'static suggestMriRessignificacao(phrase) {\n        const clean = phrase.toLowerCase().trim();\n        let es = "direcionar minha atenção para novas possibilidades, soluções e expansão";\n        let al = "construo minha realidade com presença, consistência e equilíbrio";';

const newMriSuggest = `static suggestMriRessignificacao(phrase) {
        const clean = phrase.toLowerCase().trim();
        let es = "direcionar minha atenção para novas possibilidades, soluções e expansão";
        let al = "construo minha realidade com presença, consistência e equilíbrio";
        
        if (clean === "este desconforto recente" || clean === "este padrão") {
            es = "soltar a carga emocional deste evento e focar no meu avanço prático";
            al = "me sinto livre, consciente e no controle das minhas escolhas diárias";
        }`;

if (appJs.includes(oldMriSuggest)) {
    appJs = appJs.replace(oldMriSuggest, newMriSuggest);
} else {
    // try a more generic replace
    appJs = appJs.replace(
        /let al = "construo minha realidade com presença, consistência e equilíbrio";/,
        'let al = "construo minha realidade com presença, consistência e equilíbrio";\n\n        if (clean === "este desconforto recente" || clean === "este padrão") {\n            es = "soltar a carga emocional deste evento e focar no meu avanço prático";\n            al = "me sinto livre, consciente e no controle das minhas escolhas diárias";\n        }'
    );
}

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=160');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=160');
fs.writeFileSync('index.html', html);

console.log("Updated fallback AI defaults");
