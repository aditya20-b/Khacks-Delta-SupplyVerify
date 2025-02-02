"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiAlertTriangle,
  FiPackage,
  FiTruck,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiFilter,
  FiSearch,
  FiChevronRight,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiThermometer,
  FiDroplet,
  FiZap
} from 'react-icons/fi'

interface Shipment {
  id: string
  productName: string
  batchNumber: string
  issueType: 'tampering' | 'temperature' | 'humidity' | 'delay' | 'quality'
  severity: 'high' | 'medium' | 'low'
  status: 'investigating' | 'resolved' | 'pending'
  location: string
  timestamp: string
  details: string
  sensorData?: {
    temperature?: string
    humidity?: string
    shock?: string
  }
}

const mockShipments: Shipment[] = [
  {
    id: 'SHIP001',
    productName: 'Premium Leather Wallet Batch',
    batchNumber: 'PLW-2024-001-B',
    issueType: 'tampering',
    severity: 'high',
    status: 'investigating',
    location: 'Distribution Center B',
    timestamp: '2024-03-15 10:30 AM',
    details: 'NFC tag tampering detected during routine scan',
    sensorData: {
      temperature: '22°C',
      humidity: '45%',
      shock: '2.5G'
    }
  },
  {
    id: 'SHIP002',
    productName: 'Designer Handbag Collection',
    batchNumber: 'DHB-2024-045-B',
    issueType: 'temperature',
    severity: 'medium',
    status: 'pending',
    location: 'Transit Hub C',
    timestamp: '2024-03-15 09:15 AM',
    details: 'Temperature exceeded threshold during transport',
    sensorData: {
      temperature: '28°C',
      humidity: '60%',
      shock: '1.2G'
    }
  },
  {
    id: 'SHIP003',
    productName: 'Limited Edition Watch Set',
    batchNumber: 'LEW-2024-089-B',
    issueType: 'humidity',
    severity: 'medium',
    status: 'investigating',
    location: 'Warehouse A',
    timestamp: '2024-03-14 02:45 PM',
    details: 'Humidity levels above acceptable range',
    sensorData: {
      temperature: '21°C',
      humidity: '75%',
      shock: '0.8G'
    }
  },
  {
    id: 'SHIP004',
    productName: 'Signature Collection Belts',
    batchNumber: 'SCB-2024-123-B',
    issueType: 'delay',
    severity: 'low',
    status: 'resolved',
    location: 'Customs Checkpoint',
    timestamp: '2024-03-14 11:20 AM',
    details: 'Shipment delayed due to customs inspection',
  }
]

const ProblematicShipmentsPage = () => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'tampering':
        return <FiAlertTriangle className="w-5 h-5 text-red-500" />
      case 'temperature':
        return <FiThermometer className="w-5 h-5 text-orange-500" />
      case 'humidity':
        return <FiDroplet className="w-5 h-5 text-blue-500" />
      case 'delay':
        return <FiClock className="w-5 h-5 text-yellow-500" />
      case 'quality':
        return <FiZap className="w-5 h-5 text-purple-500" />
      default:
        return <FiAlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 bg-red-500/10'
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'low':
        return 'text-green-500 bg-green-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'resolved':
        return 'text-green-500 bg-green-500/10'
      case 'pending':
        return 'text-orange-500 bg-orange-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const filteredShipments = mockShipments.filter(shipment => {
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus
    const matchesSeverity = filterSeverity === 'all' || shipment.severity === filterSeverity
    const matchesSearch = searchQuery === '' || 
      shipment.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesSeverity && matchesSearch
  })

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Problematic Shipments</h1>
            <p className="text-gray-400 mt-1">Monitor and investigate shipment issues</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-navy-800/50 rounded-lg border border-white/5 text-white focus:outline-none focus:border-electric-blue"
              >
                <option value="all">All Status</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-2 bg-navy-800/50 rounded-lg border border-white/5 text-white focus:outline-none focus:border-electric-blue"
              >
                <option value="all">All Severity</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or batch number..."
              className="w-full px-4 py-3 pl-10 bg-navy-900/50 rounded-lg border border-white/5 text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Shipments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredShipments.map((shipment) => (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6 hover:border-electric-blue/20 transition-colors cursor-pointer"
              onClick={() => setSelectedShipment(shipment)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getIssueIcon(shipment.issueType)}
                  <div>
                    <h3 className="font-medium">{shipment.productName}</h3>
                    <p className="text-sm text-gray-400">{shipment.batchNumber}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-sm ${getSeverityColor(shipment.severity)}`}>
                  {shipment.severity.charAt(0).toUpperCase() + shipment.severity.slice(1)} Severity
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiMapPin className="w-4 h-4" />
                    {shipment.location}
                  </div>
                  <div className={`px-2 py-1 rounded-lg ${getStatusColor(shipment.status)}`}>
                    {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                  </div>
                </div>

                <p className="text-sm text-gray-400">{shipment.details}</p>

                {shipment.sensorData && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    {shipment.sensorData.temperature && (
                      <div>
                        <div className="text-sm text-gray-400">Temperature</div>
                        <div className="font-medium">{shipment.sensorData.temperature}</div>
                      </div>
                    )}
                    {shipment.sensorData.humidity && (
                      <div>
                        <div className="text-sm text-gray-400">Humidity</div>
                        <div className="font-medium">{shipment.sensorData.humidity}</div>
                      </div>
                    )}
                    {shipment.sensorData.shock && (
                      <div>
                        <div className="text-sm text-gray-400">Shock</div>
                        <div className="font-medium">{shipment.sensorData.shock}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {selectedShipment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
              onClick={() => setSelectedShipment(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-navy-800 rounded-xl p-6 max-w-2xl w-full mx-4"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedShipment.productName}</h2>
                    <p className="text-gray-400">{selectedShipment.batchNumber}</p>
                  </div>
                  <button
                    onClick={() => setSelectedShipment(null)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-navy-700/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Issue Type</div>
                      <div className="flex items-center gap-2">
                        {getIssueIcon(selectedShipment.issueType)}
                        <span className="capitalize">{selectedShipment.issueType}</span>
                      </div>
                    </div>
                    <div className="bg-navy-700/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Status</div>
                      <div className={`inline-flex px-2 py-1 rounded-lg ${getStatusColor(selectedShipment.status)}`}>
                        {selectedShipment.status.charAt(0).toUpperCase() + selectedShipment.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-navy-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Issue Details</div>
                    <p>{selectedShipment.details}</p>
                  </div>

                  {selectedShipment.sensorData && (
                    <div className="bg-navy-700/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-4">Sensor Data</div>
                      <div className="grid grid-cols-3 gap-6">
                        {selectedShipment.sensorData.temperature && (
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                              <FiThermometer className="w-4 h-4" />
                              Temperature
                            </div>
                            <div className="text-xl font-medium">{selectedShipment.sensorData.temperature}</div>
                          </div>
                        )}
                        {selectedShipment.sensorData.humidity && (
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                              <FiDroplet className="w-4 h-4" />
                              Humidity
                            </div>
                            <div className="text-xl font-medium">{selectedShipment.sensorData.humidity}</div>
                          </div>
                        )}
                        {selectedShipment.sensorData.shock && (
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                              <FiZap className="w-4 h-4" />
                              Shock
                            </div>
                            <div className="text-xl font-medium">{selectedShipment.sensorData.shock}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setSelectedShipment(null)}
                      className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      className="px-4 py-2 bg-electric-blue rounded-lg text-white hover:bg-electric-blue/90 transition-colors"
                    >
                      Take Action
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProblematicShipmentsPage 