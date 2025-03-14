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
    { href: "/events", label: "Events" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="relative bg-gradient-to-r from-green-600 to-green-400 p-4">
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

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {/* Mobile Menu Toggle for nav links */}
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
                // Hamburger icon for menu
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
        <div className="absolute left-0 right-0 top-full bg-white p-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="hover:underline"
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
