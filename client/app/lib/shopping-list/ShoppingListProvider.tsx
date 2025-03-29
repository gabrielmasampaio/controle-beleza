import React, { createContext, useEffect, useState } from "react";
import { ShoppingItem } from "@/types"

interface ShoppingListContextType {
    items: ShoppingItem[];
    addItem: (item: ShoppingItem) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearList: () => void;
}

export const ShoppingListContext = createContext<ShoppingListContextType | null>(null);

export const ShoppingListProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<ShoppingItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("shopping-list");
        if (stored) {
            setItems(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("shopping-list", JSON.stringify(items));
    }, [items]);

    const addItem = (item: ShoppingItem) => {
        setItems((prev) => {
            const exists = prev.find((i) => i.id === item.id);
            if (exists) {
                return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
            }
            return [...prev, item];
        });
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        setItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item));
    };

    const clearList = () => {
        setItems([]);
    };

    return (
        <ShoppingListContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearList }}>
            {children}
        </ShoppingListContext.Provider>
    );
};
