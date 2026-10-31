/**
 * @fileoverview Google Gemini 2.0 Flash AI service for AuraPlan AI.
 * Uses the official @google/genai TypeScript SDK with schema-enforced JSON output.
 * Includes comprehensive system prompt for the 5-Agent Cognitive Council architecture.
 */

import { GoogleGenAI } from '@google/genai';
import type { EventInput, EventPlan } from '../types/event';
import { GEMINI_MODEL_ID, SESSION_KEY_API } from '../constants';
import { synthesizeFallbackPlan } from './fallbackSynthesizer';
import { logger } from '../utils/logger';

/**
 * System instruction prompt injected into every Gemini API request.
 * Commands the model to operate as a 5-Agent Cognitive Council producing
 * structured JSON output adhering to the EventPlan schema.
 * @constant {string}
 */
const SYSTEM_INSTRUCTION = `# IDENTITY & SYSTEM ROLE
You are "AuraPlan Core" — an autonomous, hyper-specialized Event Architect & Operational Intelligence Engine. You synthesize mathematically sound, operationally viable, and culturally nuanced master event plans.

When given an event blueprint request, synthesize output through 5 specialized sub-agents:
1. [ARCHITECT]: Theme Concept, Color Palette (4 HEX codes), Dress Code, Tagline, and Dual-channel Invitation Copy (formal + WhatsApp).
2. [CHRONOPLANNER]: Hourly schedule with 15–30 min transition buffers between activities.
3. [QUANT]: 5-pillar budget allocation (Venue 35%, Food 28%, Decor 15%, Entertainment 12%, Logistics 10%) with exact 12% contingency reserve satisfying the invariant: total = sum(pillar allocations) + contingency.
4. [LOGISTICS]: Procurement milestones with contractual SLA clauses and vendor negotiation checks.
5. [SENTINEL]: FMEA risks with probability/impact ratings and measurable trigger conditions for automated Plan B activation.

CRITICAL RULES:
- Output ONLY raw JSON. No markdown fences, no explanations, no preamble.
- All budget math must be mathematically coherent: total = sum(all category allocated amounts) + contingencyReserve.
- The contingencyReserve must be exactly 12% of the total budget.
- Color palette must contain exactly 4 valid HEX color codes.
- Timeline must include buffer minutes (15-30) between each activity.
- Each risk must have a specific, measurable triggerCondition.

Output raw JSON adhering strictly to this schema:
{
  "eventSummary": {
    "title": "string",
    "themeConcept": "string (2-3 sentences describing the aesthetic vision)",
    "colorPalette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
    "dressCode": "string",
    "tagline": "string (memorable one-liner)"
  },
  "budgetAllocation": {
    "total": number,
    "currency": "string (ISO 4217)",
    "contingencyReserve": number (12% of total),
    "categories": [
      { "category": "Venue & Infrastructure", "allocated": number, "percentage": 35, "tips": "string", "actualSpent": 0 },
      { "category": "Food & Beverage / Catering", "allocated": number, "percentage": 28, "tips": "string", "actualSpent": 0 },
      { "category": "Decor, Lighting & Atmospheric AV", "allocated": number, "percentage": 15, "tips": "string", "actualSpent": 0 },
      { "category": "Entertainment, Emcee & Media Production", "allocated": number, "percentage": 12, "tips": "string", "actualSpent": 0 },
      { "category": "Logistics, Favors & Guest Care", "allocated": number, "percentage": 10, "tips": "string", "actualSpent": 0 }
    ]
  },
  "timelineItinerary": [
    { "time": "HH:MM AM/PM", "phase": "Arrival | Core Ceremony | Reception | Wrap-up", "activity": "string", "details": "string", "bufferMinutes": 15-30, "completed": false }
  ],
  "vendorChecklist": [
    { "id": "v1", "category": "Venue|Catering|Media|Decor|Entertainment|Logistics|Stationery|Favors", "task": "string", "deadlineWeeksBefore": number, "priority": "High|Medium|Low", "negotiationCheck": "string (specific SLA clause)", "completed": false }
  ],
  "invitationStudio": {
    "formalInvitation": "string (3-4 sentence formal invitation)",
    "casualWhatsAppCopy": "string (emoji-rich casual WhatsApp message)",
    "rsvpCallToAction": "string"
  },
  "riskContingencyMatrix": [
    { "risk": "string", "probability": "Low|Med|High", "impact": "Low|Med|High|Critical", "contingencyPlan": "string", "triggerCondition": "string (measurable condition)" }
  ]
}`;

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
 * Builds the user prompt for the Gemini API request from event input parameters.
 * @param {EventInput} input - The event configuration input.
 * @returns {string} The formatted user prompt string.
 */
function buildUserPrompt(input: EventInput): string {
  return `Synthesize a complete master event blueprint for the following event:

Event Type: ${input.eventType}
Event Date: ${input.eventDate}
Total Budget: ${input.currency} ${input.totalBudget.toLocaleString()}
Expected Guests: ${input.guestCount}
Duration: ${input.durationHours} hours
Location Setting: ${input.locationType}
Special Requirements: ${input.specialRequirements || 'None specified'}

Generate the full plan with all 5 agents contributing their specialized outputs.`;
}

/**
 * Generates a complete EventPlan using Google Gemini 2.0 Flash.
 * Falls back to the deterministic synthesizer if the API is unavailable,
 * the key is missing, or the response fails to parse.
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
    const parsed = JSON.parse(cleanedJson);

    /* Assemble the EventPlan with metadata */
    const plan: EventPlan = {
      id: `plan-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      eventType: input.eventType,
      eventDate: input.eventDate,
      guestCount: input.guestCount,
      durationHours: input.durationHours,
      locationType: input.locationType,
      specialRequirements: input.specialRequirements,
      eventSummary: parsed.eventSummary,
      budgetAllocation: parsed.budgetAllocation,
      timelineItinerary: parsed.timelineItinerary,
      vendorChecklist: parsed.vendorChecklist,
      invitationStudio: parsed.invitationStudio,
      riskContingencyMatrix: parsed.riskContingencyMatrix,
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
