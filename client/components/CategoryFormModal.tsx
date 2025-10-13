'use client';

import React from "react";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import {Category} from "@/types";

interface CategoryFormModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    category?: Category;
    onSave: (category: Category) => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({isOpen, onOpenChange, category, onSave}) => {
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