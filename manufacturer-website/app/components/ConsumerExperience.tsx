"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiShield, FiPackage, FiMap, FiClock, FiCheck, FiSmartphone, FiChevronRight, FiWifi } from 'react-icons/fi'

const PreviewPhone = () => {
  return (
    <div className="relative w-[300px] h-[600px] mx-auto">
      {/* Phone Frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-1"
      >
        <div className="absolute inset-0 bg-black rounded-[2.8rem] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl" />
          
          {/* Screen Content */}
          <div className="h-full pt-8 pb-4 px-4 bg-navy-900">
            {/* Status Bar */}
            <div className="flex justify-between items-center mb-4 px-4 text-xs text-gray-400">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <FiWifi className="w-4 h-4" />
                <div className="w-6 h-3 rounded-sm border border-gray-400" />
              </div>
            </div>

            {/* App Content */}
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Verify Product</h3>
                <p className="text-sm text-gray-400">Scan or enter product code</p>
              </div>

              {/* Scan Area */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative aspect-square bg-navy-800/50 rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-4 border-2 border-dashed border-electric-blue/50 rounded-lg" />
                <motion.div
                  animate={{ 
                    top: ["0%", "100%", "0%"],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute left-0 right-0 h-0.5 bg-electric-blue/50"
                />
              </motion.div>

              {/* Recent Scans */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400">Recent Verifications</h4>
                {[
                  { name: "Premium Watch", time: "2 mins ago", verified: true },
                  { name: "Designer Bag", time: "Yesterday", verified: true },
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-navy-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <FiCheck className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.time}</p>
                      </div>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      {[
        { icon: FiShield, color: "text-green-500", bg: "bg-green-500", delay: 0.8 },
        { icon: FiMap, color: "text-blue-500", bg: "bg-blue-500", delay: 1 },
        { icon: FiClock, color: "text-purple-500", bg: "bg-purple-500", delay: 1.2 },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: item.delay,
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
          className={`absolute ${getPosition(index)} w-12 h-12 rounded-xl ${item.bg}/10 flex items-center justify-center`}
        >
          <item.icon className={`w-6 h-6 ${item.color}`} />
        </motion.div>
      ))}
    </div>
  )
}

const features = [
  {
    icon: FiSmartphone,
    title: "Instant Verification",
    description: "Scan product QR codes for immediate authenticity checks"
  },
  {
    icon: FiMap,
    title: "Journey Tracking",
    description: "View complete supply chain history and product movement"
  },
  {
    icon: FiClock,
    title: "Real-time Updates",
    description: "Get live status updates and location information"
  }
]

const ConsumerExperience = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-b from-electric-blue/5 via-transparent to-transparent"
        />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <FiSmartphone className="w-8 h-8 text-electric-blue" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Your Products, Their Stories
            </h2>
            <p className="text-gray-400">
              Empower consumers with transparent product verification and journey tracking
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Preview */}
          <div className="relative order-2 lg:order-1">
            <PreviewPhone />
          </div>

          {/* Features */}
          <div className="order-1 lg:order-2 space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-electric-blue/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-electric-blue" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper function to position floating elements
const getPosition = (index: number) => {
  const positions = [
    "-top-6 -right-6",
    "top-1/4 -right-8",
    "top-1/2 -right-6"
  ]
  return positions[index] || ""
}

export default ConsumerExperience 