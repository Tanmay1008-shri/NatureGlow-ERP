import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  FlaskConical,
  Lock,
  Check,
  X,
  Plus,
  LogOut,
  Users,
  Activity,
  Trash2
} from 'lucide-react';
import { AuthUser, SecurityAuditEvent, UserRole } from '../../types';

interface Module8Props {
  currentUser: AuthUser;
  authUsers: AuthUser[];
  securityLogs: SecurityAuditEvent[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onDeleteUser: (userId: string) => void;
  onLogSecurityEvent: (action: string, status: 'ALLOWED' | 'DENIED', details: string) => void;
  onLogoutAndSwitch: () => void;
  onOpenAdminEditor: () => void;
}

export const Module8RBAC: React.FC<Module8Props> = ({
  currentUser,
  authUsers,
  securityLogs,
  onUpdateUserRole,
  onDeleteUser,
  onLogSecurityEvent,
  onLogoutAndSwitch,
  onOpenAdminEditor
}) => {
  const [testActionNotice, setTestActionNotice] = useState<string | null>(null);
  const userRole = currentUser.role;

  const permissionsMatrix = [
    {
      feature: 'Add, Edit, or Remove Products, Images & ₹ Prices (Store & ERP)',
      category: 'Catalog & ERP',
      admin: true,
      lab_tech: false,
      customer: false
    },
    {
      feature: 'Browse Marketplace & Upcoming R&D Catalog',
      category: 'Storefront',
      admin: true,
      lab_tech: true,
      customer: true
    },
    {
      feature: 'Add to Cart & Place Live Orders (₹ INR)',
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
      feature: 'View Enterprise High-Level Operations',
      category: 'ERP Operations',
      admin: true,
      lab_tech: true,
      customer: false
    },
    {
      feature: 'Audit Raw Ingredient Matrix & Restock Shipments',
      category: 'Supply Chain',
      admin: true,
      lab_tech: true,
      customer: false
    },
    {
      feature: 'Execute Dynamic Batch Runs & Formulations',
      category: 'Laboratory',
      admin: true,
      lab_tech: true,
      customer: false
    },
    {
      feature: 'Approve Quality Assurance (QA) & Safety Release',
      category: 'Laboratory',
      admin: true,
      lab_tech: true,
      customer: false
    },
    {
      feature: 'Advance Order Fulfillment Status',
      category: 'Logistics',
      admin: true,
      lab_tech: false,
      customer: false
    },
    {
      feature: 'COGS Margin Analysis & Allocate R&D Budgets',
      category: 'Financials',
      admin: true,
      lab_tech: false,
      customer: false
    },
    {
      feature: 'Configure Circular Sustainability Logistics',
      category: 'Circularity',
      admin: true,
      lab_tech: true,
      customer: false
    },
    {
      feature: 'Access Full CRM Directory & Sentiment Insights',
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
      const msg = `✓ Authorized: Session [${currentUser.email} • ${userRole.toUpperCase()}] verified for "${actionName}".`;
      setTestActionNotice(msg);
      onLogSecurityEvent(
        `Endpoint Verification: ${actionName}`,
        'ALLOWED',
        `Verified ${userRole.toUpperCase()} clearance for ${currentUser.name}.`
      );
    } else {
      const msg = `⚠ HTTP 403 Forbidden: "${actionName}" requires ${requiredRole.toUpperCase()} clearance. Current account (${currentUser.email}) is ${userRole.toUpperCase()}.`;
      setTestActionNotice(msg);
      onLogSecurityEvent(
        `Endpoint Verification: ${actionName}`,
        'DENIED',
        `Blocked ${userRole.toUpperCase()} (${currentUser.email}); endpoint requires ${requiredRole.toUpperCase()}.`
      );
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
              Enterprise ERP
            </span>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Identity, Authentication &amp; RBAC Security Governance
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
            Authenticated Session &amp; Role-Based Access Control
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Cryptographic session verification, staff account provisioning, and granular 12-endpoint privilege enforcement.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {userRole === 'admin' && (
            <button
              onClick={onOpenAdminEditor}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Remove ERP Products</span>
            </button>
          )}

          <button
            onClick={onLogoutAndSwitch}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out / Switch Account</span>
          </button>
        </div>
      </div>

      {testActionNotice && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center space-x-2 ${
            testActionNotice.includes('✓')
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{testActionNotice}</span>
        </div>
      )}

      {/* Active Authenticated Session Overview & Clearance Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Admin Clearance Tier */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            userRole === 'admin'
              ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-500 shadow-xs'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Shield className="w-5 h-5" />
            </span>
            {userRole === 'admin' ? (
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                ● Authenticated Session
              </span>
            ) : (
              <span className="text-[10px] font-mono text-zinc-400">Requires Admin Login</span>
            )}
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Corporate Admin</h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Full root control: add, edit, or remove products, update ₹ INR prices &amp; photos, manage R&amp;D budgets,
            QA releases, user roles, and financials.
          </p>
          <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-3">
            12 / 12 System Endpoints Authorized
          </div>
        </div>

        {/* Lab Tech Clearance Tier */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            userRole === 'lab_tech'
              ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-xs'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <FlaskConical className="w-5 h-5" />
            </span>
            {userRole === 'lab_tech' ? (
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                ● Authenticated Session
              </span>
            ) : (
              <span className="text-[10px] font-mono text-zinc-400">Requires Lab Login</span>
            )}
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Lab Tech / Production</h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Scoped strictly to formulation recipes, raw material stock deductions, pilot batching, and waste
            logistics. Blocked from Financials &amp; Catalog edits.
          </p>
          <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-3">
            7 / 12 System Endpoints Authorized
          </div>
        </div>

        {/* Customer Clearance Tier */}
        <div className="p-5 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-75">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <UserCheck className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Blocked from ERP (403)</span>
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Customer Buyer</h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Standard retail privileges: browse active/upcoming catalogs, manage cart, and place ₹ INR orders. Strictly
            blocked from accessing the ERP dashboard.
          </p>
          <div className="text-[11px] font-bold text-teal-700 dark:text-teal-400 mt-3">
            3 / 12 System Endpoints Authorized
          </div>
        </div>
      </div>

      {/* Registered Enterprise & Customer Accounts Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-white">
                Registered Accounts &amp; Role Provisioning
              </h3>
            </div>
            <span className="text-xs text-zinc-500">{authUsers.length} Registered Identities</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="p-3">User Identity</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {authUsers.map((u) => {
                  const isSelf = u.id === currentUser.id;
                  return (
                    <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                      <td className="p-3">
                        <div className="font-bold text-zinc-900 dark:text-white">
                          {u.name} {isSelf && <span className="text-emerald-600 font-normal">(You)</span>}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-500">{u.email}</div>
                      </td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{u.department}</td>
                      <td className="p-3">
                        {userRole === 'admin' && !isSelf ? (
                          <select
                            aria-label={`Change role for ${u.name}`}
                            value={u.role}
                            onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                            className="px-2 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-white"
                          >
                            <option value="admin">ADMIN</option>
                            <option value="lab_tech">LAB_TECH</option>
                            <option value="customer">CUSTOMER</option>
                          </select>
                        ) : (
                          <span className="font-mono font-bold uppercase text-[11px] text-zinc-800 dark:text-zinc-200">
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {userRole === 'admin' && !isSelf ? (
                          <button
                            onClick={() => onDeleteUser(u.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title={`Revoke account ${u.email}`}
                            aria-label={`Revoke account ${u.email}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-zinc-400">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Security & Authorization Audit Log */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-white">
                Security &amp; Authorization Audit Trail
              </h3>
            </div>
            <span className="text-xs text-zinc-500">Live Events</span>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-72 overflow-y-auto">
            {securityLogs.slice(0, 8).map((ev) => (
              <div key={ev.id} className="p-3.5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-white">{ev.action}</span>
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      ev.status === 'ALLOWED'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{ev.details}</p>
                <div className="text-[10px] font-mono text-zinc-400">
                  {ev.timestamp} · {ev.actor_email} ({ev.actor_role.toUpperCase()})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-white">
              Granular Security &amp; Privilege Matrix
            </h3>
          </div>
          <span className="text-xs text-zinc-500">12 System Endpoints</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="p-3">Feature &amp; Capability</th>
                <th className="p-3">Domain</th>
                <th className="p-3 text-center">Admin</th>
                <th className="p-3 text-center">Lab Tech</th>
                <th className="p-3 text-center">Customer</th>
                <th className="p-3 text-right">Verify Current Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="p-3 font-semibold text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-3 text-zinc-500 font-mono text-[11px]">{row.category}</td>
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
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer"
                    >
                      Verify Access
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
