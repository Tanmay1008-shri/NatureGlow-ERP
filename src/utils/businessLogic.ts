import {
  RawMaterial,
  FormulationRecipeItem,
  WasteCollectionLog,
  Review,
  AuthUser,
  UserRole
} from '../types';

export interface BatchRequirementResult {
  canProduce: boolean;
  maxPossibleUnits: number;
  materialsRequired: {
    materialId: string;
    materialName: string;
    unit: string;
    requiredAmount: number;
    availableStock: number;
    isSufficient: boolean;
    deficit: number;
  }[];
}

/**
 * Calculates raw material requirements for producing a target number of units
 * based on the product's formulation recipe.
 */
export function calculateBatchRequirements(
  recipeItems: FormulationRecipeItem[],
  targetUnits: number,
  allMaterials: RawMaterial[]
): BatchRequirementResult {
  if (targetUnits <= 0) {
    return {
      canProduce: false,
      maxPossibleUnits: 0,
      materialsRequired: []
    };
  }

  let canProduce = true;
  let maxPossibleUnits = Infinity;

  const materialsRequired = recipeItems.map((item) => {
    const material = allMaterials.find((m) => m.id === item.raw_material_id);
    const materialName = material ? material.name : `Unknown (${item.raw_material_id})`;
    const unit = material ? material.unit : 'units';
    const availableStock = material ? material.current_stock : 0;
    const requiredAmount = item.required_amount_per_unit * targetUnits;

    const isSufficient = availableStock >= requiredAmount;
    if (!isSufficient) {
      canProduce = false;
    }

    if (item.required_amount_per_unit > 0) {
      const possibleWithThisMaterial = Math.floor(availableStock / item.required_amount_per_unit);
      if (possibleWithThisMaterial < maxPossibleUnits) {
        maxPossibleUnits = possibleWithThisMaterial;
      }
    }

    return {
      materialId: item.raw_material_id,
      materialName,
      unit,
      requiredAmount: Number(requiredAmount.toFixed(2)),
      availableStock,
      isSufficient,
      deficit: isSufficient ? 0 : Number((requiredAmount - availableStock).toFixed(2))
    };
  });

  if (maxPossibleUnits === Infinity) {
    maxPossibleUnits = 0;
  }

  return {
    canProduce,
    maxPossibleUnits,
    materialsRequired
  };
}

/**
 * Deducts materials from inventory when executing a batch.
 */
export function deductMaterialsForBatch(
  allMaterials: RawMaterial[],
  recipeItems: FormulationRecipeItem[],
  unitsToProduce: number
): RawMaterial[] {
  const deductionsMap = new Map<string, number>();

  recipeItems.forEach((item) => {
    const totalNeeded = item.required_amount_per_unit * unitsToProduce;
    deductionsMap.set(item.raw_material_id, totalNeeded);
  });

  return allMaterials.map((material) => {
    if (deductionsMap.has(material.id)) {
      const deduction = deductionsMap.get(material.id)!;
      const updatedStock = Math.max(0, Number((material.current_stock - deduction).toFixed(2)));
      return {
        ...material,
        current_stock: updatedStock
      };
    }
    return material;
  });
}

/**
 * Calculates Cost of Goods Sold (COGS) and profit margin for a product
 */
export interface COGSBreakdown {
  rawIngredientsCost: number;
  packagingCost: number;
  laborAndFacilityCost: number;
  totalCOGS: number;
  retailPrice: number;
  grossProfit: number;
  grossMarginPct: number;
}

export function calculateCOGS(
  recipeItems: FormulationRecipeItem[],
  allMaterials: RawMaterial[],
  retailPrice: number,
  laborAndFacilityCost: number = 2.20
): COGSBreakdown {
  let rawIngredientsCost = 0;
  let packagingCost = 0;

  recipeItems.forEach((item) => {
    const material = allMaterials.find((m) => m.id === item.raw_material_id);
    if (material) {
      const costForUnit = item.required_amount_per_unit * material.cost_per_unit;
      if (material.category === 'Packaging') {
        packagingCost += costForUnit;
      } else {
        rawIngredientsCost += costForUnit;
      }
    }
  });

  const totalCOGS = Number((rawIngredientsCost + packagingCost + laborAndFacilityCost).toFixed(2));
  const grossProfit = Number((retailPrice - totalCOGS).toFixed(2));
  const grossMarginPct = retailPrice > 0 ? Number(((grossProfit / retailPrice) * 100).toFixed(1)) : 0;

  return {
    rawIngredientsCost: Number(rawIngredientsCost.toFixed(2)),
    packagingCost: Number(packagingCost.toFixed(2)),
    laborAndFacilityCost,
    totalCOGS,
    retailPrice,
    grossProfit,
    grossMarginPct
  };
}

/**
 * Calculates enterprise environmental savings metrics
 */
export interface SustainabilityMetrics {
  totalWasteUpcycledKg: number;
  totalCO2OffsetKg: number;
  microplasticBeadsReplacedEst: number;
  virginPlasticTubesDiverted: number;
  circularEconomyIndex: number; // 0 to 100
}

export function calculateSustainabilityScore(
  wasteLogs: WasteCollectionLog[],
  unitsSold: number
): SustainabilityMetrics {
  const totalWasteUpcycledKg = wasteLogs.reduce((acc, log) => acc + log.quantity_kg, 0);
  const totalCO2OffsetKg = wasteLogs.reduce((acc, log) => acc + log.co2_offset_kg, 0);
  
  // Each 100ml jar of face scrub with coir exfoliant eliminates ~1,200 microplastic beads
  const microplasticBeadsReplacedEst = unitsSold * 1250;
  // Glass packaging and compostable labels eliminate 1 virgin plastic tube per unit
  const virginPlasticTubesDiverted = unitsSold;

  // Circular Economy index composite: upcycled mass + verified farms + packaging loop
  // Scale between 75 and 99.5 for brand health
  const baseIndex = 82;
  const growthFactor = Math.min(17.5, (totalWasteUpcycledKg / 100) * 0.5 + (unitsSold / 50) * 0.3);
  const circularEconomyIndex = Number((baseIndex + growthFactor).toFixed(1));

  return {
    totalWasteUpcycledKg: Number(totalWasteUpcycledKg.toFixed(1)),
    totalCO2OffsetKg: Number(totalCO2OffsetKg.toFixed(1)),
    microplasticBeadsReplacedEst,
    virginPlasticTubesDiverted,
    circularEconomyIndex: Math.min(99.9, circularEconomyIndex)
  };
}

/**
 * Summarizes customer review sentiment and identifies key topics
 */
export interface SentimentAnalysisResult {
  totalReviews: number;
  positiveCount: number;
  neutralCount: number;
  criticalCount: number;
  positivePct: number;
  averageRating: number;
  topPositiveTags: string[];
  topFrictionTags: string[];
  actionableInsights: string[];
}

export function analyzeReviewSentiment(reviews: Review[]): SentimentAnalysisResult {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      positiveCount: 0,
      neutralCount: 0,
      criticalCount: 0,
      positivePct: 0,
      averageRating: 0,
      topPositiveTags: [],
      topFrictionTags: [],
      actionableInsights: ['No customer feedback logged yet.']
    };
  }

  let positiveCount = 0;
  let neutralCount = 0;
  let criticalCount = 0;
  let ratingSum = 0;

  const tagCounts = new Map<string, number>();

  reviews.forEach((r) => {
    ratingSum += r.rating;
    if (r.sentiment === 'Positive') positiveCount++;
    else if (r.sentiment === 'Neutral') neutralCount++;
    else criticalCount++;

    r.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const totalReviews = reviews.length;
  const positivePct = Number(((positiveCount / totalReviews) * 100).toFixed(1));
  const averageRating = Number((ratingSum / totalReviews).toFixed(1));

  // Sort tags by frequency
  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  const topPositiveTags = sortedTags.filter((t) =>
    ['Gentle Exfoliation', 'Glowing Skin', 'Natural Scent', 'Eco Packaging', 'Soft Texture', 'Non-drying'].includes(t)
  ).slice(0, 4);

  const topFrictionTags = sortedTags.filter((t) =>
    ['Jar Seal Tightness', 'Coir Particle Coarseness', 'High Price', 'Stock Waiting List', 'Delivery Speed'].includes(t)
  ).slice(0, 3);

  const actionableInsights: string[] = [];
  if (positivePct >= 80) {
    actionableInsights.push('Strong customer endorsement on gentle botanical exfoliation and non-drying honey finish.');
  }
  if (topFrictionTags.includes('Jar Seal Tightness')) {
    actionableInsights.push('Production QA advisory: Inspect aluminum lid torque during packaging phase to ensure airtight seal in hot transit.');
  }
  if (topFrictionTags.includes('Coir Particle Coarseness')) {
    actionableInsights.push('R&D formulation note: Maintain milling screen mesh at <= 80 microns for sensitive skin comfort.');
  }

  return {
    totalReviews,
    positiveCount,
    neutralCount,
    criticalCount,
    positivePct,
    averageRating,
    topPositiveTags,
    topFrictionTags,
    actionableInsights
  };
}

/**
 * Role-Based Access Control (RBAC) & Authentication Pure Logic
 */
export const ROLE_SECURITY_PASSCODES: Record<'admin' | 'lab_tech', string> = {
  admin: 'NG-ADMIN-2025',
  lab_tech: 'NG-LAB-2025'
};

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  updatedUsers?: AuthUser[];
  error?: string;
}

export function authenticateUser(
  users: AuthUser[],
  emailInput: string,
  passwordInput: string
): AuthResult {
  const cleanEmail = emailInput.trim().toLowerCase();
  if (!cleanEmail || !passwordInput) {
    return {
      success: false,
      error: 'Please enter both your email address and password.'
    };
  }

  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!found) {
    return {
      success: false,
      error: 'No account found with that email address. Please check your email or sign up.'
    };
  }

  if (found.password !== passwordInput) {
    return {
      success: false,
      error: 'Invalid password for this account. Please verify your credentials.'
    };
  }

  const authenticatedUser: AuthUser = {
    ...found,
    last_login: new Date().toISOString().slice(0, 16).replace('T', ' ')
  };

  return {
    success: true,
    user: authenticatedUser
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  securityPasscode?: string;
}

export function registerUser(
  users: AuthUser[],
  input: RegisterInput
): AuthResult {
  const cleanName = input.name.trim();
  const cleanEmail = input.email.trim().toLowerCase();

  if (!cleanName || cleanName.length < 2) {
    return {
      success: false,
      error: 'Please enter your full name (at least 2 characters).'
    };
  }

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return {
      success: false,
      error: 'Please enter a valid email address.'
    };
  }

  if (!input.password || input.password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long.'
    };
  }

  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please sign in instead.'
    };
  }

  // Enforce role elevation authorization passcode for Admin & Lab Tech
  if (input.role === 'admin') {
    if ((input.securityPasscode || '').trim() !== ROLE_SECURITY_PASSCODES.admin) {
      return {
        success: false,
        error: 'Authorization Denied: Valid Corporate Admin Security Key (NG-ADMIN-2025) is required to provision an Admin account.'
      };
    }
  } else if (input.role === 'lab_tech') {
    if ((input.securityPasscode || '').trim() !== ROLE_SECURITY_PASSCODES.lab_tech) {
      return {
        success: false,
        error: 'Authorization Denied: Valid Laboratory Security Key (NG-LAB-2025) is required to provision a Lab Technician account.'
      };
    }
  }

  const departmentMap: Record<UserRole, string> = {
    admin: 'Corporate Executive & ERP Root',
    lab_tech: 'Formulation Lab & Batch QA',
    customer: 'Verified Retail Customer'
  };

  const nowStr = new Date().toISOString().slice(0, 10);
  const newUser: AuthUser = {
    id: `usr-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    password: input.password,
    role: input.role,
    department: departmentMap[input.role],
    created_at: nowStr,
    last_login: `${nowStr} Just now`
  };

  return {
    success: true,
    user: newUser,
    updatedUsers: [...users, newUser]
  };
}

/**
 * Checks whether the current user is authorized to enter the Enterprise ERP portal
 */
export function canAccessERP(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'lab_tech';
}

/**
 * Checks whether the current user is authorized to view/operate a specific ERP module (1-8)
 * Admin: All modules 1-8
 * Lab Tech: Modules 1 (Operations Read-only), 2 (Inventory), 3 (Production), 6 (Circularity), 8 (Security Read-only)
 * Customer / Guest: None
 */
export function canAccessERPModule(user: AuthUser | null, moduleId: number): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'lab_tech') {
    return [1, 2, 3, 6, 8].includes(moduleId);
  }
  return false;
}

/**
 * Checks whether the current user is authorized to add/edit/delete products & ₹ INR prices
 */
export function canManageCatalog(user: AuthUser | null): boolean {
  return Boolean(user && user.role === 'admin');
}

