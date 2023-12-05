export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col items-center min-h-[600px] justify-center gap-4 py-8 md:py-10 sm:min-w-full">
			<div className="inline-block text-center justify-center items-center min-w-[450px]">
				{children}
			</div>
		</section>
	);
}
