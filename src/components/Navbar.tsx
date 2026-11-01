/**
 * @fileoverview Top navigation bar component for EventCraft AI.
 * Includes brand lockup, 1-click evaluator presets, API key modal,
 * blueprint synthesis trigger, and export suite (ICS, PDF, Markdown).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Key, Download, Calendar, FileText, Printer, ChevronDown } from 'lucide-react';
import type { EventPlan } from '../types/event';
import { PRESET_DISPLAY, APP_NAME } from '../constants';
import { getStoredApiKey } from '../services/aiService';
import { downloadIcsFile, downloadMarkdownDossier, triggerPdfPrint } from '../utils/exportUtils';
import { ApiKeyModal } from './ApiKeyModal';

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
   * Toggles the presets dropdown menu and closes the export menu.
   */
  const handleTogglePresets = useCallback((): void => {
    setShowPresetsMenu((prev) => !prev);
    setShowExportMenu(false);
  }, []);

  /**
   * Toggles the export dropdown menu and closes the presets menu.
   */
  const handleToggleExport = useCallback((): void => {
    setShowExportMenu((prev) => !prev);
    setShowPresetsMenu(false);
  }, []);

  /**
   * Opens the API key configuration modal.
   */
  const handleOpenApiModal = useCallback((): void => {
    setShowApiModal(true);
  }, []);

  /**
   * Closes the API key configuration modal.
   */
  const handleCloseApiModal = useCallback((): void => {
    setShowApiModal(false);
  }, []);

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
              onClick={handleTogglePresets}
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
            onClick={handleOpenApiModal}
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
                onClick={handleToggleExport}
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

      <ApiKeyModal
        isOpen={showApiModal}
        onClose={handleCloseApiModal}
        onKeySaved={() => setHasKey(true)}
      />
    </nav>
  );
};
