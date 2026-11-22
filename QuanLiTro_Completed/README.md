# Boarding House Management System (BHMS) — SWT301 submission

| | |
|---|---|
| **Student** | Vo Thanh Hoang — SE196470 — SE1923 |
| **Course** | SWT301 – Software Testing |
| **Requirement baseline** | `Labs/SRS_BoardingHouseManagementSystem_v1.1_EN.docx` (FR-01…FR-30, UCS-01…UCS-06) |
| **Governing test plan** | `Labs/TestPlan_BoardingHouseManagementSystem_v1.0_EN.docx` |
| **Build** | React 19 + Vite 8 SPA — a **partial** implementation of the BHMS specification |

---

## What this repository contains

```
src/
  components/   React UI (Login, Header, SubNavbar, RoomSale, GuestVisit, AddGuestModal, Icons)
  logic/        Pure business logic + its unit tests  <- the code under test
  data/         Seed data (rooms, viewing records, 100 mock accounts)
Labs/           The four lab deliverables + the two project documents
archive/        Superseded material (see archive/README.md)
```

The business logic was extracted out of the components into `src/logic/` so it can be unit
tested in isolation. The components import those same functions, so the tests exercise the
code the application actually runs.

| Module | Responsibility | Requirement |
|--------|----------------|-------------|
| `auth.js` | credential validation | FR-02, SEC-1 |
| `roomFilter.js` | room filtering + sorting | FR-06 |
| `guestFilter.js` | record list filtering | FR-09 |
| `guestFactory.js` | form validation + record construction | FR-08, SAF-3 |
| `format.js` | price formatting / parsing | FR-07, FR-08 |
| `exportGuests.js` | CSV export | FR-29 |

## Running it

```bash
npm install
npm run dev        # start the app on http://localhost:5173
npm test           # 116 unit tests
npm run coverage   # coverage report (Test Plan gate: >= 80% statements)
npm run lint       # static analysis
npm run build      # production build
```

Sample accounts: `0987555001 / matkhau1` … `0987555100 / matkhau100`, plus `admin / admin123`.
Room browsing is public; logging in is required only for the viewing-record module.

## Current quality status

| Check | Result |
|-------|--------|
| Unit tests | **116 / 116 pass** |
| Statement coverage (`src/logic`) | **93.9 %** |
| ESLint | **0 errors, 0 warnings** |
| Production build | succeeds |
| Functional tests executed | 35 pass / 1 fail / 43 blocked (of 79 designed) |
| Defects | 15 raised — 14 fixed and closed, 1 deferred |

## Scope limitation (important)

This build implements roughly **7 of the 30 functional requirements** in SRS v1.1 —
authentication, room browsing/filtering and the viewing-record module. Contracts, invoicing,
payments, maintenance, administration and notifications are **not implemented**, which is why
43 of the 79 designed test cases are recorded as *Blocked* rather than passed. The reasoning is
documented in `Labs/Lab4_...xlsx` (section 6, "Deviations from the plan").

## Lab deliverables

| Lab | File | Contents |
|-----|------|----------|
| 1 | `Labs/Lab1_...xlsx` | 79 functional test cases covering all 30 FRs |
| 2 | `Labs/Lab2_...xlsx` | 116 unit test cases (EP + BVA) |
| 3 | `src/logic/*.test.js` + `Labs/Lab3_...README.md` + `Labs/Lab3_TestRun_Output.txt` | unit test code and execution evidence |
| 4 | `Labs/Lab4_...xlsx` | test summary report, execution log, defect list, traceability matrix |

`Labs/FIXES_Applied.md` documents every code change made in response to a defect.
