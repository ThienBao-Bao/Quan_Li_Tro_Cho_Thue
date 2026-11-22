# Boarding House Management System (BHMS)

A React-based web application prototype for browsing rental rooms and managing customer room-viewing records. This project was developed as part of a Software Testing course and includes unit tests, test documentation, and defect-tracking deliverables.

> **Project status:** Partial implementation / academic prototype. The current build focuses on room browsing, authentication, and customer viewing records. It is not a complete end-to-end boarding-house management platform.

## Table of contents

- [Overview](#overview)
- [Implemented features](#implemented-features)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Demo accounts](#demo-accounts)
- [Testing and code quality](#testing-and-code-quality)
- [Test documentation](#test-documentation)
- [Known limitations](#known-limitations)
- [Future improvements](#future-improvements)

## Overview

BHMS provides a simple interface for staff to browse rental-room listings and record customers who come to view rooms. Room browsing is publicly accessible. Authentication is required to access the customer viewing-record module and to create a viewing record.

The application currently uses local mock data stored in JavaScript files. It does not connect to a backend API or persistent database.

## Implemented features

### Room browsing

- Display room listings with room information, pricing, address, and amenities.
- Search rooms by room code and address-related content.
- Filter rooms by location, room type, photo availability, price range, and HOT status.
- Sort room listings by supported sorting options.
- Open the add-customer flow from a room listing (authentication required).

### Authentication and access control

- Public access to the room-browsing page.
- Login for the customer viewing-record module.
- Separate admin and staff roles in the authentication logic.
- Temporary account lockout after repeated failed login attempts.
- Logout returns the user to the public room list.

### Customer room-viewing records

- Add a customer viewing record with customer and viewing details.
- Validate required customer information and phone-number format.
- Reject viewing dates in the past.
- Filter records by search text, date range, price, result, and customer source.
- Export filtered records as a CSV file.

## Technology stack

| Category | Technology |
|---|---|
| UI library | React 19 |
| Build tool / dev server | Vite 8 |
| Language | JavaScript (ES modules, JSX) |
| Styling | CSS |
| Unit testing | Vitest 2.1 |
| Coverage | V8 via `@vitest/coverage-v8` |
| Static analysis | ESLint 10 |
| Package manager | npm |

## Project structure

```text
QuanLiTro_Completed/
├── archive/                 # Superseded project material
├── coverage/                # Generated HTML coverage report
├── Labs/                    # Course labs, SRS, test plan, and test evidence
├── public/                  # Public static assets
├── src/
│   ├── assets/              # Application assets
│   ├── components/          # React UI components
│   ├── data/                # Mock room, guest, and user data
│   ├── logic/               # Business logic and unit tests
│   ├── App.jsx              # Main application component
│   ├── App.css
│   └── index.css
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

### Core business-logic modules

| Module | Responsibility |
|---|---|
| `src/logic/auth.js` | Credential validation and temporary lockout logic |
| `src/logic/roomFilter.js` | Room filtering and sorting |
| `src/logic/guestFilter.js` | Customer viewing-record filtering |
| `src/logic/guestFactory.js` | Form validation and viewing-record creation |
| `src/logic/format.js` | Price formatting and parsing |
| `src/logic/exportGuests.js` | CSV generation and browser download |

The UI components use the same functions that are tested in `src/logic/`, allowing the business logic to be tested independently from the React interface.

## Getting started

### Prerequisites

- Node.js (a current LTS release is recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ThienBao-Bao/Quan_Li_Tro_Cho_Thue.git
   ```

2. Open the project directory:

   ```bash
   cd Quan_Li_Tro_Cho_Thue
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL shown in the terminal. With the default Vite configuration, it is usually:

   ```text
   http://localhost:5173
   ```

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the unit-test suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run coverage` | Run tests and generate a coverage report |
| `npm run lint` | Run ESLint |

## Demo accounts

The repository contains mock accounts for local demonstration only.

| Account type | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Staff sample | `0987555001` | `matkhau1` |
| Staff sample | `0987555100` | `matkhau100` |

The staff accounts are generated in `src/data/users.js`. These credentials are hard-coded demo data and must **not** be used as a production authentication system.

## Testing and code quality

The project includes unit tests for the business-logic modules under `src/logic/`.

The latest test evidence included in this repository reports:

| Check | Recorded result |
|---|---:|
| Unit tests | **116 / 116 passed** |
| Statement coverage | **93.9%** |
| Branch coverage | **91.24%** |
| Function coverage | **95%** |
| ESLint | **0 errors, 0 warnings** |
| Functional tests executed | **35 passed, 1 failed** |
| Functional tests blocked | **43** |
| Defects | **15 raised: 14 fixed, 1 deferred** |

These figures are taken from the project’s included Lab 3 and Lab 4 evidence; they describe the recorded test run and are not a guarantee that every environment or later code change will produce identical results.

To reproduce the checks locally:

```bash
npm test
npm run coverage
npm run lint
npm run build
```

The HTML coverage report is generated in the `coverage/` directory.

## Test documentation

The `Labs/` directory contains the course testing deliverables, including:

- Software Requirements Specification (SRS).
- Test Plan.
- Functional test cases and execution results.
- Unit test cases and automated test implementation.
- Test summary, defect list, execution log, and traceability information.
- `FIXES_Applied.md`, which records the fixes made in response to identified defects.

The authoritative requirement baseline for the submitted testing work is `Labs/SRS_BoardingHouseManagementSystem_v1.1_EN.docx`. The governing test plan is `Labs/TestPlan_BoardingHouseManagementSystem_v1.0_EN.docx`.

## Known limitations

The current application is a partial implementation of the broader BHMS specification:

- Data is stored in in-memory JavaScript mock data; there is no backend or database integration.
- User accounts and credentials are mock data; production-grade authentication and authorization are not implemented.
- Changes made during a session are not persisted after the application is reloaded.
- Contract management, invoicing, payments, maintenance, full administration, and notification services are not implemented in this build.
- The included functional test plan covers a wider scope than the features currently implemented. Some test cases are marked **Blocked** because their required modules do not exist in this build.
- The notification defect recorded as BUG-015 is deferred because the required notification service is outside the current implementation scope.

## Future improvements

Potential next steps for evolving this prototype include:

1. Add a backend API and a persistent database.
2. Replace hard-coded demo credentials with secure, server-side authentication.
3. Implement role-based permissions on the server.
4. Add contract, invoice, payment, and maintenance workflows.
5. Implement in-app and email notifications.
6. Add integration and end-to-end tests for complete user workflows.
7. Add deployment configuration and environment-specific settings.

---

**Note:** This repository is intended for learning, demonstration, and software-testing coursework. Review the known limitations before using it as the basis for a production system.
