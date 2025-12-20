import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface LayoutWrapperProps {
  children: ReactNode;
  onNewTask?: () => void;
}

export function LayoutWrapper({ children, onNewTask }: LayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onNewTask={onNewTask} />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
