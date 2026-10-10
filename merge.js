const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The easiest way is to use regex or string replace.
// Let's replace the nav-lib from desktop
html = html.replace(/<li><a href="#" id="nav-lib" class="nav-link">.*?<\/a><\/li>/s, '');

// Replace nav-lib from mobile
html = html.replace(/<a href="#" id="mobile-nav-lib" class="mobile-nav-item">[\s\S]*?<\/a>/, '');

// Rename Agenda to Agenda e Biblioteca
html = html.replace('Agenda de Exercícios', 'Agenda & Biblioteca');
html = html.replace('<span class="mobile-nav-label">Agenda</span>', '<span class="mobile-nav-label">Progresso</span>');

// Extract Library contents:
// Search for <!-- BIBLIOTECA SCREEN --> and <div id="screen-library" class="app-screen">
// Search for <!-- DESAFIO SCREEN --> (or whatever is after it)
const libStart = html.indexOf('<div id="screen-library" class="app-screen">');
const libEnd = html.indexOf('<!-- DESAFIO SCREEN -->', libStart);

if (libStart !== -1 && libEnd !== -1) {
    const libBlock = html.substring(libStart, libEnd);
    
    // We want the inner contents of libBlock, without the wrapper.
    // The wrapper is <div id="screen-library" class="app-screen">
    // We can just grab the whole innerHTML.
    let innerLib = libBlock.replace('<div id="screen-library" class="app-screen">', '');
    // Remove the last </div>
    innerLib = innerLib.trim().replace(/<\/div>$/, '');

    // Now insert innerLib at the end of screen-agenda
    const agendaEnd = html.indexOf('<!-- BIBLIOTECA SCREEN -->');
    
    // We need to insert it right before the closing </div> of screen-agenda
    // Let's find the closing div of screen-agenda.
    // Actually, <!-- BIBLIOTECA SCREEN --> is right after the closing div of screen-agenda.
    // So the closing div is right before <!-- BIBLIOTECA SCREEN -->.
    const beforeAgendaEnd = html.lastIndexOf('</div>', agendaEnd);
    
    html = html.substring(0, beforeAgendaEnd) + 
           '\n\n<!-- HISTÓRICO E ESTATÍSTICAS INCORPORADOS -->\n<hr style="border:0; border-top: 1px solid rgba(255,255,255,0.1); margin: 3rem 0;">\n' + 
           innerLib + 
           '\n                </div>\n' + // close screen-agenda
           html.substring(agendaEnd);
           
    // Now remove the library screen block entirely
    const newLibStart = html.indexOf('<div id="screen-library" class="app-screen">');
    const newLibEnd = html.indexOf('<!-- DESAFIO SCREEN -->', newLibStart);
    html = html.substring(0, newLibStart) + html.substring(newLibEnd);
}

// Write HTML
fs.writeFileSync('index.html', html);

// Now update app.js
let appJs = fs.readFileSync('app.js', 'utf8');

appJs = appJs.replace('library: document.getElementById("screen-library"),', '');

// Update showScreen("library") to showScreen("agenda")
appJs = appJs.replace(/showScreen\("library"\)/g, 'showScreen("agenda")');
appJs = appJs.replace(/showScreen\('library'\)/g, "showScreen('agenda')");

// Remove nav-lib event listeners
appJs = appJs.replace(/const navLib = document.getElementById\("nav-lib"\);/, '');
appJs = appJs.replace(/const mobileNavLib = document.getElementById\("mobile-nav-lib"\);/, '');
appJs = appJs.replace(/if \(navLib\) navLib\.addEventListener.*?;\s*/g, '');
appJs = appJs.replace(/if \(mobileNavLib\) mobileNavLib\.addEventListener.*?;\s*/g, '');

fs.writeFileSync('app.js', appJs);
console.log('Merged Agenda and Library successfully.');
