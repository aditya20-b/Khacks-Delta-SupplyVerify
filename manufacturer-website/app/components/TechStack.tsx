"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiDatabase, FiActivity, FiGlobe, FiServer, FiShield, FiCpu, FiCode, FiLayers } from 'react-icons/fi'

const technologies = [
  {
    name: 'Blockchain Core',
    description: 'Immutable ledger system with smart contracts',
    icon: FiDatabase,
    metrics: ['99.99% Uptime', '2ms Latency'],
    features: ['Smart Contracts', 'Consensus Protocol'],
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    name: 'Real-time Tracking',
    description: 'Global product monitoring system',
    icon: FiActivity,
    metrics: ['Real-time Updates', 'Global Coverage'],
    features: ['Location Tracking', 'Status Monitoring'],
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Interactive Explorer',
    description: '3D visualization and journey mapping',
    icon: FiGlobe,
    metrics: ['60 FPS Rendering', '3D Mapping'],
    features: ['Interactive Maps', 'Timeline View'],
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Network Hub',
    description: 'Distributed warehouse management',
    icon: FiServer,
    metrics: ['5000+ Nodes', 'Global Network'],
    features: ['Load Balancing', 'Edge Computing'],
    gradient: 'from-pink-500 to-rose-500'
  }
]

const TechCard = ({ tech, index }: { tech: typeof technologies[0], index: number }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="relative bg-navy-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-electric-blue/20 transition-all duration-500">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Icon */}
        <div className={`relative w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${tech.gradient} p-0.5 group-hover:p-1 transition-all duration-300`}>
          <div className="absolute inset-0 bg-navy-900/90 rounded-xl" />
          <div className="relative h-full rounded-xl bg-navy-900/90 flex items-center justify-center group-hover:bg-navy-900/40 transition-colors duration-300">
            <tech.icon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {tech.name}
          </h3>
          <p className="text-gray-400 text-sm">
            {tech.description}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2">
            {tech.metrics.map((metric, i) => (
              <motion.div
                key={metric}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: index * 0.2 + i * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tech.gradient}`} />
                <span className="text-electric-blue font-mono text-sm">{metric}</span>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div className="pt-4 border-t border-white/5">
            <div className="grid grid-cols-2 gap-2">
              {tech.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: index * 0.2 + i * 0.1 }}
                  className="text-sm text-gray-400"
                >
                  {feature}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Effects */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[1rem] blur" />
      </div>
    </motion.div>
  )
}

const TechStack = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-navy-800">
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
              <FiCpu className="w-8 h-8 text-electric-blue" />
              <FiCode className="w-8 h-8 text-purple-500" />
              <FiLayers className="w-8 h-8 text-pink-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Powered by Advanced Technology
            </h2>
            <p className="text-gray-400">
              Cutting-edge infrastructure designed for reliability, scalability, and performance
            </p>
          </motion.div>
        </div>

        {/* Tech Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <TechCard key={tech.name} tech={tech} index={index} />
          ))}
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/20 to-transparent" />
      </div>
    </section>
  )
}

export default TechStack 