const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Remove DB fetch in initApp
const dbFetchLogic = `if (supabaseClient) {
        // Carregar chave de API em background (não-bloqueante) para concordância funcionar em todos os fluxos
        supabaseClient.from("system_config").select("value").eq("key", "gemini_api_key").single()
            .then(({ data }) => { if (data && data.value) { state.dbApiKey = data.value; if (!SafeStorage.getItem("innermap_gemini_key")) state.apiKey = data.value; } })
            .catch(e => console.warn("Chave de API não carregada no startup:", e));
    }`;
appJs = appJs.replace(dbFetchLogic, `// Fetch DB da chave desativado a pedido do usuario`);

// 2. Change the resolution logic in handleAiAnalysis
appJs = appJs.replace(
    /let apiKey = SafeStorage\.getItem\("innermap_gemini_key"\) \|\| state\.apiKey \|\| state\.dbApiKey \|\| DEFAULT_OPENAI_KEY;/g,
    `let apiKey = SafeStorage.getItem("innermap_gemini_key") || DEFAULT_OPENAI_KEY;`
);

// 3. Remove the DB fetch block inside handleAiAnalysis (if any left)
const dbFetchInsideAnalysis = `if (!apiKey) {
                try {
                    if (supabaseClient) {
                        const { data } = await supabaseClient.from("system_config").select("value").eq("key", "gemini_api_key").single();
                        if (data && data.value) apiKey = data.value;
                    }
                } catch (e) {}
            }`;
appJs = appJs.replace(dbFetchInsideAnalysis, `// Fetch ignorado`);

// 4. Remove DB fetch block inside handleAudioRecord
const dbFetchInsideAudio = `if (!apiKey && supabaseClient) {
                try {
                    const { data } = await supabaseClient.from("system_config").select("value").eq("key", "gemini_api_key").single();
                    if (data && data.value) apiKey = data.value;
                } catch(e) {}
            }`;
appJs = appJs.replace(dbFetchInsideAudio, `// Fetch ignorado`);

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=164');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=164');
fs.writeFileSync('index.html', html);

console.log("Forced DEFAULT_OPENAI_KEY as the primary key.");
