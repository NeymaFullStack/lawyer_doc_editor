export const localStorageAvailable = () => {
  try {
    const key = "check-local-storage";
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

export const localStorageGetItem = (key: string, defaultValue = "") => {
  const storageAvailable = localStorageAvailable();

  let value;

  if (storageAvailable) {
    value = localStorage.getItem(key) || defaultValue;
  }

  return value;
};
