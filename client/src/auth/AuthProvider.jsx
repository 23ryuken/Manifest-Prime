import { useCallback, useEffect, useRef, useState } from "react"
import { setOnUnauthorizedHandler, tokenStore } from '../api/client.js';
import { getMe, login as loginRequest, register as registerRequest } from "../api/auth.js"
import { AuthContext } from "./AuthContext.js"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => tokenStore.get() !== null);
    const [sessionError, setSessionError] = useState(null);
    const generation = useRef(0);
    const mounted = useRef(false);

    const retrySession = useCallback(async () => {
        const requestGeneration = ++generation.current;
        setLoading(true);
        setSessionError(null);
        try {
            const data = await getMe();
            if (mounted.current && generation.current === requestGeneration) {
                setUser(data.user);
            }
        } catch (error) {
            if (mounted.current && generation.current === requestGeneration) {
                setSessionError(error);
            }
        } finally {
            if (mounted.current && generation.current === requestGeneration) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        mounted.current = true;
        setOnUnauthorizedHandler(() => {
            generation.current += 1;
            if (mounted.current) {
                setUser(null);
                setSessionError(null);
                setLoading(false);
            }
        });

        if (tokenStore.get() !== null) {
            const requestGeneration = ++generation.current;
            getMe()
                .then((data) => {
                    if (mounted.current && generation.current === requestGeneration) {
                        setUser(data.user);
                    }
                })
                .catch((error) => {
                    if (mounted.current && generation.current === requestGeneration) {
                        setSessionError(error);
                    }
                })
                .finally(() => {
                    if (mounted.current && generation.current === requestGeneration) {
                        setLoading(false);
                    }
                });
        }

        return () => {
            mounted.current = false;
            setOnUnauthorizedHandler(null);
        };
    }, []);

    async function login(credentials) {
        const actionGeneration = ++generation.current;
        setLoading(true);
        setSessionError(null);
        try {
            const data = await loginRequest(credentials);
            if (mounted.current && generation.current === actionGeneration) {
                tokenStore.set(data.token);
                setUser(data.user);
            }
        } finally {
            if (mounted.current && generation.current === actionGeneration) {
                setLoading(false);
            }
        }
    }

    async function register(details) {
        const actionGeneration = ++generation.current;
        setLoading(true);
        setSessionError(null);
        try {
            await registerRequest(details);
            if (generation.current === actionGeneration) {
                await login({ email: details.email, password: details.password });
            }
        } catch (error) {
            if (mounted.current && generation.current === actionGeneration) {
                setLoading(false);
            }
            throw error;
        }
    }

    function logout() {
        generation.current += 1;
        tokenStore.clear();
        setUser(null);
        setSessionError(null);
        setLoading(false);
    }

    const value = { user, loading, sessionError, retrySession, login, register, logout };

    return <AuthContext value={value}>{children}</AuthContext>
}