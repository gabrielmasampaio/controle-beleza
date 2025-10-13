export type Product = {
    _id?: string;
    name: string;
    description: string;
    price: number;
    storage: number;
    images?: string[];
    categories?: string[]; // Array of category IDs
    brands?: string[]; // Array of brand IDs
    availability?: string;
};