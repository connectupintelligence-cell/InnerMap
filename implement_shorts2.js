const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

const start = appJs.indexOf('function renderChallengeTimeline(videos) {');
const endStr = 'container.innerHTML = html;\n    }';
const end = appJs.indexOf(endStr, start) + endStr.length;

if (start !== -1 && end !== -1) {
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
    
    appJs = appJs.substring(0, start) + newRenderFn + appJs.substring(end);
    fs.writeFileSync('app.js', appJs);
    console.log('Update successful');
} else {
    console.log('Could not find function');
}
