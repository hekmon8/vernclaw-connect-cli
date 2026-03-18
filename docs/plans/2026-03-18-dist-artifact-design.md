# Dist Artifact Strategy Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Stop tracking `dist` in git while keeping npm publish output correct by building only during `npm pack`/`npm publish`.

**Architecture:** Keep `dist` as the package entrypoint and published artifact, but generate it just-in-time through `prepack`. Repository source of truth remains `src/`, and `.gitignore` prevents rebuilt output from re-entering git history.

**Tech Stack:** Node.js, npm lifecycle scripts, TypeScript compiler, Vitest

---

### Task 1: Lock the desired packaging contract with tests

**Files:**
- Create: `__tests__/package-config.test.ts`
- Modify: `tasks/todo.md`

**Step 1: Write the failing test**

Assert that `package.json` defines:
- `scripts.build`
- `scripts.prepack`
- `files` still includes `dist`

Assert that `.gitignore` contains `dist`.

**Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/package-config.test.ts`
Expected: FAIL because scripts and `.gitignore` do not exist yet.

### Task 2: Implement the packaging changes

**Files:**
- Create: `.gitignore`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `tasks/todo.md`

**Step 1: Add minimal implementation**

- Add `build` script that compiles `src` to `dist`
- Add `prepack` script that runs `build`
- Ignore `dist/` in git
- Update README development and publish sections to reference the new scripts

**Step 2: Re-run the targeted test**

Run: `npx vitest run __tests__/package-config.test.ts`
Expected: PASS

### Task 3: Remove tracked artifacts and verify packaging

**Files:**
- Delete from git tracking: `dist/**`
- Modify: `tasks/todo.md`

**Step 1: Remove tracked `dist` files from the index**

Run: `git rm -r --cached dist`

**Step 2: Verify package output**

Run: `npm pack --dry-run`
Expected: tarball includes `dist/**`, `README.md`, and `LICENSE`

**Step 3: Run broader regression checks**

Run: `npx vitest run __tests__/package-config.test.ts __tests__/cli.test.ts __tests__/help.test.ts`
Expected: PASS
