export default function CatalogueLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block min-w-full-w-4xl text-center justify-center">
				{children}
			</div>
		</section>
	);
}
