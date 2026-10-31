/**
 * @fileoverview Deterministic fallback event plan synthesizer for AuraPlan AI.
 * Produces mathematically precise event blueprints without requiring any API key.
 * Used as an offline fallback when Gemini API is unavailable or rate-limited.
 */

import type { EventInput, EventPlan, BudgetCategory, TimelineItem, VendorTask, RiskContingency, GuestItem, PersonalizedIdea } from '../types/event';
import {
  BUDGET_SHARES,
  BUDGET_CATEGORY_LABELS,
  CONTINGENCY_RESERVE_RATE,
} from '../constants';

/**
 * Computes the 5-pillar budget allocation with a 12% dynamic contingency reserve.
 * Mathematical invariant: total = sum(categories.allocated) + contingencyReserve.
 * @param {number} totalBudget - The total available budget amount.
 * @param {string} currency - The ISO 4217 currency code.
 * @returns {{ categories: BudgetCategory[]; contingencyReserve: number }} The computed allocation.
 */
export function computeBudgetAllocation(
  totalBudget: number,
  currency: string
): { categories: BudgetCategory[]; contingencyReserve: number } {
  const contingencyReserve = Math.round(totalBudget * CONTINGENCY_RESERVE_RATE);
  const allocatable = totalBudget - contingencyReserve;

  const tips: readonly string[] = [
    `Negotiate venue packages including AV setup. Consider off-peak dates for ${currency} savings.`,
    `Book catering tastings 8 weeks ahead. Confirm dietary accommodations for all allergy profiles.`,
    `Source local artisan decor for authenticity. LED uplighting reduces power costs vs traditional fixtures.`,
    `Lock emcee and DJ contracts with cancellation clauses. Pre-record backup playlists as contingency.`,
    `Order personalized favors 6 weeks ahead. Arrange shuttle services for guest convenience and safety.`,
  ] as const;

  const categories: BudgetCategory[] = BUDGET_SHARES.map((share, index) => ({
    category: BUDGET_CATEGORY_LABELS[index],
    allocated: Math.round(allocatable * share),
    percentage: Math.round(share * 100),
    tips: tips[index],
    actualSpent: 0,
  }));

  return { categories, contingencyReserve };
}

/**
 * Generates a deterministic timeline itinerary based on event duration and type.
 * Includes friction-damped 15-30 minute transition buffers between activities.
 * @param {number} durationHours - Total event duration in hours.
 * @param {string} eventType - The type of event for phase customization.
 * @returns {TimelineItem[]} Ordered array of timeline activities.
 */
function generateTimeline(_durationHours: number, eventType: string): TimelineItem[] {
  const isWedding = eventType.toLowerCase().includes('wedding');
  const isHackathon = eventType.toLowerCase().includes('hackathon');

  if (isHackathon) {
    return [
      { time: '09:00 AM', phase: 'Arrival', activity: 'Registration & Badge Pickup', details: 'Teams check in, receive swag kits, and set up workstations with power and networking.', bufferMinutes: 30, completed: false },
      { time: '10:00 AM', phase: 'Core Ceremony', activity: 'Opening Keynote & Challenge Reveal', details: 'Sponsors present challenge statements. Rules and judging criteria announced.', bufferMinutes: 15, completed: false },
      { time: '11:00 AM', phase: 'Core Ceremony', activity: 'Hacking Begins', details: 'Teams start building. Mentor office hours open. API credits distributed.', bufferMinutes: 20, completed: false },
      { time: '06:00 PM', phase: 'Reception', activity: 'Dinner & Lightning Talks', details: 'Catered dinner with sponsor lightning talks and networking opportunities.', bufferMinutes: 30, completed: false },
      { time: '11:00 PM', phase: 'Core Ceremony', activity: 'Midnight Energy Boost', details: 'Late-night snacks, energy drinks, and mini-games to keep momentum.', bufferMinutes: 20, completed: false },
      { time: '08:00 AM', phase: 'Reception', activity: 'Day 2 Breakfast & Check-in', details: 'Healthy breakfast options. Progress check with mentors. Final sprint begins.', bufferMinutes: 15, completed: false },
      { time: '02:00 PM', phase: 'Core Ceremony', activity: 'Code Freeze & Submissions', details: 'All projects submitted. Teams prepare 3-minute demo pitches.', bufferMinutes: 30, completed: false },
      { time: '03:30 PM', phase: 'Reception', activity: 'Demo Presentations & Judging', details: 'Teams present to judges panel. Audience voting for People\'s Choice award.', bufferMinutes: 20, completed: false },
      { time: '05:00 PM', phase: 'Wrap-up', activity: 'Awards Ceremony & Closing', details: 'Winners announced. Prizes distributed. Group photo and networking mixer.', bufferMinutes: 15, completed: false },
    ];
  }

  if (isWedding) {
    return [
      { time: '04:00 PM', phase: 'Arrival', activity: 'Guest Reception & Welcome Drinks', details: 'Guests arrive to a curated welcome experience with artisanal beverages and live ambient music.', bufferMinutes: 30, completed: false },
      { time: '05:00 PM', phase: 'Core Ceremony', activity: 'Grand Processional Entry', details: 'The ceremonial procession with traditional music, floral pathways, and dramatic lighting cues.', bufferMinutes: 20, completed: false },
      { time: '05:30 PM', phase: 'Core Ceremony', activity: 'Sacred Ceremony & Vow Exchange', details: 'The main ceremonial proceedings with officiant, cultural rituals, and exchange of vows.', bufferMinutes: 15, completed: false },
      { time: '06:30 PM', phase: 'Core Ceremony', activity: 'Ring Exchange & Blessing', details: 'Exchange of rings followed by the blessing ceremony and family photo session.', bufferMinutes: 20, completed: false },
      { time: '07:00 PM', phase: 'Reception', activity: 'Cocktail Hour & Live Entertainment', details: 'Signature cocktails with live band performance while dinner setup completes.', bufferMinutes: 30, completed: false },
      { time: '08:00 PM', phase: 'Reception', activity: 'Grand Dinner Banquet', details: 'Multi-course seated dinner with dietary accommodations. Toasts and speeches.', bufferMinutes: 20, completed: false },
      { time: '09:30 PM', phase: 'Reception', activity: 'First Dance & Open Dance Floor', details: 'Choreographed first dance followed by open dance floor with DJ and live musicians.', bufferMinutes: 15, completed: false },
      { time: '10:30 PM', phase: 'Reception', activity: 'Dessert Cascade & Cake Cutting', details: 'Grand dessert display with ceremonial cake cutting. Photo opportunities.', bufferMinutes: 20, completed: false },
      { time: '11:00 PM', phase: 'Wrap-up', activity: 'Farewell & Sparkler Send-off', details: 'Distribution of favors, sparkler-lined exit walkway, and departing guest coordination.', bufferMinutes: 15, completed: false },
    ];
  }

  /* Default milestone birthday / soirée timeline */
  return [
    { time: '07:00 PM', phase: 'Arrival', activity: 'Red Carpet Arrival & Welcome Drinks', details: 'Guests arrive to a curated cocktail reception with ambient lounge music and photo opportunities.', bufferMinutes: 30, completed: false },
    { time: '07:45 PM', phase: 'Core Ceremony', activity: 'Grand Entrance & Toast', details: 'Host makes a dramatic entrance. Welcome toast with premium champagne.', bufferMinutes: 20, completed: false },
    { time: '08:15 PM', phase: 'Reception', activity: 'Seated Dinner & Entertainment', details: 'Multi-course dinner paired with live acoustic performance and video tribute montage.', bufferMinutes: 20, completed: false },
    { time: '09:30 PM', phase: 'Core Ceremony', activity: 'Cake Reveal & Speeches', details: 'Dramatic cake reveal with custom design. Heartfelt speeches from inner circle.', bufferMinutes: 15, completed: false },
    { time: '10:00 PM', phase: 'Reception', activity: 'Dance Floor & DJ Set', details: 'High-energy DJ set with curated playlist. Interactive photo booth with themed props.', bufferMinutes: 20, completed: false },
    { time: '11:00 PM', phase: 'Wrap-up', activity: 'Midnight Dessert & Farewell', details: 'Dessert cascade station. Personalized favor distribution and sparkler send-off.', bufferMinutes: 15, completed: false },
  ];
}

/**
 * Generates a deterministic vendor procurement checklist with SLA clauses.
 * @param {string} eventType - The type of event for vendor customization.
 * @returns {VendorTask[]} Array of vendor procurement tasks with deadlines and priorities.
 */
function generateVendorChecklist(eventType: string): VendorTask[] {
  const isWedding = eventType.toLowerCase().includes('wedding');
  const tasks: VendorTask[] = [
    { id: 'v1', category: 'Venue', task: `Book ${isWedding ? 'ceremony & reception venue with bridal suite' : 'primary event space with AV capabilities'}`, deadlineWeeksBefore: 24, priority: 'High', negotiationCheck: 'Include force majeure clause, overtime rates, and cancellation refund schedule in contract.', completed: false },
    { id: 'v2', category: 'Catering', task: 'Finalize catering menu with dietary accommodations and tasting session', deadlineWeeksBefore: 12, priority: 'High', negotiationCheck: 'Require per-person pricing cap, staff-to-guest ratio guarantee (1:15), and backup supplier clause.', completed: false },
    { id: 'v3', category: 'Decor', task: 'Lock floral, lighting, and atmospheric design with mood board approval', deadlineWeeksBefore: 10, priority: 'Medium', negotiationCheck: 'Include setup/teardown timeline in contract. Specify exact color references (Pantone or HEX).', completed: false },
    { id: 'v4', category: 'Media', task: 'Book photographer, videographer, and social media coverage team', deadlineWeeksBefore: 16, priority: 'High', negotiationCheck: 'Define deliverables timeline (edited photos in 4 weeks, video in 8 weeks). Include raw files clause.', completed: false },
    { id: 'v5', category: 'Entertainment', task: `Secure ${isWedding ? 'band, DJ, and ceremony musicians' : 'DJ, emcee, and interactive entertainment'}`, deadlineWeeksBefore: 14, priority: 'High', negotiationCheck: 'Include sound check schedule, equipment requirements, and backup performer clause.', completed: false },
    { id: 'v6', category: 'Logistics', task: 'Arrange transportation, valet parking, and guest shuttle coordination', deadlineWeeksBefore: 6, priority: 'Medium', negotiationCheck: 'Confirm vehicle types, capacity, route timing, and weather contingency for outdoor transfers.', completed: false },
    { id: 'v7', category: 'Stationery', task: 'Design, print, and distribute invitations and event collateral', deadlineWeeksBefore: 16, priority: 'Medium', negotiationCheck: 'Approve digital proofs before print run. Include rush reprint option in contract.', completed: false },
    { id: 'v8', category: 'Favors', task: 'Source and personalize guest favors with event branding', deadlineWeeksBefore: 6, priority: 'Low', negotiationCheck: 'Order 10% surplus for last-minute additions. Confirm lead time for custom engraving.', completed: false },
  ];
  return tasks;
}

/**
 * Generates a deterministic FMEA risk contingency matrix with trigger conditions.
 * @returns {RiskContingency[]} Array of risk assessments with Plan B protocols.
 */
function generateRiskMatrix(): RiskContingency[] {
  return [
    { risk: 'Weather disruption for outdoor segments', probability: 'Med', impact: 'High', contingencyPlan: 'Pre-book indoor marquee tent with full AV backup. Activate weather monitoring 72h before event.', triggerCondition: 'Weather forecast shows >40% precipitation probability 48 hours before event date.' },
    { risk: 'Primary vendor no-show or cancellation', probability: 'Low', impact: 'Critical', contingencyPlan: 'Maintain vetted backup vendor list with 24-hour activation agreements. Hold 5% vendor contingency escrow.', triggerCondition: 'Vendor fails to confirm arrival 24 hours before their contracted setup time.' },
    { risk: 'Power or AV equipment failure', probability: 'Low', impact: 'High', contingencyPlan: 'Deploy industrial UPS backup and portable generator. Carry duplicate wireless microphones and speaker units.', triggerCondition: 'Main power grid voltage drops below 200V or AV check fails during setup.' },
    { risk: 'Catering quantity shortfall or quality issue', probability: 'Med', impact: 'High', contingencyPlan: 'Order 15% food surplus. Have express delivery agreement with backup caterer for emergency supplementation.', triggerCondition: 'RSVP count exceeds ordered portions by >5% within 48 hours of event, or tasting session quality score <7/10.' },
    { risk: 'Guest medical emergency', probability: 'Low', impact: 'Critical', contingencyPlan: 'Station certified first aid team on-site. Pre-identify nearest hospital and maintain clear ambulance access route.', triggerCondition: 'Any guest exhibits signs of severe allergic reaction, cardiac distress, or physical injury requiring professional intervention.' },
    { risk: 'Photography/videography data loss', probability: 'Low', impact: 'High', contingencyPlan: 'Require dual-card recording in all cameras. Perform hourly backup to portable SSD. Second shooter captures parallel coverage.', triggerCondition: 'Primary camera storage failure alert or photographer reports equipment malfunction during ceremony.' },
  ];
}

/**
 * Generates a default guest list based on guest count for demonstration purposes.
 * @param {number} guestCount - The expected number of guests.
 * @returns {GuestItem[]} Array of sample guest entries with varied statuses and dietary needs.
 */
function generateDefaultGuestList(guestCount: number): GuestItem[] {
  const sampleGuests: GuestItem[] = [
    { id: 'g1', name: 'Aarav & Priya Sharma', category: 'VIP', rsvpStatus: 'Confirmed', plusOnes: 1, dietary: 'Pure Vegetarian / Jain', tableNumber: 'T1' },
    { id: 'g2', name: 'Rahul Mehta', category: 'Family', rsvpStatus: 'Confirmed', plusOnes: 3, dietary: 'No restrictions', tableNumber: 'T2' },
    { id: 'g3', name: 'Sofia Chen', category: 'General', rsvpStatus: 'Pending', plusOnes: 1, dietary: 'Vegan', tableNumber: 'T3' },
    { id: 'g4', name: 'Dmitri Volkov', category: 'General', rsvpStatus: 'Confirmed', plusOnes: 0, dietary: 'Gluten-Free', tableNumber: 'T3' },
    { id: 'g5', name: 'Zara Patel', category: 'VIP', rsvpStatus: 'Confirmed', plusOnes: 2, dietary: 'Nut Allergy', tableNumber: 'T1' },
    { id: 'g6', name: 'James O\'Brien', category: 'General', rsvpStatus: 'Declined', plusOnes: 0, dietary: 'No restrictions' },
    { id: 'g7', name: 'Ananya Krishnan', category: 'Family', rsvpStatus: 'Confirmed', plusOnes: 1, dietary: 'Halal', tableNumber: 'T2' },
    { id: 'g8', name: 'Lars Johansson', category: 'Crew', rsvpStatus: 'Confirmed', plusOnes: 0, dietary: 'Dairy-Free', tableNumber: 'T5' },
    { id: 'g9', name: 'Maria Santos', category: 'General', rsvpStatus: 'Pending', plusOnes: 1, dietary: 'No restrictions', tableNumber: 'T4' },
    { id: 'g10', name: 'Vikram & Neha Singh', category: 'VIP', rsvpStatus: 'Confirmed', plusOnes: 2, dietary: 'Vegetarian', tableNumber: 'T1' },
  ];
  return sampleGuests.slice(0, Math.min(guestCount, sampleGuests.length));
}

/**
 * Generates bespoke creative personalized ideas tailored to the event archetype.
 * Fulfills PromptWars Challenge 5 "personalized ideas" specification.
 * @param {string} eventType - The type of event.
 * @returns {PersonalizedIdea[]} Curated ideas across decor, culinary, entertainment, and favors.
 */
export function generatePersonalizedIdeas(eventType: string): PersonalizedIdea[] {
  const isWedding = eventType.toLowerCase().includes('wedding');
  const isHackathon = eventType.toLowerCase().includes('hackathon');

  if (isWedding) {
    return [
      {
        id: 'idea-w1',
        title: 'Botanical Floral Arch with Micro-Mist Scent Infusion',
        category: 'Decor & Ambiance',
        description: 'Living floral canopy suspended over the aisle featuring subtle jasmine and white amber micro-mist diffusion timed to the processional entrance.',
        impactTag: 'High Visual Impact',
        estimatedBudgetImpact: 'Moderate',
        isFavorited: true,
      },
      {
        id: 'idea-w2',
        title: 'Bespoke Dual-Heritage Molecular Mocktail Bar',
        category: 'Culinary & Mixology',
        description: 'Interactive cocktail alchemy station offering customized drinks named after the couple’s milestone travel memories with edible gold leaf and dry ice presentation.',
        impactTag: 'Signature Experience',
        estimatedBudgetImpact: 'Low (Within F&B)',
        isFavorited: false,
      },
      {
        id: 'idea-w3',
        title: 'Vintage Rotary Phone Audio Guestbook Station',
        category: 'Experiential Moments',
        description: '1940s French rotary telephone booth where guests leave unscripted voice notes, preserved into a pressed vinyl record album keepsake for the couple.',
        impactTag: 'Emotional Resonance',
        estimatedBudgetImpact: 'Low-Cost High-ROI',
        isFavorited: true,
      },
      {
        id: 'idea-w4',
        title: 'Calligraphed Seed-Paper Placecards & Seedling Favors',
        category: 'Attendee Keepsakes',
        description: 'Hand-lettered plantable seed paper containing native wildflower seeds, paired with custom engraved ceramic mini-pots as sustainable celebratory favors.',
        impactTag: 'Emotional Resonance',
        estimatedBudgetImpact: 'Low-Cost High-ROI',
        isFavorited: false,
      },
      {
        id: 'idea-w5',
        title: 'Acoustic String Quartet Bridging Pop & Classical Anthems',
        category: 'Interactive Entertainment',
        description: 'Classical string ensemble performing cinematic renditions of contemporary indie and film scores during arrival and cocktail transition periods.',
        impactTag: 'High Visual Impact',
        estimatedBudgetImpact: 'Moderate',
        isFavorited: false,
      },
    ];
  }

  if (isHackathon) {
    return [
      {
        id: 'idea-h1',
        title: '2:00 AM Midnight Nitrogen Barista Sprint & Energy Lounge',
        category: 'Culinary & Mixology',
        description: 'Artisanal cold-brew and espresso bar featuring custom flavored syrups, high-protein bento bowls, and electro-electrolyte boosters to sustain night hacking.',
        impactTag: 'Signature Experience',
        estimatedBudgetImpact: 'Moderate',
        isFavorited: true,
      },
      {
        id: 'idea-h2',
        title: 'Real-Time Cyberpunk Terminal Git Commit Mosaic Wall',
        category: 'Experiential Moments',
        description: 'Live projector visualizer mapping repo commits into dynamic pixel art towers, celebrating milestones whenever teams push passing test suites.',
        impactTag: 'Viral & Social',
        estimatedBudgetImpact: 'Low-Cost High-ROI',
        isFavorited: true,
      },
      {
        id: 'idea-h3',
        title: 'Limited-Edition Hardware & Enamel Developer Badge Patches',
        category: 'Attendee Keepsakes',
        description: 'Tactile embroidered cyberpunk skill patches and PCB keychains unlocked when hackers demo working hardware or AI agent integrations.',
        impactTag: 'High Visual Impact',
        estimatedBudgetImpact: 'Low (Within Swag)',
        isFavorited: false,
      },
      {
        id: 'idea-h4',
        title: 'Ergonomic Acoustic Lo-Fi Soundproof Breakout Domes',
        category: 'Decor & Ambiance',
        description: 'Quiet geometric sleep/brainstorm geodesic domes equipped with noise-dampening panels, beanbags, and binaural lo-fi audio feeds.',
        impactTag: 'Signature Experience',
        estimatedBudgetImpact: 'Moderate',
        isFavorited: false,
      },
      {
        id: 'idea-h5',
        title: '60-Second Lightning Pitch Gong Show with Live Peer Voting',
        category: 'Interactive Entertainment',
        description: 'Fast-paced demo showcase where crowd decibel meters and live QR voting determine people’s choice finalist seeds before judge deliberation.',
        impactTag: 'Viral & Social',
        estimatedBudgetImpact: 'Low-Cost High-ROI',
        isFavorited: false,
      },
    ];
  }

  /* Default / Birthday & Private Celebrations */
  return [
    {
      id: 'idea-b1',
      title: 'Neon Noir Immersion Room & Instant Holographic Prints',
      category: 'Experiential Moments',
      description: 'Futuristic mirrored infinity cube photo experience producing instant credit-card-sized holographic motion prints for attendees to take home.',
      impactTag: 'Viral & Social',
      estimatedBudgetImpact: 'Moderate',
      isFavorited: true,
    },
    {
      id: 'idea-b2',
      title: 'Smoke & Bubble Molecular Mixology Masterclass Station',
      category: 'Culinary & Mixology',
      description: 'Interactive drink lab where guests pop edible citrus aroma vapor bubbles atop color-shifting butterfly pea flower signature cocktails.',
      impactTag: 'Signature Experience',
      estimatedBudgetImpact: 'Moderate',
      isFavorited: false,
    },
    {
      id: 'idea-b3',
      title: 'Multi-Channel Silent Disco with Headphone LED Battle',
      category: 'Interactive Entertainment',
      description: '3 simultaneous DJs (House, Throwback Hits, Afrobeats) where headphones glow red, blue, or green to reveal which music channel is dominating the floor.',
      impactTag: 'High Visual Impact',
      estimatedBudgetImpact: 'Moderate',
      isFavorited: true,
    },
    {
      id: 'idea-b4',
      title: 'Custom Screenprinted Canvas Tote Bags Crafted Live On-Site',
      category: 'Attendee Keepsakes',
      description: 'Live screenprinting station where guests select their favorite event motif and ink color to watch their personalized tote bag printed in 90 seconds.',
      impactTag: 'Emotional Resonance',
      estimatedBudgetImpact: 'Low-Cost High-ROI',
      isFavorited: false,
    },
    {
      id: 'idea-b5',
      title: 'Starlight Ceiling Projection Mapping with Golden Sparkler Finale',
      category: 'Decor & Ambiance',
      description: 'Constellation sky projections synced to ambient deep house rhythms, culminating in indoor cold-spark fountain cascades during milestone toast.',
      impactTag: 'High Visual Impact',
      estimatedBudgetImpact: 'Moderate',
      isFavorited: false,
    },
  ];
}

/**
 * Synthesizes a complete deterministic EventPlan from user input.
 * This is the zero-latency offline fallback engine that produces mathematically
 * precise plans without any API dependency.
 * @param {EventInput} input - The user's event configuration input.
 * @returns {EventPlan} A complete, deterministic event blueprint.
 */
export function synthesizeFallbackPlan(input: EventInput): EventPlan {
  const { categories, contingencyReserve } = computeBudgetAllocation(input.totalBudget, input.currency);
  const isWedding = input.eventType.toLowerCase().includes('wedding');
  const isHackathon = input.eventType.toLowerCase().includes('hackathon');

  const themeMap: Record<string, { title: string; concept: string; palette: string[]; dressCode: string; tagline: string }> = {
    wedding: {
      title: 'The Grand Heritage Royal Celebration',
      concept: 'A majestic fusion of timeless tradition and contemporary luxury, with cascading florals, warm ambient lighting, and gilded accents creating an atmosphere of regal sophistication.',
      palette: ['#b48c48', '#faf8f5', '#2d1810', '#d4af37'],
      dressCode: 'Royal Formal — Traditional ceremonial attire with gold accents',
      tagline: 'Where Heritage Meets Horizon — A Celebration Written in Gold',
    },
    hackathon: {
      title: 'Nexus26: Autonomous Agent Hackathon',
      concept: 'A high-energy innovation forge blending cyberpunk aesthetics with collaborative creativity. Neon accents pulse against dark surfaces, creating an atmosphere that fuels invention.',
      palette: ['#0ff4c6', '#1a1a2e', '#e94560', '#16213e'],
      dressCode: 'Tech Casual — Comfortable attire for 36 hours of building',
      tagline: 'Code. Create. Conquer. — 36 Hours to Build the Future',
    },
    default: {
      title: 'Elysium Noir: A Milestone Soirée',
      concept: 'An intimate rooftop experience draped in noir elegance and champagne gold highlights. Soft candlelight and skyline views create an unforgettable atmosphere.',
      palette: ['#1c1917', '#d4af37', '#fdfbf7', '#b48c48'],
      dressCode: 'Black Tie Optional — Cocktail attire with metallic accents',
      tagline: 'Tonight, We Shine — An Evening Beyond Ordinary',
    },
  };

  const themeKey = isWedding ? 'wedding' : isHackathon ? 'hackathon' : 'default';
  const theme = themeMap[themeKey];

  const formalInvitation = isWedding
    ? `With profound joy and reverence for tradition, we cordially invite you to witness the sacred union of two souls embarking on a lifetime journey together. Your gracious presence will illuminate this momentous celebration with love and blessings. The ceremony will be held at our chosen venue on the designated date, followed by a grand reception banquet. We humbly request the honour of your company. — With love and anticipation`
    : `You are cordially invited to an evening of extraordinary celebration. Join us as we mark this milestone with elegance, warmth, and unforgettable memories. Your presence will be the finest gift. Formal attire is requested. — With heartfelt anticipation`;

  const casualWhatsAppCopy = isWedding
    ? `🎊✨ YOU'RE INVITED! ✨🎊\n\n💍 The Big Day is happening and we want YOU there! 🥳\n\n📅 Date: ${input.eventDate}\n👗 Dress Code: ${theme.dressCode}\n🍽️ Full dinner & celebrations included!\n\n💌 RSVP by tapping here 👇\n🔗 [RSVP Link]\n\nCan't wait to celebrate with you! 💕`
    : `🎉🥂 YOU'RE INVITED! 🥂🎉\n\n✨ An unforgettable evening awaits!\n\n📅 ${input.eventDate}\n🎨 Theme: ${theme.concept.split('.')[0]}\n👔 ${theme.dressCode}\n\n💌 RSVP: Tap below 👇\n🔗 [RSVP Link]\n\nSee you there! 🌟`;

  return {
    id: `plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    eventType: input.eventType,
    eventDate: input.eventDate,
    guestCount: input.guestCount,
    durationHours: input.durationHours,
    locationType: input.locationType,
    specialRequirements: input.specialRequirements,
    eventSummary: {
      title: theme.title,
      themeConcept: theme.concept,
      colorPalette: theme.palette,
      dressCode: theme.dressCode,
      tagline: theme.tagline,
    },
    budgetAllocation: {
      total: input.totalBudget,
      currency: input.currency,
      contingencyReserve,
      categories,
    },
    timelineItinerary: generateTimeline(input.durationHours, input.eventType),
    vendorChecklist: generateVendorChecklist(input.eventType),
    invitationStudio: {
      formalInvitation,
      casualWhatsAppCopy,
      rsvpCallToAction: '📩 Please confirm your attendance by responding to this invitation or contacting our event coordinator. Dietary requirements and plus-one details are appreciated for our planning.',
    },
    personalizedIdeas: generatePersonalizedIdeas(input.eventType),
    riskContingencyMatrix: generateRiskMatrix(),
    guestList: generateDefaultGuestList(input.guestCount),
  };
}
