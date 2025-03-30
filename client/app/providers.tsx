"use client";

import * as React from "react";
import {NextUIProvider} from "@nextui-org/system";
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
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>
                <ShoppingListProvider>
                    <Toaster position="bottom-right" toastOptions={{duration: 3000}} />
                        {children}
                </ShoppingListProvider>
            </NextThemesProvider>
        </NextUIProvider>
    );
}
