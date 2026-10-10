const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const oldMicroacao = '"microacao": "orientação comportamental prática baseada no relato",';
const newMicroacao = `"microacao": "Ação diária prática focada em superar concretamente o problema relatado no mundo real (ex: conversar e impor um limite, planejar meta financeira). Foco no avanço e enfrentamento. NÃO instrua a fazer os exercícios do app.",
  "declaracao_fortalecimento": "Bloco criativo e profundo de fortalecimento (MRI) baseado no fato, para mudar o padrão. REGRAS OBRIGATÓRIAS: 2 frases com prefixo 'Espírito, eu escolho...' e 2 frases com prefixo 'Alma, eu já...'. Ex: 'Espírito, eu escolho agir com presença e sabedoria.\\nAlma, eu já me sinto capacitado e seguro.'",`;

appJs = appJs.replace(oldMicroacao, newMicroacao);

// Fix if (isMode3 && customFort)
const oldIf = 'if (isMode3 && customFort) {';
const newIf = 'if (customFort) {';
appJs = appJs.replace(oldIf, newIf);

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=156');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=156');
fs.writeFileSync('index.html', html);

console.log('AI Prompt and customFort check updated!');
