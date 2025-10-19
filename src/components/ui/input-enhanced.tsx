import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle, Eye, EyeOff, Search } from "lucide-react"
import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    success, 
    hint, 
    leftIcon, 
    rightIcon, 
    loading,
    id,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const inputId = id || React.useId()
    
    const isPassword = type === "password"
    const inputType = isPassword && showPassword ? "text" : type
    
    const hasError = !!error
    const hasSuccess = !!success
    
    return (
      <div className="space-y-2">
        {label && (
          <motion.label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200",
              hasError ? "text-red-600" : hasSuccess ? "text-green-600" : "text-gray-700"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              {leftIcon}
            </div>
          )}
          
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="contents"
          >
            <input
              type={inputType}
              id={inputId}
              className={cn(
                "flex h-12 w-full rounded-xl border bg-white/80 backdrop-blur-sm px-4 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                leftIcon && "pl-10",
                (rightIcon || isPassword) && "pr-10",
                hasError 
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                  : hasSuccess 
                  ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                isFocused && !hasError && !hasSuccess && "shadow-lg shadow-blue-500/10",
                className
              )}
              ref={ref}
              onFocus={(e) => {
                setIsFocused(true)
                props.onFocus?.(e)
              }}
              onBlur={(e) => {
                setIsFocused(false)
                props.onBlur?.(e)
              }}
              {...props}
            />
          </motion.div>
          
          {/* Right icon or password toggle */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isPassword && (
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </motion.button>
            )}
            
            {rightIcon && !isPassword && (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
            
            {loading && (
              <motion.div
                className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
          
          {/* Status icon */}
          <AnimatePresence>
            {hasError && (
              <motion.div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <AlertCircle className="h-4 w-4" />
              </motion.div>
            )}
            
            {hasSuccess && (
              <motion.div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Helper text */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              className="text-sm text-red-600 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="h-3 w-3" />
              {error}
            </motion.p>
          )}
          
          {success && !error && (
            <motion.p
              key="success"
              className="text-sm text-green-600 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle className="h-3 w-3" />
              {success}
            </motion.p>
          )}
          
          {hint && !error && !success && (
            <motion.p
              key="hint"
              className="text-sm text-gray-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
Input.displayName = "Input"

// Search Input variant
export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder = "Search...", ...props }, ref) => (
    <Input
      ref={ref}
      type="search"
      placeholder={placeholder}
      leftIcon={<Search className="h-4 w-4" />}
      {...props}
    />
  )
)
SearchInput.displayName = "SearchInput"

export { Input }
