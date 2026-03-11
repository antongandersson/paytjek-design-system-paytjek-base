import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  withBottomNav?: boolean;
}

export function MobileContainer({ 
  children, 
  className,
  withBottomNav = true 
}: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      {/* Mobile simulation container - max-width on desktop, full on mobile */}
      <div className={cn(
        "w-full max-w-md min-h-screen bg-background relative",
        // Add shadow on desktop to simulate phone frame
        "md:shadow-2xl md:border-x md:border-border",
        withBottomNav && "pb-20", // Space for bottom nav
        className
      )}>
        {children}
      </div>
    </div>
  );
}
