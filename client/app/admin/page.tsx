import LoginCard from "@/components/loginCard";
import AdminTable from "@/components/adminTable";
import {title} from "@/components/primitives";


export default function AdminPage() {
	return (
		<div>
			{false ? <LoginCard className={"mt-auto"}/>
					: <>
						<h1 className={title()}>Painel de </h1>
						<h1 className={title()}>
							<p className={title({ color: "green" })}>Admin</p>
						</h1>
						<AdminTable className={"mt-7"} />
					</>
			}
		</div>
	);
}
