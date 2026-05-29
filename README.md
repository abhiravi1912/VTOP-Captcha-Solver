# VTOP CAPTCHA Solver ⚡

A sleek, lightweight Chrome Extension that automatically solves CAPTCHA challenges on VIT VTOP portals (VIT-AP) using AI vision.

Designed with a premium light theme that blends seamlessly with the official VIT-AP portal's deep-blue gradient aesthetics.

---

## Features ✨

- **Auto-Solve & Auto-Fill**: Solves the login CAPTCHA image and fills the input box in a single click.
- **Sanitized Outputs**: Automatically cleans special characters/spaces and converts all characters to uppercase.
- **Length Verification**: Automatically enforces standard 6-character length limits.
- **Secure Key Storage**: Saves your API keys securely inside your local browser storage (`chrome.storage.sync`).
- **Seamless Integration**: Styled specifically to match the native login forms and header gradients of the VTOP portal.

---

## Installation Guide 🚀

Since this is a custom extension, you can install it via Developer Mode:

1. **Download the Code**: Clone this repository or download the ZIP file and extract it.
   ```bash
   git clone https://github.com/your-username/vtop-captcha-solver.git
   ```
2. **Open Extensions Page**: Open Google Chrome and navigate to:
   ```text
   chrome://extensions/
   ```
3. **Enable Developer Mode**: Turn on the **"Developer mode"** toggle in the top-right corner.
4. **Load the Extension**: Click **"Load unpacked"** in the top-left corner and select the extracted `vtop-captcha-solver` directory.
5. The extension logo will now appear in your browser's extension list!

---

## Obtaining a Groq API Key 🔑

To use this extension, you need an API key from Groq:
1. Go to the [Groq Console API Keys](https://console.groq.com/keys).
2. Sign up or log in using Google or GitHub.
3. Click **"Create API Key"**, label it, and copy the generated key (starts with `gsk_`).
4. Paste the key into the extension popup.

---

## How to Use 🖱️

1. Click the **Extension Icon** in your Chrome toolbar.
2. Enter your API Key and click **Save Key**.
3. Go to the VTOP login page.
4. Click the **⚡ Auto-Solve CAPTCHA** button located next to the CAPTCHA image.
5. The CAPTCHA will be read, solved, and filled in automatically.

---

## Project Structure 📁

```text
├── manifest.json       # Extension configuration (Manifest V3)
├── content.js          # Main scraper, image converter, and API solver runner
├── content.css         # Styling for the injected button and status alerts
├── popup.html          # HTML UI for the API key input popup
├── popup.js            # Settings controller to save and retrieve keys
└── icon.png            # Extension logo icon
```

---

## Tech Stack 🛠️

- **Frontend**: HTML5, Vanilla CSS3 (Custom gradients, transitions, slate-light variables).
- **Core Scripting**: Vanilla JavaScript (ES6+, DOM MutationObservers, Canvas base64 converters).
- **Extension API**: Manifest V3, Storage API.
