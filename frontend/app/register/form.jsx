'use client';

import React, { useEffect, useState } from "react";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader, CardFooter } from "@nextui-org/react";

export default function Form() {
    const router = useRouter();
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

        if (!name) {
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid) {
            console.log('Form submitted successfully!');
        } else {
            console.log('Form has errors. Please correct them.');
        }
        const formData = new FormData(e.currentTarget);
        const response = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        });

        console.log({ response });
        if (!response?.error) {
            router.push('/');
            router.refresh();
        }
    };
    return (
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
        </form>
    );
}