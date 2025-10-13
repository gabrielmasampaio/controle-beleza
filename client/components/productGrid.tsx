'use client'
import React, {useEffect} from "react";
import {
    Card,
    CardBody,
    CardFooter,
    Image,
    Input,
    Pagination,
    Select,
    SelectItem,
    Spinner,
    useDisclosure,
} from "@heroui/react";
import {formatPrice} from "@/app/lib/text-format";
import {ProductModal} from "@/components/productModal";
import {Product} from "@/types";
import {SearchIcon} from "@/components/icons";
import {getProducts} from "@/app/lib/api/product.api";
import {DEFAULT_IMAGE} from "@/app/lib/constants";

type SortKey = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const sortOptions: { key: SortKey; value: string }[] = [
    {key: "default", value: "Padrão"},
    {key: "price-asc", value: "Preço: Menor → Maior"},
    {key: "price-desc", value: "Preço: Maior → Menor"},
    {key: "name-asc", value: "Nome: A → Z"},
    {key: "name-desc", value: "Nome: Z → A"},
];

export default function ProductGrid() {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [selectedItem, setSelectedItem] = React.useState<Product>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortKey, setSortKey] = React.useState<SortKey>("default");

    const [itemsPerPage, setItemsPerPage] = React.useState(25);

    useEffect(() => {
        fetchItems();
    }, [page, searchTerm, itemsPerPage]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const productsResponse = await getProducts(page, itemsPerPage, searchTerm);
            console.log(productsResponse)
            setProducts(productsResponse.products);
            setTotalPages(productsResponse.pages);
        } catch (err) {
            console.error("Erro ao carregar produtos:", err);
        } finally {
            setLoading(false);
            setLoading(false);
        }
    }

    const filteredItems = React.useMemo(() => {
        let sorted = [...products].filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        switch (sortKey) {
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        return sorted;
    }, [products, searchTerm, sortKey]);


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
            <div className="flex flex-col sm:flex-row justify-center items-center mb-5 mt-10 gap-4">
                <Input
                    size="sm"
                    isClearable
                    label="Buscar"
                    value={searchTerm}
                    startContent={<SearchIcon size={5}/>}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm("")}
                />
                <Select
                    size="sm"
                    className="max-w-[200px]"
                    label="Ordenar"
                    defaultSelectedKeys={["default"]}
                    onSelectionChange={handleSortChange}
                >
                    {sortOptions.map((option) => (
                        <SelectItem key={option.key}>{option.value}</SelectItem>
                    ))}
                </Select>
                <Select
                    size="sm"
                    className="max-w-[150px]"
                    label="Itens por página"
                    defaultSelectedKeys={[itemsPerPage.toString()]}
                    onSelectionChange={(keys) => {
                        const newItemsPerPage = Number(Array.from(keys)[0]);
                        setItemsPerPage(newItemsPerPage);
                        setPage(1);
                    }}
                >
                    <SelectItem key="25">25</SelectItem>
                    <SelectItem key="50">50</SelectItem>
                    <SelectItem key="100">100</SelectItem>
                </Select>
            </div>
            <div id="grid" className="gap-4 grid grid-cols-2 sm:grid-cols-4">
                {loading ? (
                    <div className="col-span-full flex justify-center items-center h-[200px]">
                        <Spinner size="lg" color="secondary"/>
                    </div>
                ) : (
                    products.length === 0 && !loading ? (
                        <div className="col-span-full text-center text-default-500 text-sm">
                            Nenhum produto encontrado.
                        </div>
                    ) : (
                        products.map((product, index) => (
                            <Card shadow="sm" key={product._id ?? index} isPressable
                                  onPress={() => handleOpen(product)}>
                                {product.images && (<CardBody className="overflow-visible p-0">
                                    <Image
                                        shadow="sm"
                                        radius="lg"
                                        width="100%"
                                        alt={product.name}
                                        className="w-full object-cover h-[180px]"
                                        src={product.images[0]?.trim() || DEFAULT_IMAGE}
                                    />
                                </CardBody>)}
                                <CardFooter className="text-small justify-between flex flex-col">
                                    <b>{product.name}</b>
                                    <p className="text-default-500 whitespace-nowrap">{formatPrice(product.price)}</p>
                                </CardFooter>
                            </Card>
                        ))
                    )
                )
                }
            </div>
            <div className="flex justify-center mt-6 gap-4">
                {products.length > 0 &&
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={totalPages}
                        onChange={(page) => {
                            const grid = document.getElementById("grid");
                            if (grid) grid.scrollIntoView({behavior: "smooth"});
                            setPage(page);
                        }}
                    />
                }
            </div>
            {selectedItem && <ProductModal product={selectedItem} isOpen={isOpen} onOpenChange={onOpenChange}/>}
        </>
    );
}
