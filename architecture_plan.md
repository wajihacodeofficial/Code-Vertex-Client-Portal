# Account Architecture (Minimal but Scalable)

## 1. Roles
You only need 3 roles:
- **Client Account**: External user (your customer)
- **Team Account**: Internal execution (you + partner)
- **Admin Account**: Full system control (you only)

*Internally, your Team + Admin can share the same login system, just with elevated privileges for Admin.*

## 2. Client Account (External Facing Portal)
**Core Purpose**: Give clients visibility, control, and communication — NOT system complexity.

### Features
**A. Dashboard**
- Active projects overview
- Project status (In Progress, Review, Completed)
- Key milestones & deadlines
- Notifications (updates, approvals needed)

**B. Project View**
- Project summary
- Timeline / milestones
- Task progress (read-only mostly)
- Deliverables list
- Tech stack used

**C. File & Deliverables Access**
- Download files (designs, builds, documents)
- View versions (v1, v2, final)
- Secure file storage

**D. Communication**
- Chat with team
- Comment on tasks/files
- Request revisions

**E. Task / Request Submission**
Submit: Change requests, Bug reports, Feature requests, Priority tagging (Low / Medium / High)

**F. Billing & Payments**
- View invoices, Payment history, Download receipts, Payment status (Paid / Pending)

**G. Account Settings**
- Profile info, Company details, Password/security

### Client Restrictions
- ❌ Cannot edit internal tasks
- ❌ Cannot see internal discussions
- ❌ Cannot access other clients
- ❌ No system-level visibility

## 3. Team Account (Internal Execution Layer)
**Core Purpose**: Execution, delivery, and client handling.

### Features
- **A. Internal Dashboard**: All active clients, All projects, Task workload, Deadlines overview
- **B. Project Management**: Create & manage projects, Define milestones, Assign tasks, Update statuses
- **C. Task Management**: Full CRUD on tasks, Assign to team member, Priority & deadlines, Internal notes (hidden from client)
- **D. Client Communication**: Respond to messages, Approve/reject requests, Send updates
- **E. File Management**: Upload deliverables, Version control, Share with client
- **F. Billing Support**: Generate invoices, Mark payments manually, Track outstanding payments
- **G. Internal Notes (IMPORTANT)**: Private comments, Internal discussions, Strategy notes (NOT visible to client)

### Team Restrictions
- ❌ No system-level config
- ❌ No role/permission changes
- ❌ Limited access to financial controls (optional)

## 4. Admin Account (System Control Layer)
**Core Purpose**: Full control over platform, clients, and operations.

### Features
- **A. User & Role Management**: Create/edit/delete Clients, Team members, Assign roles
- **B. Project Oversight**: Access ALL projects, Override statuses, Reassign ownership
- **C. Financial Control**: Full billing system control, Payment integrations, Revenue analytics
- **D. System Settings**: Branding (logo, colors), Email templates, Notification settings
- **E. Security & Logs**: Activity logs, Login history, Audit trails
- **F. Data Management**: Backup & restore, Export data

## 5. Policies (Must-Have for Enterprise Feel)
Visible in the portal footer + onboarding flow.
- **Terms of Service**: Defines service scope, Responsibilities, Usage rules
- **Privacy Policy**: Data collection, Storage, Third-party integrations
- **NDA (Non-Disclosure Agreement)**: Protect client data & internal processes
- **Service Level Agreement (SLA)**: Response times, Delivery timelines, Support expectations
- **Refund Policy**, **Revision Policy**, **Payment Policy**, **Data Security Policy**

## 6. Documents to Place Inside Portal
- **Client-Accessible**: Contracts, Proposals, Invoices, Deliverables, Project docs, User guides
- **Internal Only**: Tech architecture docs, API docs, Internal SOPs, Debug logs, Deployment notes

## 7. Minimal Account Strategy
Structure: 1 Admin (You), 1 Team Account (Partner), Multiple Client Accounts.
*Optimization Tip*: Use tags ("Frontend", "Urgent") instead of complex team roles.

## 8. Critical Enterprise Features
- Role-based access control (RBAC)
- Activity logs (audit trail)
- File versioning
- Notifications system
- Secure authentication (JWT + refresh tokens)
- Backup system

## 9. Architecture Insight
- **Multi-tenant system**: Each client = isolated workspace
- **Data separation** at DB level

## 10. Simple Mental Model
- **Client** = Visibility
- **Team** = Execution
- **Admin** = Control
