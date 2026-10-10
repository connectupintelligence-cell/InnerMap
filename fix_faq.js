const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldSummary = `<summary style="display: flex; align-items: center; justify-content: space-between; outline: none; list-style: none; user-select: none;">
                        <div>
                            <h2 class="faq-title" style="font-size: 1.4rem; margin: 0; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem; text-align: left;">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                Perguntas Frequentes (F.A.Q) & Como Funciona
                            </h2>
                            <p class="faq-subtitle" style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0.3rem 0 0 0; text-align: left;">Tire suas dúvidas sobre o funcionamento do Método InnerMap e a Reorganização Informacional</p>
                        </div>
                        <span style="font-size: 0.85rem; color: var(--color-primary); font-weight: 700; background: rgba(102, 252, 241, 0.12); padding: 0.45rem 0.9rem; border-radius: 8px; border: 1px solid rgba(102, 252, 241, 0.3); white-space: nowrap; margin-left: 1rem;">Clique para Expandir ▼</span>
                    </summary>`;

const newSummary = `<summary style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; outline: none; list-style: none; user-select: none;">
                        <div style="flex: 1 1 250px;">
                            <h2 class="faq-title" style="font-size: 1.2rem; margin: 0; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem; text-align: left;">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                Perguntas Frequentes
                            </h2>
                            <p class="faq-subtitle" style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0.3rem 0 0 0; text-align: left;">Tire suas dúvidas sobre o método</p>
                        </div>
                        <span style="font-size: 0.85rem; color: var(--color-primary); font-weight: 700; background: rgba(102, 252, 241, 0.12); padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid rgba(102, 252, 241, 0.3); white-space: nowrap; width: fit-content; text-align: center;">Clique p/ Expandir ▼</span>
                    </summary>`;

if (html.includes(oldSummary)) {
    html = html.replace(oldSummary, newSummary);
    html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=142');
    html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=142');
    fs.writeFileSync('index.html', html);
    console.log('FAQ fixed');
} else {
    console.log('FAQ section not found');
}
