# Multi-Page Architecture & Authentication Gateway

Transform Vertex Customs into a structured multi-page application with a sleek entrance authentication gateway, role-based demo profiles, persistent top navigation with integrated Dashboard access, and dedicated full-page views for all major automotive capabilities.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed based on your preferences:
> - **Authentication Gateway**: An entrance login screen gates access to the website with one-click quick demo profiles for **Client / Enthusiast** and **Workshop Lead / Admin**, plus manual credential sign-in.
> - **Navigation & Page Architecture**: Replaces single-page anchor scrolling with distinct full-page views for every major feature:
>   1. **Home Overview** (`/home`): Hero showcase, quick action shortcuts, feature highlights, and recent community builds.
>   2. **Vehicle Customizer** (`/customizer`): Interactive 2D vehicle studio, paint & finishes, forged wheels, aero kits, and live Web Audio engine synthesizer.
>   3. **Telemetry Comparison** (`/comparison`): 1:1 right-side profile split slider comparing stock OEM vs. Vertex custom specifications.
>   4. **Parts Database** (`/parts`): Searchable catalog with category filtering, technical specs modal, and stock status in ₹.
>   5. **User Galleries** (`/gallery`): Community showcase, like counter, project modal, and custom build publisher.
>   6. **Workshop Services** (`/services`): Precision engineering packages (Dyno, Wrap, Aero, Brakes, Lighting) with pricing in ₹.
>   7. **Bay Booking** (`/booking`): Three-step workshop bay reservation form with live pricing and boarding pass ticket generation.
>   8. **Command Dashboard** (`/dashboard`): Operational workshop terminal featuring bay assignments, booking triage, parts inventory replenishment, and cryptographic audit logs.
> - **Dashboard Menu Integration**: All redundant standalone "Open Dashboard" buttons (such as the persistent bottom-right floating pill and hero CTA button) are removed; **Dashboard** is now housed directly within the top navigation menu bar with active booking badges and status indicators.
> - **Initial Landing Experience**: Upon successful sign-in, users land on the **Home Overview** page with instant direct access to the Customizer and Dashboard.

---

## 1. Overview & Core Concept

Vertex Customs currently presents its features in a continuous vertical scrolling single-page layout with multiple standalone "Open Dashboard" buttons. 

This enhancement transforms the experience into a modular, production-ready web application:
- **Gatekeeper Authentication Experience**: First-time visitors are presented with a high-performance login screen styled with carbon fiber textures, ambient neon backlighting, and one-click quick logins (`Client Mode` vs `Workshop Admin Mode`) or standard credentials.
- **Dedicated Distinct Pages**: Each feature receives its own focused viewport, complete with page headers, dedicated actions, clear breadcrumbs, and zero distracting page clutter.
- **Top Bar Contract Navigation**: The top bar strictly manages navigation between all views, displays the active user profile, provides a logout trigger, and houses the **Dashboard** link directly in the primary menu bar.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Entrance & Authentication Flow**:
   - Visitor arrives at `/login` or root state.
   - Screen renders a luxury automotive command portal with username/password inputs and two quick demo buttons:
     - `Client Experience`: Logs in as *Marcus Vance (Speed Enthusiast)*.
     - `Workshop Staff`: Logs in as *Lead Technician (Full Terminal Access)*.
   - On login, session state is preserved in memory and localStorage with smooth transition to the Home page.

2. **Main Application Navigation**:
   - Persistent responsive top bar displays the brand wordmark, page navigation links (`Home`, `Customizer`, `Comparison`, `Parts`, `Galleries`, `Services`, `Book Bay`, `Dashboard`), user avatar pill, and Sign Out action.
   - Clicking any menu item transitions immediately to that dedicated full-page component without reloading the page or losing customizer state.

3. **Cross-Page Functional Handoffs**:
   - When a user finishes a custom build in the **Customizer** page and clicks *"Book Workshop Build With This Spec"*, the app smoothly transitions to the **Bay Booking** page with the car specifications pre-filled.
   - When a user clicks *"Configure In Workshop"* from the **Parts Database** page, they are routed to the **Customizer** with the relevant hardware category highlighted.
   - When a booking is submitted on the **Bay Booking** page, the administrator can navigate to the **Dashboard** in the menu bar to view the ticket queued in real time.

### Visual Identity & Theme

- **Aesthetic Direction**: High-end automotive dark luxury, dark slate neutral canvas (`#09090b` / `#0f172a`), hairline borders (`#27272a`), with sharp lime green (`#84cc16`) and cyber cyan (`#06b6d4`) accents.
- **Typography**: 
  - Display / Headings: `Rajdhani` (bold, industrial, high-velocity).
  - Body: `Inter` / `Plus Jakarta Sans` for clean scannability.
  - Telemetry, SKUs, and Prices: `font-mono tabular-nums` in Indian Rupee (**₹**).
- **Navigation Styling**: Clean typographic links with subtle active underline indicators, eliminating pill-shaped badge clutter.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale | Alternatives Considered |
| :--- | :--- | :--- | :--- |
| **Authentication Flow** | Client-side session gateway with one-click demo profiles + credential inputs | Instant evaluability in preview sandbox without requiring external OAuth setup or broken credential barriers | Backend-only session cookies (adds unnecessary friction and redirects in iframe) |
| **Routing Architecture** | Lightweight state-based page router (`currentPage: 'home' \| 'customizer' \| ...`) | Guarantees zero reload latency, preserves audio synthesizer state and unsaved customizer configurations across view transitions | Full page reloads with HTML anchors (resets audio synthesizer and in-progress customizations) |
| **Dashboard Placement** | Embedded directly into top navigation bar with active job count badge | Fulfills user brief to remove intrusive floating and hero buttons while providing clear, professional access | Hidden under a secondary settings gear or hamburger-only menu |
| **Currency Consistency** | Universal **₹** (INR) across all pages, parts, quotes, and audit logs | Ensures continuity and alignment with user's requested currency formatting | Mixed currency symbols |

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Root Component                              │
│         (Auth Session, Active View State, Shared Bookings Store)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌───────────────────────┐                        ┌───────────────────────┐
│     LoginPage         │ (if unauthenticated)   │      Top Navbar       │ (Persistent)
│  - Credentials Form   │                        │  - Brand Wordmark     │
│  - One-Click Client   │                        │  - Page Navigation    │
│  - One-Click Admin    │                        │  - Menu Bar Dashboard │
└───────────────────────┘                        │  - User Profile & Exit│
                                                 └───────────┬───────────┘
                                                             │
         ┌───────────────────┬───────────────────┬───────────┴───────────┬───────────────────┐
         ▼                   ▼                   ▼                       ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐     ┌─────────────────┐ ┌─────────────────┐
│    HomePage     │ │ CustomizerPage  │ │ ComparisonPage  │     │ PartsPage       │ │ DashboardPage   │
│ - Hero Showcase │ │ - 2D SVG Car    │ │ - Right Profile │     │ - Catalog Grid  │ │ - Bay Allocation│
│ - Quick Links   │ │ - Web Audio     │ │ - Split Slider  │     │ - Specs Modal   │ │ - Queue Triage  │
│ - Build Preview │ │ - Live Gauges   │ │ - Delta Metrics │     │ - Search & Filter│ │ - Stock Restock│
└─────────────────┘ └─────────────────┘ └─────────────────┘     └─────────────────┘ └─────────────────┘
         │                   │                                           │                   │
         └───────────────────┴───────────────────┬───────────────────────┴───────────────────┘
                                                 ▼
                                ┌─────────────────────────────────┐
                                │       Backend REST API          │
                                │   /api/bookings, /api/parts,    │
                                │   /api/inventory, /api/gallery  │
                                └─────────────────────────────────┘
```

### Component & State Plan

1. **Authentication State**:
   - `user`: `{ id: string, name: string, role: 'client' | 'admin', email: string, avatar: string } | null`
   - Gated view logic: If `user === null`, render `<LoginPage />`.
   - On successful sign in, render main layout with `<Navbar />` and active page.

2. **Page Navigation State**:
   - `currentPage`: `'home' | 'customizer' | 'comparison' | 'parts' | 'gallery' | 'services' | 'booking' | 'dashboard'`
   - Clean URLs / hash syncing (`#home`, `#customizer`, `#dashboard`, etc.) for browser history back/forward support.

3. **Removed Elements**:
   - Removed persistent floating bottom-right `"Open Dashboard"` pill button.
   - Removed hero section prominent CTA button for `"Open Dashboard"`, redirecting attention to `"Launch 2D Customizer"` and `"Explore Parts"`.
   - Replaced with `"Dashboard"` inside the top navbar navigation list.

4. **Preserved Capabilities**:
   - Real-time Web Audio API engine synthesizer (55 Hz to 180 Hz with burble pops).
   - 1:1 right-side profile comparison slider.
   - Complete parts database and stock alerts.
   - User build galleries with publishing and likes.
   - Workshop bay management and inventory reorder simulation in ₹.
