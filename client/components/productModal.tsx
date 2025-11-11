'use client';

import type { Product } from "@/types";
import {
	Button,
	Chip,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tooltip,
} from "@heroui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroui/shared-icons";
import clsx from "clsx";
import React from "react";
import { formatPrice } from "@/app/lib/text-format";
import { useShoppingList } from "@/app/lib/localStorage/shopping-list/useShoppingList";
import { buildWhatsappUrl } from "@/app/lib/whatsapp/whatsapp";
import toast from "react-hot-toast";
import { DEFAULT_IMAGE } from "@/app/lib/constants";

interface ProductModalProps {
	product: Product;
	isOpen: boolean;
	onOpenChange: any;
	hideFooter?: boolean;
}

const sanitizeImages = (images?: string[]) => {
	const fallback = [DEFAULT_IMAGE];
	if (!images || images.length === 0) return fallback;

	const sanitized = images
		.map((image) => {
			if (typeof image !== "string") return DEFAULT_IMAGE;
			const trimmed = image.trim();
			return trimmed.length ? trimmed : DEFAULT_IMAGE;
		})
		.filter(Boolean);

	return sanitized.length ? sanitized : fallback;
};

type CarouselProps = {
	product: Product;
	isOutOfStock: boolean;
};

const ProductImageCarousel = ({ product, isOutOfStock }: CarouselProps) => {
	const images = React.useMemo(() => sanitizeImages(product.images), [product.images]);
	const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
	const showControls = images.length > 1;

	React.useEffect(() => {
		setCurrentImageIndex(0);
	}, [product._id, images.length]);

	const goToPrevImage = React.useCallback(
		() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)),
		[images.length]
	);

	const goToNextImage = React.useCallback(
		() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)),
		[images.length]
	);

	return (
		<div className="w-full max-w-xl space-y-3">
			<div className="relative rounded-2xl bg-default-100">
				<Image
					shadow="sm"
					radius="lg"
					width="100%"
					alt={product.name}
					className={clsx(
						"h-full max-h-[420px] w-full object-contain p-4 transition",
						isOutOfStock && "grayscale opacity-70"
					)}
					src={images[currentImageIndex]}
				/>
				{showControls && (
					<>
						<button
							type="button"
							onClick={goToPrevImage}
							aria-label="Imagem anterior"
							className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-default-900 shadow-lg transition hover:bg-white"
						>
							<ChevronLeftIcon className="h-5 w-5" />
						</button>
						<button
							type="button"
							onClick={goToNextImage}
							aria-label="Próxima imagem"
							className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-default-900 shadow-lg transition hover:bg-white"
						>
							<ChevronRightIcon className="h-5 w-5" />
						</button>
					</>
				)}
			</div>
			{showControls && (
				<div className="flex flex-wrap gap-2">
					{images.map((img, index) => (
						<button
							key={`${img}-${index}`}
							type="button"
							aria-label={`Selecionar imagem ${index + 1}`}
							onClick={() => setCurrentImageIndex(index)}
							className={clsx(
								"rounded-lg border-2 transition-colors",
								index === currentImageIndex ? "border-primary" : "border-transparent"
							)}
						>
							<Image
								src={img}
								alt={`${product.name} miniatura ${index + 1}`}
								width="100%"
								className="h-[72px] w-[72px] rounded-lg object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export const ProductModal: React.FC<ProductModalProps> = ({
	product,
	isOpen,
	onOpenChange,
	hideFooter,
}) => {
	const { addItem } = useShoppingList();
	const outOfStock = (product.storage ?? 0) <= 0;
	const maxQuantity = Math.max(product.storage ?? 0, 0);
	const [quantity, setQuantity] = React.useState(outOfStock ? 0 : 1);

	React.useEffect(() => {
		setQuantity(outOfStock ? 0 : 1);
	}, [product._id, outOfStock]);

	const descriptionMarkup = React.useMemo(
		() => ({ __html: product.description || "" }),
		[product.description]
	);

	const handleAddToList = (onClose: () => void) => {
		if (outOfStock || quantity <= 0) return;
		addItem({ ...product, quantity });
		toast.success("Produto adicionado à lista!");
		onClose();
	};

	const handleWhatsapp = () => {
		if (outOfStock) return;
		const url = buildWhatsappUrl([{ ...product, quantity }]);
		window.open(url, "_blank");
	};

	const incrementQuantity = () => {
		if (outOfStock) return;
		setQuantity((prev) => Math.min(prev + 1, maxQuantity));
	};

	const decrementQuantity = () => {
		if (outOfStock) return;
		setQuantity((prev) => Math.max(1, prev - 1));
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" className="max-w-[95vw]">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="hidden" />
						<ModalBody className="max-h-[80vh] overflow-y-auto">
							<div className="flex flex-col gap-8 lg:flex-row">
								<ProductImageCarousel product={product} isOutOfStock={outOfStock} />
								<div className="flex flex-1 flex-col gap-4 text-left">
									<div>
										<h2 className="text-2xl font-semibold text-default-900">{product.name}</h2>
										{outOfStock ? (
											<Chip size="sm" color="danger" variant="flat" className="mt-2 w-fit uppercase">
												Esgotado
											</Chip>
										) : (
											<p className="mt-2 text-sm text-default-500">
												Estoque: {product.storage} unidade(s)
											</p>
										)}
									</div>
									<p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
									<div
										className="space-y-3 text-sm leading-relaxed text-default-600"
										dangerouslySetInnerHTML={descriptionMarkup}
									/>
								</div>
							</div>
						</ModalBody>

						{!hideFooter && (
							<ModalFooter className="flex flex-col gap-4 border-t border-default-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
									<div className="flex items-center gap-3">
										<span className="text-sm font-medium text-default-600">Quantidade</span>
										<div className="flex items-center gap-2 rounded-full border border-default-200 px-3 py-1">
											<button
												type="button"
												onClick={decrementQuantity}
												disabled={outOfStock || quantity <= 1}
												className="text-lg font-semibold disabled:opacity-30"
											>
												–
											</button>
											<span className="min-w-[24px] text-center text-base font-semibold">{quantity}</span>
											<button
												type="button"
												onClick={incrementQuantity}
												disabled={outOfStock || quantity >= maxQuantity}
												className="text-lg font-semibold disabled:opacity-30"
											>
												+
											</button>
										</div>
									</div>
									<span className="text-xs text-default-500">
										{outOfStock ? "Sem estoque disponível" : `${maxQuantity} unidades disponíveis`}
									</span>
								</div>
								<div className="flex flex-col gap-2 sm:flex-row">
									<Button
										color="success"
										variant="flat"
										isDisabled={outOfStock}
										onPress={() => handleAddToList(onClose)}
									>
										Adicionar à Lista
									</Button>
									<Tooltip content="Pedir este item via whatsapp">
										<Button color="primary" onPress={handleWhatsapp} isDisabled={outOfStock}>
											Pedir agora
										</Button>
									</Tooltip>
								</div>
							</ModalFooter>
						)}
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
