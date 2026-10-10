const fs = require('fs');

// 1. UPDATE INDEX.HTML
let html = fs.readFileSync('index.html', 'utf8');

const oldTutorialScreenStart = html.indexOf('<div id="screen-tutorial" class="app-screen">');
const oldTutorialScreenEnd = html.indexOf('<!-- PAYWALL SCREEN -->', oldTutorialScreenStart);

const newTutorialScreenHTML = `<!-- TUTORIAL SCREEN -->
                <div id="screen-tutorial" class="app-screen">
                    <h2 class="step-title">Tutorial do App</h2>
                    <p class="step-subtitle">Aprenda a usar cada funcionalidade passo a passo.</p>
                    
                    <button id="btn-admin-tutorial" class="btn btn-outline" style="display:none; margin: 0 auto 1.5rem auto;" onclick="window.openTutorialConfigModal()">⚙️ Configurar Passos do Tutorial</button>
                    
                    <div id="tutorial-timeline" class="challenge-timeline-container">
                        <div style="text-align:center; padding: 2rem; color: var(--color-text-muted);">Carregando tutorial...</div>
                    </div>
                </div>

                `;

if (oldTutorialScreenStart !== -1 && oldTutorialScreenEnd !== -1) {
    html = html.substring(0, oldTutorialScreenStart) + newTutorialScreenHTML + html.substring(oldTutorialScreenEnd);
}

// Add Tutorial Modal
const steps = [1,2,3,4,5,6,7];
const tutorialModalHTML = `
    <!-- Modal de Configuração do Tutorial -->
    <div id="tutorial-config-modal" class="modal-overlay" style="display: none; z-index: 9999;">
        <div class="modal-card glass-card" style="max-width: 600px; max-height: 90vh; overflow-y: auto; text-align: left; padding: 2rem;">
            <button class="modal-close-btn" onclick="document.getElementById('tutorial-config-modal').style.display='none';">&times;</button>
            <h3 class="modal-title" style="color: var(--color-primary); margin-bottom: 0.5rem;">Configurar Passos do Tutorial</h3>
            <p class="modal-subtitle" style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">Cole os links (YouTube) ou faça upload para os 7 passos.</p>
            
            <div id="tutorial-config-inputs" style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${steps.map(i => `
                <div class="form-group" style="display: flex; gap: 0.5rem; align-items: flex-end; margin-bottom: 0.5rem;">
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 0.8rem; color: #E8A855; margin-bottom: 0.3rem;">Passo ${i}</label>
                        <input type="text" id="tutorial-vid-${i}" class="text-input" placeholder="Link do YouTube ou clique no botão Upload" style="width: 100%; font-size: 0.85rem; padding: 0.6rem;">
                    </div>
                    <label class="btn btn-outline" style="padding: 0.5rem 0.8rem; cursor: pointer; border-radius: 8px; margin-bottom: 0;" title="Fazer upload do seu computador">
                        <input type="file" style="display:none" accept="video/mp4,video/webm,video/*" onchange="window.uploadTutorialVideo(this, ${i})">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </label>
                </div>
                `).join('')}
            </div>
            
            <button id="btn-save-tutorial" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="window.saveTutorialConfig()">Salvar Tutorial</button>
        </div>
    </div>
`;

if (!html.includes('id="tutorial-config-modal"')) {
    html = html.replace('</body>', tutorialModalHTML + '\n</body>');
}

html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=141');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=141');
fs.writeFileSync('index.html', html);


// 2. UPDATE APP.JS
let appJs = fs.readFileSync('app.js', 'utf8');

// Add Admin button visibility logic
const btnLogic = `
            const btnAdminTutorial = document.getElementById("btn-admin-tutorial");
            if (btnAdminTutorial) {
                if (state.currentUser && state.currentUser.role === "therapist") {
                    btnAdminTutorial.style.display = "inline-block";
                } else {
                    btnAdminTutorial.style.display = "none";
                }
            }
`;
if (!appJs.includes('btnAdminTutorial.style.display')) {
    appJs = appJs.replace('if (navTherapist) {', btnLogic + '\n            if (navTherapist) {');
}

// Add Tutorial Logic functions
const tutorialLogic = `
    // ==========================================================================
    // TUTORIAL (PASSOS)
    // ==========================================================================
    let tutorialVideos = [];
    
    function renderTutorialTimeline(videos) {
        const container = document.getElementById("tutorial-timeline");
        if (!container) return;
        
        let html = "";
        const stepsTitles = ["Passo 1", "Passo 2", "Passo 3", "Passo 4", "Passo 5", "Passo 6", "Passo 7"];
        
        for (let i = 0; i < 7; i++) {
            const videoUrl = videos[i] || "";
            let embedUrl = getEmbedUrl(videoUrl);
            let isDirectVideo = false;
            
            if (videoUrl.includes("supabase.co/storage") || videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm") || videoUrl.includes("firebasestorage")) {
                embedUrl = videoUrl;
                isDirectVideo = true;
            }
            
            let videoHTML = \`<div class="timeline-empty">Vídeo em breve...</div>\`;
            if (embedUrl) {
                if (isDirectVideo) {
                    videoHTML = \`<div class="timeline-video-wrapper"><video src="\${embedUrl}" controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"></video></div><button onclick="window.openFullscreenVideo('\${embedUrl}')" style="margin-top: 0.8rem; width: 100%; max-width: 340px; padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg> Expandir Vídeo</button>\`;
                } else {
                    videoHTML = \`<div class="timeline-video-wrapper"><iframe src="\${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe></div><button onclick="window.openFullscreenVideo('\${embedUrl}')" style="margin-top: 0.8rem; width: 100%; max-width: 340px; padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg> Expandir Vídeo</button>\`;
                }
            }
            
            html += \`
                <div class="timeline-step">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-title">
                            <span class="day-badge">\${stepsTitles[i]}</span>
                        </div>
                        \${videoHTML}
                    </div>
                </div>
            \`;
        }
        
        container.innerHTML = html;
    }

    async function loadTutorialVideos() {
        try {
            if (!supabaseClient) return;
            const { data, error } = await supabaseClient
                .from("system_config")
                .select("value")
                .eq("key", "tutorial_videos")
                .single();
                
            if (data && data.value) {
                tutorialVideos = JSON.parse(data.value);
            }
            renderTutorialTimeline(tutorialVideos);
        } catch (err) {
            console.error("Erro ao carregar tutorial:", err);
            renderTutorialTimeline([]);
        }
    }

    window.openTutorialConfigModal = function() {
        const modal = document.getElementById("tutorial-config-modal");
        if (!modal) return;
        
        for (let i = 0; i < 7; i++) {
            const input = document.getElementById(\`tutorial-vid-\${i+1}\`);
            if (input) input.value = tutorialVideos[i] || "";
        }
        
        modal.style.display = "flex";
    };

    window.saveTutorialConfig = async function() {
        const btn = document.getElementById("btn-save-tutorial");
        if (btn) btn.innerHTML = "Salvando...";
        
        let newVideos = [];
        for (let i = 0; i < 7; i++) {
            const input = document.getElementById(\`tutorial-vid-\${i+1}\`);
            newVideos.push(input ? input.value.trim() : "");
        }
        
        try {
            const { error } = await supabaseClient
                .from("system_config")
                .upsert({
                    key: "tutorial_videos",
                    value: JSON.stringify(newVideos)
                }, { onConflict: "key" });
                
            if (error) throw error;
            
            tutorialVideos = newVideos;
            renderTutorialTimeline(tutorialVideos);
            showToast("Passos do Tutorial salvos com sucesso!");
            document.getElementById("tutorial-config-modal").style.display = "none";
        } catch (err) {
            console.error("Erro ao salvar tutorial:", err);
            showToast("Erro ao salvar: Verifique suas permissões.");
        } finally {
            if (btn) btn.innerHTML = "Salvar Tutorial";
        }
    };

    window.uploadTutorialVideo = async function(fileInput, stepIndex) {
        const file = fileInput.files[0];
        if (!file) return;
        
        if (!supabaseClient) {
            showToast("Supabase não configurado.");
            return;
        }
        
        const inputField = document.getElementById(\`tutorial-vid-\${stepIndex}\`);
        if (inputField) inputField.value = "Fazendo upload... aguarde (não feche)";
        
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = \`tutorial_passo_\${stepIndex}_\${Date.now()}.\${fileExt}\`;
            
            // USING THE SAME BUCKET 'desafio_videos' SO THEY DON'T NEED TO CREATE ANOTHER ONE!
            const { data, error } = await supabaseClient.storage
                .from('desafio_videos')
                .upload(fileName, file, { upsert: true });
                
            if (error) throw error;
            
            const { data: publicUrlData } = supabaseClient.storage
                .from('desafio_videos')
                .getPublicUrl(fileName);
                
            if (inputField) inputField.value = publicUrlData.publicUrl;
            showToast(\`Vídeo do Passo \${stepIndex} carregado com sucesso!\`);
        } catch (err) {
            console.error("Erro no upload do tutorial:", err);
            if (inputField) inputField.value = "";
            alert("ERRO: " + err.message);
        }
    };
`;

if (!appJs.includes('loadTutorialVideos()')) {
    appJs = appJs.replace('loadChallengeVideos();', 'loadChallengeVideos();\n    loadTutorialVideos();');
    appJs = appJs.replace('// ==========================================================================', tutorialLogic + '\n    // ==========================================================================');
    fs.writeFileSync('app.js', appJs);
}

console.log('Tutorial timeline generated successfully');
