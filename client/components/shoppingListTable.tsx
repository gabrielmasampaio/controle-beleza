import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@nextui-org/react";
import {button as buttonStyles} from "@nextui-org/theme";
import {ShoppingItem} from "@/types";
import {Link} from "@nextui-org/link";
import {DeleteIcon, EyeIcon} from "@nextui-org/shared-icons";
import {Tooltip} from "@nextui-org/tooltip";
import {User} from "@nextui-org/user";
import {useDisclosure} from "@nextui-org/use-disclosure";
import {ProductModal} from "@/components/productModal";
import {RemoveItemModal} from "@/components/RemoveItemModal";


interface ShoppingListTableProps {
    items: ShoppingItem[];
    addQuantityToItem: Function,
    removeItem: Function
}

export default function ShoppingListTable({items, addQuantityToItem, removeItem}: ShoppingListTableProps) {
    const [selectedItem, setSelectedItem] = React.useState(items[0]);
    const {
        isOpen: isProductOpen,
        onOpen: onProductOpen,
        onOpenChange: onProductOpenChange
    } = useDisclosure();

    const {
        isOpen: isRemoveItemOpen,
        onOpen: onRemoveItemOpen,
        onOpenChange: onRemoveItemOpenChange
    } = useDisclosure();
    const noItemsInList = () => (
        <><p>Sua lista está vazia no momento.</p><p>
            Ir para o
            <Link
                href="/catalogue"
                className={buttonStyles({
                    color: "primary",
                    radius: "full",
                    variant: "shadow",
                }) + " ml-1 p-0"}
            >
                Catálogo
            </Link>
        </p></>

    );

    const handleOpenProduct = (item: ShoppingItem) => {
        setSelectedItem(item);
        onProductOpen();
    }
    const handleRemoveProduct = (item: ShoppingItem) => {
        setSelectedItem(item);
        onRemoveItemOpen();
    }


    return (
        <div className="flex flex-col gap-3">
            <Table aria-label="Tabela de produtos selecionados">
                <TableHeader>
                    <TableColumn>Produto</TableColumn>
                    <TableColumn>Preço</TableColumn>
                    <TableColumn>Quantidade</TableColumn>
                </TableHeader>

                <TableBody emptyContent={noItemsInList()}>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell
                                className="flex items-center gap-1">
                                <Tooltip content={<div className="text-xs relative flex items-center gap-2"><EyeIcon/> ver produto </div>}>
                                    <User onClick={() => handleOpenProduct(item)} className="cursor-pointer hover:opacity-50"
                                        avatarProps={{radius: "lg", src: item.avatar}}
                                        name={item.name}
                                    >
                                        {item.name}
                                    </User>
                                </Tooltip>
                            </TableCell>
                            <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                            <TableCell>
                                <div className="relative flex items-center gap-2">
                                    <Tooltip color="danger" content="Remover">
                                      <span onClick={() => handleRemoveProduct(item)}
                                          className="text-lg text-red-500 cursor-pointer active:opacity-50">
                                        <DeleteIcon/>
                                      </span>
                                    </Tooltip>
                                        <span className="text-lg cursor-pointer active:opacity-50"
                                            onClick={() =>
                                                item.quantity === 1
                                                    ? handleRemoveProduct(item)
                                                    : addQuantityToItem(item.id, item.quantity - 1)}
                                        > - </span>
                                    <span> {item.quantity} </span>
                                    <span className="text-lg cursor-pointer active:opacity-50"
                                        onClick={() => addQuantityToItem(item.id, item.quantity + 1)}> + </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ProductModal hideFooter={true} product={selectedItem} isOpen={isProductOpen} onOpenChange={onProductOpenChange}/>
            <RemoveItemModal  isOpen={isRemoveItemOpen} item={selectedItem} onOpenChange={onRemoveItemOpenChange} onConfirmRemoval={removeItem}/>
        </div>
    );
}

