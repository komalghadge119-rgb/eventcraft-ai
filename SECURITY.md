# 🔒 Security Policy — EventCraft AI

## Overview
EventCraft AI implements defense-in-depth security principles across input handling, state processing, and LLM communication.

---

## 1. Content Security Policy (CSP)
EventCraft AI enforces a restrictive Content Security Policy defined in `index.html`:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://generativelanguage.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com; img-src 'self' data: blob: https:; frame-ancestors 'none';
```
Key attributes:
- **`frame-ancestors 'none'`**: Protects against UI redressing and clickjacking attacks.
- **`nosniff`**: Prevents MIME-type sniffing exploits.
- **`DENY`**: Restricts framing inside iframes.

---

## 2. Zero-Trust Input Sanitization
All user-entered data (e.g. event requirements, dates, attendee names, dietary restrictions) is processed through a multi-stage sanitizer (`src/utils/sanitizer.ts`):
1. **HTML Entity Encoding:** Converts `<`, `>`, `&`, `"`, `'`, `` ` `` into safe HTML entities.
2. **Length Bounding:** Prevents buffer overflow and denial-of-service via max input truncations.
3. **Prototype Pollution Protection:** Deep object traversal explicitly strips sensitive JavaScript keys (`__proto__`, `constructor`, `prototype`) before state merging.

---

## 3. Secret Management & Ephemeral Token Storage
- **Zero Local Disk Token Persistence:** The Google Gemini API key is stored strictly within browser `sessionStorage` (`eventcraft_gemini_api_key`) and discarded when the browser session terminates.
- **Zero Raw Error Disclosure:** The React `ErrorBoundary` captures rendering anomalies and displays user-friendly recovery actions while suppressing raw call stacks or sensitive environment details in DOM output.

---

## 4. Reporting a Vulnerability
To report a security vulnerability, please contact the maintainer:
- **Author:** Komal Ghadge
- **Email:** `komalghadge119@gmail.com`
- **Response SLA:** Within 24 hours.
