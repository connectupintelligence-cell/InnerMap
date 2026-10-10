const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Hero section monthly
html = html.replace(
    /<div class="plan-price">\s*<span class="currency">R\$<\/span>\s*<span class="value">49<\/span>\s*<span class="cents">,90<\/span>\s*<span class="period">\/mês<\/span>\s*<\/div>/,
    `<div class="plan-price">\n                                    <span class="currency">R$</span>\n                                    <span class="value">89</span>\n                                    <span class="cents">,90</span>\n                                    <span class="period">/mês</span>\n                                </div>`
);

// Hero section yearly
html = html.replace(
    /<div class="plan-price">\s*<span class="currency">R\$<\/span>\s*<span class="value">39<\/span>\s*<span class="cents">,90<\/span>\s*<span class="period">\/mês<\/span>\s*<\/div>/,
    `<div class="plan-price">\n                                    <span class="currency">R$</span>\n                                    <span class="value">69</span>\n                                    <span class="cents">,90</span>\n                                    <span class="period">/mês</span>\n                                </div>`
);

// Hero section total
html = html.replace('Cobrado anualmente: R$ 478,80/ano', 'Cobrado anualmente: R$ 838,80/ano');

// Paywall yearly
html = html.replace('<span style="font-size: 1.4rem; font-weight: 800; color: var(--color-text-main);">R$ 39,90</span>', '<span style="font-size: 1.4rem; font-weight: 800; color: var(--color-text-main);">R$ 69,90</span>');

// Paywall monthly
html = html.replace('<span style="font-size: 1.4rem; font-weight: 800; color: var(--color-text-main);">R$ 49,90</span>', '<span style="font-size: 1.4rem; font-weight: 800; color: var(--color-text-main);">R$ 89,90</span>');

// Version bump
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=146');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=146');

fs.writeFileSync('index.html', html);
console.log('Prices updated successfully!');
