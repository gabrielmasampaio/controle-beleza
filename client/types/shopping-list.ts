import { Item } from "./item";

export type ShoppingItem = Item & {
    quantity: number;
};
