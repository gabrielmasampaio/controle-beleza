'use client'
import React from "react";
import {Item, items} from "@/app/lib/data";
import {Card, CardBody, CardFooter} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import {formatPrice} from "@/app/lib/text-format";
import {Pagination} from "@nextui-org/pagination";
import {useDisclosure} from "@nextui-org/use-disclosure";
import {ProductModal} from "@/components/productModal";




export default function ProductGrid() {
  const [page, setPage] = React.useState(1);
  const [selectedItem, setSelectedItem] = React.useState(items[0]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const itemsPerPage = 12;

  const pages = Math.ceil(items.length/itemsPerPage)

  const pageItems =  React.useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return items.slice(start, end);
  }, [page, items]);

  const handleOpen = (item: Item) => {
    setSelectedItem(item);
    onOpen();
  }

  return (
      <div id="grid" className="gap-4 grid grid-cols-2 sm:grid-cols-4 mt-20">
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
                <p className="text-default-500 whitespace-nowrap">R${formatPrice(item.price)}</p>
              </CardFooter>
            </Card>
        ))}
        <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => {
              const grid = document.getElementById('grid')
              if(grid) grid.scrollIntoView({behavior: 'smooth'})
              setPage(page)
            }}
        />
        <ProductModal seeOnly={true} product={selectedItem} isOpen={isOpen} onOpenChange={onOpenChange}/>
      </div>
  )
}
