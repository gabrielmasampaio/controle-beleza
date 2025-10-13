export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col justify-center gap-4 py-4 md:py-10">
            <div className="inline-block min-w-max text-center justify-center">
                {children}
            </div>
        </section>
    );
}
