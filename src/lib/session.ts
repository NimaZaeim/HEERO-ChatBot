// This function is used to load and save session data in the browser's local storage.

export const loadSession = (key: string) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveSession = (key: string, data: unknown) => {
  localStorage.setItem(key, JSON.stringify(data));
};
