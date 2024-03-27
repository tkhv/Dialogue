"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/home"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          DIALOGUE
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="/clubs"
          className={`transition-colors ${
            pathname === "/clubs" ? "text-foreground" : "text-muted-foreground"
          } hover:text-foreground`}
        >
          Clubs
        </Link>
        <Link
          href="/events"
          className={`transition-colors ${
            pathname === "/events" ? "text-foreground" : "text-muted-foreground"
          } hover:text-foreground`}
        >
          Events
        </Link>
        <Link
          href="/movies"
          className={`transition-colors ${
            pathname === "/movies" ? "text-foreground" : "text-muted-foreground"
          } hover:text-foreground`}
        >
          Movies
        </Link>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full ml-auto flex-1 sm:flex-initial"
            >
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hi fname!</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
