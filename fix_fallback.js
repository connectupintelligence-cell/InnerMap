const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

const oldAjuste = 'ajuste: `O padrão de "${cleanConcept.toLowerCase()}" está gerando registros ativos que influenciam suas escolhas automáticas.`,';
const newAjuste = 'ajuste: `Ao analisar o campo informacional de "${cleanConcept.toLowerCase()}", percebe-se que esse padrão estruturou um mecanismo de defesa no seu inconsciente. O que um dia serviu como proteção, hoje atua como um filtro limitante e oculto, gerando repetição de ciclos e reações automáticas. A verdadeira causa raiz não é o evento em si, mas a interpretação sistêmica e emocional que ficou gravada.`,';

const oldMovimento = 'movimento: `Acolher este registro factual conscientemente para liberar a carga emocional e atualizar seu padrão de percepção.`,';
const newMovimento = 'movimento: `O primeiro passo da libertação é acolher este registro sem resistência ou julgamento. Ao reconhecer o fato, você desativa o gatilho emocional aprisionado e permite que a sua própria Inteligência Informacional atualize seu padrão de percepção. Isso abre espaço para escolhas novas e 100% intencionais.`,';

appJs = appJs.replace(oldAjuste, newAjuste);
appJs = appJs.replace(oldMovimento, newMovimento);

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=150');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=150');
fs.writeFileSync('index.html', html);

console.log('Fallback text improved successfully!');
