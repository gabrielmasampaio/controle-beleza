"use client";

import { title, subtitle } from "@/components/primitives";
import { button as buttonStyles } from "@nextui-org/theme";
import { Link } from "@nextui-org/link";
import { ShoppingItem } from "@/types";
import {useShoppingList} from "@/app/lib/shopping-list/useShoppingList";

export default function ShoppingListPage() {
    const { items } = useShoppingList();

    return (
        <div className="flex flex-col gap-6">
            <h1 className={title({ color: "pink" })}>Minha Lista de Compras</h1>
            <p className={subtitle()}>
                Você pode revisar os itens abaixo antes de entrar em contato.
            </p>

            <div className="mt-10 space-y-4">
                {items.length === 0 ? (
                    <>
                        <p>Sua lista está vazia no momento.</p>
                        <p>
                            Ir para o
                            <Link
                                href="/catalogue"
                                className={buttonStyles({
                                    color: "primary",
                                    radius: "full",
                                    variant: "shadow",
                                }) + " ml-1"}
                            >
                                Catálogo
                            </Link>
                        </p>
                    </>
                ) : (
                    items.map((item: ShoppingItem) => (
                        <div key={item.id} className="border p-4 rounded-lg bg-default-100">
                            <h2 className="font-semibold">{item.name}</h2>
                            <p className="text-sm text-default-500">Preço: R$ {item.price.toFixed(2)}</p>
                            <p className="text-sm text-default-500">Quantidade: {item.quantity}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
