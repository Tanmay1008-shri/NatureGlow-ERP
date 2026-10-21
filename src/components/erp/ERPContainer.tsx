import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  FlaskConical,
  PackageCheck,
  IndianRupee,
  Recycle,
  Users,
  Shield,
  AlertCircle
} from 'lucide-react';
import {
  Product,
  RawMaterial,
  FormulationRecipeItem,
  Batch,
  Order,
  RNDProject,
  WasteCollectionLog,
  Review,
  UserRole,
  OrderStatus
} from '../../types';

import { Module1Operations } from './Module1Operations';
import { Module2Inventory } from './Module2Inventory';
import { Module3Production } from './Module3Production';
import { Module4Orders } from './Module4Orders';
import { Module5Financials } from './Module5Financials';
import { Module6Sustainability } from './Module6Sustainability';
import { Module7CRM } from './Module7CRM';
import { Module8RBAC } from './Module8RBAC';

interface ERPContainerProps {
  activeModule: number;
  setActiveModule: (mod: number) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  products: Product[];
  materials: RawMaterial[];
  recipes: FormulationRecipeItem[];
  batches: Batch[];
  orders: Order[];
  rndProjects: RNDProject[];
  wasteLogs: WasteCollectionLog[];
  reviews: Review[];
  onRestockMaterial: (materialId: string, addedStock: number) => void;
  onRestockFinishedProduct: (productId: string, addedStock: number) => void;
  onExecuteBatch: (productId: string, batchSize: number, notes: string) => void;
  onReleaseBatch: (batchId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddRNDBudget: (projectId: string, additionalAmount: number) => void;
  onAddWasteLog: (log: WasteCollectionLog) => void;
  onSimulateOrder: () => void;
  onSimulateDelivery: () => void;
  onEditProduct: (product: Product) => void;
  onOpenCreateProduct: () => void;
  onDeleteProduct: (productId: string) => void;
}

export const ERPContainer: React.FC<ERPContainerProps> = ({
  activeModule,
  setActiveModule,
  userRole,
  setUserRole,
  products,
  materials,
  recipes,
  batches,
  orders,
  rndProjects,
  wasteLogs,
  reviews,
  onRestockMaterial,
  onRestockFinishedProduct,
  onExecuteBatch,
  onReleaseBatch,
  onUpdateOrderStatus,
  onAddRNDBudget,
  onAddWasteLog,
  onSimulateOrder,
  onSimulateDelivery,
  onEditProduct,
  onOpenCreateProduct,
  onDeleteProduct
}) => {
  const modules = [
    { id: 1, name: 'Operations', subtitle: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 2, name: 'Inventory', subtitle: 'Catalog & Stock Matrix', icon: <Boxes className="w-4 h-4" /> },
    { id: 3, name: 'Production', subtitle: 'Recipe & Batches', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 4, name: 'Fulfillment', subtitle: 'Order Lifecycle', icon: <PackageCheck className="w-4 h-4" /> },
    { id: 5, name: 'Financials', subtitle: 'COGS & R&D (₹ INR)', icon: <IndianRupee className="w-4 h-4" /> },
    { id: 6, name: 'Circularity', subtitle: 'Waste Logistics', icon: <Recycle className="w-4 h-4" /> },
    { id: 7, name: 'CRM & AI', subtitle: 'Customer Sentiment', icon: <Users className="w-4 h-4" /> },
    { id: 8, name: 'Security', subtitle: 'RBAC Access Control', icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Role Reminder Notice if Customer */}
      {userRole === 'customer' && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Customer Preview Mode:</strong> You are viewing ERP data. To add/remove products, edit ₹ prices, or trigger batches, switch to <strong>Corporate Admin</strong>.
            </span>
          </div>
          <button
            onClick={() => setUserRole('admin')}
            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 ml-2"
          >
            Switch to Admin
          </button>
        </div>
      )}

      {/* 8 Modules Navigation Bar */}
      <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-x-auto">
        <div className="flex space-x-1.5 min-w-[760px]">
          {modules.map((m) => {
            const isActive = activeModule === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`flex-1 flex items-center space-x-2 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  isActive ? 'bg-emerald-700/60 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                }`}>
                  {m.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">
                    M{m.id}: {m.name}
                  </div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-zinc-400'}`}>
                    {m.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Content */}
      <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800/80 transition-colors">
        {activeModule === 1 && (
          <Module1Operations
            products={products}
            orders={orders}
            materials={materials}
            rndProjects={rndProjects}
            wasteLogs={wasteLogs}
            batches={batches}
            userRole={userRole}
            onNavigateToModule={setActiveModule}
            onSimulateOrder={onSimulateOrder}
            onSimulateDelivery={onSimulateDelivery}
            onOpenCreateProduct={onOpenCreateProduct}
          />
        )}

        {activeModule === 2 && (
          <Module2Inventory
            materials={materials}
            products={products}
            userRole={userRole}
            onRestockMaterial={onRestockMaterial}
            onRestockFinishedProduct={onRestockFinishedProduct}
            onEditProduct={onEditProduct}
            onOpenCreateProduct={onOpenCreateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        )}

        {activeModule === 3 && (
          <Module3Production
            products={products}
            materials={materials}
            recipes={recipes}
            batches={batches}
            userRole={userRole}
            onExecuteBatch={onExecuteBatch}
            onReleaseBatch={onReleaseBatch}
          />
        )}

        {activeModule === 4 && (
          <Module4Orders
            orders={orders}
            onUpdateOrderStatus={onUpdateOrderStatus}
          />
        )}

        {activeModule === 5 && (
          <Module5Financials
            products={products}
            recipes={recipes}
            materials={materials}
            rndProjects={rndProjects}
            orders={orders}
            onAddRNDBudget={onAddRNDBudget}
          />
        )}

        {activeModule === 6 && (
          <Module6Sustainability
            wasteLogs={wasteLogs}
            orders={orders}
            onAddWasteLog={onAddWasteLog}
          />
        )}

        {activeModule === 7 && (
          <Module7CRM
            reviews={reviews}
            orders={orders}
            products={products}
          />
        )}

        {activeModule === 8 && (
          <Module8RBAC
            userRole={userRole}
            setUserRole={setUserRole}
            onOpenAdminEditor={onOpenCreateProduct}
          />
        )}
      </div>
    </div>
  );
};
