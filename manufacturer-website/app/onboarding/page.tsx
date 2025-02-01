"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShield, FiLock, FiUser, FiBox, FiGlobe, FiCheck, FiArrowRight, FiLoader } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to SupplyVerify',
    description: 'Set up your blockchain-powered supply chain verification in minutes',
    icon: FiShield
  },
  {
    id: 'wallet',
    title: 'Connect Your Wallet',
    description: 'Secure your account with Web3 authentication',
    icon: FiLock
  },
  {
    id: 'profile',
    title: 'Company Profile',
    description: 'Tell us about your organization',
    icon: FiUser
  },
  {
    id: 'verification',
    title: 'Verify Ownership',
    description: 'Confirm your company credentials',
    icon: FiGlobe
  }
]

const OnboardingPage = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved'>('pending')
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    size: '',
    role: ''
  })

  const handleWalletConnect = async () => {
    setIsConnecting(true)
    // Simulated wallet connection
    setTimeout(() => {
      setWalletConnected(true)
      setIsConnecting(false)
      setCurrentStep(2)
    }, 2000)
  }

  const handleDashboardClick = () => {
    if (verificationStatus === 'pending') {
      router.push('/pending-approval')
    } else {
      router.push('/dashboard')
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-electric-blue/10 flex items-center justify-center">
                <FiShield className="w-10 h-10 text-electric-blue" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Welcome to SupplyVerify</h2>
              <p className="text-gray-400">Join the future of supply chain verification</p>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full px-6 py-3 bg-electric-blue rounded-xl font-medium text-white hover:bg-electric-blue/90 transition-colors"
            >
              Get Started
            </button>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Connect Your Wallet</h3>
              <p className="text-gray-400 text-sm">
                Choose your preferred Web3 wallet to continue
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleWalletConnect}
                disabled={isConnecting}
                className="w-full px-6 py-4 bg-navy-800 hover:bg-navy-700 rounded-xl border border-white/5 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/metamask.svg" alt="MetaMask" className="w-8 h-8" />
                    <span className="font-medium text-white">MetaMask</span>
                  </div>
                  {isConnecting ? (
                    <FiLoader className="w-5 h-5 text-electric-blue animate-spin" />
                  ) : (
                    <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  )}
                </div>
              </button>
              {/* Add more wallet options here */}
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Company Details</h3>
              <p className="text-gray-400 text-sm">
                Tell us about your organization
              </p>
            </div>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault()
              setCurrentStep(3)
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-navy-800 rounded-xl border border-white/5 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none transition-colors"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Industry
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-navy-800 rounded-xl border border-white/5 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none transition-colors"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                >
                  <option value="">Select industry</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="logistics">Logistics</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-electric-blue rounded-xl font-medium text-white hover:bg-electric-blue/90 transition-colors"
              >
                Continue
              </button>
            </form>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <FiLoader className="w-10 h-10 text-yellow-500 animate-spin-slow" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Account Under Review</h2>
              <div className="space-y-2">
                <p className="text-gray-400">
                  Our administrators are verifying your company credentials
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-yellow-500">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  Verification in progress
                </div>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="bg-navy-800/50 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Estimated time</span>
                <span className="text-white font-mono">~2-3 hours</span>
              </div>
              <div className="mt-3 h-1 bg-navy-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-electric-blue rounded-full"
                />
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4 pt-2">
              <div className="text-sm text-gray-400">
                While we verify your account, you can:
              </div>
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-electric-blue/10 flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-electric-blue" />
                  </div>
                  <span className="text-gray-300">Explore the dashboard features</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-electric-blue/10 flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-electric-blue" />
                  </div>
                  <span className="text-gray-300">Set up your company profile</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-electric-blue/10 flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-electric-blue" />
                  </div>
                  <span className="text-gray-300">Review integration documentation</span>
                </motion.div>
              </div>
            </div>

            <button
              onClick={handleDashboardClick}
              className="w-full px-6 py-3 bg-electric-blue rounded-xl font-medium text-white hover:bg-electric-blue/90 transition-colors flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <FiArrowRight className="w-4 h-4" />
            </button>

            {/* Contact Support */}
            <div className="text-center">
              <button className="text-sm text-gray-400 hover:text-white transition-colors">
                Need help? Contact support
              </button>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/5 via-transparent to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-electric-blue/10 flex items-center justify-center">
            <FiShield className="w-6 h-6 text-electric-blue" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            SupplyVerify
          </span>
        </div>

        {/* Progress Steps */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-electric-blue' : 'bg-navy-800 border border-white/10'
                }`}>
                  <step.icon className={`w-5 h-5 ${
                    index <= currentStep ? 'text-white' : 'text-gray-400'
                  }`} />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-px mt-5 ${
                    index < currentStep ? 'bg-electric-blue' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-navy-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/5">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage 