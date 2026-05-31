import React from 'react';
import { Search, Filter, Smartphone, Monitor, Headphones, Gamepad2, Tv } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

export default function Shop() {
  const { state, dispatch, getFilteredProducts } = useApp();
  const filteredProducts = getFilteredProducts();
  const [activeIdx, setActiveIdx] = React.useState(0);
  
  const heroImages = React.useMemo(() => [
    'https://images.pexels.com/photos/1447254/pexels-photo-1447254.jpeg', // premium laptop
    'https://images.pexels.com/photos/1034812/pexels-photo-1034812.jpeg', // modern smartphone
    'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg', // gaming setup
    'https://images.pexels.com/photos/343457/pexels-photo-343457.jpeg', // wireless headphones
  ], []);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {/* Hero Section */}
          <div className="rounded-2xl overflow-hidden mb-6 relative h-[32rem]">
            {heroImages.map((src, idx) => (
              <div key={src + idx} className="absolute inset-0">
                <img
                  src={src}
                  alt="Featured"
                  className={`w-full h-full object-cover transition-opacity duration-700 ${idx === activeIdx ? 'opacity-100' : 'opacity-0'}`}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent transition-opacity duration-700 ${idx === activeIdx ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-8 md:px-16 max-w-2xl">
                      <span className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-3xl font-bold mb-4">
                        Welcome to Lanka Traders
                      </span>
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        {idx === 0 && "Premium Tech for Modern Life"}
                        {idx === 1 && "Smart Devices for Everyone"}
                        {idx === 2 && "Level Up Your Gaming"}
                        {idx === 3 && "Immersive Audio Solutions"}
                      </h1>
                      <p className="text-xl text-white/90 mb-8">
                        Discover our collection of premium electronics, from cutting-edge laptops to immersive audio experiences.
                      </p>
                      <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-white/90 transition-colors">
                        Explore Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
              {heroImages.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${idx === activeIdx ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`} 
                />
              ))}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: '', label: 'All' },
              { key: 'phones', label: 'Phones', icon: <Smartphone className="h-4 w-4" /> },
              { key: 'laptops', label: 'Laptops', icon: <Monitor className="h-4 w-4" /> },
              { key: 'audio', label: 'Audio', icon: <Headphones className="h-4 w-4" /> },
              { key: 'gaming', label: 'Gaming', icon: <Gamepad2 className="h-4 w-4" /> },
              { key: 'tv', label: 'TV', icon: <Tv className="h-4 w-4" /> },
              { key: 'accessories', label: 'Accessories' },
            ].map((c) => (
              <button
                key={c.key || 'all'}
                onClick={() => dispatch({ type: 'SET_CATEGORY', payload: c.key })}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${
                  state.selectedCategory === c.key
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {c.icon}
                {c.label}
              </button>
            ))}
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={state.searchTerm}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
                />
              </div>
              
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={state.selectedCategory}
                onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="phones">Phones</option>
                <option value="laptops">Laptops</option>
                <option value="audio">Audio</option>
                <option value="gaming">Gaming</option>
                <option value="tv">TV</option>
                <option value="accessories">Accessories</option>
              </select>
              
              <div />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}