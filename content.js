(function() {
    'use strict';

    // Track generation state and active UI elements
    const state = {
        isGenerating: false,
        activePanel: null
    };

    // Entry point - sets up observers and injects buttons
    function init() {
        observeDOM();
        injectButtons();
        setTimeout(injectButtons, 1500);
        setTimeout(injectButtons, 3000);
    }

    // Watches for Gmail DOM changes to inject buttons into new compose windows
    function observeDOM() {
        const observer = new MutationObserver(debounce(injectButtons, CONFIG.UI.DEBOUNCE_DELAY));
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Finds all Send buttons and adds AI Reply button next to each
    function injectButtons() {
        const sendButtons = document.querySelectorAll(CONFIG.SELECTORS.SEND_BUTTON);

        sendButtons.forEach(sendButton => {
            const container = sendButton.closest(CONFIG.SELECTORS.CONTAINER);
            if (!container || container.querySelector('.ai-reply-btn')) return;

            const aiButton = createButton();
            aiButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleButtonClick(aiButton, sendButton);
            });
            aiButton.addEventListener('mouseenter', (e) => e.stopPropagation());
            container.appendChild(aiButton);
        });
    }

    // Creates the AI Reply button element
    function createButton() {
        const button = document.createElement('div');
        button.className = 'ai-reply-btn';
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.textContent = 'AI Reply';
        return button;
    }

    // Handles AI Reply button click - toggles panel or shows error
    function handleButtonClick(aiButton, sendButton) {
        if (state.activePanel) {
            closePanel();
            return;
        }

        const composeForm = sendButton.closest('form') || sendButton.closest('.M9');
        const messageBody = composeForm?.querySelector(CONFIG.SELECTORS.COMPOSE_BOX);

        if (!messageBody) {
            showNotification('Could not find compose area.', 'error');
            return;
        }

        openPanel(aiButton, messageBody);
    }

    // Creates and displays the tone selection panel
    function openPanel(anchorButton, messageBody) {
        const panel = document.createElement('div');
        panel.className = 'ai-dropdown-panel';
        panel.innerHTML = getPanelHTML();

        document.body.appendChild(panel);
        state.activePanel = panel;

        positionPanel(panel, anchorButton);
        setupPanelEvents(panel, messageBody);
    }

    // Returns HTML markup for the panel
    function getPanelHTML() {
        const toneOptions = CONFIG.TONES
            .map(t => `<option value="${t.value}">${t.label}</option>`)
            .join('');

        return `
            <div class="ai-panel-header">
                <button class="ai-close-btn" type="button" aria-label="Close">&times;</button>
            </div>
            <div class="ai-form-group">
                <label class="ai-label" for="ai-tone-select">Tone</label>
                <select class="ai-select" id="ai-tone-select">${toneOptions}</select>
            </div>
            <button class="ai-generate-btn" id="ai-generate-btn" type="button">Generate Reply</button>
            <div class="ai-status" id="ai-status"></div>
        `;
    }

    // Positions panel above or below the anchor button within viewport bounds
    function positionPanel(panel, anchor) {
        const rect = anchor.getBoundingClientRect();
        const panelHeight = panel.offsetHeight;
        const panelWidth = CONFIG.UI.PANEL_WIDTH;

        let top = rect.top - panelHeight - 8;
        let left = rect.left;

        if (top < 8) top = rect.bottom + 8;
        if (left + panelWidth > window.innerWidth - 8) left = window.innerWidth - panelWidth - 8;
        if (left < 8) left = 8;

        panel.style.top = `${top}px`;
        panel.style.left = `${left}px`;
    }

    // Binds close, generate, and dismiss events to panel
    function setupPanelEvents(panel, messageBody) {
        const closeBtn = panel.querySelector('.ai-close-btn');
        const generateBtn = panel.querySelector('#ai-generate-btn');
        const toneSelect = panel.querySelector('#ai-tone-select');

        closeBtn.addEventListener('click', closePanel);
        generateBtn.addEventListener('click', () => generateReply(toneSelect.value, messageBody, panel));

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
            document.addEventListener('keydown', handleEscapeKey);
        }, 50);
    }

    // Closes panel when clicking outside
    function handleOutsideClick(e) {
        if (state.activePanel && !state.activePanel.contains(e.target) && !e.target.classList.contains('ai-reply-btn')) {
            closePanel();
        }
    }

    // Closes panel on Escape key
    function handleEscapeKey(e) {
        if (e.key === 'Escape' && state.activePanel) closePanel();
    }

    // Removes panel from DOM and cleans up event listeners
    function closePanel() {
        if (state.activePanel) {
            state.activePanel.remove();
            state.activePanel = null;
        }
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleEscapeKey);
    }

    // Main API call - wakes server, sends request, inserts reply
    async function generateReply(tone, messageBody, panel) {
        if (state.isGenerating) return;
        state.isGenerating = true;

        const generateBtn = panel.querySelector('#ai-generate-btn');
        const status = panel.querySelector('#ai-status');

        setButtonLoading(generateBtn, true);
        showStatus(status, 'Connecting to server...', 'info');

        try {
            const emailContent = extractEmailContent();
            if (!emailContent.message) throw new Error('Could not read email content.');

            const isServerReady = await wakeUpServer(status);
            if (!isServerReady) throw new Error('Server is starting up. Please try again in 30 seconds.');

            showStatus(status, 'Generating reply...', 'info');

            const data = await fetchWithTimeout(
                `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.GENERATE}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: emailContent.message,
                        subject: emailContent.subject,
                        tone: tone
                    })
                },
                60000
            );

            if (!data.success) throw new Error(data.errorMsg || 'Generation failed.');

            insertReply(messageBody, data.reply);
            showStatus(status, 'Reply generated.', 'success');
            setTimeout(closePanel, CONFIG.UI.SUCCESS_TIMEOUT);

        } catch (error) {
            console.error('[AI Reply]', error);
            const errorMessage = getErrorMessage(error);
            showStatus(status, errorMessage, 'error');
            setButtonLoading(generateBtn, false);
        } finally {
            state.isGenerating = false;
        }
    }

    // Converts technical errors to user-friendly messages
    function getErrorMessage(error) {
        const msg = error.message;
        if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Connection reset')) {
            return 'Server is waking up. Please wait 30 seconds and try again.';
        }
        if (msg.includes('timeout')) return 'Request timed out. Please try again.';
        return msg;
    }

    // Pings health endpoint to wake up Render free tier server
    async function wakeUpServer(statusElement) {
        const healthUrl = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.HEALTH}`;
        const maxAttempts = 3;
        const timeout = 30000;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                showStatus(statusElement, `Connecting to server (${attempt}/${maxAttempts})...`, 'info');
                const response = await fetchWithTimeout(healthUrl, { method: 'GET' }, timeout);
                if (response && response.status === 'running') return true;
            } catch (error) {
                console.log(`[AI Reply] Health check ${attempt} failed:`, error.message);
                if (attempt < maxAttempts) {
                    showStatus(statusElement, 'Server is starting up. Retrying...', 'info');
                    await sleep(5000);
                }
            }
        }
        return false;
    }

    // Wraps fetch with AbortController for timeout support
    async function fetchWithTimeout(url, options, timeout = 30000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') throw new Error('Request timeout. Server may be starting up.');
            throw error;
        }
    }

    // Extracts email body and subject from Gmail DOM
    function extractEmailContent() {
        let message = '';
        let subject = '';

        const emailBodies = document.querySelectorAll(CONFIG.SELECTORS.EMAIL_BODY);
        if (emailBodies.length > 0) {
            message = emailBodies[emailBodies.length - 1].innerText.trim();
        }

        if (!message) {
            const quoted = document.querySelector('.gmail_quote');
            if (quoted) message = quoted.innerText.trim();
        }

        const subjectEl = document.querySelector(CONFIG.SELECTORS.EMAIL_SUBJECT);
        if (subjectEl) {
            subject = subjectEl.innerText.replace(/^(Re:|Fwd:)\s*/gi, '').trim();
        }

        return { message, subject };
    }

    // Inserts formatted reply into Gmail compose box
    function insertReply(messageBody, reply) {
        if (!messageBody || !reply) return;

        messageBody.focus();
        const formatted = reply
            .split('\n\n')
            .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
            .join('');

        messageBody.innerHTML = formatted;
        messageBody.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Toggles button between loading and default state
    function setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<span class="ai-spinner"></span> Generating...';
        } else {
            button.disabled = false;
            button.textContent = 'Generate Reply';
        }
    }

    // Updates status element with message and type
    function showStatus(element, message, type) {
        element.textContent = message;
        element.className = `ai-status visible ${type}`;
    }

    // Shows temporary toast notification at bottom of screen
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `ai-status visible ${type}`;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10002;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Limits function execution rate
    function debounce(fn, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Promise-based delay
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();