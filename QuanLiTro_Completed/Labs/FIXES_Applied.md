# Defect Fixes Applied to the BHMS Build

**Student:** SE196470 – Vo Thanh Hoang · **Class:** SE1923 · **Course:** SWT301
**Baseline:** `SRS_BoardingHouseManagementSystem v1.1` · **Plan:** `TestPlan_BoardingHouseManagementSystem v1.0`

Testing raised **15 defects**. **14 were fixed and re-tested Pass**; **1 is Deferred** because it
depends on a module that does not exist in this build. Final state: **116/116 unit tests pass**,
**35/36 executed functional tests pass**, **93.9 % statement coverage**, **ESLint clean**.

---

## Fixed and closed

| Defect | Fix | Files changed |
|--------|-----|---------------|
| **BUG-001** Ward filter inert | `filterRooms()` matches the ward keyword against the address | `logic/roomFilter.js`, `components/RoomSale.jsx` |
| **BUG-002** City filter inert | `filterRooms()` matches the city keyword against the address | `logic/roomFilter.js`, `components/RoomSale.jsx` |
| **BUG-003** House-type filter inert | "Chính chủ" → owner-occupied rooms, "NhaTroVN" → the rest | `logic/roomFilter.js`, `components/RoomSale.jsx` |
| **BUG-004** Photo-status filter not wired | Select bound to state (`has`/`none`); filter checks `room.image` | `logic/roomFilter.js`, `components/RoomSale.jsx` |
| **BUG-005** Sort-by not implemented | New `sortRooms()` / `getVisibleRooms()` — priceAsc, priceDesc, newest | `logic/roomFilter.js`, `components/RoomSale.jsx` |
| **BUG-006** Customer-source filter inert | `filterGuests()` matches `source`; captured on create and seeded | `logic/guestFilter.js`, `logic/guestFactory.js`, `data/guests.js`, `components/GuestVisit.jsx`, `components/AddGuestModal.jsx` |
| **BUG-007** Export button dead | New `exportGuests.js` builds a UTF-8 CSV and downloads it | `logic/exportGuests.js` *(new)*, `components/GuestVisit.jsx` |
| **BUG-008** No phone format validation | `validateGuestForm()` requires 9–11 digits | `logic/guestFactory.js` |
| **BUG-009** Login error leaked a credential | Generic credential error, no hint | `logic/auth.js` |
| **BUG-010** HOT button inert | HOT toggles a featured-only filter (`room.isHot`) | `logic/roomFilter.js`, `components/RoomSale.jsx` |
| **BUG-011** City default casing mismatch | Default state matches the `<option value>` exactly | `components/RoomSale.jsx` |
| **BUG-012** Form kept the previous entry | State derived from props via `useState` initialisers; modal re-keyed on each open | `components/AddGuestModal.jsx`, `App.jsx` |
| **BUG-013** Browsing required a login | Room list is now the public landing page; login required only for the record module and for creating a record; logout control added | `App.jsx`, `components/Header.jsx`, `App.css` |
| **BUG-014** Past viewing date accepted | `validateGuestForm()` compares the parsed date with today and rejects past dates | `logic/guestFactory.js`, `components/AddGuestModal.jsx` |

## Deferred

| Defect | Why it is deferred |
|--------|--------------------|
| **BUG-015** No notification is sent to the Owner when a record is submitted | FR-11 / FR-26 require the notification service (in-app + email), which is not part of this build. Approved by the Test Lead and recorded in the Lab 4 defect list. |

---

## How BUG-013 and BUG-014 were found

Both surfaced only after the test cases were re-traced to **SRS v1.1**:

- **BUG-013** — FR-06, FR-07 and UI-2 state that a *Guest* can search rooms and view details
  **without authentication**. The build opened on the login page and exposed nothing until a user
  signed in, so TC-ROOM-01 and TC-ROOM-02 failed.
- **BUG-014** — UCS-01 alternative flow 1 requires a move-in date in the past to be rejected.
  A probe confirmed `01/01/2020` was accepted and stored as `2020-01-01`.

---

## Live verification (dev server, Chrome)

| Check | Expected | Observed |
|-------|----------|----------|
| Anonymous landing page | Room list, no login required | ✅ 10 rooms, 10 images, header shows "Đăng nhập" |
| Anonymous opens the record module | Redirected to login, no data leak | ✅ login form shown, 0 guest cards |
| Login from that prompt | Returns to the page originally requested | ✅ landed on the record list, header shows "Đăng xuất" |
| Past viewing date `01/01/2020` | Rejected | ✅ "Ngày xem phòng không được ở quá khứ!", nothing saved |
| Future date `31/12/2026` | Saved | ✅ record created, name stored upper-case |
| Logout | Back to public rooms, session data cleared | ✅ 0 guest cards, 10 rooms still public |
| HOT toggle | Featured rooms only | ✅ 10 → 2 rooms |
| Sort by price ascending | Cheapest first | ✅ 2,200,000 first |
| Ward filter | Matching rooms only | ✅ 1 room |
| Source filter (Facebook) | Matching records only | ✅ 2 records |
| Export | CSV downloaded | ✅ `text/csv`, 551 bytes |
| Browser console | No errors | ✅ clean |

---

## Regression safety

- `npm test` → **116 passed (116)** — regression tests were added for every fixed defect.
- `npm run coverage` → **93.9 %** statements, **95 %** functions (Test Plan gate: ≥ 80 %).
- `npm run build` → succeeds.
- `npm run lint` → **0 errors, 0 warnings**.
