"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiPackage, FiLink, FiPlay, FiUsers, FiArrowRight } from 'react-icons/fi'

const steps = [
  {
    title: 'Product Registration',
    icon: FiPackage,
    description: 'Register your products with unique digital identifiers and blockchain certificates.',
    features: ['Secure QR codes', 'Digital certificates', 'Batch processing'],
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Supply Chain Integration',
    icon: FiLink,
    description: 'Connect your existing systems and partners to our blockchain network.',
    features: ['API integration', 'Partner onboarding', 'Data synchronization'],
    gradient: 'from-cyan-500 to-teal-500'
  },
  {
    title: 'Journey Tracking Activation',
    icon: FiPlay,
    description: 'Start tracking products in real-time across your supply chain network.',
    features: ['Real-time updates', 'Route optimization', 'Status monitoring'],
    gradient: 'from-teal-500 to-green-500'
  },
  {
    title: 'Consumer Portal Launch',
    icon: FiUsers,
    description: 'Provide customers with transparent access to product journey data.',
    features: ['Product stories', 'Verification portal', 'Customer insights'],
    gradient: 'from-green-500 to-emerald-500'
  }
]

const StepCard = ({ step, index, inView }: { step: typeof steps[0], index: number, inView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      {/* Connection Line */}
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-10 left-[50%] w-full h-px bg-gradient-to-r from-electric-blue/50 to-transparent">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: index * 0.2 }}
            className="h-full bg-gradient-to-r from-electric-blue to-transparent origin-left"
          />
        </div>
      )}

      {/* Card */}
      <div className="relative bg-navy-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-electric-blue/20 transition-all duration-500">
        {/* Step Number */}
        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-navy-900 border border-white/10 flex items-center justify-center text-sm font-bold text-electric-blue">
          {index + 1}
        </div>

        {/* Icon */}
        <div className={`relative w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${step.gradient} p-0.5`}>
          <div className="absolute inset-0 bg-navy-900/90 rounded-xl" />
          <div className="relative h-full rounded-xl bg-navy-900/90 flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
            <step.icon className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {step.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {step.description}
          </p>

          {/* Features */}
          <ul className="space-y-2">
            {step.features.map((feature, i) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: index * 0.2 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-400"
              >
                <FiArrowRight className="text-electric-blue" />
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Hover Effects */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[1rem] blur" />
      </div>
    </motion.div>
  )
}

const HowItWorks = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/0 via-electric-blue/5 to-navy-900/0" />
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
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              How It Works
            </h2>
            <p className="text-gray-400">
              Four simple steps to transform your supply chain into a trust engine
            </p>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} inView={inView} />
          ))}
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/20 to-transparent" />
      </div>
    </section>
  )
}

export default HowItWorks 