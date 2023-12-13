'use client';
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Divider} from "@nextui-org/divider";
import {Link} from "@nextui-org/link";
import {button as buttonStyles} from "@nextui-org/theme";
import {Input} from "@nextui-org/input";
import React from "react";
import {credentials} from "@/app/lib/data";



export default function LoginCard({className = "", onLoginSuccess = ()=>{}}) {

  const [mail, setMail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [failedAttempt, setFailedAttempt] = React.useState(false)
  const submit = () => {
    if(mail == credentials.username || password == credentials.password){
      setFailedAttempt(false)
      onLoginSuccess()
    } else {
      console.log("failedAttempt", failedAttempt)
      setFailedAttempt(true)
    }
  }

  return (
      <div className={className} >
        <Card className="min-h-[300px]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col justify-start items-start">
              <p className="text-md">Admin</p>
              <p className="text-small text-default-500">Faça login para continuar</p>
            </div>
          </CardHeader>
          <Divider/>
          <CardBody className="gap-3 px-5">
            <Input size="sm" type="email" label="E-mail" value={mail} onValueChange={setMail}/>
            <Input size="sm" type="password" label="Senha" value={password} onValueChange={setPassword}/>
            <div hidden={!failedAttempt} className="text-xs text-red-600">*Credenciais inválidas</div>
          </CardBody>
          <Divider/>
          <CardFooter>
            <div className="flex px-2 justify-between min-w-full">
              <Link
                  className={buttonStyles({ variant: "bordered", radius: "full" })}
                  href="/"
              >
                Início
              </Link>
              <Link
                  className={buttonStyles({ color: "primary", radius: "full", variant: "shadow" }) + " cursor-pointer"}
                  onClick={submit}
              >
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
  )
}