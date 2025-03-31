import {getToken, removeToken} from "@/app/lib/localStorage/auth";

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
    const token = getToken();

    const headers = {
        ...(init.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const res = await fetch(input, { ...init, headers });

    if (res.status === 401) {
        removeToken();
        window.location.reload();
    }

    return res;
}