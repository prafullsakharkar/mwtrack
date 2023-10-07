'use client';

import React, { useEffect, useState } from "react";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader, CardFooter } from "@nextui-org/react";

export default function Form() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        validateForm();
    }, [email, password]);
    // Validate form 
    const validateForm = () => {
        let errors = {};

        if (!email) {
            errors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Please enter a valid email.';
        }

        if (!password) {
            errors.password = 'Password is required.';
        } else if (password.length < 2) {
            errors.password = 'Password must be at least 6 characters.';
        }

        setErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid) {
            console.log('Form submitted successfully!');
            const formData = new FormData(e.currentTarget);
            const response = await signIn('credentials', {
                username: formData.get('email'),
                password: formData.get('password'),
                redirect: false,
            });

            console.log({ response });
            if (!response?.error) {
                router.push('/');
                router.refresh();
            }
        } else {
            console.log('Form has errors. Please correct them.');
        }

    };
    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
                // isRequired
                label="Email"
                name="email"
                type="email"
                variant="bordered"
                onChange={(e) => setEmail(e.target.value)}
                errorMessage={errors?.email}
            />
            <Input
                // isRequired
                label="Password"
                name="password"
                type="password"
                variant="bordered"
                onChange={(e) => setPassword(e.target.value)}
                errorMessage={errors?.password}
            />

            <div className="flex gap-2 justify-end">
                <Button type="submit" fullWidth color="primary" isDisabled={!isFormValid} >
                    Sign In
                </Button>
            </div>
        </form>
    );
}