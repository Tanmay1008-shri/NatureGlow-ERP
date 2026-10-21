import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, ThumbsUp, Filter, Sparkles } from 'lucide-react';
import { Review } from '../../types';

interface ReviewsSectionProps {
  reviews: Review[];
  onAddReview: (newReview: Review) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onAddReview }) => {
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'Positive' | 'Neutral' | 'Critical'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTag, setSelectedTag] = useState('Gentle Exfoliation');

  const filteredReviews = reviews.filter((r) => {
    if (filterSentiment === 'all') return true;
    return r.sentiment === filterSentiment;
  });

  const availableTags = [
    'Gentle Exfoliation',
    'Glowing Skin',
    'Natural Scent',
    'Soft Texture',
    'Eco Packaging',
    'Non-drying',
    'Jar Seal Tightness',
    'Coir Particle Coarseness'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    let sentiment: 'Positive' | 'Neutral' | 'Critical' = 'Positive';
    if (rating <= 2) sentiment = 'Critical';
    else if (rating === 3) sentiment = 'Neutral';

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      product_id: 'prod-001',
      product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
      author: authorName,
      rating,
      date: new Date().toISOString().split('T')[0],
      comment,
      verified: true,
      sentiment,
      tags: [selectedTag]
    };

    onAddReview(newRev);
    setShowAddModal(false);
    setAuthorName('');
    setComment('');
  };

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section id="reviews-section" className="py-16 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Score Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white">
              Real Experiences & Skin Transformations
            </h2>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-white">{avgRating} out of 5</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                ({reviews.length} authenticated reviews logged)
              </span>
            </div>
          </div>

          {/* Action & Filter buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-zinc-200/80 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-300 dark:border-zinc-700">
              {(['all', 'Positive', 'Neutral'] as const).map((sent) => (
                <button
                  key={sent}
                  onClick={() => setFilterSentiment(sent)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterSentiment === sent
                      ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {sent === 'all' ? 'All Reviews' : sent}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-400">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic mb-4 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {rev.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">{rev.author}</span>
                    {rev.verified && (
                      <span className="flex items-center space-x-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    rev.sentiment === 'Positive'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {rev.sentiment}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white mb-1">
              Review: 2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Your feedback feeds directly into our ERP Sentiment Engine (Module 7) for quality audits.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Your Name / Handle
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Jessica M."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      type="button"
                      key={starVal}
                      onClick={() => setRating(starVal)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${starVal <= rating ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Primary Highlight Topic
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                >
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Detailed Experience & Texture Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the feel of the micro-coir exfoliation, scent, or packaging..."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Submit & Sync with ERP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
