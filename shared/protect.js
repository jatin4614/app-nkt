// ===== ANTI-SCREENSHOT & COPY PROTECTION =====

// Disable right-click
document.addEventListener('contextmenu', e => e.preventDefault());

// Disable text selection
document.addEventListener('selectstart', e => e.preventDefault());

// Disable copy/cut/paste
['copy', 'cut', 'paste'].forEach(evt => {
    document.addEventListener(evt, e => e.preventDefault());
});

// Disable print screen & common screenshot shortcuts
document.addEventListener('keydown', e => {
    // PrintScreen
    if (e.key === 'PrintScreen') {
        e.preventDefault();
        document.body.style.filter = 'blur(30px)';
        setTimeout(() => document.body.style.filter = '', 1500);
    }
    // Ctrl+Shift+S, Ctrl+Shift+I, Ctrl+S, Ctrl+P, Ctrl+U
    if (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'S' || e.key === 'P' || e.key === 'U')) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'S' || e.key === 's' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
    }
    // F12
    if (e.key === 'F12') e.preventDefault();
    // Cmd+Shift+3/4/5 (Mac screenshots) — can't fully prevent but detect
    if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        document.body.style.filter = 'blur(30px)';
        setTimeout(() => document.body.style.filter = '', 1500);
    }
});

// Blur on visibility change (tab switch / screenshot on mobile)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.filter = 'blur(30px)';
    } else {
        setTimeout(() => document.body.style.filter = '', 300);
    }
});

// Disable drag on images
document.addEventListener('dragstart', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
});

// Disable long press on mobile (prevents save image)
document.addEventListener('touchstart', e => {
    if (e.target.tagName === 'IMG') {
        e.target.style.pointerEvents = 'none';
        setTimeout(() => e.target.style.pointerEvents = '', 500);
    }
}, { passive: false });

// CSS additions via JS
const protectStyle = document.createElement('style');
protectStyle.textContent = `
    * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
    }
    img {
        -webkit-user-drag: none !important;
        pointer-events: none !important;
    }
    @media print {
        body { display: none !important; }
    }
`;
document.head.appendChild(protectStyle);
