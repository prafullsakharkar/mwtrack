'use client';

import { Button } from '@nextui-org/react';
import { signOut } from 'next-auth/react';

export default function Logout() {
    return (
        <Button
            className="text-sm font-normal text-default-600 bg-default-100"
            variant="flat"
            onClick={() => { signOut() }}
        >
            Logout
        </Button>
    );
}