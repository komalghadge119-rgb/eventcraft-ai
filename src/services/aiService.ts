/**
 * @fileoverview Google Gemini 2.0 Flash AI service for EventCraft AI.
 * Uses the official @google/genai TypeScript SDK with schema-enforced JSON output.
 * Implements runtime type guards, input sanitization, and deterministic fallback failover.
 */

import { GoogleGenAI } from '@google/genai';
import type { EventInput, EventPlan } from '../types/event';
import { GEMINI_MODEL_ID, SESSION_KEY_API } from '../constants';
import { SYSTEM_INSTRUCTION } from '../constants/prompts';
import { synthesizeFallbackPlan, generatePersonalizedIdeas } from './fallbackSynthesizer';
import { sanitizeInput, deepSanitize } from '../utils/sanitizer';
import { logger } from '../utils/logger';

/**
 * Strips markdown code fences and other wrappers from raw LLM text output.
 * Handles various fence formats: ```json, ```JSON, ``` with surrounding whitespace.
 * @param {string} raw - The raw text response from the LLM.
 * @returns {string} The cleaned JSON string ready for parsing.
 */
export function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();

  /* Remove markdown code fences */
  cleaned = cleaned.replace(/^```(?:json|JSON)?\s*\n?/i, '');
  cleaned = cleaned.replace(/\n?```\s*$/i, '');

  /* Trim leading/trailing whitespace after fence removal */
  cleaned = cleaned.trim();

  /* Find the first { and last } to extract JSON object */
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

/**
 * Retrieves the stored Gemini API key from session storage.
 * @returns {string | null} The API key string, or null if not configured.
 */
export function getStoredApiKey(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY_API);
  } catch {
    return null;
  }
}

/**
 * Stores the Gemini API key in session storage (never localStorage/disk).
 * @param {string} key - The API key to store.
 */
export function storeApiKey(key: string): void {
  try {
    sessionStorage.setItem(SESSION_KEY_API, key);
  } catch {
    logger.warn('Failed to store API key in session storage.');
  }
}

/**
 * Builds the user prompt for the Gemini API request from sanitized event input parameters.
 * Defends against prompt injection via multi-stage HTML entity sanitization.
 * @param {EventInput} input - The event configuration input.
 * @returns {string} The formatted user prompt string.
 */
export function buildUserPrompt(input: EventInput): string {
  const cleanType = sanitizeInput(input.eventType);
  const cleanLocation = sanitizeInput(input.locationType);
  const cleanReqs = sanitizeInput(input.specialRequirements || 'None specified');

  return `Synthesize a complete master event blueprint for the following event:

Event Type: ${cleanType}
Event Date: ${input.eventDate}
Total Budget: ${input.currency} ${input.totalBudget.toLocaleString()}
Expected Guests: ${input.guestCount}
Duration: ${input.durationHours} hours
Location Setting: ${cleanLocation}
Special Requirements: ${cleanReqs}

Generate the full plan with all 5 agents contributing their specialized outputs.`;
}

/**
 * Runtime type guard validating the parsed LLM payload conforms to EventPlan requirements.
 * Verifies structural integrity of all 5 agent domains prior to domain state ingestion.
 * @param {unknown} value - The raw parsed JSON payload from the AI engine.
 * @returns {boolean} True if the payload conforms to the expected schema.
 */
export function isValidEventPlanPayload(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  const hasEventSummary =
    typeof obj.eventSummary === 'object' &&
    obj.eventSummary !== null &&
    typeof (obj.eventSummary as Record<string, unknown>).title === 'string';

  const hasBudgetAllocation =
    typeof obj.budgetAllocation === 'object' &&
    obj.budgetAllocation !== null &&
    typeof (obj.budgetAllocation as Record<string, unknown>).total === 'number' &&
    Array.isArray((obj.budgetAllocation as Record<string, unknown>).categories);

  const hasTimeline = Array.isArray(obj.timelineItinerary);
  const hasVendors = Array.isArray(obj.vendorChecklist);
  const hasInvitation =
    typeof obj.invitationStudio === 'object' &&
    obj.invitationStudio !== null &&
    typeof (obj.invitationStudio as Record<string, unknown>).formalInvitation === 'string';
  const hasRisks = Array.isArray(obj.riskContingencyMatrix);

  return Boolean(
    hasEventSummary &&
    hasBudgetAllocation &&
    hasTimeline &&
    hasVendors &&
    hasInvitation &&
    hasRisks,
  );
}

/**
 * Generates a complete EventPlan using Google Gemini 2.0 Flash.
 * Falls back to the deterministic synthesizer if the API is unavailable,
 * the key is missing, or the response fails runtime validation.
 * @param {EventInput} input - The user's event configuration input.
 * @returns {Promise<EventPlan>} The synthesized event plan.
 */
export async function generateEventPlan(input: EventInput): Promise<EventPlan> {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    logger.info('No API key configured. Using deterministic fallback synthesizer.');
    return synthesizeFallbackPlan(input);
  }

  try {
    logger.info('Generating event plan via Gemini 2.0 Flash...');
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_ID,
      contents: buildUserPrompt(input),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    const rawText = response.text ?? '';
    if (!rawText.trim()) {
      logger.warn('Empty response from Gemini API. Falling back to synthesizer.');
      return synthesizeFallbackPlan(input);
    }

    const cleanedJson = cleanJsonString(rawText);
    const rawParsed: unknown = JSON.parse(cleanedJson);
    const parsed: unknown = deepSanitize(rawParsed);

    if (!isValidEventPlanPayload(parsed)) {
      logger.warn('AI response failed structural schema validation. Falling back to synthesizer.');
      return synthesizeFallbackPlan(input);
    }

    /* Assemble the EventPlan with strict type assurance */
    const plan: EventPlan = {
      id: `plan-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      eventType: input.eventType,
      eventDate: input.eventDate,
      guestCount: input.guestCount,
      durationHours: input.durationHours,
      locationType: input.locationType,
      specialRequirements: input.specialRequirements,
      eventSummary: parsed.eventSummary as EventPlan['eventSummary'],
      budgetAllocation: parsed.budgetAllocation as EventPlan['budgetAllocation'],
      timelineItinerary: parsed.timelineItinerary as EventPlan['timelineItinerary'],
      vendorChecklist: parsed.vendorChecklist as EventPlan['vendorChecklist'],
      invitationStudio: parsed.invitationStudio as EventPlan['invitationStudio'],
      personalizedIdeas: Array.isArray(parsed.personalizedIdeas) && parsed.personalizedIdeas.length > 0
        ? (parsed.personalizedIdeas as EventPlan['personalizedIdeas'])
        : generatePersonalizedIdeas(input.eventType),
      riskContingencyMatrix: parsed.riskContingencyMatrix as EventPlan['riskContingencyMatrix'],
      guestList: [],
    };

    logger.info('Event plan successfully generated via Gemini 2.0 Flash.');
    return plan;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Gemini API generation failed. Falling back to synthesizer.', errorMessage);
    return synthesizeFallbackPlan(input);
  }
}
