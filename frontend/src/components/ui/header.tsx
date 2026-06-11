"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Header1 = () => {
const navigationItems = [
    {
    title: "Home",
    href: "/",
    },
    {
    title: "About",
    href: "/about",
    },
];

const handleLogout = async () => {
    try {
    await fetch("/api/py/auth/logout", {
        method: "POST",
        credentials: "include",
        redirect: "manual",
    });
    } finally {
    window.location.href = "/login";
    }
};

return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background">
    <div className="container relative mx-auto min-h-20 flex gap-4 flex-row items-center justify-between px-4 sm:px-6">
        <nav className="flex items-center gap-2">
            {navigationItems.map((item) => (
                <Link
                key={item.title}
                href={item.href}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-all hover:bg-muted hover:text-foreground"
                >
                {item.title}
                </Link>
            ))}
        </nav>
        <div className="flex justify-end gap-4">
        <Button onClick={handleLogout}>Logout</Button>
        </div>
    </div>
    </header>
);
};
