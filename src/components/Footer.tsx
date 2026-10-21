import React from 'react';
import { Sparkles, Recycle, ShieldCheck, Heart, Leaf } from 'lucide-react';

interface FooterProps {
  onGoToStore: () => void;
  onGoToERP: (mod: number) => void;
}

export const Footer: React.FC<FooterProps> = ({ onGoToStore, onGoToERP }) => {
  return (
    <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-white">NatureGlow</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Pioneering circular skincare by transforming smallholder agricultural by-products into dermatologically gentle, clinical-grade exfoliants and barrier treatments.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
              <Recycle className="w-3.5 h-3.5" />
              <span>Certified Closed-Loop Circular Brand</span>
            </div>
          </div>

          {/* Catalog Navigation */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Commercial & R&D Catalog
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onGoToStore} className="hover:text-emerald-400 transition-colors">
                  Flagship Papaya & Coir Scrub
                </button>
              </li>
              <li>
                <button onClick={onGoToStore} className="hover:text-emerald-400 transition-colors">
                  Charcoal & Aloe Detox Cleanser (R&D)
                </button>
              </li>
              <li>
                <button onClick={onGoToStore} className="hover:text-emerald-400 transition-colors">
                  Spent Coffee Grounds Eye Cream (R&D)
                </button>
              </li>
              <li>
                <button onClick={onGoToStore} className="hover:text-emerald-400 transition-colors">
                  Mango Stone Night Balm (Concept)
                </button>
              </li>
            </ul>
          </div>

          {/* ERP Infrastructure Modules */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Enterprise ERP Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onGoToERP(1)} className="hover:text-emerald-400 transition-colors">
                  Module 1: Operations Telemetry
                </button>
              </li>
              <li>
                <button onClick={() => onGoToERP(2)} className="hover:text-emerald-400 transition-colors">
                  Module 2: Aggregated Inventory Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onGoToERP(3)} className="hover:text-emerald-400 transition-colors">
                  Module 3: Recipe & Batch Engine
                </button>
              </li>
              <li>
                <button onClick={() => onGoToERP(4)} className="hover:text-emerald-400 transition-colors">
                  Module 4: Fulfillment Logistics
                </button>
              </li>
              <li>
                <button onClick={() => onGoToERP(5)} className="hover:text-emerald-400 transition-colors">
                  Module 5: COGS & R&D Financials
                </button>
              </li>
              <li>
                <button onClick={() => onGoToERP(6)} className="hover:text-emerald-400 transition-colors">
                  Module 6: Circular Sustainability
                </button>
              </li>
              <li>
                <button onClick={() => onGoToERP(7)} className="hover:text-emerald-400 transition-colors">
                  Module 7: CRM & AI Sentiment
                </button>
              </li>
              <li>
                <button onClick={() => onGoToERP(8)} className="hover:text-emerald-400 transition-colors">
                  Module 8: RBAC Security
                </button>
              </li>
            </ul>
          </div>

          {/* Environmental Commitments */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Ethical Architecture
            </h4>
            <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 space-y-1.5 text-[11px]">
              <div className="text-emerald-400 font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Microplastic-Free Standard</span>
              </div>
              <p className="text-zinc-400">
                Guaranteed zero polyethylene or synthetic polymer microbeads in any current or pipeline product formula.
              </p>
            </div>
            <div className="text-[11px] text-zinc-500">
              Fair-trade sourcing partnerships with coastal coconut and papaya farmers.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-zinc-500 gap-4">
          <p>© 2026 NatureGlow Enterprises Inc. Scalable Circular Skincare Business Architecture.</p>
          <div className="flex items-center space-x-4">
            <span>ISO 22716 GMP Certified</span>
            <span>•</span>
            <span>Cruelty-Free</span>
            <span>•</span>
            <span>Zero Plastic Oceans</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
