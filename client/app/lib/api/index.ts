export const API_URL = "http://localhost:5000/api";

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
