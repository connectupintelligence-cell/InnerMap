const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split('\n');
const insertPoint = lines.findIndex(l => l.includes('if (activeNav === mAgenda'));

if (insertPoint !== -1) {
    lines.splice(insertPoint + 1, 0, 
        '            if (activeNav === navDesafio && mobileNavDesafio) mobileNavDesafio.classList.add("active");',
        '            if (activeNav === mobileNavDesafio && navDesafio) navDesafio.classList.add("active");',
        '            if (activeNav === navTutorial && mobileNavTutorial) mobileNavTutorial.classList.add("active");',
        '            if (activeNav === mobileNavTutorial && navTutorial) navTutorial.classList.add("active");'
    );
}

fs.writeFileSync('app.js', lines.join('\n'));
