const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const regex = /\} else \{\s*userNavContainer\.style\.display = "none";\s*if \(mobileBtnLogout\) mobileBtnLogout\.style\.display = "none";\s*const mobileAccount = document\.getElementById\("mobile-nav-account"\);\s*if \(mobileAccount\) mobileAccount\.style\.display = "none";/;

const newBlock = `} else {
            userNavContainer.style.display = "none";
            if (mobileBtnLogout) mobileBtnLogout.style.display = "none";
            const mobileAccount = document.getElementById("mobile-nav-account");
            if (mobileAccount) mobileAccount.style.display = "flex"; // MANTER MINHA CONTA VISIVEL ANTES DO LOGIN`;

if (regex.test(appJs)) {
    appJs = appJs.replace(regex, newBlock);
    fs.writeFileSync('app.js', appJs);

    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=144');
    html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=144');
    fs.writeFileSync('index.html', html);
    console.log('Mobile nav account fixed.');
} else {
    console.log('Could not find replace block.');
}
