const apiKeyInput = document.getElementById('apiKey');
const saveBtn = document.getElementById('saveBtn');
const statusEl = document.getElementById('status');
const showKey = document.getElementById('showKey');

chrome.storage.sync.get('apiKey', ({ apiKey }) => {
  if (apiKey) apiKeyInput.value = apiKey;
});

showKey.addEventListener('change', () => {
  apiKeyInput.type = showKey.checked ? 'text' : 'password';
});

saveBtn.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    statusEl.textContent = 'Please enter a key';
    statusEl.style.color = '#c62828';
    return;
  }
  chrome.storage.sync.set({ apiKey: key }, () => {
    statusEl.textContent = 'Saved! Go to VTOP and try it.';
    statusEl.style.color = '#2e7d32';
    setTimeout(() => { statusEl.textContent = ''; }, 3000);
  });
});
