import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType, PageBreak,
  convertInchesToTwip, Header, Footer, PageNumber, NumberFormat,
  UnderlineType, LevelFormat
} from 'docx';
import fs from 'fs';

// ─── Color palette ───────────────────────────────────────────────────────────
const C = {
  primary:  '1F3864',
  accent:   '2E74B5',
  accent2:  'C55A11',
  headerBg: 'BDD7EE',
  rowAlt:   'DEEAF1',
  white:    'FFFFFF',
  black:    '000000',
  gray:     'F2F2F2',
  darkGray: '595959',
  border:   '4472C4',
};

// ─── Helper functions ─────────────────────────────────────────────────────────
function h(level, text) {
  const sizes = { 1: 36, 2: 30, 3: 26, 4: 24 };
  const colors = { 1: C.primary, 2: C.accent, 3: C.accent2, 4: C.primary };
  const hlMap = {
    1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3, 4: HeadingLevel.HEADING_4
  };
  return new Paragraph({
    heading: hlMap[level],
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true, color: colors[level], size: sizes[level] })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [new TextRun({
      text, size: opts.size || 22,
      bold: opts.bold || false,
      italics: opts.italic || false,
      color: opts.color || C.black,
    })],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { before: 40, after: 40 },
    indent: { left: convertInchesToTwip(0.3 + level * 0.3) },
    children: [new TextRun({ text, size: 22 })],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function cell(text, opts = {}) {
  return new TableCell({
    shading: opts.bg ? { type: ShadingType.SOLID, color: opts.bg, fill: opts.bg } : undefined,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    columnSpan: opts.span,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({
        text: String(text),
        bold: opts.bold || false,
        color: opts.color || C.black,
        size: opts.size || 20,
      })],
    })],
  });
}

function headerRow(texts, widths = []) {
  return new TableRow({
    tableHeader: true,
    children: texts.map((t, i) => cell(t, {
      bold: true, bg: C.primary, color: C.white,
      width: widths[i], align: AlignmentType.CENTER, size: 20
    })),
  });
}

function simpleTable(headers, rows, widths = []) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top:     { style: BorderStyle.SINGLE, size: 4, color: C.border },
      bottom:  { style: BorderStyle.SINGLE, size: 4, color: C.border },
      left:    { style: BorderStyle.SINGLE, size: 4, color: C.border },
      right:   { style: BorderStyle.SINGLE, size: 4, color: C.border },
      insideH: { style: BorderStyle.SINGLE, size: 2, color: C.border },
      insideV: { style: BorderStyle.SINGLE, size: 2, color: C.border },
    },
    rows: [
      headerRow(headers, widths),
      ...rows.map((row, ri) =>
        new TableRow({
          children: row.map((cellText, ci) =>
            cell(cellText, { bg: ri % 2 === 0 ? C.white : C.rowAlt, width: widths[ci] })
          ),
        })
      ),
    ],
  });
}

function codeBlock(lines) {
  return lines.map(line =>
    new Paragraph({
      spacing: { before: 16, after: 16 },
      indent: { left: convertInchesToTwip(0.2) },
      children: [new TextRun({ text: line, font: 'Courier New', size: 17, color: C.primary })],
    })
  );
}

function divider() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent } },
    children: [],
  });
}

function space(n = 1) {
  return new Paragraph({ spacing: { before: 80 * n, after: 0 }, children: [] });
}

// ════════════════════════════════════════════════════════════════════════════
//  BUILD DOCUMENT CHILDREN ARRAY
// ════════════════════════════════════════════════════════════════════════════
const children = [];

// ── COVER PAGE ────────────────────────────────────────────────────────────────
children.push(space(10));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'SOFTWARE REQUIREMENTS SPECIFICATION', bold: true, size: 56, color: C.primary })],
}));
children.push(new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: '─────────────────────────────────────────────', color: C.accent, size: 28 })],
}));
children.push(new Paragraph({ spacing: { before: 240 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Boarding House Management System', bold: true, size: 42, color: C.accent })],
}));
children.push(new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: '(QuanLiTro – Quản Lý Trọ)', italics: true, size: 30, color: C.darkGray })],
}));
children.push(space(4));
children.push(new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Version 1.0  |  July 2026', size: 24, color: C.darkGray })],
}));
children.push(space(2));
children.push(new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Prepared for: SWT – Software Testing Course', size: 22, color: C.darkGray })],
}));
children.push(new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Ho Chi Minh City – Vietnam', size: 22, color: C.darkGray })],
}));
children.push(pageBreak());

// ── REVISION HISTORY ─────────────────────────────────────────────────────────
children.push(h(1, '0. Revision History'));
children.push(simpleTable(
  ['Version', 'Date', 'Author', 'Description'],
  [['1.0', 'July 21, 2026', 'Development Team', 'Initial release of SRS document']],
  [10, 20, 30, 40]
));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 1: INTRODUCTION
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '1. Introduction'));

children.push(h(2, '1.1 Purpose'));
children.push(p('This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for the Boarding House Management System (QuanLiTro). It provides a comprehensive description of the system so that developers, testers, project managers, and stakeholders can understand what the system does, how it should behave, and the constraints it operates under.'));
children.push(p('This document serves as the agreement between the development team and the client regarding the features and capabilities of the system.'));

children.push(h(2, '1.2 Scope'));
children.push(p('"QuanLiTro" is a web-based SPA designed to assist real estate agents and landlords in managing available boarding rooms, tracking potential tenants, and managing the room viewing pipeline. Primary functional areas:'));
children.push(bullet('Room listing management and catalog browsing'));
children.push(bullet('Advanced room filtering by location, price, and amenities'));
children.push(bullet('Prospective tenant (guest) registration for room viewings'));
children.push(bullet('Guest visit tracking and status management'));
children.push(bullet('Staff authentication and access control'));
children.push(p('Out of scope: financial billing, long-term lease contracts, and maintenance scheduling.'));

children.push(h(2, '1.3 Definitions, Acronyms, and Abbreviations'));
children.push(simpleTable(
  ['Term / Acronym', 'Definition'],
  [
    ['BHMS', 'Boarding House Management System (QuanLiTro)'],
    ['SRS', 'Software Requirements Specification'],
    ['Guest / Tenant', 'A prospective renter who has expressed interest in viewing a room'],
    ['Staff / Agent', 'An internal employee who manages listings and escorts guests'],
    ['Admin', 'System administrator with full access privileges'],
    ['Room Listing', 'A record representing an available boarding room'],
    ['Room Viewing', 'A scheduled or recorded visit by a guest to a room'],
    ['Deposit (Coc)', 'A reservation fee paid by a guest to hold a room'],
    ['UC', 'Use Case'],
    ['DFD', 'Data Flow Diagram'],
    ['LDM', 'Logical Data Model'],
    ['FR', 'Functional Requirement'],
    ['NFR', 'Non-Functional Requirement'],
  ],
  [30, 70]
));

children.push(h(2, '1.4 References'));
children.push(bullet('React 19 Official Documentation – https://react.dev'));
children.push(bullet('Vite Build Tool Documentation – https://vitejs.dev'));
children.push(bullet('IEEE Std 830-1998: Recommended Practice for SRS'));
children.push(bullet('Project Source Code: d:\\SUM26\\SWT\\QuanLiTro'));

children.push(h(2, '1.5 Document Overview'));
children.push(bullet('Section 1: Introduction'));
children.push(bullet('Section 2: Overall Description'));
children.push(bullet('Section 3: Context Diagram'));
children.push(bullet('Section 4: Swimlane Diagram'));
children.push(bullet('Section 5: Use Case Diagram'));
children.push(bullet('Section 6: Use Case Specifications'));
children.push(bullet('Section 7: State Diagrams'));
children.push(bullet('Section 8: Data Flow Diagram (DFD)'));
children.push(bullet('Section 9: Logical Data Model'));
children.push(bullet('Section 10: Functional Requirements'));
children.push(bullet('Section 11: Non-Functional Requirements'));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 2: OVERALL DESCRIPTION
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '2. Overall Description'));

children.push(h(2, '2.1 Product Perspective'));
children.push(p('QuanLiTro is a standalone browser-based SPA built with React 19 and Vite. It operates independently without external ERP integration. Data is managed in-memory via React state (seeded from static mock data files).'));

children.push(h(2, '2.2 Product Functions – High-Level Summary'));
children.push(simpleTable(
  ['Module', 'Key Functions'],
  [
    ['Authentication', 'User login, credential validation, session management'],
    ['Room Listing (Ban Phong)', 'Browse rooms, filter by city/district/price, view amenities, mark as Hot'],
    ['Guest Registration', 'Add new prospective tenants for a specific room viewing'],
    ['Guest Visit Tracking', 'List, filter, and track guest visit outcomes and follow-up status'],
    ['Navigation', 'Switch between modules via sub-navigation bar'],
  ],
  [30, 70]
));

children.push(h(2, '2.3 User Classes and Characteristics'));
children.push(simpleTable(
  ['User Class', 'Description', 'Privileges'],
  [
    ['Administrator (Admin)', 'Full system access; manages all data and accounts', 'Full CRUD on all modules'],
    ['Staff / Sales Agent', 'Logs in with phone + password; manages room viewings and guest data', 'Read/write on Rooms and Guests'],
    ['Prospective Tenant (Guest)', 'Indirect user; data recorded by staff on their behalf', 'No direct system access'],
  ],
  [22, 48, 30]
));

children.push(h(2, '2.4 Operating Environment'));
children.push(bullet('Web browser: Google Chrome 100+, Firefox 100+, Microsoft Edge 100+'));
children.push(bullet('Operating System: Windows 10/11, macOS, Linux (any OS with modern browser)'));
children.push(bullet('Runtime: Node.js 18+ for development; HTTP/HTTPS for production'));
children.push(bullet('Frontend Framework: React 19 (SPA via Vite 6)'));
children.push(bullet('Minimum resolution: 1280 x 720 pixels'));

children.push(h(2, '2.5 Assumptions and Dependencies'));
children.push(bullet('Static mock data is used in lieu of a live database backend.'));
children.push(bullet('Authentication is simulated using a local array of 100 mock user accounts.'));
children.push(bullet('Room images are loaded from external Unsplash CDN URLs.'));
children.push(bullet('A stable internet connection is required for image loading.'));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 3: CONTEXT DIAGRAM
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '3. Context Diagram'));
children.push(p('The Context Diagram shows the Boarding House Management System as a single process (black box) with all external entities and data flows between them.'));
children.push(divider());
children.push(...codeBlock([
  '+-------------------------------------------------------------------------------------+',
  '|                    CONTEXT DIAGRAM -- QuanLiTro BHMS                               |',
  '+-------------------------------------------------------------------------------------+',
  '',
  '   +------------------+   [Login credentials]         +------------------------------+',
  '   |                  | -----------------------------> |                              |',
  '   |  Staff / Agent   |   [Room filter criteria]      |                              |',
  '   |  (Nhan vien)     | -----------------------------> |  +------------------------+ |',
  '   |                  | <-----------------------------  |  |  Boarding House Mgmt   | |',
  '   +------------------+   [Room listings, reports]    |  |  System (QuanLiTro)    | |',
  '                                                        |  +------------------------+ |',
  '   +------------------+   [Admin credentials]          |                              |',
  '   |                  | -----------------------------> |                              |',
  '   |  Administrator   |   [System configuration]      |                              |',
  '   |  (Admin)         | -----------------------------> |                              |',
  '   |                  | <-----------------------------  |                              |',
  '   +------------------+   [Full data & access]        +------------------------------+',
  '                                                               |          ^',
  '   +------------------+   [Room viewing request]              |          |',
  '   |                  | ---------------------------------------->        |',
  '   |  Prospective     |   [Viewing confirmation]                         |',
  '   |  Tenant (Guest)  | <------------------------------------------------+',
  '   +------------------+',
  '',
  '   +------------------+   [Room location/address data]',
  '   |  Google Maps     | <--------------------------------------------+',
  '   |  Service         |   [Map link embedded in listing]             |',
  '   +------------------+ -----------------------------------------------+',
  '',
  'External Entities:',
  '  - Staff/Agent         : Logs in, browses rooms, registers guest viewings',
  '  - Administrator       : Full system control and reporting',
  '  - Prospective Tenant  : Provides personal info; receives viewing confirmation',
  '  - Google Maps Service : External map provider linked from room listings',
]));
children.push(divider());

children.push(h(3, '3.1 External Entity Descriptions'));
children.push(simpleTable(
  ['External Entity', 'Inputs to System', 'Outputs from System'],
  [
    ['Staff / Agent', 'Login credentials, room filter criteria, new guest data', 'Room listings, filtered results, guest status reports'],
    ['Administrator', 'Admin credentials, system config commands', 'Full data access, all reports'],
    ['Prospective Tenant', 'Personal info (via staff), viewing request', 'Viewing confirmation, follow-up outcomes'],
    ['Google Maps Service', 'Room address query', 'Map links embedded in room cards'],
  ],
  [25, 40, 35]
));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 4: SWIMLANE DIAGRAM
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '4. Swimlane Diagram'));
children.push(p('The swimlane diagram illustrates the primary business process: a Staff/Agent managing a guest room viewing. It shows which actor is responsible for each step.'));
children.push(divider());
children.push(...codeBlock([
  '+================+=======================+======================+===================+',
  '|   GUEST        |   STAFF / AGENT       |   SYSTEM             |  ADMIN            |',
  '+================+=======================+======================+===================+',
  '|                | [Open System]         |                      |                   |',
  '|                |  (Login Page)         |                      |                   |',
  '|                |        |              |                      |                   |',
  '|                |   Enter credentials   |                      |                   |',
  '|                |        |              |                      |                   |',
  '|                |        +---[Submit]---> Validate Credentials |                   |',
  '|                |                       |   vs. User Store     |                   |',
  '|                |   <---[Auth Result]---+                      |                   |',
  '|                |                       |                      |                   |',
  '|                | [Browse Room Listings]|                      |                   |',
  '|                |        |              |                      |                   |',
  '|                |   Apply Filters       |                      |                   |',
  '|                |        +---[Criteria]--> Filter Room List    |                   |',
  '|                |   <---[Results]--------+                     |                   |',
  '|                |                       |                      |                   |',
  '| Contacts Agent |                       |                      |                   |',
  '|    ---------->-| [Click Add Guest]     |                      |                   |',
  '|                |   for Room X          |                      |                   |',
  '|                |        |              |                      |                   |',
  '| Provide info   |        |              |                      |                   |',
  '| (name, phone)  |        |              |                      |                   |',
  '|    ----------->| [Fill Guest Form]     |                      |                   |',
  '|                |        |              |                      |                   |',
  '|                |   Submit Form         |                      |                   |',
  '|                |        +---[Data]----> Validate + Save       |                   |',
  '|                |                       |   Guest Record       |                   |',
  '|                |   <---[Confirm]--------+                     |                   |',
  '|                |                       |                      |                   |',
  '|                | [Navigate to Guest    |                      |                   |',
  '|                |   Visit List]         |                      |                   |',
  '|                |        |              |                      |                   |',
  '|                | [Update Visit Result] |                      |                   |',
  '|                |        +---[Update]--> Update Record         |                   |',
  '|                |                       |                      |                   |',
  '+----------------+-----------------------+----------------------+-------------------+',
]));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 5: USE CASE DIAGRAM
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '5. Use Case Diagram'));
children.push(p('The use case diagram shows all use cases of QuanLiTro and the actors who interact with each.'));
children.push(divider());
children.push(...codeBlock([
  '+====================================================================================+',
  '|                  USE CASE DIAGRAM -- QuanLiTro BHMS                               |',
  '+====================================================================================+',
  '',
  '  +-----------+    +----------------------------------------------------------+',
  '  |           |    |               <<System Boundary: QuanLiTro>>             |',
  '  |  Staff /  |    |                                                          |',
  '  |  Agent    |    |  [UC-01] Login to System                                 |',
  '  |   (O)     |----+> [UC-02] Browse Room Listings                            |',
  '  |           |    |  [UC-03] Filter Rooms (by location, price, amenities)    |',
  '  |           |    |  [UC-04] View Room Details and Amenities                 |',
  '  |           |    |  [UC-05] Add Guest (Prospective Tenant)                  |',
  '  +-----------+    |  [UC-06] Browse Guest Visit List                         |',
  '                   |  [UC-07] Filter Guest List                               |',
  '  +-----------+    |  [UC-08] Export Guest List to Excel                      |',
  '  |           |    |  [UC-09] Logout / Session Management                     |',
  '  |  Admin    |----+> [All use cases above + admin-level controls]            |',
  '  |   (O)     |    |                                                          |',
  '  +-----------+    |  [UC-10] View Room on Google Maps                        |',
  '                   |                                                          |',
  '  +-----------+    |                                                          |',
  '  | Google    |    |                                                          |',
  '  | Maps (O)  |----+> [UC-10] View Room on Google Maps                       |',
  '  +-----------+    +----------------------------------------------------------+',
  '',
  'RELATIONSHIPS:',
  '  UC-03 <<extends>>  UC-02   Filter is an optional extension of Browse Rooms',
  '  UC-04 <<includes>> UC-02   View Details requires Browse Rooms context',
  '  UC-05 <<includes>> UC-04   Add Guest is triggered from a room card',
  '  UC-07 <<extends>>  UC-06   Filter extends Browse Guest List',
  '  UC-08 <<extends>>  UC-06   Export extends Browse Guest List',
]));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 6: USE CASE SPECIFICATIONS
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '6. Use Case Specifications'));

// UC-01
children.push(h(2, 'UC-01: Login to System'));
children.push(simpleTable(['Field', 'Description'], [
  ['Use Case ID', 'UC-01'],
  ['Use Case Name', 'Login to System'],
  ['Actor(s)', 'Staff/Agent, Administrator'],
  ['Description', 'Allows a registered user to authenticate and gain access to the system dashboard.'],
  ['Pre-condition', 'The user has a valid account (phone + password) registered in the system.'],
  ['Post-condition', 'The user is authenticated; the Room Sale dashboard is displayed.'],
  ['Trigger', 'User opens the application URL in a browser.'],
  ['Priority', 'HIGH'],
], [25, 75]));
children.push(space());
children.push(p('Main Flow (Normal Path):', { bold: true }));
children.push(bullet('1. System displays the Login page with Username (phone) and Password fields.'));
children.push(bullet('2. User enters phone number and password.'));
children.push(bullet('3. User clicks "Dang Nhap" (Login) button.'));
children.push(bullet('4. System validates credentials against the user database.'));
children.push(bullet('5. If valid, system redirects user to the Room Sale (Ban Phong) dashboard.'));
children.push(p('Alternative Flows:', { bold: true }));
children.push(bullet('Alt 1: Admin Login – username="admin", password="admin123" grants admin access directly.'));
children.push(bullet('Alt 2: Wrong Credentials – System displays "So dien thoai hoac mat khau khong chinh xac!"'));
children.push(bullet('Alt 3: Empty Fields – System displays "Vui long nhap ten dang nhap va mat khau!"'));
children.push(divider());

// UC-02
children.push(h(2, 'UC-02: Browse Room Listings'));
children.push(simpleTable(['Field', 'Description'], [
  ['Use Case ID', 'UC-02'],
  ['Use Case Name', 'Browse Room Listings'],
  ['Actor(s)', 'Staff/Agent, Administrator'],
  ['Description', 'Allows authenticated users to browse all available boarding room listings.'],
  ['Pre-condition', 'User is authenticated (UC-01 completed successfully).'],
  ['Post-condition', 'A list of room cards is displayed with detailed room information.'],
  ['Trigger', 'User navigates to the "Ban Phong" (Room Sale) menu item.'],
  ['Priority', 'HIGH'],
], [25, 75]));
children.push(space());
children.push(p('Main Flow:', { bold: true }));
children.push(bullet('1. User clicks "Ban Phong" in the navigation bar.'));
children.push(bullet('2. System loads and displays all room listings as cards.'));
children.push(bullet('3. Each card shows: room code, address, price, deposit, utilities, and amenities.'));
children.push(bullet('4. Rooms with isHot=true flag are eligible to be highlighted with the HOT button.'));
children.push(divider());

// UC-03
children.push(h(2, 'UC-03: Filter Room Listings'));
children.push(simpleTable(['Field', 'Description'], [
  ['Use Case ID', 'UC-03'],
  ['Use Case Name', 'Filter Room Listings'],
  ['Actor(s)', 'Staff/Agent, Administrator'],
  ['Description', 'Allows users to narrow down room listing results using multiple filter criteria.'],
  ['Pre-condition', 'User is on the Room Listing (Ban Phong) page.'],
  ['Post-condition', 'Filtered room list matching selected criteria is displayed in real-time.'],
  ['Trigger', 'User changes any filter dropdown or types in the search field.'],
  ['Priority', 'HIGH'],
], [25, 75]));
children.push(space());
children.push(p('Available Filter Criteria:', { bold: true }));
children.push(simpleTable(
  ['Filter Field', 'Type', 'Possible Values'],
  [
    ['Province / City', 'Dropdown', 'Ho Chi Minh City, Ha Noi, Binh Duong'],
    ['District', 'Dropdown', 'Binh Tan, District 8, Phu Nhuan, District 1, etc.'],
    ['Ward', 'Dropdown', 'Binh Tri Dong, Phuong 07, Phuong 13, etc.'],
    ['Price Range', 'Dropdown', 'Under 3M / 3M-5M / Over 5M (VND)'],
    ['Photo Status', 'Dropdown', 'All / Has Photo / No Photo'],
    ['House Type', 'Dropdown', 'All / NhaTroVN / Private Owner'],
    ['Sort By', 'Dropdown', 'Newest / Price Ascending / Price Descending'],
    ['Address Search', 'Text Input', 'Free text (street name, building number)'],
    ['Content Search', 'Text Input', 'Room code, address keywords'],
    ['Map View', 'Checkbox', 'Show map view / Show list view'],
  ],
  [30, 20, 50]
));
children.push(divider());

// UC-04
children.push(h(2, 'UC-04: View Room Details and Amenities'));
children.push(simpleTable(['Field', 'Description'], [
  ['Use Case ID', 'UC-04'],
  ['Use Case Name', 'View Room Details and Amenities'],
  ['Actor(s)', 'Staff/Agent'],
  ['Description', 'User views the full details of a room listing, including all amenities checklist.'],
  ['Pre-condition', 'Room listing cards are displayed (UC-02).'],
  ['Post-condition', 'User has complete information about the room.'],
  ['Trigger', 'User views a room card on the listing page.'],
  ['Priority', 'MEDIUM'],
], [25, 75]));
children.push(space());
children.push(p('Details displayed on each room card:', { bold: true }));
children.push(bullet('Room code and building title'));
children.push(bullet('Full address with Google Maps link'));
children.push(bullet('Rental price and deposit terms (contract length, deposit amount)'));
children.push(bullet('Utility rates: electricity (VND/kWh), water, wifi, laundry, bike parking, access card, management fee, service fee'));
children.push(bullet('Amenities table: room type, toilet type, gate lock, parking, residents allowed, area (m2), floor, curfew'));
children.push(bullet('Boolean amenities: loft, fridge, kitchen shelf, bed, A/C, window, TV, sink, mattress, elevator, balcony, laundry, hot water, wardrobe, security, skylight'));
children.push(divider());

// UC-05
children.push(h(2, 'UC-05: Add Guest (Prospective Tenant) for Room Viewing'));
children.push(simpleTable(['Field', 'Description'], [
  ['Use Case ID', 'UC-05'],
  ['Use Case Name', 'Add Guest for Room Viewing'],
  ['Actor(s)', 'Staff/Agent'],
  ['Description', 'Staff records a prospective tenant who is interested in viewing a specific room.'],
  ['Pre-condition', 'Staff is authenticated; at least one room listing is displayed.'],
  ['Post-condition', 'A new guest record is saved; user is redirected to the Guest Visit List.'],
  ['Trigger', 'Staff clicks the "Add Guest" icon button on a room card or on the Guest List page.'],
  ['Priority', 'HIGH'],
], [25, 75]));
children.push(space());
children.push(p('Main Flow:', { bold: true }));
children.push(bullet('1. Staff clicks the "+ Guest" (UserPlus icon) button on a room card.'));
children.push(bullet('2. System opens the "Them Khach Xem Phong" (Add Guest) modal dialog.'));
children.push(bullet('3. Modal is pre-filled with: building name, room code, full address, and room price.'));
children.push(bullet('4. Staff enters guest full name (required) and phone number (required).'));
children.push(bullet('5. Staff optionally enters: view date/time, consultation price, customer source, resident count, vehicle count, expected move-in, pet status, notes.'));
children.push(bullet('6. Staff clicks "Chap Nhan" (Accept/Submit).'));
children.push(bullet('7. System validates that name and phone are not empty.'));
children.push(bullet('8. System creates new guest record with status "Moi xem phong" (New Viewing).'));
children.push(bullet('9. System closes modal and navigates to Guest Visit List showing the new entry.'));
children.push(p('Alternative Flows:', { bold: true }));
children.push(bullet('Alt 1: Missing Name – System shows alert: "Vui long nhap ho ten khach hang!"'));
children.push(bullet('Alt 2: Missing Phone – System shows alert: "Vui long nhap so dien thoai!"'));
children.push(bullet('Alt 3: Cancel – Staff clicks "Dong" (Close); modal closes, no data saved.'));
children.push(space());
children.push(p('Guest Form Fields:', { bold: true }));
children.push(simpleTable(
  ['Field', 'Required', 'Type', 'Notes'],
  [
    ['Building (Nha)', 'Auto-filled', 'Text', 'Pre-filled from selected room'],
    ['Room Code (Phong)', 'Auto-filled', 'Text', 'Pre-filled from selected room'],
    ['Full Address', 'Auto-filled', 'Text', 'Pre-filled from selected room'],
    ['Guest Full Name', 'YES', 'Text Input', 'Stored in uppercase'],
    ['Phone Number', 'YES', 'Text Input', 'Used for contact and follow-up'],
    ['View Date/Time', 'No', 'Text (DD/MM/YYYY HH:MM)', 'Defaults to current date'],
    ['Consultation Price', 'No', 'Number (VND)', 'Pre-filled from room price'],
    ['Customer Source', 'No', 'Dropdown', 'Facebook / Website / Referral / Zalo / Direct'],
    ['Number of Residents', 'No', 'Text', 'How many people will live in the room'],
    ['Number of Vehicles', 'No', 'Text', 'Number of bikes / motorbikes'],
    ['Expected Move-In', 'No', 'Dropdown', 'Immediately / 7 days / 15 days / 1 month'],
    ['Pets', 'No', 'Dropdown', 'None / Cat / Dog / Other'],
    ['Notes', 'No', 'Textarea', 'Additional internal notes from staff'],
  ],
  [25, 15, 25, 35]
));
children.push(divider());

// UC-06
children.push(h(2, 'UC-06: Browse Guest Visit List'));
children.push(simpleTable(['Field', 'Description'], [
  ['Use Case ID', 'UC-06'],
  ['Use Case Name', 'Browse Guest Visit List'],
  ['Actor(s)', 'Staff/Agent, Administrator'],
  ['Description', 'Users view all recorded guest visit entries in a card/list format.'],
  ['Pre-condition', 'User is authenticated.'],
  ['Post-condition', 'All guest visit records are displayed.'],
  ['Trigger', 'User navigates to the "Khach Xem Phong" (Guest Visit) menu item.'],
  ['Priority', 'HIGH'],
], [25, 75]));
children.push(space());
children.push(p('Each guest card displays:', { bold: true }));
children.push(bullet('Room title and building name'));
children.push(bullet('Guest full name and phone number'));
children.push(bullet('Consultation price and rental price'));
children.push(bullet('Date and time of viewing'));
children.push(bullet('Recipient staff and guiding staff names'));
children.push(bullet('Result/outcome: Did Not Answer / Deposit Placed / Contract Signed / New Viewing'));
children.push(bullet('Last updated timestamp and internal notes'));
children.push(divider());

// UC-07
children.push(h(2, 'UC-07: Filter Guest Visit List'));
children.push(simpleTable(['Field', 'Description'], [
  ['Use Case ID', 'UC-07'],
  ['Use Case Name', 'Filter Guest Visit List'],
  ['Actor(s)', 'Staff/Agent, Administrator'],
  ['Description', 'Users narrow down the guest list using date range, price, result, and source filters.'],
  ['Pre-condition', 'User is on the Guest Visit List page.'],
  ['Post-condition', 'Filtered guest list matching selected criteria is displayed.'],
  ['Trigger', 'User changes any filter value on the Guest Visit page.'],
  ['Priority', 'MEDIUM'],
], [25, 75]));
children.push(space());
children.push(simpleTable(['Filter', 'Type', 'Options'], [
  ['Search', 'Text input', 'Guest name, phone number, room code'],
  ['Result', 'Dropdown', 'Did Not Answer / Deposit Placed / Contract Signed'],
  ['From Date', 'Date picker', 'ISO date (default: start of month)'],
  ['To Date', 'Date picker', 'ISO date (default: end of month)'],
  ['Price', 'Dropdown', 'Under 2M VND / 2M and above'],
  ['Customer Source', 'Dropdown', 'Facebook / Website / Referral'],
], [25, 20, 55]));
children.push(divider());

// UC-08
children.push(h(2, 'UC-08: Export Guest List to Excel'));
children.push(simpleTable(['Field', 'Description'], [
  ['Use Case ID', 'UC-08'],
  ['Use Case Name', 'Export Guest List to Excel'],
  ['Actor(s)', 'Staff/Agent, Administrator'],
  ['Description', 'Users can export the current filtered guest list to an Excel file for reporting.'],
  ['Pre-condition', 'User is on the Guest Visit List page.'],
  ['Post-condition', 'An Excel file containing guest data is downloaded to the user device.'],
  ['Trigger', 'User clicks the "Xuat Excel" (Export Excel) button.'],
  ['Priority', 'LOW'],
], [25, 75]));
children.push(divider());

// UC-09
children.push(h(2, 'UC-09: Logout / Session Management'));
children.push(simpleTable(['Field', 'Description'], [
  ['Use Case ID', 'UC-09'],
  ['Use Case Name', 'Logout / Session Management'],
  ['Actor(s)', 'Staff/Agent, Administrator'],
  ['Description', 'User ends their session and is returned to the login page.'],
  ['Pre-condition', 'User is authenticated.'],
  ['Post-condition', 'Session is cleared; Login page is displayed.'],
  ['Trigger', 'User selects logout option from navigation.'],
  ['Priority', 'MEDIUM'],
], [25, 75]));
children.push(divider());

// UC-10
children.push(h(2, 'UC-10: View Room on Google Maps'));
children.push(simpleTable(['Field', 'Description'], [
  ['Use Case ID', 'UC-10'],
  ['Use Case Name', 'View Room on Google Maps'],
  ['Actor(s)', 'Staff/Agent'],
  ['Description', 'User opens the room address in Google Maps via an embedded link.'],
  ['Pre-condition', 'User is viewing a room card with a Google Maps link available.'],
  ['Post-condition', 'Google Maps opens in a new browser tab with the room location pinned.'],
  ['Trigger', 'User clicks the "Link GoogleMap" text link inside a room card.'],
  ['Priority', 'LOW'],
], [25, 75]));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 7: STATE DIAGRAMS
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '7. State Diagrams'));

children.push(h(2, '7.1 System Session State Diagram'));
children.push(p('This diagram describes the lifecycle of a user session within the QuanLiTro application.'));
children.push(divider());
children.push(...codeBlock([
  '+============================================================================+',
  '|       STATE DIAGRAM -- User Session Lifecycle                              |',
  '+============================================================================+',
  '',
  '     [*] (Initial State)',
  '      |',
  '      | App Loaded',
  '      v',
  ' +---------------------+',
  ' |   LOGIN PAGE        | <----------------------------------------+',
  ' | (Unauthenticated)   |                                          |',
  ' +----------+----------+                                          |',
  '            |                                                     |',
  '            | [Submit credentials]                                |',
  '            v                                                     |',
  ' +---------------------+                                          |',
  ' | VALIDATING CREDS    |                                          |',
  ' +----+----------+-----+                                          |',
  '      |          |                                                |',
  '  [Valid]    [Invalid]                                            |',
  '      |          |                                                |',
  '      |          v                                                |',
  '      |  +-------------------+                                    |',
  '      |  | LOGIN ERROR STATE | ---[User retries]------------------+',
  '      |  | (Show error msg)  |',
  '      |  +-------------------+',
  '      |',
  '      v [Authenticated]',
  ' +===========================================================================+',
  ' |                   AUTHENTICATED DASHBOARD                                |',
  ' |  +------------------+          +--------------------+                   |',
  ' |  |  ROOM SALE PAGE  | <------> |  GUEST VISIT PAGE  |                   |',
  ' |  |  (Ban Phong)     |          |  (Khach Xem Phong) |                   |',
  ' |  |  [Browsing]      |          |  [Browsing Guests] |                   |',
  ' |  |  [Filtering]     |          |  [Filtering]       |                   |',
  ' |  +--------+---------+          +--------------------+                   |',
  ' |           |                                                              |',
  ' |     [Click Add Guest]                                                    |',
  ' |           v                                                              |',
  ' |  +-----------------------------+                                         |',
  ' |  |  ADD GUEST MODAL (Open)     |                                         |',
  ' |  |  +-------------------------+|                                         |',
  ' |  |  | FILLING FORM            ||                                         |',
  ' |  |  +----------+--------------+|                                         |',
  ' |  |             | [Submit]       |                                         |',
  ' |  |             v               |                                         |',
  ' |  |  +-------------------------+|                                         |',
  ' |  |  | VALIDATING FORM         ||                                         |',
  ' |  |  +----+----------+---------+|                                         |',
  ' |  |    [OK]       [Error]       |                                         |',
  ' |  |      |            |        |                                         |',
  ' |  |      |      +-----+        |                                         |',
  ' |  |      |      | ALERT        |                                         |',
  ' |  |      |      +-----+        |                                         |',
  ' |  |      v            |        |                                         |',
  ' |  |  +---------------+|        |                                         |',
  ' |  |  | MODAL CLOSES  ||        |                                         |',
  ' |  |  | -> Navigate   ||        |                                         |',
  ' |  |  |   to Guest    ||        |                                         |',
  ' |  |  |   Visit List  ||        |                                         |',
  ' |  |  +---------------+|        |                                         |',
  ' |  +-----------------------------+                                         |',
  ' +===========================================================================+',
  '                   |',
  '              [Logout]',
  '                   v',
  '          +-------------------+',
  '          | SESSION ENDED     |',
  '          | -> Return to Login|',
  '          +-------------------+',
  '                   |',
  '                  [*] (Final State)',
]));

children.push(divider());
children.push(h(2, '7.2 Guest Visit Record State Diagram'));
children.push(p('This diagram shows the lifecycle states of a single guest visit record from creation to resolution.'));
children.push(divider());
children.push(...codeBlock([
  '+============================================================================+',
  '|       STATE DIAGRAM -- Guest Visit Record Lifecycle                        |',
  '+============================================================================+',
  '',
  '  [*] (Initial)',
  '   |',
  '   | [Staff adds guest via Add Guest form]',
  '   v',
  ' +---------------------------+',
  ' |  NEWLY REGISTERED         |  result = "Moi xem phong" (New Viewing)',
  ' |  (Guest form submitted)   |',
  ' +-------------+-------------+',
  '               |',
  '       +-------+-------+',
  '       |               |',
  '  [Call made]    [Viewing confirmed]',
  '  [No answer]         |',
  '       |              v',
  '       |     +------------------+',
  '       |     | VIEWING SCHEDULED|',
  '       |     | / IN PROGRESS    |',
  '       |     +------------------+',
  '       v              |',
  ' +-----------------+  |',
  ' | DID NOT ANSWER  |  |',
  ' | (Khach khong    |  |',
  ' |  nghe may)      |  |',
  ' +------+----------+  |',
  '        |             |',
  '   [Follow-up call]   |',
  '        +-------------+',
  '                |',
  '   +------------+------------+------------------+',
  '   |            |            |                  |',
  '   v            v            v                  v',
  ' +----------+ +----------+ +----------+ +--------------+',
  ' |INTERESTED| | DEPOSIT  | |  NOT INT | | CONTRACT     |',
  ' |(Follow-up| | PLACED   | | (Declined| | SIGNED       |',
  ' |  needed) | |(Coc giu  | |  / Lost) | |(Coc len hop  |',
  ' +----------+ | cho)     | +----------+ | dong)        |',
  '              +-----+----+              +--------------+',
  '                    |                          |',
  '              [Full deposit]                  [*] (Final)',
  '                    |',
  '              [*] (Final)',
  '',
  'STATES & RESULT VALUES:',
  '  Newly Registered  : result = "Moi xem phong"',
  '  Did Not Answer    : result = "Khach khong nghe may"',
  '  Deposit Placed    : result = "Khach coc giu cho"',
  '  Contract Signed   : result = "Coc len hop dong"',
  '  Not Interested    : result = "Khong co nhu cau" (cancelled)',
]));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 8: DFD
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '8. Data Flow Diagram (DFD)'));

children.push(h(2, '8.1 Level 0 DFD (Context Level)'));
children.push(p('The Level 0 DFD presents the entire system as one process, showing all external entities and data flows.'));
children.push(divider());
children.push(...codeBlock([
  '==========================================================================',
  '  DFD LEVEL 0 -- Context Level                                          ',
  '==========================================================================',
  '',
  '  [Staff/Agent]  --(Login Credentials)-----------------------> [0]',
  '                 --(Room Filter Criteria)--------------------> [  QuanLiTro  ]',
  '                 --(Guest Registration Data)-----------------> [    BHMS     ]',
  '                 <--(Filtered Room List)---------------------  [             ]',
  '                 <--(Guest Visit Reports)--------------------  [             ]',
  '',
  '  [Administrator] --(Admin Credentials)----------------------> [0]',
  '                  --(System Configuration)-------------------> [  QuanLiTro  ]',
  '                  <--(Full System Data / Reports)------------  [    BHMS     ]',
  '',
  '  [Prospective Tenant] --(Personal Info [via Staff])---------> [0]',
  '                       <--(Viewing Confirmation)------------   [  QuanLiTro  ]',
  '',
  '  [Google Maps API] <--(Room Address Query)------------------  [0]',
  '                    --(Map Link / Location Data)-------------> [  QuanLiTro  ]',
]));

children.push(divider());
children.push(h(2, '8.2 Level 1 DFD (Process Decomposition)'));
children.push(p('The Level 1 DFD decomposes the system into its 7 major processes and shows data flows between processes and data stores.'));
children.push(divider());
children.push(...codeBlock([
  '==========================================================================',
  '  DFD LEVEL 1 -- Major Processes                                         ',
  '==========================================================================',
  '',
  '  DATA STORES:',
  '    D1 = User Store      (mock users array)',
  '    D2 = Room Store      (roomsData array)',
  '    D3 = Guest Store     (guestsData array)',
  '',
  '  [Staff] --(credentials)----------> (P1: AUTHENTICATE USER)',
  '                                       | --(validate)-------> D1: User Store',
  '                                       | <--(record)---------  D1',
  '                                       | --(auth result)----> [Staff/Admin]',
  '',
  '  [Staff] --(filter criteria)-------> (P2: FILTER ROOMS)',
  '                                       | --(read rooms)-----> D2: Room Store',
  '                                       | <--(room records)---  D2',
  '                                       | --(filtered list)--> [Staff]',
  '',
  '  [Staff] --(room code)-------------> (P3: VIEW ROOM DETAILS)',
  '                                       | --(read room)------> D2: Room Store',
  '                                       | <--(room details)---  D2',
  '                                       | --(room info)------> [Staff]',
  '',
  '  [Staff] --(guest data)-----------> (P4: REGISTER GUEST)',
  '  [Tenant]--(personal info)--------->  |',
  '                                       | --(validate)--------> [Validation]',
  '                                       | --(write guest)-----> D3: Guest Store',
  '                                       | <--(confirmation)---  D3',
  '                                       | --(confirm)--------> [Staff/Tenant]',
  '',
  '  [Staff] --(filter criteria)-------> (P5: FILTER GUESTS)',
  '                                       | --(read guests)-----> D3: Guest Store',
  '                                       | <--(guest records)--  D3',
  '                                       | --(filtered list)--> [Staff]',
  '',
  '  [Staff] --(export request)--------> (P6: EXPORT EXCEL)',
  '                                       | --(read guests)-----> D3: Guest Store',
  '                                       | <--(all records)----  D3',
  '                                       | --(Excel file)------> [Staff]',
  '',
  '  [Staff] --(address click)---------> (P7: MAP INTEGRATION)',
  '                                       | --(map query)-------> [Google Maps]',
  '                                       | <--(map data)-------  [Google Maps]',
  '                                       | --(map link)--------> [Staff]',
]));

children.push(divider());
children.push(h(2, '8.3 Level 2 DFD – Process P4: Register Guest (Detailed)'));
children.push(divider());
children.push(...codeBlock([
  '==========================================================================',
  '  DFD LEVEL 2 -- P4: Register Guest (Expanded)                           ',
  '==========================================================================',
  '',
  '  INPUT: Guest name, phone, view date, consultation price, room data,',
  '         customer source, residents, vehicles, move-in expectation,',
  '         pet status, notes',
  '',
  '  [Staff] --(name + phone)---------> (P4.1: VALIDATE REQUIRED FIELDS)',
  '                                          |            |',
  '                                       [Valid]     [Invalid]',
  '                                          |            |',
  '                                          |   --(alert msg)--> [Staff]',
  '                                          |   (loop back to P4.1)',
  '                                          v',
  '                                    (P4.2: PRE-FILL ROOM DATA)',
  '                                          | --(read room)----> D2',
  '                                          | <--(room info)---  D2',
  '                                          v',
  '                                    (P4.3: BUILD GUEST RECORD)',
  '                                          | Constructs:',
  '                                          |   id          = Date.now()',
  '                                          |   title       = Building + Room',
  '                                          |   name        = UPPERCASE(input)',
  '                                          |   phone       = input',
  '                                          |   consultPrice = parsed VND',
  '                                          |   date        = parsed date',
  '                                          |   time        = HH:MM',
  '                                          |   result      = "Moi xem phong"',
  '                                          |   updatedAt   = now()',
  '                                          v',
  '                                    (P4.4: SAVE GUEST RECORD)',
  '                                          | --(write)---------> D3: Guest Store',
  '                                          | <--(success)------  D3',
  '                                          v',
  '                                    (P4.5: NAVIGATE & DISPLAY)',
  '                                          | --(close modal)---> [UI: Modal]',
  '                                          | --(navigate)------> [UI: Guest List]',
  '                                          | --(new record)----> [Staff]',
]));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 9: LOGICAL DATA MODEL
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '9. Logical Data Model (LDM)'));
children.push(p('The Logical Data Model describes key entities, attributes, and relationships in QuanLiTro. The current implementation uses in-memory arrays; a production database would map these to relational tables.'));
children.push(divider());
children.push(...codeBlock([
  '+====================================================================================+',
  '|              LOGICAL DATA MODEL -- Entity-Relationship Diagram                     |',
  '+====================================================================================+',
  '',
  ' +---------------------------+       +--------------------------------------+',
  ' |         USER              |       |              ROOM                    |',
  ' |---------------------------|       |--------------------------------------|',
  ' | PK  id          : Integer |       | PK  id          : Integer            |',
  ' |     phone       : String  |       |     code        : String             |',
  ' |     password    : String  |       |     title       : String             |',
  ' |     role        : Enum    |       |     address     : String             |',
  ' |     name        : String  |       |     price       : Integer (VND)      |',
  ' +---------------------------+       |     deposit     : String             |',
  '             |                       |     electricity : String             |',
  '             | 1 (manages)           |     water       : String             |',
  '             |                       |     wifi        : String             |',
  '             v N                     |     washing     : String             |',
  ' +---------------------------------+ |     bike        : String             |',
  ' |         GUEST_VISIT             | |     card        : String             |',
  ' |---------------------------------| |     management  : String             |',
  ' | PK  id          : Integer       | |     otherFee    : String             |',
  ' | FK  roomId      : Integer ------+>|     isHot       : Boolean            |',
  ' | FK  staffId     : Integer --+   | |     image       : String (URL)       |',
  ' |     name        : String    |   | |     time        : String (Timestamp) |',
  ' |     phone       : String    |   | +--------------------------------------+',
  ' |     consultPrice: Integer   |   |              | 1 (has)',
  ' |     rentPrice   : Integer   |   |              |',
  ' |     date        : Date      |   |              v 1',
  ' |     time        : String    |   | +--------------------------------------+',
  ' |     source      : Enum      |   | |         AMENITIES                    |',
  ' |     residentCnt : Integer   |   | |--------------------------------------|',
  ' |     vehicleCnt  : Integer   |   | | PK  id          : Integer            |',
  ' |     expectedMove: Enum      |   | | FK  roomId      : Integer            |',
  ' |     pets        : Enum      |   | |     phong       : String (room type) |',
  ' |     result      : Enum      |   | |     toilet      : String             |',
  ' |     updatedAt   : Timestamp |   | |     khoaCong    : String (lock)      |',
  ' |     note        : Text      |   | |     slXe        : String             |',
  ' |     recipient   : String    |   | |     cocGiuCho   : String             |',
  ' +---------------------------------+   |     viTri       : String (floor)     |',
  '                                   |     deXe        : String (parking)   |',
  ' +-----------------------------+   |     gioGiac     : String (curfew)    |',
  ' |         STAFF               |   |     slNguoi     : String             |',
  ' |-----------------------------|   |     henBoSungCoc: String             |',
  ' | PK  id          : Integer   |   |     dienTich    : String (area m2)   |',
  ' |     name        : String    |<--+   |     sanPhoi     : String (drying)    |',
  ' |     phone       : String    |       |     henDonVao   : String             |',
  ' |     password    : String    |       |     gac         : Boolean (loft)     |',
  ' |     role        : Enum      |       |     tuLanh      : Boolean (fridge)   |',
  ' +-----------------------------+       |     keBep       : Boolean (kitchen)  |',
  '                                       |     giuong      : Boolean (bed)      |',
  '                                       |     chungChu    : Boolean (cohabit)  |',
  '                                       |     mayLanh     : Boolean (aircon)   |',
  '                                       |     cuaSo       : Boolean (window)   |',
  '                                       |     tivi        : Boolean (TV)       |',
  '                                       |     bonRuaChen  : Boolean (sink)     |',
  '                                       |     nem         : Boolean (mattress) |',
  '                                       |     thangMay    : Boolean (elevator) |',
  '                                       |     giengTroi   : Boolean (skylight) |',
  '                                       |     banCong     : Boolean (balcony)  |',
  '                                       |     mayGiat     : String (laundry)   |',
  '                                       |     nuocNong    : Boolean (hot water)|',
  '                                       |     tuQuanAo    : Boolean (wardrobe) |',
  '                                       |     baoVe       : Boolean (security) |',
  '                                       +--------------------------------------+',
]));

children.push(divider());
children.push(h(2, '9.1 Entity Descriptions'));

children.push(h(3, '9.1.1 USER Entity'));
children.push(simpleTable(['Attribute', 'Data Type', 'Constraints', 'Description'], [
  ['id', 'Integer', 'PK, Auto-increment', 'Unique user identifier'],
  ['phone', 'String(15)', 'UNIQUE, NOT NULL', 'Phone number used as login username'],
  ['password', 'String(100)', 'NOT NULL, Hashed', 'Hashed login password'],
  ['role', "Enum('admin','staff')", 'NOT NULL', 'User access level'],
  ['name', 'String(100)', 'NOT NULL', 'Full name of the user/staff member'],
], [20, 20, 25, 35]));

children.push(h(3, '9.1.2 ROOM Entity'));
children.push(simpleTable(['Attribute', 'Data Type', 'Constraints', 'Description'], [
  ['id', 'Integer', 'PK, Auto-increment', 'Unique room identifier'],
  ['code', 'String(20)', 'NOT NULL', 'Room code (e.g., "306", "L3-06")'],
  ['title', 'String(200)', 'NOT NULL', 'Display title: code + building address'],
  ['address', 'String(300)', 'NOT NULL', 'Full street address of the room'],
  ['price', 'Integer', 'NOT NULL, >0', 'Monthly rental price in VND'],
  ['deposit', 'String(100)', '', 'Deposit and contract term description'],
  ['electricity', 'String(30)', '', 'Electricity rate (VND/kWh)'],
  ['water', 'String(30)', '', 'Water rate (VND/month/person)'],
  ['wifi', 'String(30)', '', 'WiFi fee or "Free"'],
  ['washing', 'String(30)', '', 'Laundry fee or facility type'],
  ['bike', 'String(30)', '', 'Bike/motorbike parking fee'],
  ['card', 'String(30)', '', 'Access card fee per person/month'],
  ['management', 'String(30)', '', 'Monthly management/maintenance fee'],
  ['otherFee', 'String(30)', '', 'Additional service fees'],
  ['isHot', 'Boolean', 'Default: false', 'Flag for featured "hot" listings'],
  ['image', 'String(500)', '', 'URL to room photo (Unsplash CDN)'],
  ['time', 'String(30)', '', 'Listing created/updated timestamp'],
], [18, 18, 20, 44]));

children.push(h(3, '9.1.3 AMENITIES Entity (One-to-One with ROOM)'));
children.push(simpleTable(['Attribute', 'Data Type', 'Description'], [
  ['id', 'Integer', 'PK'],
  ['roomId', 'Integer (FK)', 'References ROOM(id) – One-to-One'],
  ['phong', 'String', 'Room type: "Phong tro" / "Can ho dich vu"'],
  ['toilet', 'String', '"Rieng" (private) / "Chung" (shared)'],
  ['khoaCong', 'String', 'Gate lock: fingerprint / regular / mechanical'],
  ['viTri', 'String', 'Floor: Ground / 1st / 2nd / etc.'],
  ['deXe', 'String', 'Parking: shared / private / basement'],
  ['gioGiac', 'String', 'Curfew policy'],
  ['dienTich', 'String', 'Room area in m2'],
  ['gac', 'Boolean', 'Has loft/mezzanine'],
  ['tuLanh', 'Boolean', 'Has refrigerator'],
  ['keBep', 'Boolean', 'Has kitchen shelf/rack'],
  ['giuong', 'Boolean', 'Has bed frame'],
  ['chungChu', 'Boolean', 'Landlord lives in same property'],
  ['mayLanh', 'Boolean', 'Has air conditioning'],
  ['cuaSo', 'Boolean', 'Has window'],
  ['tivi', 'Boolean', 'Has TV'],
  ['bonRuaChen', 'Boolean', 'Has kitchen sink'],
  ['nem', 'Boolean', 'Has mattress'],
  ['thangMay', 'Boolean', 'Has elevator'],
  ['giengTroi', 'Boolean', 'Has skylight / open courtyard'],
  ['banCong', 'Boolean', 'Has balcony'],
  ['mayGiat', 'String', 'Washing machine: "Rieng"/"Chung"/"Khong"'],
  ['nuocNong', 'Boolean', 'Has hot water heater'],
  ['tuQuanAo', 'Boolean', 'Has wardrobe/clothes cabinet'],
  ['baoVe', 'Boolean', 'Has security guard'],
], [20, 20, 60]));

children.push(h(3, '9.1.4 GUEST_VISIT Entity'));
children.push(simpleTable(['Attribute', 'Data Type', 'Constraints', 'Description'], [
  ['id', 'Integer', 'PK', 'Unique guest visit record ID'],
  ['roomId', 'Integer', 'FK -> ROOM(id)', 'Which room is being viewed'],
  ['staffId', 'Integer', 'FK -> STAFF(id)', 'Staff who recorded the visit'],
  ['name', 'String(150)', 'NOT NULL', "Guest's full name (stored uppercase)"],
  ['phone', 'String(15)', 'NOT NULL', "Guest's contact phone number"],
  ['consultPrice', 'Integer', '', 'Price quoted during consultation (VND)'],
  ['rentPrice', 'Integer', '', 'Actual room rental price (VND)'],
  ['date', 'Date', '', 'Viewing appointment date (YYYY-MM-DD)'],
  ['time', 'String(5)', '', 'Viewing time (HH:MM)'],
  ['source', 'Enum', '', 'Facebook / Website / Referral / Zalo / Direct'],
  ['residentCount', 'Integer', '', 'Number of people who will live in the room'],
  ['vehicleCount', 'Integer', '', 'Number of motorbikes/bicycles'],
  ['expectedMoveIn', 'Enum', '', 'Immediately / 7 days / 15 days / 1 month'],
  ['pets', 'Enum', '', 'None / Cat / Dog / Other'],
  ['result', 'Enum', 'NOT NULL', 'New Viewing / No Answer / Deposit Placed / Contract Signed'],
  ['recipient', 'String(100)', '', 'Staff who received the initial inquiry'],
  ['staff', 'String(100)', '', 'Staff who escorted the guest to the room'],
  ['updatedAt', 'Timestamp', '', 'Last update timestamp'],
  ['note', 'Text', '', 'Internal notes from staff'],
], [18, 18, 18, 46]));

children.push(h(3, '9.1.5 Relationships Summary'));
children.push(simpleTable(['From Entity', 'Relationship', 'To Entity', 'Cardinality', 'Description'], [
  ['STAFF', 'manages', 'GUEST_VISIT', '1 : N', 'One staff can record many guest visits'],
  ['ROOM', 'receives', 'GUEST_VISIT', '1 : N', 'One room can have many visit records'],
  ['ROOM', 'has', 'AMENITIES', '1 : 1', 'Each room has exactly one amenities record'],
  ['USER', 'is a type of', 'STAFF', '1 : 1', 'Staff accounts are user accounts with staff role'],
], [18, 15, 18, 14, 35]));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 10: FUNCTIONAL REQUIREMENTS
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '10. Functional Requirements'));
children.push(simpleTable(['FR ID', 'Module', 'Description', 'Priority'], [
  ['FR-01', 'Authentication', 'System shall provide a login page with Username (phone) and Password fields.', 'HIGH'],
  ['FR-02', 'Authentication', 'System shall validate credentials against stored user records.', 'HIGH'],
  ['FR-03', 'Authentication', 'System shall support an admin account with wildcard credentials for full access.', 'HIGH'],
  ['FR-04', 'Authentication', 'System shall display specific error messages for invalid or empty login attempts.', 'HIGH'],
  ['FR-05', 'Room Listing', 'System shall display all available room listings as cards upon successful login.', 'HIGH'],
  ['FR-06', 'Room Listing', 'Each room card shall display: code, title, address, price, deposit, and all utility rates.', 'HIGH'],
  ['FR-07', 'Room Listing', 'Each room card shall display a full amenities checklist with boolean indicators (check/cross).', 'MEDIUM'],
  ['FR-08', 'Room Listing', 'System shall display a count badge showing number of rooms currently visible.', 'LOW'],
  ['FR-09', 'Room Filtering', 'System shall filter rooms by province/city, district, and ward.', 'HIGH'],
  ['FR-10', 'Room Filtering', 'System shall filter rooms by price range (under 3M / 3-5M / over 5M VND).', 'HIGH'],
  ['FR-11', 'Room Filtering', 'System shall support free-text search on room code and address fields.', 'HIGH'],
  ['FR-12', 'Room Filtering', 'System shall filter rooms by photo availability status.', 'LOW'],
  ['FR-13', 'Room Filtering', 'System shall support sorting: newest / price ascending / price descending.', 'MEDIUM'],
  ['FR-14', 'Guest Mgmt', 'System shall provide a modal dialog for registering a new guest visit.', 'HIGH'],
  ['FR-15', 'Guest Mgmt', 'The modal shall auto-fill room data (building, room, address, price) when opened from a room card.', 'HIGH'],
  ['FR-16', 'Guest Mgmt', 'System shall require guest name and phone number before saving; show alerts if missing.', 'HIGH'],
  ['FR-17', 'Guest Mgmt', 'System shall save the guest record and navigate to Guest Visit List after successful submission.', 'HIGH'],
  ['FR-18', 'Guest Mgmt', 'System shall capture optional fields: source, residents, vehicles, move-in, pets, notes.', 'MEDIUM'],
  ['FR-19', 'Guest List', 'System shall display all guest visit records in a card/list format.', 'HIGH'],
  ['FR-20', 'Guest List', 'Each guest card shall show all visit details including result status and staff info.', 'HIGH'],
  ['FR-21', 'Guest Filtering', 'System shall filter guest list by date range, price range, result status, and customer source.', 'HIGH'],
  ['FR-22', 'Guest Filtering', 'System shall support free-text search on guest name, phone number, and room code.', 'HIGH'],
  ['FR-23', 'Export', 'System shall provide an "Export to Excel" button on the Guest Visit page.', 'LOW'],
  ['FR-24', 'Navigation', 'System shall provide a navigation bar to switch between modules (Ban Phong / Khach Xem Phong).', 'HIGH'],
  ['FR-25', 'Map Integration', 'Room cards shall include a clickable link to open the room address in Google Maps.', 'LOW'],
], [8, 20, 57, 15]));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 11: NON-FUNCTIONAL REQUIREMENTS
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, '11. Non-Functional Requirements'));

children.push(h(2, '11.1 Performance Requirements'));
children.push(simpleTable(['NFR ID', 'Requirement', 'Metric'], [
  ['NFR-01', 'Room list filtering shall respond within 200ms of any user input change.', '< 200ms'],
  ['NFR-02', 'Login validation shall complete within 500ms of form submission.', '< 500ms'],
  ['NFR-03', 'The Add Guest modal shall open within 300ms of button click.', '< 300ms'],
  ['NFR-04', 'Initial page load shall complete within 3 seconds on a standard broadband connection.', '< 3 seconds'],
], [10, 70, 20]));

children.push(h(2, '11.2 Usability Requirements'));
children.push(simpleTable(['NFR ID', 'Requirement'], [
  ['NFR-05', 'The UI shall be fully functional on screens with a minimum width of 1280 pixels.'],
  ['NFR-06', 'Error messages shall be displayed in Vietnamese (the primary user language).'],
  ['NFR-07', 'All form fields shall have clear badge labels distinguishing required from optional fields.'],
  ['NFR-08', 'The Add Guest modal shall be dismissible by clicking outside the modal container.'],
  ['NFR-09', 'Filtered results shall update in real-time without requiring a full page reload.'],
], [10, 90]));

children.push(h(2, '11.3 Reliability and Availability'));
children.push(simpleTable(['NFR ID', 'Requirement'], [
  ['NFR-10', 'The application shall maintain 99% uptime during business hours (8:00 AM – 10:00 PM).'],
  ['NFR-11', 'The application shall gracefully handle missing room images by displaying placeholder SVG illustrations.'],
  ['NFR-12', 'Guest data entered in the form shall not be lost due to accidental modal dismissal (a confirmation may be shown in future versions).'],
], [10, 90]));

children.push(h(2, '11.4 Security Requirements'));
children.push(simpleTable(['NFR ID', 'Requirement'], [
  ['NFR-13', 'Login credentials shall be validated before granting access to any system resource.'],
  ['NFR-14', 'Passwords shall be stored in hashed format in the production database (bcrypt recommended).'],
  ['NFR-15', 'Unauthenticated users shall not be able to access any page beyond the Login page.'],
  ['NFR-16', 'Session tokens shall expire after a configurable inactivity timeout period.'],
], [10, 90]));

children.push(h(2, '11.5 Maintainability'));
children.push(simpleTable(['NFR ID', 'Requirement'], [
  ['NFR-17', 'The codebase shall be organized into modular React components (Login, RoomSale, GuestVisit, AddGuestModal, Header, SubNavbar).'],
  ['NFR-18', 'Data shall be separated from UI components into dedicated data files (rooms.js, guests.js, users.js).'],
  ['NFR-19', 'The application shall be buildable via standard npm scripts: "npm run dev" for development and "npm run build" for production.'],
], [10, 90]));
children.push(pageBreak());

// ════════════════════════════════════════════════════════════════════════════
//  APPENDICES
// ════════════════════════════════════════════════════════════════════════════
children.push(h(1, 'Appendix A: Room Amenities Glossary'));
children.push(simpleTable(['Vietnamese Term', 'English Translation', 'Data Type'], [
  ['Gac', 'Loft / Mezzanine floor', 'Boolean'],
  ['Tu lanh', 'Refrigerator', 'Boolean'],
  ['Ke bep', 'Kitchen shelf / rack', 'Boolean'],
  ['Giuong', 'Bed frame', 'Boolean'],
  ['Chung chu', 'Shared landlord (landlord lives in property)', 'Boolean'],
  ['May lanh', 'Air conditioning unit', 'Boolean'],
  ['Cua so', 'Window', 'Boolean'],
  ['Tivi', 'Television', 'Boolean'],
  ['Bon rua chen', 'Sink / Washing basin', 'Boolean'],
  ['Nem', 'Mattress', 'Boolean'],
  ['Thang may', 'Elevator', 'Boolean'],
  ['Gieng troi', 'Skylight / Open courtyard', 'Boolean'],
  ['Ban cong', 'Balcony', 'Boolean'],
  ['May giat', 'Washing machine', 'String (Rieng/Chung/Khong)'],
  ['Nuoc nong', 'Hot water heater', 'Boolean'],
  ['Tu quan ao', 'Wardrobe / Clothes cabinet', 'Boolean'],
  ['Bao ve', 'Security guard on premises', 'Boolean'],
], [30, 50, 20]));

children.push(space(2));
children.push(h(1, 'Appendix B: Guest Visit Result Status Values'));
children.push(simpleTable(['Status', 'Vietnamese Label', 'English Meaning'], [
  ['new_viewing', 'Moi xem phong', 'Guest just registered; first viewing scheduled'],
  ['no_answer', 'Khach khong nghe may', 'Guest did not answer phone call(s)'],
  ['deposit_placed', 'Khach coc giu cho', 'Guest paid a reservation hold deposit'],
  ['contract_signed', 'Coc len hop dong', 'Full deposit paid; lease contract being prepared'],
  ['not_interested', 'Khong co nhu cau', 'Guest declined / no longer interested (future use)'],
], [20, 40, 40]));

children.push(space(2));
children.push(h(1, 'Appendix C: Component-to-Requirement Traceability Matrix'));
children.push(simpleTable(['Component File', 'Implements FR(s)', 'Description'], [
  ['Login.jsx', 'FR-01, FR-02, FR-03, FR-04', 'Login form and credential validation'],
  ['RoomSale.jsx', 'FR-05, FR-06, FR-07, FR-08, FR-09, FR-10, FR-11, FR-12, FR-13', 'Room listing display and filtering'],
  ['GuestVisit.jsx', 'FR-19, FR-20, FR-21, FR-22, FR-23', 'Guest visit list and filtering'],
  ['AddGuestModal.jsx', 'FR-14, FR-15, FR-16, FR-17, FR-18', 'Add guest modal dialog'],
  ['Header.jsx', 'FR-24 (partial)', 'Main application header bar'],
  ['SubNavbar.jsx', 'FR-24', 'Navigation between Ban Phong and Khach Xem Phong'],
  ['App.jsx', 'FR-01 to FR-04, FR-17', 'Root component: routing, session, modal management'],
  ['data/rooms.js', 'FR-05, FR-06, FR-07', 'Mock room data store'],
  ['data/guests.js', 'FR-19, FR-20', 'Mock guest visit data store'],
  ['data/users.js', 'FR-02, FR-03', 'Mock user authentication store (100 accounts + admin)'],
], [25, 45, 30]));

children.push(space(2));
children.push(new Paragraph({
  spacing: { before: 400 },
  alignment: AlignmentType.CENTER,
  border: { top: { style: BorderStyle.DOUBLE, size: 6, color: C.accent } },
  children: [new TextRun({ text: '--- END OF DOCUMENT ---', size: 22, bold: true, color: C.darkGray })],
}));
children.push(new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'QuanLiTro SRS v1.0  |  (c) 2026 Development Team  |  Ho Chi Minh City, Vietnam', size: 18, italics: true, color: C.darkGray })],
}));

// ════════════════════════════════════════════════════════════════════════════
//  CREATE AND SAVE DOCUMENT
// ════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Times New Roman', size: 22 } },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top:    convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left:   convertInchesToTwip(1.25),
          right:  convertInchesToTwip(1),
        },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.accent } },
          children: [new TextRun({
            text: 'SRS – Boarding House Management System (QuanLiTro) v1.0',
            size: 18, color: C.darkGray, italics: true,
          })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.accent } },
          children: [new TextRun({ text: 'Confidential – For Academic Use Only | SWT Course 2026', size: 18, color: C.darkGray })],
        })],
      }),
    },
    children,
  }],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync('SRS_QuanLiTro_v1.0.docx', buffer);
console.log('SUCCESS: SRS_QuanLiTro_v1.0.docx generated!');
