import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import * as React from "react"

const cardVariants = cva(
  "rounded-2xl border text-card-foreground shadow-lg transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl hover:shadow-gray-900/5",
        elevated: "bg-white/90 backdrop-blur-md border-gray-200/60 shadow-xl shadow-gray-900/10 hover:shadow-2xl",
        glass: "bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl hover:bg-white/20",
        gradient: "bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 border-blue-200/50 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover = true, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div {...props}>{children}</div>
    </motion.div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-8 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base text-gray-600 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-8 pt-4", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-8 pt-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
