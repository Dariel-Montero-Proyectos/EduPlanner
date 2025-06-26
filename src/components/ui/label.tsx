import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-800",
  {
    variants: {
      variant: {
        default: "text-slate-800",
        secondary: "text-slate-600",
        muted: "text-slate-500"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      labelVariants({ variant }),
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      "border-0 bg-transparent",
      "text-slate-800 hover:text-slate-900",
      className
    )}
    style={{
      backgroundColor: 'transparent !important',
      borderColor: 'transparent !important',
      color: 'rgb(30 41 59) !important'
    }}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }