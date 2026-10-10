const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

const oldGetEmbed = `    function getEmbedUrl(url) {
        if (!url) return "";
        try {
            let videoId = "";
            if (url.includes("youtube.com/watch")) {
                videoId = new URL(url).searchParams.get("v");
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1]?.split("?")[0];
            } else if (url.includes("youtube.com/embed/")) {
                return url;
            }
            if (videoId) return \`https://www.youtube.com/embed/\${videoId}\`;
            return url; // fallback for vimeo or others if they pasted embed directly
        } catch (e) {
            return url;
        }
    }`;

const newGetEmbed = `    function getEmbedUrl(url) {
        if (!url) return "";
        try {
            let videoId = "";
            if (url.includes("youtube.com/watch")) {
                videoId = new URL(url).searchParams.get("v");
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1]?.split("?")[0];
            } else if (url.includes("youtube.com/shorts/")) {
                videoId = url.split("youtube.com/shorts/")[1]?.split("?")[0];
            } else if (url.includes("youtube.com/embed/")) {
                return url;
            }
            if (videoId) return \`https://www.youtube.com/embed/\${videoId}\`;
            return url; // fallback for vimeo or others if they pasted embed directly
        } catch (e) {
            return url;
        }
    }`;

appJs = appJs.replace(oldGetEmbed, newGetEmbed);
fs.writeFileSync('app.js', appJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=138');
html = html.replace(/styles\.css\?v=\d+/g, 'styles.css?v=138');
fs.writeFileSync('index.html', html);

console.log("getEmbedUrl fixed for Shorts");
