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
  Lock,
  ShieldAlert,
  LogOut
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
  OrderStatus,
  AuthUser,
  SecurityAuditEvent
} from '../../types';
import { canAccessERPModule } from '../../utils/businessLogic';

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
  currentUser: AuthUser;
  authUsers: AuthUser[];
  securityLogs: SecurityAuditEvent[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onDeleteUser: (userId: string) => void;
  onLogSecurityEvent: (action: string, status: 'ALLOWED' | 'DENIED', details: string) => void;
  onLogoutAndSwitch: () => void;
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
  currentUser,
  authUsers,
  securityLogs,
  onUpdateUserRole,
  onDeleteUser,
  onLogSecurityEvent,
  onLogoutAndSwitch,
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
  const userRole = currentUser.role;

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

  const isModuleAllowed = canAccessERPModule(currentUser, activeModule);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Authenticated Session Header Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-zinc-700 dark:text-zinc-300">
            Authenticated ERP Session: <strong>{currentUser.name}</strong> ({currentUser.email}) · Role:{' '}
            <strong className="uppercase font-mono text-emerald-700 dark:text-emerald-400">
              {currentUser.role.replace('_', ' ')}
            </strong>{' '}
            · Department: {currentUser.department}
          </span>
        </div>
        <button
          onClick={onLogoutAndSwitch}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs shrink-0 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Account / Sign Out</span>
        </button>
      </div>

      {/* 8 Modules Navigation Bar */}
      <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {modules.map((m) => {
            const isActive = activeModule === m.id;
            const allowed = canAccessERPModule(currentUser, m.id);

            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`flex items-center space-x-2 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer min-w-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isActive ? 'bg-emerald-700/60 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {allowed ? m.icon : <Lock className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold truncate">
                    M{m.id}: {m.name}
                  </div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-zinc-400'}`}>
                    {allowed ? m.subtitle : 'Admin Only (403)'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Content or HTTP 403 Module Restriction Gate */}
      <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800/80 transition-colors">
        {!isModuleAllowed ? (
          <div className="py-12 px-6 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              HTTP 403 Forbidden · Role Authorization Policy
            </p>
            <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
              Corporate Admin Clearance Required for Module {activeModule}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Your current session (<strong>{currentUser.name}</strong> ·{' '}
              <code className="font-mono font-bold">{currentUser.role.toUpperCase()}</code>) is authorized for
              Laboratory Production (M3), Raw Material Inventory (M2), and Circular Waste Logistics (M6), but is
              restricted from accessing executive financial margins, order dispatch, and customer CRM records.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveModule(3)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                Go to M3: Production &amp; Recipes
              </button>
              <button
                onClick={onLogoutAndSwitch}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer"
              >
                Sign Out &amp; Authenticate as Corporate Admin
              </button>
            </div>
          </div>
        ) : (
          <>
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
                currentUser={currentUser}
                authUsers={authUsers}
                securityLogs={securityLogs}
                onUpdateUserRole={onUpdateUserRole}
                onDeleteUser={onDeleteUser}
                onLogSecurityEvent={onLogSecurityEvent}
                onLogoutAndSwitch={onLogoutAndSwitch}
                onOpenAdminEditor={onOpenCreateProduct}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
