# Full Architecture Implementation Plan

This plan addresses all layers of the minimal scalable architecture you outlined. We will tackle this systematically to turn the "WIP" features into polished, functional layouts.

## Phase 1: Routing & Component Wiring (Current Focus)
- Update `App.tsx` to replace WIP inline components with actual Page components.
- Wire up `TeamTasks.tsx` and `AdminInvoices.tsx` to their respective routes.
- Create missing placeholder pages that were defined in the architecture (e.g., `AdminClients`, `TeamProjects`).

## Phase 2: Implement "Policies" (Enterprise Feel)
- Create a `PoliciesPage.tsx` component that houses the core policies (ToS, Privacy Policy, NDA, etc.).
- Add a footer to the client `DashboardLayout` so these policies are constantly visible.

## Phase 3: Dashboard Refinements (Visibility vs Execution vs Control)
- **Client Account (`DashboardHome`)**: Refine to ensure it focuses strictly on Read-Only visibility, Milestones, and Invoices.
- **Team Account (`TeamDashboard`)**: Build out workload overviews, internal task CRUD operations, and internal hidden notes.
- **Admin Account (`AdminDashboard`)**: Build out system controls, financial oversight, and activity logging features.

## Phase 4: Mocking Multi-Tenancy Data DB (Workspace Isolation)
- Create a mock data service (`data/mockDb.ts`) that correctly tags every project, invoice, and ticket with a `clientId`.
- Implement simple context logic that filters all viewable data purely based on the logged-in user's assigned `clientId`.

---
*We are starting Phase 1 & 2 immediately by updating the routing system and spinning up the Policy features.*
