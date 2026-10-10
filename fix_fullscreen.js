const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

const oldIframe = '<iframe src="${embedUrl}" allowfullscreen></iframe>';
const newIframe = '<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>';

if (appJs.includes(oldIframe)) {
    appJs = appJs.replace(oldIframe, newIframe);
    fs.writeFileSync('app.js', appJs);
    
    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=139');
    html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=139');
    fs.writeFileSync('index.html', html);
    console.log('Updated iframe attributes.');
} else {
    console.log('Old iframe string not found.');
}
