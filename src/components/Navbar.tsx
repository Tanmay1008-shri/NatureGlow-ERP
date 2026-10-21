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
  SlidersHorizontal,
  Lock,
  LogIn,
  LogOut
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';

interface NavbarProps {
  currentView: 'store' | 'erp' | 'auth';
  setCurrentView: (view: 'store' | 'erp' | 'auth') => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  cartCount: number;
  openCart: () => void;
  onOpenAdminEditor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onLogout,
  darkMode,
  setDarkMode,
  cartCount,
  openCart,
  onOpenAdminEditor
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleBadges: Record<UserRole, { label: string; icon: React.ReactNode; style: string }> = {
    admin: {
      label: 'ADMIN',
      icon: <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      style: 'bg-amber-50/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
    },
    lab_tech: {
      label: 'LAB TECH',
      icon: <FlaskConical className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      style: 'bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
    },
    customer: {
      label: 'CUSTOMER',
      icon: <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />,
      style: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700'
    }
  };

  const canEnterERP = currentUser && (currentUser.role === 'admin' || currentUser.role === 'lab_tech');

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-zinc-900/95 border-b border-emerald-900/10 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer shrink-0"
            onClick={() => setCurrentView('store')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-amber-500 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 whitespace-nowrap">
                <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white font-serif">
                  NatureGlow
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider hidden xl:inline">
                  · Circular Skincare
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden 2xl:block whitespace-nowrap">
                Upcycled Agri-Waste to High-Performance Beauty &amp; ERP
              </p>
            </div>
          </div>

          {/* Primary View Switcher: Storefront vs Enterprise ERP */}
          <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shrink-0">
            <button
              onClick={() => setCurrentView('store')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentView === 'store'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span>Customer Storefront</span>
            </button>
            <button
              onClick={() => setCurrentView('erp')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentView === 'erp'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {canEnterERP ? (
                <Layers className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <span>Enterprise ERP (8 Modules)</span>
            </button>
          </div>

          {/* Right Controls: Admin Product Editor, Authenticated Session / Sign In, Dark Mode, Cart */}
          <div className="flex items-center space-x-2 shrink-0">
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdminEditor}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer shrink-0"
                title="Open Admin Product & Price Editor"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                <span>Admin Product Editor</span>
              </button>
            )}

            {/* Authenticated User Badge + Sign Out OR Sign In Button */}
            {currentUser ? (
              <div className="flex items-center space-x-1.5 shrink-0">
                <div
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs border whitespace-nowrap ${
                    roleBadges[currentUser.role].style
                  }`}
                  title={`Signed in as ${currentUser.name} (${currentUser.email})`}
                >
                  {roleBadges[currentUser.role].icon}
                  <span className="hidden sm:inline font-bold">{currentUser.name}</span>
                  <span className="text-[10px] font-mono font-bold opacity-80">
                    · {roleBadges[currentUser.role].label}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap text-zinc-700 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer shrink-0"
                  title="Sign out of current account"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xl:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('auth')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-colors cursor-pointer shrink-0 ${
                  currentView === 'auth'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-100'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-zinc-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
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
              {canEnterERP ? <Layers className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-500" />}
              <span>Enterprise ERP (8 Modules)</span>
            </button>
            {currentUser?.role === 'admin' && (
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
            {!currentUser ? (
              <button
                onClick={() => {
                  setCurrentView('auth');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold text-red-600 dark:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentUser.name})</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
