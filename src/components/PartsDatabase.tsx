import React, { useState, useEffect } from 'react';
import { PartItem } from '../types';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Weight,
  Layers,
  ArrowRight,
  Info,
  X,
  ExternalLink
} from 'lucide-react';

interface PartsDatabaseProps {
  onSelectPartForBuild?: (part: PartItem) => void;
}

export const PartsDatabase: React.FC<PartsDatabaseProps> = ({ onSelectPartForBuild }) => {
  const [parts, setParts] = useState<PartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalPart, setActiveModalPart] = useState<PartItem | null>(null);

  const categories = [
    'All',
    'Exhaust',
    'Vinyl Wrap',
    'Aero & Carbon',
    'Wheels & Rims',
    'Tuning & ECU',
    'Lighting & Electrical',
    'Brakes & Suspension',
  ];

  useEffect(() => {
    fetchParts();
  }, [selectedCategory]);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory === 'All'
          ? `/api/parts`
          : `/api/parts?category=${encodeURIComponent(selectedCategory)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setParts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch parts database:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = parts.filter((part) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      part.name.toLowerCase().includes(q) ||
      part.category.toLowerCase().includes(q) ||
      part.sku.toLowerCase().includes(q) ||
      part.description.toLowerCase().includes(q)
    );
  });

  return (
    <section id="parts" className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            Performance & Styling Database
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-['Rajdhani'] uppercase">
            Parts & Hardware <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">Inventory</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-xl mt-1">
            Engineered aerospace dry carbon, valved titanium exhausts, forged monoblock wheelsets, and race-grade engine management.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search part, SKU, or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-lime-500 text-neutral-950 font-bold shadow-[0_0_15px_rgba(132,204,22,0.3)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Parts Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-2 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-mono text-neutral-400">Querying parts catalog index...</p>
        </div>
      ) : filteredParts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800">
          <AlertTriangle className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
          <p className="text-base font-bold text-neutral-300">No matching performance parts found</p>
          <p className="text-xs text-neutral-400 mt-1">Try another search keyword or reset the category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredParts.map((part) => (
            <div
              key={part.id}
              className="group rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-lime-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_0_25px_rgba(132,204,22,0.15)]"
            >
              <div>
                {/* Part Image */}
                <div className="relative h-48 overflow-hidden bg-neutral-950">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90" />

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md text-cyan-400 border border-neutral-800">
                    {part.category}
                  </span>

                  {/* Stock Status */}
                  <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    In Stock
                  </span>

                  {/* Performance gain tags */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    {part.hpGain && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-lime-500 text-neutral-950 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {part.hpGain}
                      </span>
                    )}
                    {part.weightReduction && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500 text-neutral-950 flex items-center gap-1">
                        <Weight className="w-3 h-3" />
                        {part.weightReduction}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                    <span>SKU: {part.sku}</span>
                    <span>★ {part.rating} ({part.reviewsCount})</span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-lime-400 transition-colors line-clamp-1">
                    {part.name}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5">
                    {part.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions & Price */}
              <div className="p-4 pt-0 border-t border-neutral-800/80 mt-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-base font-bold text-white font-mono">
                    ₹{part.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setActiveModalPart(part)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    Specs
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (onSelectPartForBuild) onSelectPartForBuild(part);
                    setActiveModalPart(part);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-200 bg-neutral-800 hover:bg-lime-500 hover:text-neutral-950 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Configure In Workshop
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Part Inspection Specs Modal */}
      {activeModalPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl overflow-hidden">
            <button
              onClick={() => setActiveModalPart(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
              {activeModalPart.category} • SKU: {activeModalPart.sku}
            </span>
            <h3 className="text-xl font-bold text-white mb-2">{activeModalPart.name}</h3>
            <p className="text-xs text-neutral-400 mb-4">{activeModalPart.description}</p>

            {/* Specs Grid */}
            <div className="space-y-2 mb-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider block">
                Technical Specifications
              </span>
              {Object.entries(activeModalPart.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">{key}:</span>
                  <span className="text-neutral-200 font-mono font-medium">{val}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Retail Price</span>
                <span className="text-xl font-mono font-bold text-lime-400">₹{activeModalPart.price.toLocaleString()}</span>
              </div>
              <button
                onClick={() => {
                  setActiveModalPart(null);
                  const el = document.getElementById('booking');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-neutral-950 bg-lime-400 hover:bg-lime-300 transition-colors"
              >
                Book Installation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
