"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  FiGrid,
  FiMap,
  FiDatabase,
  FiAlertCircle,
  FiChevronRight,
  FiShield
} from 'react-icons/fi'

const navigationItems = [
  {
    name: 'Overview',
    icon: FiGrid,
    href: '/dashboard',
    description: 'Dashboard overview and key metrics'
  },
  {
    name: 'Product Tracking',
    icon: FiMap,
    href: '/dashboard/product-tracking',
    description: 'Track and manage your products'
  },
  {
    name: 'Open Food Facts',
    icon: FiDatabase,
    href: '/dashboard/open-food-facts',
    description: 'Access food product database'
  },
  {
    name: 'Problematic Shipments',
    icon: FiAlertCircle,
    href: '/dashboard/problematic-shipments',
    description: 'View and resolve shipment issues'
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/5 via-transparent to-transparent" />
      </div>

      <div className="relative flex">
        {/* Sidebar */}
        <div className="w-80 min-h-screen bg-navy-800/50 backdrop-blur-xl border-r border-white/5">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-electric-blue/10 flex items-center justify-center">
                <FiShield className="w-5 h-5 text-electric-blue" />
              </div>
              <span className="font-bold text-lg">SupplyVerify</span>
            </div>

            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-electric-blue text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {isActive && (
                      <FiChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
} 