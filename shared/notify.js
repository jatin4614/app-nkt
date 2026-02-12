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

    // Remove gate, show site
    const gate = document.getElementById('email-gate');
    gate.style.opacity = '0';
    gate.style.transition = 'opacity 0.8s';

    setTimeout(() => {
        gate.remove();
        if (window._gateUnlock) window._gateUnlock();
    }, 800);

    return false;
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
`;
document.head.appendChild(gateStyle);
