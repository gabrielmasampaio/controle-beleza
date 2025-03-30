'use client';

import React, {useEffect} from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow,
    TableCell, User, Tooltip, Pagination
} from "@nextui-org/react";
import {EyeIcon, EditIcon, DeleteIcon} from "@nextui-org/shared-icons";
import {useDisclosure} from "@nextui-org/use-disclosure";
import {Product} from "@/types";
import {formatPrice} from "@/app/lib/text-format";
import {ProductFormModal} from "@/components/ProductFormModal";
import {RemoveItemModal} from "@/components/RemoveItemModal";
import {Input} from "@nextui-org/input";
import {SearchIcon} from "@/components/icons";
import {getProducts} from "@/app/lib/api/product.api";

interface AdminTableProps {
    className?: string;
}

export default function AdminTable({className = ""}: AdminTableProps) {
    const [selectedItem, setSelectedItem] = React.useState<Product>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {
        isOpen: isRemoveItemOpen,
        onOpen: onRemoveItemOpen,
        onOpenChange: onRemoveItemOpenChange
    } = useDisclosure();

    const [products, setProducts] = React.useState<Product[]>([]);

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 8;
    const pages = Math.ceil(products.length / rowsPerPage);
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredItems = React.useMemo(() => {
        return products.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);


    const pageItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredItems.slice(start, start + rowsPerPage);
    }, [page, filteredItems]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const produtos = await getProducts();
                setProducts(produtos);
                setPage(1);
            } catch (err) {
                console.error("Erro ao buscar produtos:", err);
            }
        }

        fetchProducts();
    }, []);

    const handleOpenProduct = (item: Product) => {
        setSelectedItem(item);
        onOpen();
    };

    const handleDelete = (item: Product) => {
        setSelectedItem(item);
        onRemoveItemOpen();
    };

    const onDeleteItem = async () => {
        try {
            console.log("Chamando API de delete para:", selectedItem?.id);
            // await fetch(`/api/products/${selectedItem?.id}`, { method: 'DELETE' });

            setProducts(prev => prev.filter(i => i.id !== selectedItem?.id));
            onRemoveItemOpenChange();
        } catch (err) {
            console.error("Erro ao deletar:", err);
        }
    };

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <div className="flex justify-between products-center px-2">
                <Input
                    size="sm"
                    isClearable
                    className="max-w-[200px]"
                    label="Buscar"
                    value={searchTerm}
                    startContent={<SearchIcon size={5} />}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm("")}
                />
            </div>
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
                            <TableCell className="flex products-center gap-1">
                                <Tooltip
                                    className="cursor-pointer"
                                    onClick={() => handleOpenProduct(item)}
                                    content={
                                        <div className="text-xs flex products-center gap-2">
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
                                <div className="flex products-center justify-center gap-4">
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
