const TOKEN_KEY = "access_token";
const USER_KEY = "user";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
}

export function clearAuthStorage() {
  removeToken();
  removeUser();
}
