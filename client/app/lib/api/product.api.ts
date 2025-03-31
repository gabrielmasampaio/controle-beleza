import { API_URL } from "./config";
import {getToken} from "@/app/lib/localStorage/auth";
import {Product} from "@/types";
import {fetchWithAuth} from "@/app/lib/api/fetchWithAuth";

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/product`);
    if (!res.ok) throw new Error("Erro ao buscar produtos");
    return res.json();
}

export async function createProduct(product: Product): Promise<Product> {
    const token = getToken();
    const res = await fetchWithAuth(`${API_URL}/product`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Erro ao criar produto");
    return res.json();
}

export async function updateProduct(product: Product): Promise<Product> {
    const token = getToken();
    const res = await fetchWithAuth(`${API_URL}/product/${product._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Erro ao atualizar produto");
    return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
    const token = getToken();
    const res = await fetchWithAuth(`${API_URL}/product/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Erro ao excluir produto");
}
