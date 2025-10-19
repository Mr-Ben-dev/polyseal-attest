import { Variants } from "framer-motion"

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Create motion-safe variants
export const createMotionVariants = (variants: Variants): Variants => {
  if (prefersReducedMotion()) {
    // Return static variants for reduced motion
    const reducedVariants: Variants = {}
    Object.keys(variants).forEach(key => {
      reducedVariants[key] = { 
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: { duration: 0 }
      }
    })
    return reducedVariants
  }
  return variants
}

// Common animation variants
export const fadeIn = createMotionVariants({
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
})

export const fadeInUp = createMotionVariants({
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
})

export const fadeInScale = createMotionVariants({
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "backOut" }
  }
})

export const slideInFromLeft = createMotionVariants({
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
})

export const slideInFromRight = createMotionVariants({
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
})

export const staggerContainer = createMotionVariants({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
})

export const staggerItem = createMotionVariants({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
})

// Hover and tap interactions (respects reduced motion)
export const hoverScale = prefersReducedMotion() ? {} : {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
}

export const hoverLift = prefersReducedMotion() ? {} : {
  whileHover: { y: -4, scale: 1.02 },
  whileTap: { y: 0, scale: 0.98 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
}

// Page transitions
export const pageVariants = createMotionVariants({
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" }
  }
})

// Loading animations
export const spinAnimation = prefersReducedMotion() ? {} : {
  animate: { rotate: 360 },
  transition: { duration: 1, repeat: Infinity, ease: "linear" }
}

export const pulseAnimation = prefersReducedMotion() ? {} : {
  animate: { scale: [1, 1.05, 1] },
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
}

// Utility function to create stagger animations
export const createStaggerVariants = (delay: number = 0.1) => createMotionVariants({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
      delayChildren: delay
    }
  }
})

// Custom hook for motion preferences
export const useMotionConfig = () => {
  const reducedMotion = prefersReducedMotion()
  
  return {
    reducedMotion,
    transition: reducedMotion 
      ? { duration: 0 } 
      : { type: "spring", stiffness: 300, damping: 30 },
    
    // Safe motion props that respect user preferences
    safeMotion: (motionProps: any) => {
      if (reducedMotion) {
        return {
          initial: false,
          animate: false,
          exit: false,
          whileHover: false,
          whileTap: false
        }
      }
      return motionProps
    }
  }
}