import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBatchRequirements,
  deductMaterialsForBatch,
  calculateCOGS,
  calculateSustainabilityScore,
  analyzeReviewSentiment,
  authenticateUser,
  registerUser,
  canAccessERP,
  canAccessERPModule,
  canManageCatalog
} from './businessLogic';
import { RawMaterial, FormulationRecipeItem, WasteCollectionLog, Review, AuthUser } from '../types';

test('calculateBatchRequirements correctly computes requirements and verifies sufficiency', () => {
  const mockMaterials: RawMaterial[] = [
    {
      id: 'm1',
      name: 'Coconut Coir Powder',
      category: 'Upcycled Bio-Waste',
      unit: 'g',
      current_stock: 500,
      minimum_safety_stock: 100,
      cost_per_unit: 0.02,
      source_partner: 'Co-op Farm',
      carbon_offset_per_kg: 1.2
    },
    {
      id: 'm2',
      name: 'Amber Glass Jar',
      category: 'Packaging',
      unit: 'units',
      current_stock: 50,
      minimum_safety_stock: 10,
      cost_per_unit: 1.5,
      source_partner: 'Eco Pack',
      carbon_offset_per_kg: 0.5
    }
  ];

  const mockRecipe: FormulationRecipeItem[] = [
    { id: 'r1', product_id: 'p1', raw_material_id: 'm1', required_amount_per_unit: 10 },
    { id: 'r2', product_id: 'p1', raw_material_id: 'm2', required_amount_per_unit: 1 }
  ];

  // Test case 1: Sufficient stock for 20 units
  const resultSufficient = calculateBatchRequirements(mockRecipe, 20, mockMaterials);
  assert.equal(resultSufficient.canProduce, true);
  assert.equal(resultSufficient.materialsRequired[0].requiredAmount, 200);
  assert.equal(resultSufficient.materialsRequired[0].isSufficient, true);
  assert.equal(resultSufficient.materialsRequired[1].requiredAmount, 20);
  assert.equal(resultSufficient.materialsRequired[1].isSufficient, true);

  // Test case 2: Insufficient stock for 60 units (only 50 jars available)
  const resultInsufficient = calculateBatchRequirements(mockRecipe, 60, mockMaterials);
  assert.equal(resultInsufficient.canProduce, false);
  assert.equal(resultInsufficient.maxPossibleUnits, 50); // Bottlenecked by 50 jars
  assert.equal(resultInsufficient.materialsRequired[1].isSufficient, false);
  assert.equal(resultInsufficient.materialsRequired[1].deficit, 10);
});

test('deductMaterialsForBatch cleanly reduces raw materials without going below zero', () => {
  const mockMaterials: RawMaterial[] = [
    {
      id: 'm1',
      name: 'Honey',
      category: 'Natural Active',
      unit: 'g',
      current_stock: 100,
      minimum_safety_stock: 20,
      cost_per_unit: 0.05,
      source_partner: 'Bee Farm',
      carbon_offset_per_kg: 0.8
    }
  ];

  const mockRecipe: FormulationRecipeItem[] = [
    { id: 'r1', product_id: 'p1', raw_material_id: 'm1', required_amount_per_unit: 2 }
  ];

  const updated = deductMaterialsForBatch(mockMaterials, mockRecipe, 10);
  assert.equal(updated[0].current_stock, 80);

  // Over-deduction clamp to 0
  const clamped = deductMaterialsForBatch(mockMaterials, mockRecipe, 60);
  assert.equal(clamped[0].current_stock, 0);
});

test('calculateCOGS computes material costs, margins, and gross profit accurately', () => {
  const mockMaterials: RawMaterial[] = [
    {
      id: 'm1',
      name: 'Papaya Leaf',
      category: 'Upcycled Bio-Waste',
      unit: 'g',
      current_stock: 1000,
      minimum_safety_stock: 100,
      cost_per_unit: 0.04,
      source_partner: 'Farm',
      carbon_offset_per_kg: 1.5
    },
    {
      id: 'm2',
      name: 'Glass Jar',
      category: 'Packaging',
      unit: 'units',
      current_stock: 100,
      minimum_safety_stock: 10,
      cost_per_unit: 1.20,
      source_partner: 'Glass Co',
      carbon_offset_per_kg: 0.4
    }
  ];

  const mockRecipe: FormulationRecipeItem[] = [
    { id: 'r1', product_id: 'p1', raw_material_id: 'm1', required_amount_per_unit: 20 }, // 20 * 0.04 = $0.80
    { id: 'r2', product_id: 'p1', raw_material_id: 'm2', required_amount_per_unit: 1 }    // 1 * 1.20 = $1.20
  ];

  // Retail: $28.00, Labor: $2.00. Total COGS = 0.80 + 1.20 + 2.00 = 4.00. Profit = 24.00. Margin = 85.7%
  const cogs = calculateCOGS(mockRecipe, mockMaterials, 28.00, 2.00);
  assert.equal(cogs.rawIngredientsCost, 0.80);
  assert.equal(cogs.packagingCost, 1.20);
  assert.equal(cogs.laborAndFacilityCost, 2.00);
  assert.equal(cogs.totalCOGS, 4.00);
  assert.equal(cogs.grossProfit, 24.00);
  assert.equal(cogs.grossMarginPct, 85.7);
});

test('calculateSustainabilityScore calculates waste mass, plastic avoidance, and index score', () => {
  const mockWasteLogs: WasteCollectionLog[] = [
    {
      id: 'w1',
      waste_type: 'Coconut Husks',
      source_coop: 'Coastal Farm',
      location: 'Goa',
      quantity_kg: 120,
      collected_at: '2026-10-01',
      co2_offset_kg: 240,
      processing_yield_pct: 78
    },
    {
      id: 'w2',
      waste_type: 'Papaya Leaf Trimmings',
      source_coop: 'Sun Valley Orchards',
      location: 'Pune',
      quantity_kg: 80,
      collected_at: '2026-10-10',
      co2_offset_kg: 160,
      processing_yield_pct: 85
    }
  ];

  const metrics = calculateSustainabilityScore(mockWasteLogs, 50);
  assert.equal(metrics.totalWasteUpcycledKg, 200);
  assert.equal(metrics.totalCO2OffsetKg, 400);
  assert.equal(metrics.microplasticBeadsReplacedEst, 50 * 1250);
  assert.equal(metrics.virginPlasticTubesDiverted, 50);
  assert.ok(metrics.circularEconomyIndex >= 80 && metrics.circularEconomyIndex <= 100);
});

test('analyzeReviewSentiment processes sentiment breakdown and flags feedback', () => {
  const mockReviews: Review[] = [
    {
      id: 'rv1',
      product_id: 'p1',
      product_name: 'Face Scrub',
      author: 'Maya S.',
      rating: 5,
      date: '2026-10-15',
      comment: 'Incredible glow! Gentle exfoliation and soft texture.',
      verified: true,
      sentiment: 'Positive',
      tags: ['Gentle Exfoliation', 'Glowing Skin', 'Soft Texture']
    },
    {
      id: 'rv2',
      product_id: 'p1',
      product_name: 'Face Scrub',
      author: 'Alex R.',
      rating: 3,
      date: '2026-10-16',
      comment: 'Love the scrub but the jar seal was loose upon opening.',
      verified: true,
      sentiment: 'Neutral',
      tags: ['Jar Seal Tightness', 'Natural Scent']
    }
  ];

  const result = analyzeReviewSentiment(mockReviews);
  assert.equal(result.totalReviews, 2);
  assert.equal(result.positiveCount, 1);
  assert.equal(result.neutralCount, 1);
  assert.equal(result.positivePct, 50.0);
  assert.equal(result.averageRating, 4.0);
  assert.ok(result.topFrictionTags.includes('Jar Seal Tightness'));
});

test('authenticateUser verifies valid credentials and rejects wrong passwords or unknown emails', () => {
  const users: AuthUser[] = [
    {
      id: 'u1',
      name: 'Admin User',
      email: 'admin@natureglow.in',
      password: 'Admin@123',
      role: 'admin',
      department: 'Executive',
      created_at: '2026-01-01',
      last_login: '2026-01-01'
    }
  ];

  const valid = authenticateUser(users, 'ADMIN@natureglow.in', 'Admin@123');
  assert.equal(valid.success, true);
  assert.equal(valid.user?.role, 'admin');

  const badPass = authenticateUser(users, 'admin@natureglow.in', 'WrongPass');
  assert.equal(badPass.success, false);
  assert.ok(badPass.error?.includes('Invalid password'));

  const unknown = authenticateUser(users, 'nobody@natureglow.in', 'Admin@123');
  assert.equal(unknown.success, false);
  assert.ok(unknown.error?.includes('No account found'));
});

test('registerUser allows Customer sign-up freely but enforces Security Key for Admin and Lab Tech', () => {
  const initialUsers: AuthUser[] = [];

  // 1. Standard customer registration succeeds without passcode
  const custReg = registerUser(initialUsers, {
    name: 'Riya Patel',
    email: 'riya@example.com',
    password: 'Password123',
    role: 'customer'
  });
  assert.equal(custReg.success, true);
  assert.equal(custReg.user?.role, 'customer');
  assert.equal(custReg.updatedUsers?.length, 1);

  // 2. Unauthorized attempt to register as Admin without security key is blocked
  const unauthorizedAdmin = registerUser(custReg.updatedUsers!, {
    name: 'Hacker User',
    email: 'hacker@example.com',
    password: 'Password123',
    role: 'admin',
    securityPasscode: 'WRONG-CODE'
  });
  assert.equal(unauthorizedAdmin.success, false);
  assert.ok(unauthorizedAdmin.error?.includes('Authorization Denied'));

  // 3. Authorized Admin registration with valid security key succeeds
  const authorizedAdmin = registerUser(custReg.updatedUsers!, {
    name: 'Authorized Director',
    email: 'director@natureglow.in',
    password: 'Password123',
    role: 'admin',
    securityPasscode: 'NG-ADMIN-2025'
  });
  assert.equal(authorizedAdmin.success, true);
  assert.equal(authorizedAdmin.user?.role, 'admin');
});

test('RBAC authorization helpers enforce module and catalog access strictly by role', () => {
  const adminUser: AuthUser = {
    id: '1',
    name: 'Admin',
    email: 'admin@natureglow.in',
    password: 'pw',
    role: 'admin',
    department: 'Root',
    created_at: '',
    last_login: ''
  };
  const labUser: AuthUser = {
    id: '2',
    name: 'Lab',
    email: 'lab@natureglow.in',
    password: 'pw',
    role: 'lab_tech',
    department: 'Lab',
    created_at: '',
    last_login: ''
  };
  const customerUser: AuthUser = {
    id: '3',
    name: 'Customer',
    email: 'cust@gmail.com',
    password: 'pw',
    role: 'customer',
    department: 'Retail',
    created_at: '',
    last_login: ''
  };

  assert.equal(canAccessERP(null), false);
  assert.equal(canAccessERP(customerUser), false);
  assert.equal(canAccessERP(labUser), true);
  assert.equal(canAccessERP(adminUser), true);

  assert.equal(canManageCatalog(null), false);
  assert.equal(canManageCatalog(customerUser), false);
  assert.equal(canManageCatalog(labUser), false);
  assert.equal(canManageCatalog(adminUser), true);

  // Lab tech can access M3 (Production) but not M5 (Financials)
  assert.equal(canAccessERPModule(labUser, 3), true);
  assert.equal(canAccessERPModule(labUser, 5), false);
  assert.equal(canAccessERPModule(adminUser, 5), true);
});

