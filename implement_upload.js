const fs = require('fs');

// 1. UPDATE INDEX.HTML
let html = fs.readFileSync('index.html', 'utf8');

// Replace the inputs loop inside challenge-config-inputs
const startInputs = html.indexOf('<div id="challenge-config-inputs"');
const endInputs = html.indexOf('</div>\n            \n            <button id="btn-save-challenge"');

if (startInputs !== -1 && endInputs !== -1) {
    const newInputsHTML = `
                ${[1,2,3,4,5,6,7].map(i => `
                <div class="form-group" style="display: flex; gap: 0.5rem; align-items: flex-end; margin-bottom: 0.5rem;">
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 0.8rem; color: #E8A855; margin-bottom: 0.3rem;">Vídeo Dia ${i}</label>
                        <input type="text" id="challenge-vid-${i}" class="text-input" placeholder="Link do YouTube ou clique no botão Upload" style="width: 100%; font-size: 0.85rem; padding: 0.6rem;">
                    </div>
                    <label class="btn btn-outline" style="padding: 0.5rem 0.8rem; cursor: pointer; border-radius: 8px; margin-bottom: 0;" title="Fazer upload do seu computador">
                        <input type="file" style="display:none" accept="video/mp4,video/webm,video/*" onchange="window.uploadChallengeVideo(this, ${i})">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </label>
                </div>
                `).join('')}
            `;
            
    html = html.substring(0, startInputs) + '<div id="challenge-config-inputs" style="display: flex; flex-direction: column; gap: 0.5rem;">' + newInputsHTML + html.substring(endInputs);
}

html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=133');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=133');
fs.writeFileSync('index.html', html);


// 2. UPDATE APP.JS
let appJs = fs.readFileSync('app.js', 'utf8');

const uploadLogic = `
    window.uploadChallengeVideo = async function(fileInput, dayIndex) {
        const file = fileInput.files[0];
        if (!file) return;
        
        if (!supabaseClient) {
            showToast("Supabase não configurado.");
            return;
        }
        
        const inputField = document.getElementById(\`challenge-vid-\${dayIndex}\`);
        if (inputField) inputField.value = "Fazendo upload... aguarde (não feche)";
        
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = \`dia_\${dayIndex}_\${Date.now()}.\${fileExt}\`;
            
            const { data, error } = await supabaseClient.storage
                .from('desafio_videos')
                .upload(fileName, file, { upsert: true });
                
            if (error) throw error;
            
            const { data: publicUrlData } = supabaseClient.storage
                .from('desafio_videos')
                .getPublicUrl(fileName);
                
            if (inputField) inputField.value = publicUrlData.publicUrl;
            showToast(\`Vídeo do Dia \${dayIndex} carregado com sucesso!\`);
        } catch (err) {
            console.error("Erro no upload:", err);
            if (inputField) inputField.value = "";
            alert("ERRO: Para usar o upload, você precisa ir no painel do Supabase, clicar em 'Storage' e criar um bucket com o nome exato 'desafio_videos'. Nas opções do bucket, marque-o como Público (Public). Detalhe técnico: " + err.message);
        }
    };
`;

if (!appJs.includes('window.uploadChallengeVideo')) {
    appJs = appJs.replace('window.saveChallengeConfig = async function() {', uploadLogic + '\n\n    window.saveChallengeConfig = async function() {');
}

// ALSO: We need to modify getEmbedUrl in appJs so that direct .mp4 urls render as <video> instead of <iframe>!
appJs = appJs.replace(/html \+= \\[\s\S]*?<\/div>\\;/g, (match) => {
    // Actually, I'll just rewrite renderChallengeTimeline entirely to be safe
    return match;
});

// Let's replace the whole renderChallengeTimeline function to support <video> tags
const oldRenderFn = appJs.match(/function renderChallengeTimeline\(videos\) \{[\s\S]*?container\.innerHTML = html;\n    \}/)[0];
const newRenderFn = `function renderChallengeTimeline(videos) {
        const container = document.getElementById("challenge-timeline");
        if (!container) return;
        
        let html = "";
        const days = ["Dia 1 - VIDRO", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7"];
        
        for (let i = 0; i < 7; i++) {
            const videoUrl = videos[i] || "";
            let embedUrl = getEmbedUrl(videoUrl);
            let isDirectVideo = false;
            
            // Check if it's a direct video file from Supabase or .mp4
            if (videoUrl.includes("supabase.co/storage") || videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm")) {
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
                            <span class="day-badge">\${days[i]}</span>
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
