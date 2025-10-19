import { motion } from "framer-motion"
import {
    ArrowUpRight,
    ExternalLink,
    Github,
    Heart,
    Mail,
    Shield,
    Twitter
} from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./button"

const footerLinks = {
  product: [
    { name: "Attestations", href: "/attestations" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Contracts", href: "/contracts" },
    { name: "Judge Mode", href: "/demo" }
  ],
  developers: [
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/docs/api" },
    { name: "Getting Started", href: "/docs/getting-started" },
    { name: "GitHub", href: "https://github.com", external: true }
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" }
  ],
  community: [
    { name: "Twitter", href: "https://twitter.com", external: true },
    { name: "Discord", href: "https://discord.com", external: true },
    { name: "Telegram", href: "https://telegram.org", external: true },
    { name: "Blog", href: "/blog" }
  ]
}

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "Email", href: "mailto:hello@polyseal.dev", icon: Mail }
]

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 border-t border-gray-200/50">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer content */}
        <div className="pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link to="/" className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Polyseal
                  </span>
                </Link>
                
                <p className="text-gray-600 leading-relaxed mb-6 max-w-sm">
                  Secure attestation and verification service powered by Ethereum Attestation Service. 
                  Build trust with cryptographic proof on Polygon.
                </p>
                
                {/* Social links */}
                <div className="flex items-center space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100/80 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <social.icon className="h-4 w-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Links sections */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (categoryIndex + 1) }}
                viewport={{ once: true }}
              >
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.2 * (categoryIndex + 1) + 0.1 * linkIndex 
                      }}
                      viewport={{ once: true }}
                    >
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center group"
                        >
                          {link.name}
                          <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Newsletter section */}
        <motion.div
          className="border-t border-gray-200/50 py-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stay updated
              </h3>
              <p className="text-gray-600">
                Get the latest updates on features, releases, and attestation insights.
              </p>
            </div>
            
            <div className="flex w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <Button 
                variant="default"
                className="rounded-l-none px-6"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Bottom section */}
        <motion.div
          className="border-t border-gray-200/50 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 flex items-center">
              © {new Date().getFullYear()} Polyseal. Built with 
              <Heart className="h-4 w-4 text-red-500 mx-1" /> 
              for the Web3 community.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link 
                to="/privacy" 
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Terms
              </Link>
              <a 
                href="https://polygon.technology" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors duration-200 flex items-center"
              >
                Powered by Polygon
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}