'use client';

import React from "react";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {User} from "@nextui-org/user";
import {Tooltip} from "@nextui-org/tooltip";
import {DeleteIcon, EditIcon, EyeIcon} from "@nextui-org/shared-icons";
import {Pagination} from "@nextui-org/pagination";
import {columns, Item, items} from "@/app/lib/data";
import {ProductModal} from "@/components/productModal";
import {useDisclosure} from "@nextui-org/use-disclosure";


export default function AdminTable({className = ""}) {

  const [seeOnly, setSeeOnly] = React.useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedItem, setSelectedItem] = React.useState<Item | undefined>(undefined);

  const renderCell = React.useCallback((item: Item, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof Item];

    switch (columnKey) {
      case "name":
        return (
            <User
                avatarProps={{radius: "md", src: item.avatar}}
                name={cellValue}
                description="lorem ipsum sit amet a dolor gena kenet imma silum ater"
            >
              {item.name}
            </User>
        );
      case "price":
        return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
        );
      case "actions":
        return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Visualizar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => {
                      setSeeOnly(true)
                      setSelectedItem(item)
                      onOpen()
                    }}>
                <EyeIcon />
              </span>
              </Tooltip>
              <Tooltip content="Editar Produto">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => {
                      setSeeOnly(false)
                      setSelectedItem(item)
                      onOpen()
                    }}>
                <EditIcon />
              </span>
              </Tooltip>
              <Tooltip color="danger" content="Deletar Produto">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
              </Tooltip>
            </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;

  const pages = Math.ceil(items.length / rowsPerPage);

  const tableItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return items.slice(start, end);
  }, [page, items]);


  return (
      <div className={className}>
        <Table
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                />
              </div>
            }>
          <TableHeader columns={columns}>
            {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
            )}
          </TableHeader>
          <TableBody items={tableItems}>
            {(tableItem) => (
                <TableRow key={tableItem.id}>
                  {(columnKey) => <TableCell>{renderCell(tableItem, columnKey)}
                  </TableCell>}
                </TableRow>
            )}
          </TableBody>
        </Table>
        <ProductModal seeOnly={seeOnly} isOpen={isOpen} onOpenChange={onOpenChange} product={selectedItem ?? undefined} />
      </div>
  )
}