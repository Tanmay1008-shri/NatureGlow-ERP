import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  FlaskConical,
  Plus,
  Layers,
  PieChart,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Product, FormulationRecipeItem, RawMaterial, RNDProject, Order } from '../../types';
import { calculateCOGS } from '../../utils/businessLogic';

interface Module5Props {
  products: Product[];
  recipes: FormulationRecipeItem[];
  materials: RawMaterial[];
  rndProjects: RNDProject[];
  orders: Order[];
  onAddRNDBudget: (projectId: string, additionalAmount: number) => void;
}

export const Module5Financials: React.FC<Module5Props> = ({
  products,
  recipes,
  materials,
  rndProjects,
  orders,
  onAddRNDBudget
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-001');
  const [laborCost, setLaborCost] = useState<number>(2.20);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [selectedRNDId, setSelectedRNDId] = useState<string>(rndProjects[0]?.id || '');
  const [additionalBudget, setAdditionalBudget] = useState<number>(5000);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const productRecipe = recipes.filter((r) => r.product_id === selectedProductId);

  // Dynamic COGS calculation
  const cogsBreakdown = calculateCOGS(
    productRecipe,
    materials,
    selectedProduct.price,
    laborCost
  );

  const totalCommercialRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalRNDAllocated = rndProjects.reduce((sum, p) => sum + p.allocated_budget, 0);
  const totalRNDSpent = rndProjects.reduce((sum, p) => sum + p.spent_budget, 0);

  const handleAllocateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRNDId || additionalBudget <= 0) return;
    onAddRNDBudget(selectedRNDId, additionalBudget);
    setBudgetModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              ERP Module 5
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Unit Economics & R&D
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
            Scalable Financials & COGS Margin Analysis
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Cost-of-Goods-Sold engine, contribution margin modeling, and multi-product R&D capital expenditure.
          </p>
        </div>

        <button
          onClick={() => setBudgetModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Allocate R&D Capital</span>
        </button>
      </div>

      {/* Top Level Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Flagship Gross Margin
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {cogsBreakdown.grossMarginPct}%
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            Retail ${cogsBreakdown.retailPrice.toFixed(2)} vs COGS ${cogsBreakdown.totalCOGS.toFixed(2)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Total R&D Investment
          </span>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            ${totalRNDSpent.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            Out of ${totalRNDAllocated.toLocaleString()} allocated across 3 pipeline tracks
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Gross Commercial Revenue
          </span>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2">
            ${totalCommercialRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            100% self-funded pipeline growth
          </div>
        </div>
      </div>

      {/* COGS Breakdown Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Selector & Variable Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-emerald-600">
            <DollarSign className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white">
              COGS Unit Cost Calculator
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Select Product SKU
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Labor & Cleanroom Facility Cost / Unit
              </label>
              <span className="text-xs font-bold text-emerald-600 font-mono">
                ${laborCost.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="1.00"
              max="6.00"
              step="0.10"
              value={laborCost}
              onChange={(e) => setLaborCost(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Raw Bio-Ingredients:</span>
              <span className="font-mono font-bold">${cogsBreakdown.rawIngredientsCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Circular Packaging (Glass/Lid):</span>
              <span className="font-mono font-bold">${cogsBreakdown.packagingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Labor & Facility Overhead:</span>
              <span className="font-mono font-bold">${cogsBreakdown.laborAndFacilityCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-zinc-200 dark:border-zinc-700 pt-2 text-sm text-zinc-900 dark:text-white">
              <span>Total Unit COGS:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono">${cogsBreakdown.totalCOGS.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xs text-emerald-600">
              <span>Unit Gross Profit:</span>
              <span className="font-mono">+${cogsBreakdown.grossProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: R&D Pipeline Budget Allocations */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FlaskConical className="w-5 h-5 text-amber-500" />
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white">
                R&D Project Budget Tracking
              </h3>
            </div>
            <span className="text-xs text-zinc-400">{rndProjects.length} Pipeline Programs</span>
          </div>

          <div className="space-y-4">
            {rndProjects.map((proj) => {
              const spendRatio = Math.round((proj.spent_budget / proj.allocated_budget) * 100);

              return (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">{proj.product_name}</span>
                      <div className="text-zinc-500">{proj.code_name} • Lead: {proj.lead_scientist}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold text-[10px] uppercase">
                      {proj.stage}
                    </span>
                  </div>

                  {/* Progress bar for spend */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>Budget Spent: ${proj.spent_budget.toLocaleString()} / ${proj.allocated_budget.toLocaleString()}</span>
                      <span className="font-bold">{spendRatio}% Burn</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${spendRatio}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 italic">
                    Latest Lab Log: "{proj.latest_log}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* R&D Budget Modal */}
      {budgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white mb-1">
              Allocate Additional R&D Capital
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Expand funding for microbial challenge assays or clinical patch tests.
            </p>

            <form onSubmit={handleAllocateBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Target R&D Program
                </label>
                <select
                  value={selectedRNDId}
                  onChange={(e) => setSelectedRNDId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                >
                  {rndProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.product_name} ({p.stage})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Additional Budget Allocation ($ USD)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={additionalBudget}
                  onChange={(e) => setAdditionalBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBudgetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
