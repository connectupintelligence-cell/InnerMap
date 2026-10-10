const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// Change DB load logic to not overwrite if localStorage exists
const oldDbLogic = `.then(({ data }) => { if (data && data.value) state.apiKey = data.value; })`;
const newDbLogic = `.then(({ data }) => { if (data && data.value) { state.dbApiKey = data.value; if (!SafeStorage.getItem("innermap_gemini_key")) state.apiKey = data.value; } })`;

appJs = appJs.replace(oldDbLogic, newDbLogic);

// Change handleAiAnalysis to prioritize localStorage
const oldAiLogic = `let apiKey = state.apiKey || SafeStorage.getItem("innermap_gemini_key") || DEFAULT_OPENAI_KEY;`;
const newAiLogic = `let apiKey = SafeStorage.getItem("innermap_gemini_key") || state.apiKey || state.dbApiKey || DEFAULT_OPENAI_KEY;`;

appJs = appJs.replace(oldAiLogic, newAiLogic);

// And do the same in handleAudioRecord logic (around 2912)
appJs = appJs.replace(
    `let apiKey = state.apiKey || SafeStorage.getItem("innermap_gemini_key") || DEFAULT_OPENAI_KEY;`,
    `let apiKey = SafeStorage.getItem("innermap_gemini_key") || state.apiKey || state.dbApiKey || DEFAULT_OPENAI_KEY;`
);

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=163');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=163');
fs.writeFileSync('index.html', html);

console.log("Fixed API key precedence");
