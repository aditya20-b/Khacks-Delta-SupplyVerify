"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShield, FiMenu, FiX, FiChevronDown, FiArrowRight } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

const navigation = [
  {
    name: 'Product',
    items: [
      { name: 'Features', description: 'Explore our core features' },
      { name: 'Security', description: 'Enterprise-grade protection' },
      { name: 'Integration', description: 'Connect with your tools' },
      { name: 'API', description: 'Build custom solutions' }
    ]
  },
  {
    name: 'Solutions',
    items: [
      { name: 'Manufacturing', description: 'For production lines' },
      { name: 'Logistics', description: 'For supply chains' },
      { name: 'Retail', description: 'For stores' },
      { name: 'Enterprise', description: 'For large organizations' }
    ]
  },
  { name: 'Pricing' },
  { name: 'About' }
]

const Navbar = () => {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGetStarted = () => {
    router.push('/onboarding')
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-navy-900/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-electric-blue/10 flex items-center justify-center">
              <FiShield className="w-6 h-6 text-electric-blue" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              SupplyVerify
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.items ? (
                  <button
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                    <FiChevronDown className={`w-4 h-4 transition-transform ${
                      activeDropdown === item.name ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    {item.name}
                  </a>
                )}

                {/* Dropdown Menu */}
                {item.items && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        onMouseLeave={() => setActiveDropdown(null)}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                      >
                        <div className="w-64 bg-navy-800 rounded-xl border border-white/5 shadow-xl overflow-hidden">
                          {item.items.map((subItem) => (
                            <a
                              key={subItem.name}
                              href="#"
                              className="block p-4 hover:bg-white/5 transition-colors"
                            >
                              <div className="font-medium text-white">{subItem.name}</div>
                              <div className="text-sm text-gray-400">{subItem.description}</div>
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-4 py-2 bg-electric-blue rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue via-purple-500 to-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-gradient" />
              <div className="relative flex items-center gap-2">
                <span>Get Started</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6 text-white" />
            ) : (
              <FiMenu className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-800 border-t border-white/5"
          >
            <div className="container mx-auto px-4 py-4">
              {navigation.map((item) => (
                <div key={item.name} className="py-2">
                  {item.items ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full text-left text-gray-300"
                    >
                      {item.name}
                      <FiChevronDown className={`w-4 h-4 transition-transform ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <a href="#" className="block text-gray-300">
                      {item.name}
                    </a>
                  )}

                  {/* Mobile Dropdown */}
                  {item.items && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 ml-4 space-y-2"
                    >
                      {item.items.map((subItem) => (
                        <a
                          key={subItem.name}
                          href="#"
                          className="block p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}

              <div className="mt-4 space-y-2">
                <button className="w-full px-4 py-2 text-gray-300 hover:text-white transition-colors">
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="w-full px-4 py-2 bg-electric-blue rounded-xl text-white"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar 