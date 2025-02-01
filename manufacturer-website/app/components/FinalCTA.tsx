"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight, FiShield, FiGlobe } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

const FinalCTA = () => {
  const router = useRouter()
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const handleGetStarted = () => {
    router.push('/onboarding')
  }

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-purple-900/50 to-navy-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        {/* Animated Orbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue rounded-full blur-[128px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px]"
        />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <div className="text-center space-y-8">
            {/* Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-electric-blue/10 flex items-center justify-center">
                <FiShield className="w-8 h-8 text-electric-blue" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <FiGlobe className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-electric-blue">
                Join the Future of Manufacturing Trust
              </h2>
              <p className="text-xl text-gray-400">
                Transform your supply chain with blockchain-powered verification
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-electric-blue rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-electric-blue via-purple-500 to-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-gradient" />
                <div className="relative flex items-center gap-2">
                  <span className="font-semibold">Get Started Now</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/onboarding?type=enterprise')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 rounded-xl border border-white/10 hover:border-electric-blue/50 transition-colors"
              >
                <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-electric-blue group-hover:to-purple-500 transition-all">
                  Contact Sales
                </span>
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-12 flex justify-center gap-8"
            >
              {['ISO Certified', 'Enterprise Ready', '24/7 Support'].map((badge, index) => (
                <div key={badge} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                  {badge}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA 