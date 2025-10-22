// Small embedded reporter: when the app is loaded with ?embedded=true
// it will post its content size to window.parent so a parent page (Framer)
// can resize an iframe to fit the content.

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 100) {
  let t: number | undefined;
  return function(this: any, ...args: Parameters<T>) {
    if (t) clearTimeout(t);
    t = window.setTimeout(() => fn.apply(this, args), wait);
  };
}

function getParentOrigin(): string | null {
  try {
    var ref = document.referrer;
    if (ref) return new URL(ref).origin;
  } catch (e) {}
  return null;
}

function sendSize(mode?: 'panel' | 'bubble') {
  try {
    const el = document.getElementById('root') || document.documentElement || document.body;
    const rect = el.getBoundingClientRect();
    const width = Math.ceil(rect.width || Math.max(document.body.scrollWidth, document.documentElement.scrollWidth));
    const height = Math.ceil(rect.height || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    const msg = { source: 'heero-chatbot', type: 'size', width, height, mode: mode || 'panel' };
    const parentOrigin = getParentOrigin();
    if (parentOrigin) window.parent.postMessage(msg, parentOrigin);
    else window.parent.postMessage(msg, '*');
  } catch (e) {
    // ignore
  }
}

// Only activate when explicitly embedded to avoid noisy postMessage during normal site visits
const params = new URLSearchParams(window.location.search);
const embedded = params.get('embedded') === 'true';
if (embedded) {
  // send initial size after hydration
  window.addEventListener('load', () => setTimeout(() => sendSize('panel'), 120));

  const debounced = debounce(() => sendSize('panel'), 120);

  // watch for resizes
  if (typeof ResizeObserver !== 'undefined') {
    try {
      const ro = new ResizeObserver(debounced);
      ro.observe(document.documentElement);
      ro.observe(document.body);
      const root = document.getElementById('root');
      if (root) ro.observe(root);
    } catch (e) {}
  }

  // fallback to window resize
  window.addEventListener('resize', debounced);

  // watch DOM changes
  try {
    const mo = new MutationObserver(debounced);
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  } catch (e) {}

  // expose helper for app to call directly
  try {
    (window as any).__heeroEmbed = {
      sendSize: () => sendSize('panel'),
      sendBubble: () => sendSize('bubble'),
      notifyOpen: () => {
        const msg = { source: 'heero-chatbot', type: 'open' };
        const parentOrigin = getParentOrigin();
        if (parentOrigin) window.parent.postMessage(msg, parentOrigin);
        else window.parent.postMessage(msg, '*');
      },
      notifyClose: () => {
        const msg = { source: 'heero-chatbot', type: 'close' };
        const parentOrigin = getParentOrigin();
        if (parentOrigin) window.parent.postMessage(msg, parentOrigin);
        else window.parent.postMessage(msg, '*');
      }
    };
  } catch (e) {}
}

export {};
