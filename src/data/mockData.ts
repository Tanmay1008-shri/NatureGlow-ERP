import {
  Product,
  RawMaterial,
  FormulationRecipeItem,
  Batch,
  Order,
  RNDProject,
  WasteCollectionLog,
  Review
} from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
    tagline: 'Dual-action enzymatic exfoliant & bioactive barrier replenishment',
    description: 'Our award-winning flagship formulation marries upcycled coconut husk coir (micronized to 60 microns) with freshly harvested papaya leaf papain enzymes. Suspended in raw wildflower honey and nourishing cold-pressed botanicals, it gently polishes away dull epidermal cells without micro-tears while infusing continuous humectant moisture.',
    price: 28.00,
    sku: 'NG-SCRUB-001',
    status: 'Active',
    current_stock: 340,
    category: 'Exfoliators & Scrubs',
    size: '100 ml / 3.4 fl oz',
    rating: 4.9,
    reviews_count: 142,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    features: [
      'Zero plastic microbeads: 100% biodegradable micronized coconut coir',
      'Natural papain proteolytic enzymes dissolve cellular debris',
      'Wildflower raw honey seals cellular hydration and calms irritation',
      'Cold-pressed jojoba balance sebum without clogging pores',
      'Packaged in infinite-recycle UV amber glass with stone paper label'
    ],
    key_ingredients: [
      'Upcycled Micronized Coconut Coir',
      'Dried Papaya Leaf Enzymatic Extract',
      'Raw Wildflower Honey',
      'Cold-Pressed Golden Jojoba Seed Oil',
      'Sweet Almond Oil & Vitamin E'
    ],
    cogs_cost: 6.15,
    sustainability_notes: 'Diverts 42g of coconut husk and 18g of agricultural papaya pruning waste per jar.'
  },
  {
    id: 'prod-002',
    name: 'Charcoal & Aloe Deep Detox Cleanser',
    tagline: 'Adsorptive micro-carbon wash with soothing desert aloe vera',
    description: 'Engineered for congested urban complexions, this low-foaming gel utilizes steam-activated carbon pyrolyzed from spent coconut shells to vacuum environmental pollutants and micro-particulates without stripping the lipid barrier.',
    price: 24.00,
    sku: 'NG-CLEAN-002',
    status: 'In-Development',
    current_stock: 0,
    category: 'Cleansers & Washes',
    size: '150 ml / 5.1 fl oz',
    rating: 4.8,
    reviews_count: 24,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    features: [
      'Steam-activated bio-charcoal from discarded coconut shells',
      'Inner-leaf organic Aloe Barbadensis juice base',
      'pH balanced (5.4) for microbiome health',
      'Sulfate-free coconut amino acid surfactants'
    ],
    key_ingredients: [
      'Activated Coconut Shell Carbon',
      'Organic Aloe Leaf Juice',
      'Sodium Cocoyl Apple Amino Acids',
      'Cucumber Hydrosol'
    ],
    target_launch: 'Q2 2027',
    cogs_cost: 5.40,
    sustainability_notes: 'Utilizes carbon from coconut processing facilities that otherwise burn shells as low-grade fuel.'
  },
  {
    id: 'prod-003',
    name: 'Upcycled Coffee Bean Revitalizing Eye Cream',
    tagline: 'High-polyphenol micro-circulation cream using salvaged cafe grounds',
    description: 'Targeted periorbital rescue. We reclaim freshly pulled espresso grounds from specialty partner roasteries, extracting pure chlorogenic acids and clean caffeine to banish morning puffiness, oxidative damage, and stubborn dark shadows.',
    price: 32.00,
    sku: 'NG-EYE-003',
    status: 'In-Development',
    current_stock: 0,
    category: 'Targeted Treatments',
    size: '15 ml / 0.5 fl oz',
    rating: 4.7,
    reviews_count: 16,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    features: [
      'Bio-fermented coffee oil packed with natural linoleic acid',
      'Targeted vasoconstriction to visibly brighten under-eye shadows',
      'Sugar-cane derived squalane for rapid dermal absorption',
      'Cooling ceramic applicator tip reduces periorbital swelling'
    ],
    key_ingredients: [
      'Supercritical Upcycled Coffee Bean Oleoresin',
      'Olive-Derived Squalane',
      'Triple Molecular Weight Hyaluronic Acid',
      'Green Tea Catechins'
    ],
    target_launch: 'Q3 2027',
    cogs_cost: 6.80,
    sustainability_notes: 'Rescues 65g of wet coffee grounds per unit, preventing anaerobic methane generation in landfills.'
  },
  {
    id: 'prod-004',
    name: 'Hibiscus Seed & Mango Butter Night Recovery Balm',
    tagline: 'Ultra-rich barrier restoration powered by fruit processing by-products',
    description: 'An unctuous overnight sleeping cocoon. Cold-pressed butter from discarded mango processing stones combined with bio-active hibiscus seed ceramides delivers profound dermal repair while you sleep.',
    price: 36.00,
    sku: 'NG-BALM-004',
    status: 'Concept',
    current_stock: 0,
    category: 'Moisturizers & Balms',
    size: '50 ml / 1.7 fl oz',
    rating: 0,
    reviews_count: 0,
    image: 'https://images.unsplash.com/photo-1608248597359-58a0b59bce22?auto=format&fit=crop&w=800&q=80',
    features: [
      'Upcycled mango kernel butter rich in stearic & oleic acids',
      'Cold-pressed wild hibiscus seed botanicals',
      'Melts from velvet balm to silky lipid oil on contact',
      'Zero synthetic waxes or petroleum petrolatum'
    ],
    key_ingredients: [
      'Salvaged Mango Seed Kernel Butter',
      'Hibiscus Sabdariffa Seed Oil',
      'Camellia Sinensis Seed Wax',
      'Blue Tansy Essential Extract'
    ],
    target_launch: 'Q4 2027',
    cogs_cost: 7.20,
    sustainability_notes: 'Turns discarded fruit cannery stones into cosmetic-grade ultra-pure stearic butter.'
  }
];

export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
  {
    id: 'mat-001',
    name: 'Coconut Coir Micronized Fiber (60µm)',
    category: 'Upcycled Bio-Waste',
    unit: 'g',
    current_stock: 74500,
    minimum_safety_stock: 20000,
    cost_per_unit: 0.024,
    source_partner: 'GreenCoast Coastal Coconut Co-op',
    carbon_offset_per_kg: 2.8,
    notes: 'Triple steam-washed and micronized to velvety 60 microns. Non-abrasive.'
  },
  {
    id: 'mat-002',
    name: 'Dried Papaya Leaf Enzymatic Powder',
    category: 'Upcycled Bio-Waste',
    unit: 'g',
    current_stock: 36200,
    minimum_safety_stock: 15000,
    cost_per_unit: 0.042,
    source_partner: 'SunValley Agro-Farms Alliance',
    carbon_offset_per_kg: 1.9,
    notes: 'Active papain standardized enzyme activity > 2,400 USP units/mg.'
  },
  {
    id: 'mat-003',
    name: 'Raw Organic Wildflower Honey',
    category: 'Natural Active',
    unit: 'g',
    current_stock: 58000,
    minimum_safety_stock: 18000,
    cost_per_unit: 0.048,
    source_partner: 'Western Ghats Apiaries',
    carbon_offset_per_kg: 0.8,
    notes: 'Unpasteurized cold-filtered raw honey with intact natural antimicrobial propolis.'
  },
  {
    id: 'mat-004',
    name: 'Golden Jojoba Seed Oil (Cold-Pressed)',
    category: 'Emollient',
    unit: 'ml',
    current_stock: 28400,
    minimum_safety_stock: 10000,
    cost_per_unit: 0.052,
    source_partner: 'Desert Bloom Organics',
    carbon_offset_per_kg: 1.1,
    notes: 'Pure wax ester composition identical to human sebum.'
  },
  {
    id: 'mat-005',
    name: 'Activated Coconut Shell Carbon (Steam Pyrolyzed)',
    category: 'Upcycled Bio-Waste',
    unit: 'g',
    current_stock: 31000,
    minimum_safety_stock: 12000,
    cost_per_unit: 0.032,
    source_partner: 'GreenCoast Bio-Energy & Carbon Lab',
    carbon_offset_per_kg: 3.4,
    notes: 'High surface area (1,100 m2/g) for micro-pore contaminant adsorption.'
  },
  {
    id: 'mat-006',
    name: 'Spent Arabica Coffee Grounds (Fine Grind)',
    category: 'Upcycled Bio-Waste',
    unit: 'g',
    current_stock: 19500,
    minimum_safety_stock: 10000,
    cost_per_unit: 0.016,
    source_partner: 'UrbanRoast Specialty Coffee Collective',
    carbon_offset_per_kg: 2.1,
    notes: 'Collected within 12 hours of brew, lyophilized to 3% residual moisture.'
  },
  {
    id: 'mat-007',
    name: 'Amber Glass Jar (100ml Cosmetic Grade)',
    category: 'Packaging',
    unit: 'units',
    current_stock: 1150,
    minimum_safety_stock: 450,
    cost_per_unit: 1.45,
    source_partner: 'EcoVessel Container Works',
    carbon_offset_per_kg: 0.6,
    notes: '70% post-consumer recycled glass; 100% recyclable infinitely.'
  },
  {
    id: 'mat-008',
    name: 'Brushed Aluminum Screw-Cap Lid',
    category: 'Packaging',
    unit: 'units',
    current_stock: 1320,
    minimum_safety_stock: 500,
    cost_per_unit: 0.65,
    source_partner: 'AluCraft Packaging Ltd',
    carbon_offset_per_kg: 0.4,
    notes: 'Fitted with biodegradable wood-pulp liner.'
  },
  {
    id: 'mat-009',
    name: 'Stone Paper Compostable Label (Foil Embellished)',
    category: 'Packaging',
    unit: 'units',
    current_stock: 2450,
    minimum_safety_stock: 600,
    cost_per_unit: 0.35,
    source_partner: 'TerraStone Print Lab',
    carbon_offset_per_kg: 0.9,
    notes: 'Calcium carbonate tree-free paper printed with non-toxic soy inks.'
  },
  {
    id: 'mat-010',
    name: 'Frosted Glass Pump Bottle (150ml)',
    category: 'Packaging',
    unit: 'units',
    current_stock: 310,
    minimum_safety_stock: 400, // Trigger low stock warning!
    cost_per_unit: 1.75,
    source_partner: 'EcoVessel Container Works',
    carbon_offset_per_kg: 0.5,
    notes: 'For cleanser line. Low stock warning active.'
  }
];

export const INITIAL_RECIPES: FormulationRecipeItem[] = [
  // Flagship Scrub (prod-001) per 1 unit (100ml jar):
  { id: 'rec-001', product_id: 'prod-001', raw_material_id: 'mat-001', required_amount_per_unit: 25, notes: '25g micronized coir' },
  { id: 'rec-002', product_id: 'prod-001', raw_material_id: 'mat-002', required_amount_per_unit: 12, notes: '12g papaya leaf extract' },
  { id: 'rec-003', product_id: 'prod-001', raw_material_id: 'mat-003', required_amount_per_unit: 30, notes: '30g raw wildflower honey' },
  { id: 'rec-004', product_id: 'prod-001', raw_material_id: 'mat-004', required_amount_per_unit: 15, notes: '15ml cold-pressed jojoba' },
  { id: 'rec-005', product_id: 'prod-001', raw_material_id: 'mat-007', required_amount_per_unit: 1, notes: '1x 100ml Amber glass jar' },
  { id: 'rec-006', product_id: 'prod-001', raw_material_id: 'mat-008', required_amount_per_unit: 1, notes: '1x Brushed aluminum lid' },
  { id: 'rec-007', product_id: 'prod-001', raw_material_id: 'mat-009', required_amount_per_unit: 1, notes: '1x Stone paper label' },

  // Charcoal Cleanser (prod-002) per 1 unit (150ml bottle):
  { id: 'rec-008', product_id: 'prod-002', raw_material_id: 'mat-005', required_amount_per_unit: 18, notes: '18g activated charcoal' },
  { id: 'rec-009', product_id: 'prod-002', raw_material_id: 'mat-004', required_amount_per_unit: 10, notes: '10ml jojoba' },
  { id: 'rec-010', product_id: 'prod-002', raw_material_id: 'mat-010', required_amount_per_unit: 1, notes: '1x Pump bottle' },
  { id: 'rec-011', product_id: 'prod-002', raw_material_id: 'mat-009', required_amount_per_unit: 1, notes: '1x Label' },

  // Eye Cream (prod-003) per 1 unit (15ml):
  { id: 'rec-012', product_id: 'prod-003', raw_material_id: 'mat-006', required_amount_per_unit: 15, notes: '15g spent coffee grounds' },
  { id: 'rec-013', product_id: 'prod-003', raw_material_id: 'mat-004', required_amount_per_unit: 5, notes: '5ml jojoba' },
  { id: 'rec-014', product_id: 'prod-003', raw_material_id: 'mat-009', required_amount_per_unit: 1, notes: '1x Label' }
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch-001',
    product_id: 'prod-001',
    batch_number: 'LOT-NG-2026-B81',
    status: 'Released',
    quantity_produced: 250,
    created_at: '2026-10-02',
    scheduled_completion: '2026-10-06',
    safety_check_notes: 'Microbial aerobic plate count < 10 CFU/g. Heavy metal screening passed (Pb, As, Cd below detectable limits). Texture & viscosity certified optimal.',
    quality_score: 99.4,
    tested_by: 'Dr. Aris Thorne (Chief Toxicologist)'
  },
  {
    id: 'batch-002',
    product_id: 'prod-001',
    batch_number: 'LOT-NG-2026-B82',
    status: 'QA',
    quantity_produced: 200,
    created_at: '2026-10-12',
    scheduled_completion: '2026-10-17',
    safety_check_notes: 'Enzyme degradation assay shows 98.7% active papain retention. Final 48hr microbial incubation underway.',
    quality_score: 98.6,
    tested_by: 'Maya Lin (QA Lead)'
  },
  {
    id: 'batch-003',
    product_id: 'prod-001',
    batch_number: 'LOT-NG-2026-B83',
    status: 'Pending Safety Clearance',
    quantity_produced: 150,
    created_at: '2026-10-18',
    scheduled_completion: '2026-10-23',
    safety_check_notes: 'Awaiting 72-hour challenge preservative testing and centrifuge stability audit.',
    tested_by: 'Kavita Patel (Production Specialist)'
  },
  {
    id: 'batch-004',
    product_id: 'prod-002',
    batch_number: 'LOT-NG-RND-C04',
    status: 'Production',
    quantity_produced: 50,
    created_at: '2026-10-19',
    scheduled_completion: '2026-10-25',
    safety_check_notes: 'Pilot batch test: evaluating suspension stability of activated charcoal particulates in aloe matrix.',
    tested_by: 'Dr. Aris Thorne'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'ORD-2026-9810',
    customer_name: 'Sophia Montgomery',
    customer_email: 'sophia.m@gmail.com',
    customer_address: '442 Kensington Way, Seattle, WA 98101',
    subtotal: 56.00,
    discount: 5.60,
    total_amount: 50.40,
    status: 'Delivered',
    created_at: '2026-10-14 14:22',
    tracking_code: 'NG-FEDEX-948201',
    items: [
      {
        product_id: 'prod-001',
        product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
        price: 28.00,
        quantity: 2,
        sku: 'NG-SCRUB-001'
      }
    ]
  },
  {
    id: 'ord-1002',
    order_number: 'ORD-2026-9811',
    customer_name: 'Julian Vance',
    customer_email: 'j.vance@designstudio.co',
    customer_address: '891 Pinecrest Blvd, Austin, TX 78704',
    subtotal: 28.00,
    discount: 0,
    total_amount: 28.00,
    status: 'Dispatched',
    created_at: '2026-10-18 09:40',
    tracking_code: 'NG-UPS-771920',
    items: [
      {
        product_id: 'prod-001',
        product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
        price: 28.00,
        quantity: 1,
        sku: 'NG-SCRUB-001'
      }
    ]
  },
  {
    id: 'ord-1003',
    order_number: 'ORD-2026-9812',
    customer_name: 'Aria Chen',
    customer_email: 'aria.chen@berkeley.edu',
    customer_address: '2204 Bancroft Way, Berkeley, CA 94720',
    subtotal: 84.00,
    discount: 16.80,
    total_amount: 67.20,
    status: 'Packaging',
    created_at: '2026-10-20 16:15',
    tracking_code: 'NG-USPS-331902',
    items: [
      {
        product_id: 'prod-001',
        product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
        price: 28.00,
        quantity: 3,
        sku: 'NG-SCRUB-001'
      }
    ]
  },
  {
    id: 'ord-1004',
    order_number: 'ORD-2026-9813',
    customer_name: 'Marcus Brody',
    customer_email: 'mbrody@ecotech.org',
    customer_address: '110 Commonwealth Ave, Boston, MA 02116',
    subtotal: 28.00,
    discount: 0,
    total_amount: 28.00,
    status: 'Processing',
    created_at: '2026-10-21 07:10',
    tracking_code: 'NG-PENDING-ALLOC',
    items: [
      {
        product_id: 'prod-001',
        product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
        price: 28.00,
        quantity: 1,
        sku: 'NG-SCRUB-001'
      }
    ]
  }
];

export const INITIAL_RND_PROJECTS: RNDProject[] = [
  {
    id: 'rnd-001',
    product_name: 'Charcoal & Aloe Deep Detox Cleanser',
    code_name: 'Project Obsidian Glow',
    stage: 'Microbial Stability Testing',
    progress_pct: 78,
    allocated_budget: 35000,
    spent_budget: 27400,
    lead_scientist: 'Dr. Elena Vance (Lead Bio-Chemist)',
    target_launch: 'Q2 2027',
    waste_stream_used: 'Steam pyrolyzed coconut shells from coastal copra mills',
    latest_log: 'Completed 60-day accelerated thermal stability chamber testing at 45°C. Zero phase separation observed.'
  },
  {
    id: 'rnd-002',
    product_name: 'Upcycled Coffee Bean Revitalizing Eye Cream',
    code_name: 'Project Auroral Caffeine',
    stage: 'Bench Formulation',
    progress_pct: 46,
    allocated_budget: 42000,
    spent_budget: 18900,
    lead_scientist: 'Tariq Al-Mansoor (Phyto-Formulation Lead)',
    target_launch: 'Q3 2027',
    waste_stream_used: 'Spent espresso grounds from artisanal cafe consortium',
    latest_log: 'Optimized supercritical CO2 extraction protocol; antioxidant polyphenol yield increased by 22% over solvent extraction.'
  },
  {
    id: 'rnd-003',
    product_name: 'Hibiscus Seed & Mango Butter Night Recovery Balm',
    code_name: 'Project Tropical Slumber',
    stage: 'Safety & Clinical Patch',
    progress_pct: 32,
    allocated_budget: 28000,
    spent_budget: 9200,
    lead_scientist: 'Dr. Aris Thorne',
    target_launch: 'Q4 2027',
    waste_stream_used: 'Discarded mango stones from industrial pulp canneries',
    latest_log: '50-subject Repeat Insult Patch Test (RIPT) enrolled. Zero contact dermatitis or allergenicity reported in Week 1.'
  }
];

export const INITIAL_WASTE_LOGS: WasteCollectionLog[] = [
  {
    id: 'wlog-001',
    waste_type: 'Coconut Husk Fiber Surplus',
    source_coop: 'GreenCoast Coastal Coconut Co-op',
    location: 'Kerala & Goa Maritime Belt',
    quantity_kg: 840,
    collected_at: '2026-09-28',
    co2_offset_kg: 1980,
    processing_yield_pct: 82
  },
  {
    id: 'wlog-002',
    waste_type: 'Papaya Leaf Pruning Waste',
    source_coop: 'SunValley Agro-Farms Alliance',
    location: 'Maharashtra Organic Orchards',
    quantity_kg: 420,
    collected_at: '2026-10-04',
    co2_offset_kg: 920,
    processing_yield_pct: 74
  },
  {
    id: 'wlog-003',
    waste_type: 'Spent Specialty Coffee Grounds',
    source_coop: 'UrbanRoast Specialty Coffee Collective',
    location: 'Pacific Northwest Cafe Network',
    quantity_kg: 310,
    collected_at: '2026-10-12',
    co2_offset_kg: 740,
    processing_yield_pct: 91
  },
  {
    id: 'wlog-004',
    waste_type: 'Mango Cannery Kernel Stones',
    source_coop: 'Konkan Fruit Processors Cooperative',
    location: 'Ratnagiri Belt',
    quantity_kg: 260,
    collected_at: '2026-10-16',
    co2_offset_kg: 580,
    processing_yield_pct: 68
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    product_id: 'prod-001',
    product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
    author: 'Clara Delacroix',
    rating: 5,
    date: '2026-10-14',
    comment: 'I usually break out in hives from gritty physical scrubs, but the micro-milled coir feels like soft velvet sand. The raw honey leaves a real moisturized glow instead of that stripped tight feeling. 10/10.',
    verified: true,
    sentiment: 'Positive',
    tags: ['Gentle Exfoliation', 'Glowing Skin', 'Soft Texture', 'Non-drying']
  },
  {
    id: 'rev-002',
    product_id: 'prod-001',
    product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
    author: 'Devon K.',
    rating: 5,
    date: '2026-10-11',
    comment: 'The fact that this uses discarded coconut husks and local papaya leaves instead of petroleum microbeads is legendary. Plus, the amber glass jar feels super luxurious in my bathroom.',
    verified: true,
    sentiment: 'Positive',
    tags: ['Eco Packaging', 'Gentle Exfoliation', 'Natural Scent']
  },
  {
    id: 'rev-003',
    product_id: 'prod-001',
    product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
    author: 'Nadia Rostova',
    rating: 4,
    date: '2026-10-09',
    comment: 'Incredible results on my congested T-zone after 2 weeks! My only note is that the aluminum lid was screwed on so tightly that I had to run it under warm water first. Great formulation though.',
    verified: true,
    sentiment: 'Neutral',
    tags: ['Jar Seal Tightness', 'Glowing Skin']
  },
  {
    id: 'rev-004',
    product_id: 'prod-001',
    product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
    author: 'Dr. Samuel V.',
    rating: 5,
    date: '2026-10-02',
    comment: 'As a dermatologist, physical exfoliators usually terrify me. NatureGlow got the particle micron size exactly right (under 80 microns) so the papain does the heavy lifting without causing micro-tears.',
    verified: true,
    sentiment: 'Positive',
    tags: ['Gentle Exfoliation', 'Non-drying', 'Natural Scent']
  },
  {
    id: 'rev-005',
    product_id: 'prod-001',
    product_name: '2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub',
    author: 'Hanna Lindstrom',
    rating: 4,
    date: '2026-09-27',
    comment: 'Smells delicious, like real honey and warm botanical sunshine. Would love a travel size tube option in the future!',
    verified: true,
    sentiment: 'Positive',
    tags: ['Natural Scent', 'Soft Texture']
  }
];
