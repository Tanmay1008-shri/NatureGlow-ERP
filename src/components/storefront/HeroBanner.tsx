import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Recycle, Award } from 'lucide-react';

interface HeroBannerProps {
  onExploreProduct: () => void;
  onExploreCoir: () => void;
  onGoToERP: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreProduct,
  onExploreCoir,
  onGoToERP
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-zinc-900 text-white py-16 sm:py-24 border-b border-emerald-800/40">
      {/* Background ambient circular gradients */}
      <div className="absolute top-0 right-1/4 -mt-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-12 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Mission & Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Next-Gen Circular Skincare Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
              Where Farm Waste Becomes <span className="text-emerald-400 underline decoration-amber-400/60 decoration-wavy decoration-2">Pure Skin Radiance</span>.
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl font-light leading-relaxed">
              NatureGlow upcycles discarded agricultural by-products—micronized coconut husk coir, wild papaya leaf enzymes, and ethically harvested honey—into clinically effective, microplastic-free exfoliants. Powered by a real-time enterprise ERP infrastructure engineered for scalable growth.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onExploreProduct}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Shop Flagship Scrub ($28)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCoir}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-200 font-semibold text-sm transition-all cursor-pointer"
              >
                <Recycle className="w-4 h-4 text-emerald-400" />
                <span>The Coir Innovation</span>
              </button>

              <button
                onClick={onGoToERP}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-semibold text-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Launch ERP Portal (8 Modules)</span>
              </button>
            </div>

            {/* Credibility badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-emerald-800/50">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">0% Microplastics</div>
                  <div className="text-[11px] text-emerald-300/70">100% Bio-compostable</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Recycle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">42g Waste Diverted</div>
                  <div className="text-[11px] text-emerald-300/70">Rescued per glass jar</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Scalable ERP</div>
                  <div className="text-[11px] text-emerald-300/70">8 Business modules</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Product Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-emerald-900/60 to-zinc-800/80 border border-emerald-500/30 p-4 shadow-2xl backdrop-blur-sm">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
                  alt="NatureGlow 2-in-1 Papaya Leaf Coconut Coir Honey Face Scrub"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                {/* Live Badge */}
                <div className="absolute top-3 left-3 bg-emerald-500/90 text-zinc-950 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping mr-1" />
                  <span>Live Flagship Proof-of-Concept</span>
                </div>

                {/* Overlaid quick details */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <h3 className="text-lg font-bold font-serif text-white">
                    2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-xs text-emerald-200">
                    <span>100ml / 3.4 fl oz UV Amber Glass</span>
                    <span className="font-bold text-amber-300 text-sm">$28.00 USD</span>
                  </div>
                </div>
              </div>

              {/* Formulation Key Callouts */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-xl p-2.5">
                  <div className="text-emerald-400 font-semibold flex items-center space-x-1">
                    <span>🥥 Micronized Coir</span>
                  </div>
                  <div className="text-emerald-200/80 text-[11px] mt-0.5">Spherical micro-scrub (60µm) eliminates skin micro-tears</div>
                </div>
                <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-xl p-2.5">
                  <div className="text-emerald-400 font-semibold flex items-center space-x-1">
                    <span>🌿 Papain & Honey</span>
                  </div>
                  <div className="text-emerald-200/80 text-[11px] mt-0.5">Enzymatic dead cell breakdown & deep barrier hydration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
