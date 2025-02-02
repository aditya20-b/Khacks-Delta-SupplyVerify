"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMap,
  FiCheck,
  FiAlertTriangle,
  FiX,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiPackage,
  FiClock,
  FiMapPin
} from 'react-icons/fi'

const ProductTrackingPage = () => {
  const [isTrackingPaneOpen, setIsTrackingPaneOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const products = [
    {
      id: 1,
      name: 'Premium Leather Wallet',
      productionCode: 'PLW-2024-001',
      signedDate: '2024-03-15 09:30 AM',
      status: 'untampered',
      location: 'Manufacturing Plant A',
      lastScan: '5 minutes ago'
    },
    {
      id: 2,
      name: 'Designer Handbag X-201',
      productionCode: 'DHB-2024-045',
      signedDate: '2024-03-15 10:15 AM',
      status: 'tampered',
      location: 'Distribution Center B',
      lastScan: '2 hours ago'
    },
    {
      id: 3,
      name: 'Limited Edition Watch',
      productionCode: 'LEW-2024-089',
      signedDate: '2024-03-14 02:45 PM',
      status: 'untampered',
      location: 'Retail Store C',
      lastScan: '1 day ago'
    },
    {
      id: 4,
      name: 'Signature Collection Belt',
      productionCode: 'SCB-2024-123',
      signedDate: '2024-03-14 11:20 AM',
      status: 'untampered',
      location: 'Warehouse D',
      lastScan: '3 days ago'
    }
  ]

  const handleTrackProduct = (product) => {
    setSelectedProduct(product)
    setIsTrackingPaneOpen(true)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Product Tracking</h1>
            <p className="text-gray-400 mt-1">Monitor and track your products in real-time</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 px-4 py-2 pl-10 bg-navy-800/50 rounded-lg border border-white/5 text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-navy-800/50 rounded-lg border border-white/5 text-gray-400 hover:text-white hover:border-white/10 transition-colors">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className={`bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden transition-all duration-300 ${isTrackingPaneOpen ? 'mr-[600px]' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-gray-400 font-medium">Product Name</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Production Code</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Signed Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm text-gray-400">{product.productionCode}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-400">{product.signedDate}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {product.status === 'untampered' ? (
                          <>
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-green-500">Untampered</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-red-500">Tampered</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleTrackProduct(product)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-electric-blue/10 text-electric-blue rounded-lg hover:bg-electric-blue/20 transition-colors"
                      >
                        Track Live
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tracking Pane */}
      <AnimatePresence>
        {isTrackingPaneOpen && selectedProduct && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-0 right-0 w-[600px] h-screen bg-navy-800/95 backdrop-blur-xl border-l border-white/5 p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">Live Tracking</h2>
                <p className="text-gray-400 mt-1">Real-time product monitoring</p>
              </div>
              <button
                onClick={() => setIsTrackingPaneOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Product Info */}
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Product</div>
                    <div className="text-xl font-medium mt-1">{selectedProduct.name}</div>
                    <div className="font-mono text-sm text-gray-400 mt-1">
                      {selectedProduct.productionCode}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${
                    selectedProduct.status === 'untampered' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Location */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-2">Current Location</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center">
                      <FiMapPin className="w-5 h-5 text-electric-blue" />
                    </div>
                    <div>
                      <div className="font-medium">{selectedProduct.location}</div>
                      <div className="text-sm text-gray-400">Active</div>
                    </div>
                  </div>
                </div>

                {/* Last Scan */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-2">Last Scan</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-electric-blue" />
                    </div>
                    <div>
                      <div className="font-medium">{selectedProduct.lastScan}</div>
                      <div className="text-sm text-gray-400">Updated</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Map */}
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">Live Location Tracking</div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-500">Live</span>
                  </div>
                </div>
                <div className="bg-navy-900/50 rounded-lg h-[300px] flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <FiMap className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>Live tracking map coming soon</p>
                  </div>
                </div>
              </div>

              {/* Timeline Placeholder */}
              <div className="bg-white/5 rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-4">Tracking Timeline</div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-electric-blue" />
                    <div className="flex-1 text-sm">
                      <div className="font-medium">Product manufactured</div>
                      <div className="text-gray-400">Manufacturing Plant A</div>
                    </div>
                    <div className="text-sm text-gray-400">2h ago</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-electric-blue" />
                    <div className="flex-1 text-sm">
                      <div className="font-medium">NFC tag attached</div>
                      <div className="text-gray-400">Production Line B</div>
                    </div>
                    <div className="text-sm text-gray-400">1h ago</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="flex-1 text-sm">
                      <div className="font-medium">Verification complete</div>
                      <div className="text-gray-400">Quality Control</div>
                    </div>
                    <div className="text-sm text-gray-400">30m ago</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductTrackingPage 