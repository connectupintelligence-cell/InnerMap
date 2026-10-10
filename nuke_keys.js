const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

const regexes = [
    /let apiKey = SafeStorage\.getItem\("innermap_gemini_key"\) \|\| DEFAULT_OPENAI_KEY;/g,
    /if \(!state\.apiKey\) state\.apiKey = SafeStorage\.getItem\("innermap_gemini_key"\) \|\| DEFAULT_OPENAI_KEY;/g
];

for (let regex of regexes) {
    appJs = appJs.replace(regex, 'let apiKey = DEFAULT_OPENAI_KEY;');
    appJs = appJs.replace(/if \(!state\.apiKey\) state\.apiKey = SafeStorage\.getItem\("innermap_gemini_key"\) \|\| DEFAULT_OPENAI_KEY;/g, 'state.apiKey = DEFAULT_OPENAI_KEY;');
}

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=165');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=165');
fs.writeFileSync('index.html', html);

console.log("Completely hardcoded OpenAI key.");
