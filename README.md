# TalentBridge Recruitment & Staffing Platform - Frontend Client

Enterprise-grade, modular Frontend Client built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, **shadcn/ui (Radix UI primitives)**, **TanStack Query (React Query)**, **Zustand**, and **React Router v6**.

The client operates as the digital recruitment hub for candidates applying to top engineering vacancies with nominal application fees (₹99) and an agency administration portal with real-time attribution tracking across the **10-member recruiter team**.

---

## 🌟 Key Features

### 1. Candidate Experience (Mobile-First)
- **Job Requisitions Catalog (`/jobs`)**: Filterable job catalog by title, client, department, and location with salary tags in INR and nominal fee badges.
- **Job Requisition Detail (`/jobs/:id`)**: Role overview, eligibility criteria, and application fee guarantee.
- **Multi-Step Job Application & S3 File Upload**:
  - **Step 1**: Pre-fills profile, current/expected CTC, notice period, skills, candidate notes, and S3 resume upload.
  - **Recruiter Referral Code**: Auto-detects `?ref=CODE` from campaign URLs and offers quick-fill suggestions for all 10 recruiters (`ALICE01`, `BOB02`, `CHARLIE03`, `DIVYA04`, `ETHAN05`, `FATIMA06`, `GEORGE07`, `HEMA08`, `ISHAN09`, `JYOTI10`).
  - **Direct S3 Binary Streaming**: Requests pre-signed `PUT` URL from AWS Lambda and streams files directly to the private S3 bucket with visual progress.
- **Simulated Payment Modal (Razorpay / Cashfree)**:
  - **Step 2**: Displays application processing fee (e.g. ₹99) with tabbed payment methods:
    * **UPI**: Interactive QR code generation (scannable via GPay/PhonePe/Paytm) + VPA input.
    * **Debit / Credit Card**: Cardholder, number, expiry, and CVV inputs.
    * **NetBanking**: Major Indian banks (HDFC, ICICI, SBI, Axis, Kotak).
  - Verifies payment against backend webhook and outputs cryptographic receipt.
- **My Applications Dashboard (`/applications/me`)**:
  - Live 5-step visual stepper:
    `[Applied] -> [Under Review] -> [Shortlisted] -> [Client Interview] -> [Hired / Placed] (or [Rejected])`
  - Real-time recruiter notes & feedback.
  - One-click secure resume download via AWS S3 pre-signed `GET` URLs (15-min TTL).

### 2. Admin & Recruiter Operations (Dense Layout)
- **Operations Dashboard (`/admin/dashboard`)**:
  - 4 Key Metric KPI Cards: Active Openings, Total Applicants, Fees Collected in INR, Conversion Rate.
  - Recruiter Referral Leaderboard ranked by fee revenue.
  - Recent applicant activity stream.
- **Job Requisition CRUD (`/admin/jobs`)**:
  - Create and edit vacancies with salary range in INR, criteria chips, and nominal application fee.
  - Instant status toggle (`Open` / `Closed`) and deletion.
- **Applicant Registry Board (`/admin/applications`)**:
  - Multi-filtering by Job Requisition, Pipeline Stage, and Recruiter Referral Code.
  - One-click dropdown to transition candidates across hiring stages with **optimistic UI updates**.
  - Candidate info popover with current/expected CTC, notice period, and notes.
  - Direct resume download from S3.
- **10-Member Recruiter Team (`/admin/recruiters`)**:
  - Performance matrix for all 10 recruiters with assigned codes (`ALICE01` through `JYOTI10`).
  - Campaign URL generator with one-click copy button (`https://.../jobs?ref=ALICE01`).

---

## 🛠️ Tech Stack & Directory Structure

```
ui/
├── src/
│   ├── components/
│   │   ├── admin/             # JobFormDialog, ApplicationStatusDropdown, CandidatePopover, RecruiterLeaderboard
│   │   ├── applications/      # ApplicationStepper, StatusBadges, PaymentSuccessReceipt
│   │   ├── jobs/              # JobCard, JobFilters, ApplicationFeeBadge
│   │   ├── layout/            # Navbar, Footer, ProtectedRoute, CandidateLayout, AdminLayout
│   │   ├── modals/            # ApplyModal (2-Step Application & Payment Checkout)
│   │   └── ui/                # shadcn primitives (Button, Card, Dialog, Tabs, Table, Badge, Input, etc.)
│   ├── config/
│   │   ├── env.ts             # API Base URL & runtime environment
│   │   └── recruiters.ts      # 10-member recruiter team configuration
│   ├── hooks/
│   │   ├── useAdmin.ts        # Admin queries & optimistic pipeline updates
│   │   ├── useApplications.ts # Candidate application & payment simulation
│   │   ├── useAuth.ts         # User session & permissions
│   │   └── useJobs.ts         # Job catalog & CRUD mutations
│   ├── lib/
│   │   └── utils.ts           # Class merge (clsx + twMerge), INR currency & date formatters
│   ├── pages/
│   │   ├── admin/             # AdminDashboardPage, AdminJobsPage, AdminApplicationsPage, AdminRecruitersPage
│   │   ├── auth/              # LoginPage, RegisterPage
│   │   ├── candidate/         # JobsCatalogPage, JobDetailPage, MyApplicationsPage
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   ├── apiClient.ts       # Axios client with JWT interceptor & 401 handling
│   │   ├── adminService.ts
│   │   ├── applicationService.ts
│   │   ├── authService.ts
│   │   ├── fileService.ts     # S3 Presigned URLs & direct XHR PUT streaming
│   │   └── jobService.ts
│   ├── store/
│   │   └── authStore.ts       # Persistent Zustand auth store
│   ├── types/
│   │   └── index.ts           # Full TypeScript domain models
│   ├── App.tsx                # React Router v6 & TanStack Query configuration
│   ├── main.tsx
│   └── index.css              # Tailwind base + shadcn CSS variables
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd ui
bun install
```

### 2. Configure Environment
Create `.env` (pre-configured with deployed AWS backend in `eu-north-1`):
```env
VITE_API_BASE_URL=https://3jbodl5qv1.execute-api.eu-north-1.amazonaws.com
```

### 3. Run Development Server
```bash
bun run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
bun run build
```

---

## 🔑 Pre-Configured Demo Accounts

Click the **Quick Demo Accounts** buttons on the Login page (`/login`):

| Role | Email | Password | Assigned Referral Code |
| :--- | :--- | :--- | :--- |
| **Candidate** | `candidate.demo@recruitmenthub.com` | `SecurePass123!` | Direct / None |
| **Recruiter** | `alice.sharma@recruitmenthub.com` | `SecurePass123!` | `ALICE01` |
| **Admin** | `admin@recruitmenthub.com` | `AdminPass123!` | System Administrator |
