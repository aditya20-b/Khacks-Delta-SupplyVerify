"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShield,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiLoader,
  FiUserCheck,
  FiTruck,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiMapPin,
  FiPackage,
  FiThermometer,
  FiDroplet,
  FiZap,
  FiTrash2
} from 'react-icons/fi'

interface WalletState {
  address: string | null
  isConnecting: boolean
  error: string | null
}

interface Verifier {
  id: string
  name: string
  walletAddress: string
  email: string
  company: string
  status: 'active' | 'inactive'
  joinedAt: string
  lastActive: string
}

interface VerifierApplication {
  id: string
  name: string
  walletAddress: string
  email: string
  company: string
  appliedAt: string
  experience: string
  reason: string
}

interface Shipment {
  id: string
  productName: string
  productionCode: string
  manufacturer: string
  status: 'in_transit' | 'delivered' | 'rejected' | 'flagged'
  location: string
  timestamp: string
  temperature: string
  humidity: string
  tampered: boolean
  verifiedBy: string
  trackingHistory: {
    timestamp: string
    location: string
    status: string
    verifier: string
  }[]
}

// Mock data
const MOCK_ADDRESSES = [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
]

const MOCK_VERIFIERS: Verifier[] = [
  {
    id: 'v1',
    name: 'John Smith',
    walletAddress: '0x1234...5678',
    email: 'john.smith@verify.co',
    company: 'VerifyTech Inc',
    status: 'active',
    joinedAt: '2024-01-15',
    lastActive: '2024-03-15'
  },
  {
    id: 'v2',
    name: 'Sarah Johnson',
    walletAddress: '0x8765...4321',
    email: 'sarah.j@secureverify.com',
    company: 'SecureVerify',
    status: 'active',
    joinedAt: '2024-02-01',
    lastActive: '2024-03-14'
  },
  {
    id: 'v3',
    name: 'Michael Chen',
    walletAddress: '0x9876...1234',
    email: 'm.chen@verifyplus.com',
    company: 'VerifyPlus',
    status: 'inactive',
    joinedAt: '2024-01-20',
    lastActive: '2024-03-10'
  }
]

const MOCK_APPLICATIONS: VerifierApplication[] = [
  {
    id: 'a1',
    name: 'David Wilson',
    walletAddress: '0x2468...1357',
    email: 'david.w@trustchain.com',
    company: 'TrustChain Solutions',
    appliedAt: '2024-03-14',
    experience: '5 years in supply chain verification',
    reason: 'Looking to expand our verification services to blockchain.'
  },
  {
    id: 'a2',
    name: 'Emma Davis',
    walletAddress: '0x1357...2468',
    email: 'emma.d@verifynow.com',
    company: 'VerifyNow Ltd',
    appliedAt: '2024-03-13',
    experience: '3 years in product authentication',
    reason: 'Interested in joining the decentralized verification network.'
  }
]

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'ship001',
    productName: 'Premium Leather Wallet',
    productionCode: 'PLW-2024-001',
    manufacturer: 'LeatherCraft Co.',
    status: 'in_transit',
    location: 'Distribution Center A',
    timestamp: '2024-03-15 14:30',
    temperature: '22°C',
    humidity: '45%',
    tampered: false,
    verifiedBy: 'John Smith',
    trackingHistory: [
      {
        timestamp: '2024-03-15 14:30',
        location: 'Distribution Center A',
        status: 'Package scanned and verified',
        verifier: 'John Smith'
      },
      {
        timestamp: '2024-03-15 12:00',
        location: 'Manufacturing Plant',
        status: 'Package dispatched',
        verifier: 'Sarah Johnson'
      }
    ]
  },
  {
    id: 'ship002',
    productName: 'Designer Handbag',
    productionCode: 'DHB-2024-045',
    manufacturer: 'LuxuryBags Inc.',
    status: 'flagged',
    location: 'Customs Checkpoint B',
    timestamp: '2024-03-15 10:15',
    temperature: '25°C',
    humidity: '60%',
    tampered: true,
    verifiedBy: 'Michael Chen',
    trackingHistory: [
      {
        timestamp: '2024-03-15 10:15',
        location: 'Customs Checkpoint B',
        status: 'Tampering detected',
        verifier: 'Michael Chen'
      },
      {
        timestamp: '2024-03-15 08:00',
        location: 'Transit Hub',
        status: 'Package in transit',
        verifier: 'Emma Davis'
      }
    ]
  }
]

const AdminDashboard = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnecting: false,
    error: null
  })
  const [activeTab, setActiveTab] = useState('verifiers')
  const [verifiers, setVerifiers] = useState(MOCK_VERIFIERS)
  const [applications, setApplications] = useState(MOCK_APPLICATIONS)
  const [selectedApplication, setSelectedApplication] = useState<VerifierApplication | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [shipments, setShipments] = useState(MOCK_SHIPMENTS)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const connectWallet = async () => {
    setWallet(prev => ({ ...prev, isConnecting: true, error: null }))
    await new Promise(resolve => setTimeout(resolve, 1500))
    const mockAddress = MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)]
    setWallet({
      address: mockAddress,
      isConnecting: false,
      error: null
    })
  }

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnecting: false,
      error: null
    })
  }

  const approveApplication = (application: VerifierApplication) => {
    setSelectedApplication(application)
    setShowConfirmModal(true)
  }

  const confirmApproval = () => {
    if (!selectedApplication) return

    // Create new verifier from application
    const newVerifier: Verifier = {
      id: `v${verifiers.length + 1}`,
      name: selectedApplication.name,
      walletAddress: selectedApplication.walletAddress,
      email: selectedApplication.email,
      company: selectedApplication.company,
      status: 'active',
      joinedAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    }

    // Update states
    setVerifiers([...verifiers, newVerifier])
    setApplications(applications.filter(app => app.id !== selectedApplication.id))
    setShowConfirmModal(false)
    setSelectedApplication(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'text-blue-500 bg-blue-500/10'
      case 'delivered':
        return 'text-green-500 bg-green-500/10'
      case 'rejected':
        return 'text-red-500 bg-red-500/10'
      case 'flagged':
        return 'text-yellow-500 bg-yellow-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const handleRejectShipment = () => {
    if (!selectedShipment || !rejectReason) return

    const updatedShipments = shipments.map(shipment => {
      if (shipment.id === selectedShipment.id) {
        return {
          ...shipment,
          status: 'rejected' as const,
          trackingHistory: [
            {
              timestamp: new Date().toISOString().split('T').join(' ').split('.')[0],
              location: shipment.location,
              status: `Shipment rejected: ${rejectReason}`,
              verifier: 'Admin'
            },
            ...shipment.trackingHistory
          ]
        }
      }
      return shipment
    })

    setShipments(updatedShipments)
    setShowRejectModal(false)
    setRejectReason('')
  }

  if (!wallet.address) {
    return (
      <div className="min-h-screen bg-navy-900 text-white p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-8 space-y-6">
            <div className="flex items-center justify-center w-16 h-16 bg-electric-blue/10 rounded-full mx-auto">
              <FiShield className="w-8 h-8 text-electric-blue" />
            </div>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
              <p className="text-gray-400">
                Please connect your wallet to access the admin dashboard
              </p>
            </div>

            {wallet.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-500"
              >
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{wallet.error}</p>
              </motion.div>
            )}

            <button
              onClick={connectWallet}
              disabled={wallet.isConnecting}
              className="w-full px-4 py-3 bg-electric-blue rounded-lg font-medium text-white hover:bg-electric-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {wallet.isConnecting ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect MetaMask
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              Development Mode: Using mock wallet connection
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-navy-800/50 backdrop-blur-xl border-r border-white/5">
        <div className="p-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-400 mt-1">Supply Chain Management</p>
        </div>
        
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('verifiers')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
              activeTab === 'verifiers'
                ? 'bg-electric-blue/10 text-electric-blue border-r-2 border-electric-blue'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <FiUserCheck className="w-5 h-5" />
            Verifiers
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
              activeTab === 'shipments'
                ? 'bg-electric-blue/10 text-electric-blue border-r-2 border-electric-blue'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <FiTruck className="w-5 h-5" />
            Shipments
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <div className="px-4 py-2 bg-navy-700/50 rounded-lg">
            <p className="text-sm text-gray-400">Connected Wallet (Mock)</p>
            <p className="font-mono text-sm">
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                {activeTab === 'verifiers' ? 'Verifier Management' : 'Shipment Management'}
              </h1>
              <p className="text-gray-400 mt-1">
                {activeTab === 'verifiers' 
                  ? 'Manage verifier applications and existing verifiers'
                  : 'Monitor and manage shipments'}
              </p>
            </div>
            
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              Disconnect
            </button>
          </div>

          {activeTab === 'verifiers' && (
            <div className="space-y-8">
              {/* Existing Verifiers */}
              <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <h2 className="text-xl font-bold mb-6">Existing Verifiers</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-white/5">
                        <th className="pb-4 font-medium text-gray-400">Name</th>
                        <th className="pb-4 font-medium text-gray-400">Company</th>
                        <th className="pb-4 font-medium text-gray-400">Email</th>
                        <th className="pb-4 font-medium text-gray-400">Status</th>
                        <th className="pb-4 font-medium text-gray-400">Joined</th>
                        <th className="pb-4 font-medium text-gray-400">Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifiers.map((verifier) => (
                        <tr key={verifier.id} className="border-b border-white/5">
                          <td className="py-4">{verifier.name}</td>
                          <td className="py-4">{verifier.company}</td>
                          <td className="py-4">{verifier.email}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-lg text-sm ${
                              verifier.status === 'active'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-gray-500/10 text-gray-500'
                            }`}>
                              {verifier.status.charAt(0).toUpperCase() + verifier.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4">{verifier.joinedAt}</td>
                          <td className="py-4">{verifier.lastActive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Applications */}
              <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <h2 className="text-xl font-bold mb-6">Pending Applications</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-white/5">
                        <th className="pb-4 font-medium text-gray-400">Name</th>
                        <th className="pb-4 font-medium text-gray-400">Company</th>
                        <th className="pb-4 font-medium text-gray-400">Email</th>
                        <th className="pb-4 font-medium text-gray-400">Applied</th>
                        <th className="pb-4 font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application) => (
                        <tr key={application.id} className="border-b border-white/5">
                          <td className="py-4">{application.name}</td>
                          <td className="py-4">{application.company}</td>
                          <td className="py-4">{application.email}</td>
                          <td className="py-4">{application.appliedAt}</td>
                          <td className="py-4">
                            <button
                              onClick={() => approveApplication(application)}
                              className="px-3 py-1 bg-electric-blue rounded-lg text-sm hover:bg-electric-blue/90 transition-colors"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipments' && (
            <div className="space-y-6">
              <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-white/5">
                        <th className="pb-4 font-medium text-gray-400">Product</th>
                        <th className="pb-4 font-medium text-gray-400">Production Code</th>
                        <th className="pb-4 font-medium text-gray-400">Manufacturer</th>
                        <th className="pb-4 font-medium text-gray-400">Status</th>
                        <th className="pb-4 font-medium text-gray-400">Location</th>
                        <th className="pb-4 font-medium text-gray-400">Last Updated</th>
                        <th className="pb-4 font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipments.map((shipment) => (
                        <tr key={shipment.id} className="border-b border-white/5">
                          <td className="py-4">{shipment.productName}</td>
                          <td className="py-4 font-mono text-sm">{shipment.productionCode}</td>
                          <td className="py-4">{shipment.manufacturer}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-lg text-sm ${getStatusColor(shipment.status)}`}>
                              {shipment.status.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </span>
                          </td>
                          <td className="py-4">{shipment.location}</td>
                          <td className="py-4">{shipment.timestamp}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedShipment(shipment)}
                                className="px-3 py-1 bg-electric-blue rounded-lg text-sm hover:bg-electric-blue/90 transition-colors"
                              >
                                Track Live
                              </button>
                              {shipment.status !== 'rejected' && (
                                <button
                                  onClick={() => {
                                    setSelectedShipment(shipment)
                                    setShowRejectModal(true)
                                  }}
                                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tracking Panel */}
              <AnimatePresence>
                {selectedShipment && !showRejectModal && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="fixed inset-y-0 right-0 w-[600px] bg-navy-800/95 backdrop-blur-xl border-l border-white/5 p-8 overflow-y-auto"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedShipment.productName}</h2>
                        <p className="text-gray-400 font-mono mt-1">{selectedShipment.productionCode}</p>
                      </div>
                      <button
                        onClick={() => setSelectedShipment(null)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* Current Status */}
                      <div className="bg-navy-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-medium mb-4">Current Status</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Status</p>
                            <span className={`inline-block mt-1 px-2 py-1 rounded-lg text-sm ${getStatusColor(selectedShipment.status)}`}>
                              {selectedShipment.status.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Verified By</p>
                            <p className="mt-1">{selectedShipment.verifiedBy}</p>
                          </div>
                        </div>
                      </div>

                      {/* Sensor Data */}
                      <div className="bg-navy-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-medium mb-4">Sensor Data</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <FiThermometer className="w-4 h-4" />
                              Temperature
                            </div>
                            <p className="mt-1 text-xl">{selectedShipment.temperature}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <FiDroplet className="w-4 h-4" />
                              Humidity
                            </div>
                            <p className="mt-1 text-xl">{selectedShipment.humidity}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <FiShield className="w-4 h-4" />
                              Tamper Status
                            </div>
                            <div className={`mt-1 flex items-center gap-2 ${
                              selectedShipment.tampered ? 'text-red-500' : 'text-green-500'
                            }`}>
                              {selectedShipment.tampered ? (
                                <>
                                  <FiAlertTriangle className="w-5 h-5" />
                                  <span>Tampered</span>
                                </>
                              ) : (
                                <>
                                  <FiCheckCircle className="w-5 h-5" />
                                  <span>Secure</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tracking History */}
                      <div className="bg-navy-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-medium mb-4">Tracking History</h3>
                        <div className="space-y-6">
                          {selectedShipment.trackingHistory.map((event, index) => (
                            <div key={index} className="relative pl-6 pb-6 last:pb-0">
                              <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-electric-blue" />
                              {index !== selectedShipment.trackingHistory.length - 1 && (
                                <div className="absolute left-[3px] top-4 w-0.5 h-[calc(100%-16px)] bg-electric-blue/20" />
                              )}
                              <div className="space-y-1">
                                <p className="font-medium">{event.status}</p>
                                <p className="text-sm text-gray-400">{event.location}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span>{event.timestamp}</span>
                                  <span>•</span>
                                  <span>{event.verifier}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reject Modal */}
              <AnimatePresence>
                {showRejectModal && selectedShipment && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95 }}
                      className="bg-navy-800 rounded-xl p-6 max-w-md w-full mx-4"
                    >
                      <h3 className="text-xl font-bold mb-4">Reject Shipment</h3>
                      <p className="text-gray-400 mb-4">
                        Are you sure you want to reject the shipment of {selectedShipment.productName}?
                      </p>
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Reason for Rejection
                          </label>
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter the reason for rejection..."
                            className="w-full px-4 py-3 bg-navy-900/50 rounded-lg border border-white/5 text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => {
                            setShowRejectModal(false)
                            setRejectReason('')
                          }}
                          className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRejectShipment}
                          disabled={!rejectReason}
                          className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-500/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-navy-800 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Confirm Approval</h3>
              <p className="text-gray-400 mb-4">
                Are you sure you want to approve {selectedApplication.name} from {selectedApplication.company} as a verifier?
              </p>
              <div className="bg-navy-700/50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-400 mb-2">Application Details</div>
                <div className="space-y-2">
                  <p><span className="text-gray-400">Experience:</span> {selectedApplication.experience}</p>
                  <p><span className="text-gray-400">Reason:</span> {selectedApplication.reason}</p>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproval}
                  className="px-4 py-2 bg-electric-blue rounded-lg text-white hover:bg-electric-blue/90 transition-colors"
                >
                  Confirm Approval
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard 