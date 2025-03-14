// components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation links for the app
  const navLinks = [
    { href: "/bookings", label: "Bookings" },
    { href: "/facilities", label: "Facilities" },
    { href: "/events", label: "Events" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="relative bg-gradient-to-r from-gray-900 to-gray-700 p-4 dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-700">
      <div className="flex h-16 items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src="/RH_logo.svg" alt="RH Logo" width={40} height={40} />
          </Link>
          <Link href="/" className="text-xl font-bold text-white">
            RHapp
          </Link>
        </div>

        <nav className="hidden md:flex md:flex-1 md:justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mx-4 font-bold text-white hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="font-bold text-white">Login</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="font-bold text-white">Register</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {/* Hamburger Icon visible only on mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Dropdown Menu for Navigation Links Only */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-full bg-gray-800 p-4 md:hidden">
          <nav className="flex flex-col items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
