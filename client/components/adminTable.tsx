import React from "react";
import {
    Button,
    Input,
    Pagination, Spinner,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure,
    User,
} from "@heroui/react";
import {DeleteIcon, EditIcon, EyeIcon} from "@heroui/shared-icons";
import {Product} from "@/types";
import {formatPrice} from "@/app/lib/text-format";
import {ProductFormModal} from "@/components/ProductFormModal";
import {RemoveItemModal} from "@/components/RemoveItemModal";
import {SearchIcon} from "@/components/icons";
import {deleteProduct, getProducts} from "@/app/lib/api/product.api";
import toast from "react-hot-toast";
import useSWR from "swr";

interface AdminTableProps {
    className?: string;
}

export default function AdminTable({className = ""}: Readonly<AdminTableProps>) {
    const [selectedItem, setSelectedItem] = React.useState<Product>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {
        isOpen: isRemoveItemOpen,
        onOpen: onRemoveItemOpen,
        onOpenChange: onRemoveItemOpenChange,
    } = useDisclosure();

    const [page, setPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [searchTerm, setSearchTerm] = React.useState("");

    const {data, isLoading, mutate} = useSWR(
        `getProducts?page=${page}&limit=${itemsPerPage}&searchTerm=${searchTerm}`,
        () => getProducts(page, itemsPerPage, searchTerm),
        {keepPreviousData: true}
    );

    const pages = React.useMemo(() => {
        return data?.pages ? data.pages : 0;
    }, [data?.pages]);

    const loadingState = isLoading || data === undefined ? "loading" : "idle";

    const [highlightedId, setHighlightedId] = React.useState<string | null>(null);

    const renderCell = (product: Product, columnKey: React.Key) => {
        const cellValue = product[columnKey as keyof Product];

        switch (columnKey) {
            case "name":
                return (
                    <Tooltip
                        className="cursor-pointer"
                        onClick={() => handleOpenProduct(product)}
                        content={
                            <div className="text-xs flex items-center gap-2">
                                <EyeIcon/> ver produto
                            </div>
                        }
                    >
                        <User
                            className="hover:opacity-50"
                            avatarProps={{
                                radius: "lg",
                                src: product.images && product.images.length > 0 ? product.images[0] : "",
                            }}
                            name={cellValue as string}
                        >
                            {product.description}
                        </User>
                    </Tooltip>
                );
            case "price":
                return formatPrice(cellValue as number);
            case "actions":
                return (
                    <div className="flex items-center justify-center gap-4">
                        <Tooltip content="Editar Produto">
                        <span
                            className="text-lg cursor-pointer active:opacity-50"
                            onClick={() => handleOpenProduct(product)}
                        >
                          <EditIcon />
                        </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Remover Produto">
                        <span
                            onClick={() => handleDelete(product)}
                            className="text-lg text-red-500 cursor-pointer active:opacity-50"
                        >
                          <DeleteIcon />
                        </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue as string;
        }
    };

    const handleOpenProduct = (item: Product) => {
        setSelectedItem(item);
        onOpen();
    };

    const handleDelete = (item: Product) => {
        setSelectedItem(item);
        onRemoveItemOpen();
    };

    const onDeleteItem = async (itemId: string) => {
        try {
            await deleteProduct(itemId);
            toast.success("Produto removido");
            mutate(); // Revalidate the data
            onRemoveItemOpenChange();
        } catch (err) {
            console.error("Erro ao deletar:", err);
            toast.error("Erro ao deletar produto");
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
                    onValueChange={setSearchTerm}
                    onClear={() => setSearchTerm("")}
                />
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
                    <SelectItem key="10">10</SelectItem>
                    <SelectItem key="15">15</SelectItem>
                    <SelectItem key="25">25</SelectItem>
                </Select>
                <Button
                    color="secondary"
                    className="min-h-full"
                    startContent={<span className="text-lg font-bold mb-[2px]"> + </span>}
                    onPress={() => {
                        setSelectedItem(undefined);
                        onOpen();
                    }}
                >
                    Novo
                </Button>
            </div>

            <Table
                aria-label="Tabela de produtos"
                bottomContent={
                    pages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="secondary"
                                page={page}
                                total={pages}
                                onChange={(p) => setPage(p)}
                            />
                        </div>
                    ) : null
                }
            >
                <TableHeader>
                    <TableColumn key="name">Produto</TableColumn>
                    <TableColumn key="price">Preço</TableColumn>
                    <TableColumn key="storage">Estoque</TableColumn>
                    <TableColumn key="actions">Ações</TableColumn>
                </TableHeader>
                <TableBody
                    items={data?.products ?? []}
                    loadingContent={<Spinner/>}
                    loadingState={loadingState}
                >
                    {(item) => (
                        <TableRow
                            key={item?._id}
                            className={item?._id === highlightedId ? "text-warning transition duration-75" : ""}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ProductFormModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                product={selectedItem}
                onSave={(savedProduct) => {
                    mutate(); // Revalidate the data
                    setHighlightedId(savedProduct._id ?? null);
                    setTimeout(() => setHighlightedId(null), 3000);
                }}
            />

            {selectedItem && <RemoveItemModal
                isOpen={isRemoveItemOpen}
                item={{...selectedItem, quantity: 0}}
                onOpenChange={onRemoveItemOpenChange}
                onConfirmRemoval={onDeleteItem}
            />}
        </div>
    );
}