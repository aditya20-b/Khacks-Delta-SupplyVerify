"use client"

import { motion } from 'framer-motion'
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiGlobe, FiShield, FiLock } from 'react-icons/fi'

const footerLinks = [
  {
    title: 'Product',
    links: ['Features', 'Security', 'Enterprise', 'Pricing']
  },
  {
    title: 'Company',
    links: ['About', 'Customers', 'Partners', 'Careers']
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API Reference', 'Guides', 'Support']
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'Compliance']
  }
]

const socialLinks = [
  { icon: FiGithub, href: '#', label: 'GitHub' },
  { icon: FiTwitter, href: '#', label: 'Twitter' },
  { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FiMail, href: '#', label: 'Email' }
]

const Footer = () => {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden bg-navy-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/20 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-electric-blue/10 flex items-center justify-center">
                  <FiShield className="w-6 h-6 text-electric-blue" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                  SupplyVerify
                </span>
              </div>

              <p className="text-gray-400 mb-6">
                Revolutionizing supply chain trust with blockchain verification and real-time tracking
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors"
                  >
                    <social.icon className="w-5 h-5 text-gray-400" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column, index) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-6"
            >
              <h3 className="text-sm font-semibold text-white">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pt-8 mt-8 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 SupplyVerify. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FiLock className="w-4 h-4 text-electric-blue" />
                SOC2 Compliant
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FiGlobe className="w-4 h-4 text-electric-blue" />
                Global Infrastructure
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer 