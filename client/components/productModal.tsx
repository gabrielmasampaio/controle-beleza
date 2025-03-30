'use client'

import type {Item} from "@/types";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import React from "react";
import {Image} from "@nextui-org/image";
import {formatPrice} from "@/app/lib/text-format";
import {useShoppingList} from "@/app/lib/shopping-list/useShoppingList";
import {Code} from "@nextui-org/code";
import {Tooltip} from "@nextui-org/tooltip";
import {Card, CardBody, CardFooter} from "@nextui-org/card";
import {Divider} from "@nextui-org/divider";
import {buildWhatsappUrl} from "@/app/lib/whatsapp/whatsapp";

interface ProductModalProps {
    product: Item;
    isOpen: boolean;
    onOpenChange: any;
    hideFooter?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({product, isOpen, onOpenChange, hideFooter}) => {
    const {addItem} = useShoppingList();

    const handleAddToList = () => {
        if (product) {
            addItem({...product, quantity: 1});
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{product.name}</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col sm:flex-row min-w-full min-h-full gap-4">
                                <div className="w-full sm:w-8/12">
                                    <Image
                                        shadow="sm"
                                        radius="lg"
                                        width="100%"
                                        alt={product.name}
                                        className="w-full object-fit"
                                        src={product.avatar ?? "https://thumbs.dreamstime.com/b/set-care-beauty-products-skin-29817248.jpg"}
                                    />
                                </div>

                                <div className="flex flex-col w-full sm:w-4/12 justify-evenly">
                                    {!product.description
                                        ?
                                        <Card className="min-w-full min-h-full">
                                            <CardBody>
                                                <Code color="primary" className="w-fit text-end self-center">
                                                    {formatPrice(product.price)}
                                                </Code>
                                            </CardBody>
                                        </Card>
                                        :
                                        <Card className="min-w-full min-h-full">
                                            <CardBody>
                                                <span>{product.description}</span>
                                            </CardBody>
                                            <Divider/>
                                            <CardFooter className="min-w-full justify-center">
                                                <Code color="primary" className="w-fit text-end self-center">
                                                    {formatPrice(product.price)}
                                                </Code>
                                            </CardFooter>
                                        </Card>
                                    }
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            {(!hideFooter) ?
                                <>
                                    <Button
                                        color="success"
                                        variant="flat"
                                        onPress={() => {
                                            handleAddToList();
                                            onClose();
                                        }}
                                    >
                                        Adicionar à Lista
                                    </Button>
                                    <Tooltip content="Pedir este item via whatsapp">
                                        <Button color="primary" onPress={() =>{
                                            const url = buildWhatsappUrl([{ ...product, quantity: 1 }]);
                                            window.open(url, "_blank");
                                        }}>
                                            Pedir agora
                                        </Button>
                                    </Tooltip>
                                </>
                                :
                                <></>
                            }
                        </ModalFooter>

                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
