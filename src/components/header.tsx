import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  onNewTask?: () => void;
}

export function Header({ onNewTask }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D38EEC] bg-[#E7C3F6] dark:bg-[#9D43AD]">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between gap-4 px-6 md:px-8">
        <div className="flex items-center gap-2">
          <img src="/prplbyts.svg" alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-semibold tracking-tight">Task Manager</h1>
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/")}
              className={location.pathname === "/" ? "text-foreground font-semibold border-b-2 border-[#D38EEC] rounded-none" : "text-muted-foreground hover:text-foreground"}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/tasks")}
              className={location.pathname === "/tasks" ? "text-foreground font-semibold border-b-2 border-[#D38EEC] rounded-none" : "text-muted-foreground hover:text-foreground"}
            >
              Tasks
            </Button>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
