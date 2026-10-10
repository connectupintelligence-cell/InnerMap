const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

const newCSS = `

/* ==========================================================================
   Desafio Timeline
   ========================================================================== */
.challenge-timeline-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    position: relative;
    padding-left: 20px;
    max-width: 800px;
    margin: 0 auto;
    text-align: left;
}

.challenge-timeline-container::before {
    content: '';
    position: absolute;
    left: 27px;
    top: 10px;
    bottom: 10px;
    width: 2px;
    background: rgba(45, 212, 191, 0.2);
}

.timeline-step {
    position: relative;
    padding-left: 2.5rem;
}

.timeline-marker {
    position: absolute;
    left: 0;
    top: 5px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-bg-dark);
    border: 2px solid var(--color-primary);
    z-index: 2;
    box-shadow: 0 0 10px rgba(45, 212, 191, 0.5);
}

.timeline-content {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 1.5rem;
    transition: var(--transition-smooth);
}

.timeline-content:hover {
    border-color: rgba(45, 212, 191, 0.4);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.timeline-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--color-text-main);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.timeline-title .day-badge {
    background: rgba(45, 212, 191, 0.15);
    color: var(--color-primary);
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.timeline-video-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    background: rgba(0,0,0,0.5);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.05);
}

.timeline-video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
}

.timeline-empty {
    text-align: center;
    padding: 2rem 1rem;
    color: var(--color-text-muted);
    font-size: 0.9rem;
    border: 1px dashed rgba(255,255,255,0.15);
    border-radius: 8px;
    background: rgba(255,255,255,0.01);
}
`;

if (!css.includes('.challenge-timeline-container')) {
    css += newCSS;
    fs.writeFileSync('styles.css', css);
    console.log('styles.css modified');
} else {
    console.log('CSS already exists');
}
