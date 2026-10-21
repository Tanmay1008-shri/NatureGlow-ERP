import React, { useState } from 'react';
import {
  Users,
  Star,
  Sparkles,
  Search,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Filter,
  BarChart2,
  Heart
} from 'lucide-react';
import { Review, Order, Product } from '../../types';
import { analyzeReviewSentiment } from '../../utils/businessLogic';

interface Module7Props {
  reviews: Review[];
  orders: Order[];
  products: Product[];
}

export const Module7CRM: React.FC<Module7Props> = ({ reviews, orders, products }) => {
  const [activeTab, setActiveTab] = useState<'sentiment' | 'customers'>('sentiment');
  const [selectedSku, setSelectedSku] = useState<string>('all');
  const [customerSearch, setCustomerSearch] = useState('');

  // Sku filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (selectedSku === 'all') return true;
    return r.product_id === selectedSku;
  });

  // Decoupled sentiment analyzer
  const sentimentResult = analyzeReviewSentiment(filteredReviews);

  // Group orders by customer email to create unique customer accounts
  const customerMap = new Map<string, {
    name: string;
    email: string;
    address: string;
    ordersCount: number;
    totalSpend: number;
    lastOrderDate: string;
    purchasedSkus: Set<string>;
  }>();

  orders.forEach((o) => {
    if (!customerMap.has(o.customer_email)) {
      customerMap.set(o.customer_email, {
        name: o.customer_name,
        email: o.customer_email,
        address: o.customer_address,
        ordersCount: 0,
        totalSpend: 0,
        lastOrderDate: o.created_at,
        purchasedSkus: new Set<string>()
      });
    }

    const c = customerMap.get(o.customer_email)!;
    c.ordersCount += 1;
    c.totalSpend += o.total_amount;
    o.items.forEach((it) => c.purchasedSkus.add(it.product_name));
  });

  const customerAccounts = Array.from(customerMap.values()).filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Enterprise ERP
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Sentiment Intelligence
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
            Customer Relationship Management & AI Sentiment
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Customer account histories, SKU-specific review analysis, and automated ingredient friction detection.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setActiveTab('sentiment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sentiment'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            AI Review Sentiment
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'customers'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Customer Accounts ({customerAccounts.length})
          </button>
        </div>
      </div>

      {activeTab === 'sentiment' ? (
        <div className="space-y-6">
          {/* Sentiment KPI Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase">Average Rating</span>
              <div className="text-2xl font-extrabold text-amber-500 mt-2 flex items-center space-x-1">
                <Star className="w-5 h-5 fill-current" />
                <span>{sentimentResult.averageRating} / 5.0</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">{sentimentResult.totalReviews} total reviews</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase">Positive Sentiment</span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                {sentimentResult.positivePct}%
              </div>
              <div className="text-[11px] text-emerald-600 mt-1">{sentimentResult.positiveCount} enthusiastic reviews</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase">Neutral Feedback</span>
              <div className="text-2xl font-extrabold text-zinc-600 dark:text-zinc-300 mt-2">
                {sentimentResult.neutralCount}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">Minor packaging / scent notes</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase">Critical Flag Rate</span>
              <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-2">
                {sentimentResult.criticalCount}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">Requires QA attention</div>
            </div>
          </div>

          {/* AI Formulation Intelligence & Friction Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-emerald-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white">
                  Automated Formulation & Texture Insights
                </h3>
              </div>

              <div className="space-y-3">
                {sentimentResult.actionableInsights.map((ins, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200 flex items-start space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{ins}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Top Customer Praise Attributes
                </div>
                <div className="flex flex-wrap gap-2">
                  {sentimentResult.topPositiveTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              {sentimentResult.topFrictionTags.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                    Reported Texture or Seal Friction
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sentimentResult.topFrictionTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold"
                      >
                        ⚠ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Individual Reviews Stream */}
            <div className="lg:col-span-6 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                  <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white">
                    Raw Feedback Log by SKU
                  </h3>
                </div>
                <select
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                >
                  <option value="all">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name.split(',')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-white">{rev.author}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 italic">"{rev.comment}"</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-zinc-400">{rev.date}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        rev.sentiment === 'Positive'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}>
                        {rev.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Customer Accounts View */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-white">
                Customer Lifetime Accounts & Purchase History
              </h3>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search customers..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="p-3">Customer Name & Contact</th>
                  <th className="p-3">Shipping Destination</th>
                  <th className="p-3">Total Orders</th>
                  <th className="p-3">Lifetime Value</th>
                  <th className="p-3">Purchased Products</th>
                  <th className="p-3">Loyalty Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                {customerAccounts.map((cust) => (
                  <tr key={cust.email} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-semibold">
                      <div className="font-bold text-zinc-900 dark:text-white">{cust.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{cust.email}</div>
                    </td>
                    <td className="p-3 text-zinc-500 max-w-xs truncate">{cust.address}</td>
                    <td className="p-3 font-bold font-mono">{cust.ordersCount} order(s)</td>
                    <td className="p-3 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      ₹{cust.totalSpend.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-[11px] text-zinc-600 dark:text-zinc-300">
                      {Array.from(cust.purchasedSkus).join(', ')}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        cust.totalSpend > 1000
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {cust.totalSpend > 1000 ? 'Glow VIP' : 'Eco Member'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
