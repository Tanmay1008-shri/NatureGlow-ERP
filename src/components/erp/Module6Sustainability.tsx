import React, { useState } from 'react';
import {
  Recycle,
  Leaf,
  Droplets,
  Trees,
  Plus,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { WasteCollectionLog, Order } from '../../types';
import { calculateSustainabilityScore } from '../../utils/businessLogic';

interface Module6Props {
  wasteLogs: WasteCollectionLog[];
  orders: Order[];
  onAddWasteLog: (log: WasteCollectionLog) => void;
}

export const Module6Sustainability: React.FC<Module6Props> = ({
  wasteLogs,
  orders,
  onAddWasteLog
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [wasteType, setWasteType] = useState('Coconut Husk Fiber Surplus');
  const [sourceCoop, setSourceCoop] = useState('GreenCoast Coastal Coconut Co-op');
  const [location, setLocation] = useState('Kerala Maritime Belt');
  const [quantityKg, setQuantityKg] = useState<number>(300);

  // Total jars sold across all orders
  const unitsSold = orders.reduce((sum, o) => {
    return sum + o.items.reduce((acc, it) => acc + it.quantity, 0);
  }, 0);

  // Decoupled pure logic calculation
  const metrics = calculateSustainabilityScore(wasteLogs, unitsSold);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityKg <= 0) return;

    const newLog: WasteCollectionLog = {
      id: `wlog-${Date.now()}`,
      waste_type: wasteType,
      source_coop: sourceCoop,
      location,
      quantity_kg: quantityKg,
      collected_at: new Date().toISOString().split('T')[0],
      co2_offset_kg: Math.round(quantityKg * 2.35),
      processing_yield_pct: 78
    };

    onAddWasteLog(newLog);
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Enterprise ERP
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Circularity Index: {metrics.circularEconomyIndex}/100
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
            Circular Economy & Sustainability Logistics
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Audit agricultural waste salvage logs, smallholder farm partners, and carbon avoidance telemetry.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Agro-Waste Harvest</span>
        </button>
      </div>

      {/* Brand Environmental Savings Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Agri-Waste Salvaged
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-3">
            {metrics.totalWasteUpcycledKg.toLocaleString()} kg
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            Diverted from open crop burning
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Microplastic Beads Replaced
            </span>
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-3">
            {metrics.microplasticBeadsReplacedEst.toLocaleString()}
          </div>
          <div className="text-xs text-teal-600 font-semibold mt-1">
            Replaced with 60µm coir particles
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Net Carbon Offset
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600">
              <Trees className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-3">
            {metrics.totalCO2OffsetKg.toLocaleString()} kg CO2e
          </div>
          <div className="text-xs text-amber-600 font-semibold mt-1">
            Lifecycle LCA audited
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Circularity Index
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-3">
            {metrics.circularEconomyIndex} / 100
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            Top 1% Tier in Sustainable Cosmetics
          </div>
        </div>
      </div>

      {/* Raw Waste Collection Matrix */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-white">
              Farm & Cafe Waste Stream Collection Ledger
            </h3>
          </div>
          <span className="text-xs text-zinc-500">{wasteLogs.length} Verified Harvest Batches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="p-3">Waste Feedstock Stream</th>
                <th className="p-3">Agricultural Partner</th>
                <th className="p-3">Geographic Hub</th>
                <th className="p-3">Collected (kg)</th>
                <th className="p-3">Processing Yield</th>
                <th className="p-3">CO2e Offset</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
              {wasteLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="p-3 font-bold text-zinc-900 dark:text-white">
                    {log.waste_type}
                  </td>
                  <td className="p-3 font-medium text-emerald-700 dark:text-emerald-400">
                    {log.source_coop}
                  </td>
                  <td className="p-3 text-zinc-500">
                    {log.location}
                  </td>
                  <td className="p-3 font-mono font-bold">
                    {log.quantity_kg.toLocaleString()} kg
                  </td>
                  <td className="p-3 font-mono">
                    {log.processing_yield_pct}%
                  </td>
                  <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    +{log.co2_offset_kg.toLocaleString()} kg
                  </td>
                  <td className="p-3 text-zinc-400">
                    {log.collected_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Agro Waste Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white mb-1">
              Log Raw Agricultural Waste Harvest
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Enter intake from smallholder farming cooperative or cafe partners.
            </p>

            <form onSubmit={handleCreateLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Waste Feedstock
                </label>
                <select
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                >
                  <option value="Coconut Husk Fiber Surplus">Coconut Husk Fiber Surplus</option>
                  <option value="Papaya Leaf Pruning Waste">Papaya Leaf Pruning Waste</option>
                  <option value="Spent Specialty Coffee Grounds">Spent Specialty Coffee Grounds</option>
                  <option value="Mango Cannery Kernel Stones">Mango Cannery Kernel Stones</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Cooperative / Partner
                </label>
                <input
                  type="text"
                  required
                  value={sourceCoop}
                  onChange={(e) => setSourceCoop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Geographic Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Salvaged Mass (kg)
                </label>
                <input
                  type="number"
                  min="10"
                  required
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
