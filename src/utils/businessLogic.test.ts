import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBatchRequirements,
  deductMaterialsForBatch,
  calculateCOGS,
  calculateSustainabilityScore,
  analyzeReviewSentiment
} from './businessLogic';
import { RawMaterial, FormulationRecipeItem, WasteCollectionLog, Review } from '../types';

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
