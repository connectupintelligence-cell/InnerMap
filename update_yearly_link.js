const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

const oldYearlyLink = 'const INFINITEPAY_LINK_YEARLY = "https://pay.infinitepay.io/felipefavalli/838,80";';
const newYearlyLink = 'const INFINITEPAY_LINK_YEARLY = "https://invoice.infinitepay.io/plans/felipefavalli/EIr41GTCsc";';

appJs = appJs.replace(oldYearlyLink, newYearlyLink);

const oldYearlyFallback = '(INFINITEPAY_LINK_YEARLY || "https://pay.infinitepay.io/felipefavalli/838,80")';
const newYearlyFallback = '(INFINITEPAY_LINK_YEARLY || "https://invoice.infinitepay.io/plans/felipefavalli/EIr41GTCsc")';

appJs = appJs.replace(oldYearlyFallback, newYearlyFallback);

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=149');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=149');
fs.writeFileSync('index.html', html);

console.log('Yearly subscription link updated!');
