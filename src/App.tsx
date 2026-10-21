import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/storefront/HeroBanner';
import { ProductCatalog } from './components/storefront/ProductCatalog';
import { CoirInnovation } from './components/storefront/CoirInnovation';
import { ReviewsSection } from './components/storefront/ReviewsSection';
import { CartDrawer } from './components/storefront/CartDrawer';
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

  // Business state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [materials, setMaterials] = useState<RawMaterial[]>(INITIAL_RAW_MATERIALS);
  const [recipes] = useState<FormulationRecipeItem[]>(INITIAL_RECIPES);
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [rndProjects, setRndProjects] = useState<RNDProject[]>(INITIAL_RND_PROJECTS);
  const [wasteLogs, setWasteLogs] = useState<WasteCollectionLog[]>(INITIAL_WASTE_LOGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    // Also replenish matching raw material if coconut or papaya
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
    const randomCustomers = [
      { name: 'Dr. Evelyn Reed', email: 'e.reed@stanford.edu', address: '450 Serra Mall, Stanford, CA' },
      { name: 'Liam O’Connor', email: 'liam.oc@gmail.com', address: '1282 Michigan Ave, Chicago, IL' },
      { name: 'Zara Al-Sayed', email: 'zara.beauty@outlook.com', address: '772 Brickell Ave, Miami, FL' }
    ];
    const customer = randomCustomers[Math.floor(Math.random() * randomCustomers.length)];
    const newSimOrder: Order = {
      id: `ord-sim-${Date.now()}`,
      order_number: `ORD-2026-${Math.floor(9820 + orders.length)}`,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_address: customer.address,
      subtotal: 56.00,
      discount: 0,
      total_amount: 56.00,
      status: 'Processing',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tracking_code: `NG-DHL-${Math.floor(500000 + Math.random() * 400000)}`,
      items: [
        {
          product_id: 'prod-001',
          product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
          price: 28.00,
          quantity: 2,
          sku: 'NG-SCRUB-001'
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

  const handleNavigateToProduction = (product: Product) => {
    setCurrentView('erp');
    setActiveERPModule(3); // Module 3: Production & Recipe Manager
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

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
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'store' ? (
          <div>
            {/* Storefront Hero */}
            <HeroBanner
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
            />

            {/* Product Catalog Grid (Live Flagship + Coming Soon R&D) */}
            <ProductCatalog
              products={products}
              onAddToCart={handleAddToCart}
              onNavigateToProduction={handleNavigateToProduction}
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
