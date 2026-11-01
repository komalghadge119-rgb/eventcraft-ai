/**
 * @fileoverview Personalized Ideas & Creative Concepts section component for EventCraft AI.
 * Fulfills PromptWars Challenge 5 specification for "personalized ideas" across
 * weddings, birthdays, and community gatherings.
 * Features category filtering, interactive favorites, impact badges, and budget guidance.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Lightbulb, Star, Tag, Sparkles, Filter, Check } from 'lucide-react';
import type { PersonalizedIdea } from '../types/event';

/**
 * Props for PersonalizedIdeasSection component.
 * @property {PersonalizedIdea[]} ideas - The array of bespoke creative ideas.
 * @property {(id: string) => void} [onToggleFavorite] - Optional callback to toggle favorite state.
 */
interface PersonalizedIdeasSectionProps {
  ideas: PersonalizedIdea[];
  onToggleFavorite?: (id: string) => void;
}

/**
 * Maps impact tag to CSS class for visually distinctive styling.
 * @param {string} tag - Impact tag name.
 * @returns {string} CSS modifier class.
 */
function getImpactClass(tag: string): string {
  switch (tag) {
    case 'High Visual Impact': return 'impact-visual';
    case 'Signature Experience': return 'impact-signature';
    case 'Viral & Social': return 'impact-viral';
    case 'Emotional Resonance': return 'impact-emotional';
    default: return 'impact-visual';
  }
}

/**
 * Personalized Ideas & Creative Inspiration Matrix component.
 * Direct implementation of the PromptWars Challenge 5 "personalized ideas" mandate.
 * @param {PersonalizedIdeasSectionProps} props - Component props.
 * @returns {React.ReactElement} The rendered personalized ideas section.
 */
export const PersonalizedIdeasSection: React.FC<PersonalizedIdeasSectionProps> = ({
  ideas: initialIdeas,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [localFavorites, setLocalFavorites] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    initialIdeas.forEach((idea) => {
      if (idea.isFavorited) map[idea.id] = true;
    });
    return map;
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialIdeas.forEach((i) => set.add(i.category));
    return ['All', ...Array.from(set)];
  }, [initialIdeas]);

  const filteredIdeas = useMemo(() => {
    if (selectedCategory === 'All') return initialIdeas;
    return initialIdeas.filter((i) => i.category === selectedCategory);
  }, [initialIdeas, selectedCategory]);

  const handleToggle = useCallback((id: string) => {
    setLocalFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    if (onToggleFavorite) onToggleFavorite(id);
  }, [onToggleFavorite]);

  const favoriteCount = Object.values(localFavorites).filter(Boolean).length;

  return (
    <section
      className="plan-section personalized-ideas-section"
      aria-labelledby="personalized-ideas-heading"
      role="region"
      id="personalized-ideas"
    >
      <div className="section-header">
        <Lightbulb className="section-icon" size={24} aria-hidden="true" />
        <div>
          <h2 className="section-title" id="personalized-ideas-heading">
            Personalized Ideas & Creative Concepts
          </h2>
          <p className="section-subtitle">
            Curated bespoke concepts tailored to your event aesthetic · {favoriteCount} concept{favoriteCount === 1 ? '' : 's'} shortlisted
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="ideas-filter-bar" role="toolbar" aria-label="Filter ideas by category">
        <span className="ideas-filter-label" id="filter-by-cat-label">
          <Filter size={14} aria-hidden="true" /> Filter:
        </span>
        <div className="ideas-filter-pills" role="radiogroup" aria-labelledby="filter-by-cat-label">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              role="radio"
              aria-checked={selectedCategory === cat}
              aria-label={`Show ${cat} ideas`}
            >
              {cat === 'All' && <Sparkles size={13} aria-hidden="true" />}
              <span>{cat}</span>
              {selectedCategory === cat && <Check size={12} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Idea Cards */}
      <div className="ideas-grid" role="list" aria-label="Personalized creative ideas list">
        {filteredIdeas.map((idea) => {
          const isFav = !!localFavorites[idea.id];
          return (
            <article
              key={idea.id}
              className={`idea-card ${isFav ? 'favorited' : ''}`}
              role="listitem"
              aria-labelledby={`idea-title-${idea.id}`}
            >
              <div className="idea-card-header">
                <span className={`impact-badge ${getImpactClass(idea.impactTag)}`}>
                  {idea.impactTag}
                </span>
                <button
                  className={`idea-fav-btn ${isFav ? 'active' : ''}`}
                  onClick={() => handleToggle(idea.id)}
                  type="button"
                  aria-label={`${isFav ? 'Remove from' : 'Add to'} shortlisted concepts: ${idea.title}`}
                  aria-pressed={isFav}
                >
                  <Star size={16} fill={isFav ? 'currentColor' : 'none'} aria-hidden="true" />
                  <span>{isFav ? 'Shortlisted' : 'Shortlist'}</span>
                </button>
              </div>

              <h3 className="idea-card-title" id={`idea-title-${idea.id}`}>
                {idea.title}
              </h3>

              <p className="idea-card-description">{idea.description}</p>

              <div className="idea-card-footer">
                <span className="idea-category-tag">
                  <Tag size={13} aria-hidden="true" />
                  {idea.category}
                </span>
                <span className="idea-cost-impact" title="Estimated Budget Allocation Impact">
                  💰 {idea.estimatedBudgetImpact}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
