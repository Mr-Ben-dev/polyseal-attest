import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import * as React from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]",
        destructive: "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:from-red-700 hover:to-pink-700 transform hover:scale-[1.02] active:scale-[0.98]",
        outline: "border-2 border-blue-200 bg-white/80 backdrop-blur-sm text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
        secondary: "bg-gray-100/80 backdrop-blur-sm text-gray-900 hover:bg-gray-200/80 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
        ghost: "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 rounded-lg",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
        gradient: "bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-[1.02] active:scale-[0.98] bg-[length:200%_100%] hover:bg-[position:100%_0%] transition-all duration-500"
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg font-bold",
        icon: "h-10 w-10 rounded-lg",
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
  loading?: boolean
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, rightIcon, children, disabled, onClick, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Slot>
      )
    }
    
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        onClick={onClick}
        whileHover={disabled || loading ? {} : { scale: 1.02 }}
        whileTap={disabled || loading ? {} : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Shimmer effect for gradient variant */}
        {variant === "gradient" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
            animate={{ translateX: ["0%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              {icon && <span className="flex-shrink-0">{icon}</span>}
              {children}
              {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
