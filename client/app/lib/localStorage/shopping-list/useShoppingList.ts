import { useContext } from "react";
import { ShoppingListContext } from "./ShoppingListProvider";

export function useShoppingList() {
    const context = useContext(ShoppingListContext);
    if (!context) {
        throw new Error("useShoppingList deve ser usado dentro de um <ShoppingListProvider>");
    }
    return context;
}
