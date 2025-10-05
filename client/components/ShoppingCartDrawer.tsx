import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
} from "@heroui/react";
import {useShoppingList} from "@/app/lib/localStorage/shopping-list/useShoppingList";
import ShoppingListTable from "./shoppingListTable";
import { title } from "./primitives";

export const ShoppingCartDrawer = () => {
    const { isDrawerOpen, closeDrawer, items, updateQuantity, removeItem } = useShoppingList();

    return (
        <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} placement="right" size="xl">
            <DrawerContent>
                <DrawerHeader>
                    <h2 className={title({ size: "sm" })}>Carrinho de compras</h2>
                </DrawerHeader>
                <DrawerBody>
                    {items.length === 0 ? (
                        <p>Seu carrinho está vazio.</p>
                    ) : (
                        <ShoppingListTable
                            items={items}
                            addQuantityToItem={updateQuantity}
                            removeItem={removeItem}
                        />
                    )}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
