# Lab 3 – Unit Test Code

| | |
|---|---|
| **Student ID** | SE196470 |
| **Full name** | Vo Thanh Hoang |
| **Class** | SE1923 |
| **Course** | SWT301 – Software Testing |
| **Project** | Boarding House Management System (BHMS) |
| **Requirement baseline** | `SRS_BoardingHouseManagementSystem v1.1` (FR-01…FR-30, UCS-01…UCS-06) |
| **Governing test plan** | `TestPlan_BoardingHouseManagementSystem v1.0`, Section 3.1 (Unit level) |
| **Build under test** | QuanLiTro React/Vite build (partial implementation of BHMS) |
| **Test framework** | Vitest 2.1 |
| **Result** | **116 / 116 unit tests PASS** · 93.9 % statement coverage · ESLint clean |

---

## 1. Objective

Write and run **automated unit tests** for the business logic of the build, at the unit level
defined in Test Plan Section 3.1. Because the logic was originally embedded inside React
components, it was first **extracted into pure functions** under `src/logic/`. The components
import those functions, so the tests exercise the *same* code the application runs.

The Test Plan sets a quality gate of **≥ 80 % statement coverage** for core business modules
(Section 3.3). This suite reaches **93.9 %**.

## 2. Files

### Code under test – `src/logic/`
| File | Responsibility | SRS v1.1 requirement |
|------|----------------|----------------------|
| `auth.js` | `authenticate()` – credential validation | FR-02, SEC-1 |
| `format.js` | `formatPrice()`, `parsePriceToNumber()` | FR-07, FR-08 |
| `roomFilter.js` | `filterRooms()`, `matchesPriceRange()`, `sortRooms()`, `getVisibleRooms()`, `parseRoomTime()` | FR-06 |
| `guestFilter.js` | `filterGuests()`, `matchesGuestPrice()` | FR-09 |
| `guestFactory.js` | `validateGuestForm()`, `todayIso()`, `parseViewDateTime()`, `buildGuestTitle()`, `buildGuestRecord()` | FR-08, SAF-3 |
| `exportGuests.js` | `csvEscape()`, `guestsToCsv()`, `downloadCsv()` | FR-29 |

### Test code – `src/logic/*.test.js`
| Test file | # tests | IDs |
|-----------|:------:|-----|
| `format.test.js` | 14 | UT-FMT-01 … 14 |
| `auth.test.js` | 13 | UT-AUTH-01 … 13 |
| `roomFilter.test.js` | 32 | UT-ROOM-01 … 32 |
| `guestFilter.test.js` | 22 | UT-GUEST-01 … 22 |
| `guestFactory.test.js` | 28 | UT-FACT-01 … 28 |
| `exportGuests.test.js` | 7 | UT-CSV-01 … 07 |
| **Total** | **116** | |

Every `it('UT-XXX-nn: …')` maps **1:1** to a row in the Lab 2 unit test case document.

## 3. Test design techniques

- **Equivalence Partitioning (EP)** – one representative value per valid/invalid class.
- **Boundary Value Analysis (BVA)** – values on and around each boundary:
  - Room price ranges: **3,000,000** and **5,000,000** VND.
  - Guest price range: **2,000,000** VND.
  - Date range filters: `fromDate`/`toDate` equal to a record's date (inclusive boundary).
  - Viewing date: **exactly today** (accepted) vs **yesterday** (rejected) — UCS-01 alternative flow 1.
  - Phone length **9–11 digits**.
  - First (`#1`) and last (`#100`) registered accounts.
  - Empty / whitespace-only / `null` inputs.

## 4. Regression tests added for defects

| Test IDs | Defect locked in |
|----------|------------------|
| UT-ROOM-20 | BUG-001 ward filter |
| UT-ROOM-21, 22 | BUG-002 city filter |
| UT-ROOM-23, 24 | BUG-003 house-type filter |
| UT-ROOM-25, 26 | BUG-004 photo-status filter |
| UT-ROOM-27 | BUG-010 HOT filter |
| UT-ROOM-28 … 32 | BUG-005 sorting |
| UT-GUEST-20 … 22 | BUG-006 customer-source filter |
| UT-CSV-01 … 07 | BUG-007 export |
| UT-FACT-20, 21 | BUG-008 phone validation |
| UT-FACT-23 … 28 | BUG-014 past viewing date |

> BUG-012 (stale form data) and BUG-013 (public browsing) are React component-state defects
> rather than pure logic, so they are covered by functional tests TC-APP-11 and TC-ROOM-01/02
> and were verified in the running application.

## 5. How to run

```bash
npm install
npm test           # runs all unit tests once
npm run test:watch # watch mode
npm run coverage   # tests + coverage report
npm run lint       # static analysis
```

## 6. Result (evidence: `Lab3_TestRun_Output.txt`)

```
 Test Files  6 passed (6)
      Tests  116 passed (116)

File             | % Stmts | % Branch | % Funcs | % Lines
-----------------|---------|----------|---------|---------
All files        |    93.9 |   91.24  |      95 |    93.9
 auth.js         |     100 |     100  |     100 |     100
 exportGuests.js |   69.44 |     100  |   66.66 |   69.44
 format.js       |     100 |     100  |     100 |     100
 guestFactory.js |     100 |      80  |     100 |     100
 guestFilter.js  |   94.44 |   96.55  |     100 |   94.44
 roomFilter.js   |   96.87 |   89.83  |     100 |   96.87
-----------------|---------|----------|---------|---------

ESLint: 0 errors, 0 warnings
```

> The uncovered lines in `exportGuests.js` are `downloadCsv()`, a thin browser-download wrapper
> (Blob + anchor click). It is excluded from unit testing on purpose and was verified manually
> in the running application instead (TC-ADM-04).

All unit tests pass, the application builds (`npm run build`) and ESLint reports no issues.
