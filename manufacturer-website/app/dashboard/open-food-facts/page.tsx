"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FiSearch,
  FiBox,
  FiAlertTriangle,
  FiInfo,
  FiShield,
  FiActivity,
  FiPackage,
  FiCheck,
  FiX,
  FiLoader,
  FiGlobe,
  FiCalendar,
  FiUsers,
  FiTag,
  FiShoppingBag,
  FiAlertCircle,
  FiImage,
  FiList,
  FiFlag
} from 'react-icons/fi'

interface NutritionalInfo {
  energy_kcal: string
  fat: string
  saturated_fat: string
  sugars: string
  salt: string
  proteins: string
  carbohydrates: string
}

interface NutriScore {
  grade: string
  score: string
}

interface QualityInfo {
  completeness: string
  ecoscore: string
  missing_data: any
  warnings: string[]
  packaging_warning: string
  production_warning: string
  threatened_species_warning: string
  labels_warning: string
}

interface TamperingInfo {
  tampering_tags: string[]
  states: string[]
  last_modified_by: string
  last_updated_t: string
}

interface ProductData {
  product_name: string
  brand: string
  categories: string
  product_code: string
  languages: string
  labels: string
  image_url: string
  url: string
  nutrition: NutritionalInfo
  nutriscore: NutriScore
  quality_info: QualityInfo
  allergens: string
  ingredients: string
  tampering_info: TamperingInfo
}

interface ExtendedProductData extends ProductData {
  metadata: {
    count: number
    page: number
    page_count: number
    page_size: number
  }
  identification: {
    _id: string
    code: string
    id: string
  }
  localization: {
    countries: string[]
    stores: string[]
    purchase_places: string[]
  }
  nutrient_levels: {
    fat: string
    salt: string
    sugars: string
    saturated_fat: string
  }
  images: {
    image_url: string
    image_thumb_url: string
    additional_images: string[]
  }
  eco_data: {
    ecoscore_grade: string
    ecoscore_tags: string[]
    data_quality_tags: string[]
  }
  product_states: {
    states: string[]
    states_hierarchy: string[]
  }
  data_quality: {
    data_sources: string[]
    editors_tags: string[]
    informers_tags: string[]
  }
  misc: {
    popularity_tags: string[]
    teams_tags: string[]
    created_t: string
    last_modified_t: string
  }
}

const OpenFoodFactsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [productData, setProductData] = useState<ExtendedProductData | null>(null)
  const [error, setError] = useState('')

  const baseUrl = 'https://world.openfoodfacts.org/cgi/search.pl'

  const fetchProductData = async (productName: string) => {
    setIsLoading(true)
    setError('')
    
    const params = {
      search_terms: productName,
      search_simple: 1,
      action: 'process',
      json: 1,
      page_size: 1,
    }

    try {
      const response = await axios.get(baseUrl, { params })
      if (response.data.products.length === 0) {
        setError('No product found')
        setProductData(null)
      } else {
        const transformedData = transformProductData(response.data)
        setProductData(transformedData)
      }
    } catch (error) {
      setError('Error fetching product data')
      setProductData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const transformProductData = (rawResponse: any): ExtendedProductData => {
    const product = rawResponse.products[0]

    // Helper function to ensure array type and handle strings
    const ensureArray = (value: any): string[] => {
      if (!value) return []
      if (typeof value === 'string') return value.split(',').map(item => item.trim())
      if (Array.isArray(value)) return value
      return []
    }

    // Helper function to handle object values
    const objectToString = (obj: any): string => {
      if (!obj) return 'N/A'
      if (typeof obj === 'string') return obj
      if (typeof obj === 'object') {
        return Object.keys(obj)
          .map(key => key.replace('en:', ''))
          .join(', ')
      }
      return 'N/A'
    }

    // Helper function to format languages
    const formatLanguages = (langs: any): string => {
      if (!langs) return 'N/A'
      if (typeof langs === 'string') return langs
      if (Array.isArray(langs)) return langs.join(', ')
      if (typeof langs === 'object') {
        return Object.keys(langs)
          .map(key => key.replace('en:', ''))
          .join(', ')
      }
      return 'N/A'
    }

    return {
      product_name: product.product_name || 'N/A',
      brand: product.brands || 'N/A',
      categories: objectToString(product.categories),
      product_code: product.code || 'N/A',
      languages: formatLanguages(product.languages),
      labels: objectToString(product.labels),
      image_url: product.image_url || 'N/A',
      url: product.url || 'N/A',
      nutrition: {
        energy_kcal: product.nutriments?.['energy-kcal'] || 'N/A',
        fat: product.nutriments?.fat || 'N/A',
        saturated_fat: product.nutriments?.['saturated-fat'] || 'N/A',
        sugars: product.nutriments?.sugars || 'N/A',
        salt: product.nutriments?.salt || 'N/A',
        proteins: product.nutriments?.proteins || 'N/A',
        carbohydrates: product.nutriments?.carbohydrates || 'N/A',
      },
      nutriscore: {
        grade: product.nutriscore_grade || 'N/A',
        score: product.nutriscore_score || 'N/A',
      },
      quality_info: {
        completeness: product.completeness || 'N/A',
        ecoscore: product.ecoscore_grade || 'unknown',
        missing_data: product.ecoscore_data?.missing || {},
        warnings: product.data_quality_warnings_tags || [],
        packaging_warning: product.ecoscore_data?.packaging?.warning || 'N/A',
        production_warning: product.ecoscore_data?.production_system?.warning || 'N/A',
        threatened_species_warning: product.ecoscore_data?.threatened_species?.warning || 'N/A',
        labels_warning: product.labels || 'N/A',
      },
      allergens: product.allergens || 'N/A',
      ingredients: product.ingredients_text || 'N/A',
      tampering_info: {
        tampering_tags: product.tags || [],
        states: product.states || [],
        last_modified_by: product.last_modified_by || 'N/A',
        last_updated_t: product.last_updated_t || 'N/A',
      },
      metadata: {
        count: rawResponse.count,
        page: rawResponse.page,
        page_count: rawResponse.page_count,
        page_size: rawResponse.page_size
      },
      identification: {
        _id: product._id || 'N/A',
        code: product.code || 'N/A',
        id: product.id || 'N/A'
      },
      localization: {
        countries: ensureArray(product.countries_tags),
        stores: ensureArray(product.stores_tags),
        purchase_places: ensureArray(product.purchase_places)
      },
      nutrient_levels: {
        fat: product.nutrient_levels?.fat || 'N/A',
        salt: product.nutrient_levels?.salt || 'N/A',
        sugars: product.nutrient_levels?.sugars || 'N/A',
        saturated_fat: product.nutrient_levels?.['saturated-fat'] || 'N/A'
      },
      images: {
        image_url: product.image_url || 'N/A',
        image_thumb_url: product.image_thumb_url || 'N/A',
        additional_images: Object.values(product.images || {})
          .filter((img: any) => img.url)
          .map((img: any) => img.url)
      },
      eco_data: {
        ecoscore_grade: product.ecoscore_grade || 'N/A',
        ecoscore_tags: ensureArray(product.ecoscore_tags),
        data_quality_tags: ensureArray(product.data_quality_tags)
      },
      product_states: {
        states: ensureArray(product.states),
        states_hierarchy: ensureArray(product.states_hierarchy)
      },
      data_quality: {
        data_sources: ensureArray(product.data_sources),
        editors_tags: ensureArray(product.editors_tags),
        informers_tags: ensureArray(product.informers_tags)
      },
      misc: {
        popularity_tags: ensureArray(product.popularity_tags),
        teams_tags: ensureArray(product.teams_tags),
        created_t: product.created_t || 'N/A',
        last_modified_t: product.last_modified_t || 'N/A'
      }
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchProductData(searchQuery)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Open Food Facts</h1>
            <p className="text-gray-400 mt-1">Search and verify food products globally</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a food product..."
                className="w-full px-4 py-3 pl-10 bg-navy-900/50 rounded-xl border border-white/5 text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-electric-blue rounded-xl font-medium text-white hover:bg-electric-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 flex items-center gap-2"
            >
              <FiAlertTriangle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          {productData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Product Overview - Full Width */}
              <div className="lg:col-span-3 bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <div className="flex items-start gap-6">
                  <div className="relative group">
                    {productData.image_url !== 'N/A' && (
                      <img
                        src={productData.image_url}
                        alt={productData.product_name}
                        className="w-40 h-40 object-cover rounded-lg"
                      />
                    )}
                    {productData.images?.additional_images?.length > 0 && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">+{productData.images.additional_images.length} more</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">{productData.product_name}</h2>
                        <p className="text-gray-400">{productData.brand}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {productData.localization.countries.map((country, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-navy-700/50 rounded-lg text-sm text-gray-400"
                          >
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {typeof productData.categories === 'string' && 
                        productData.categories.split(',').filter(cat => cat !== 'N/A').map((category, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-electric-blue/10 text-electric-blue rounded-lg text-sm"
                          >
                            {category.trim()}
                          </span>
                        ))}
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-navy-700/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400">Product Code</div>
                        <div className="font-mono text-sm mt-1">{productData.product_code}</div>
                      </div>
                      <div className="bg-navy-700/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400">Languages</div>
                        <div className="text-sm mt-1">{productData.languages}</div>
                      </div>
                      <div className="bg-navy-700/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400">Last Updated</div>
                        <div className="text-sm mt-1">{new Date(parseInt(productData.misc.last_modified_t) * 1000).toLocaleDateString()}</div>
                      </div>
                      <div className="bg-navy-700/50 rounded-lg p-3">
                        <div className="text-sm text-gray-400">Data Quality</div>
                        <div className="text-sm mt-1">{productData.quality_info.completeness}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scores Section */}
              <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold mb-4">Product Scores</h3>
                <div className="space-y-6">
                  {/* Nutri-Score */}
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Nutri-Score</div>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold ${
                        productData.nutriscore.grade.toUpperCase() === 'A' ? 'bg-green-500/20 text-green-500' :
                        productData.nutriscore.grade.toUpperCase() === 'B' ? 'bg-green-300/20 text-green-300' :
                        productData.nutriscore.grade.toUpperCase() === 'C' ? 'bg-yellow-500/20 text-yellow-500' :
                        productData.nutriscore.grade.toUpperCase() === 'D' ? 'bg-orange-500/20 text-orange-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {productData.nutriscore.grade.toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Nutritional Score</div>
                        <div className="text-gray-400">Score: {productData.nutriscore.score}</div>
                      </div>
                    </div>
                  </div>

                  {/* Eco-Score */}
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Eco-Score</div>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold ${
                        productData.eco_data.ecoscore_grade.toUpperCase() === 'A' ? 'bg-green-500/20 text-green-500' :
                        productData.eco_data.ecoscore_grade.toUpperCase() === 'B' ? 'bg-green-300/20 text-green-300' :
                        productData.eco_data.ecoscore_grade.toUpperCase() === 'C' ? 'bg-yellow-500/20 text-yellow-500' :
                        productData.eco_data.ecoscore_grade.toUpperCase() === 'D' ? 'bg-orange-500/20 text-orange-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {productData.eco_data.ecoscore_grade.toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Environmental Impact</div>
                        <div className="text-gray-400">Eco-friendly score</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutritional Information */}
              <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold mb-4">Nutritional Information</h3>
                <div className="space-y-4">
                  {Object.entries(productData.nutrition).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</div>
                      <div className="font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrient Levels */}
              <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold mb-4">Nutrient Levels</h3>
                <div className="space-y-4">
                  {Object.entries(productData.nutrient_levels).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</div>
                      <div className={`px-2 py-1 rounded-lg text-sm ${
                        value === 'low' ? 'bg-green-500/20 text-green-500' :
                        value === 'moderate' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients and Allergens */}
              <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold mb-4">Ingredients & Allergens</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Ingredients</div>
                    <p className="text-sm">{productData.ingredients}</p>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Allergens</div>
                    <p className="text-sm">{productData.allergens}</p>
                  </div>
                </div>
              </div>

              {/* Product States */}
              <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold mb-4">Product States</h3>
                <div className="flex flex-wrap gap-2">
                  {productData.product_states.states.length > 0 ? (
                    productData.product_states.states.map((state, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-navy-700/50 rounded-lg text-sm text-gray-400"
                      >
                        {state}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No states available</span>
                  )}
                </div>
              </div>

              {/* Data Quality */}
              <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold mb-4">Data Quality</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Quality Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {productData.eco_data.data_quality_tags.length > 0 ? (
                        productData.eco_data.data_quality_tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-navy-700/50 rounded-lg text-sm text-gray-400"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No quality tags available</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Contributors</div>
                    <div className="text-sm">
                      {productData.data_quality.editors_tags.length} editors
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Information */}
              <div className="bg-navy-800/50 backdrop-blur-xl rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold mb-4">Purchase Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Available at</div>
                    <div className="flex flex-wrap gap-2">
                      {productData.localization.stores.length > 0 ? (
                        productData.localization.stores.map((store, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-navy-700/50 rounded-lg text-sm text-gray-400"
                          >
                            {store}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No store information available</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Purchase Places</div>
                    <div className="flex flex-wrap gap-2">
                      {productData.localization.purchase_places.length > 0 ? (
                        productData.localization.purchase_places.map((place, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-navy-700/50 rounded-lg text-sm text-gray-400"
                          >
                            {place}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No purchase places available</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OpenFoodFactsPage 