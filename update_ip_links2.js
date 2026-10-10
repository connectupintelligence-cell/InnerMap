const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// Update Links to use commas
appJs = appJs.replace(
    'const INFINITEPAY_LINK_MONTHLY = "https://pay.infinitepay.io/felipefavalli/89.90";',
    'const INFINITEPAY_LINK_MONTHLY = "https://pay.infinitepay.io/felipefavalli/89,90";'
);

appJs = appJs.replace(
    'const INFINITEPAY_LINK_YEARLY = "https://pay.infinitepay.io/felipefavalli/838.80";',
    'const INFINITEPAY_LINK_YEARLY = "https://pay.infinitepay.io/felipefavalli/838,80";'
);

// Update Fallbacks in startCheckout function
appJs = appJs.replace(
    '(INFINITEPAY_LINK_YEARLY || "https://pay.infinitepay.io/felipefavalli/838.80")',
    '(INFINITEPAY_LINK_YEARLY || "https://pay.infinitepay.io/felipefavalli/838,80")'
);

appJs = appJs.replace(
    '(INFINITEPAY_LINK_MONTHLY || "https://pay.infinitepay.io/felipefavalli/89.90")',
    '(INFINITEPAY_LINK_MONTHLY || "https://pay.infinitepay.io/felipefavalli/89,90")'
);

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=148');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=148');
fs.writeFileSync('index.html', html);

console.log('InfinitePay links updated with commas!');
