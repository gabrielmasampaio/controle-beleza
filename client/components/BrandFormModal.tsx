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
import {Brand} from "@/types";

interface BrandFormModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    brand?: Brand;
    onSave: (brand: Brand) => void;
}

export const BrandFormModal: React.FC<BrandFormModalProps> = ({isOpen, onOpenChange, brand, onSave}) => {
    const [name, setName] = React.useState(brand?.name || "");

    React.useEffect(() => {
        setName(brand?.name || "");
    }, [brand]);

    const handleSave = () => {
        onSave({...brand, name});
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