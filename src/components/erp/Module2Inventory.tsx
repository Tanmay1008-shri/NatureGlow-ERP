import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  PackagePlus,
  Truck,
  Leaf,
  Layers,
  Sparkles
} from 'lucide-react';
import { RawMaterial, Product, RawMaterialCategory } from '../../types';

interface Module2Props {
  materials: RawMaterial[];
  products: Product[];
  onRestockMaterial: (materialId: string, addedStock: number) => void;
  onRestockFinishedProduct: (productId: string, addedStock: number) => void;
}

export const Module2Inventory: React.FC<Module2Props> = ({
  materials,
  products,
  onRestockMaterial,
  onRestockFinishedProduct
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'raw' | 'packaging' | 'finished'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedItemToRestock, setSelectedItemToRestock] = useState<{ id: string; name: string; type: 'material' | 'product'; unit: string } | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(500);

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.source_partner.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'raw') return m.category !== 'Packaging';
    if (activeTab === 'packaging') return m.category === 'Packaging';
    return true;
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    return activeTab === 'all' || activeTab === 'finished';
  });

  const lowStockCount = materials.filter((m) => m.current_stock <= m.minimum_safety_stock).length;

  const handleOpenRestock = (id: string, name: string, type: 'material' | 'product', unit: string) => {
    setSelectedItemToRestock({ id, name, type, unit });
    setRestockAmount(type === 'product' ? 50 : 2000);
    setRestockModalOpen(true);
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemToRestock || restockAmount <= 0) return;

    if (selectedItemToRestock.type === 'material') {
      onRestockMaterial(selectedItemToRestock.id, restockAmount);
    } else {
      onRestockFinishedProduct(selectedItemToRestock.id, restockAmount);
    }

    setRestockModalOpen(false);
    setSelectedItemToRestock(null);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              ERP Module 2
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Aggregated Stock Matrix
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
            Aggregated Inventory & Supply Chain Matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Track global raw agricultural waste feeds, bioactive botanicals, circular packaging, and finished retail SKUs.
          </p>
        </div>

        {/* Low Stock Warning Banner */}
        {lowStockCount > 0 && (
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{lowStockCount} item(s) below minimum safety reserve!</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tiered Filter Tabs */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            All Inventory
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'raw'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Raw Bio-Materials ({materials.filter(m => m.category !== 'Packaging').length})
          </button>
          <button
            onClick={() => setActiveTab('packaging')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'packaging'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Packaging Supplies ({materials.filter(m => m.category === 'Packaging').length})
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'finished'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Finished Retail SKUs ({products.length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search material or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Finished Retail Goods Section (if selected) */}
      {(activeTab === 'all' || activeTab === 'finished') && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Boxes className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-white">
                Finished Retail Goods (Commercial Warehouse Stock)
              </h3>
            </div>
            <span className="text-xs text-zinc-500">{filteredProducts.length} Product Lines</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="p-3">SKU & Product Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Retail Price</th>
                  <th className="p-3">Finished Stock</th>
                  <th className="p-3">COGS / Unit</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-semibold">
                      <div className="font-bold text-zinc-900 dark:text-white">{prod.name}</div>
                      <div className="text-[11px] font-mono text-zinc-400">{prod.sku}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase ${
                        prod.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {prod.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold">${prod.price.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`font-bold ${prod.current_stock > 50 ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {prod.current_stock} units
                      </span>
                    </td>
                    <td className="p-3 font-mono">${prod.cogs_cost.toFixed(2)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleOpenRestock(prod.id, prod.name, 'product', 'units')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold"
                      >
                        + Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Raw Ingredients & Packaging Matrix */}
      {(activeTab === 'all' || activeTab === 'raw' || activeTab === 'packaging') && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-white">
                Raw Ingredients, Agricultural Waste & Packaging Matrix
              </h3>
            </div>
            <span className="text-xs text-zinc-500">{filteredMaterials.length} Global Materials</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="p-3">Material Name & Category</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Safety Stock Buffer</th>
                  <th className="p-3">Unit Cost</th>
                  <th className="p-3">Verified Source Partner</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                {filteredMaterials.map((mat) => {
                  const isLow = mat.current_stock <= mat.minimum_safety_stock;
                  const ratio = Math.min(100, (mat.current_stock / (mat.minimum_safety_stock * 2)) * 100);

                  return (
                    <tr key={mat.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                      <td className="p-3">
                        <div className="font-bold text-zinc-900 dark:text-white">{mat.name}</div>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          mat.category === 'Upcycled Bio-Waste'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : mat.category === 'Packaging'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {mat.category}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-bold font-mono">
                          {mat.current_stock.toLocaleString()} {mat.unit}
                        </div>
                        {/* Mini bar */}
                        <div className="w-24 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </td>

                      <td className="p-3 font-mono text-zinc-500">
                        {mat.minimum_safety_stock.toLocaleString()} {mat.unit}
                      </td>

                      <td className="p-3 font-mono font-semibold">
                        ${mat.cost_per_unit.toFixed(3)} / {mat.unit}
                      </td>

                      <td className="p-3 text-zinc-600 dark:text-zinc-300 max-w-[160px] truncate">
                        {mat.source_partner}
                      </td>

                      <td className="p-3">
                        {isLow ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-md">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Reserve</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Optimal</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => handleOpenRestock(mat.id, mat.name, 'material', mat.unit)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] font-semibold"
                        >
                          + Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock Intake Modal */}
      {restockModalOpen && selectedItemToRestock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-2 text-emerald-600 mb-1">
              <Truck className="w-5 h-5" />
              <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
                Log Supplier Intake Shipment
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Receiving replenishment for: <strong>{selectedItemToRestock.name}</strong>
            </p>

            <form onSubmit={handleConfirmRestock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Quantity Received ({selectedItemToRestock.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-800 dark:text-emerald-300">
                ✓ System will increment live database inventory and update batch feasibility immediately.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
