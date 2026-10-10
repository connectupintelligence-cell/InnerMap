const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The broken HTML structure is:
// <!-- Reflexão empática da IA (Ocultada a pedido do usuário) -->
//     <div style="display: none;">
//                             <div style="height: 1px; background: var(--color-border); margin: 0 0 1.5rem 0; display: none;"></div>
//
//                             <!-- Pergunta de aprofundamento -->

// Let's close the div!
html = html.replace(
    /<div style="height: 1px; background: var\(--color-border\); margin: 0 0 1\.5rem 0; display: none;"><\/div>\s*<!-- Pergunta de aprofundamento -->/,
    `<div style="height: 1px; background: var(--color-border); margin: 0 0 1.5rem 0; display: none;"></div>
    </div> <!-- Fechando a div oculta -->
    <!-- Pergunta de aprofundamento -->`
);

fs.writeFileSync('index.html', html);
console.log('HTML fixed');
