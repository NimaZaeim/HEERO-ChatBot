import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--solar-spirit)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--primary-300)] text-[color:var(--radial)] hover:bg-[color:var(--primary-hover)]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-[color:var(--neutral-grey)] bg-transparent hover:bg-[color:var(--transparent-50)]",
        secondary:
          "bg-[color:var(--solar-spirit)] text-[color:var(--radial)] hover:bg-[color:var(--solar-spirit)]/80",
        ghost:
          "bg-transparent text-[color:var(--radial)] hover:bg-[color:var(--transparent-10)]",
        link:
          "text-[color:var(--solar-spirit)] underline underline-offset-4 hover:opacity-80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
