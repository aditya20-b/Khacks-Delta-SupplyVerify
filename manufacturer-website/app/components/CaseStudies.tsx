"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiTrendingUp, FiUsers, FiBox, FiGlobe, FiBarChart2, FiCheckCircle, FiAward, FiShield } from 'react-icons/fi'

const caseStudies = [
  {
    title: "Global Luxury Brand Success",
    description: "How a premium watchmaker achieved 100% supply chain transparency",
    metrics: [
      { label: "Counterfeit Reduction", value: "98%", icon: FiShield },
      { label: "Customer Trust Score", value: "94%", icon: FiUsers },
      { label: "Products Tracked", value: "50K+", icon: FiBox }
    ],
    highlights: [
      "Real-time tracking across 30+ countries",
      "Blockchain-verified authenticity",
      "Enhanced customer engagement"
    ],
    gradient: "from-blue-500 to-purple-500"
  },
  {
    title: "Consumer Impact Report",
    description: "Transforming consumer confidence in authentic products",
    metrics: [
      { label: "Verification Rate", value: "2M+", icon: FiCheckCircle },
      { label: "Trust Index Growth", value: "85%", icon: FiTrendingUp },
      { label: "Global Reach", value: "120+", icon: FiGlobe }
    ],
    highlights: [
      "Instant product authentication",
      "Complete journey transparency",
      "Direct brand connection"
    ],
    gradient: "from-purple-500 to-pink-500"
  }
]

const CaseStudyCard = ({ study, index }: { study: typeof caseStudies[0], index: number }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative group"
    >
      <div className="relative bg-navy-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-electric-blue/20 transition-all duration-500">
        {/* Background Gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
        
        {/* Content */}
        <div className="relative space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
            >
              {study.title}
            </motion.h3>
            <p className="text-gray-400">{study.description}</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            {study.metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.2 + i * 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-4 text-center space-y-2">
                  <metric.icon className="w-6 h-6 mx-auto text-electric-blue" />
                  <div className="font-mono font-bold text-xl text-white">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-400">
                    {metric.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <div className="h-px bg-gradient-to-r from-electric-blue/20 via-electric-blue/10 to-transparent" />
            {study.highlights.map((highlight, i) => (
              <motion.div
                key={highlight}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: index * 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <FiAward className="w-5 h-5 text-electric-blue" />
                <span className="text-gray-300">{highlight}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hover Effects */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[1rem] blur" />
      </div>
    </motion.div>
  )
}

const CaseStudies = () => {
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
              <FiBarChart2 className="w-8 h-8 text-electric-blue" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Success Stories
            </h2>
            <p className="text-gray-400">
              Real impact through supply chain innovation and trust
            </p>
          </motion.div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={study.title} study={study} index={index} />
          ))}
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/20 to-transparent" />
      </div>
    </section>
  )
}

export default CaseStudies 