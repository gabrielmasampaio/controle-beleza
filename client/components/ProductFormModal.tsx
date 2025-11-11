'use client';

import React from "react";
import NextImage from "next/image";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Button,
    Input,
    Select,
    SelectItem,
} from "@heroui/react";
import useSWR from "swr";
import {getBrands} from "@/app/lib/api/brand.api";
import {getCategories} from "@/app/lib/api/category.api";
import {Product} from "@/types";
import {ProductModal} from "@/components/productModal";
import {createProduct, updateProduct} from "@/app/lib/api/product.api";
import toast from "react-hot-toast";
import {
    validatePrice,
    validateProductName,
    validateStorage,
} from "@/app/lib/text-format";

type Reference<T> = T | string;
type MaybeRefs<T> = Reference<T>[] | undefined;

const defaultProduct: Product = {
	_id: undefined,
	name: "",
	description: "",
	price: 0,
	storage: 0,
    images: [],
    brands: [],
    categories: [],
    availability: "A pronta entrega",
};

interface ProductFormModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    product?: Product;
    onSave: (item: Product) => void;
}

const toIdArray = <T extends { _id?: string }>(values?: MaybeRefs<T>) =>
	(values ?? [])
		.map((entry) => {
			if (typeof entry === "string") return entry;
			return entry?._id ?? "";
		})
		.filter(Boolean);

const sanitizeProduct = (input?: Product): Product => ({
	...defaultProduct,
	...input,
	brands: toIdArray(input?.brands),
	categories: toIdArray(input?.categories),
});

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
	isOpen,
	onOpenChange,
	product,
	onSave,
}) => {
	const [form, setForm] = React.useState<Product>(sanitizeProduct(product));

    const {data: brands} = useSWR("brands", getBrands);
	const { data: categories } = useSWR("categories", getCategories);

    const availabilityOptions = ["A pronta entrega", "A Caminho", "Somente Encomenda"];

    const [previewOpen, setPreviewOpen] = React.useState(false);

	React.useEffect(() => {
		setForm(sanitizeProduct(product));
	}, [product]);

    const handleChange = (field: keyof Product, value: any) => {
        setForm((prev) => ({
            ...prev,
            [field]: field === "price" ? parseFloat(value) : value,
        }));
    };

    const handleSave = async () => {
        console.log("Form data before saving:", form);
        try {
            const saved = form._id
                ? await updateProduct(form)
                : await createProduct(form);
            toast.success("Produto salvo com sucesso");
            setForm({ ...defaultProduct })
            onSave(saved);
            onOpenChange();
        } catch (err) {
            console.error("Erro ao salvar produto", err);
            toast.error("Erro ao salvar produto");
        }
    };

    const isNameInvalid = React.useMemo(() => {
        if (form.name === "") return false;
        return !validateProductName(form.name);
    }, [form.name]);

    const isPriceInvalid = React.useMemo(() => {
        return !validatePrice(form.price.toString());
    }, [form.price]);

    const isStorageInvalid = React.useMemo(() => {
        return !validateStorage(form.storage.toString());
    }, [form.storage]);

    function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? []);
        if (!files.length || typeof window === "undefined") return;

        files.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                const imgElement = document.createElement("img");
                imgElement.src = reader.result as string;

                imgElement.onload = () => {
                    const isMobile = window.innerWidth < 768;
                    const MAX_WIDTH = isMobile ? 600 : 800;
                    const MAX_HEIGHT = isMobile ? 600 : 800;

                    let { width, height } = imgElement;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = (height * MAX_WIDTH) / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = (width * MAX_HEIGHT) / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(imgElement, 0, 0, width, height);

                    const quality = file.size > 2097152 ? 0.5 : 0.7;
                    const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
                    setForm((prev) => ({
                        ...prev,
                        images: [...(prev.images ?? []), compressedBase64],
                    }));
                };
            };
        });
    }

    const removeImage = (index: number) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index) ?? [],
        }));
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="lg"
                className={"max-w-[90vw] max-h-[80vh]"}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                {product ? "Editar Produto" : "Novo Produto"}
                            </ModalHeader>
                            <ModalBody className="gap-3 max-h-[80vh] overflow-y-auto">
                                <Input
                                    label="Nome"
                                    value={form.name}
                                    onValueChange={(val) => handleChange("name", val)}
                                    isInvalid={isNameInvalid}
                                    color={isNameInvalid ? "danger" : "default"}
                                    errorMessage={
                                        isNameInvalid && "Nome deve ter ao menos 3 caracteres"
                                    }
                                />

                                <Input
                                    label="Descrição"
                                    value={form.description}
                                    onValueChange={(val) => handleChange("description", val)}
                                    color="default"
                                />

                                <Input
                                    label="Preço"
                                    type="number"
                                    value={form.price.toString()}
                                    onValueChange={(val) => handleChange("price", val)}
                                    isInvalid={isPriceInvalid}
                                    color={isPriceInvalid ? "danger" : "default"}
                                    errorMessage={
                                        isPriceInvalid && "Preço deve ser um número positivo"
                                    }
                                />

                                <Input
                                    label="Estoque"
                                    type="number"
                                    value={form.storage.toString()}
                                    placeholder="Quantidade em estoque"
                                    onValueChange={(val) =>
                                        handleChange("storage", parseInt(val))
                                    }
                                    isInvalid={isStorageInvalid}
                                    color={isStorageInvalid ? "danger" : "default"}
                                    errorMessage={
                                        isStorageInvalid && "Estoque deve ser um número inteiro positivo"
                                    }
                                />

								<Select
									label="Marcas"
									selectionMode="multiple"
									selectedKeys={toIdArray(form.brands)}
									onSelectionChange={(keys) => handleChange("brands", Array.from(keys).map(String))}
								>
                                    {brands?.map((brand) => (
                                        <SelectItem key={brand._id} >
                                            {brand.name}
                                        </SelectItem>
                                    )) ?? []}
                                </Select>

								<Select
									label="Categorias"
									selectionMode="multiple"
									selectedKeys={toIdArray(form.categories)}
									onSelectionChange={(keys) => handleChange("categories", Array.from(keys).map(String))}
								>
                                    {categories?.map((category) => (
                                        <SelectItem key={category._id} >
                                            {category.name}
                                        </SelectItem>
                                    )) ?? []}
                                </Select>

                                <Select
                                    label="Disponibilidade"
                                    // selectedKeys={[form.availability].filter(Boolean)}
                                    onSelectionChange={(keys) => handleChange("availability", Array.from(keys)[0] as string)}
                                >
                                    {availabilityOptions.map((option) => (
                                        <SelectItem key={option} >
                                            {option}
                                        </SelectItem>
                                    ))}
                                </Select>


                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-default-600">
                                        Imagem do Produto
                                    </label>

                                    <div className="relative">
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-default-100 hover:bg-default-200 border border-default-300 text-sm rounded-md transition-colors"
                                        >
                                            Selecionar imagem
                                        </label>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </div>

                                    {form.images && form.images.length > 0 && (
                                        form.images.map((image, index) => (
                                            <div key={index} className="flex flex-col items-start gap-2">
                                                <NextImage
                                                    src={image}
                                                    alt="Prévia da imagem"
                                                    width={150}
                                                    height={150}
                                                    className="rounded-md mt-2 w-full max-w-[150px] h-auto border object-cover"
                                                    unoptimized
                                                />
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="light"
                                                    onPress={() => removeImage(index)}
                                                >
                                                    Remover imagem
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="flat"
                                    onPress={() => setPreviewOpen(true)}
                                >
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
                hideFooter
            />
        </>
    );
};
