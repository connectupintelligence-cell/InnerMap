const fs = require('fs');

// 1. UPDATE CSS
let css = fs.readFileSync('styles.css', 'utf8');
css = css.replace(/\.timeline-video-wrapper \{[\s\S]*?\}/, `.timeline-video-wrapper {
    position: relative;
    width: 100%;
    max-width: 340px; /* Looks like a mobile phone */
    aspect-ratio: 9 / 16;
    background: rgba(0,0,0,0.5);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.05);
}`);
fs.writeFileSync('styles.css', css);

// 2. UPDATE INDEX.HTML (MODAL)
let html = fs.readFileSync('index.html', 'utf8');
const startInputs = html.indexOf('<div id="challenge-config-inputs"');
const endInputs = html.indexOf('</div>\n            \n            <button id="btn-save-challenge"');

if (startInputs !== -1 && endInputs !== -1) {
    const days = [
        { id: 0, label: "Vídeo Base (Introdução)" },
        { id: 1, label: "Vídeo Dia 1" },
        { id: 2, label: "Vídeo Dia 2" },
        { id: 3, label: "Vídeo Dia 3" },
        { id: 4, label: "Vídeo Dia 4" },
        { id: 5, label: "Vídeo Dia 5" },
        { id: 6, label: "Vídeo Dia 6" },
        { id: 7, label: "Vídeo Dia 7" }
    ];
    
    const newInputsHTML = `
                ${days.map(d => `
                <div class="form-group" style="display: flex; gap: 0.5rem; align-items: flex-end; margin-bottom: 0.5rem;">
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 0.8rem; color: #E8A855; margin-bottom: 0.3rem;">${d.label}</label>
                        <input type="text" id="challenge-vid-${d.id}" class="text-input" placeholder="Link do YouTube ou clique no botão Upload" style="width: 100%; font-size: 0.85rem; padding: 0.6rem;">
                    </div>
                    <label class="btn btn-outline" style="padding: 0.5rem 0.8rem; cursor: pointer; border-radius: 8px; margin-bottom: 0;" title="Fazer upload do seu computador">
                        <input type="file" style="display:none" accept="video/mp4,video/webm,video/*" onchange="window.uploadChallengeVideo(this, ${d.id})">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </label>
                </div>
                `).join('')}
            `;
            
    html = html.substring(0, startInputs) + '<div id="challenge-config-inputs" style="display: flex; flex-direction: column; gap: 0.5rem;">' + newInputsHTML + html.substring(endInputs);
}

html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=135');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=135');
fs.writeFileSync('index.html', html);


// 3. UPDATE APP.JS (8 ITEMS INSTEAD OF 7)
let appJs = fs.readFileSync('app.js', 'utf8');

// Replace openChallengeConfigModal loop
appJs = appJs.replace(/for \(let i = 0; i < 7; i\+\+\) \{[\s\S]*?const input = document\.getElementById\(\`challenge-vid-\$\{i\+1\}\`\);[\s\S]*?if \(input\) input\.value = challengeVideos\[i\] \|\| "";[\s\S]*?\}/, 
`for (let i = 0; i < 8; i++) {
            const input = document.getElementById(\`challenge-vid-\${i}\`);
            if (input) input.value = challengeVideos[i] || "";
        }`);

// Replace saveChallengeConfig loop
appJs = appJs.replace(/for \(let i = 0; i < 7; i\+\+\) \{[\s\S]*?const input = document\.getElementById\(\`challenge-vid-\$\{i\+1\}\`\);[\s\S]*?newVideos\.push\(input \? input\.value\.trim\(\) : ""\);[\s\S]*?\}/, 
`for (let i = 0; i < 8; i++) {
            const input = document.getElementById(\`challenge-vid-\${i}\`);
            newVideos.push(input ? input.value.trim() : "");
        }`);

// Replace renderChallengeTimeline arrays and loop
const oldRenderFn = appJs.match(/function renderChallengeTimeline\(videos\) \{[\s\S]*?container\.innerHTML = html;\n    \}/)[0];
const newRenderFn = `function renderChallengeTimeline(videos) {
        const container = document.getElementById("challenge-timeline");
        if (!container) return;
        
        let html = "";
        const days = ["Vídeo Base (Início)", "Dia 1 - VIDRO", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7"];
        
        for (let i = 0; i < 8; i++) {
            const videoUrl = videos[i] || "";
            let embedUrl = getEmbedUrl(videoUrl);
            let isDirectVideo = false;
            
            // Check if it's a direct video file from Supabase or .mp4
            if (videoUrl.includes("supabase.co/storage") || videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm") || videoUrl.includes("firebasestorage")) {
                embedUrl = videoUrl;
                isDirectVideo = true;
            }
            
            let videoHTML = \`<div class="timeline-empty">Vídeo em breve...</div>\`;
            if (embedUrl) {
                if (isDirectVideo) {
                    videoHTML = \`<div class="timeline-video-wrapper"><video src="\${embedUrl}" controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"></video></div>\`;
                } else {
                    videoHTML = \`<div class="timeline-video-wrapper"><iframe src="\${embedUrl}" allowfullscreen></iframe></div>\`;
                }
            }
            
            html += \`
                <div class="timeline-step">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-title">
                            <span class="day-badge" style="\${i === 0 ? 'background: rgba(232, 168, 85, 0.15); color: #E8A855;' : ''}">\${days[i]}</span>
                        </div>
                        \${videoHTML}
                    </div>
                </div>
            \`;
        }
        
        container.innerHTML = html;
    }`;

appJs = appJs.replace(oldRenderFn, newRenderFn);

fs.writeFileSync('app.js', appJs);

console.log('Update successful');
