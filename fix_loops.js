const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const oldOpenFnStr = `    window.openChallengeConfigModal = function() {
        const modal = document.getElementById("challenge-config-modal");
        if (!modal) return;
        
        for (let i = 0; i < 7; i++) {
            const input = document.getElementById(\`challenge-vid-\${i+1}\`);
            if (input) input.value = challengeVideos[i] || "";
        }
        
        modal.style.display = "flex";
    };`;

const newOpenFnStr = `    window.openChallengeConfigModal = function() {
        const modal = document.getElementById("challenge-config-modal");
        if (!modal) return;
        
        for (let i = 0; i < 8; i++) {
            const input = document.getElementById(\`challenge-vid-\${i}\`);
            if (input) input.value = challengeVideos[i] || "";
        }
        
        modal.style.display = "flex";
    };`;

appJs = appJs.replace(oldOpenFnStr, newOpenFnStr);

const oldSaveLoop = `        for (let i = 0; i < 7; i++) {
            const input = document.getElementById(\`challenge-vid-\${i+1}\`);
            newVideos.push(input ? input.value.trim() : "");
        }`;

const newSaveLoop = `        for (let i = 0; i < 8; i++) {
            const input = document.getElementById(\`challenge-vid-\${i}\`);
            newVideos.push(input ? input.value.trim() : "");
        }`;

appJs = appJs.replace(oldSaveLoop, newSaveLoop);

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=137');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=137');
fs.writeFileSync('index.html', html);

console.log('Fixed loops successfully');
