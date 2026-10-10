const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// Fix listeners for Desafio and Tutorial to use switchTab
appJs = appJs.replace(
    'if (navDesafio) navDesafio.addEventListener("click", (e) => { e.preventDefault(); showScreen("desafio"); updateActiveNav("nav-desafio", "mobile-nav-desafio"); });',
    'if (navDesafio) navDesafio.addEventListener("click", (e) => { e.preventDefault(); switchTab(navDesafio, sectionApp); showScreen("desafio"); });'
);
appJs = appJs.replace(
    'if (mobileNavDesafio) mobileNavDesafio.addEventListener("click", (e) => { e.preventDefault(); showScreen("desafio"); updateActiveNav("nav-desafio", "mobile-nav-desafio"); });',
    'if (mobileNavDesafio) mobileNavDesafio.addEventListener("click", (e) => { e.preventDefault(); switchTab(mobileNavDesafio, sectionApp); showScreen("desafio"); });'
);

appJs = appJs.replace(
    'if (navTutorial) navTutorial.addEventListener("click", (e) => { e.preventDefault(); showScreen("tutorial"); updateActiveNav("nav-tutorial", "mobile-nav-tutorial"); });',
    'if (navTutorial) navTutorial.addEventListener("click", (e) => { e.preventDefault(); switchTab(navTutorial, sectionApp); showScreen("tutorial"); });'
);
appJs = appJs.replace(
    'if (mobileNavTutorial) mobileNavTutorial.addEventListener("click", (e) => { e.preventDefault(); showScreen("tutorial"); updateActiveNav("nav-tutorial", "mobile-nav-tutorial"); });',
    'if (mobileNavTutorial) mobileNavTutorial.addEventListener("click", (e) => { e.preventDefault(); switchTab(mobileNavTutorial, sectionApp); showScreen("tutorial"); });'
);

// Fix array references to undefined navLib, mLib, sectionLib
appJs = appJs.replace(
    '[navApp, navAgenda, navLib, navNav, navTherapist, mApp, mAgenda, mLib, mTherapist]',
    '[navApp, navAgenda, navDesafio, navTutorial, navNav, navTherapist, mApp, mAgenda, mobileNavDesafio, mobileNavTutorial, mTherapist]'
);
appJs = appJs.replace(
    '[sectionApp, sectionAgenda, sectionLib, sectionRag]',
    '[sectionApp, sectionAgenda, sectionRag]'
);

// Clean up switchTab logic for navLib and mLib
appJs = appJs.replace(
    'const mLib = document.getElementById("mobile-nav-lib");\n',
    ''
);
appJs = appJs.replace(
    /if \(activeNav === navLib && mLib\) mLib\.classList\.add\("active"\);\n\s*if \(activeNav === mLib && navLib\) navLib\.classList\.add\("active"\);/,
    `if (activeNav === navDesafio && mobileNavDesafio) mobileNavDesafio.classList.add("active");
            if (activeNav === mobileNavDesafio && navDesafio) navDesafio.classList.add("active");
            if (activeNav === navTutorial && mobileNavTutorial) mobileNavTutorial.classList.add("active");
            if (activeNav === mobileNavTutorial && navTutorial) navTutorial.classList.add("active");`
);

fs.writeFileSync('app.js', appJs);
console.log('Fixed undefined vars successfully.');
