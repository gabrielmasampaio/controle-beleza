'use client';

import React, {useEffect} from "react";
import {
    Button,
    Input,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import {DeleteIcon, EditIcon} from "@heroui/shared-icons";
import {Brand} from "@/types";
import {SearchIcon} from "@/components/icons";
import {createBrand, deleteBrand, getBrands, updateBrand} from "@/app/lib/api/brand.api";
import toast from "react-hot-toast";
import {ConfirmationModal} from "@/components/ConfirmationModal";

interface BrandTableProps {
    className?: string;
}

export default function BrandTable({className = ""}: BrandTableProps) {
    const [selectedItem, setSelectedItem] = React.useState<Brand>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [brandToDelete, setBrandToDelete] = React.useState<Brand | null>(null);
    const [linkedProductsCount, setLinkedProductsCount] = React.useState<number>(0);
    const {isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose} = useDisclosure();

    const [brands, setBrands] = React.useState<Brand[]>([]);
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 8;
    const pages = Math.ceil(brands.length / rowsPerPage);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [highlightedId, setHighlightedId] = React.useState<string | null>(null);

    const filteredItems = React.useMemo(() => {
        return brands.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [brands, searchTerm]);

    const pageBrands = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredItems.slice(start, start + rowsPerPage);
    }, [page, filteredItems]);

    useEffect(() => {
        async function fetchBrands() {
            try {
                const fetchedBrands = await getBrands();
                setBrands(fetchedBrands);
                setPage(1);
            } catch (err) {
                console.error("Erro ao buscar marcas:", err);
            }
        }

        fetchBrands();
    }, []);

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
            // Always pass forceDelete=true when confirming deletion
            await deleteBrand(brandToDelete._id, true);
            toast.success("Marca removida"); // Simplified toast message
            setBrands((prev) => prev.filter((i) => i._id !== brandToDelete._id));
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
            setBrands((prev) => {
                const index = prev.findIndex((item) => item._id === saved._id);
                setHighlightedId(saved._id ?? null);
                setTimeout(() => setHighlightedId(null), 3000);

                if (index !== -1) {
                    const updated = [...prev];
                    updated[index] = saved;
                    return updated;
                } else {
                    return [saved, ...prev];
                }
            });
            onOpenChange();
        } catch (err) {
            console.error("Erro ao salvar marca", err);
            toast.error("Erro ao salvar marca");
        }
    };

    return (
        <div className={`flex flex-col gap-3 w-full ${className}`}>
            <div className="flex justify-between items-center px-2 gap-2">
                <Input
                    size="sm"
                    isClearable
                    className="max-w-[200px]"
                    label="Buscar"
                    value={searchTerm}
                    startContent={<SearchIcon size={5}/>}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm("")}
                />
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
                className="w-full table-fixed"
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
                    <TableColumn className="w-1/2 text-xs sm:text-base">Nome</TableColumn>
                    <TableColumn className="w-1/2 text-xs sm:text-base">Ações</TableColumn>
                </TableHeader>

                <TableBody emptyContent={"Nenhuma marca encontrada."}>
                    {pageBrands.map((brand) => (
                        <TableRow
                            key={brand._id}
                            className={
                                brand._id === highlightedId ? "text-warning transition duration-75" : ""
                            }
                        >
                            <TableCell className="flex items-center gap-1 text-xs sm:text-base">
                                {brand.name}
                            </TableCell>

                            <TableCell className="text-xs sm:text-base">
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
                            </TableCell>
                        </TableRow>
                    ))}
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

interface BrandFormModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    brand?: Brand;
    onSave: (brand: Brand) => void;
}

const BrandFormModal: React.FC<BrandFormModalProps> = ({isOpen, onOpenChange, brand, onSave}) => {
    const [name, setName] = React.useState(brand?.name || "");

    React.useEffect(() => {
        setName(brand?.name || "");
    }, [brand]);

    const handleSave = () => {
        onSave({ ...brand, name });
        onOpenChange();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{brand ? "Editar Marca" : "Nova Marca"}</ModalHeader>
                        <ModalBody>
                            <Input
                                label="Nome"
                                value={name}
                                onValueChange={setName}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="primary" onPress={handleSave}>
                                Salvar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};