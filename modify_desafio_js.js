const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const logicHTML = `
    // ==========================================================================
    // DESAFIO DE 7 DIAS (JORNADA)
    // ==========================================================================
    let challengeVideos = [];
    
    function getEmbedUrl(url) {
        if (!url) return "";
        try {
            let videoId = "";
            if (url.includes("youtube.com/watch")) {
                videoId = new URL(url).searchParams.get("v");
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1]?.split("?")[0];
            } else if (url.includes("youtube.com/embed/")) {
                return url;
            }
            if (videoId) return \`https://www.youtube.com/embed/\${videoId}\`;
            return url; // fallback for vimeo or others if they pasted embed directly
        } catch (e) {
            return url;
        }
    }

    function renderChallengeTimeline(videos) {
        const container = document.getElementById("challenge-timeline");
        if (!container) return;
        
        let html = "";
        const days = ["Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7"];
        
        for (let i = 0; i < 7; i++) {
            const videoUrl = videos[i] || "";
            const embedUrl = getEmbedUrl(videoUrl);
            
            html += \`
                <div class="timeline-step">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-title">
                            <span class="day-badge">\${days[i]}</span>
                        </div>
                        \${embedUrl 
                            ? \`<div class="timeline-video-wrapper"><iframe src="\${embedUrl}" allowfullscreen></iframe></div>\`
                            : \`<div class="timeline-empty">Vídeo em breve...</div>\`
                        }
                    </div>
                </div>
            \`;
        }
        
        container.innerHTML = html;
    }

    async function loadChallengeVideos() {
        try {
            if (!supabaseClient) return;
            const { data, error } = await supabaseClient
                .from("system_config")
                .select("value")
                .eq("key", "challenge_videos")
                .single();
                
            if (data && data.value) {
                challengeVideos = JSON.parse(data.value);
            }
            renderChallengeTimeline(challengeVideos);
        } catch (err) {
            console.error("Erro ao carregar videos do desafio:", err);
            renderChallengeTimeline([]);
        }
    }

    window.openChallengeConfigModal = function() {
        const modal = document.getElementById("challenge-config-modal");
        if (!modal) return;
        
        for (let i = 0; i < 7; i++) {
            const input = document.getElementById(\`challenge-vid-\${i+1}\`);
            if (input) input.value = challengeVideos[i] || "";
        }
        
        modal.style.display = "flex";
    };

    window.saveChallengeConfig = async function() {
        const btn = document.getElementById("btn-save-challenge");
        if (btn) btn.innerHTML = "Salvando...";
        
        let newVideos = [];
        for (let i = 0; i < 7; i++) {
            const input = document.getElementById(\`challenge-vid-\${i+1}\`);
            newVideos.push(input ? input.value.trim() : "");
        }
        
        try {
            const { error } = await supabaseClient
                .from("system_config")
                .upsert({
                    key: "challenge_videos",
                    value: JSON.stringify(newVideos)
                }, { onConflict: "key" });
                
            if (error) throw error;
            
            challengeVideos = newVideos;
            renderChallengeTimeline(challengeVideos);
            showToast("Jornada do desafio salva com sucesso!");
            document.getElementById("challenge-config-modal").style.display = "none";
        } catch (err) {
            console.error("Erro ao salvar vídeos:", err);
            showToast("Erro ao salvar: Verifique suas permissões.");
        } finally {
            if (btn) btn.innerHTML = "Salvar Jornada";
        }
    };
`;

if (!appJs.includes('function renderChallengeTimeline')) {
    const attachPoint = 'window.openAccountModal = function() {';
    appJs = appJs.replace(attachPoint, logicHTML + '\n    ' + attachPoint);
    
    // Add loadChallengeVideos to init flow
    const initPoint = 'initAuth();';
    appJs = appJs.replace(initPoint, initPoint + '\n    loadChallengeVideos();');
    
    fs.writeFileSync('app.js', appJs);
    console.log('app.js modified');
} else {
    console.log('Logic already exists');
}
