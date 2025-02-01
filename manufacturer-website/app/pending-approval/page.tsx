"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiLoader, FiShield, FiClock, FiMail, FiMessageSquare, FiFileText, FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

const PendingApprovalPage = () => {
  const router = useRouter()
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const formatTimeElapsed = () => {
    if (timeElapsed < 60) {
      return `${timeElapsed} minutes`
    }
    const hours = Math.floor(timeElapsed / 60)
    const minutes = timeElapsed % 60
    return `${hours}h ${minutes}m`
  }

  const supportOptions = [
    {
      icon: FiMessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: () => setShowChat(true)
    },
    {
      icon: FiMail,
      title: 'Email Support',
      description: 'Send us an email',
      action: () => window.location.href = 'mailto:support@supplyverify.com'
    },
    {
      icon: FiFileText,
      title: 'Documentation',
      description: 'Read our integration guides',
      action: () => window.location.href = '/docs'
    }
  ]

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/5 via-transparent to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>

          <div className="text-center space-y-4 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <FiLoader className="w-10 h-10 text-yellow-500 animate-spin-slow" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold"
            >
              Verification in Progress
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400"
            >
              Your account is currently under review by our administrators
            </motion.p>
          </div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-navy-800/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6 mb-8"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Status</div>
                <div className="flex items-center gap-2 text-yellow-500">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  Under Review
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Time Elapsed</div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-electric-blue" />
                  {formatTimeElapsed()}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Estimated Time</div>
                <div className="text-white">~2-3 hours</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="h-1 bg-navy-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-electric-blue rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Support Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {supportOptions.map((option, index) => (
              <motion.button
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                onClick={option.action}
                className="group relative bg-navy-800/50 backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-electric-blue/20 transition-all text-left"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-electric-blue/10 flex items-center justify-center">
                    <option.icon className="w-6 h-6 text-electric-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{option.title}</h3>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl blur" />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Chat Widget Placeholder */}
      {showChat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 w-96 h-[500px] bg-navy-800 rounded-xl border border-white/10 shadow-2xl"
        >
          {/* Add chat widget implementation here */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-medium">Support Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PendingApprovalPage 