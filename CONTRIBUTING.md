# Contributing to EventCraft AI

Thank you for your interest in contributing to EventCraft AI! We maintain strict code quality, architecture, and testing standards.

## Code Quality Standards
- **Strict TypeScript:** All code must compile with zero errors under `npm run typecheck` (`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`).
- **No `any` Types:** Use strong types defined in `src/types/event.ts`.
- **React 19 Memoization:** Wrap all event handlers in `useCallback` and expensive derivations in `useMemo`.
- **Stable Keys:** Never use array indices as React keys.
- **Testing Invariant:** All changes must include corresponding unit tests in `src/test/`. All tests must pass (`npm test`).
- **Code Coverage:** Maintain at least 90% code coverage (`npm run test:coverage`).

## Workflow
1. Fork and create a branch from `main`.
2. Implement your changes following clean architecture boundaries.
3. Run `npm run typecheck`, `npm test`, and `npm run build`.
4. Submit a Pull Request with a conventional commit message.

