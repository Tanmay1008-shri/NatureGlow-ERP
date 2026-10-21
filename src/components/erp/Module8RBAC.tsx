import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  FlaskConical,
  Lock,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';

interface Module8Props {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Module8RBAC: React.FC<Module8Props> = ({ userRole, setUserRole }) => {
  const [testActionNotice, setTestActionNotice] = useState<string | null>(null);

  const permissionsMatrix = [
    {
      feature: 'Browse Marketplace & Upcoming R&D Catalog',
      category: 'Storefront',
      admin: true,
      lab_tech: true,
      customer: true
    },
    {
      feature: 'Add to Cart & Place Live Orders',
      category: 'Storefront',
      admin: true,
      lab_tech: true,
      customer: true
    },
    {
      feature: 'View Personal Order Receipts & Invoices',
      category: 'Storefront',
      admin: true,
      lab_tech: true,
      customer: true
    },
    {
      feature: 'View Enterprise High-Level Operations (Module 1)',
      category: 'ERP Operations',
      admin: true,
      lab_tech: true,
      customer: false
    },
    {
      feature: 'Audit Raw Ingredient Matrix & Restock Shipments (Module 2)',
      category: 'Supply Chain',
      admin: true,
      lab_tech: true,
      customer: false
    },
    {
      feature: 'Execute Dynamic Batch Runs & Formulations (Module 3)',
      category: 'Laboratory',
      admin: true,
      lab_tech: true,
      customer: false
    },
    {
      feature: 'Approve Quality Assurance (QA) & Safety Release (Module 3)',
      category: 'Laboratory',
      admin: true,
      lab_tech: true,
      customer: false
    },
    {
      feature: 'Advance Order Fulfillment Status (Module 4)',
      category: 'Logistics',
      admin: true,
      lab_tech: false,
      customer: false
    },
    {
      feature: 'COGS Margin Analysis & Allocate R&D Budgets (Module 5)',
      category: 'Financials',
      admin: true,
      lab_tech: false,
      customer: false
    },
    {
      feature: 'Configure Circular Sustainability Logistics (Module 6)',
      category: 'Circularity',
      admin: true,
      lab_tech: true,
      customer: false
    },
    {
      feature: 'Access Full CRM Directory & Sentiment Insights (Module 7)',
      category: 'Executive',
      admin: true,
      lab_tech: false,
      customer: false
    }
  ];

  const testAction = (actionName: string, requiredRole: 'admin' | 'lab_tech') => {
    let allowed = false;
    if (requiredRole === 'admin' && userRole === 'admin') allowed = true;
    if (requiredRole === 'lab_tech' && (userRole === 'admin' || userRole === 'lab_tech')) allowed = true;

    if (allowed) {
      setTestActionNotice(`✓ Success: Your current role [${userRole.toUpperCase()}] is authorized for "${actionName}".`);
    } else {
      setTestActionNotice(`⚠ Access Denied: "${actionName}" requires ${requiredRole.toUpperCase()} privilege. Switch your role above to test.`);
    }

    setTimeout(() => setTestActionNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              ERP Module 8
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Role-Based Access Control
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
            System Roles & Enterprise Security Governance
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Granular privilege segregation between Corporate Administration, Laboratory Production, and Customers.
          </p>
        </div>

        {/* Current Active Role Badge */}
        <div className="flex items-center space-x-2 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <Shield className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-400">Current Session Role</div>
            <div className="text-sm font-bold text-zinc-900 dark:text-white uppercase font-mono">
              {userRole.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {testActionNotice && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center space-x-2 ${
          testActionNotice.includes('✓')
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
        }`}>
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{testActionNotice}</span>
        </div>
      )}

      {/* Role Switcher Cards for Presentation Demonstration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Admin Card */}
        <div
          onClick={() => setUserRole('admin')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            userRole === 'admin'
              ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-500 shadow-md ring-2 ring-amber-500/30'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Shield className="w-5 h-5" />
            </span>
            {userRole === 'admin' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 uppercase">
                Active
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Corporate Admin</h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Full root control across marketplace catalogs, R&D budgets, supply chains, QA release, order lifecycle, and financials.
          </p>
          <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-3">
            11 / 11 Permissions Granted
          </div>
        </div>

        {/* Lab Tech Card */}
        <div
          onClick={() => setUserRole('lab_tech')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            userRole === 'lab_tech'
              ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <FlaskConical className="w-5 h-5" />
            </span>
            {userRole === 'lab_tech' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-zinc-950 uppercase">
                Active
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Lab Tech / Production</h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Restricted to formulation recipes, raw material stock deductions, pilot batching, and microbial QA safety releases.
          </p>
          <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-3">
            7 / 11 Permissions Granted
          </div>
        </div>

        {/* Customer Card */}
        <div
          onClick={() => setUserRole('customer')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            userRole === 'customer'
              ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-500 shadow-md ring-2 ring-teal-500/30'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-teal-400'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <UserCheck className="w-5 h-5" />
            </span>
            {userRole === 'customer' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500 text-zinc-950 uppercase">
                Active
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Customer Buyer</h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Standard customer privileges: browse active/upcoming catalogs, manage cart, place orders, and review invoices.
          </p>
          <div className="text-[11px] font-bold text-teal-700 dark:text-teal-400 mt-3">
            3 / 11 Permissions Granted
          </div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-white">
              Granular Security & Privilege Matrix
            </h3>
          </div>
          <span className="text-xs text-zinc-500">11 System Endpoints</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="p-3">Feature & Capability</th>
                <th className="p-3">Domain</th>
                <th className="p-3 text-center">Admin</th>
                <th className="p-3 text-center">Lab Tech</th>
                <th className="p-3 text-center">Customer</th>
                <th className="p-3 text-right">Interactive Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="p-3 font-semibold text-zinc-900 dark:text-white">
                    {row.feature}
                  </td>
                  <td className="p-3 text-zinc-500 font-mono text-[11px]">
                    {row.category}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex justify-center text-emerald-600">
                      <Check className="w-4 h-4 font-bold" />
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {row.lab_tech ? (
                      <span className="inline-flex justify-center text-emerald-600">
                        <Check className="w-4 h-4 font-bold" />
                      </span>
                    ) : (
                      <span className="inline-flex justify-center text-zinc-300 dark:text-zinc-700">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {row.customer ? (
                      <span className="inline-flex justify-center text-emerald-600">
                        <Check className="w-4 h-4 font-bold" />
                      </span>
                    ) : (
                      <span className="inline-flex justify-center text-zinc-300 dark:text-zinc-700">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() =>
                        testAction(
                          row.feature,
                          row.admin && !row.lab_tech ? 'admin' : 'lab_tech'
                        )
                      }
                      className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Test Privilege
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
