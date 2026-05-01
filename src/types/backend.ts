/**
 * Shared backend types for the Anvisco client portal / admin system.
 *
 * Mirrors the Supabase tables in supabase/migrations/001_initial_anvisco_backend.sql.
 * Money fields are stored in cents in the DB.
 */

// ----- Profiles / auth -----

export type UserRole = 'admin' | 'client'

export interface AdminProfile {
  id: string
  email: string
  role: UserRole
  createdAt: string
}

// ----- Clients -----

export type ClientStatus =
  | 'lead'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived'

export interface Client {
  id: string
  name: string
  businessName: string | null
  email: string
  phone: string | null
  websiteUrl: string | null
  status: ClientStatus
  notes: string | null
  createdAt: string
  updatedAt: string
}

// ----- Packages (a client's purchase) -----

export type PackageType = 'audit' | 'modules' | 'build' | 'recurring'

export type PackageStatus =
  | 'requested'
  | 'scoped'
  | 'in_progress'
  | 'complete'
  | 'cancelled'

export interface ClientPackage {
  id: string
  clientId: string
  packageType: PackageType
  packageName: string
  status: PackageStatus
  subtotalCents: number
  discountCents: number
  totalCents: number
  /** For Care/Growth plans. */
  recurringAmountCents: number | null
  nextPaymentDueAt: string | null
  paymentUrl: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  createdAt: string
  updatedAt: string
}

// ----- Module selections (line items inside a package) -----

export interface ClientModuleSelection {
  id: string
  packageId: string
  moduleId: string
  moduleName: string
  quantity: number
  unitPriceCents: number
  totalCents: number
  createdAt: string
}

// ----- Payments -----

export type PaymentStatus =
  | 'not_started'
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'cancelled'

export interface PaymentSchedule {
  id: string
  clientId: string
  packageId: string
  label: string
  amountCents: number
  dueDate: string | null
  status: PaymentStatus
  paymentUrl: string | null
  paidAt: string | null
  createdAt: string
}

// ----- Project stages and updates -----

export type ProjectStage =
  | 'audit'
  | 'scope'
  | 'build'
  | 'launch'
  | 'support'
  | 'complete'

export interface ProjectUpdate {
  id: string
  clientId: string
  packageId: string | null
  stage: ProjectStage
  title: string
  body: string | null
  visibleToClient: boolean
  createdAt: string
}

// ----- Email log -----

export type EmailStatus = 'draft' | 'queued' | 'sent' | 'failed'

export interface EmailLog {
  id: string
  clientId: string | null
  toEmail: string
  subject: string
  body: string | null
  status: EmailStatus
  sentAt: string | null
  createdAt: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  createdAt: string
}
