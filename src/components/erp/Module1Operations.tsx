import React from 'react';
import {
  DollarSign,
  PackageCheck,
  FlaskConical,
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
  PieChart as PieIcon,
  RefreshCw,
  Clock
} from 'lucide-react';
import { Product, Order, RawMaterial, RNDProject, WasteCollectionLog, Batch } from '../../types';

interface Module1Props {
  products: Product[];
  orders: Order[];
  materials: RawMaterial[];
  rndProjects: RNDProject[];
  wasteLogs: WasteCollectionLog[];
  batches: Batch[];
  onNavigateToModule: (moduleIdx: number) => void;
  onSimulateOrder: () => void;
  onSimulateDelivery: () => void;
}

export const Module1Operations: React.FC<Module1Props> = ({
  products,
  orders,
  materials,
  rndProjects,
  wasteLogs,
  batches,
  onNavigateToModule,
  onSimulateOrder,
  onSimulateDelivery
}) => {
  // Financial & Operational Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered').length;
  const activeRNDCount = rndProjects.length;
  
  // Low stock warning (stock <= minimum_safety_stock)
  const lowStockMaterials = materials.filter(
    (m) => m.current_stock <= m.minimum_safety_stock
  );

  const pendingBatches = batches.filter(
    (b) => b.status === 'Pending Safety Clearance' || b.status === 'Production'
  );

  // SKU Distribution Calculation
  const flagshipProduct = products.find((p) => p.id === 'prod-001');
  const flagshipSalesEst = orders.reduce((sum, o) => {
    const item = o.items.find((i) => i.product_id === 'prod-001');
    return sum + (item ? item.quantity * item.price : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Module Title & Live Simulator Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              ERP Module 1
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Live Operations Sync
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
            Enterprise Operations Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Real-time multi-product telemetry, executive KPI cards, and cross-departmental throughput.
          </p>
        </div>

        {/* Quick Simulator Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSimulateOrder}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Customer Order</span>
          </button>
          <button
            onClick={onSimulateDelivery}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Harvest Intake</span>
          </button>
        </div>
      </div>

      {/* 4 High-Level Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Total Gross Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% MoM (Flagship Scrub)</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateToModule(5)}
            className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline mt-3 text-left"
          >
            Open Financials & Margin Engine →
          </button>
        </div>

        {/* Fulfilling Orders */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Active Pipeline Orders
            </span>
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {activeOrdersCount} in Fulfillment
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {orders.length} total customer orders on ledger
            </div>
          </div>
          <button
            onClick={() => onNavigateToModule(4)}
            className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 hover:underline mt-3 text-left"
          >
            Review Fulfillment Stages →
          </button>
        </div>

        {/* Active R&D Projects */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Active R&D Pipelines
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {activeRNDCount} Product Tracks
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
              Charcoal, Coffee & Mango Balm
            </div>
          </div>
          <button
            onClick={() => onNavigateToModule(5)}
            className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline mt-3 text-left"
          >
            View R&D Budget Allocations →
          </button>
        </div>

        {/* Low Stock Warnings */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Inventory Safety Alerts
            </span>
            <div className={`p-2 rounded-xl ${
              lowStockMaterials.length > 0
                ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 animate-pulse'
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {lowStockMaterials.length} {lowStockMaterials.length === 1 ? 'Alert' : 'Alerts'}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {lowStockMaterials.length > 0
                ? `${lowStockMaterials.map(m => m.name.split(' ')[0]).join(', ')} below safety stock`
                : 'All materials within safe buffer'}
            </div>
          </div>
          <button
            onClick={() => onNavigateToModule(2)}
            className="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline mt-3 text-left"
          >
            Audit Stock Matrix & Restock →
          </button>
        </div>
      </div>

      {/* Visual SKU Revenue Distribution & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Revenue & R&D Readiness Matrix */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white flex items-center space-x-2">
                <PieIcon className="w-4 h-4 text-emerald-500" />
                <span>Multi-Product Revenue & Commercial Readiness</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Live commercial yield vs development stage across catalog SKUs.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">Total Catalog: 4 SKUs</span>
          </div>

          <div className="space-y-4 pt-2">
            {products.map((prod) => {
              const isLive = prod.status === 'Active';
              const percentage = isLive ? 100 : prod.id === 'prod-002' ? 78 : prod.id === 'prod-003' ? 46 : 25;
              const color = isLive
                ? 'bg-emerald-500'
                : prod.id === 'prod-002'
                ? 'bg-amber-500'
                : prod.id === 'prod-003'
                ? 'bg-teal-500'
                : 'bg-indigo-500';

              return (
                <div key={prod.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1.5">
                      <span>{prod.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isLive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {prod.sku}
                      </span>
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {isLive ? `$${flagshipSalesEst.toFixed(2)} (100% Commercial)` : `${percentage}% R&D Readiness`}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between">
            <div className="text-xs text-zinc-600 dark:text-zinc-300">
              <span className="font-bold text-zinc-900 dark:text-white">Flagship Unit Contribution:</span> $21.85 gross profit per $28.00 jar (78.0% Gross Margin).
            </div>
            <button
              onClick={() => onNavigateToModule(3)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0"
            >
              Run Batch Production
            </button>
          </div>
        </div>

        {/* Right: Operational Activity & Batch Queue */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-teal-500" />
                <span>Production & Safety Holds</span>
              </h3>
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                {pendingBatches.length} Under Review
              </span>
            </div>

            <div className="space-y-3">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">
                      {batch.batch_number}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase ${
                      batch.status === 'Released'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : batch.status === 'Pending Safety Clearance'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                    }`}>
                      {batch.status}
                    </span>
                  </div>

                  <div className="text-zinc-600 dark:text-zinc-400 flex justify-between">
                    <span>Batch Volume: {batch.quantity_produced} units</span>
                    <span>Created: {batch.created_at}</span>
                  </div>

                  <div className="text-[11px] text-zinc-500 line-clamp-1 italic">
                    "{batch.safety_check_notes}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToModule(3)}
            className="w-full mt-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs text-center transition-colors"
          >
            Manage Production & QA Clearances →
          </button>
        </div>
      </div>
    </div>
  );
};
