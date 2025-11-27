'use client';

import React, { useCallback, useEffect, useMemo } from "react";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Image,
	Input,
	Pagination,
	Select,
	SelectItem,
	Spinner,
	Tooltip,
	useDisclosure,
	Popover, PopoverTrigger, PopoverContent
} from "@heroui/react";
import clsx from "clsx";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/app/lib/text-format";
import { ProductModal } from "@/components/productModal";
import { Product, Category } from "@/types";
import { getProducts } from "@/app/lib/api/product.api";
import { SearchIcon } from "@/components/icons";
import { getCategories } from "@/app/lib/api/category.api";
import { DEFAULT_IMAGE } from "@/app/lib/constants";

type SortKey = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const sortOptions: { key: SortKey; value: string }[] = [
	{ key: "default", value: "Padrão" },
	{ key: "price-asc", value: "Preço: Menor → Maior" },
	{ key: "price-desc", value: "Preço: Maior → Menor" },
	{ key: "name-asc", value: "Nome: A → Z" },
	{ key: "name-desc", value: "Nome: Z → A" },
];

const availabilityOptions = [
	{ _id: "A pronta entrega", name: "A pronta entrega" },
	{ _id: "A Caminho", name: "A Caminho" },
	{ _id: "Somente Encomenda", name: "Somente Encomenda" },
];

const getEntityId = (entity: string | { _id?: string } | undefined) =>
	typeof entity === "string" ? entity : entity?._id ?? "";

type FilterSectionProps<T extends { _id?: string; name: string }> = {
	title: string;
	options: T[];
	selected: string[];
	onToggle: (id: string) => void;
};

const FilterSection = React.memo(function FilterSection<T extends { _id?: string; name: string }>({
	title,
	options,
	selected,
	onToggle,
}: FilterSectionProps<T>) {
	if (!options.length) {
		return null;
	}

	return (
		<section className="space-y-2">
			<h3 className="text-sm font-semibold text-default-600">{title}</h3>
			<ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
				{options.map((option) => {
					const id = option._id ?? option.name;
					const inputId = `${title}-${id}`;
					const isChecked = selected.includes(id);

					return (
						<li key={id}>
							<label htmlFor={inputId} className="flex items-center gap-2 text-sm text-default-600">
								<input
									id={inputId}
									type="checkbox"
									checked={isChecked}
									onChange={() => onToggle(id)}
									className="h-4 w-4 accent-primary"
								/>
								<span>{option.name}</span>
							</label>
						</li>
					);
				})}
			</ul>
		</section>
	);
});

type FilterPopoverContentProps = {
    titleProps: any;
    close: () => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    sortedCategories: Category[];
    selectedCategories: string[];
    updateQueryParams: (key: "category" | "availability", value: string) => void;
    availabilityOptions: { _id: string; name: string }[];
    selectedAvailability: string[];
}

const FilterPopoverContent = React.memo(function FilterPopoverContent({
    titleProps,
    close,
    clearFilters,
    hasActiveFilters,
    sortedCategories,
    selectedCategories,
    updateQueryParams,
    availabilityOptions,
    selectedAvailability,
}: FilterPopoverContentProps) {
    return (
        <div className="w-full rounded-2xl border border-default-200 bg-white/60 p-4 shadow-sm lg:max-w-xs">
            <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-default-900" {...titleProps}>Filtros</p>
                <Button
                    variant="light"
                    size="sm"
                    onPress={clearFilters}
                    isDisabled={!hasActiveFilters}
                >
                    Limpar
                </Button>
            </div>
            <div className="mt-4 space-y-6">
                <FilterSection
                    title="Categorias"
                    options={sortedCategories}
                    selected={selectedCategories}
                    onToggle={(id) => updateQueryParams("category", id)}
                />
                <FilterSection
                    title="Disponibilidade"
                    options={availabilityOptions}
                    selected={selectedAvailability}
                    onToggle={(id) => updateQueryParams("availability", id)}
                />
                {!sortedCategories.length && !availabilityOptions.length && (
                    <p className="text-sm text-default-400">Nenhum filtro disponível no momento.</p>
                )}
                <Button color="primary" onPress={close}>Aplicar Filtros</Button>
            </div>
        </div>
    );
});

export default function ProductGrid() {
	const [products, setProducts] = React.useState<Product[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [page, setPage] = React.useState(1);
	const [totalPages, setTotalPages] = React.useState(1);
	const [selectedItem, setSelectedItem] = React.useState<Product>();
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [searchTerm, setSearchTerm] = React.useState("");
	const [sortKey, setSortKey] = React.useState<SortKey>("default");
	const [itemsPerPage, setItemsPerPage] = React.useState(25);

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const selectedCategories = useMemo(() => searchParams.getAll("category"), [searchParams]);
	const selectedAvailability = useMemo(() => searchParams.getAll("availability"), [searchParams]);
	const hasActiveFilters = selectedCategories.length > 0 || selectedAvailability.length > 0;

	const { data: categoriesData } = useSWR<Category[]>("catalog-categories", getCategories);

	const sortedCategories = useMemo(
		() => [...(categoriesData ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
		[categoriesData]
	);

	const updateQueryParams = useCallback(
		(key: "category" | "availability", value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			const currentValues = params.getAll(key);
			const nextValues = currentValues.includes(value)
				? currentValues.filter((entry) => entry !== value)
				: [...currentValues, value];

			params.delete(key);
			nextValues.forEach((entry) => params.append(key, entry));

			const queryString = params.toString();
			router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
			setPage(1);
		},
		[pathname, router, searchParams]
	);

	const clearFilters = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("category");
		params.delete("availability");
		const queryString = params.toString();
		router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
		setPage(1);
	}, [pathname, router, searchParams]);

	const fetchItems = useCallback(async () => {
		setLoading(true);
		try {
			const productsResponse = await getProducts(page, itemsPerPage, searchTerm, selectedCategories, selectedAvailability);
			setProducts(productsResponse.products);
			setTotalPages(productsResponse.pages);
		} catch (err) {
			console.error("Erro ao carregar produtos:", err);
		} finally {
			setLoading(false);
		}
	}, [page, itemsPerPage, searchTerm, selectedCategories, selectedAvailability]);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	const filteredItems = useMemo(() => {
		const normalizeSearch = searchTerm.trim().toLowerCase();

		const filterCollection = (collection?: (string | { _id?: string })[]) =>
			(collection ?? [])
				.map((item) => getEntityId(item))
				.filter(Boolean);

		const filterBySelection = (selected: string[], available: string[]) =>
			selected.length === 0 || selected.some((entry) => available.includes(entry));

		const filtered = products.filter((item) => {
			const matchesSearch =
				normalizeSearch.length === 0 ||
				item.name.toLowerCase().includes(normalizeSearch) ||
				item.description?.toLowerCase().includes(normalizeSearch);

			const matchesCategory = filterBySelection(selectedCategories, filterCollection(item.categories));
			const matchesAvailability = selectedAvailability.length === 0 || selectedAvailability.includes(item.availability ?? "");

			return matchesSearch && matchesCategory && matchesAvailability;
		});

		const availabilityOrder = (item: Product) => {
			if ((item.storage ?? 0) <= 0) {
				return 4;
			}
			switch (item.availability) {
				case "A pronta entrega":
					return 1;
				case "A Caminho":
					return 2;
				case "Somente Encomenda":
					return 3;
				default:
					return 4;
			}
		};

		switch (sortKey) {
			case "price-asc":
				return filtered.sort((a, b) => a.price - b.price);
			case "price-desc":
				return filtered.sort((a, b) => b.price - a.price);
			case "name-asc":
				return filtered.sort((a, b) => a.name.localeCompare(b.name));
			case "name-desc":
				return filtered.sort((a, b) => b.name.localeCompare(a.name));
			default:
				return filtered;
		}
	}, [products, searchTerm, sortKey, selectedCategories, selectedAvailability]);

	const handleOpen = (item: Product) => {
		setSelectedItem(item);
		onOpen();
	};

	const handleSortChange = (keys: any) => {
		const key = Array.from(keys)[0] as SortKey;
		setSortKey(key);
	};

	return (
		<>
			<div className="mt-10 flex flex-col gap-8 lg:flex-row">
				<div className="flex-1">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex gap-2">
							<Input
								size="sm"
								isClearable
								label="Buscar"
								value={searchTerm}
								className="sm:max-w-xs"
								startContent={<SearchIcon size={5}/>}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setPage(1);
								}}
								onClear={() => {
									setSearchTerm("");
									setPage(1);
								}}
							/>
							<Popover placement="bottom-start">
								<PopoverTrigger>
									<Button color="secondary" variant="flat" className="min-w-fit">Filtros</Button>
								</PopoverTrigger>
																			<PopoverContent>
																				{(titleProps) => (
																					<FilterPopoverContent
																						titleProps={titleProps}
																						close={onClose}
																						clearFilters={clearFilters}
																						hasActiveFilters={hasActiveFilters}
																						sortedCategories={sortedCategories}
																						selectedCategories={selectedCategories}
																						updateQueryParams={updateQueryParams}
																						availabilityOptions={availabilityOptions}
																						selectedAvailability={selectedAvailability}
																					/>
																				)}
																			</PopoverContent>							</Popover>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<Select
								size="sm"
								className="sm:w-48"
								label="Ordenar"
								selectedKeys={[sortKey]}
								onSelectionChange={handleSortChange}
							>
								{sortOptions.map((option) => (
									<SelectItem key={option.key}>{option.value}</SelectItem>
								))}
							</Select>
							<Select
								size="sm"
								className="sm:w-36"
								label="Itens por página"
								selectedKeys={[itemsPerPage.toString()]}
								onSelectionChange={(keys) => {
									const newItemsPerPage = Number(Array.from(keys)[0]);
									setItemsPerPage(newItemsPerPage);
									setPage(1);
								}}
							>
								<SelectItem key="12">12</SelectItem>
								<SelectItem key="25">25</SelectItem>
								<SelectItem key="50">50</SelectItem>
							</Select>
						</div>
					</div>

					<div id="grid" className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{loading ? (
							<div className="col-span-full flex h-48 items-center justify-center">
								<Spinner size="lg" color="secondary" />
							</div>
						) : filteredItems.length === 0 ? (
							<div className="col-span-full text-center text-default-500">
								Nenhum produto encontrado para os filtros selecionados.
							</div>
						) : (
							filteredItems.map((product, index) => {
								const imageSrc = product.images?.[0]?.trim() || DEFAULT_IMAGE;
								const isOutOfStock = (product.storage ?? 0) <= 0;

								const cardContent = (
									<Card
										shadow="sm"
										key={product._id ?? index}
										isPressable
										onPress={() => handleOpen(product)}
										className={clsx(
											"transition hover:-translate-y-1",
											isOutOfStock && "border-danger-200 bg-default-100 opacity-80"
										)}
									>
										<CardBody className="overflow-hidden p-0">
											<Image
												shadow="sm"
												width="100%"
												alt={product.name}
												className={clsx(
													"h-[220px] w-full object-cover transition",
													isOutOfStock && "grayscale opacity-75"
												)}
												src={imageSrc}
											/>
										</CardBody>
										<CardFooter className="flex flex-col items-start gap-1">
											<div className="flex w-full items-center justify-between">
												<b className="line-clamp-2 text-left">{product.name}</b>
												{isOutOfStock && (
													<span className="text-xs font-semibold uppercase text-danger">Esgotado</span>
												)}
											</div>
											<p className="text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
											{!isOutOfStock && (
												<p className="text-xs text-default-500">Estoque: {product.storage}</p>
											)}
										</CardFooter>
									</Card>
								);

								return isOutOfStock ? (
									<Tooltip key={product._id ?? index} content="Produto esgotado">
										{cardContent}
									</Tooltip>
								) : (
									cardContent
								);
							})
						)}
					</div>

					{filteredItems.length > 0 && totalPages > 1 && (
						<div className="mt-6 flex justify-center">
							<Pagination
								isCompact
								showControls
								showShadow
								color="primary"
								page={page}
								total={totalPages}
								onChange={(nextPage) => {
									const grid = document.getElementById("grid");
									if (grid) grid.scrollIntoView({ behavior: "smooth" });
									setPage(nextPage);
								}}
							/>
						</div>
					)}
				</div>
			</div>
			{selectedItem && (
				<ProductModal product={selectedItem} isOpen={isOpen} onOpenChange={onOpenChange} />
			)}
		</>
	);
}