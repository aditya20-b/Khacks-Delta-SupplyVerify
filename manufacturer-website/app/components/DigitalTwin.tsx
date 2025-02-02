"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiMap, FiClock, FiActivity, FiBox } from 'react-icons/fi'

const features = [
  {
    icon: FiMap,
    title: 'Global Route Visualization',
    description: 'Interactive 3D mapping of supply routes'
  },
  {
    icon: FiClock,
    title: 'Time-travel Timeline',
    description: 'Track historical product journey data'
  },
  {
    icon: FiActivity,
    title: 'Real-time Monitoring',
    description: 'Live status updates and alerts'
  },
  {
    icon: FiBox,
    title: 'Digital Product Twin',
    description: 'Complete product lifecycle tracking'
  }
]

const GridPattern = () => (
  <svg
    className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="digital-grid"
        width={20}
        height={20}
        x="50%"
        y={-1}
        patternUnits="userSpaceOnUse"
      >
        <path d="M.5 200V.5H200" fill="none" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" strokeWidth={0} fill="url(#digital-grid)" />
    <svg x="50%" y={-1} className="overflow-visible fill-electric-blue/5">
      <path
        d="M-200 0h201v201h-201Z M600 0h201v201h-201Z"
        strokeWidth={0}
      />
    </svg>
  </svg>
)

const PlaceholderAnimation = () => {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 via-purple-900/20 to-navy-900/50" />
      
      {/* Animated Lines */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-electric-blue/0 via-electric-blue/50 to-electric-blue/0"
            style={{
              top: `${20 + i * 15}%`,
              left: '0',
              right: '0',
            }}
            animate={{
              x: [-100, 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Placeholder Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-electric-blue/20 mx-auto mb-4 flex items-center justify-center"
          >
            <FiBox className="w-10 h-10 text-electric-blue" />
          </motion.div>
          <p className="text-gray-400 font-medium">Interactive Demo Coming Soon</p>
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-electric-blue/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, 10],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  )
}

const DigitalTwin = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section ref={ref} className="relative py-20 overflow-hidden bg-navy-800">
      {/* Background Pattern */}
      <GridPattern />
      
      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Digital Twin Experience
            </h2>
            <p className="text-gray-400">
              Explore your supply chain through an immersive digital interface
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Feature List */}
          <div className="lg:col-span-2 space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-xl bg-navy-900/50 backdrop-blur-sm border border-white/5"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-electric-blue" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Demo Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm"
          >
            <PlaceholderAnimation />
          </motion.div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/20 to-transparent" />
      </div>
    </section>
  )
}

export default DigitalTwin 