import {ShoppingItem} from "@/types";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Image,
    Button,
    Tooltip,
} from "@heroui/react";
import React from "react";
import { DEFAULT_IMAGE } from "@/app/lib/constants";


interface RemoveItemModalProps {
    item: ShoppingItem;
    isOpen: boolean;
    onOpenChange: any;
    onConfirmRemoval: Function;
}

export const RemoveItemModal: React.FC<RemoveItemModalProps> = ({item, isOpen, onOpenChange, onConfirmRemoval}) => {


    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={"md"} className={"max-w-[90vw]"}>
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
                                            src={item.image?.trim() || DEFAULT_IMAGE}/>
                                    </div>
                                    <div className="flex flex-col w-1/2 ml-5 justify-between">
                                        Tem certeza de que quer remover {item.name} da sua lista de compras?
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Tooltip content="Remover item da lista">
                                    <Button color="danger" variant="light" onPress={() => {
                                        onConfirmRemoval(item._id);
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