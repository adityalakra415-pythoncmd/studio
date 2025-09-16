"use client"

import * as React from "react"
import { Moon, Sun, Palette, Monitor, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const colors = [
  { name: 'Violet', hsl: '275 65% 61%' },
  { name: 'Blue', hsl: '221.2 83.2% 53.3%' },
  { name: 'Green', hsl: '142.1 76.2% 36.3%' },
  { name: 'Orange', hsl: '24.6 95% 53.1%' },
  { name: 'Red', hsl: '0 72.2% 50.6%' },
]

export function ThemeSwitcher() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [isGlass, setIsGlass] = React.useState(false)

  React.useEffect(() => {
    document.body.classList.toggle('glass', isGlass)
  }, [isGlass])

  const setPrimaryColor = (hsl: string) => {
    document.documentElement.style.setProperty('--primary', hsl)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
         <DropdownMenuItem onClick={() => setIsGlass(!isGlass)}>
            <div className="w-4 h-4 mr-2" style={{
                backgroundImage: 'url("data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'none\' stroke=\'%23333\' stroke-width=\'3\' stroke-dasharray=\'6%2c 14\' stroke-dashoffset=\'0\' stroke-linecap=\'square\'/%3e%3c/svg%3e")',
                opacity: 0.5,
            }} />
          <span>Glass Mode</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Accent Color</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {colors.map((color) => (
                <DropdownMenuItem
                  key={color.name}
                  onClick={() => setPrimaryColor(color.hsl)}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `hsl(${color.hsl})` }}
                  />
                  <span>{color.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
