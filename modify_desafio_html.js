const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace screen-desafio completely
const desafioOldStart = html.indexOf('<div id="screen-desafio" class="app-screen">');
const desafioOldEnd = html.indexOf('<!-- TUTORIAL SCREEN -->', desafioOldStart);
const newDesafioHTML = `
                <!-- DESAFIO SCREEN -->
                <div id="screen-desafio" class="app-screen">
                    <h2 class="step-title">A Jornada (Desafio 7 Dias)</h2>
                    <p class="step-subtitle">Siga esta jornada de autoconhecimento. Um fio puxando o outro.</p>
                    
                    <div id="challenge-timeline" class="challenge-timeline-container">
                        <!-- Renderizado via JS -->
                        <div style="text-align:center; padding: 2rem; color: var(--color-text-muted);">Carregando jornada...</div>
                    </div>
                </div>

`;
html = html.substring(0, desafioOldStart) + newDesafioHTML + html.substring(desafioOldEnd);

// Insert Admin Config Button in Therapist Dashboard
const therapistDashMarker = '<h3 class="step-title" style="margin-bottom: 0;">Painel do Terapeuta</h3>';
const adminBtnHTML = `
                        <button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="window.openChallengeConfigModal()">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 5px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>Configurar Vídeos do Desafio
                        </button>
`;
if (html.includes(therapistDashMarker) && !html.includes('openChallengeConfigModal')) {
    html = html.replace(therapistDashMarker, therapistDashMarker + '\n' + adminBtnHTML);
}

// Add Admin Config Modal at the end of the body
const modalHTML = `
    <!-- Modal de Configuração do Desafio -->
    <div id="challenge-config-modal" class="modal-overlay" style="display: none; z-index: 9999;">
        <div class="modal-card glass-card" style="max-width: 600px; max-height: 90vh; overflow-y: auto; text-align: left; padding: 2rem;">
            <button class="modal-close-btn" onclick="document.getElementById('challenge-config-modal').style.display='none';">&times;</button>
            <h3 class="modal-title" style="color: var(--color-primary); margin-bottom: 0.5rem;">Configurar Vídeos da Jornada</h3>
            <p class="modal-subtitle" style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">Cole os links (YouTube) para os 7 vídeos do desafio. Deixe em branco se ainda não tiver o vídeo correspondente.</p>
            
            <div id="challenge-config-inputs" style="display: flex; flex-direction: column; gap: 1rem;">
                ${[1,2,3,4,5,6,7].map(i => `
                <div class="form-group">
                    <label style="display: block; font-size: 0.8rem; color: #E8A855; margin-bottom: 0.3rem;">Vídeo Dia ${i}</label>
                    <input type="url" id="challenge-vid-${i}" class="text-input" placeholder="Ex: https://youtube.com/watch?v=..." style="width: 100%; font-size: 0.85rem; padding: 0.6rem;">
                </div>
                `).join('')}
            </div>
            
            <button id="btn-save-challenge" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="window.saveChallengeConfig()">Salvar Jornada</button>
        </div>
    </div>
`;
if (!html.includes('id="challenge-config-modal"')) {
    html = html.replace('</body>', modalHTML + '\n</body>');
}

fs.writeFileSync('index.html', html);
console.log('index.html modified');
