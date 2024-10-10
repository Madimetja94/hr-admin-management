"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export const LoginButton = () => {
    return (
        <Link
            href="/api/auth/signin"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
            onClick={async (e) => {
                e.preventDefault();
                await signIn();
            }}
        >
            Sign In
        </Link>
    );
};

export const LogoutButton = () => {
    return (
        <Link
            href="/api/auth/signout"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
            onClick={async (e) => {
                e.preventDefault();
                await signOut();
            }}
        >
            Sign Out
        </Link>
    );
};