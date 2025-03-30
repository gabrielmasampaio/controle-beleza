'use client';

import React, {useEffect} from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow,
    TableCell, User, Tooltip, Pagination
} from "@nextui-org/react";
import {items as mockItems} from "@/app/lib/data";
import {EyeIcon, EditIcon, DeleteIcon} from "@nextui-org/shared-icons";
import {useDisclosure} from "@nextui-org/use-disclosure";
import {Item} from "@/types";
import {formatPrice} from "@/app/lib/text-format";
import {ProductFormModal} from "@/components/ProductFormModal";
import {RemoveItemModal} from "@/components/RemoveItemModal";

interface AdminTableProps {
    className?: string;
}

export default function AdminTable({className = ""}: AdminTableProps) {
    const [selectedItem, setSelectedItem] = React.useState<Item>(mockItems[0]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {
        isOpen: isRemoveItemOpen,
        onOpen: onRemoveItemOpen,
        onOpenChange: onRemoveItemOpenChange
    } = useDisclosure();

    const [items, setItems] = React.useState<Item[]>([]);

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 8;
    const pages = Math.ceil(items.length / rowsPerPage);

    const pageItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return items.slice(start, start + rowsPerPage);
    }, [page, items]);

    useEffect(() => {
        setItems(mockItems); // substituir por chamada real
        setPage(1);
    }, []);

    const handleOpenProduct = (item: Item) => {
        setSelectedItem(item);
        onOpen();
    };

    const handleDelete = (item: Item) => {
        setSelectedItem(item);
        onRemoveItemOpen();
    };

    const onDeleteItem = async () => {
        try {
            console.log("Chamando API de delete para:", selectedItem?.id);
            // await fetch(`/api/products/${selectedItem?.id}`, { method: 'DELETE' });

            setItems(prev => prev.filter(i => i.id !== selectedItem?.id));
            onRemoveItemOpenChange();
        } catch (err) {
            console.error("Erro ao deletar:", err);
        }
    };

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <Table
                aria-label="Tabela de produtos"
                bottomContent={
                    pages > 1 && (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="secondary"
                                page={page}
                                total={pages}
                                onChange={setPage}
                            />
                        </div>
                    )
                }
            >
                <TableHeader>
                    <TableColumn>Produto</TableColumn>
                    <TableColumn>Preço</TableColumn>
                    <TableColumn>Ações</TableColumn>
                </TableHeader>

                <TableBody emptyContent={"Nenhum produto encontrado."}>
                    {pageItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="flex items-center gap-1">
                                <Tooltip
                                    className="cursor-pointer"
                                    onClick={() => handleOpenProduct(item)}
                                    content={
                                        <div className="text-xs flex items-center gap-2">
                                            <EyeIcon/> ver produto
                                        </div>
                                    }
                                >
                                    <User
                                        className="hover:opacity-50"
                                        avatarProps={{radius: "lg", src: item.avatar}}
                                        name={item.name}
                                    >
                                        {item.description}
                                    </User>
                                </Tooltip>
                            </TableCell>

                            <TableCell className="text-left">
                                {formatPrice(item.price)}
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center justify-center gap-4">
                                    <Tooltip content="Editar Produto">
										<span
                                            className="text-lg cursor-pointer active:opacity-50"
                                            onClick={() => handleOpenProduct(item)}
                                        >
											<EditIcon/>
										</span>
                                    </Tooltip>

                                    <Tooltip color="danger" content="Remover Produto">
										<span
                                            onClick={() => handleDelete(item)}
                                            className="text-lg text-red-500 cursor-pointer active:opacity-50"
                                        >
											<DeleteIcon/>
										</span>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ProductFormModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                product={selectedItem}
                onSave={() => {}}
            />

            <RemoveItemModal
                isOpen={isRemoveItemOpen}
                item={selectedItem}
                onOpenChange={onRemoveItemOpenChange}
                onConfirmRemoval={onDeleteItem}
            />
        </div>
    );
}
