export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "Controle Beleza",
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
    ],
};
