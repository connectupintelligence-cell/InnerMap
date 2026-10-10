const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Add openFullscreenVideo function
const fullScreenLogic = `
    window.openFullscreenVideo = function(url) {
        const overlay = document.createElement('div');
        overlay.id = 'custom-fs-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000; z-index: 999999; display: flex; flex-direction: column; align-items: center; justify-content: center;';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕ Fechar';
        closeBtn.style.cssText = 'position: absolute; top: 20px; right: 20px; z-index: 1000000; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; cursor: pointer; backdrop-filter: blur(5px);';
        closeBtn.onclick = () => {
            if(document.body.contains(overlay)) document.body.removeChild(overlay);
        };
        
        const iframe = document.createElement('iframe');
        // Adiciona ?autoplay=1 se não tiver, para já começar tocando ao expandir
        let autoUrl = url.includes('?') ? url + '&autoplay=1' : url + '?autoplay=1';
        iframe.src = autoUrl;
        iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
        iframe.setAttribute('allowfullscreen', 'true');
        
        overlay.appendChild(iframe);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
    };
`;

if (!appJs.includes('window.openFullscreenVideo')) {
    appJs = appJs.replace('function renderChallengeTimeline(videos) {', fullScreenLogic + '\n    function renderChallengeTimeline(videos) {');
}

// 2. Modify renderChallengeTimeline to add the Expand button
const oldVideoHTMLBlock1 = 'videoHTML = `<div class="timeline-video-wrapper"><video src="${embedUrl}" controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"></video></div>`;';
const oldVideoHTMLBlock2 = 'videoHTML = `<div class="timeline-video-wrapper"><iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe></div>`;';

const newVideoHTMLBlock1 = 'videoHTML = `<div class="timeline-video-wrapper"><video src="${embedUrl}" controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"></video></div><button onclick="window.openFullscreenVideo(\'${embedUrl}\')" style="margin-top: 0.8rem; width: 100%; max-width: 340px; padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg> Expandir Vídeo</button>`;';
const newVideoHTMLBlock2 = 'videoHTML = `<div class="timeline-video-wrapper"><iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe></div><button onclick="window.openFullscreenVideo(\'${embedUrl}\')" style="margin-top: 0.8rem; width: 100%; max-width: 340px; padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg> Expandir Vídeo</button>`;';

if (appJs.includes(oldVideoHTMLBlock1)) appJs = appJs.replace(oldVideoHTMLBlock1, newVideoHTMLBlock1);
if (appJs.includes(oldVideoHTMLBlock2)) appJs = appJs.replace(oldVideoHTMLBlock2, newVideoHTMLBlock2);

fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=140');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=140');
fs.writeFileSync('index.html', html);

console.log('Added custom fullscreen logic');
