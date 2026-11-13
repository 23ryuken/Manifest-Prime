const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002';
const TOKEN_KEY = 'manifest_token';
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// The only code that touches localStorage
export const tokenStore = {
  get() {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// The app registers a function here (later: "go to the sign-in page")
let onUnauthorized = null;
export function setOnUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

// Sends the request and returns the Response, or throws an ApiError
async function send(path, { method = 'GET', json, body } = {}) {
  const headers = {};
  const token = tokenStore.get();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init = { method, headers };
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(json);
  } else if (body !== undefined) {
    // FormData: never set Content-Type, the browser adds it with the boundary
    init.body = body;
  }

  // The try/catch wraps only the fetch call
  let res;
  try {
    res = await fetch(BASE_URL + path, init);
  } catch {
    throw new ApiError(0, 'Cannot reach the server');
  }

  if (!res.ok) {
    // The error body might not be JSON (an HTML error page, for example)
    const data = await res.json().catch(() => null);
    const message = data?.message || 'Request failed';

    // Only a request that carried a token can mean "your session ended"
    if (res.status === 401 && token && tokenStore.get() === token) {
      tokenStore.clear();
      if (onUnauthorized) {
        onUnauthorized();
      }
    }
    throw new ApiError(res.status, message);
  }

  return res;
}

// For JSON endpoints: returns the parsed body, or null for 204
export async function request(path, options) {
  const res = await send(path, options);
  if (res.status === 204) {
    return null;
  }
  return res.json();
}

// For files: fetch with the token, then save the bytes under the given name.
export async function downloadBlob(path, filename) {
  const res = await send(path);
  const blob = await res.blob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}