'use client'

import LoginCard from "@/components/loginCard";
import AdminTable from "@/components/adminTable";
import {title} from "@/components/primitives";
import React from "react";


export default function AdminPage() {

	const [logged, setLogged] = React.useState(true)

	return (
		<div>
			{!logged ? <LoginCard className={"mt-auto"} onLoginSuccess={() => setLogged(true)}/>
					: <>
						<h1 className={title()}>Painel de </h1>
						<h1 className={title()}>
							<p className={title({ color: "pink" })}>Admin</p>
						</h1>
						<AdminTable className={"mt-7"} />
					</>
			}
		</div>
	);
}
