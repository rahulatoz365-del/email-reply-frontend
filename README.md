# 📧 Email Reply Assistant (Chrome Extension)

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Chrome Extensions](https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](#)
[![Open Source](https://img.shields.io/badge/Open_Source-100000?style=for-the-badge&logo=github&logoColor=white)](#)

A sleek, lightweight Chrome Extension frontend designed to help users quickly draft and manage email replies directly from their browser. 

---

## 🛑 Why isn't this on the Chrome Web Store?

To keep this project completely free and avoid the Google Developer registration fee, I have chosen to host this extension exclusively on GitHub for the time being. 

You can easily bypass the store and install this extension directly into your browser in under a minute using **Chrome's Developer Mode**. (See the Installation guide below!).

---

## ✨ Features

* **Seamless Integration:** Injects a clean user interface directly into your browser/email client.
* **Quick Replies:** Streamlines the process of generating and sending email responses.
* **Lightweight:** Built with a focus on speed and minimal browser resource consumption.
* **Local Processing:** The frontend interacts seamlessly with the background scripts without needing heavy third-party dependencies.

---

## 🛠️ Technology Stack

* **Frontend:** HTML, CSS, JavaScript (ES6+)
* **Framework:** [Insert React/Vite/Vanilla JS - whichever you used]
* **Architecture:** Chrome Extension Manifest V3 (Background Service Workers, Content Scripts, Popup UI)

---

## 🚀 How to Install (Manual Setup)

Since this extension is not hosted on the Chrome Web Store, you will need to "sideload" it using Developer Mode. It’s incredibly simple:

### Step 1: Get the Code
Clone this repository to your local machine, or download it as a ZIP file and extract it.
```bash
git clone [https://github.com/rahulatoz365-del/email-reply-frontend.git](https://github.com/rahulatoz365-del/email-reply-frontend.git)

```

### Step 2: Open Chrome Extensions

1. Open Google Chrome.
2. Type `chrome://extensions/` in your URL bar and hit Enter.

### Step 3: Enable Developer Mode

In the top right corner of the Extensions page, toggle the **Developer mode** switch to **ON**.

### Step 4: Load the Extension

1. Click the **Load unpacked** button that appears in the top left.
2. Select the folder where you cloned/extracted this repository (Make sure you select the folder containing the `manifest.json` file!).
3. The extension is now installed! Pin it to your browser toolbar to start using it.
