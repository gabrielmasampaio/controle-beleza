import { ShoppingItem } from "@/types";

export function buildWhatsappUrl(items: ShoppingItem[]): string {
    const phone = "5561985951534";
    const intro = "Olá, gostaria de fazer o pedido dos seguintes produtos:\n\n"; //update to %0A caso nao mude

    const body = items
        .map((item) => `• ${item.quantity}x ${item.name} - ${item.price.toFixed(2).replace('.', ',')} R$`)
        .join("\n");

    const message = encodeURIComponent(`${intro}${body}`);
    return `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
}