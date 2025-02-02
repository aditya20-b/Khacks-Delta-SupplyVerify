"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import Globe from './Globe';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-purple-900/20 to-navy-900/95">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0">
        {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-electric-blue rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* Left Column - Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
          >
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Trusted by 500+ Global Manufacturers
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white"
          >
            Transform Your Supply Chain into a{' '}
            <span className="text-electric-blue">Trust Engine</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300 leading-relaxed"
          >
            Blockchain-powered verification with immersive product storytelling. 
            Build trust, ensure authenticity, and engage customers like never before.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button className="group relative inline-flex items-center gap-2 bg-electric-blue px-8 py-4 rounded-full font-semibold transition-all hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-electric-blue/25">
              Join the Network
              <HiArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="group relative inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-full font-semibold transition-all hover:bg-white/10 hover:border-white/40">
              <FaPlay className="text-sm" />
              Watch Demo
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-8 flex items-center gap-6 text-sm text-gray-400"
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-navy-900 bg-gradient-to-br from-gray-200 to-gray-400" />
              ))}
            </div>
            <p>Trusted by industry leaders worldwide</p>
          </motion.div>
        </motion.div>

        {/* Right Column - Interactive Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative aspect-square"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 to-purple-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative bg-navy-800/50 backdrop-blur-sm rounded-3xl p-8 h-full border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 to-purple-900/5 rounded-3xl" />
            
            {/* 3D Globe */}
            <div className="relative h-full rounded-2xl bg-navy-900/50 overflow-hidden">
              <Globe />
            </div>

            {/* Live Data Indicators */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-navy-900/90 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-400">Live Network Status</span>
              </div>
              <div className="text-sm text-electric-blue font-mono">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 