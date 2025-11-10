"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/lib/stores/useUserStore";
import { Badge } from "@/components/ui/badge";
import { useThemeWithCookies } from "@/hooks/useThemeWithCookies";
import { useLayoutEffect, useState } from "react";

export function Header() {
  const { user } = useUserStore();
  const { theme, setTheme } = useThemeWithCookies();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch - using useLayoutEffect to set mounted state
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h2>
        {user?.kycStatus === "verified" && (
          <Badge variant="outline" className="bg-success/10 text-success">
            KYC Verified
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle with Dropdown */}
        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <span className="mr-2 h-4 w-4">💻</span>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2">
              <p className="text-sm font-semibold">Notifications</p>
            </div>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">No new notifications</p>
                <p className="text-xs text-muted-foreground">
                  You&apos;re all caught up!
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        {user && (
          <div className="ml-2 flex items-center gap-2 rounded-lg border px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

