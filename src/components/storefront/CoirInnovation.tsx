import React, { useState } from 'react';
import {
  Recycle,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Sliders,
  ChevronRight,
  Droplets,
  Trees,
  Sprout
} from 'lucide-react';

export const CoirInnovation: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [monthlyUsageJars, setMonthlyUsageJars] = useState(2);

  const steps = [
    {
      title: '1. Smallholder Agro-Waste Sourcing',
      subtitle: 'Diverting coconut husks & papaya pruning foliage from open burning',
      description: 'In tropical coconut farming communities, tons of coconut husks and papaya tree prunings are routinely burned as waste or left to decompose anaerobically, generating greenhouse gases. NatureGlow establishes direct fair-wage collection contracts with smallholder farm cooperatives, creating an auxiliary income stream for farmers while harvesting virgin fibrous raw materials.',
      icon: <Sprout className="w-5 h-5 text-emerald-500" />,
      stat: '840 kg diverted this month alone'
    },
    {
      title: '2. Eco-Steam Washing & Sub-80µm Micronization',
      subtitle: 'Precision cryogenic milling into spherical non-abrasive beads',
      description: 'Raw coconut coir undergoes high-pressure chemical-free steam sanitation, stripping residual salts and tannins. It is then cryogenic-milled and filtered through an 80-micron pharmaceutical mesh. Unlike jagged crushed walnut shells that create micro-fissures in facial epidermis, micronized coir forms smooth, cushiony spherical granules that glide softly.',
      icon: <Recycle className="w-5 h-5 text-teal-500" />,
      stat: '< 60 micron particle diameter'
    },
    {
      title: '3. Bioactive Enzymatic Infusion',
      subtitle: 'Synergistic marriage with active papain and wildflower raw honey',
      description: 'Physical scrub particles only work superficially unless paired with chemical cell renewal. NatureGlow cold-extracts proteolytic papain enzymes from fresh papaya leaves. As the micronized coir gently massages the skin, papain dissolves desmosomes (the protein glue binding dead skin cells), while raw wildflower honey floods the newly revealed epidermis with humectants.',
      icon: <Droplets className="w-5 h-5 text-amber-500" />,
      stat: '2,400 USP papain units/mg'
    },
    {
      title: '4. Closed-Loop Zero-Waste Drainage',
      subtitle: 'Completely biodegradable rinse-off with zero microplastics',
      description: 'Every time a conventional scrub is washed down the sink, thousands of synthetic polyethylene beads pass through municipal water filters straight into marine ecosystems. NatureGlow coir particles break down naturally into organic plant matter within 21 days in aquatic environments, leaving zero toxic legacy behind.',
      icon: <Trees className="w-5 h-5 text-emerald-600" />,
      stat: '0 synthetic microplastic residue'
    }
  ];

  // Real-time calculations based on slider
  const annualJars = monthlyUsageJars * 12;
  const wasteDivertedGrams = annualJars * 42;
  const microbeadsAvoided = annualJars * 1250;
  const co2AvoidedKg = (wasteDivertedGrams / 1000) * 2.8;

  return (
    <section id="coir-innovation" className="py-20 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Recycle className="w-3.5 h-3.5" />
            <span>The Business Model Differentiator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white">
            The Coir Innovation: From Agro-Waste to Luxury Exfoliant
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2">
            Why our circular enterprise model disrupts the $16B global exfoliation market by replacing toxic microplastics and harsh seed shells with gentle micronized coconut husk fibers.
          </p>
        </div>

        {/* 4-Step Interactive Circular Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Step Selector Buttons */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  activeStep === idx
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  activeStep === idx
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${
                      activeStep === idx ? 'text-emerald-900 dark:text-emerald-200' : 'text-zinc-900 dark:text-zinc-100'
                    }`}>
                      {step.title}
                    </h3>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      activeStep === idx ? 'text-emerald-600 rotate-90' : 'text-zinc-400'
                    }`} />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                    {step.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Step Deep-Dive Card */}
          <div className="lg:col-span-7 bg-gradient-to-br from-emerald-900/10 via-zinc-50 to-emerald-900/5 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-zinc-800/50 p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-lg">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Process Deep Dive</span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
              {steps[activeStep].title}
            </h3>
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
              {steps[activeStep].subtitle}
            </div>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mt-4">
              {steps[activeStep].description}
            </p>

            {/* Metric pill */}
            <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Validated Key Metric:</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {steps[activeStep].stat}
              </span>
            </div>
          </div>
        </div>

        {/* Exfoliant Comparison Matrix */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-white">
              Exfoliant Benchmark: Coir vs Traditional Competitors
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Why dermatologists and environmental agencies recommend our micronized circular formula.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300">
                  <th className="p-4 font-bold">Feature & Impact</th>
                  <th className="p-4 font-bold bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-x border-emerald-300/40">
                    🥥 NatureGlow Micronized Coir
                  </th>
                  <th className="p-4 font-bold">Plastic Microbeads</th>
                  <th className="p-4 font-bold">Crushed Walnut Shells</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-4 font-semibold">Particle Geometry</td>
                  <td className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold text-emerald-700 dark:text-emerald-300 border-x border-emerald-300/40">
                    Spherical, soft fibers (&lt;60µm)
                  </td>
                  <td className="p-4">Uniform plastic spheres</td>
                  <td className="p-4 text-red-500 font-medium">Jagged, sharp angular edges</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-4 font-semibold">Risk of Dermal Micro-Tears</td>
                  <td className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold text-emerald-700 dark:text-emerald-300 border-x border-emerald-300/40">
                    <span className="inline-flex items-center"><Check className="w-4 h-4 mr-1 text-emerald-500" /> 0% (Dermatologist safe)</span>
                  </td>
                  <td className="p-4"><span className="inline-flex items-center"><Check className="w-4 h-4 mr-1 text-emerald-500" /> Low micro-tear</span></td>
                  <td className="p-4 text-red-500"><span className="inline-flex items-center"><X className="w-4 h-4 mr-1 text-red-500" /> High (micro-inflammation)</span></td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-4 font-semibold">Environmental Drain Fate</td>
                  <td className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold text-emerald-700 dark:text-emerald-300 border-x border-emerald-300/40">
                    <span className="inline-flex items-center"><Check className="w-4 h-4 mr-1 text-emerald-500" /> 100% Bio-composts in 21 days</span>
                  </td>
                  <td className="p-4 text-red-500"><span className="inline-flex items-center"><X className="w-4 h-4 mr-1 text-red-500" /> Marine microplastic toxicity</span></td>
                  <td className="p-4">Organic biodegradation</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-4 font-semibold">Upcycled Raw Material Source</td>
                  <td className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold text-emerald-700 dark:text-emerald-300 border-x border-emerald-300/40">
                    <span className="inline-flex items-center"><Check className="w-4 h-4 mr-1 text-emerald-500" /> Rescued coastal agricultural waste</span>
                  </td>
                  <td className="p-4 text-red-500">Petroleum chemical synthesis</td>
                  <td className="p-4">Virgin food crop by-product</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Impact Calculator */}
        <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Personal Environmental ROI Calculator</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Calculate Your Real-World Impact
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80">
                Adjust how many jars of NatureGlow you or your household would use per month to visualize the plastic prevented and agricultural waste repurposed.
              </p>

              {/* Slider Input */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold text-emerald-200 mb-1">
                  <span>Monthly Jars:</span>
                  <span className="text-amber-400 font-bold text-base">{monthlyUsageJars} {monthlyUsageJars === 1 ? 'jar' : 'jars'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={monthlyUsageJars}
                  onChange={(e) => setMonthlyUsageJars(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-emerald-950 rounded-lg cursor-pointer"
                  aria-label="Monthly jars slider"
                />
                <div className="flex justify-between text-[10px] text-emerald-300/60 mt-1">
                  <span>1 jar / mo (Personal)</span>
                  <span>5 jars / mo (Family)</span>
                  <span>10 jars / mo (Salon / Spa)</span>
                </div>
              </div>
            </div>

            {/* Results Counters */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-2xl text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                  {wasteDivertedGrams.toLocaleString()} g
                </div>
                <div className="text-xs font-bold text-white mt-1">Agri-Waste Rescued</div>
                <div className="text-[11px] text-emerald-300/70 mt-0.5">Coconut husk & papaya leaves diverted annually</div>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-2xl text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">
                  {microbeadsAvoided.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-white mt-1">Plastic Beads Prevented</div>
                <div className="text-[11px] text-emerald-300/70 mt-0.5">Synthetic micro-particles kept out of oceans</div>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-2xl text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  {co2AvoidedKg.toFixed(1)} kg
                </div>
                <div className="text-xs font-bold text-white mt-1">CO2e Emissions Offset</div>
                <div className="text-[11px] text-emerald-300/70 mt-0.5">By preventing open agricultural burning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
