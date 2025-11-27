import type { Category } from "./category";

type Reference<T> = T | string;

export type Product = {
    _id?: string;
    name: string;
    description: string;
    price: number;
    storage: number;
    images?: string[];
    categories?: Reference<Category>[];
    availability?: string;
};
