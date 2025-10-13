import { API_URL } from "./config";
import { getToken } from "@/app/lib/localStorage/auth";
import { Category } from "@/types";
import { fetchWithAuth } from "@/app/lib/api/fetchWithAuth";

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/category`);
    if (!res.ok) throw new Error("Erro ao buscar categorias");
    return res.json();
}

export async function createCategory(category: Category): Promise<Category> {
    const token = getToken();
    const res = await fetchWithAuth(`${API_URL}/category`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Erro ao criar categoria");
    return res.json();
}

export async function updateCategory(category: Category): Promise<Category> {
    const token = getToken();
    const res = await fetchWithAuth(`${API_URL}/category/${category._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Erro ao atualizar categoria");
    return res.json();
}

export async function deleteCategory(id: string, forceDelete: boolean = false): Promise<{ message: string, linkedProductsCount?: number }> {
    const token = getToken();
    const url = `${API_URL}/category/${id}${forceDelete ? '?forceDelete=true' : ''}`;
    const res = await fetchWithAuth(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao excluir categoria");
    }
    return res.json();
}
