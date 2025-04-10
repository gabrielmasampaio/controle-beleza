import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@nextui-org/react";
import { button as buttonStyles } from "@nextui-org/theme";
import { ShoppingItem } from "@/types";
import { Link } from "@nextui-org/link";
import { CloseIcon, EyeIcon } from "@nextui-org/shared-icons";
import { Tooltip } from "@nextui-org/tooltip";
import { User } from "@nextui-org/user";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { ProductModal } from "@/components/productModal";
import { RemoveItemModal } from "@/components/RemoveItemModal";
import { formatPrice } from "@/app/lib/text-format";
import toast from "react-hot-toast";

interface ShoppingListTableProps {
    items: ShoppingItem[];
    addQuantityToItem: Function;
    removeItem: Function;
}

export default function ShoppingListTable({ items, addQuantityToItem, removeItem }: ShoppingListTableProps) {
    const [selectedItem, setSelectedItem] = React.useState(items[0]);
    const {
        isOpen: isProductOpen,
        onOpen: onProductOpen,
        onOpenChange: onProductOpenChange,
    } = useDisclosure();

    const {
        isOpen: isRemoveItemOpen,
        onOpen: onRemoveItemOpen,
        onOpenChange: onRemoveItemOpenChange,
    } = useDisclosure();

    const noItemsInList = () => (
        <>
            <p>Sua lista está vazia no momento.</p>
            <p>
                Ir para o
                <Link
                    href="/catalogue"
                    className={
                        buttonStyles({
                            color: "primary",
                            radius: "full",
                            variant: "shadow",
                        }) + " ml-1 p-0"
                    }
                >
                    Catálogo
                </Link>
            </p>
        </>
    );

    const handleOpenProduct = (item: ShoppingItem) => {
        setSelectedItem(item);
        onProductOpen();
    };
    const handleRemoveProduct = (item: ShoppingItem) => {
        setSelectedItem(item);
        onRemoveItemOpen();
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <Table aria-label="Tabela de produtos selecionados" className="w-full table-fixed">
                <TableHeader>
                    <TableColumn className="w-1/3 text-xs sm:text-base">Produto</TableColumn>
                    <TableColumn className="w-1/3 text-xs sm:text-base">Preço</TableColumn>
                    <TableColumn className="w-1/3 text-xs sm:text-base">Quantidade</TableColumn>
                </TableHeader>

                <TableBody emptyContent={noItemsInList()}>
                    {items.map((item) => (
                        <TableRow className="border-b border-default p-1" key={item._id}>
                            <TableCell className="flex items-center gap-1 text-xs sm:text-base">
                                <Tooltip
                                    onClick={() => handleOpenProduct(item)}
                                    className="cursor-pointer"
                                    content={
                                        <div className="text-xs flex items-center gap-2">
                                            <EyeIcon /> ver produto
                                        </div>
                                    }
                                >
                                    <User
                                        className="hover:opacity-50"
                                        avatarProps={{ radius: "lg", src: item.image }}
                                        name={item.name}
                                    >
                                        {item.name}
                                    </User>
                                </Tooltip>
                            </TableCell>
                            <TableCell className="text-left text-xs sm:text-base">
                                {formatPrice(item.price)}
                            </TableCell>
                            <TableCell className="text-xs sm:text-base">
                                <div className="flex items-center justify-between gap-2 w-full">
                                    <div className="flex items-center gap-2 justify-center w-full">
                                        <span
                                            className="text-lg cursor-pointer active:opacity-50"
                                            onClick={() =>
                                                item.quantity === 1
                                                    ? handleRemoveProduct(item)
                                                    : addQuantityToItem(item._id, item.quantity - 1)
                                            }
                                        >
                                            –
                                        </span>
                                        <span>{item.quantity}</span>
                                        <span
                                            className="text-lg cursor-pointer active:opacity-50"
                                            onClick={() => {
                                                addQuantityToItem(item._id, item.quantity + 1);
                                            }}
                                        >
                                            +
                                        </span>
                                    </div>
                                    <Tooltip className="ml-2 sm:ml-4" color="danger" content="Remover">
                                        <span
                                            onClick={() => handleRemoveProduct(item)}
                                            className="text-lg text-red-500 cursor-pointer active:opacity-50"
                                        >
                                            <CloseIcon />
                                        </span>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ProductModal hideFooter={true} product={selectedItem} isOpen={isProductOpen} onOpenChange={onProductOpenChange} />
            <RemoveItemModal
                isOpen={isRemoveItemOpen}
                item={selectedItem}
                onOpenChange={onRemoveItemOpenChange}
                onConfirmRemoval={(itemId: string) => {
                    toast.error("Produto removido da lista!");
                    removeItem(itemId);
                }}
            />
        </div>
    );
}
