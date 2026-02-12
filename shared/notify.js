// ===== EMAILJS NOTIFICATION SYSTEM =====
const EMAILJS_SERVICE = 'service_wr4mxwl';
const EMAILJS_TEMPLATE = 'template_iqx7wdv';
const EMAILJS_KEY = 'GQhw91MuVzJ_vwTn3';

// Load EmailJS SDK
let _emailjsReady = false;
(function() {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => {
        emailjs.init(EMAILJS_KEY);
        _emailjsReady = true;
        console.log('EmailJS ready');
    };
    s.onerror = () => console.error('EmailJS failed to load');
    document.head.appendChild(s);
})();

// Get girl name from meta tag
function getGirlName() {
    const meta = document.querySelector('meta[name="girl-name"]');
    return meta ? meta.content : 'Unknown';
}

// Get stored visitor email
function getVisitorEmail() {
    return sessionStorage.getItem('visitor_email') || 'unknown';
}

// Send notification with retry
function sendNotify(event, response) {
    const now = new Date();
    const time = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const params = {
        girl_name: getGirlName(),
        visitor_email: getVisitorEmail(),
        event: event,
        response: response || '—',
        time: time
    };

    function doSend() {
        if (typeof emailjs === 'undefined' || !_emailjsReady) {
            console.log('EmailJS not ready, retrying in 1s...');
            setTimeout(doSend, 1000);
            return;
        }
        emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params)
            .then(() => console.log('Email sent!'))
            .catch(err => console.error('EmailJS error:', err));
    }

    doSend();
}

// ===== EMAIL GATE =====
function createEmailGate(onUnlock) {
    const gate = document.createElement('div');
    gate.id = 'email-gate';
    gate.innerHTML = `
        <div class="gate-content">
            <p class="gate-lock">🔒</p>
            <p class="gate-title">This is a private invitation</p>
            <p class="gate-sub">Enter your email to continue</p>
            <form class="gate-form" onsubmit="return submitGate(event)">
                <input type="email" id="gate-email" placeholder="your@email.com" required autocomplete="email" />
                <button type="submit">Enter →</button>
            </form>
        </div>
    `;
    document.body.prepend(gate);

    // Hide all pages until unlocked
    document.querySelectorAll('.page, section').forEach(p => {
        if (p.id !== 'email-gate') p.style.display = 'none';
    });

    window._gateUnlock = onUnlock;
}

function submitGate(e) {
    e.preventDefault();
    const email = document.getElementById('gate-email').value.trim();
    if (!email) return false;

    sessionStorage.setItem('visitor_email', email);

    // Send "opened" notification
    sendNotify('opened the page', '—');

    // Check if it's time to unlock (00:01 AM IST, Feb 14 2025)
    showCountdownOrUnlock();

    return false;
}

// ===== COUNTDOWN TIMER =====
const UNLOCK_TIME = new Date('2025-02-14T00:01:00+05:30').getTime();

// Cheeky lines per girl
const COUNTDOWN_LINES = {
    'Mansi': { emoji: '😏', line: "Patience, Mansi... good things come to those who wait", sub: "Something's cooking for you 🔥" },
    'Parakastha': { emoji: '💃', line: "Not yet, Parakastha... the universe isn't ready for what's coming", sub: "Hang tight, superstar ✨" },
    'Nikita': { emoji: '🖤', line: "You're early. Typical. But even I can't rush this one", sub: "Good things take time... unlike your replies 😏" },
    'Prachi': { emoji: '💜', line: "Some things are worth the wait, Prachi... trust me on this one", sub: "Just a little longer 🤍" }
};

function showCountdownOrUnlock() {
    const now = Date.now();

    if (now >= UNLOCK_TIME) {
        // Time's up — unlock the site
        const gate = document.getElementById('email-gate');
        gate.style.opacity = '0';
        gate.style.transition = 'opacity 0.8s';
        setTimeout(() => {
            gate.remove();
            if (window._gateUnlock) window._gateUnlock();
        }, 800);
        return;
    }

    // Show countdown
    const girlName = getGirlName();
    const data = COUNTDOWN_LINES[girlName] || { emoji: '💘', line: "Not yet... something special is coming", sub: "Stay tuned ✨" };

    const gate = document.getElementById('email-gate');
    gate.querySelector('.gate-content').innerHTML = `
        <p class="countdown-emoji">${data.emoji}</p>
        <p class="countdown-line">${data.line}</p>
        <div class="countdown-timer" id="countdown-timer">
            <div class="countdown-unit">
                <span class="countdown-num" id="cd-days">00</span>
                <span class="countdown-label">days</span>
            </div>
            <div class="countdown-sep">:</div>
            <div class="countdown-unit">
                <span class="countdown-num" id="cd-hours">00</span>
                <span class="countdown-label">hours</span>
            </div>
            <div class="countdown-sep">:</div>
            <div class="countdown-unit">
                <span class="countdown-num" id="cd-mins">00</span>
                <span class="countdown-label">min</span>
            </div>
            <div class="countdown-sep">:</div>
            <div class="countdown-unit">
                <span class="countdown-num" id="cd-secs">00</span>
                <span class="countdown-label">sec</span>
            </div>
        </div>
        <p class="countdown-sub">${data.sub}</p>
        <p class="countdown-date">February 14th, 00:01 AM ❤️</p>
    `;

    // Start ticking
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = Date.now();
    const diff = UNLOCK_TIME - now;

    if (diff <= 0) {
        // Unlock!
        const gate = document.getElementById('email-gate');
        gate.style.opacity = '0';
        gate.style.transition = 'opacity 0.8s';
        setTimeout(() => {
            gate.remove();
            if (window._gateUnlock) window._gateUnlock();
        }, 800);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const d = document.getElementById('cd-days');
    const h = document.getElementById('cd-hours');
    const m = document.getElementById('cd-mins');
    const s = document.getElementById('cd-secs');

    if (d) d.textContent = String(days).padStart(2, '0');
    if (h) h.textContent = String(hours).padStart(2, '0');
    if (m) m.textContent = String(mins).padStart(2, '0');
    if (s) s.textContent = String(secs).padStart(2, '0');
}

// Gate styles
const gateStyle = document.createElement('style');
gateStyle.textContent = `
    #email-gate {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: #050505;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .gate-content {
        text-align: center;
        max-width: 400px;
        width: 100%;
    }

    .gate-lock {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
        animation: gatePulse 2s ease-in-out infinite;
    }

    @keyframes gatePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }

    .gate-title {
        font-family: 'Playfair Display', 'Cormorant Garamond', serif;
        font-size: clamp(1.2rem, 3vw, 1.6rem);
        font-style: italic;
        color: #e8e0d8;
        margin-bottom: 0.5rem;
    }

    .gate-sub {
        font-size: clamp(0.8rem, 2vw, 0.95rem);
        color: #666;
        margin-bottom: 2rem;
    }

    .gate-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }

    .gate-form input {
        width: 100%;
        max-width: 300px;
        padding: 0.9rem 1.2rem;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 4px;
        color: #f0f0f0;
        font-family: inherit;
        font-size: 1rem;
        text-align: center;
        outline: none;
        transition: border 0.3s;
    }

    .gate-form input:focus {
        border-color: rgba(200, 169, 126, 0.5);
    }

    .gate-form input::placeholder {
        color: #555;
    }

    .gate-form button {
        padding: 0.7rem 2.5rem;
        background: transparent;
        border: 1px solid rgba(200, 169, 126, 0.4);
        color: #c8a97e;
        font-family: inherit;
        font-size: 0.9rem;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 2px;
    }

    .gate-form button:hover {
        background: #c8a97e;
        color: #050505;
    }

    /* Countdown */
    .countdown-emoji {
        font-size: 3rem;
        margin-bottom: 1.5rem;
        animation: gatePulse 2s ease-in-out infinite;
    }

    .countdown-line {
        font-family: 'Playfair Display', 'Cormorant Garamond', serif;
        font-size: clamp(1rem, 3vw, 1.4rem);
        font-style: italic;
        color: #e8e0d8;
        max-width: 400px;
        line-height: 1.8;
        margin-bottom: 2.5rem;
        text-align: center;
    }

    .countdown-timer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .countdown-unit {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 60px;
    }

    .countdown-num {
        font-family: 'JetBrains Mono', 'Space Grotesk', monospace;
        font-size: clamp(2rem, 6vw, 3.5rem);
        font-weight: 600;
        color: #c8a97e;
        line-height: 1;
        letter-spacing: 2px;
    }

    .countdown-label {
        font-size: clamp(0.6rem, 1.5vw, 0.75rem);
        color: #555;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-top: 0.4rem;
    }

    .countdown-sep {
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        color: #333;
        font-weight: 300;
        padding-bottom: 1rem;
    }

    .countdown-sub {
        font-size: clamp(0.8rem, 2vw, 0.95rem);
        color: #666;
        font-style: italic;
        margin-bottom: 0.5rem;
    }

    .countdown-date {
        font-size: clamp(0.65rem, 1.5vw, 0.75rem);
        color: #444;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-top: 0.5rem;
    }
`;
document.head.appendChild(gateStyle);
