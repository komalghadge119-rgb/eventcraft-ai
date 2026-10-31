/**
 * @fileoverview Top navigation bar component for AuraPlan AI.
 * Includes brand lockup, 1-click evaluator presets, API key modal,
 * blueprint synthesis trigger, and export suite (ICS, PDF, Markdown).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Key, Download, Calendar, FileText, Printer, X, ChevronDown } from 'lucide-react';
import type { EventPlan } from '../types/event';
import { PRESET_DISPLAY, APP_NAME } from '../constants';
import { getStoredApiKey, storeApiKey } from '../services/aiService';
import { downloadIcsFile, downloadMarkdownDossier, triggerPdfPrint } from '../utils/exportUtils';

/**
 * Props interface for the Navbar component.
 * @property {(presetKey: string) => void} onLoadPreset - Callback to load a preset plan.
 * @property {() => void} onOpenSynthesizer - Callback to open the blueprint synthesis modal.
 * @property {EventPlan | null} plan - The current active plan for export operations.
 */
interface NavbarProps {
  onLoadPreset: (presetKey: string) => void;
  onOpenSynthesizer: () => void;
  plan: EventPlan | null;
}

/**
 * Top navigation bar with brand lockup, preset selectors, API configuration,
 * and export suite. Implements Escape-key dismissal for all modal overlays.
 * @param {NavbarProps} props - The component props.
 * @returns {React.ReactElement} The rendered navigation bar.
 */
export const Navbar: React.FC<NavbarProps> = ({ onLoadPreset, onOpenSynthesizer, plan }) => {
  const [showApiModal, setShowApiModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const stored = getStoredApiKey();
    setHasKey(!!stored);
  }, []);

  /**
   * Handles Escape key press to dismiss open modals/menus.
   */
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowApiModal(false);
      setShowExportMenu(false);
      setShowPresetsMenu(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  /**
   * Saves the API key to session storage and closes the modal.
   */
  const handleSaveApiKey = (): void => {
    if (apiKey.trim()) {
      storeApiKey(apiKey.trim());
      setHasKey(true);
      setShowApiModal(false);
      setApiKey('');
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Primary navigation">
      <div className="navbar-inner">
        {/* Brand Lockup */}
        <div className="navbar-brand">
          <Sparkles className="navbar-brand-icon" size={22} aria-hidden="true" />
          <span className="navbar-brand-text">{APP_NAME}</span>
          <span className="navbar-intelligence-badge">Multi-Agent Intelligence</span>
        </div>

        {/* Navigation Actions */}
        <div className="navbar-actions">
          {/* Evaluator Presets Dropdown */}
          <div className="navbar-dropdown-wrapper">
            <button
              className="navbar-btn navbar-btn-presets"
              onClick={() => { setShowPresetsMenu(!showPresetsMenu); setShowExportMenu(false); }}
              type="button"
              aria-expanded={showPresetsMenu}
              aria-haspopup="true"
              id="presets-menu-trigger"
            >
              <Sparkles size={16} aria-hidden="true" />
              <span>Presets</span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            {showPresetsMenu && (
              <div className="navbar-dropdown" role="menu" aria-labelledby="presets-menu-trigger">
                {PRESET_DISPLAY.map((preset) => (
                  <button
                    key={preset.key}
                    className="navbar-dropdown-item"
                    onClick={() => { onLoadPreset(preset.key); setShowPresetsMenu(false); }}
                    type="button"
                    role="menuitem"
                  >
                    <span className="preset-emoji">{preset.emoji}</span>
                    <div className="preset-info">
                      <span className="preset-title">{preset.title}</span>
                      <span className="preset-subtitle">{preset.subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Synthesize New Blueprint */}
          <button
            className="navbar-btn navbar-btn-primary"
            onClick={onOpenSynthesizer}
            type="button"
            aria-label="Open the blueprint synthesis dialog"
            id="synthesize-trigger"
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>Synthesize Blueprint</span>
          </button>

          {/* API Key Configuration */}
          <button
            className={`navbar-btn ${hasKey ? 'navbar-btn-configured' : 'navbar-btn-key'}`}
            onClick={() => setShowApiModal(true)}
            type="button"
            aria-label="Configure Gemini API key"
            id="api-key-trigger"
          >
            <Key size={16} aria-hidden="true" />
            <span>{hasKey ? 'Key Set' : 'API Key'}</span>
          </button>

          {/* Export Suite */}
          {plan && (
            <div className="navbar-dropdown-wrapper">
              <button
                className="navbar-btn navbar-btn-export"
                onClick={() => { setShowExportMenu(!showExportMenu); setShowPresetsMenu(false); }}
                type="button"
                aria-expanded={showExportMenu}
                aria-haspopup="true"
                id="export-menu-trigger"
              >
                <Download size={16} aria-hidden="true" />
                <span>Export</span>
                <ChevronDown size={14} aria-hidden="true" />
              </button>
              {showExportMenu && (
                <div className="navbar-dropdown" role="menu" aria-labelledby="export-menu-trigger">
                  <button
                    className="navbar-dropdown-item"
                    onClick={() => { downloadIcsFile(plan); setShowExportMenu(false); }}
                    type="button"
                    role="menuitem"
                  >
                    <Calendar size={16} aria-hidden="true" />
                    <span>Sync to Calendar (.ics)</span>
                  </button>
                  <button
                    className="navbar-dropdown-item"
                    onClick={() => { triggerPdfPrint(); setShowExportMenu(false); }}
                    type="button"
                    role="menuitem"
                  >
                    <Printer size={16} aria-hidden="true" />
                    <span>Print / Save as PDF</span>
                  </button>
                  <button
                    className="navbar-dropdown-item"
                    onClick={() => { downloadMarkdownDossier(plan); setShowExportMenu(false); }}
                    type="button"
                    role="menuitem"
                  >
                    <FileText size={16} aria-hidden="true" />
                    <span>Markdown Dossier</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* API Key Modal */}
      {showApiModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowApiModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Configure Gemini API Key"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Key size={20} aria-hidden="true" />
                Configure Gemini API Key
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowApiModal(false)}
                type="button"
                aria-label="Close API key configuration dialog"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Enter your Google Gemini API key to enable AI-powered plan generation.
                The key is stored securely in your browser&apos;s session storage and is
                never transmitted to any server other than Google&apos;s API.
              </p>
              <input
                type="password"
                className="modal-input"
                placeholder="Enter your Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
                aria-label="Gemini API key input field"
                id="api-key-input"
                autoComplete="off"
              />
              <div className="modal-note">
                🔒 Stored in sessionStorage only. Cleared when you close the tab.
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn modal-btn-secondary"
                onClick={() => setShowApiModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="modal-btn modal-btn-primary"
                onClick={handleSaveApiKey}
                type="button"
                disabled={!apiKey.trim()}
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
