import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Moon,
  Sun,
  Shield,
  Layers,
  Store,
  Menu,
  X,
  FlaskConical,
  UserCheck,
  SlidersHorizontal
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: 'store' | 'erp';
  setCurrentView: (view: 'store' | 'erp') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  cartCount: number;
  openCart: () => void;
  onOpenAdminEditor: () => void;
  activeERPModule?: number;
  setActiveERPModule?: (mod: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  userRole,
  setUserRole,
  darkMode,
  setDarkMode,
  cartCount,
  openCart,
  onOpenAdminEditor
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    admin: { label: 'Admin (Full Access)', icon: <Shield className="w-3.5 h-3.5 text-amber-500" />, color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    lab_tech: { label: 'Lab Tech / Prod', icon: <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
    customer: { label: 'Customer (Store)', icon: <UserCheck className="w-3.5 h-3.5 text-teal-500" />, color: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border-b border-emerald-900/10 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('store')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-amber-500 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif">
                  NatureGlow
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40 uppercase tracking-wider">
                  Circular Skincare
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Upcycled Agri-Waste to High-Performance Beauty & ERP
              </p>
            </div>
          </div>

          {/* Primary View Switcher: Storefront vs Enterprise ERP */}
          <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setCurrentView('store')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'store'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </button>
            <button
              onClick={() => setCurrentView('erp')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'erp'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Enterprise ERP (8 Modules)</span>
            </button>
          </div>

          {/* Right Controls: Admin Product Editor, Role Switcher, Dark Mode, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {userRole === 'admin' && (
              <button
                onClick={onOpenAdminEditor}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                title="Open Admin Product & Price Editor"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Admin Product Editor</span>
              </button>
            )}

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 shadow-xs ${roleLabels[userRole].color}`}
                title="Switch System Role"
                aria-label="Switch System Role"
              >
                {roleLabels[userRole].icon}
                <span className="hidden sm:inline font-semibold">{roleLabels[userRole].label}</span>
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Select User Role
                  </div>
                  {(['admin', 'lab_tech', 'customer'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserRole(role)}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-left transition-colors ${
                        userRole === role
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {roleLabels[role].icon}
                      <span>{roleLabels[role].label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-transform active:scale-95"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-zinc-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col space-y-2">
            <button
              onClick={() => {
                setCurrentView('store');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'store'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Customer Storefront</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('erp');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'erp'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Enterprise ERP (8 Modules)</span>
            </button>
            {userRole === 'admin' && (
              <button
                onClick={() => {
                  onOpenAdminEditor();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Admin Product Editor</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
