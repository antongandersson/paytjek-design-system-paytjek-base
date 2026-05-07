import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary — indigo (#4F46E5), pill-formet, hvid tekst
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(79,70,229,0.35)]",
        // Outline — transparent med indigo-kant
        accent:
          "border-2 bg-transparent hover:bg-primary/5 text-primary",
        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        // Outline — neutral kant
        outline:
          "border border-border bg-transparent hover:bg-muted text-foreground",
        // Secondary — blød indigo tint
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Ghost
        ghost: "hover:bg-muted hover:text-foreground",
        // Link
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-base rounded-full",
        sm: "h-10 px-4 py-2 text-sm rounded-full",
        lg: "h-14 px-8 py-4 text-lg rounded-full",
        icon: "h-12 w-12 rounded-full",
        "icon-sm": "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
