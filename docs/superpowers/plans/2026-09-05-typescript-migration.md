# MatchaLog TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert MatchaLog's JavaScript application files to TypeScript while preserving the current routes and read behavior.

**Architecture:** Add a strict TypeScript configuration for the Next.js App Router, introduce shared domain types for Supabase rows and API payloads, then convert shared utilities, API handlers, pages, and layout in dependency order. Keep the existing CSS, route structure, and client/server boundaries.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase JS, TypeScript, ESLint.

**Spec:** Approved migration design from the conversation on 2026-09-05.

## Global Constraints

- Preserve route paths, API response shapes, and current read behavior.
- Keep the existing JavaScript-compatible runtime APIs while converting files to `.ts` and `.tsx`.
- Type known Supabase row shapes without exposing secrets or reading environment values into source control.
- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` before completion.
- Do not add tests that only mirror type annotations; use compiler, lint, and build checks for this migration.

---

### Task 1: TypeScript configuration and shared domain types

**Files:**
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `lib/types.ts`
- Convert: `lib/constants.js` → `lib/constants.ts`
- Convert: `lib/supabase.js` → `lib/supabase.ts`

- [x] Add TypeScript compiler settings compatible with Next.js and path aliases.
- [x] Define product, review, stash item, recipe, and API response types from current usage.
- [x] Type the Supabase client environment variables and shared user constant.
- [x] Run `npx tsc --noEmit` and fix configuration or shared-type errors.

### Task 2: API route handlers

**Files:**
- Convert: `app/api/products/route.js` → `app/api/products/route.ts`
- Convert: `app/api/products/[productId]/route.js` → `app/api/products/[productId]/route.ts`
- Convert: `app/api/reviews/[productId]/route.js` → `app/api/reviews/[productId]/route.ts`
- Convert: `app/api/stash/[userStash]/route.js` → `app/api/stash/[userStash]/route.ts`
- Convert: `app/api/recipes/[recipeId]/route.js` → `app/api/recipes/[recipeId]/route.ts`
- Convert: `app/api/profile/[userId]/route.js` → `app/api/profile/[userId]/route.ts`

- [x] Type request parameters and JSON responses.
- [x] Preserve existing empty or read-only handlers and make their current behavior explicit in types.
- [x] Run lint and type checking for the route layer.

### Task 3: Pages and layout

**Files:**
- Convert: `app/layout.js` → `app/layout.tsx`
- Convert: `app/page.js` → `app/page.tsx`
- Convert: `app/products/[productId]/page.js` → `app/products/[productId]/page.tsx`
- Convert: `app/stash/[userStash]/page.js` → `app/stash/[userStash]/page.tsx`
- Convert: `app/recipes/page.js` → `app/recipes/page.tsx`
- Convert: `app/recipes/[recipeId]/page.js` → `app/recipes/[recipeId]/page.tsx`
- Convert: `app/profile/[userId]/page.js` → `app/profile/[userId]/page.tsx`

- [x] Type component props, state, event handlers, fetch payloads, and route params.
- [x] Preserve client component directives and existing navigation.
- [x] Let TypeScript expose existing incomplete recipe/profile behavior without inventing unrelated product changes.

### Task 4: Verification and cleanup

**Files:**
- Modify: `package.json` and `package-lock.json` if TypeScript packages are needed.
- Remove: converted `.js` source files after each `.ts`/`.tsx` replacement is verified.

- [x] Run `npm run lint`.
- [x] Run `npx tsc --noEmit`.
- [x] Run `npm run build`.
- [x] Review `git diff --check` and the final source file inventory.
