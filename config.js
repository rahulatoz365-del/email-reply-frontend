// Extension configuration - immutable settings object
const CONFIG = Object.freeze({

    // Backend server URL
    API_BASE_URL: "https://email-reply-s1h6.onrender.com",

    // API endpoint paths
    API_ENDPOINTS: {
        GENERATE: "/api/email/generate",
        HEALTH: "/api/email/health",
        TONES: "/api/email/tones"
    },

    // Tone options for reply generation
    TONES: [
        { value: "professional", label: "Professional" },
        { value: "casual", label: "Casual" },
        { value: "friendly", label: "Friendly" },
        { value: "aggressive", label: "Direct" }
    ],

    // Panel and animation settings
    UI: {
        PANEL_WIDTH: 260,
        ANIMATION_DURATION: 150,
        SUCCESS_TIMEOUT: 1200,
        DEBOUNCE_DELAY: 200
    },

    // Retry settings for cold start handling
    RETRY: {
        MAX_ATTEMPTS: 3,
        INITIAL_DELAY: 1000,
        BACKOFF_MULTIPLIER: 2
    },

    // Gmail DOM element selectors
    SELECTORS: {
        SEND_BUTTON: 'div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3[role="button"]',
        CONTAINER: '.dC',
        COMPOSE_BOX: 'div[role="textbox"][aria-label*="Message"], div[aria-label*="Body"], div.Am.Al.editable, div[g_editable="true"]',
        EMAIL_BODY: '.a3s.aiL, .ii.gt, .h7',
        EMAIL_SUBJECT: 'h2[data-thread-perm-id], h2.hP, .hP'
    }
});