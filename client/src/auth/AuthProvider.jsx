import { useEffect, useState } from "react"
import { setOnUnauthorizedHandler, tokenStore } from '../api/client.js';
import { getMe, login, register } from "../api/auth.js"
import { AuthContext } from "./AuthContext.js"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => tokenStore.get() !== null);

useEffect(() => {
    if(tokenStore.get() === null) {
        return;
    }

    let ignore = false;

    async function restore() {
        try {
            const data = await getMe();
            if(!ignore) {
                setUser(data.user);
            }
        } catch (error) {
            
        }
        if(!ignore) {
            setLoading(false);
        }
    }
    restore();

    return () => {
        ignore = true;
    };
}, []);

useEffect(() => {
    setOnUnauthorizedHandler(() => setUser(null));
    return () => setOnUnauthorizedHandler(null);
}, [])

async function login(credentials) {
    const data = await login(credentials);
    tokenStore.set(data.token);
    setUser(data.user);
}

async function register(details) {
    await register(details);
    await login({ email: details.email, password: details.password});
}

function logout() {
    tokenStore.clear();
    setUser(null);
}

const value = { user, loading, login, register, logout };

return <AuthContext value={value}>{children}</AuthContext>
}