"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiBox,
  FiShield,
  FiSmartphone,
  FiTrendingUp,
  FiPackage,
  FiCheck,
  FiAlertTriangle,
  FiDownload,
  FiArrowRight,
  FiActivity,
  FiGrid,
  FiMap,
  FiDatabase,
  FiAlertCircle,
  FiChevronRight
} from 'react-icons/fi'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navigationItems = [
  {
    name: 'Overview',
    icon: FiGrid,
    href: '/dashboard',
    description: 'Dashboard overview and key metrics'
  },
  {
    name: 'Product Tracking',
    icon: FiMap,
    href: '/dashboard/product-tracking',
    description: 'Track and manage your products'
  },
  {
    name: 'Open Food Facts',
    icon: FiDatabase,
    href: '/dashboard/open-food-facts',
    description: 'Access food product database'
  },
  {
    name: 'Problematic Shipments',
    icon: FiAlertCircle,
    href: '/dashboard/problematic-shipments',
    description: 'View and resolve shipment issues'
  }
]

const DashboardPage = () => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const pathname = usePathname()

  const stats = [
    {
      icon: FiBox,
      label: 'Total Products',
      value: '1,234',
      trend: '+12% this month',
      color: 'text-electric-blue'
    },
    {
      icon: FiShield,
      label: 'Verified Items',
      value: '98.7%',
      trend: '+2.1% from last week',
      color: 'text-green-500'
    },
    {
      icon: FiActivity,
      label: 'Active Scans',
      value: '5,678',
      trend: '+892 today',
      color: 'text-purple-500'
    },
    {
      icon: FiAlertTriangle,
      label: 'Flagged Items',
      value: '0.3%',
      trend: '-0.1% this week',
      color: 'text-yellow-500'
    }
  ]

  const recentProducts = [
    { name: 'Premium Leather Wallet', status: 'verified', date: '2 hours ago' },
    { name: 'Designer Handbag X-201', status: 'pending', date: '5 hours ago' },
    { name: 'Limited Edition Watch', status: 'verified', date: '1 day ago' },
    { name: 'Signature Collection Belt', status: 'verified', date: '1 day ago' }
  ]

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/5 via-transparent to-transparent" />
      </div>

      <div className="relative flex">
        {/* Sidebar */}
        <div className="w-80 min-h-screen bg-navy-800/50 backdrop-blur-xl border-r border-white/5">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-electric-blue/10 flex items-center justify-center">
                <FiShield className="w-5 h-5 text-electric-blue" />
              </div>
              <span className="font-bold text-lg">SupplyVerify</span>
            </div>

            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-electric-blue text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {isActive && (
                      <FiChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Overview</h1>
                <p className="text-gray-400 mt-1">Welcome back to SupplyVerify</p>
              </div>
              <button
                onClick={() => setIsDownloadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-electric-blue rounded-lg hover:bg-electric-blue/90 transition-colors"
              >
                <FiSmartphone className="w-4 h-4" />
                Get Mobile App
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-navy-800/50 backdrop-blur-xl rounded-xl p-6 border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-opacity-10 flex items-center justify-center ${stat.color} bg-current`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                      <div className="text-2xl font-bold mt-1">{stat.value}</div>
                      <div className="text-xs text-gray-400 mt-1">{stat.trend}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile App Promotion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-electric-blue/20 to-purple-500/20 rounded-xl p-8 border border-white/10"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Streamline Your Manufacturing</h2>
                  <p className="text-gray-400 max-w-xl">
                    Download our mobile app to seamlessly integrate NFC tags into your manufacturing line.
                    Scan, verify, and track products in real-time with our intuitive mobile interface.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => window.open('https://apps.apple.com')}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-navy-900 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <FiDownload className="w-5 h-5" />
                      iOS App
                    </button>
                    <button
                      onClick={() => window.open('https://play.google.com')}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-navy-900 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <FiDownload className="w-5 h-5" />
                      Android App
                    </button>
                  </div>
                </div>
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-gradient-to-r from-electric-blue to-purple-500 rounded-full blur-3xl opacity-20" />
                  <div className="relative w-full h-full bg-[url('/mobile-app.png')] bg-contain bg-center bg-no-repeat" />
                </div>
              </div>
            </motion.div>

            {/* Recent Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5"
            >
              <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold">Recent Products</h2>
              </div>
              <div className="divide-y divide-white/5">
                {recentProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        product.status === 'verified' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                      }`}>
                        {product.status === 'verified' ? (
                          <FiCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <FiPackage className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-400">{product.date}</div>
                      </div>
                    </div>
                    <div className={`text-sm ${
                      product.status === 'verified' ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-navy-800 rounded-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Get the Mobile App</h3>
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-400 mb-6">
              Scan the QR code or click the buttons below to download our mobile app
              and start integrating NFC tags into your manufacturing line.
            </p>
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 bg-white rounded-xl" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => window.open('https://apps.apple.com')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-electric-blue rounded-xl hover:bg-electric-blue/90 transition-colors"
              >
                <FiDownload className="w-5 h-5" />
                iOS App
              </button>
              <button
                onClick={() => window.open('https://play.google.com')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-electric-blue rounded-xl hover:bg-electric-blue/90 transition-colors"
              >
                <FiDownload className="w-5 h-5" />
                Android App
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage 