const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldTutorialScreenStart = html.indexOf('<div id="screen-tutorial" class="app-screen">');
const oldTutorialScreenEnd = html.indexOf('<div id="screen-therapist"', oldTutorialScreenStart);

const newTutorialScreenHTML = `<div id="screen-tutorial" class="app-screen">
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
    html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=143');
    html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=143');
    fs.writeFileSync('index.html', html);
    console.log('Tutorial HTML updated');
} else {
    console.log('Could not find markers', oldTutorialScreenStart, oldTutorialScreenEnd);
}
