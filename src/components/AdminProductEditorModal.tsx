import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Save,
  Upload,
  Image as ImageIcon,
  IndianRupee,
  Package,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { Product, ProductStatus, UserRole } from '../types';

interface AdminProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProductToEdit?: Product | null;
  initialMode?: 'edit' | 'create';
  userRole: UserRole;
  onSaveProduct: (product: Product, isNew: boolean) => void;
  onDeleteProduct: (productId: string) => void;
  onResetCatalog: () => void;
}

const IMAGE_PRESETS = [
  {
    label: 'NatureGlow Amber Scrub Jar',
    url: '/flagship-papaya-scrub.svg'
  },
  {
    label: 'Hibiscus & Mango Balm Jar',
    url: '/hibiscus-mango-balm.svg'
  },
  {
    label: 'Charcoal & Aloe Cleanser',
    url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=85'
  },
  {
    label: 'Coffee Bean Eye Serum',
    url: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85'
  }
];

export const AdminProductEditorModal: React.FC<AdminProductEditorModalProps> = ({
  isOpen,
  onClose,
  products,
  initialProductToEdit,
  initialMode = 'edit',
  userRole,
  onSaveProduct,
  onDeleteProduct,
  onResetCatalog
}) => {
  const [mode, setMode] = useState<'edit' | 'create'>(initialMode);
  const [selectedId, setSelectedId] = useState<string>(
    initialProductToEdit?.id || products[0]?.id || ''
  );

  // Form fields
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(649);
  const [cogsCost, setCogsCost] = useState<number>(142);
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState<ProductStatus>('Active');
  const [currentStock, setCurrentStock] = useState<number>(200);
  const [category, setCategory] = useState('Exfoliators & Scrubs');
  const [size, setSize] = useState('100 ml / 3.4 fl oz');
  const [image, setImage] = useState(IMAGE_PRESETS[0].url);
  const [targetLaunch, setTargetLaunch] = useState('Q3 2027');
  const [keyIngredientsText, setKeyIngredientsText] = useState('');
  const [sustainabilityNotes, setSustainabilityNotes] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setConfirmDelete(false);
    setSavedBanner(null);

    if (initialMode === 'create') {
      populateNewProductDefaults();
    } else {
      const target = initialProductToEdit || products.find((p) => p.id === selectedId) || products[0];
      if (target) {
        setMode('edit');
        setSelectedId(target.id);
        loadProductIntoForm(target);
      } else {
        populateNewProductDefaults();
      }
    }
  }, [isOpen, initialProductToEdit, initialMode]);

  const loadProductIntoForm = (prod: Product) => {
    setName(prod.name);
    setTagline(prod.tagline);
    setDescription(prod.description);
    setPrice(prod.price);
    setCogsCost(prod.cogs_cost);
    setSku(prod.sku);
    setStatus(prod.status);
    setCurrentStock(prod.current_stock);
    setCategory(prod.category);
    setSize(prod.size);
    setImage(prod.image);
    setTargetLaunch(prod.target_launch || 'Q3 2027');
    setKeyIngredientsText(prod.key_ingredients.join(', '));
    setSustainabilityNotes(prod.sustainability_notes);
    setConfirmDelete(false);
  };

  const populateNewProductDefaults = () => {
    setMode('create');
    const nextNum = products.length + 1;
    setName('');
    setTagline('Upcycled botanical formulation for radiant skin barrier health');
    setDescription('Formulated with rescued agricultural bio-actives and packaged in infinite-recycle UV amber glass.');
    setPrice(699);
    setCogsCost(150);
    setSku(`NG-BIO-00${nextNum}`);
    setStatus('Active');
    setCurrentStock(150);
    setCategory('Exfoliators & Scrubs');
    setSize('100 ml / 3.4 fl oz');
    setImage(IMAGE_PRESETS[0].url);
    setTargetLaunch('Q3 2027');
    setKeyIngredientsText('Upcycled Coconut Coir, Papaya Leaf Extract, Raw Wildflower Honey');
    setSustainabilityNotes('Diverts 45g of agricultural crop residue per unit.');
    setConfirmDelete(false);
  };

  const handleSelectExistingProduct = (prod: Product) => {
    setMode('edit');
    setSelectedId(prod.id);
    loadProductIntoForm(prod);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'admin') return;
    if (!name.trim() || !sku.trim()) return;

    const existing = products.find((p) => p.id === selectedId);
    const parsedIngredients = keyIngredientsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedProduct: Product = {
      id: mode === 'create' ? `prod-${Date.now()}` : selectedId,
      name: name.trim(),
      tagline: tagline.trim() || 'Sustainable Circular Skincare Formulation',
      description: description.trim(),
      price: Math.max(1, Number(price)),
      cogs_cost: Math.max(1, Number(cogsCost)),
      sku: sku.trim().toUpperCase(),
      status,
      current_stock: status === 'Active' ? Math.max(0, Number(currentStock)) : Number(currentStock),
      category: category.trim() || 'Skincare',
      size: size.trim() || '100 ml',
      rating: existing?.rating ?? 4.9,
      reviews_count: existing?.reviews_count ?? 12,
      image: image.trim() || IMAGE_PRESETS[0].url,
      features: existing?.features ?? [
        '100% microplastic-free circular botanical formula',
        'Upcycled smallholder farm bio-actives',
        'Dermatologically tested for all skin types'
      ],
      key_ingredients: parsedIngredients.length > 0 ? parsedIngredients : ['Upcycled Botanical Extract'],
      target_launch: status !== 'Active' ? targetLaunch : undefined,
      sustainability_notes: sustainabilityNotes.trim() || 'Upcycled agricultural by-product formulation.'
    };

    onSaveProduct(updatedProduct, mode === 'create');
    setSavedBanner(
      mode === 'create'
        ? `Added "${updatedProduct.name}" (₹${updatedProduct.price}) to Storefront & ERP!`
        : `Updated "${updatedProduct.name}" (₹${updatedProduct.price}) across Storefront & ERP!`
    );

    if (mode === 'create') {
      setMode('edit');
      setSelectedId(updatedProduct.id);
    }

    setTimeout(() => setSavedBanner(null), 4000);
  };

  const handleConfirmDelete = () => {
    if (userRole !== 'admin' || mode === 'create') return;
    onDeleteProduct(selectedId);
    onClose();
  };

  if (!isOpen) return null;

  const grossMargin = price > 0 ? (((price - cogsCost) / price) * 100).toFixed(1) : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-zinc-950 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-zinc-900 dark:text-white">
                  Admin Product, Price & ERP Catalog Manager
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">
                  ₹ INR Live Sync
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Edit product images, ₹ INR prices, stock, or add/remove SKUs across the Storefront & ERP modules.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500"
            aria-label="Close Admin Product Editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Restriction Guard if not Admin */}
        {userRole !== 'admin' ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-serif font-bold text-zinc-900 dark:text-white">
              Admin Privilege Required
            </h4>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
              Your current session role is <strong>{userRole.toUpperCase()}</strong>. Adding, editing, or removing products from the ERP catalog is restricted to <strong>Corporate Admin</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* Top Selector Bar: Pick Product to Edit or + Add New Product */}
            <div className="px-6 py-3 bg-zinc-100/80 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center space-x-2">
                {products.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelectExistingProduct(prod)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                      mode === 'edit' && selectedId === prod.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500'
                    }`}
                  >
                    <span>{prod.name.split(',')[0].substring(0, 22)}</span>
                    <span className="opacity-80 font-mono text-[10px]">₹{prod.price}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={populateNewProductDefaults}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1 ${
                    mode === 'create'
                      ? 'bg-amber-500 text-zinc-950 shadow-xs'
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Product to ERP</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onResetCatalog();
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center space-x-1 shrink-0"
                title="Reset catalog to default seed data"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            {savedBanner && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{savedBanner}</span>
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Image Preview, File Upload & Presets */}
                <div className="lg:col-span-5 space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Product Visual & Packaging Photo
                  </label>

                  <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <img
                      src={image}
                      alt={name || 'Product preview'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-zinc-900/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      Live Storefront Preview • ₹{price}
                    </div>
                  </div>

                  {/* Upload from Computer / Phone */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from Computer / Phone</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                        Or Paste Direct Image URL
                      </label>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* 1-Click Studio Presets */}
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-500 mb-1.5 flex items-center space-x-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>1-Click Botanical Jar Presets:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setImage(preset.url)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border text-left truncate transition-colors cursor-pointer ${
                            image === preset.url
                              ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                              : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Product Details, ₹ INR Pricing & ERP Inventory */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. 2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        ERP SKU Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="NG-SCRUB-001"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Pricing & COGS in INR */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        Retail Price (₹ INR) *
                      </label>
                      <div className="relative">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-2.5" />
                        <input
                          type="number"
                          min="1"
                          required
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        Unit COGS (₹ INR)
                      </label>
                      <div className="relative">
                        <IndianRupee className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                        <input
                          type="number"
                          min="1"
                          required
                          value={cogsCost}
                          onChange={(e) => setCogsCost(Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                        Calculated Margin
                      </div>
                      <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                        {grossMargin}%
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Profit: ₹{Math.max(0, price - cogsCost)} / unit
                      </div>
                    </div>
                  </div>

                  {/* Lifecycle Status, Stock & Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Pipeline Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ProductStatus)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-semibold"
                      >
                        <option value="Active">Active (Live in Store)</option>
                        <option value="In-Development">In-Development (R&D Lab)</option>
                        <option value="Concept">Concept Stage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Warehouse Stock (Units)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={currentStock}
                        onChange={(e) => setCurrentStock(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Net Weight / Size
                      </label>
                      <input
                        type="text"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        placeholder="100 ml / 3.4 fl oz"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Short Tagline
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Formulation Description
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Key Upcycled Ingredients (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={keyIngredientsText}
                      onChange={(e) => setKeyIngredientsText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions: Delete Product vs Save Product */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  {mode === 'edit' && products.length > 1 && (
                    !confirmDelete ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Product from ERP & Store</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleConfirmDelete}
                          className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Confirm Permanent Removal
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(false)}
                          className="px-2.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    )
                  )}
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {mode === 'create' ? 'Add Product to Store & ERP' : 'Save Price & Product Updates'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
