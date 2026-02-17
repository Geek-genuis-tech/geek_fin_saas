export type UserRole = "admin" | "manager" | "user";

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  department?: string;
}

export type OperationType = "revenu" | "depense";

export type CategoryType =
  | "salaires"
  | "ventes"
  | "services"
  | "fournitures"
  | "loyer"
  | "transport"
  | "marketing"
  | "equipement"
  | "taxes"
  | "caisse"
  | "autres";

export interface Operation {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: OperationType;
  category: CategoryType;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  salary: number;
  startDate: string;
  status: "actif" | "inactif" | "conge";
}

export interface Budget {
  id: string;
  category: CategoryType;
  allocated: number;
  spent: number;
  month: string;
  year: number;
}

export interface CashRegister {
  id: string;
  date: string;
  openingBalance: number;
  closingBalance: number;
  transactions: CashTransaction[];
}

export interface CashTransaction {
  id: string;
  time: string;
  description: string;
  amount: number;
  type: "entree" | "sortie";
}

export const CATEGORIES: { value: CategoryType; label: string }[] = [
  { value: "salaires", label: "Salaires" },
  { value: "ventes", label: "Ventes" },
  { value: "services", label: "Services" },
  { value: "fournitures", label: "Fournitures" },
  { value: "loyer", label: "Loyer" },
  { value: "transport", label: "Transport" },
  { value: "marketing", label: "Marketing" },
  { value: "equipement", label: "Équipement" },
  { value: "taxes", label: "Taxes & Impôts" },
  { value: "autres", label: "Autres" },
];

export const DEPARTMENTS = [
  "Direction",
  "Comptabilité",
  "Ressources Humaines",
  "Commercial",
  "Marketing",
  "Technique",
  "Support",
];

// Client types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  createdAt: string;
}

// Invoice item types
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type InvoiceStatus = "brouillon" | "envoyee" | "payee" | "en_retard" | "annulee";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Invoice status labels
export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  brouillon: "Brouillon",
  envoyee: "Envoyée",
  payee: "Payée",
  en_retard: "En retard",
  annulee: "Annulée",
};

// KPI Types
export interface MonthlyKPI {
  month: string;
  year: number;
  monthLabel: string;
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number;
  operationCount: number;
  averageTransaction: number;
}

export interface CategoryKPI {
  category: CategoryType;
  label: string;
  revenue: number;
  expense: number;
  percentageOfTotal: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

export interface FinancialRatios {
  grossMargin: number;
  netMargin: number;
  expenseRatio: number;
  revenueToExpenseRatio: number;
  workingCapitalRatio: number;
  debtToEquityRatio: number;
}

export interface KPIAlert {
  id: string;
  type: "warning" | "danger" | "success";
  title: string;
  message: string;
  metric: string;
  threshold: number;
  currentValue: number;
}

export interface AnnualProjection {
  projectedRevenue: number;
  projectedExpenses: number;
  projectedProfit: number;
  currentRunRate: number;
  projectedEndYearBalance: number;
}

export interface DetailedAnalysis {
  monthlyKPIs: MonthlyKPI[];
  categoryKPIs: CategoryKPI[];
  ratios: FinancialRatios;
  alerts: KPIAlert[];
  projections: AnnualProjection;
  yearToDateRevenue: number;
  yearToDateExpenses: number;
  yearToDateProfit: number;
  lastYearComparison: {
    revenueGrowth: number;
    expenseGrowth: number;
    profitGrowth: number;
  };
}
