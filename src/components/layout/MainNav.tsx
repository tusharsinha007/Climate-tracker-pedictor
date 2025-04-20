"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon, MenuIcon } from "lucide-react";
import { useClimateStore } from "@/lib/store";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
  },
  {
    title: "Historical Trends",
    href: "/historical",
  },
  {
    title: "Predictions",
    href: "/predictions",
  },
];

export function MainNav() {
  const pathname = usePathname();
  const { userPreferences, setUserPreferences } = useClimateStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleTheme = () => {
    setUserPreferences({ darkMode: !userPreferences.darkMode });
    document.documentElement.classList.toggle("dark", !userPreferences.darkMode);
  };

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", userPreferences.darkMode);
  }, [userPreferences.darkMode]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6 lg:gap-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Chennai Climate Tracer & Predictor
          </span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground font-bold"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          aria-label="Toggle theme"
        >
          {userPreferences.darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Menu"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "font-bold"
                        : ""
                    )}
                  >
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
