
import { useState } from "react";
import { Moon, Sun, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <Sun
            className="h-4 w-4 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0 sepia:rotate-90 sepia:scale-0"
            strokeWidth={1.5}
          />
          <Moon
            className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 sepia:rotate-90 sepia:scale-0"
            strokeWidth={1.5}
          />
          <BookOpen
            className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-90 dark:scale-0 sepia:rotate-0 sepia:scale-100"
            strokeWidth={1.5}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          className={theme === "light" ? "bg-accent/50" : ""}
          onClick={() => {
            setTheme("light");
            setOpen(false);
          }}
        >
          <Sun className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className={theme === "dark" ? "bg-accent/50" : ""}
          onClick={() => {
            setTheme("dark");
            setOpen(false);
          }}
        >
          <Moon className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className={theme === "sepia" ? "bg-accent/50" : ""}
          onClick={() => {
            setTheme("sepia");
            setOpen(false);
          }}
        >
          <BookOpen className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Sepia
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
