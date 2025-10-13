import { API_URL } from "./config";
import { getToken } from "@/app/lib/localStorage/auth";
import { Brand } from "@/types";
import { fetchWithAuth } from "@/app/lib/api/fetchWithAuth";

interface GetBrandsResponse {
    brands: Brand[];
    totalBrands: number;
    page: number;
    pages: number;
}

export async function getBrands(page: number = 1, limit: number = 20, searchTerm: string = ''): Promise<GetBrandsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (searchTerm) {
        queryParams.append('searchTerm', searchTerm);
    }

    const res = await fetch(`${API_URL}/brand?${queryParams.toString()}`);
    if (!res.ok) throw new Error("Erro ao buscar marcas");
    return res.json();
}

export async function createBrand(brand: Brand): Promise<Brand> {
    const token = getToken();
    const res = await fetchWithAuth(`${API_URL}/brand`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brand),
    });
    if (!res.ok) throw new Error("Erro ao criar marca");
    return res.json();
}

export async function updateBrand(brand: Brand): Promise<Brand> {
    const token = getToken();
    const res = await fetchWithAuth(`${API_URL}/brand/${brand._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brand),
    });
    if (!res.ok) throw new Error("Erro ao atualizar marca");
    return res.json();
}

export async function deleteBrand(id: string, forceDelete: boolean = false): Promise<{ message: string, linkedProductsCount?: number }> {
    const token = getToken();
    const url = `${API_URL}/brand/${id}${forceDelete ? '?forceDelete=true' : ''}`;
    const res = await fetchWithAuth(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao excluir marca");
    }
    return res.json();
}
