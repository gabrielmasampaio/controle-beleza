"use client";

import * as React from "react";
import {HeroUIProvider} from "@heroui/react";
import {useRouter} from 'next/navigation'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {ThemeProviderProps} from "next-themes/dist/types";
import {ShoppingListProvider} from "@/app/lib/localStorage/shopping-list/ShoppingListProvider";
import {Toaster} from "react-hot-toast";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({children, themeProps}: ProvidersProps) {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>
                <ShoppingListProvider>
                    <Toaster containerClassName={"mt-[50px]"} position="top-left" toastOptions={{duration: 3000}} />
                        {children}
                </ShoppingListProvider>
            </NextThemesProvider>
        </HeroUIProvider>
    );
}
