const fs = require('fs');

// 1. Injetar a tela de sucesso no index.html
let html = fs.readFileSync('index.html', 'utf8');

const successScreenHTML = `
                <!-- PAYMENT SUCCESS SCREEN -->
                <div id="screen-payment-success" class="app-screen">
                    <div class="glass-card" style="max-width: 600px; margin: 2rem auto; padding: 3rem 2rem; text-align: center; border-radius: 16px; border: 1px solid rgba(102, 252, 241, 0.4); background: rgba(10, 12, 22, 0.6); position: relative; overflow: hidden;">
                        
                        <!-- Confetti/Glow Background -->
                        <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(102, 252, 241, 0.1) 0%, transparent 60%); z-index: 0; pointer-events: none;"></div>

                        <div style="position: relative; z-index: 1;">
                            <div style="width: 80px; height: 80px; background: rgba(102, 252, 241, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; border: 2px solid var(--color-primary);">
                                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            
                            <h2 style="font-size: 1.8rem; color: var(--color-primary); margin-bottom: 0.5rem;">Pagamento Aprovado!</h2>
                            <p style="color: var(--color-text-muted); font-size: 1rem; margin-bottom: 2rem;">Sua assinatura foi processada com sucesso pela InfinitePay.</p>
                            
                            <!-- Demo do que comprou -->
                            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 1.5rem; text-align: left; margin-bottom: 2rem;">
                                <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">O que você desbloqueou:</h3>
                                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.8rem;">
                                    <li style="display: flex; gap: 0.5rem; align-items: flex-start;">
                                        <span style="color: var(--color-primary);">✓</span>
                                        <span style="font-size: 0.9rem; color: #ddd;">Acesso completo à Inteligência Artificial do InnerMap</span>
                                    </li>
                                    <li style="display: flex; gap: 0.5rem; align-items: flex-start;">
                                        <span style="color: var(--color-primary);">✓</span>
                                        <span style="font-size: 0.9rem; color: #ddd;">Histórico ilimitado e acompanhamento de Progresso</span>
                                    </li>
                                    <li style="display: flex; gap: 0.5rem; align-items: flex-start;">
                                        <span style="color: var(--color-primary);">✓</span>
                                        <span style="font-size: 0.9rem; color: #ddd;">Jornada de 7 Dias do Desafio & Tutoriais completos</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- Dias e Renovação -->
                            <div style="background: rgba(232, 168, 85, 0.1); border: 1px dashed #E8A855; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
                                <h4 style="color: #E8A855; margin: 0 0 0.5rem 0; font-size: 1.1rem;">Status do Plano</h4>
                                <p style="margin: 0 0 1rem 0; font-size: 0.95rem;">Faltam <strong id="success-days-left" style="font-size: 1.2rem; color: #fff;">365</strong> dias para o seu plano expirar.</p>
                                
                                <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; font-size: 0.85rem; color: #ddd;">
                                    <strong style="color: #E8A855;">🎁 PROMOÇÃO:</strong> Se você renovar a sua assinatura <em>antes</em> desses dias acabarem, você ganha automaticamente <strong>15 dias gratuitos</strong> adicionados ao seu plano!
                                </div>
                            </div>
                            
                            <button class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem; box-shadow: 0 0 20px rgba(102, 252, 241, 0.4);" onclick="window.showScreen('app');">Começar a Usar Agora</button>
                        </div>
                    </div>
                </div>
`;

if (!html.includes('screen-payment-success')) {
    html = html.replace('</main>', successScreenHTML + '\n            </main>');
    
    // Bumping version for cache
    html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=145');
    html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=145');
    fs.writeFileSync('index.html', html);
    console.log('Injected screen-payment-success into index.html');
}

// 2. Add URL parsing and Account Modal logic in app.js
let appJs = fs.readFileSync('app.js', 'utf8');

const urlCheckLogic = `
    // Verifica se retornou do pagamento
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
        // Limpa a URL para ficar bonita
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Simular atualização de plano para demonstração
        if (state.subscription) {
            state.subscription.plan = urlParams.get('plan') || 'yearly';
            // Data atual como inicio
            state.subscription.date = new Date().toLocaleDateString('pt-BR');
        }
        
        setTimeout(() => {
            showScreen('payment-success');
            // Animação confete simples
            if(window.confetti) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#66FCF1', '#45A29E', '#E8A855'] });
        }, 500);
    }
`;

// Insert the URL check into initApp
if (!appJs.includes('urlParams.get(\'payment\')')) {
    appJs = appJs.replace('async function initApp() {', 'async function initApp() {\n' + urlCheckLogic);
}

// Update the Account Modal logic to display days remaining and the 15-day offer
const oldAccountLogic = `var hasBonus = st.subscription.bonus_days ? (' (+ ' + st.subscription.bonus_days + 'd bônus)') : '';
                        planEl.textContent = "Plano Anual Premium" + hasBonus;`;

const newAccountLogic = `
                        var hasBonus = st.subscription.bonus_days ? (' (+ ' + st.subscription.bonus_days + 'd bônus)') : '';
                        
                        // Calculo de dias restantes simulado
                        const activationDate = window.parseBrDate ? window.parseBrDate(st.subscription.date) : new Date();
                        const currentDate = new Date();
                        let diffTime = currentDate - activationDate;
                        if (isNaN(diffTime)) diffTime = 0;
                        const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        const totalDays = st.subscription.plan === 'yearly' ? 365 : 30;
                        const daysRemaining = Math.max(0, totalDays - daysElapsed);
                        
                        planEl.innerHTML = \`<div style="margin-bottom: 0.5rem;"><strong>Plano Atual:</strong> Premium (\${st.subscription.plan === 'yearly' ? 'Anual' : 'Mensal'})\${hasBonus}</div>
                                            <div style="font-size: 0.9rem; color: var(--color-primary);">Faltam <strong>\${daysRemaining} dias</strong> para o plano expirar.</div>
                                            <div style="margin-top: 1rem; padding: 1rem; background: rgba(232, 168, 85, 0.1); border: 1px dashed #E8A855; border-radius: 8px;">
                                                <strong style="color:#E8A855;">Oferta de Renovação!</strong><br>
                                                <span style="font-size:0.85rem; color:#ddd;">Renove agora mesmo e ganhe <strong>15 dias grátis</strong> na sua nova assinatura!</span>
                                                <button class="btn btn-outline" style="width: 100%; margin-top: 0.8rem; font-size: 0.85rem; padding: 0.5rem;" onclick="alert('Redirecionando para checkout InfinitePay...');">Renovar e Ganhar Bônus</button>
                                            </div>\`;
`;

if (appJs.includes(oldAccountLogic)) {
    appJs = appJs.replace(oldAccountLogic, newAccountLogic);
}

fs.writeFileSync('app.js', appJs);
console.log('App logic updated');
