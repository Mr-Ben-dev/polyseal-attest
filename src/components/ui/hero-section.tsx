import { motion } from "framer-motion"
import { ArrowRight, Check, FileText, Globe, Shield, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./button"

const features = [
  "Ethereum Attestation Service Integration",
  "Secure On-Chain Verification",
  "Real-time Dashboard Analytics",
  "Developer-Friendly APIs"
]

const stats = [
  { label: "Attestations Processed", value: "10K+" },
  { label: "Active Users", value: "500+" }, 
  { label: "Uptime", value: "99.9%" },
  { label: "Networks Supported", value: "3" }
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16 sm:pt-24 sm:pb-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
              <Shield className="h-4 w-4" />
              Powered by Ethereum Attestation Service
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl"
          >
            <span className="block">Secure</span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Attestation
            </span>
            <span className="block">Service</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-xl leading-8 text-gray-600 max-w-2xl mx-auto"
          >
            Build trust with cryptographic attestations on Polygon. Verify identities, credentials, 
            and data with enterprise-grade security and transparency.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              variant="gradient" 
              size="lg"
              asChild
            >
              <Link to="/attestations" className="flex items-center gap-2">
                Start Verifying
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              asChild
            >
              <Link to="/docs" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Documentation
              </Link>
            </Button>
          </motion.div>
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 text-left"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-600 font-medium">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50"
              >
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Floating icons animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[Shield, Zap, Globe].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-blue-200/30"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              rotate: 0 
            }}
            animate={{ 
              y: [0, -20, 0],
              rotate: 360,
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 20 + index * 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${20 + index * 30}%`,
              top: `${10 + index * 20}%`
            }}
          >
            <Icon className="h-8 w-8" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}