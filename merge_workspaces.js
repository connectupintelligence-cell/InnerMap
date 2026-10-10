const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove nav-lib desktop & mobile
html = html.replace(/<li><a href="#" id="nav-lib" class="nav-link">.*?<\/a><\/li>/s, '');
html = html.replace(/<a href="#" id="mobile-nav-lib" class="mobile-nav-item">[\s\S]*?<\/a>/, '');

// 2. Rename Agenda to Agenda e Biblioteca
html = html.replace('Agenda de Exercícios', 'Agenda & Biblioteca');
html = html.replace('<span class="mobile-nav-label">Agenda</span>', '<span class="mobile-nav-label">Meu Progresso</span>');

// 3. Extract library-workspace innerHTML
const libStart = html.indexOf('<section id="library-workspace"');
const libEndTag = '</section>';
const libEnd = html.indexOf(libEndTag, libStart);

if (libStart !== -1 && libEnd !== -1) {
    const libBlock = html.substring(libStart, libEnd + libEndTag.length);
    
    // We want inside content: <section id="library-workspace" class="app-section" style="display: none;">...</section>
    // Just regex to remove the opening section tag and closing section tag
    let innerLib = libBlock.replace(/<section id="library-workspace".*?>/, '').replace(/<\/section>$/, '').trim();

    // 4. Append to agenda-workspace
    const agendaStart = html.indexOf('<section id="agenda-workspace"');
    const agendaEnd = html.indexOf('</section>', agendaStart);
    
    html = html.substring(0, agendaEnd) + 
           '\n\n<!-- MERGED LIBRARY CONTENT -->\n<hr style="border:0; border-top: 1px dashed rgba(255,255,255,0.15); margin: 3rem 0;">\n' + 
           innerLib + 
           '\n        ' + html.substring(agendaEnd);
           
    // 5. Remove library-workspace block
    const newLibStart = html.indexOf('<section id="library-workspace"');
    const newLibEnd = html.indexOf('</section>', newLibStart) + '</section>'.length;
    html = html.substring(0, newLibStart) + html.substring(newLibEnd);
}

fs.writeFileSync('index.html', html);

// Update app.js
let appJs = fs.readFileSync('app.js', 'utf8');

// In navAgenda event listener, add renderLibrary() and renderStats()
appJs = appJs.replace(/switchTab\(navAgenda, sectionAgenda\);/g, 'switchTab(navAgenda, sectionAgenda);\n            renderLibrary();\n            renderStats();');
appJs = appJs.replace(/switchTab\(mobileNavAgenda, sectionAgenda\);/g, 'switchTab(mobileNavAgenda, sectionAgenda);\n            renderLibrary();\n            renderStats();');

// Remove navLib references and listeners
appJs = appJs.replace(/const navLib = document.getElementById\("nav-lib"\);/, '');
appJs = appJs.replace(/const mobileNavLib = document.getElementById\("mobile-nav-lib"\);/, '');
appJs = appJs.replace(/const sectionLib = document.getElementById\("library-workspace"\);/, '');

// Remove the event listeners themselves
appJs = appJs.replace(/if \(navLib\) \{[\s\S]*?\}\s*if \(navNav\)/, 'if (navNav)');
appJs = appJs.replace(/if \(mobileNavLib\) \{[\s\S]*?\}\s*if \(mobileNavTherapist\)/, 'if (mobileNavTherapist)');

// Also remove switchTab logic if it specifically references sectionLib
appJs = appJs.replace(/if \(sectionLib\) sectionLib\.style\.display = "none";/g, '');

fs.writeFileSync('app.js', appJs);
console.log('Merged workspaces successfully.');
