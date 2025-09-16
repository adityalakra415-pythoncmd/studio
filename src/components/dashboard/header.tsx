"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-background/80 backdrop-blur-sm border-b sm:px-6 lg:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex items-center justify-between w-full gap-4">
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold">Welcome Back, Student!</h1>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative w-full max-w-xs sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search topics, quizzes..." className="pl-9" />
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
