import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  PackageCheck,
  CreditCard
} from 'lucide-react';
import { CartItem, Order } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckoutComplete: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutComplete
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPct, setDiscountPct] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form states
  const [name, setName] = useState('Ananya Deshmukh');
  const [email, setEmail] = useState('ananya.d@gmail.com');
  const [address, setAddress] = useState('402 Koregaon Park, Lane 7, Pune, MH 411001');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const shippingAmount = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const grandTotal = Math.round(subtotal - discountAmount + shippingAmount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'GLOW20') {
      setDiscountPct(20);
      setPromoError(null);
    } else if (promoCode.trim().toUpperCase() === 'CIRCULAR10') {
      setDiscountPct(10);
      setPromoError(null);
    } else {
      setPromoError('Invalid coupon. Try "GLOW20" for 20% off!');
    }
  };

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingCode = `NG-BLUEDART-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name: name,
      customer_email: email,
      customer_address: address,
      subtotal,
      discount: discountAmount,
      total_amount: grandTotal,
      status: 'Processing',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tracking_code: trackingCode,
      items: cartItems.map((ci) => ({
        product_id: ci.product.id,
        product_name: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        sku: ci.product.sku
      }))
    };

    onCheckoutComplete(newOrder);
    setCompletedOrder(newOrder);
    setIsCheckingOut(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col justify-between border-l border-zinc-200 dark:border-zinc-800 transition-colors">
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
              {completedOrder ? 'Order Confirmed' : isCheckingOut ? 'Express Checkout (₹ INR)' : 'Your Shopping Bag'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Payment & Verification Approved
                </span>
                <h4 className="text-xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
                  Thank You for Supporting Circularity!
                </h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Your order is live in our Enterprise ERP Fulfillment Engine awaiting batch packaging.
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Order Reference:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{completedOrder.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Carrier Tracking:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{completedOrder.tracking_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Ship To:</span>
                  <span className="text-zinc-900 dark:text-white text-right truncate max-w-[200px]">{completedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-zinc-200 dark:border-zinc-700 pt-2 text-sm">
                  <span>Total Paid:</span>
                  <span className="text-emerald-700 dark:text-emerald-300">₹{completedOrder.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300 text-left flex items-start space-x-2">
                <PackageCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Inventory deduction recorded across raw materials and finished goods in the ERP matrix.
                </span>
              </div>

              <button
                onClick={() => {
                  setCompletedOrder(null);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form */
            <form onSubmit={handleProcessOrder} className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                🌱 Order summary: {cartItems.length} item(s) • Total: <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 border-2 border-emerald-500 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>UPI / Card (Test)</span>
                  </div>
                  <div className="p-3 border border-zinc-300 dark:border-zinc-700 rounded-xl opacity-60 text-zinc-500 flex items-center space-x-2">
                    <span>EcoWallet (5% Back)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Complete Order (₹{grandTotal.toLocaleString('en-IN')})
                </button>
              </div>
            </form>
          ) : cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif font-bold text-base text-zinc-900 dark:text-white">
                Your Bag is Empty
              </h4>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Discover the 2-in-1 Papaya Leaf & Coconut Coir Face Scrub to start your circular skincare routine.
              </p>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex space-x-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        ₹{item.product.price.toLocaleString('en-IN')} each
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-0.5"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-0.5"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-zinc-900 dark:text-white">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code Input */}
              <div className="pt-2">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo Code (try GLOW20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white uppercase tracking-wider bg-white dark:bg-zinc-800"
                    />
                    <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 text-white text-xs font-semibold"
                  >
                    Apply
                  </button>
                </div>
                {discountPct > 0 && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    ✓ {discountPct}% discount code applied!
                  </div>
                )}
                {promoError && (
                  <div className="text-[11px] text-red-500 mt-1">{promoError}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {!completedOrder && !isCheckingOut && cartItems.length > 0 && (
          <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Circular Promo ({discountPct}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Carbon-Neutral Shipping</span>
                <span>{shippingAmount === 0 ? 'FREE (Orders ≥ ₹999)' : `₹${shippingAmount}`}</span>
              </div>

              <div className="flex justify-between font-bold text-sm text-zinc-900 dark:text-white border-t border-zinc-200 dark:border-zinc-700 pt-2">
                <span>Estimated Total</span>
                <span className="text-emerald-700 dark:text-emerald-300 text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulated UPI / Card test mode enabled</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
