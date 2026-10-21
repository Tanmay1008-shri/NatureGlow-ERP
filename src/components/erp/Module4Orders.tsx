import React, { useState } from 'react';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileText,
  X,
  Printer,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface Module4Props {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const Module4Orders: React.FC<Module4Props> = ({ orders, onUpdateOrderStatus }) => {
  const [filterStatus, setFilterStatus] = useState<'All' | OrderStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tracking_code.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus === 'All') return true;
    return o.status === filterStatus;
  });

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === 'Processing') return 'Packaging';
    if (current === 'Packaging') return 'Dispatched';
    if (current === 'Dispatched') return 'Delivered';
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              ERP Module 4
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Fulfillment Command Center
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
            Order Fulfillment & Logistics Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Dispatch multi-item shopping carts, manage packaging stages, and generate customer invoices.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold">
            {orders.filter(o => o.status === 'Processing' || o.status === 'Packaging').length} Fulfilling
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold">
            {orders.filter(o => o.status === 'Delivered').length} Delivered
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 w-full sm:w-auto overflow-x-auto">
          {(['All', 'Processing', 'Packaging', 'Dispatched', 'Delivered'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {st} {st !== 'All' ? `(${orders.filter(o => o.status === st).length})` : `(${orders.length})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search order #, customer, tracking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Customer & Destination</th>
                <th className="p-3.5">Items Ordered</th>
                <th className="p-3.5">Total Value</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Carrier Tracking</th>
                <th className="p-3.5">Lifecycle Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
              {filteredOrders.map((order) => {
                const next = getNextStatus(order.status);

                return (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="hover:underline flex items-center space-x-1"
                        >
                          <span>{order.order_number}</span>
                          <FileText className="w-3 h-3 text-zinc-400" />
                        </button>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-sans font-normal mt-0.5">
                        {order.created_at}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-zinc-900 dark:text-white">{order.customer_name}</div>
                      <div className="text-[11px] text-zinc-500 max-w-xs truncate">{order.customer_address}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="font-medium text-[11px]">
                            {it.quantity}x {it.product_name}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-zinc-900 dark:text-white">
                      ${order.total_amount.toFixed(2)}
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : order.status === 'Dispatched'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : order.status === 'Packaging'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                      {order.tracking_code}
                    </td>

                    <td className="p-3.5">
                      {next ? (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, next)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Advance to {next}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Fulfilled</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">NatureGlow Enterprise Invoice</span>
                <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
                  {selectedInvoiceOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-zinc-400 font-bold uppercase text-[10px]">Customer</div>
                <div className="font-bold text-zinc-900 dark:text-white mt-0.5">{selectedInvoiceOrder.customer_name}</div>
                <div className="text-zinc-500">{selectedInvoiceOrder.customer_email}</div>
              </div>
              <div>
                <div className="text-zinc-400 font-bold uppercase text-[10px]">Carrier Tracking</div>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedInvoiceOrder.tracking_code}
                </div>
                <div className="text-zinc-500">Status: {selectedInvoiceOrder.status}</div>
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5">Qty</th>
                    <th className="p-2.5">Price</th>
                    <th className="p-2.5">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {selectedInvoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium">{it.product_name}</td>
                      <td className="p-2.5 font-mono">{it.quantity}</td>
                      <td className="p-2.5 font-mono">${it.price.toFixed(2)}</td>
                      <td className="p-2.5 font-mono font-bold">${(it.price * it.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1 text-xs pt-2">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal:</span>
                <span>${selectedInvoiceOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedInvoiceOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Circularity Discount:</span>
                  <span>-${selectedInvoiceOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-zinc-900 dark:text-white border-t border-zinc-200 dark:border-zinc-800 pt-2">
                <span>Total Amount:</span>
                <span className="text-emerald-600 dark:text-emerald-400">${selectedInvoiceOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
