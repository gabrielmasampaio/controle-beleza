'use client'
import React from "react";
import {items} from "@/app/lib/data";
import {Card, CardBody, CardFooter} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import {formatPrice} from "@/app/lib/text-format";
import {Pagination} from "@nextui-org/pagination";
import {useDisclosure} from "@nextui-org/use-disclosure";
import {ProductModal} from "@/components/productModal";
import {Item} from "@/types";
import {Select, SelectItem} from "@nextui-org/react";
import {Input} from "@nextui-org/input";
import {SearchIcon} from "@/components/icons";

type SortKey = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const sortOptions: { key: SortKey; value: string }[] = [
    {key: "default", value: "Padrão"},
    {key: "price-asc", value: "Preço: Menor → Maior"},
    {key: "price-desc", value: "Preço: Maior → Menor"},
    {key: "name-asc", value: "Nome: A → Z"},
    {key: "name-desc", value: "Nome: Z → A"},
];


export default function ProductGrid() {
    const [page, setPage] = React.useState(1);
    const [selectedItem, setSelectedItem] = React.useState(items[0]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortKey, setSortKey] = React.useState<SortKey>("default");


    const itemsPerPage = 12;

    const filteredItems = React.useMemo(() => {
        let sorted = [...items].filter((item) =>
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
    }, [items, searchTerm, sortKey]);

    const pages = Math.ceil(filteredItems.length / itemsPerPage);

    const pageItems = React.useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [page, filteredItems]);


    const handleOpen = (item: Item) => {
        setSelectedItem(item);
        onOpen();
    }

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
            <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">
                {pageItems.map((item, index) => (
                    <Card shadow="sm" key={index} isPressable onPress={() => handleOpen(item)}>
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={item.name}
                                className="w-full object-cover h-[180px]"
                                src={item.avatar ?? "https://thumbs.dreamstime.com/b/set-care-beauty-products-skin-29817248.jpg"}
                            />
                        </CardBody>
                        <CardFooter className="text-small justify-between">
                            <b>{item.name}</b>
                            <p className="text-default-500 whitespace-nowrap">
                                {formatPrice(item.price)}
                            </p>
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
            <ProductModal product={selectedItem} isOpen={isOpen} onOpenChange={onOpenChange}/>
        </>
    )
}
