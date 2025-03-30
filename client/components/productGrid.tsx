'use client'
import React, {useEffect} from "react";
import {Card, CardBody, CardFooter} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import {formatPrice} from "@/app/lib/text-format";
import {Pagination} from "@nextui-org/pagination";
import {useDisclosure} from "@nextui-org/use-disclosure";
import {ProductModal} from "@/components/productModal";
import {Product} from "@/types";
import {Select, SelectItem, Spinner} from "@nextui-org/react";
import {Input} from "@nextui-org/input";
import {SearchIcon} from "@/components/icons";
import {getProducts} from "@/app/lib/api/product.api";
import {button as buttonStyles} from "@nextui-org/react";
import {Link} from "@nextui-org/link";
import {subtitle} from "@/components/primitives";

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
    const [selectedItem, setSelectedItem] = React.useState<Product>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortKey, setSortKey] = React.useState<SortKey>("default");

    const itemsPerPage = 12;

    useEffect(() => {
        async function fetchItems() {
            try {
                const productsResponse = await getProducts();
                console.log(productsResponse)
                setProducts(productsResponse);
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchItems();
    }, []);

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

    const pages = Math.ceil(filteredItems.length / itemsPerPage);

    const pageProducts = React.useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [page, filteredItems]);

    const handleOpen = (item: Product) => {
        setSelectedItem(item);
        onOpen();
    };

    const handleSortChange = (keys: any) => {
        const key = Array.from(keys)[0] as SortKey;
        setSortKey(key);
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Spinner size="lg" color="secondary"/>
            </div>
        );
    }

    return (
        <>
            {pageProducts &&
                <>
                    <div className="flex flex-col sm:flex-row justify-center items-center mb-5 mt-10 gap-4">
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
                    </div>
                </>
            }
            {pageProducts ?
                <>
                    <div id="grid" className="gap-4 grid grid-cols-2 sm:grid-cols-4">
                        {pageProducts.map((product, index) => (
                            <Card shadow="sm" key={product._id ?? index} isPressable
                                  onPress={() => handleOpen(product)}>
                                <CardBody className="overflow-visible p-0">
                                    <Image
                                        shadow="sm"
                                        radius="lg"
                                        width="100%"
                                        alt={product.name}
                                        className="w-full object-cover h-[180px]"
                                        src={product.image ?? "https://thumbs.dreamstime.com/b/set-care-beauty-products-skin-29817248.jpg"}
                                    />
                                </CardBody>
                                <CardFooter className="text-small justify-between flex flex-col">
                                    <b>{product.name}</b>
                                    <p className="text-default-500 whitespace-nowrap">{formatPrice(product.price)}</p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    <div className="flex justify-center mt-6">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => {
                                const grid = document.getElementById("grid");
                                if (grid) grid.scrollIntoView({behavior: "smooth"});
                                setPage(page);
                            }}
                        />
                    </div>
                    {selectedItem && <ProductModal product={selectedItem} isOpen={isOpen} onOpenChange={onOpenChange}/>}
                </>
                :
                <div className="mt-10">
                    <h2 className={subtitle({class: "mt-[-0.8rem]"})}>
                        Nenhum item no catalogo
                    </h2>
                    <h2 className={subtitle({class: "mt-[-0.8rem]"})}>
                        Entre em contato com a consultora
                    </h2>
                    <Link
                        className={buttonStyles({color: "secondary", radius: "full"})}
                        href="/contact"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                            <path fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                        </svg>
                        Contato
                    </Link>
                </div>
            }
        </>
    );
}
