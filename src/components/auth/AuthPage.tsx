import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  FlaskConical,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Store,
  ShieldAlert
} from 'lucide-react';
import { AuthUser, UserRole } from '../../types';
import { ROLE_SECURITY_PASSCODES } from '../../utils/businessLogic';

interface AuthPageProps {
  currentUser: AuthUser | null;
  redirectReason?: string | null;
  onLogin: (email: string, password: string) => { success: boolean; error?: string };
  onRegister: (input: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    securityPasscode?: string;
  }) => { success: boolean; error?: string };
  onLogout: () => void;
  onBackToStore: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentUser,
  redirectReason,
  onLogin,
  onRegister,
  onLogout,
  onBackToStore
}) => {
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('customer');
  const [securityPasscode, setSecurityPasscode] = useState('');

  // Feedback state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = onLogin(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed.');
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoginEmail(email);
    setLoginPassword(pass);
    const res = onLogin(email, pass);
    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = onRegister({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      role: signupRole,
      securityPasscode
    });
    if (!res.success) {
      setErrorMsg(res.error || 'Account registration failed.');
    } else {
      setSuccessMsg('Account created and authenticated.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Breadcrumb / Back to Storefront */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <Store className="w-4 h-4" />
          <span>Return to Customer Storefront</span>
        </button>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Identity &amp; Role-Based Access Control (RBAC)
        </div>
      </div>

      {/* HTTP 403 Forbidden Banner if logged in as a Customer trying to open ERP */}
      {currentUser && currentUser.role === 'customer' && (
        <div className="mb-8 p-6 rounded-2xl bg-red-50/90 dark:bg-red-950/30 border border-red-200 dark:border-red-900/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-red-950 dark:text-red-200">
                HTTP 403 Access Denied — Insufficient Role Privileges
              </h2>
              <p className="text-xs text-red-800 dark:text-red-300 mt-1 leading-relaxed max-w-2xl">
                You are currently signed in as <strong>{currentUser.name}</strong> ({currentUser.email}) with the{' '}
                <strong>CUSTOMER</strong> role. Standard customer accounts cannot access the Enterprise ERP Dashboard or
                Admin Product Editor. Please sign in with an authorized <strong>Corporate Admin</strong> or{' '}
                <strong>Lab Technician</strong> account below.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={onBackToStore}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 cursor-pointer"
            >
              Continue Shopping
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Customer Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Redirect Security Notice if Guest tried to open ERP */}
      {!currentUser && redirectReason && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 flex items-center space-x-3 text-amber-900 dark:text-amber-200 text-xs">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Authentication Required:</strong> {redirectReason}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Login & Sign Up Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              NatureGlow Security Gateway
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
              {authTab === 'login' ? 'Sign In to Your Account' : 'Create a Role-Verified Account'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {authTab === 'login'
                ? 'Authenticate to access your customer orders, laboratory batch console, or root ERP administration.'
                : 'Register a new customer profile or provision an enterprise staff account with a department security key.'}
            </p>
          </div>

          {/* Segmented Mode Switcher: Sign In vs Create Account */}
          <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => {
                setAuthTab('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authTab === 'login'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Sign In (Existing Account)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authTab === 'signup'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Sign Up (New Registration)
            </button>
          </div>

          {/* Error / Success Messages */}
          {errorMsg && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-medium flex items-start space-x-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              role="status"
              className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center space-x-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {authTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. admin@natureglow.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer mt-2"
              >
                <span>Authenticate &amp; Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Rohan Deshmukh"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    Create Password (min. 6 chars)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Role Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Select Account Authorization Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSignupRole('customer')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      signupRole === 'customer'
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold text-xs">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Retail Customer</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Storefront shopping &amp; personal orders. No key required.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('lab_tech')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      signupRole === 'lab_tech'
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold text-xs">
                      <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lab Technician</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Inventory, recipes &amp; batch QA. Requires Lab Key.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('admin')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      signupRole === 'admin'
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 ring-1 ring-amber-500'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold text-xs">
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      <span>Corporate Admin</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Full 8-Module ERP &amp; Catalog Root. Requires Admin Key.
                    </p>
                  </button>
                </div>
              </div>

              {/* Mandatory Security Clearance Passcode for Staff Roles */}
              {(signupRole === 'admin' || signupRole === 'lab_tech') && (
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-2">
                  <label
                    htmlFor="signup-passcode"
                    className="block text-xs font-bold text-amber-950 dark:text-amber-200"
                  >
                    Department Security Authorization Key Required ({signupRole === 'admin' ? 'Corporate Admin' : 'Lab Technician'})
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-passcode"
                      type="text"
                      required
                      value={securityPasscode}
                      onChange={(e) => setSecurityPasscode(e.target.value)}
                      placeholder={
                        signupRole === 'admin'
                          ? 'Enter Admin Key (Demo: NG-ADMIN-2025)'
                          : 'Enter Lab Key (Demo: NG-LAB-2025)'
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-amber-400 dark:border-amber-700 bg-white dark:bg-zinc-900 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    Prevents unauthorized customers from self-assigning ERP privileges. For academic evaluation, use{' '}
                    <code className="font-mono font-bold">
                      {signupRole === 'admin' ? ROLE_SECURITY_PASSCODES.admin : ROLE_SECURITY_PASSCODES.lab_tech}
                    </code>
                    .
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <span>Create Account &amp; Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Role Clearance Architecture & Quick-Fill Evaluation Credentials */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-white">
                Verified RBAC Accounts (Quick Sign-In)
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
              Role switching without authentication is disabled. Click any verified account below to auto-fill its
              credentials and sign in with that role&apos;s exact security scope:
            </p>

            <div className="space-y-3">
              {/* 1. Corporate Admin Credential Card */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-400 dark:hover:border-amber-600 transition-colors bg-zinc-50/60 dark:bg-zinc-800/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Tier 1 · Full Root Clearance (12/12)
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
                      Corporate Administrator
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@natureglow.in', 'Admin@123')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                  >
                    Sign In as Admin
                  </button>
                </div>
                <div className="mt-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-mono space-y-0.5">
                  <div>Email: admin@natureglow.in</div>
                  <div>Pass: Admin@123</div>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">
                  Unlocks Admin Product &amp; ₹ Price Editor, SKU creation/removal, and all 8 ERP modules (including
                  Financials, Order Dispatch, and CRM).
                </p>
              </div>

              {/* 2. Lab Technician Credential Card */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 transition-colors bg-zinc-50/60 dark:bg-zinc-800/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Tier 2 · Production &amp; QA Scope (7/12)
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
                      Lab Technician / Production
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('lab@natureglow.in', 'LabTech@123')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                  >
                    Sign In as Lab Tech
                  </button>
                </div>
                <div className="mt-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-mono space-y-0.5">
                  <div>Email: lab@natureglow.in</div>
                  <div>Pass: LabTech@123</div>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">
                  Authorized for Raw Material Inventory (M2), Recipe Batch Execution &amp; QA Release (M3), and Waste
                  Logistics (M6). Blocked from Financials (M5), Order Dispatch (M4), and Catalog Pricing.
                </p>
              </div>

              {/* 3. Customer Credential Card */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-teal-500 transition-colors bg-zinc-50/60 dark:bg-zinc-800/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      Tier 3 · Storefront Buyer Scope (3/12)
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
                      Verified Retail Customer
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ananya.sharma@gmail.com', 'Customer@123')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 text-white font-bold text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                  >
                    Sign In as Customer
                  </button>
                </div>
                <div className="mt-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-mono space-y-0.5">
                  <div>Email: ananya.sharma@gmail.com</div>
                  <div>Pass: Customer@123</div>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">
                  Can browse products, manage cart, and place ₹ INR orders. Strictly blocked (HTTP 403) from entering
                  the Enterprise ERP dashboard or editing products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
