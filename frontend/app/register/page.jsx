"use client";

import { Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader, CardFooter } from "@nextui-org/react";
import Form from "./form";
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default function Register() {
    const session = getServerSession();
    if (session) {
        redirect('/');
    }

    return (
        <div className="flex flex-col w-full h-full items-center">
            <Card className="max-w-full w-[340px] max-h-[600px]">
                <CardHeader className="justify-center">
                    <h1 className="text-center">
                        Create new account
                    </h1>
                </CardHeader>
                <CardBody className="overflow-hidden">
                    <Form />
                </CardBody>
                <CardFooter className="overflow-hidden justify-center mb-3">
                    <p className="text-center text-small">
                        Already have an account?{" "}
                        <Link size="sm" href="/login">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
