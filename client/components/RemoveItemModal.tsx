import {ShoppingItem} from "@/types";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Image} from "@nextui-org/image";
import React from "react";
import {Button} from "@nextui-org/button";
import {Tooltip} from "@nextui-org/tooltip";
import toast from "react-hot-toast";


interface RemoveItemModalProps {
    item: ShoppingItem;
    isOpen: boolean;
    onOpenChange: any;
    onConfirmRemoval: Function;
}

export const RemoveItemModal: React.FC<RemoveItemModalProps> = ({item, isOpen, onOpenChange, onConfirmRemoval}) => {


    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={"md"}>
                <ModalContent>
                    {(OnClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"> Tem Certeza? 😢 </ModalHeader>
                            <ModalBody>
                                <div className="flex min-w-full min-h-full">
                                    <div className="w-1/2">
                                        <Image
                                            shadow="sm"
                                            radius="lg"
                                            width="100%"
                                            alt={item.name}
                                            className="w-full object-fit"
                                            src={item.avatar ?? "https://thumbs.dreamstime.com/b/set-care-beauty-products-skin-29817248.jpg"}/>
                                    </div>
                                    <div className="flex flex-col w-1/2 ml-5 justify-between">
                                        Tem certeza de que quer remover {item.name} da sua lista de compras?
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Tooltip content="Remover item da lista">
                                    <Button color="danger" variant="light" onPress={() => {
                                        onConfirmRemoval(item.id);
                                        toast.error("Product removido da lista!");
                                        OnClose();
                                        }}>
                                        Sim
                                    </Button>
                                </Tooltip>
                                <Button
                                    color="primary"
                                    variant="flat"
                                    onPress={() => {
                                        OnClose();
                                    }}
                                >
                                   Não
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}