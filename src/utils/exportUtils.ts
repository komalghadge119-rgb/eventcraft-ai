/**
 * @fileoverview Export utilities for AuraPlan AI.
 * Provides RFC 5545 compliant .ics calendar export, PDF print view,
 * and Markdown executive dossier generation with CRLF injection defense.
 */

import type { EventPlan, TimelineItem } from '../types/event';

/**
 * Generates a unique identifier for iCalendar event entries.
 * Uses a combination of timestamp and random hex string for RFC 5545 UID compliance.
 * @returns {string} A unique UID string safe for use in .ics files.
 */
export function generateIcsUid(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}@auraplan.ai`;
}

/**
 * Escapes special characters in text for safe inclusion in iCalendar fields.
 * Handles commas, semicolons, backslashes, and newlines per RFC 5545 Section 3.3.11.
 * Also defends against CRLF injection attacks by stripping raw CR/LF sequences.
 * @param {string} text - The raw text to escape for iCalendar format.
 * @returns {string} The escaped text safe for .ics field values.
 */
export function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\\n')
    .replace(/\r/g, '\\n')
    .replace(/\n/g, '\\n');
}

/**
 * Formats a Date object as an iCalendar DTSTART/DTEND value string.
 * Uses the YYYYMMDDTHHMMSS format without timezone (floating time).
 * @param {Date} date - The date to format.
 * @returns {string} The formatted iCalendar datetime string.
 */
function formatIcsDate(date: Date): string {
  const pad = (n: number): string => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Generates an RFC 5545 compliant .ics calendar file content string from an EventPlan.
 * Includes VEVENT entries for each timeline activity with proper UID, DTSTART, SUMMARY,
 * and DESCRIPTION fields. Implements CRLF line endings as required by RFC 5545.
 * @param {EventPlan} plan - The event plan to export as a calendar file.
 * @returns {string} Complete .ics file content string with CRLF line endings.
 */
export function generateIcsContent(plan: EventPlan): string {
  const eventDate = plan.eventDate ? new Date(plan.eventDate) : new Date();
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AuraPlan AI//Event Architect//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(plan.eventSummary.title)}`,
  ];

  plan.timelineItinerary.forEach((item: TimelineItem, index: number) => {
    const uid = generateIcsUid();
    const startDate = new Date(eventDate);

    const timeParts = item.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeParts) {
      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);
      const period = timeParts[3].toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      startDate.setHours(hours, minutes, 0, 0);
    } else {
      startDate.setHours(8 + index, 0, 0, 0);
    }

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + item.bufferMinutes + 60);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:${escapeIcsText(item.activity)}`,
      `DESCRIPTION:${escapeIcsText(`[${item.phase}] ${item.details}`)}`,
      `CATEGORIES:${escapeIcsText(item.phase)}`,
      'END:VEVENT',
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Triggers a browser download of the .ics calendar file.
 * Creates a temporary Blob URL and programmatically clicks a download anchor.
 * @param {EventPlan} plan - The event plan to export.
 */
export function downloadIcsFile(plan: EventPlan): void {
  const content = generateIcsContent(plan);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${plan.eventSummary.title.replace(/\s+/g, '_')}_AuraPlan.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Generates a Markdown executive dossier summary of the event plan.
 * Includes all 5-agent outputs formatted as a professional document.
 * @param {EventPlan} plan - The event plan to convert to Markdown format.
 * @returns {string} Complete Markdown-formatted executive dossier string.
 */
export function generateMarkdownDossier(plan: EventPlan): string {
  const lines: string[] = [];
  const s = plan.eventSummary;
  const b = plan.budgetAllocation;

  lines.push(`# 📋 ${s.title} — Executive Dossier`);
  lines.push(`> *${s.tagline}*\n`);
  lines.push(`**Theme Concept:** ${s.themeConcept}`);
  lines.push(`**Dress Code:** ${s.dressCode}`);
  lines.push(`**Color Palette:** ${s.colorPalette.join(' · ')}`);
  lines.push(`**Event Type:** ${plan.eventType} | **Guests:** ${plan.guestCount} | **Duration:** ${plan.durationHours}h`);
  if (plan.eventDate) {
    lines.push(`**Date:** ${plan.eventDate}`);
  }
  lines.push('');

  lines.push('## 💰 Budget Allocation');
  lines.push(`**Total Budget:** ${b.currency} ${b.total.toLocaleString()}`);
  lines.push(`**Contingency Reserve (12%):** ${b.currency} ${b.contingencyReserve.toLocaleString()}\n`);
  lines.push('| Category | Allocated | % | Tips |');
  lines.push('| --- | --- | --- | --- |');
  b.categories.forEach((c) => {
    lines.push(`| ${c.category} | ${b.currency} ${c.allocated.toLocaleString()} | ${c.percentage}% | ${c.tips} |`);
  });
  lines.push('');

  lines.push('## ⏱️ Timeline & Run-of-Show');
  lines.push('| Time | Phase | Activity | Details | Buffer |');
  lines.push('| --- | --- | --- | --- | --- |');
  plan.timelineItinerary.forEach((t) => {
    lines.push(`| ${t.time} | ${t.phase} | ${t.activity} | ${t.details} | ${t.bufferMinutes}m |`);
  });
  lines.push('');

  lines.push('## 📋 Vendor Checklist');
  plan.vendorChecklist.forEach((v) => {
    lines.push(`- [${v.completed ? 'x' : ' '}] **${v.category}**: ${v.task} (${v.priority} priority, ${v.deadlineWeeksBefore}w before)`);
  });
  lines.push('');

  lines.push('## 💌 Invitation Studio');
  lines.push('### Formal Invitation');
  lines.push(plan.invitationStudio.formalInvitation);
  lines.push('\n### WhatsApp Copy');
  lines.push(plan.invitationStudio.casualWhatsAppCopy);
  lines.push('');

  lines.push('## 🛡️ Risk Contingency Matrix');
  lines.push('| Risk | Probability | Impact | Plan B | Trigger |');
  lines.push('| --- | --- | --- | --- | --- |');
  plan.riskContingencyMatrix.forEach((r) => {
    lines.push(`| ${r.risk} | ${r.probability} | ${r.impact} | ${r.contingencyPlan} | ${r.triggerCondition} |`);
  });

  return lines.join('\n');
}

/**
 * Triggers a browser download of the Markdown executive dossier.
 * @param {EventPlan} plan - The event plan to export.
 */
export function downloadMarkdownDossier(plan: EventPlan): void {
  const content = generateMarkdownDossier(plan);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${plan.eventSummary.title.replace(/\s+/g, '_')}_Dossier.md`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Opens the browser print dialog for PDF export.
 * Uses window.print() which allows the user to select "Save as PDF".
 */
export function triggerPdfPrint(): void {
  window.print();
}
