# FlavorHunt – Test Execution Report

## Execution Summary

| Metric | Count |
|---|---:|
| **Total Test Cases** | 18 |
| **Passed** | 18 |
| **Failed** | 0 |
| **Skipped** | 0 |
| **Pass Rate** | 100% |

## Execution Command

```powershell
npx vitest run --reporter=verbose
```
(Also registered as `npm run test:api` in `package.json` without modifying the existing `react-scripts test` script.)

## Execution Environment

- **Operating System:** Windows (`win32`)
- **Node.js Version:** `v24.18.1`
- **npm Version:** `11.16.0`
- **Test Framework:** `Vitest 5.1.2` + `Supertest`
- **Isolation Strategy:** Express test harness (`tests/helpers/testApp.js`) mounts the actual `routes/auth.js` and `routes/recipes.js` (including `middleware/authMiddleware.js`). Mongoose models (`User`, `Recipe`) and `axios` (Spoonacular API) are spied/mocked per test, while real `bcrypt`, `jsonwebtoken`, Express routing, and Mongoose `validateSync()` schema validation execute. No real MongoDB instance or external Spoonacular API key was used.

## Detailed Test Results

| Test ID | Test File & Suite | Status |
|---|---|---|
| FH-TC-001 | `tests/auth.test.js` – User Registration Success | PASS |
| FH-TC-002 | `tests/auth.test.js` – Duplicate User Registration | PASS |
| FH-TC-003 | `tests/auth.test.js` – Registration Missing Password | PASS |
| FH-TC-004 | `tests/auth.test.js` – Registration Database Error | PASS |
| FH-TC-005 | `tests/auth.test.js` – User Login Success | PASS |
| FH-TC-006 | `tests/auth.test.js` – User Login Non-Existent Email | PASS |
| FH-TC-007 | `tests/auth.test.js` – User Login Incorrect Password | PASS |
| FH-TC-008 | `tests/middleware.test.js` – Missing Authorization Header | PASS |
| FH-TC-009 | `tests/middleware.test.js` – Malformed Authorization Header | PASS |
| FH-TC-010 | `tests/middleware.test.js` – Invalid or Expired JWT Token | PASS |
| FH-TC-011 | `tests/recipes.test.js` – Public Recipe Search & Filtering | PASS |
| FH-TC-012 | `tests/recipes.test.js` – Public Recipe Search Upstream Failure | PASS |
| FH-TC-013 | `tests/recipes.test.js` – Get Recipe Details by ID | PASS |
| FH-TC-014 | `tests/recipes.test.js` – Get Recipe Details Non-Existent ID | PASS |
| FH-TC-015 | `tests/recipes.test.js` – Create Custom Recipe Success | PASS |
| FH-TC-016 | `tests/recipes.test.js` – Create Custom Recipe Unauthorized | PASS |
| FH-TC-017 | `tests/recipes.test.js` – Create Custom Recipe Missing Required Fields | PASS |
| FH-TC-018 | `tests/recipes.test.js` – Retrieve Saved Custom Recipes & Missing User | PASS |

## Failure Details

None. All 18 test cases across 3 test files passed in `3.73s`.

## QA Observations (Application Notes)

The following repository and application observations were noted without modifying existing application code:

1. **Missing Express entrypoint (`server.js`):** The repository contains `routes/auth.js`, `routes/recipes.js`, `middleware/authMiddleware.js`, `models/User.js`, `models/Recipe.js`, and `config/loadEnv.js`, but no Express server entrypoint file. `tests/helpers/testApp.js` mounts the routers at `/api/auth` and `/api/recipes` matching the URLs called by `components/Login.jsx`, `Register.jsx`, `CreateRecipe.jsx`, and `Home.jsx`.
2. **Unimplemented CRUD/Profile features:** Backend routes for recipe update (`PUT/PATCH`), recipe deletion (`DELETE`), user profile updates, and favorites (`onShowFavorites` is a stub in `Home.jsx`) are not implemented in this repository. All 18 tests target actually implemented backend functionality.
3. **Validation error status codes (`FH-TC-003`, `FH-TC-017`):** Missing `password` on `/api/auth/register` and missing required Mongoose fields on `/api/recipes/create` currently return HTTP `500` instead of `400 Bad Request`.
4. **Root `package.json`:** Originally contained only Create React App frontend dependencies; backend & test dependencies (`vitest`, `supertest`, `express`, `mongoose`, `bcrypt`) were added as `devDependencies` alongside a `test:api` script.
