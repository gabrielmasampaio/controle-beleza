'use client';

import React from "react";
import {
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader
} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Product} from "@/types";
import {ProductModal} from "@/components/productModal";

interface ProductFormModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    product?: Product;
    onSave: (item: Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
                                                                      isOpen,
                                                                      onOpenChange,
                                                                      product,
                                                                      onSave
                                                                  }) => {
    const [form, setForm] = React.useState<Product>({
        id: product?.id ?? Math.random(),
        name: product?.name ?? "",
        description: product?.description ?? "",
        price: product?.price ?? 0,
        avatar: product?.avatar ?? "",
    });

    const [previewOpen, setPreviewOpen] = React.useState(false);

    React.useEffect(() => {
        if (product) {
            setForm(product);
        }
    }, [product]);

    const handleChange = (field: keyof Product, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: field === "price" ? parseFloat(value) : value
        }));
    };

    const handleSave = () => {
        onSave(form);
        onOpenChange();
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{product ? "Editar Produto" : "Novo Produto"}</ModalHeader>
                            <ModalBody className="gap-3">
                                <Input label="Nome" value={form.name}
                                       onValueChange={(val) => handleChange("name", val)} />
                                <Input label="Descrição" value={form.description}
                                       onValueChange={(val) => handleChange("description", val)} />
                                <Input label="Preço" type="number" value={form.price.toString()}
                                       onValueChange={(val) => handleChange("price", val)} />
                            {/*    todo Adicionar um input de arquivo que aceita arquivo de foto. */}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="flat" onPress={() => setPreviewOpen(true)}>
                                    Prever Produto
                                </Button>
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

            <ProductModal
                isOpen={previewOpen}
                onOpenChange={() => setPreviewOpen(false)}
                product={form}
            />
        </>
    );
};
