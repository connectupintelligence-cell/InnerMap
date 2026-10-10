const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

const oldPlaceholderApp = '"Escreva aqui o que aconteceu (Ex: Fiquei muito chateado(a) na reunião de ontem porque sinto que meu chefe desvalorizou meu empenho...)";';
const newPlaceholderApp = '"Exemplo: Fato: bati o carro ontem / briguei com meu marido hoje / fui demitido do meu trabalho semana passada.";';
appJs = appJs.replace(oldPlaceholderApp, newPlaceholderApp);

// Also look at selectObjectiveMode inside app.js if there's another placeholder definition
const oldPlaceholderApp2 = 'inputAiRelato.placeholder = "Escreva aqui o que você sente (Ex: Sinto muita cobrança...)"'; // Just checking if it exists
// Let's use regex to replace any mode 1 placeholder
appJs = appJs.replace(/inputAiRelato\.placeholder\s*=\s*["']Escreva aqui o que aconteceu.*?["']/g, `inputAiRelato.placeholder = ${newPlaceholderApp}`);


let html = fs.readFileSync('index.html', 'utf8');

// Replace static placeholder in HTML
html = html.replace(
    /placeholder="Escreva aqui o que voc[ê] sente \(Ex: Sinto muita cobran[ç]a e medo de falhar no meu trabalho.*?tempo todo\.\.\.\)"/g,
    'placeholder="Exemplo: Fato: bati o carro ontem / briguei com meu marido hoje / fui demitido do meu trabalho semana passada."'
);

html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=153');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=153');

fs.writeFileSync('app.js', appJs);
fs.writeFileSync('index.html', html);

console.log('Placeholder updated!');
