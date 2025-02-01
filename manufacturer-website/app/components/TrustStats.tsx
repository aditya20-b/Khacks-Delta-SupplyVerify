"use client"

import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'
import { FiBox, FiGlobe, FiActivity, FiShield, FiTrendingUp } from 'react-icons/fi'

const baseStats = [
  {
    label: 'Product Codes Tracked',
    value: 15783,
    prefix: '#',
    icon: FiBox,
    description: 'Unique products verified on chain',
    trend: '+127 today',
    trendUp: true,
    liveUpdate: true
  },
  {
    label: 'Supply Routes Mapped',
    value: 247,
    suffix: '+',
    icon: FiGlobe,
    description: 'Active global supply paths',
    trend: '+3 this week',
    trendUp: true,
    liveUpdate: false
  },
  {
    label: 'Blockchain Transactions',
    value: 42891,
    icon: FiActivity,
    description: 'Verified supply chain events',
    trend: '+892 today',
    trendUp: true,
    liveUpdate: true
  },
  {
    label: 'Trust Score Average',
    value: 98,
    suffix: '%',
    icon: FiShield,
    description: 'Overall system reliability',
    trend: '↑2% this month',
    trendUp: true,
    liveUpdate: false
  }
]

const LiveIndicator = () => (
  <div className="absolute top-4 right-4 flex items-center gap-2">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
    </span>
    <span className="text-xs text-green-400 font-medium">LIVE</span>
  </div>
)

const TrendIndicator = ({ trend, up }: { trend: string; up: boolean }) => (
  <div className={`flex items-center gap-1 text-xs ${up ? 'text-green-400' : 'text-red-400'}`}>
    <FiTrendingUp className={`${up ? '' : 'rotate-180'}`} />
    <span>{trend}</span>
  </div>
)

const AnimatedCounter = ({ value, prefix = '', suffix = '', liveUpdate = false }: { value: number, prefix?: string, suffix?: string, liveUpdate?: boolean }) => {
  const [count, setCount] = useState(value)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      const duration = 2000
      const steps = 60
      const stepValue = value / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += 1
        setCount(Math.min(Math.floor(stepValue * current), value))
        
        if (current >= steps) {
          clearInterval(timer)
          
          // Start live updates after initial animation
          if (liveUpdate) {
            const liveTimer = setInterval(() => {
              setCount(prev => prev + Math.floor(Math.random() * 3))
            }, 3000)
            return () => clearInterval(liveTimer)
          }
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [inView, value, liveUpdate])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

const ParticleCanvas = () => {
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio

    const particles: any[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1 + 0.5,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2
      })
    }

    function animate() {
      requestAnimationFrame(animate)
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(37, 99, 235, ${particle.opacity})`
        ctx.fill()
      })
    }

    animate()
  }, [])

  return (
    <canvas
      id="particle-canvas"
      className="absolute inset-0 w-full h-full opacity-30"
    />
  )
}

const TrustStats = () => {
  const [stats] = useState(baseStats)

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-navy-800">
        <ParticleCanvas />
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
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Real-Time Network Metrics
            </h2>
            <p className="text-gray-400">
              Live statistics from our blockchain-powered supply chain verification network
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative group h-full">
                {/* Card */}
                <div className="relative h-full bg-navy-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-electric-blue/20 transition-colors">
                  {stat.liveUpdate && <LiveIndicator />}
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  
                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-electric-blue/10 mb-4">
                      <stat.icon className="w-6 h-6 text-electric-blue" />
                    </div>
                    
                    {/* Metric */}
                    <div className="mb-2">
                      <div className="text-3xl font-bold text-white mb-1 font-mono">
                        <AnimatedCounter
                          value={stat.value}
                          prefix={stat.prefix}
                          suffix={stat.suffix}
                          liveUpdate={stat.liveUpdate}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-400">
                          {stat.label}
                        </div>
                        <TrendIndicator trend={stat.trend} up={stat.trendUp} />
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-500">
                      {stat.description}
                    </p>
                  </div>
                </div>

                {/* Hover Lines */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-electric-blue/0 via-electric-blue/10 to-electric-blue/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1rem] blur-sm" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/20 to-transparent" />
      </div>
    </section>
  )
}

export default TrustStats 