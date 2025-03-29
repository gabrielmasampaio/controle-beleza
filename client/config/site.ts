export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "Revenda Online",
    description: "Realce sua beleza com nossos produtos.",
    navItems: [
        {
            label: "Catálogo",
            href: "/catalogue",
        },
        {
            label: "Contato",
            href: "/contact",
        },
        {
            label: "Minha Lista",
            href: "/shopping-list",
        },
    ],
};
