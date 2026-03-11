import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertTriangle, Clock, CheckCircle, Download } from "lucide-react"

const chipVariants = cva(
  "inline-flex items-center gap-1.5 font-medium transition-colors rounded-full text-sm",
  {
    variants: {
      variant: {
        // PDF download chip
        pdf: "bg-card border border-border text-foreground hover:bg-muted px-3 py-1.5",
        // Error/Warning state (red outline)
        error: "bg-destructive/10 border border-destructive text-destructive px-3 py-1.5",
        // In progress state (blue outline)
        pending: "bg-primary/10 border border-primary text-primary px-3 py-1.5",
        // Success/Closed state (green outline)
        success: "bg-success/10 border border-success text-success px-3 py-1.5",
        // Count badge - dark
        countDark: "bg-foreground text-background px-2.5 py-1 min-w-[28px] justify-center",
        // Count badge - accent
        countAccent: "bg-warning text-foreground px-2.5 py-1 min-w-[28px] justify-center",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "pdf",
      size: "default",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode
  showDefaultIcon?: boolean
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, size, icon, showDefaultIcon = true, children, ...props }, ref) => {
    const getDefaultIcon = () => {
      if (!showDefaultIcon) return null
      switch (variant) {
        case "pdf":
          return <Download className="h-4 w-4" />
        case "error":
          return <AlertTriangle className="h-4 w-4" />
        case "pending":
          return <Clock className="h-4 w-4" />
        case "success":
          return <CheckCircle className="h-4 w-4" />
        default:
          return null
      }
    }

    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant, size, className }))}
        {...props}
      >
        {icon || getDefaultIcon()}
        {children}
      </div>
    )
  }
)
Chip.displayName = "Chip"

export { Chip, chipVariants }
