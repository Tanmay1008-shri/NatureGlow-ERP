import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/storefront/HeroBanner';
import { ProductCatalog } from './components/storefront/ProductCatalog';
import { CoirInnovation } from './components/storefront/CoirInnovation';
import { ReviewsSection } from './components/storefront/ReviewsSection';
import { CartDrawer } from './components/storefront/CartDrawer';
import { AdminProductEditorModal } from './components/AdminProductEditorModal';
import { ERPContainer } from './components/erp/ERPContainer';
import { AuthPage } from './components/auth/AuthPage';
import { Footer } from './components/Footer';

import {
  INITIAL_PRODUCTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_RECIPES,
  INITIAL_BATCHES,
  INITIAL_ORDERS,
  INITIAL_RND_PROJECTS,
  INITIAL_WASTE_LOGS,
  INITIAL_REVIEWS,
  INITIAL_AUTH_USERS,
  INITIAL_SECURITY_AUDIT_LOGS
} from './data/mockData';

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
  CartItem,
  OrderStatus,
  AuthUser,
  SecurityAuditEvent
} from './types';

import {
  deductMaterialsForBatch,
  authenticateUser,
  registerUser,
  canAccessERP,
  canManageCatalog
} from './utils/businessLogic';

const PRODUCTS_STORAGE_KEY = 'natureglow_products_inr_v3';
const RECIPES_STORAGE_KEY = 'natureglow_recipes_inr_v3';
const AUTH_USERS_STORAGE_KEY = 'natureglow_auth_users_v1';
const ACTIVE_SESSION_STORAGE_KEY = 'natureglow_active_session_v1';

export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('natureglow_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('natureglow_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('natureglow_dark_mode', 'false');
    }
  }, [darkMode]);

  // Registered Users Directory (persisted in localStorage)
  const [authUsers, setAuthUsers] = useState<AuthUser[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(AUTH_USERS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback to seed accounts
      }
    }
    return INITIAL_AUTH_USERS;
  });

  // Active Authenticated Session (null by default so guests cannot access Admin/ERP without logging in)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id && parsed.role) return parsed;
        }
      } catch {
        // Ignore parse error
      }
    }
    return null;
  });

  const [securityLogs, setSecurityLogs] = useState<SecurityAuditEvent[]>(INITIAL_SECURITY_AUDIT_LOGS);
  const [authRedirectReason, setAuthRedirectReason] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(authUsers));
    } catch {
      // Ignore storage errors
    }
  }, [authUsers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [currentUser]);

  // Effective role for UI rendering ('customer' when unauthenticated guest)
  const effectiveRole: UserRole = currentUser ? currentUser.role : 'customer';

  // Main navigation & ERP module state
  const [currentView, setCurrentViewState] = useState<'store' | 'erp' | 'auth'>('store');
  const [activeERPModule, setActiveERPModule] = useState<number>(1);

  const appendSecurityLog = (
    actorEmail: string,
    actorRole: UserRole | 'guest',
    action: string,
    status: 'ALLOWED' | 'DENIED',
    details: string
  ) => {
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newEvent: SecurityAuditEvent = {
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: nowStr,
      actor_email: actorEmail,
      actor_role: actorRole,
      action,
      status,
      details
    };
    setSecurityLogs((prev) => [newEvent, ...prev]);
  };

  // Protected route navigation handler
  const handleNavigateView = (targetView: 'store' | 'erp' | 'auth') => {
    if (targetView === 'erp') {
      if (!currentUser) {
        appendSecurityLog(
          'anonymous@guest',
          'guest',
          'Attempted Unauthenticated ERP Access',
          'DENIED',
          'Redirected to Security Gateway: Authentication required for Enterprise ERP.'
        );
        setAuthRedirectReason(
          'Please sign in with an authorized Corporate Admin or Lab Technician account to access the 8-Module Enterprise ERP.'
        );
        setCurrentViewState('auth');
        return;
      }
      if (!canAccessERP(currentUser)) {
        appendSecurityLog(
          currentUser.email,
          currentUser.role,
          'Attempted ERP Access with Customer Role',
          'DENIED',
          'HTTP 403 Forbidden: Customer role is restricted from Enterprise ERP modules.'
        );
        setAuthRedirectReason(
          'HTTP 403 Forbidden: Standard Customer accounts cannot access the Enterprise ERP dashboard.'
        );
        setCurrentViewState('auth');
        return;
      }
      setAuthRedirectReason(null);
      setCurrentViewState('erp');
      return;
    }

    if (targetView === 'store') {
      setAuthRedirectReason(null);
    }
    setCurrentViewState(targetView);
  };

  // Authentication Handlers
  const handleLogin = (email: string, password: string): { success: boolean; error?: string } => {
    const res = authenticateUser(authUsers, email, password);
    if (!res.success || !res.user) {
      appendSecurityLog(
        email || 'unknown',
        'guest',
        'Failed Sign-In Attempt',
        'DENIED',
        res.error || 'Invalid credentials.'
      );
      return { success: false, error: res.error };
    }

    const loggedInUser = res.user;
    setCurrentUser(loggedInUser);
    setAuthUsers((prev) => prev.map((u) => (u.id === loggedInUser.id ? loggedInUser : u)));
    setAuthRedirectReason(null);

    appendSecurityLog(
      loggedInUser.email,
      loggedInUser.role,
      'User Session Authenticated',
      'ALLOWED',
      `Signed in as ${loggedInUser.name} with [${loggedInUser.role.toUpperCase()}] privileges.`
    );

    if (loggedInUser.role === 'admin') {
      setActiveERPModule(1);
      setCurrentViewState('erp');
    } else if (loggedInUser.role === 'lab_tech') {
      setActiveERPModule(3);
      setCurrentViewState('erp');
    } else {
      setCurrentViewState('store');
    }

    return { success: true };
  };

  const handleRegister = (input: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    securityPasscode?: string;
  }): { success: boolean; error?: string } => {
    const res = registerUser(authUsers, input);
    if (!res.success || !res.user || !res.updatedUsers) {
      appendSecurityLog(
        input.email || 'unknown',
        'guest',
        `Blocked Account Registration (${input.role.toUpperCase()})`,
        'DENIED',
        res.error || 'Registration validation failed.'
      );
      return { success: false, error: res.error };
    }

    setAuthUsers(res.updatedUsers);
    setCurrentUser(res.user);
    setAuthRedirectReason(null);

    appendSecurityLog(
      res.user.email,
      res.user.role,
      `Provisioned New Account (${res.user.role.toUpperCase()})`,
      'ALLOWED',
      `Registered ${res.user.name} in ${res.user.department}.`
    );

    if (res.user.role === 'admin') {
      setActiveERPModule(1);
      setCurrentViewState('erp');
    } else if (res.user.role === 'lab_tech') {
      setActiveERPModule(3);
      setCurrentViewState('erp');
    } else {
      setCurrentViewState('store');
    }

    return { success: true };
  };

  const handleLogout = () => {
    if (currentUser) {
      appendSecurityLog(
        currentUser.email,
        currentUser.role,
        'User Session Signed Out',
        'ALLOWED',
        `Terminated session for ${currentUser.name}.`
      );
    }
    setCurrentUser(null);
    setIsEditorOpen(false);
    if (currentView === 'erp') {
      setCurrentViewState('auth');
    }
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const departmentMap: Record<UserRole, string> = {
      admin: 'Corporate Executive & ERP Root',
      lab_tech: 'Formulation Lab & Batch QA',
      customer: 'Verified Retail Customer'
    };
    setAuthUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: newRole, department: departmentMap[newRole] } : u
      )
    );
    const target = authUsers.find((u) => u.id === userId);
    if (target) {
      appendSecurityLog(
        currentUser.email,
        currentUser.role,
        `Updated Role for ${target.email}`,
        'ALLOWED',
        `Changed role from ${target.role.toUpperCase()} to ${newRole.toUpperCase()}.`
      );
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (!currentUser || currentUser.role !== 'admin' || userId === currentUser.id) return;
    const target = authUsers.find((u) => u.id === userId);
    setAuthUsers((prev) => prev.filter((u) => u.id !== userId));
    if (target) {
      appendSecurityLog(
        currentUser.email,
        currentUser.role,
        `Revoked Account ${target.email}`,
        'ALLOWED',
        `Removed ${target.name} (${target.role.toUpperCase()}) from active directory.`
      );
    }
  };

  // Business state (with localStorage persistence for products & recipes)
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback to seed data
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [recipes, setRecipes] = useState<FormulationRecipeItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(RECIPES_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback to seed data
      }
    }
    return INITIAL_RECIPES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // Ignore quota errors on large base64 images
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
    } catch {
      // Ignore storage errors
    }
  }, [recipes]);

  const [materials, setMaterials] = useState<RawMaterial[]>(INITIAL_RAW_MATERIALS);
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [rndProjects, setRndProjects] = useState<RNDProject[]>(INITIAL_RND_PROJECTS);
  const [wasteLogs, setWasteLogs] = useState<WasteCollectionLog[]>(INITIAL_WASTE_LOGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Admin Product Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'edit' | 'create'>('edit');
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => [
    {
      product: products[0] || INITIAL_PRODUCTS[0],
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Admin Product CRUD Handlers (Strictly guarded by canManageCatalog)
  const handleOpenEditProduct = (product: Product) => {
    if (!canManageCatalog(currentUser)) {
      setAuthRedirectReason('Corporate Admin authentication is required to edit product prices and photos.');
      setCurrentViewState('auth');
      return;
    }
    setProductToEdit(product);
    setEditorMode('edit');
    setIsEditorOpen(true);
  };

  const handleOpenCreateProduct = () => {
    if (!canManageCatalog(currentUser)) {
      setAuthRedirectReason('Corporate Admin authentication is required to add new products to the ERP.');
      setCurrentViewState('auth');
      return;
    }
    setProductToEdit(null);
    setEditorMode('create');
    setIsEditorOpen(true);
  };

  const handleSaveProduct = (updatedProduct: Product, isNew: boolean) => {
    if (!canManageCatalog(currentUser)) return;
    if (isNew) {
      setProducts((prev) => [...prev, updatedProduct]);
      const newRecipes: FormulationRecipeItem[] = [
        {
          id: `rec-${Date.now()}-1`,
          product_id: updatedProduct.id,
          raw_material_id: 'mat-001',
          required_amount_per_unit: 20,
          notes: '20g micronized coir base'
        },
        {
          id: `rec-${Date.now()}-2`,
          product_id: updatedProduct.id,
          raw_material_id: 'mat-003',
          required_amount_per_unit: 25,
          notes: '25g organic honey active'
        },
        {
          id: `rec-${Date.now()}-3`,
          product_id: updatedProduct.id,
          raw_material_id: 'mat-007',
          required_amount_per_unit: 1,
          notes: '1x Amber glass jar'
        },
        {
          id: `rec-${Date.now()}-4`,
          product_id: updatedProduct.id,
          raw_material_id: 'mat-009',
          required_amount_per_unit: 1,
          notes: '1x Compostable stone paper label'
        }
      ];
      setRecipes((prev) => [...prev, ...newRecipes]);
      appendSecurityLog(
        currentUser!.email,
        currentUser!.role,
        `Created Product SKU ${updatedProduct.sku}`,
        'ALLOWED',
        `Added "${updatedProduct.name}" at ₹${updatedProduct.price} INR.`
      );
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === updatedProduct.id
            ? { ...item, product: updatedProduct }
            : item
        )
      );
      appendSecurityLog(
        currentUser!.email,
        currentUser!.role,
        `Updated Product SKU ${updatedProduct.sku}`,
        'ALLOWED',
        `Saved changes to "${updatedProduct.name}" (₹${updatedProduct.price} INR).`
      );
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (!canManageCatalog(currentUser)) return;
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((p) => p.id !== productId);
    });
    setRecipes((prev) => prev.filter((r) => r.product_id !== productId));
    setCartItems((prev) => prev.filter((c) => c.product.id !== productId));
    if (target && currentUser) {
      appendSecurityLog(
        currentUser.email,
        currentUser.role,
        `Deleted Product SKU ${target.sku}`,
        'ALLOWED',
        `Removed "${target.name}" from Storefront & ERP.`
      );
    }
  };

  const handleResetCatalog = () => {
    if (!canManageCatalog(currentUser)) return;
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    localStorage.removeItem(RECIPES_STORAGE_KEY);
    setProducts(INITIAL_PRODUCTS);
    setRecipes(INITIAL_RECIPES);
    setCartItems([{ product: INITIAL_PRODUCTS[0], quantity: 1 }]);
  };

  // Cart Actions
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckoutComplete = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = newOrder.items.find((i) => i.product_id === prod.id);
        if (orderedItem) {
          return {
            ...prod,
            current_stock: Math.max(0, prod.current_stock - orderedItem.quantity)
          };
        }
        return prod;
      })
    );
    setCartItems([]);
  };

  // ERP Actions
  const handleRestockMaterial = (materialId: string, addedStock: number) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? { ...m, current_stock: m.current_stock + addedStock }
          : m
      )
    );
  };

  const handleRestockFinishedProduct = (productId: string, addedStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, current_stock: p.current_stock + addedStock }
          : p
      )
    );
  };

  const handleExecuteBatch = (productId: string, batchSize: number, notes: string) => {
    const productRecipe = recipes.filter((r) => r.product_id === productId);
    const updatedMaterials = deductMaterialsForBatch(materials, productRecipe, batchSize);
    setMaterials(updatedMaterials);

    const batchNumber = `LOT-NG-2026-B${Math.floor(85 + batches.length)}`;
    const newBatch: Batch = {
      id: `batch-${Date.now()}`,
      product_id: productId,
      batch_number: batchNumber,
      status: 'Pending Safety Clearance',
      quantity_produced: batchSize,
      created_at: new Date().toISOString().split('T')[0],
      scheduled_completion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      safety_check_notes: notes || 'Enzyme activity retention assay & preservative challenge testing in incubation.',
      tested_by: currentUser?.name || 'Lab Tech Specialist'
    };

    setBatches((prev) => [newBatch, ...prev]);
  };

  const handleReleaseBatch = (batchId: string) => {
    const targetBatch = batches.find((b) => b.id === batchId);
    if (!targetBatch) return;

    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              status: 'Released',
              quality_score: 99.1,
              tested_by: currentUser?.name || 'QA Director Approved'
            }
          : b
      )
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.id === targetBatch.product_id
          ? { ...p, current_stock: p.current_stock + targetBatch.quantity_produced }
          : p
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleAddRNDBudget = (projectId: string, additionalAmount: number) => {
    setRndProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, allocated_budget: p.allocated_budget + additionalAmount }
          : p
      )
    );
  };

  const handleAddWasteLog = (newLog: WasteCollectionLog) => {
    setWasteLogs((prev) => [newLog, ...prev]);
    if (newLog.waste_type.includes('Coconut')) {
      handleRestockMaterial('mat-001', Math.round(newLog.quantity_kg * 1000 * 0.75));
    } else if (newLog.waste_type.includes('Papaya')) {
      handleRestockMaterial('mat-002', Math.round(newLog.quantity_kg * 1000 * 0.70));
    }
  };

  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleSimulateOrder = () => {
    const flagship = products[0] || INITIAL_PRODUCTS[0];
    const randomCustomers = [
      { name: 'Dr. Kavita Krishnan', email: 'k.krishnan@iisc.ac.in', address: '14 Malleshwaram, Bengaluru, KA' },
      { name: 'Aarav Singhania', email: 'aarav.s@gmail.com', address: '82 Worli Sea Face, Mumbai, MH' },
      { name: 'Diya Chatterjee', email: 'diya.beauty@outlook.com', address: '19 Ballygunge Circular Rd, Kolkata, WB' }
    ];
    const customer = randomCustomers[Math.floor(Math.random() * randomCustomers.length)];
    const orderVal = flagship.price * 2;
    const newSimOrder: Order = {
      id: `ord-sim-${Date.now()}`,
      order_number: `ORD-2026-${Math.floor(9820 + orders.length)}`,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_address: customer.address,
      subtotal: orderVal,
      discount: 0,
      total_amount: orderVal,
      status: 'Processing',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tracking_code: `NG-BLUEDART-${Math.floor(500000 + Math.random() * 400000)}`,
      items: [
        {
          product_id: flagship.id,
          product_name: flagship.name,
          price: flagship.price,
          quantity: 2,
          sku: flagship.sku
        }
      ]
    };

    handleCheckoutComplete(newSimOrder);
  };

  const handleSimulateDelivery = () => {
    const newHarvest: WasteCollectionLog = {
      id: `wlog-sim-${Date.now()}`,
      waste_type: 'Coconut Husk Fiber Surplus',
      source_coop: 'GreenCoast Coastal Coconut Co-op',
      location: 'Malabar Coast Maritime Sector',
      quantity_kg: 450,
      collected_at: new Date().toISOString().split('T')[0],
      co2_offset_kg: 1050,
      processing_yield_pct: 84
    };
    handleAddWasteLog(newHarvest);
  };

  const handleNavigateToProduction = (_product: Product) => {
    handleNavigateView('erp');
    setActiveERPModule(3);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const flagshipProduct = products[0] || INITIAL_PRODUCTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500 selection:text-white transition-colors">
      {/* Global Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={handleNavigateView}
        currentUser={currentUser}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        onOpenAdminEditor={() => handleOpenEditProduct(flagshipProduct)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'auth' || (currentView === 'erp' && !canAccessERP(currentUser)) ? (
          <AuthPage
            currentUser={currentUser}
            redirectReason={authRedirectReason}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            onBackToStore={() => handleNavigateView('store')}
          />
        ) : currentView === 'store' ? (
          <div>
            {/* Storefront Hero */}
            <HeroBanner
              flagshipProduct={flagshipProduct}
              userRole={effectiveRole}
              onExploreProduct={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreCoir={() => {
                const el = document.getElementById('coir-innovation');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onGoToERP={() => {
                handleNavigateView('erp');
                setActiveERPModule(1);
              }}
              onEditFlagship={handleOpenEditProduct}
            />

            {/* Product Catalog Grid (Live Flagship + Coming Soon R&D + Admin CRUD) */}
            <ProductCatalog
              products={products}
              userRole={effectiveRole}
              onAddToCart={handleAddToCart}
              onNavigateToProduction={handleNavigateToProduction}
              onEditProduct={handleOpenEditProduct}
              onOpenCreateProduct={handleOpenCreateProduct}
              onDeleteProduct={handleDeleteProduct}
            />

            {/* The Coir Innovation & Circularity Model */}
            <CoirInnovation />

            {/* Customer Reviews & Live Sentiment Section */}
            <ReviewsSection
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          </div>
        ) : (
          /* Enterprise ERP System (Protected by Role-Based Authentication) */
          currentUser && (
            <ERPContainer
              activeModule={activeERPModule}
              setActiveModule={setActiveERPModule}
              currentUser={currentUser}
              authUsers={authUsers}
              securityLogs={securityLogs}
              onUpdateUserRole={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
              onLogSecurityEvent={(action, status, details) =>
                appendSecurityLog(currentUser.email, currentUser.role, action, status, details)
              }
              onLogoutAndSwitch={() => {
                handleLogout();
                setCurrentViewState('auth');
              }}
              products={products}
              materials={materials}
              recipes={recipes}
              batches={batches}
              orders={orders}
              rndProjects={rndProjects}
              wasteLogs={wasteLogs}
              reviews={reviews}
              onRestockMaterial={handleRestockMaterial}
              onRestockFinishedProduct={handleRestockFinishedProduct}
              onExecuteBatch={handleExecuteBatch}
              onReleaseBatch={handleReleaseBatch}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onAddRNDBudget={handleAddRNDBudget}
              onAddWasteLog={handleAddWasteLog}
              onSimulateOrder={handleSimulateOrder}
              onSimulateDelivery={handleSimulateDelivery}
              onEditProduct={handleOpenEditProduct}
              onOpenCreateProduct={handleOpenCreateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )
        )}
      </main>

      {/* Slide-over Shopping Cart Drawer & Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckoutComplete={handleCheckoutComplete}
      />

      {/* Admin Product, Price & ERP Catalog Manager Modal */}
      <AdminProductEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        products={products}
        initialProductToEdit={productToEdit}
        initialMode={editorMode}
        userRole={effectiveRole}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetCatalog={handleResetCatalog}
      />

      {/* Global Footer */}
      <Footer
        onGoToStore={() => {
          handleNavigateView('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToERP={(mod) => {
          setActiveERPModule(mod);
          handleNavigateView('erp');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
