import { request } from "./client.js"

export function register({ name, email, password }) {
    return request(`/api/auth/join`, { method: 'POST', json: { name, email, password } });
}

export function login({ email, password }) {
    return request('/api/auth/login', { method: 'POST', json: { email, password } });
}

export function getMe() {
    return request('/api/auth/me');
}