'use client';

import React, {useEffect} from "react";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
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

interface CategoryTableProps {
    className?: string;
}

export default function CategoryTable({className = ""}: CategoryTableProps) {
    const [selectedItem, setSelectedItem] = React.useState<Category>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [categoryToDelete, setCategoryToDelete] = React.useState<Category | null>(null);
    const [linkedProductsCount, setLinkedProductsCount] = React.useState<number>(0);
    const {isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose} = useDisclosure();

    const [categories, setCategories] = React.useState<Category[]>([]);
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 8;
    const pages = Math.ceil(categories.length / rowsPerPage);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [highlightedId, setHighlightedId] = React.useState<string | null>(null);

    const filteredItems = React.useMemo(() => {
        return categories.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    const pageCategories = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredItems.slice(start, start + rowsPerPage);
    }, [page, filteredItems]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
                setPage(1);
            } catch (err) {
                console.error("Erro ao buscar categorias:", err);
            }
        }

        fetchCategories();
    }, []);

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
            // Always pass forceDelete=true when confirming deletion
            await deleteCategory(categoryToDelete._id, true);
            toast.success("Categoria removida"); // Simplified toast message
            setCategories((prev) => prev.filter((i) => i._id !== categoryToDelete._id));
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
            setCategories((prev) => {
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
            console.error("Erro ao salvar categoria", err);
            toast.error("Erro ao salvar categoria");
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
                aria-label="Tabela de categorias"
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

                <TableBody emptyContent={"Nenhuma categoria encontrada."}>
                    {pageCategories.map((category) => (
                        <TableRow
                            key={category._id}
                            className={
                                category._id === highlightedId ? "text-warning transition duration-75" : ""
                            }
                        >
                            <TableCell className="flex items-center gap-1 text-xs sm:text-base">
                                {category.name}
                            </TableCell>

                            <TableCell className="text-xs sm:text-base">
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
                            </TableCell>
                        </TableRow>
                    ))}
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

interface CategoryFormModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    category?: Category;
    onSave: (category: Category) => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({isOpen, onOpenChange, category, onSave}) => {
    const [name, setName] = React.useState(category?.name || "");

    React.useEffect(() => {
        setName(category?.name || "");
    }, [category]);

    const handleSave = () => {
        onSave({...category, name});
        onOpenChange();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{category ? "Editar Categoria" : "Nova Categoria"}</ModalHeader>
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