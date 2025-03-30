// lib/api.ts

export const API_URL = "https://sua-api.com/api";

export interface LoginPayload {
    email: string;
    password: string;
}

export async function login({ email, password }: LoginPayload): Promise<{ token: string }> {
    // Simulando delay para mock
    await new Promise((res) => setTimeout(res, 800));

    // --- Requisição real, descomente quando estiver com backend funcionando ---
    // const res = await fetch(`${API_URL}/login`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({ email, password })
    // });
    //
    // if (!res.ok) {
    //     throw new Error("Credenciais inválidas");
    // }
    //
    // const data = await res.json();
    // return {
    //     token: data.token,
    // };

    // --- Mock temporário ---
    if (email === "magna" && password === "12345") {
        return {
            token: "fake-jwt-token",
        };
    } else {
        throw new Error("Credenciais inválidas");
    }
}
