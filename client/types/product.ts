export type Product = {
    _id?: string;
    name: string;
    description: string;
    price: number;
    storage: number;
    images?: string[];
    categories?: string[]; // Array of category IDs
    brand?: string; // Brand ID
    disponibilidade?: string;
};