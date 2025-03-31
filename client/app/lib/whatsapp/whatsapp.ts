import { ShoppingItem } from "@/types";
import {formatPrice} from "@/app/lib/text-format";

export function buildWhatsappUrl(items: ShoppingItem[]): string {
    const phone = "5561985951534";
    const intro = "Olá, gostaria de fazer o pedido dos seguintes produtos:\n\n";

    let total = 0;
    const itemList = items
        .map((item) => {
            total += (item.quantity*item.price)
            return `• ${item.quantity}x ${item.name} - ${formatPrice(item.price)} R$`
        })
        .join("\n");

    const totalLine = `\n\n *• Total = ${formatPrice(total)}*`

    const message = encodeURIComponent(`${intro}${itemList}${totalLine}`);
    return `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
}