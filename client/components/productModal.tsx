'use client'

import type {Item} from "@/app/lib/data";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import React from "react";
import {Image} from "@nextui-org/image";
import {formatPrice} from "@/app/lib/text-format";

interface ProductModalProps {
  seeOnly: boolean;
  product?: Item;
  isOpen: boolean;
  onOpenChange: any;
}

export const ProductModal: React.FC<ProductModalProps> = ({ seeOnly, product, isOpen, onOpenChange }) => {

  const contact = (product: Item) => {
    const url = `https://api.whatsapp.com/send?phone=5561985951534&text=Ol%C3%A1,%20gostaria%20de%20fazer%20o%20pedido%20desse%20produto%20que%20vi%20no%20seu%20cat%C3%A1logo%20online:%20${product.name}`;

    window.open(url, "_blank");
  };

return(
      <>
        {seeOnly && product ?
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
              <ModalContent>
                {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">{product.name}</ModalHeader>
                      <ModalBody>
                        <div className="flex min-w-full min-h-full">
                          <div className="w-8/12">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={product.name}
                                className="w-full object-fit"
                                src={product.avatar ?? "https://thumbs.dreamstime.com/b/set-care-beauty-products-skin-29817248.jpg"} />
                          </div>

                          <div className="flex flex-col w-4/12 ml-5 justify-between">
                            <div>
                              {product.name}
                              <p> Preço <br/> <p className="text-sm"> R${formatPrice(product.price)} </p></p>
                            </div>
                            <br/>
                            <div className="text-xs">
                              *Consulte a disponibilidade do produto via whatsapp clicando no botão abaixo.
                            </div>
                          </div>
                        </div>

                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                          Fechar
                        </Button>
                        <Button color="primary" onPress={() => contact(product)}>
                          Entrar em contato
                        </Button>
                      </ModalFooter>
                    </>
                )}
              </ModalContent>
            </Modal>
          : <>
              {product ?
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                          <ModalBody>
                            <p>
                              No seeOnly modal {product.name}
                            </p>
                          </ModalBody>
                          <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                              Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                              Action
                            </Button>
                          </ModalFooter>
                        </>
                    )}
                  </ModalContent>
                  </Modal>
                :
                  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                      {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                              <p>
                                No seeOnly modal
                              </p>
                            </ModalBody>
                            <ModalFooter>
                              <Button color="danger" variant="light" onPress={onClose}>
                                Close
                              </Button>
                              <Button color="primary" onPress={onClose}>
                                Action
                              </Button>
                            </ModalFooter>
                          </>
                      )}
                    </ModalContent>
                  </Modal>
              }
            </>
        }
      </>
  )
};


function ConfirmDeleteModal() {
  return(
      <>
        Confirm delete
      </>
  )
}