import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head ><title> Revenda Online </title></head>
			<body
				className={clsx(
					"min-h-screen bg-background bg-scroll font-sans antialiased",
					fontSans.variable,
					"bg-pink-radial dark:bg-pink-radial-dark",
				)}
			>
				<Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
					<div className="relative flex flex-col min-h-screen">
						<Navbar />
						<main className="w-full max-w-[90vw] sm:max-w-[640px] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto pt-16 px-4 flex-grow">
							{children}
						</main>
						<footer className="w-full flex items-center justify-end py-3 px-10">
							<Link
								isExternal
								className="flex items-center gap-1 text-current"
								href="https://gsampaiodev.com"
								title="nextui.org homepage"
							>
								<span className="text-default-600 text-sm">by</span>
								<p className="text-primary text-sm">GSampaioDev</p>
							</Link>
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
