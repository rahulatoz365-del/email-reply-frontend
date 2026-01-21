# AI Email Reply Chrome Extension

## Overview

This is a Chrome extension that integrates with Gmail and the Email Reply AI Service. It adds an **“AI Reply”** button to the Gmail compose area, lets you choose a tone, and automatically generates a reply using the backend API.

---

## Tech Stack

- Chrome Extension (Manifest v3)
- Vanilla JavaScript (`content.js`, `config.js`)
- CSS (`styles.css`)
- Backend API: Email Reply AI Service (OpenRouter-based)

---

## Initialization / Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ai-email-reply-extension.git
cd ai-email-reply-extension
```

### 2. (Optional) Configure Backend URL

Open `config.js` and verify or update:

```js
const CONFIG = Object.freeze({
    API_BASE_URL: "https://email-reply-s1h6.onrender.com",
    // ...
});
```

Set `API_BASE_URL` to your deployed backend URL.

---

## Load Extension in Chrome (Development)

1. Open **Google Chrome**.
2. Go to `chrome://extensions/`.
3. Enable **Developer mode** (top-right toggle).
4. Click **“Load unpacked”**.
5. Select the project folder (where `manifest.json` is located).

The extension is now installed.

---

## Usage

1. Open **Gmail** in Chrome (`https://mail.google.com/`).
2. Start composing or replying to an email.
3. Next to the **Send** button, you will see an **“AI Reply”** button.
4. Click **“AI Reply”**:
   - A small panel opens.
   - Choose a reply **tone**.
   - Click **“Generate Reply”**.
5. The generated reply is inserted directly into the Gmail compose box.

---

## Files Overview

- `manifest.json` – Chrome extension manifest (v3 configuration).
- `config.js` – API base URL, endpoints, tones, and Gmail DOM selectors.
- `content.js` – Main content script; injects button, calls backend, updates UI.
- `styles.css` – Styles for the AI button, dropdown panel, and status messages.
- `icons/icon.png` – Extension icon.
