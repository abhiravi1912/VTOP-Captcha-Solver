// VTOP CAPTCHA Solver - Content Script (VIT-AP )
// Uses API to solve CAPTCHA

let solveButton = null;
let statusDiv = null;

function init() {
  const observer = new MutationObserver(() => {
    const captchaImg = findCaptchaImage();
    if (captchaImg && !document.getElementById('vtop-captcha-btn')) {
      injectSolverUI(captchaImg);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const captchaImg = findCaptchaImage();
  if (captchaImg) injectSolverUI(captchaImg);
}

function findCaptchaImage() {
  const vitapSelectors = [
    '#captchaImage',
    'img#captchaImage',
    'img[id="captchaImage"]',
  ];
  for (const sel of vitapSelectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }

  const selectors = [
    'img[src*="captcha"]',
    'img[src*="Captcha"]',
    'img[id*="captcha"]',
    'img[id*="Captcha"]',
    '.captcha img',
    'img[src*="LoginServlet"]',
    'img[alt*="captcha" i]',
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }

  const captchaInput = findCaptchaInput();
  if (captchaInput) {
    const container = captchaInput.closest('form') || captchaInput.closest('div');
    if (container) {
      const imgs = Array.from(container.querySelectorAll('img'));
      const best = imgs.sort((a, b) =>
        (b.naturalWidth * b.naturalHeight) - (a.naturalWidth * a.naturalHeight)
      )[0];
      if (best) return best;
    }
  }

  const allImgs = Array.from(document.querySelectorAll('img'));
  return allImgs.find(img =>
    img.naturalWidth > 80 && img.naturalWidth < 500 && img.naturalHeight < 120
  ) || null;
}

function findCaptchaInput() {
  const selectors = [
    '#captchaStr',
    'input[name="captchaStr"]',
    'input[placeholder*="CAPTCHA" i]',
    'input[id*="captcha" i]',
    'input[name*="captcha" i]',
    '#captcha'
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

function injectSolverUI(captchaImg) {
  solveButton = document.createElement('button');
  solveButton.id = 'vtop-captcha-btn';
  solveButton.textContent = 'Auto-Solve CAPTCHA';
  solveButton.addEventListener('click', solveCaptcha);

  statusDiv = document.createElement('div');
  statusDiv.id = 'vtop-captcha-status';
  statusDiv.textContent = 'Click to solve CAPTCHA';

  const parent = captchaImg.parentNode;
  parent.insertBefore(solveButton, captchaImg.nextSibling);
  parent.insertBefore(statusDiv, solveButton.nextSibling);
}

async function solveCaptcha() {
  const captchaImg = findCaptchaImage();
  if (!captchaImg) {
    setStatus('CAPTCHA image not found', 'error'); return;
  }
  const captchaInput = findCaptchaInput();
  if (!captchaInput) {
    setStatus('CAPTCHA input field not found', 'error'); return;
  }

  setStatus('Reading CAPTCHA...', 'loading');
  solveButton.disabled = true;

  try {
    const { apiKey } = await chrome.storage.sync.get('apiKey');
    if (!apiKey) {
      setStatus('No API key. Click the extension icon to add your API key.', 'error');
      solveButton.disabled = false;
      return;
    }

    const base64Image = await imageToBase64(captchaImg);
    setStatus('Solving CAPTCHA...', 'loading');

    const captchaText = await callGroqAPI(base64Image, apiKey);

    if (captchaText) {
      captchaInput.value = captchaText;
      captchaInput.dispatchEvent(new Event('input', { bubbles: true }));
      captchaInput.dispatchEvent(new Event('change', { bubbles: true }));
      setStatus(` Solved: "${captchaText}"`, 'success');
    } else {
      setStatus(' Could not read CAPTCHA. Try refreshing and solving again.', 'error');
    }
  } catch (err) {
    console.error('VTOP Solver error:', err);
    setStatus('❌ Error: ' + err.message, 'error');
  }

  solveButton.disabled = false;
}

async function imageToBase64(imgEl) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const tryDraw = () => {
      canvas.width = imgEl.naturalWidth || imgEl.width || 200;
      canvas.height = imgEl.naturalHeight || imgEl.height || 60;
      ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png').split(',')[1]);
    };
    if (imgEl.complete && imgEl.naturalWidth > 0) {
      tryDraw();
    } else {
      imgEl.onload = tryDraw;
      imgEl.onerror = () => reject(new Error('Failed to load CAPTCHA image'));
    }
  });
}

async function callGroqAPI(base64Image, apiKey) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 20,
      temperature: 0.1,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${base64Image}`
              }
            },
            {
              type: 'text',
              text: 'This is a CAPTCHA image from a college login page. The CAPTCHA consists of exactly 6 alphanumeric characters (only letters and numbers, no spaces, no special characters). Reply with ONLY the exact 6 characters you see — no explanation, nothing else. Just the 6 characters.'
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'API request failed');
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  const cleaned = text ? text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : null;
  return cleaned ? cleaned.slice(0, 6) : null;
}

function setStatus(message, type) {
  if (!statusDiv) return;
  statusDiv.textContent = message;
  statusDiv.className = 'vtop-captcha-status-' + type;
}

init();
