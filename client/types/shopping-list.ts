import { Product } from "./product";

export type ShoppingItem = Product & {
    quantity: number;
};
