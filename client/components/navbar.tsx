 import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";
import {title} from "@/components/primitives";

export const Navbar = () => {
	return (
		<NextUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<h3 className={title({size: "xsm"})}>Revenda</h3>
						<h3 className={title({ color: "pink", size: "xsm" })}>Online&nbsp;</h3>
					</NextLink>
				</NavbarBrand>
				<ul className="hidden lg:flex md:flex gap-4 justify-start ml-2">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: "foreground" }),
									"data-[active=true]:text-primary data-[active=true]:font-medium"
								)}
								color="foreground"
								href={item.href}
							>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>

			<NavbarContent className="  basis-1 pl-4" justify="end">
				<ThemeSwitch />
				<NavbarMenuToggle className="lg:hidden md:hidden"/>
			</NavbarContent>

			<NavbarMenu >
				<div className="mx-4 mt-2 flex flex-col gap-2">
					{siteConfig.navItems.map((item, index) => (
							<NavbarMenuItem key={`${item}-${index}`}>
								<Link
										color={
											index === 2
													? "primary"
													: "foreground"
										}
										href={item.href}
										size="lg"
								>
									{item.label}
								</Link>
							</NavbarMenuItem>
					))}
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
