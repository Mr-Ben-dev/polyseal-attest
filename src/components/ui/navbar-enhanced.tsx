import { cn } from "@/lib/utils"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { AnimatePresence, motion } from "framer-motion"
import { Code, Compass, FileText, Home, Mail, Menu, Shield, X } from "lucide-react"
import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./button"

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  description?: string
}

const navigation: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: <Home className="w-4 h-4" />,
    description: "Welcome to Polyseal"
  },
  {
    name: "Attestations",
    href: "/attestations",
    icon: <Shield className="w-4 h-4" />,
    description: "View and verify attestations"
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <Compass className="w-4 h-4" />,
    description: "Your personal dashboard"
  },
  {
    name: "Contracts",
    href: "/contracts",
    icon: <Code className="w-4 h-4" />,
    description: "Smart contract information"
  },
  {
    name: "Docs",
    href: "/docs",
    icon: <FileText className="w-4 h-4" />,
    description: "Documentation and guides"
  },
  {
    name: "Contact",
    href: "/contact",
    icon: <Mail className="w-4 h-4" />,
    description: "Get in touch"
  }
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/"
    return location.pathname.startsWith(href)
  }

  return (
    <motion.header 
      className="fixed top-0 z-50 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <motion.div 
          className="flex lg:flex-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Polyseal</span>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Polyseal
              </span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <Link
                to={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg",
                  isActive(item.href)
                    ? "text-blue-600 bg-blue-50/80"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                )}
              >
                {item.icon}
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    className="absolute inset-0 bg-blue-100/50 rounded-lg -z-10"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Connect button */}
        <motion.div 
          className="hidden lg:flex lg:flex-1 lg:justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ConnectButton />
        </motion.div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="space-y-2 px-6 pb-6 pt-2">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-colors duration-200",
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {item.icon}
                    <div>
                      <div className="text-sm font-semibold">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500">{item.description}</div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                className="pt-4 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ConnectButton />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}