'use client';

import React from "react";
import {
    Button,
    Input,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure,
} from "@heroui/react";
import {DeleteIcon, EditIcon} from "@heroui/shared-icons";
import {Category} from "@/types";
import {SearchIcon} from "@/components/icons";
import {createCategory, deleteCategory, getCategories, updateCategory} from "@/app/lib/api/category.api";
import toast from "react-hot-toast";
import {ConfirmationModal} from "@/components/ConfirmationModal";
import useSWR from "swr";
import {CategoryFormModal} from "@/components/CategoryFormModal";

interface CategoryTableProps {
    className?: string;
}

export default function CategoryTable({className = ""}: CategoryTableProps) {
    const [selectedItem, setSelectedItem] = React.useState<Category>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [categoryToDelete, setCategoryToDelete] = React.useState<Category | null>(null);
    const [linkedProductsCount, setLinkedProductsCount] = React.useState<number>(0);
    const {isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose} = useDisclosure();

    const {data: categories, isLoading, mutate} = useSWR(
        "categories",
        getCategories,
        {keepPreviousData: true}
    );

    const loadingState = isLoading || categories === undefined ? "loading" : "idle";

    const renderCell = (category: Category, columnKey: React.Key) => {
        const cellValue = category[columnKey as keyof Category];

        switch (columnKey) {
            case "name":
                return cellValue;
            case "actions":
                return (
                    <div className="flex items-center justify-center gap-4">
                        <Tooltip content="Editar Categoria">
                            <span
                                className="text-lg cursor-pointer active:opacity-50"
                                onClick={() => handleOpenCategory(category)}
                            >
                                <EditIcon/>
                            </span>
                        </Tooltip>

                        <Tooltip color="danger" content="Remover Categoria">
                            <span
                                onClick={() => handleDeleteClick(category)}
                                className="text-lg text-red-500 cursor-pointer active:opacity-50"
                            >
                                <DeleteIcon/>
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    };

    const handleOpenCategory = (item: Category) => {
        setSelectedItem(item);
        onOpen();
    };

    const handleDeleteClick = async (item: Category) => {
        if (!item._id) return;
        setCategoryToDelete(item);
        try {
            const res = await deleteCategory(item._id); // Call API without forceDelete
            setLinkedProductsCount(res.linkedProductsCount || 0);
            onConfirmOpen();
        } catch (err: any) {
            console.error("Erro ao verificar produtos vinculados:", err);
            toast.error(err.message || "Erro ao verificar produtos vinculados");
        }
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete?._id) return;
        try {
            await deleteCategory(categoryToDelete._id, true);
            toast.success("Categoria removida");
            mutate();
            onConfirmClose();
            setCategoryToDelete(null);
            setLinkedProductsCount(0);
        } catch (err: any) {
            console.error("Erro ao deletar categoria:", err);
            toast.error(err.message || "Erro ao deletar categoria");
        }
    };

    const handleSave = async (category: Category) => {
        try {
            const saved = category._id
                ? await updateCategory(category)
                : await createCategory(category);
            toast.success("Categoria salva com sucesso");
            mutate();
            onOpenChange();
        } catch (err: any) {
            console.error("Erro ao salvar categoria", err);
            toast.error(err.message || "Erro ao salvar categoria");
        }
    };

    return (
        <div className={`flex flex-col gap-3 w-full ${className}`}>
            <div className="flex justify-end items-center px-2 gap-2">
                <Button
                    color="secondary"
                    className="min-h-full"
                    startContent={<span className="text-lg font-bold mb-[2px]"> + </span>}
                    onPress={() => {
                        setSelectedItem(undefined);
                        onOpen();
                    }}
                >
                    Nova
                </Button>
            </div>

            <Table
                aria-label="Tabela de categorias"
            >
                <TableHeader>
                    <TableColumn key="name">Nome</TableColumn>
                    <TableColumn key="actions">Ações</TableColumn>
                </TableHeader>
                <TableBody
                    items={categories ?? []}
                    loadingContent={<Spinner/>}
                    loadingState={loadingState}
                >
                    {(item) => (
                        <TableRow key={item?._id}>
                            {(columnKey) => (
                                <TableCell>{renderCell(item, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <CategoryFormModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                category={selectedItem}
                onSave={handleSave}
            />

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onOpenChange={onConfirmClose}
                title="Confirmar Exclusão"
                message={
                    linkedProductsCount > 0
                        ? `A categoria "${categoryToDelete?.name}" está presente em ${linkedProductsCount} produtos. Deseja remover a categoria mesmo assim?`
                        : `Deseja remover a categoria "${categoryToDelete?.name}"?`
                }
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}