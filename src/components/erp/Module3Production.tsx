import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Layers,
  Sparkles,
  ClipboardList,
  ChevronRight
} from 'lucide-react';
import { Product, RawMaterial, FormulationRecipeItem, Batch, UserRole } from '../../types';
import { calculateBatchRequirements } from '../../utils/businessLogic';

interface Module3Props {
  products: Product[];
  materials: RawMaterial[];
  recipes: FormulationRecipeItem[];
  batches: Batch[];
  userRole: UserRole;
  onExecuteBatch: (productId: string, batchSize: number, notes: string) => void;
  onReleaseBatch: (batchId: string) => void;
}

export const Module3Production: React.FC<Module3Props> = ({
  products,
  materials,
  recipes,
  batches,
  userRole,
  onExecuteBatch,
  onReleaseBatch
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'prod-001');
  const [targetVolume, setTargetVolume] = useState<number>(150);
  const [customNotes, setCustomNotes] = useState<string>('Standard commercial run with batch traceability');
  const [executionSuccess, setExecutionSuccess] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const productRecipe = recipes.filter((r) => r.product_id === selectedProductId);

  // Calculate dynamic requirements using our decoupled pure logic!
  const requirements = calculateBatchRequirements(productRecipe, targetVolume, materials);

  const handleRunBatch = () => {
    if (!requirements.canProduce) return;
    if (userRole === 'customer') {
      alert('Role Restriction: Customers do not have permission to execute production runs.');
      return;
    }

    onExecuteBatch(selectedProductId, targetVolume, customNotes);
    setExecutionSuccess(`Batch for ${targetVolume} units of "${selectedProduct.name}" queued into "Pending Safety Clearance"!`);
    setTimeout(() => setExecutionSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              ERP Module 3
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Formulation Engine
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
            Production & Formulation Recipe Manager
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Dynamic recipe scaling, automated raw ingredient stock validation, and batch release lifecycle.
          </p>
        </div>
      </div>

      {executionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{executionSuccess}</span>
        </div>
      )}

      {/* Production Formulation Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Selector & Batch Parameters */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-emerald-600">
            <FlaskConical className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white">
              1. Select Product & Target Yield
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Active or Pipeline Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-medium"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) - Status: {p.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Target Batch Volume (Units)
              </label>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {targetVolume} units
              </span>
            </div>
            <input
              type="number"
              min="1"
              max="2000"
              value={targetVolume}
              onChange={(e) => setTargetVolume(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Batch Quality Protocol Notes
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
            />
          </div>

          {/* Feasibility Alert */}
          <div className={`p-4 rounded-xl border text-xs ${
            requirements.canProduce
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold mb-1">
              {requirements.canProduce ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span>
                {requirements.canProduce ? 'Raw Materials Sufficient' : 'Inventory Deficit Detected'}
              </span>
            </div>
            <p className="text-[11px] opacity-90">
              {requirements.canProduce
                ? `Current inventory can support up to ${requirements.maxPossibleUnits} units of this formulation.`
                : `Maximum possible units with current stock: ${requirements.maxPossibleUnits} units. Please restock deficient materials.`}
            </p>
          </div>

          {/* Execute Batch Button */}
          <button
            onClick={handleRunBatch}
            disabled={!requirements.canProduce}
            className={`w-full py-3 rounded-xl flex items-center justify-center space-x-2 font-bold text-xs shadow-md transition-all ${
              requirements.canProduce
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Execute Batch Production Run ({targetVolume} Units)</span>
          </button>
        </div>

        {/* Right: Dynamic Material Breakdown Matrix */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white">
                2. Formulation Ingredients Scaling Matrix
              </h3>
            </div>
            <span className="text-xs text-zinc-400">
              Formula: {productRecipe.length} ingredient lines
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="p-3">Ingredient / Packaging</th>
                  <th className="p-3">Per Unit</th>
                  <th className="p-3">Required ({targetVolume} units)</th>
                  <th className="p-3">Available Stock</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                {requirements.materialsRequired.map((mat) => (
                  <tr key={mat.materialId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-semibold text-zinc-900 dark:text-white">
                      {mat.materialName}
                    </td>
                    <td className="p-3 font-mono text-zinc-500">
                      {productRecipe.find(r => r.raw_material_id === mat.materialId)?.required_amount_per_unit} {mat.unit}
                    </td>
                    <td className="p-3 font-mono font-bold text-zinc-900 dark:text-white">
                      {mat.requiredAmount.toLocaleString()} {mat.unit}
                    </td>
                    <td className="p-3 font-mono text-zinc-600 dark:text-zinc-300">
                      {mat.availableStock.toLocaleString()} {mat.unit}
                    </td>
                    <td className="p-3">
                      {mat.isSufficient ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>OK</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>-{mat.deficit} {mat.unit}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Batch Lifecycle & QA Clearance Queue */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white">
              Batch Clearance Lifecycle & Lab Release Queue
            </h3>
          </div>
          <span className="text-xs text-zinc-400">
            {batches.length} Production Batches Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="p-3">Batch Lot Number</th>
                <th className="p-3">Product Line</th>
                <th className="p-3">Volume</th>
                <th className="p-3">Status</th>
                <th className="p-3">Safety & Challenge Notes</th>
                <th className="p-3">QA Officer</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
              {batches.map((batch) => {
                const prod = products.find((p) => p.id === batch.product_id);
                const isPendingQA = batch.status === 'Pending Safety Clearance' || batch.status === 'QA';

                return (
                  <tr key={batch.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {batch.batch_number}
                    </td>
                    <td className="p-3 font-medium text-zinc-900 dark:text-white">
                      {prod ? prod.name : batch.product_id}
                    </td>
                    <td className="p-3 font-mono font-bold">
                      {batch.quantity_produced} units
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        batch.status === 'Released'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : batch.status === 'Pending Safety Clearance'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                          : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400 max-w-xs truncate" title={batch.safety_check_notes}>
                      {batch.safety_check_notes}
                    </td>
                    <td className="p-3 text-zinc-500">
                      {batch.tested_by || 'Awaiting Lab Tech Assignment'}
                    </td>
                    <td className="p-3">
                      {isPendingQA ? (
                        <button
                          onClick={() => onReleaseBatch(batch.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          Approve QA Release
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Released</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
