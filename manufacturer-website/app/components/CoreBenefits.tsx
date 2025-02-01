"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiBox, FiShield, FiGitBranch, FiZap, FiLayers, FiRefreshCw } from 'react-icons/fi'

const benefits = [
  {
    title: 'Interactive Product Stories',
    description: 'Transform every product into an immersive digital journey. Track its path from origin to destination with real-time visibility.',
    icon: FiBox,
    features: ['Real-time tracking', 'Interactive timeline', 'Rich media support'],
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    title: 'Blockchain Verification',
    description: 'Leverage the power of blockchain to ensure immutable proof of authenticity for every product in your supply chain.',
    icon: FiShield,
    features: ['Immutable records', 'Smart contracts', 'Decentralized trust'],
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Supply Chain Integration',
    description: 'Seamlessly connect with existing systems and partners. Our platform adapts to your workflow, not the other way around.',
    icon: FiGitBranch,
    features: ['API-first design', 'Legacy system support', 'Partner network'],
    gradient: 'from-purple-500 to-pink-500'
  }
]

const FeatureCard = ({ feature, index }: { feature: typeof benefits[0], index: number }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative group"
    >
      <div className="relative bg-navy-900/50 backdrop-blur-xl rounded-2xl p-8 h-full border border-white/5 hover:border-electric-blue/20 transition-all duration-500">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Icon */}
        <div className={`relative w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5`}>
          <div className="absolute inset-0 bg-navy-900/90 rounded-xl" />
          <div className="relative h-full rounded-xl bg-navy-900/90 flex items-center justify-center">
            <feature.icon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {feature.title}
          </h3>
          <p className="text-gray-400 mb-6">
            {feature.description}
          </p>

          {/* Feature List */}
          <ul className="space-y-3">
            {feature.features.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.4, delay: index * 0.2 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-400"
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                {item}
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

const CoreBenefits = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/0 via-electric-blue/5 to-navy-900/0" />
      </div>

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
              Revolutionize Your Supply Chain
            </h2>
            <p className="text-gray-400">
              Harness the power of blockchain and interactive storytelling to build trust and transparency
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <FeatureCard key={benefit.title} feature={benefit} index={index} />
          ))}
        </div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/20 to-transparent" />
      </div>
    </section>
  )
}

export default CoreBenefits 