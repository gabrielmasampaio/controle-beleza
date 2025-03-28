import { title } from "@/components/primitives";
import ProductGrid from "@/components/productGrid";

export default function CataloguePage() {
	return (
		<div>
			<h1 className={title()}>Catálogo de <br/></h1>
			<h1 className={title()}>
				<p className={title({ color: "pink" })}>Produtos</p>
			</h1>
			<ProductGrid />
		</div>
	);
}
