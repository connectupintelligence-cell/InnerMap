const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// Add "Excluir" button to the card header
const oldHeader = `<div class="card-header">
                        <span class="card-date">\${item.date}</span>
                        <span class="card-status-pill">\${item.rating}</span>
                    </div>`;

const newHeader = `<div class="card-header" style="display:flex; align-items:center; gap: 8px;">
                        <span class="card-date">\${item.date}</span>
                        <span class="card-status-pill">\${item.rating}</span>
                        <button class="btn-delete-progresso" data-date="\${item.date}" data-phrase="\${cleanPhrase.replace(/"/g, '&quot;')}" style="margin-left:auto; background:none; border:none; color:#ea4335; font-size:0.75rem; font-weight:700; cursor:pointer; padding:4px 8px; border-radius:4px; text-decoration:underline;">Excluir</button>
                    </div>`;

if (appJs.includes(oldHeader)) {
    appJs = appJs.replace(oldHeader, newHeader);
}

// Attach event listeners for btn-delete-progresso inside grouped[cat].forEach?
// It's better to attach them AFTER appending to listContainer, or use event delegation on libraryContainer.
const deleteDelegationLogic = `
    // DELEGAÇÃO DE EVENTOS PARA BOTÃO DE EXCLUIR NO PROGRESSO
    const libraryContainer = document.getElementById("library-container");
    if (libraryContainer && !libraryContainer.dataset.deleteBound) {
        libraryContainer.dataset.deleteBound = "true";
        libraryContainer.addEventListener("click", async (e) => {
            const btnDelete = e.target.closest('.btn-delete-progresso');
            if (btnDelete) {
                e.stopPropagation();
                const itemDate = btnDelete.dataset.date;
                const itemPhrase = btnDelete.dataset.phrase;
                
                if (confirm("Tem certeza que deseja excluir esta reorganização (\\" " + itemPhrase + " \\") do seu progresso?")) {
                    // Remover do state.history
                    const index = state.history.findIndex(i => i.date === itemDate && fixMojibake(i.phrase) === itemPhrase);
                    if (index !== -1) {
                        const removedItem = state.history.splice(index, 1)[0];
                        state.saveHistory(state.history); // Assuming saveHistory exists, or we just save to SafeStorage/Supabase
                        
                        // Atualizar Supabase se logado
                        if (state.currentUser && window.supabaseClient) {
                            try {
                                if (removedItem.id) {
                                    await window.supabaseClient.from("user_practices").delete().eq("id", removedItem.id);
                                } else {
                                    // Se não tem ID, tentar deletar baseado na data
                                    await window.supabaseClient.from("user_practices").delete().eq("user_id", state.currentUser.id).eq("created_at", removedItem.date);
                                }
                            } catch (err) {
                                console.warn("Erro ao deletar do supabase", err);
                            }
                        }
                        
                        // Atualizar a interface do Meu Progresso
                        if (typeof window.renderLibrary === "function") window.renderLibrary();
                        if (typeof window.renderStats === "function") window.renderStats();
                        showToast("Reorganização excluída do seu progresso.");
                    }
                }
            }
        });
    }
`;

// Insert the delegation logic near the end of renderLibrary function
const insertTarget = `        for (const cat in grouped) {`;
if (appJs.includes(insertTarget) && !appJs.includes("btn-delete-progresso")) {
    appJs = appJs.replace(insertTarget, deleteDelegationLogic + '\n' + insertTarget);
}

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=152');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=152');
fs.writeFileSync('index.html', html);

console.log('Delete feature added to Meu Progresso');
