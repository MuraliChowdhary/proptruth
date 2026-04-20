"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignIn, SignOutButton, UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white text-xs font-bold">PT</span>
          </div>
          <span className="font-display font-semibold text-text-primary text-lg">
            PropTruth
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={cn(
              "text-sm transition-colors duration-200",
              pathname === "/"
                ? "text-text-primary font-medium"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Search
          </Link>
          <SignIn>
            <Link
              href="/report/submit"
              className={cn(
                "text-sm transition-colors duration-200",
                pathname === "/report/submit"
                  ? "text-text-primary font-medium"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Submit Report
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "text-sm transition-colors duration-200",
                pathname === "/dashboard"
                  ? "text-text-primary font-medium"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Dashboard
            </Link>
          </SignIn>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <SignOutButton>
            <Link
              href="/sign-in"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign in
            </Link>
            <Link href="/sign-up" className="btn-primary text-sm py-2 px-4">
              Get started
            </Link>
          </SignOutButton>
          <SignIn>
            <UserButton afterSignOutUrl="/" />
          </SignIn>
        </div>

      </div>
    </nav>
  )
}