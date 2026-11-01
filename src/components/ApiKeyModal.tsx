/**
 * @fileoverview Modal dialog for configuring Google Gemini API key.
 * Manages secure sessionStorage key persistence with Escape-key and overlay dismissal.
 */

import React, { useState, useCallback } from 'react';
import { Key, X } from 'lucide-react';
import { storeApiKey } from '../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = useCallback((): void => {
    if (apiKey.trim()) {
      storeApiKey(apiKey.trim());
      onKeySaved();
      onClose();
      setApiKey('');
    }
  }, [apiKey, onKeySaved, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" id="api-key-modal-title">
            <Key size={20} aria-hidden="true" />
            Configure Gemini API Key
          </h3>
          <button
            className="modal-close"
            onClick={onClose}
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
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
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
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="modal-btn modal-btn-primary"
            onClick={handleSave}
            type="button"
            disabled={!apiKey.trim()}
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};
