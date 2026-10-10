const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// List of inline onclicks to remove from index.html because app.js already handles them cleanly
const inlineOnclicksToRemove = [
    'onclick="window.selectObjectiveMode(1);"',
    'onclick="window.selectObjectiveMode(2);"',
    'onclick="window.selectObjectiveMode(3);"',
    'onclick="window.selectObjectiveMode(4);"',
    'onclick="window.selectQuickTopic(this);"',
    'onclick="if(window.handleAiAnalysis) window.handleAiAnalysis();"',
    'onclick="if(window.handleAiContinue) window.handleAiContinue();"',
    'onclick="if(window.handleAiSkip) window.handleAiSkip();"',
    'onclick="if(window.handleToStep3) window.handleToStep3();"',
    'onclick="if(window.handleToStep4) window.handleToStep4();"',
    'onclick="if(window.handleFinish) window.handleFinish();"'
];

inlineOnclicksToRemove.forEach(str => {
    while (html.includes(str)) {
        html = html.replace(str, '');
    }
});

fs.writeFileSync("index.html", html, "utf8");
console.log("Successfully removed duplicate inline onclick handlers from index.html!");
