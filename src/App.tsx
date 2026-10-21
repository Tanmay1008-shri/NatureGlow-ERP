import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/storefront/HeroBanner';
import { ProductCatalog } from './components/storefront/ProductCatalog';
import { CoirInnovation } from './components/storefront/CoirInnovation';
import { ReviewsSection } from './components/storefront/ReviewsSection';
import { CartDrawer } from './components/storefront/CartDrawer';
import { AdminProductEditorModal } from './components/AdminProductEditorModal';
import { ERPContainer } from './components/erp/ERPContainer';
import { Footer } from './components/Footer';

import {
  INITIAL_PRODUCTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_RECIPES,
  INITIAL_BATCHES,
  INITIAL_ORDERS,
  INITIAL_RND_PROJECTS,
  INITIAL_WASTE_LOGS,
  INITIAL_REVIEWS
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
  OrderStatus
} from './types';

import { deductMaterialsForBatch } from './utils/businessLogic';

const PRODUCTS_STORAGE_KEY = 'natureglow_products_inr_v3';
const RECIPES_STORAGE_KEY = 'natureglow_recipes_inr_v3';

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

  // Main navigation & Role
  const [currentView, setCurrentView] = useState<'store' | 'erp'>('store');
  const [activeERPModule, setActiveERPModule] = useState<number>(1);
  const [userRole, setUserRole] = useState<UserRole>('admin');

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

  // Admin Product CRUD Handlers
  const handleOpenEditProduct = (product: Product) => {
    setProductToEdit(product);
    setEditorMode('edit');
    setIsEditorOpen(true);
  };

  const handleOpenCreateProduct = () => {
    setProductToEdit(null);
    setEditorMode('create');
    setIsEditorOpen(true);
  };

  const handleSaveProduct = (updatedProduct: Product, isNew: boolean) => {
    if (isNew) {
      setProducts((prev) => [...prev, updatedProduct]);
      // Create default formulation recipe for ERP Module 3 & Module 5 compatibility
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
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      // Sync cart items if the updated product is in the shopping bag
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === updatedProduct.id
            ? { ...item, product: updatedProduct }
            : item
        )
      );
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (userRole !== 'admin') return;
    setProducts((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((p) => p.id !== productId);
    });
    setRecipes((prev) => prev.filter((r) => r.product_id !== productId));
    setCartItems((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const handleResetCatalog = () => {
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
    // 1. Add order to ERP orders
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Decrement finished stock in products
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

    // 3. Clear cart
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

    // Deduct materials from stock
    const updatedMaterials = deductMaterialsForBatch(materials, productRecipe, batchSize);
    setMaterials(updatedMaterials);

    // Add new batch in Pending Safety Clearance
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
      tested_by: userRole === 'lab_tech' ? 'Lab Tech Specialist' : 'Chief Toxicologist'
    };

    setBatches((prev) => [newBatch, ...prev]);
  };

  const handleReleaseBatch = (batchId: string) => {
    const targetBatch = batches.find((b) => b.id === batchId);
    if (!targetBatch) return;

    // Transition batch to 'Released'
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              status: 'Released',
              quality_score: 99.1,
              tested_by: 'QA Director Approved'
            }
          : b
      )
    );

    // Increment finished product current_stock!
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

  // Live simulation helpers for presentation
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
    setCurrentView('erp');
    setActiveERPModule(3);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const flagshipProduct = products[0] || INITIAL_PRODUCTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500 selection:text-white transition-colors">
      {/* Global Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={userRole}
        setUserRole={setUserRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        onOpenAdminEditor={() => handleOpenEditProduct(flagshipProduct)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'store' ? (
          <div>
            {/* Storefront Hero */}
            <HeroBanner
              flagshipProduct={flagshipProduct}
              userRole={userRole}
              onExploreProduct={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreCoir={() => {
                const el = document.getElementById('coir-innovation');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onGoToERP={() => {
                setCurrentView('erp');
                setActiveERPModule(1);
              }}
              onEditFlagship={handleOpenEditProduct}
            />

            {/* Product Catalog Grid (Live Flagship + Coming Soon R&D + Admin CRUD) */}
            <ProductCatalog
              products={products}
              userRole={userRole}
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
          /* Enterprise ERP System (8 Interconnected Modules) */
          <ERPContainer
            activeModule={activeERPModule}
            setActiveModule={setActiveERPModule}
            userRole={userRole}
            setUserRole={setUserRole}
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
        userRole={userRole}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetCatalog={handleResetCatalog}
      />

      {/* Global Footer */}
      <Footer
        onGoToStore={() => {
          setCurrentView('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToERP={(mod) => {
          setCurrentView('erp');
          setActiveERPModule(mod);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
