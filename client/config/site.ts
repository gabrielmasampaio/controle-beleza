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
    {
      label: "Admin",
      href: "/admin",
    },
	],
	links: {
		github: "https://github.com/nextui-org/nextui",
		twitter: "https://twitter.com/getnextui",
		docs: "https://nextui.org",
		discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev"
	},
};
