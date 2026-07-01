export const AUTH_STORAGE_KEY = "pm-mvp-authenticated";
export const DUMMY_USERNAME = "user";
export const DUMMY_PASSWORD = "password";

export function isValidDummyLogin(username: string, password: string) {
  return username.trim() === DUMMY_USERNAME && password === DUMMY_PASSWORD;
}

export function getStoredAuthState() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function setStoredAuthState(isAuthenticated: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  if (isAuthenticated) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
