import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import * as React from "react"

const cardVariants = cva(
  "rounded-2xl border text-card-foreground shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl hover:shadow-gray-900/5",
        elevated: "bg-white/90 backdrop-blur-md border-gray-200/60 shadow-xl shadow-gray-900/10 hover:shadow-2xl",
        glass: "bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl hover:bg-white/20",
        gradient: "bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 border-blue-200/50 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10",
        dark: "bg-gray-900/90 backdrop-blur-sm border-gray-700/50 shadow-2xl hover:shadow-gray-900/20"
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
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div {...props}>
        {children}
      </div>
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
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    className="contents"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  </motion.div>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    className="contents"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <p
      ref={ref}
      className={cn("text-base text-gray-600 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  </motion.div>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    className="contents"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
  >
    <div
      ref={ref}
      className={cn("p-8 pt-4", className)}
      {...props}
    >
      {children}
    </div>
  </motion.div>
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

