"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader } from "@nextui-org/react";

export default function App() {
    const [selected, setSelected] = useState("login");
    const [header, setHeader] = useState("Login to the account")
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        validateForm();
    }, [name, email, password]);
    // Validate form 
    const validateForm = () => {
        let errors = {};

        if (!name && (selected != "login")) {
            errors.name = 'Name is required.';
        }

        if (!email) {
            errors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Please enter a valid email.';
        }

        if (!password) {
            errors.password = 'Password is required.';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }

        setErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    };
    // Submit 
    const handleSubmit = () => {
        if (isFormValid) {
            console.log('Form submitted successfully!');
        } else {
            console.log('Form has errors. Please correct them.');
        }
    };

    useEffect(() => {
        setName("")
        setEmail("")
        setPassword("")
        setHeader((selected == "login") ? "Login to the account" : "Create new account")
    }, [selected])

    return (
        <div className="flex flex-col w-full h-full items-center">

            <Card className="max-w-full w-[340px] max-h-[600px]">

                <CardBody className="overflow-hidden">
                    <h1 className="text-center mb-3">
                        {header}
                    </h1>
                    <Tabs
                        fullWidth
                        size="md"
                        aria-label="Tabs form"
                        selectedKey={selected}
                        onSelectionChange={setSelected}
                    >
                        <Tab key="login" title="Login">
                            <form className="flex flex-col gap-4">
                                <Input
                                    // isRequired
                                    label="Email"
                                    type="email"
                                    variant="bordered"
                                    onChange={(e) => setEmail(e.target.value)}
                                    errorMessage={errors?.email}
                                />
                                <Input
                                    // isRequired
                                    label="Password"
                                    type="password"
                                    variant="bordered"
                                    onChange={(e) => setPassword(e.target.value)}
                                    errorMessage={errors?.password}
                                />

                                <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="primary" isDisabled={!isFormValid} onClick={handleSubmit}>
                                        Login
                                    </Button>
                                </div>
                                <p className="text-center text-small">
                                    Need to create an account?{" "}
                                    <Link size="sm" onPress={() => setSelected("sign-up")}>
                                        Sign up
                                    </Link>
                                </p>
                            </form>
                        </Tab>
                        <Tab key="sign-up" title="Sign up">
                            <form className="flex flex-col gap-4">
                                <Input
                                    // isRequired
                                    label="Name"
                                    type="text"
                                    variant="bordered"
                                    onChange={(e) => setName(e.target.value)}
                                    errorMessage={errors?.name}
                                />
                                <Input
                                    // isRequired
                                    label="Email"
                                    type="email"
                                    variant="bordered"
                                    onChange={(e) => setEmail(e.target.value)}
                                    errorMessage={errors?.email}
                                />
                                <Input
                                    // isRequired
                                    label="Password"
                                    type="password"
                                    variant="bordered"
                                    onChange={(e) => setPassword(e.target.value)}
                                    errorMessage={errors?.password}
                                />

                                <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="primary" isDisabled={!isFormValid} onClick={handleSubmit} >
                                        Sign up
                                    </Button>
                                </div>
                                <p className="text-center text-small">
                                    Already have an account?{" "}
                                    <Link size="sm" onPress={() => setSelected("login")}>
                                        Login
                                    </Link>
                                </p>
                            </form>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </div>
    );
}
