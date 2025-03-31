'use client'

import LoginCard from "@/components/loginCard";
import AdminTable from "@/components/adminTable";
import {title} from "@/components/primitives";
import React, {useEffect, useState} from "react";
import {getToken} from "@/app/lib/localStorage/auth";
import {Spinner} from "@nextui-org/react";
import {validateToken} from "@/app/lib/api/auth";


export default function AdminPage() {

	const [logged, setLogged] = React.useState(false)
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		async function checkAuth() {
			const isValid = await validateToken();
			setLogged(isValid);
			setLoading(false);
		}

		checkAuth();
	}, []);

	if (loading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				<Spinner size="lg" color="secondary" />
			</div>
		);
	}

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
