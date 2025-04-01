
import React from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-6 px-4 mx-auto max-w-7xl">
        {children}
      </main>
      <footer className="py-4 px-6 border-t border-muted">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>SynthFinData © {new Date().getFullYear()} - Synthetic Financial Data Generation for Advanced Backtesting & Risk Modeling</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
