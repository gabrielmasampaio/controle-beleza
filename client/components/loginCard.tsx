'use client';
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Divider} from "@nextui-org/divider";
import {Link} from "@nextui-org/link";
import {button as buttonStyles} from "@nextui-org/theme";
import {Input} from "@nextui-org/input";
import React from "react";
import {login} from "@/app/lib/api/auth";
import {saveToken} from "@/app/lib/localStorage/auth";
import {Button} from "@nextui-org/button";

export default function LoginCard({
                                      className = "", onLoginSuccess = () => {
    }
                                  }) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [failedAttempt, setFailedAttempt] = React.useState(false);

    const submit = async () => {
        try {
            const result = await login({username, password});
            saveToken(result.token);
            setFailedAttempt(false);
            onLoginSuccess();
        } catch (err) {
            console.error(err);
            setFailedAttempt(true);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit();
    };

    return (
        <div className={className}>
            <Card className="min-h-[300px]">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col justify-start items-start">
                        <p className="text-md">Admin</p>
                        <p className="text-small text-default-500">Faça login para continuar</p>
                    </div>
                </CardHeader>
                <Divider/>
                <form onSubmit={handleSubmit}>
                    <CardBody className="gap-3 px-5">
                        <Input
                            size="sm"
                            type="text"
                            label="Nome de usuário"
                            value={username}
                            onValueChange={setUsername}
                        />
                        <Input
                            size="sm"
                            type="password"
                            label="Senha"
                            value={password}
                            onValueChange={setPassword}
                        />
                        <div hidden={!failedAttempt} className="text-xs text-red-600">
                            *Credenciais inválidas
                        </div>
                    </CardBody>
                    <Divider/>
                    <CardFooter>
                        <div className="flex px-2 justify-between min-w-full">
                            <Link
                                className={buttonStyles({variant: "bordered", radius: "full"})}
                                href="/"
                            >
                                Início
                            </Link>
                            <Button
                                type="submit"
                                className={buttonStyles({
                                    color: "primary",
                                    radius: "full",
                                    variant: "shadow",
                                })}
                            >
                                Entrar
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
