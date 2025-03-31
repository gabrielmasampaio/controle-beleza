"use client";

import React, { createContext, useEffect, useState } from "react";
import { ShoppingItem } from "@/types"

interface ShoppingListContextType {
    items: ShoppingItem[];
    addItem: (item: ShoppingItem) => void;
    removeItem: (_id: string) => void;
    updateQuantity: (_id: string, quantity: number) => void;
    clearList: () => void;
    sumListValue: () => number;
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
            const exists = prev.find((i) => i._id === item._id);
            if (exists) {
                return prev.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i);
            }
            return [...prev, item];
        });
    };

    const removeItem = (_id: string) => {
        setItems((prev) => prev.filter((item) => item._id !== _id));
    };

    const updateQuantity = (_id: string, quantity: number) => {
        if(quantity === 0) removeItem(_id)
        else
            setItems((prev) => prev.map((item) => item._id === _id ? { ...item, quantity } : item));
    };

    const clearList = () => {
        setItems([]);
    };

    const sumListValue = () => {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    return (
        <ShoppingListContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearList, sumListValue }}>
            {children}
        </ShoppingListContext.Provider>
    );
};
