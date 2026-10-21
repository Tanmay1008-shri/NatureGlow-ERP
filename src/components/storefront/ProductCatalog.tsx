import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  FlaskConical,
  Star,
  CheckCircle2,
  Bell,
  Eye,
  X,
  Recycle,
  Layers,
  Pencil,
  Plus,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';
import { Product, UserRole } from '../../types';

interface ProductCatalogProps {
  products: Product[];
  userRole: UserRole;
  onAddToCart: (product: Product) => void;
  onNavigateToProduction: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onOpenCreateProduct: () => void;
  onDeleteProduct: (productId: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  userRole,
  onAddToCart,
  onNavigateToProduction,
  onEditProduct,
  onOpenCreateProduct,
  onDeleteProduct
}) => {
  const [filter, setFilter] = useState<'all' | 'live' | 'rnd'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    if (filter === 'live') return p.status === 'Active';
    if (filter === 'rnd') return p.status !== 'Active';
    return true;
  });

  const liveCount = products.filter((p) => p.status === 'Active').length;
  const rndCount = products.length - liveCount;

  const handleJoinWaitlist = (productName: string) => {
    if (!waitlistEmail || !waitlistEmail.includes('@')) return;
    setWaitlistSuccess(`You are on the VIP formulation waitlist for ${productName}!`);
    setTimeout(() => {
      setWaitlistSuccess(null);
      setWaitlistEmail('');
    }, 4000);
  };

  return (
    <section id="catalog-section" className="py-16 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Multi-Product Skincare Architecture (₹ INR)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white">
              Circular Skincare Marketplace & Lab Pipeline
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
              From our flagship coconut-papaya scrub to active R&D formulations engineered to rescue coffee grounds, fruit stones, and bio-charcoal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {userRole === 'admin' && (
              <button
                onClick={onOpenCreateProduct}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Product to Store & ERP</span>
              </button>
            )}

            {/* Filter Controls */}
            <div className="flex items-center bg-zinc-200/80 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-300 dark:border-zinc-700">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                All SKUs ({products.length})
              </button>
              <button
                onClick={() => setFilter('live')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'live'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Live & In-Stock ({liveCount})
              </button>
              <button
                onClick={() => setFilter('rnd')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'rnd'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                In R&D Lab ({rndCount})
              </button>
            </div>
          </div>
        </div>

        {/* Admin Quick Toolbar Banner */}
        {userRole === 'admin' && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200">
              <SlidersHorizontal className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Admin Catalog Mode Active:</strong> Click <strong>Edit</strong> on any card below to update its photo, ₹ INR price, or stock—or add/remove products across both the Storefront and ERP.
              </span>
            </div>
            <button
              onClick={() => onEditProduct(products[0])}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-amber-500 text-white dark:text-zinc-950 font-bold text-xs shrink-0 cursor-pointer"
            >
              Open Product & Price Editor
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isLive = product.status === 'Active';

            return (
              <div
                key={product.id}
                className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 bg-white dark:bg-zinc-900 ${
                  isLive
                    ? 'border-emerald-300 dark:border-emerald-800/80 shadow-md hover:shadow-xl hover:-translate-y-1'
                    : 'border-zinc-200 dark:border-zinc-800 shadow-sm opacity-95'
                }`}
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105 ${
                      !isLive ? 'filter brightness-90 saturate-85' : ''
                    }`}
                  />

                  {/* Status Badge */}
                  {isLive ? (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>Live Available</span>
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-zinc-900/90 text-amber-300 border border-amber-500/30 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 shadow-xs">
                      <FlaskConical className="w-3 h-3 text-amber-400" />
                      <span>In R&D Lab ({product.target_launch || 'Q3 2027'})</span>
                    </div>
                  )}

                  {/* Stock pill */}
                  {isLive && (
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs border border-zinc-200 dark:border-zinc-700">
                      Stock: {product.current_stock}
                    </div>
                  )}

                  {/* Admin Edit & Quick View Buttons Overlay */}
                  <div className="absolute bottom-2 right-2 flex items-center space-x-1.5">
                    {userRole === 'admin' && (
                      <>
                        <button
                          onClick={() => onEditProduct(product)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[11px] shadow-md flex items-center space-x-1 transition-transform active:scale-95 cursor-pointer"
                          title="Edit Price, Image & Specs"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {products.length > 1 && (
                          <button
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white shadow-md transition-transform active:scale-95 cursor-pointer"
                            title="Remove product from Store & ERP"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-md backdrop-blur-xs transition-transform active:scale-90 cursor-pointer"
                      title="Quick View Specs"
                      aria-label={`Quick view ${product.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      <span>{product.category}</span>
                      <span>{product.sku}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white leading-snug">
                      {product.name}
                    </h3>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                      {product.tagline}
                    </p>

                    {/* Ratings */}
                    {isLive ? (
                      <div className="flex items-center space-x-1.5 mt-2">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold text-zinc-900 dark:text-white ml-1">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          ({product.reviews_count} verified reviews)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Formulation in stability testing</span>
                      </div>
                    )}
                  </div>

                  {/* Key ingredient highlight */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
                      Hero Upcycled Ingredient
                    </div>
                    <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300 truncate">
                      🌱 {product.key_ingredients[0]}
                    </div>
                  </div>

                  {/* Pricing and Action Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-zinc-900 dark:text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {product.size}
                      </div>
                    </div>

                    {isLive ? (
                      <button
                        onClick={() => onAddToCart(product)}
                        className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-500" />
                        <span>R&D Specs</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    selectedProduct.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {selectedProduct.status}
                  </span>
                  <span className="text-xs text-zinc-500">{selectedProduct.sku}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                aria-label="Close product modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center space-x-1.5">
                      <Recycle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Circular Impact Rationale</span>
                    </div>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300/90 mt-1">
                      {selectedProduct.sustainability_notes}
                    </p>
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-900 dark:text-white">Packaging:</span> Infinite UV Amber Glass with stone-paper compostable labeling.
                  </div>
                </div>
              </div>

              {/* Key Ingredients */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Formulation Active Ingredients
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProduct.key_ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ERP Link for Lab & Admin */}
              <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-500" />
                    <span>Connected ERP Recipe & Batch Engine</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Target batch volume calculation &amp; ingredient stock availability available in ERP Production.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    onNavigateToProduction(selectedProduct);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  View in Recipe Manager
                </button>
              </div>

              {/* Waitlist for upcoming products */}
              {selectedProduct.status !== 'Active' && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 space-y-2">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                    <span>Join Formulation Pilot Tester Panel</span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    Be the first to receive trial samples when Batch 1 completes stability clearance in {selectedProduct.target_launch}.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-emerald-500"
                    />
                    <button
                      onClick={() => handleJoinWaitlist(selectedProduct.name)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Join Waitlist
                    </button>
                  </div>
                  {waitlistSuccess && (
                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                      {waitlistSuccess}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-zinc-500 ml-2">/ {selectedProduct.size}</span>
              </div>

              <div className="flex items-center space-x-2">
                {userRole === 'admin' && (
                  <button
                    onClick={() => {
                      const prod = selectedProduct;
                      setSelectedProduct(null);
                      onEditProduct(prod);
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Product</span>
                  </button>
                )}

                {selectedProduct.status === 'Active' ? (
                  <button
                    onClick={() => {
                      onAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                ) : (
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Target Launch: {selectedProduct.target_launch}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
