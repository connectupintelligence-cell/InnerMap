const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Add desktop nav items
const desktopNavMarker = '<li><a href="#" id="nav-lib" class="nav-link"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>Minhas Reorganizações</a></li>';
const desktopTabs = `                <li><a href="#" id="nav-desafio" class="nav-link"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>Desafio</a></li>
                <li><a href="#" id="nav-tutorial" class="nav-link"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>Tutorial</a></li>`;
if(html.includes(desktopNavMarker) && !html.includes('nav-desafio')) {
    html = html.replace(desktopNavMarker, desktopNavMarker + '\n' + desktopTabs);
}

// 2. Add mobile nav items
const mobileNavMarker = '<a href="#" id="mobile-nav-lib" class="mobile-nav-item">\n            <svg class="mobile-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; margin-bottom: 0.2rem;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>\n            <span class="mobile-nav-label">Biblioteca</span>\n        </a>';

const mobileTabs = `        <a href="#" id="mobile-nav-desafio" class="mobile-nav-item">
            <svg class="mobile-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; margin-bottom: 0.2rem;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            <span class="mobile-nav-label">Desafio</span>
        </a>
        <a href="#" id="mobile-nav-tutorial" class="mobile-nav-item">
            <svg class="mobile-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; margin-bottom: 0.2rem;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <span class="mobile-nav-label">Tutorial</span>
        </a>`;
if(html.includes(mobileNavMarker) && !html.includes('mobile-nav-desafio')) {
    html = html.replace(mobileNavMarker, mobileNavMarker + '\n' + mobileTabs);
}

// 3. Add screens in HTML right before screen-therapist
const screensToAdd = `
                <!-- DESAFIO SCREEN -->
                <div id="screen-desafio" class="app-screen">
                    <h2 class="step-title">Desafio de Autoconhecimento</h2>
                    <p class="step-subtitle">Instruções de uso para o seu autoconhecimento profundo.</p>
                    <div class="glass-card" style="padding: 2rem; border-radius: 16px; text-align: left; margin-bottom: 2rem;">
                        <h3 style="color: var(--color-primary); margin-bottom: 1rem;">A Jornada do InnerMap</h3>
                        <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1rem;">
                            O processo de autoconhecimento é contínuo. Este espaço é dedicado a orientar você em sua jornada pessoal, mostrando como observar seus padrões diários e não apenas reagir a eles.
                        </p>
                        <ul style="color: var(--color-text-muted); line-height: 1.8; margin-left: 1.5rem;">
                            <li><strong>Identificação:</strong> Perceba quando um sentimento desconfortável surge sem julgamentos.</li>
                            <li><strong>Extração:</strong> Use a ferramenta de relato para jogar essa emoção para fora.</li>
                            <li><strong>Reorganização:</strong> Siga as práticas sugeridas (MFI e MDI) para desarmar a estrutura da crença.</li>
                            <li><strong>Ação:</strong> Aplique a microação do dia para ancorar sua nova realidade.</li>
                        </ul>
                    </div>
                </div>

                <!-- TUTORIAL SCREEN -->
                <div id="screen-tutorial" class="app-screen">
                    <h2 class="step-title">Tutorial do App</h2>
                    <p class="step-subtitle">Aprenda a usar cada funcionalidade de forma técnica.</p>
                    <div class="glass-card" style="padding: 2rem; border-radius: 16px; text-align: left; margin-bottom: 2rem;">
                        <h3 style="color: var(--color-primary); margin-bottom: 1rem;">O que faz cada botão?</h3>
                        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                            <div>
                                <strong style="color: #FFF;">Botão Início / Nova Sessão:</strong>
                                <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.25rem;">Inicia um novo processo de reorganização informacional. Aqui você escreve ou dita o seu relato (desabafo) para a Inteligência Artificial mapear.</p>
                            </div>
                            <div>
                                <strong style="color: #FFF;">Ícone de Microfone:</strong>
                                <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.25rem;">Permite que você dite o seu relato com a própria voz, facilitando o desabafo contínuo sem precisar digitar.</p>
                            </div>
                            <div>
                                <strong style="color: #FFF;">Aba Agenda:</strong>
                                <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.25rem;">Mostra as suas obrigações diárias de fortalecimento. Aqui você encontra as frases (decretos) que precisa repetir por 15 dias para ancorar sua reprogramação mental.</p>
                            </div>
                            <div>
                                <strong style="color: #FFF;">Aba Biblioteca:</strong>
                                <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.25rem;">Seu histórico completo. Todas as sessões anteriores, com suas respectivas leituras de padrão e microações, ficam salvas aqui para revisão futura.</p>
                            </div>
                        </div>
                    </div>
                </div>
`;
const screenTherapistMarker = '<div id="screen-therapist" class="app-screen">';
if(html.includes(screenTherapistMarker) && !html.includes('id="screen-desafio"')) {
    html = html.replace(screenTherapistMarker, screensToAdd + '\n                ' + screenTherapistMarker);
}

// 4. Update app.js (screens dictionary)
if(appJs.includes('paywall: document.getElementById("screen-paywall"),') && !appJs.includes('desafio: document.getElementById("screen-desafio")')) {
    appJs = appJs.replace('paywall: document.getElementById("screen-paywall"),', 'paywall: document.getElementById("screen-paywall"),\n        desafio: document.getElementById("screen-desafio"),\n        tutorial: document.getElementById("screen-tutorial"),');
}

// 5. Add event listeners in app.js
const eventListeners = `
    const navDesafio = document.getElementById("nav-desafio");
    const mobileNavDesafio = document.getElementById("mobile-nav-desafio");
    const navTutorial = document.getElementById("nav-tutorial");
    const mobileNavTutorial = document.getElementById("mobile-nav-tutorial");

    if (navDesafio) navDesafio.addEventListener("click", (e) => { e.preventDefault(); showScreen("desafio"); updateActiveNav("nav-desafio", "mobile-nav-desafio"); });
    if (mobileNavDesafio) mobileNavDesafio.addEventListener("click", (e) => { e.preventDefault(); showScreen("desafio"); updateActiveNav("nav-desafio", "mobile-nav-desafio"); });
    
    if (navTutorial) navTutorial.addEventListener("click", (e) => { e.preventDefault(); showScreen("tutorial"); updateActiveNav("nav-tutorial", "mobile-nav-tutorial"); });
    if (mobileNavTutorial) mobileNavTutorial.addEventListener("click", (e) => { e.preventDefault(); showScreen("tutorial"); updateActiveNav("nav-tutorial", "mobile-nav-tutorial"); });
`;
if(appJs.includes('const navTherapist = document.getElementById("nav-therapist");') && !appJs.includes('const navDesafio')) {
    appJs = appJs.replace('const navTherapist = document.getElementById("nav-therapist");', eventListeners + '\n    const navTherapist = document.getElementById("nav-therapist");');
}

fs.writeFileSync('index.html', html);
fs.writeFileSync('app.js', appJs);
console.log('Tabs added successfully.');
