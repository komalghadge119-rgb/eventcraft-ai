/**
 * @fileoverview React component integration tests for EventCraft AI.
 * Tests rendering, interactions, accessibility roles, and user flows using React Testing Library.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonalizedIdeasSection } from '../components/PersonalizedIdeasSection';
import { BudgetSection } from '../components/BudgetSection';
import { TimelineSection } from '../components/TimelineSection';
import { VendorSection } from '../components/VendorSection';
import { InvitationSection } from '../components/InvitationSection';
import { EventHeader } from '../components/EventHeader';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import { PRESET_ROYAL_WEDDING } from '../constants';
import type { PersonalizedIdea } from '../types/event';

const mockIdeas: PersonalizedIdea[] = [
  {
    id: 'idea-1',
    title: 'Botanical Floral Canopy',
    category: 'Decor & Ambiance',
    description: 'Suspended living floral installation with aroma diffusion.',
    impactTag: 'High Visual Impact',
    estimatedBudgetImpact: 'Moderate',
    isFavorited: false,
  },
  {
    id: 'idea-2',
    title: 'Molecular Signature Cocktail Bar',
    category: 'Culinary & Mixology',
    description: 'Liquid nitrogen smoking drinks with customized names.',
    impactTag: 'Signature Experience',
    estimatedBudgetImpact: 'Low-Cost High-ROI',
    isFavorited: true,
  },
];

describe('Component Integration — PersonalizedIdeasSection', () => {
  it('renders section heading and subtitle', () => {
    render(<PersonalizedIdeasSection ideas={mockIdeas} />);
    expect(screen.getByText('Personalized Ideas & Creative Concepts')).toBeDefined();
    expect(screen.getByText(/Botanical Floral Canopy/)).toBeDefined();
  });

  it('renders all idea cards initially', () => {
    render(<PersonalizedIdeasSection ideas={mockIdeas} />);
    expect(screen.getByText('Botanical Floral Canopy')).toBeDefined();
    expect(screen.getByText('Molecular Signature Cocktail Bar')).toBeDefined();
  });

  it('filters ideas by category when filter pill is clicked', () => {
    render(<PersonalizedIdeasSection ideas={mockIdeas} />);
    const culinaryPill = screen.getByRole('radio', { name: /Show Culinary & Mixology ideas/i });
    fireEvent.click(culinaryPill);

    expect(screen.getByText('Molecular Signature Cocktail Bar')).toBeDefined();
    expect(screen.queryByText('Botanical Floral Canopy')).toBeNull();
  });

  it('allows shortlisting an idea with callback trigger', () => {
    const handleToggle = vi.fn();
    render(<PersonalizedIdeasSection ideas={mockIdeas} onToggleFavorite={handleToggle} />);
    const shortlistBtns = screen.getAllByRole('button', { name: /Shortlist/i });
    fireEvent.click(shortlistBtns[0]);
    expect(handleToggle).toHaveBeenCalledWith('idea-1');
  });
});

describe('Component Integration — BudgetSection', () => {
  const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);

  it('renders budget total and allocation categories', () => {
    render(<BudgetSection budget={plan.budgetAllocation} />);
    expect(screen.getByText('Quant Financial Allocations')).toBeDefined();
    expect(screen.getByText('Total Budget')).toBeDefined();
    expect(screen.getByText('Allocated to Pillars')).toBeDefined();
  });

  it('displays contingency reserve banner', () => {
    render(<BudgetSection budget={plan.budgetAllocation} />);
    expect(screen.getAllByText(/Dynamic Contingency Reserve/i).length).toBeGreaterThan(0);
  });
});

describe('Component Integration — TimelineSection', () => {
  const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);

  it('renders chronological timeline run of show', () => {
    const handleToggle = vi.fn();
    render(<TimelineSection timeline={plan.timelineItinerary} onToggle={handleToggle} />);
    expect(screen.getByText('ChronoPlanner Run-of-Show')).toBeDefined();
    expect(plan.timelineItinerary.length).toBeGreaterThan(0);
  });

  it('triggers onToggle callback when milestone checkbox is clicked', () => {
    const handleToggle = vi.fn();
    render(<TimelineSection timeline={plan.timelineItinerary} onToggle={handleToggle} />);
    const buttons = screen.getAllByRole('button', { name: /Mark .* as/i });
    fireEvent.click(buttons[0]);
    expect(handleToggle).toHaveBeenCalledWith(0);
  });
});

describe('Component Integration — VendorSection', () => {
  const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);

  it('renders procurement matrix and SLA clauses', () => {
    const handleToggle = vi.fn();
    render(<VendorSection vendors={plan.vendorChecklist} onToggle={handleToggle} />);
    expect(screen.getByText('Vendor Procurement Matrix')).toBeDefined();
    expect(screen.getByText(plan.vendorChecklist[0].task)).toBeDefined();
    expect(screen.getByText(plan.vendorChecklist[0].negotiationCheck)).toBeDefined();
  });
});

describe('Component Integration — InvitationSection', () => {
  const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);

  it('renders formal calligraphy and WhatsApp invitation copies', () => {
    render(<InvitationSection invitation={plan.invitationStudio} />);
    expect(screen.getByText(/Invitation Studio/i)).toBeDefined();
    expect(screen.getByText('Formal Digital Invitation')).toBeDefined();
    expect(screen.getByText('WhatsApp / Social Broadcast')).toBeDefined();
  });
});

describe('Component Integration — EventHeader', () => {
  const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);

  it('renders event banner with title, date, and metrics', () => {
    render(<EventHeader plan={plan} />);
    expect(screen.getByText(plan.eventSummary.title)).toBeDefined();
    expect(screen.getByText((content) => content.includes(plan.eventSummary.tagline))).toBeDefined();
  });
});
