import { API_URL } from "./config";
import {getToken} from "../localStorage/auth";

export async function validateToken(): Promise<boolean> {
    const token = getToken();

    if (!token) return false;

    try {
        const res = await fetch(`${API_URL}/auth/validate`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.ok;
    } catch (err) {
        console.error("Erro ao validar token:", err);
        return false;
    }
}

export interface LoginPayload {
    username: string;
    password: string;
}

export async function login({ username, password }: LoginPayload): Promise<{ token: string }> {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || "Erro ao fazer login");
    }

    const data = await res.json();
    return {
        token: data.token,
    };
}
