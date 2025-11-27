import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    Button,
} from "@heroui/react";
import {useShoppingList} from "@/app/lib/localStorage/shopping-list/useShoppingList";
import ShoppingListTable from "./shoppingListTable";
import { title } from "./primitives";
import {createWhatsAppLink} from "@/app/lib/whatsapp/whatsapp";

export const ShoppingCartDrawer = () => {
    const { isDrawerOpen, closeDrawer, items, updateQuantity, removeItem } = useShoppingList();

    const handleCheckout = () => {
        const url = createWhatsAppLink(items);
        window.open(url, '_blank');
    }

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
                {items.length > 0 && (
                    <DrawerFooter>
                        <Button color="success" onPress={handleCheckout}>Comprar</Button>
                        <Button variant="light" onPress={closeDrawer}>Sair</Button>
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
};
