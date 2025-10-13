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
import {Brand} from "@/types";
import {SearchIcon} from "@/components/icons";
import {createBrand, deleteBrand, getBrands, updateBrand} from "@/app/lib/api/brand.api";
import toast from "react-hot-toast";
import {ConfirmationModal} from "@/components/ConfirmationModal";
import useSWR from "swr";
import {BrandFormModal} from "@/components/BrandFormModal";

interface BrandTableProps {
    className?: string;
}

export default function BrandTable({className = ""}: BrandTableProps) {
    const [selectedItem, setSelectedItem] = React.useState<Brand>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [brandToDelete, setBrandToDelete] = React.useState<Brand | null>(null);
    const [linkedProductsCount, setLinkedProductsCount] = React.useState<number>(0);
    const {isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose} = useDisclosure();

    const {data: brands, isLoading, mutate} = useSWR(
        "brands",
        getBrands,
        {keepPreviousData: true}
    );

    const loadingState = isLoading || brands === undefined ? "loading" : "idle";

    const renderCell = (brand: Brand, columnKey: React.Key) => {
        const cellValue = brand[columnKey as keyof Brand];

        switch (columnKey) {
            case "name":
                return cellValue;
            case "actions":
                return (
                    <div className="flex items-center justify-center gap-4">
                        <Tooltip content="Editar Marca">
                            <span
                                className="text-lg cursor-pointer active:opacity-50"
                                onClick={() => handleOpenBrand(brand)}
                            >
                                <EditIcon/>
                            </span>
                        </Tooltip>

                        <Tooltip color="danger" content="Remover Marca">
                            <span
                                onClick={() => handleDeleteClick(brand)}
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

    const handleOpenBrand = (item: Brand) => {
        setSelectedItem(item);
        onOpen();
    };

    const handleDeleteClick = async (item: Brand) => {
        if (!item._id) return;
        setBrandToDelete(item);
        try {
            const res = await deleteBrand(item._id); // Call API without forceDelete
            setLinkedProductsCount(res.linkedProductsCount || 0);
            onConfirmOpen();
        } catch (err: any) {
            console.error("Erro ao verificar produtos vinculados:", err);
            toast.error(err.message || "Erro ao verificar produtos vinculados");
        }
    };

    const handleConfirmDelete = async () => {
        if (!brandToDelete?._id) return;
        try {
            await deleteBrand(brandToDelete._id, true);
            toast.success("Marca removida");
            mutate();
            onConfirmClose();
            setBrandToDelete(null);
            setLinkedProductsCount(0);
        } catch (err: any) {
            console.error("Erro ao deletar marca:", err);
            toast.error(err.message || "Erro ao deletar marca");
        }
    };

    const handleSave = async (brand: Brand) => {
        try {
            const saved = brand._id
                ? await updateBrand(brand)
                : await createBrand(brand);
            toast.success("Marca salva com sucesso");
            mutate();
            onOpenChange();
        } catch (err: any) {
            console.error("Erro ao salvar marca", err);
            toast.error(err.message || "Erro ao salvar marca");
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
                aria-label="Tabela de marcas"
            >
                <TableHeader>
                    <TableColumn key="name">Nome</TableColumn>
                    <TableColumn key="actions">Ações</TableColumn>
                </TableHeader>
                <TableBody
                    items={brands ?? []}
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

            <BrandFormModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                brand={selectedItem}
                onSave={handleSave}
            />

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onOpenChange={onConfirmClose}
                title="Confirmar Exclusão"
                message={
                    linkedProductsCount > 0
                        ? `A marca "${brandToDelete?.name}" está presente em ${linkedProductsCount} produtos. Deseja remover a marca mesmo assim?`
                        : `Deseja remover a marca "${brandToDelete?.name}"?`
                }
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}