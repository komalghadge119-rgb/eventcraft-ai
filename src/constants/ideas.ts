/**
 * @fileoverview Curated creative personalized idea templates and category constants.
 * Extracted from fallback synthesizer to eliminate duplicated string literals and modularize idea catalogs.
 */

import type { PersonalizedIdea } from '../types/event';

export const IMPACT_VISUAL = 'High Visual Impact' as const;
export const IMPACT_SIGNATURE = 'Signature Experience' as const;
export const IMPACT_VIRAL = 'Viral & Social' as const;
export const IMPACT_EMOTIONAL = 'Emotional Resonance' as const;

export const BUDGET_MODERATE = 'Moderate' as const;
export const BUDGET_LOW_ROI = 'Low-Cost High-ROI' as const;

export const CAT_DECOR = 'Decor & Ambiance' as const;
export const CAT_CULINARY = 'Culinary & Mixology' as const;
export const CAT_ENTERTAINMENT = 'Interactive Entertainment' as const;
export const CAT_KEEPSAKES = 'Attendee Keepsakes' as const;
export const CAT_EXPERIENTIAL = 'Experiential Moments' as const;

export const WEDDING_IDEAS: readonly PersonalizedIdea[] = [
  {
    id: 'idea-w1',
    title: 'Botanical Floral Arch with Micro-Mist Scent Infusion',
    category: CAT_DECOR,
    description: 'Living floral canopy suspended over the aisle featuring subtle jasmine and white amber micro-mist diffusion timed to the processional entrance.',
    impactTag: IMPACT_VISUAL,
    estimatedBudgetImpact: BUDGET_MODERATE,
    isFavorited: true,
  },
  {
    id: 'idea-w2',
    title: 'Bespoke Dual-Heritage Molecular Mocktail Bar',
    category: CAT_CULINARY,
    description: 'Interactive cocktail alchemy station offering customized drinks named after the couple’s milestone travel memories with edible gold leaf and dry ice presentation.',
    impactTag: IMPACT_SIGNATURE,
    estimatedBudgetImpact: 'Low (Within F&B)',
    isFavorited: false,
  },
  {
    id: 'idea-w3',
    title: 'Vintage Rotary Phone Audio Guestbook Station',
    category: CAT_EXPERIENTIAL,
    description: '1940s French rotary telephone booth where guests leave unscripted voice notes, preserved into a pressed vinyl record album keepsake for the couple.',
    impactTag: IMPACT_EMOTIONAL,
    estimatedBudgetImpact: BUDGET_LOW_ROI,
    isFavorited: true,
  },
  {
    id: 'idea-w4',
    title: 'Calligraphed Seed-Paper Placecards & Seedling Favors',
    category: CAT_KEEPSAKES,
    description: 'Hand-lettered plantable seed paper containing native wildflower seeds, paired with custom engraved ceramic mini-pots as sustainable celebratory favors.',
    impactTag: IMPACT_EMOTIONAL,
    estimatedBudgetImpact: BUDGET_LOW_ROI,
    isFavorited: false,
  },
  {
    id: 'idea-w5',
    title: 'Acoustic String Quartet Bridging Pop & Classical Anthems',
    category: CAT_ENTERTAINMENT,
    description: 'Classical string ensemble performing cinematic renditions of contemporary indie and film scores during arrival and cocktail transition periods.',
    impactTag: IMPACT_VISUAL,
    estimatedBudgetImpact: BUDGET_MODERATE,
    isFavorited: false,
  },
] as const;

export const HACKATHON_IDEAS: readonly PersonalizedIdea[] = [
  {
    id: 'idea-h1',
    title: '2:00 AM Midnight Nitrogen Barista Sprint & Energy Lounge',
    category: CAT_CULINARY,
    description: 'Artisanal cold-brew and espresso bar featuring custom flavored syrups, high-protein bento bowls, and electro-electrolyte boosters to sustain night hacking.',
    impactTag: IMPACT_SIGNATURE,
    estimatedBudgetImpact: BUDGET_MODERATE,
    isFavorited: true,
  },
  {
    id: 'idea-h2',
    title: 'Real-Time Cyberpunk Terminal Git Commit Mosaic Wall',
    category: CAT_EXPERIENTIAL,
    description: 'Live projector visualizer mapping repo commits into dynamic pixel art towers, celebrating milestones whenever teams push passing test suites.',
    impactTag: IMPACT_VIRAL,
    estimatedBudgetImpact: BUDGET_LOW_ROI,
    isFavorited: true,
  },
  {
    id: 'idea-h3',
    title: 'Limited-Edition Hardware & Enamel Developer Badge Patches',
    category: CAT_KEEPSAKES,
    description: 'Tactile embroidered cyberpunk skill patches and PCB keychains unlocked when hackers demo working hardware or AI agent integrations.',
    impactTag: IMPACT_VISUAL,
    estimatedBudgetImpact: 'Low (Within Swag)',
    isFavorited: false,
  },
  {
    id: 'idea-h4',
    title: 'Ergonomic Acoustic Lo-Fi Soundproof Breakout Domes',
    category: CAT_DECOR,
    description: 'Quiet geometric sleep/brainstorm geodesic domes equipped with noise-dampening panels, beanbags, and binaural lo-fi audio feeds.',
    impactTag: IMPACT_SIGNATURE,
    estimatedBudgetImpact: BUDGET_MODERATE,
    isFavorited: false,
  },
  {
    id: 'idea-h5',
    title: '60-Second Lightning Pitch Gong Show with Live Peer Voting',
    category: CAT_ENTERTAINMENT,
    description: 'Fast-paced demo showcase where crowd decibel meters and live QR voting determine people’s choice finalist seeds before judge deliberation.',
    impactTag: IMPACT_VIRAL,
    estimatedBudgetImpact: BUDGET_LOW_ROI,
    isFavorited: false,
  },
] as const;

export const DEFAULT_IDEAS: readonly PersonalizedIdea[] = [
  {
    id: 'idea-b1',
    title: 'Neon Noir Immersion Room & Instant Holographic Prints',
    category: CAT_EXPERIENTIAL,
    description: 'Futuristic mirrored infinity cube photo experience producing instant credit-card-sized holographic motion prints for attendees to take home.',
    impactTag: IMPACT_VIRAL,
    estimatedBudgetImpact: BUDGET_MODERATE,
    isFavorited: true,
  },
  {
    id: 'idea-b2',
    title: 'Smoke & Bubble Molecular Mixology Masterclass Station',
    category: CAT_CULINARY,
    description: 'Interactive drink lab where guests pop edible citrus aroma vapor bubbles atop color-shifting butterfly pea flower signature cocktails.',
    impactTag: IMPACT_SIGNATURE,
    estimatedBudgetImpact: BUDGET_MODERATE,
    isFavorited: false,
  },
  {
    id: 'idea-b3',
    title: 'Multi-Channel Silent Disco with Headphone LED Battle',
    category: CAT_ENTERTAINMENT,
    description: '3 simultaneous DJs (House, Throwback Hits, Afrobeats) where headphones glow red, blue, or green to reveal which music channel is dominating the floor.',
    impactTag: IMPACT_VISUAL,
    estimatedBudgetImpact: BUDGET_MODERATE,
    isFavorited: true,
  },
  {
    id: 'idea-b4',
    title: 'Custom Screenprinted Canvas Tote Bags Crafted Live On-Site',
    category: CAT_KEEPSAKES,
    description: 'Live screenprinting station where guests select their favorite event motif and ink color to watch their personalized tote bag printed in 90 seconds.',
    impactTag: IMPACT_EMOTIONAL,
    estimatedBudgetImpact: BUDGET_LOW_ROI,
    isFavorited: false,
  },
  {
    id: 'idea-b5',
    title: 'Starlight Ceiling Projection Mapping with Golden Sparkler Finale',
    category: CAT_DECOR,
    description: 'Constellation sky projections synced to ambient deep house rhythms, culminating in indoor cold-spark fountain cascades during milestone toast.',
    impactTag: IMPACT_VISUAL,
    estimatedBudgetImpact: BUDGET_MODERATE,
    isFavorited: false,
  },
] as const;
