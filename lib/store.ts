"use client";

import type { User, Operation, Employee, Budget, CashRegister, CategoryType, Client, Invoice } from "./types";
import { CATEGORIES } from "./types";

// Default users
const defaultUsers: (User & { password: string })[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    name: "Super Admin Finance",
    role: "admin",
    email: "admin@geekfin.com",
    department: "Direction",
  },
  {
    id: "2",
    username: "manager",
    password: "manager123",
    name: "Marie Dupont",
    role: "manager",
    email: "marie@geekfin.com",
    department: "Comptabilité",
  },
  {
    id: "3",
    username: "user",
    password: "user123",
    name: "Jean Martin",
    role: "user",
    email: "jean@geekfin.com",
    department: "Commercial",
  },
];

// Default operations for demo
const defaultOperations: Operation[] = [
  {
    id: "1",
    date: "2026-01-15",
    description: "Vente produits janvier",
    amount: 15000,
    type: "revenu",
    category: "ventes",
    createdBy: "1",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    date: "2026-01-20",
    description: "Salaires janvier",
    amount: 8500,
    type: "depense",
    category: "salaires",
    createdBy: "1",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "3",
    date: "2026-01-25",
    description: "Loyer bureaux",
    amount: 2500,
    type: "depense",
    category: "loyer",
    createdBy: "2",
    createdAt: "2026-01-25T10:00:00Z",
    updatedAt: "2026-01-25T10:00:00Z",
  },
  {
    id: "4",
    date: "2026-02-01",
    description: "Prestation consulting",
    amount: 5000,
    type: "revenu",
    category: "services",
    createdBy: "1",
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "5",
    date: "2026-02-02",
    description: "Fournitures bureau",
    amount: 350,
    type: "depense",
    category: "fournitures",
    createdBy: "3",
    createdAt: "2026-02-02T10:00:00Z",
    updatedAt: "2026-02-02T10:00:00Z",
  },
  {
    id: "6",
    date: "2026-02-03",
    description: "Campagne publicité",
    amount: 1200,
    type: "depense",
    category: "marketing",
    createdBy: "2",
    createdAt: "2026-02-03T10:00:00Z",
    updatedAt: "2026-02-03T10:00:00Z",
  },
];

const defaultEmployees: Employee[] = [
  {
    id: "1",
    name: "Willy",
    position: "Directrice Financière",
    department: "Direction",
    email: "marie@geekfin.com",
    phone: "+33 6 12 34 56 78",
    salary: 5500,
    startDate: "2020-03-15",
    status: "actif",
  },
  {
    id: "2",
    name: "Victoire Kasongo",
    position: "Comptable",
    department: "Comptabilité",
    email: "jean@geekfin.com",
    phone: "+33 6 23 45 67 89",
    salary: 3200,
    startDate: "2021-06-01",
    status: "actif",
  },
  {
    id: "3",
    name: "Madi Melonga",
    position: "Commerciale",
    department: "Commercial",
    email: "sophie@geekfin.com",
    phone: "+243 9383839393",
    salary: 2800,
    startDate: "2022-01-10",
    status: "conge",
  },
  
];

const defaultBudgets: Budget[] = [
  { id: "1", category: "salaires", allocated: 30000, spent: 17000, month: "02", year: 2026 },
  { id: "2", category: "loyer", allocated: 5000, spent: 2500, month: "02", year: 2026 },
  { id: "3", category: "marketing", allocated: 3000, spent: 1200, month: "02", year: 2026 },
  { id: "4", category: "fournitures", allocated: 1000, spent: 350, month: "02", year: 2026 },
  { id: "5", category: "transport", allocated: 2000, spent: 800, month: "02", year: 2026 },
  { id: "6", category: "equipement", allocated: 5000, spent: 0, month: "02", year: 2026 },
];

const defaultCashRegister: CashRegister = {
  id: "1",
  date: "2026-02-03",
  openingBalance: 5000,
  closingBalance: 5650,
  transactions: [
    { id: "1", time: "09:00", description: "Ouverture caisse", amount: 5000, type: "entree" },
    { id: "2", time: "10:30", description: "Vente comptant", amount: 450, type: "entree" },
    { id: "3", time: "11:15", description: "Achat fournitures", amount: 80, type: "sortie" },
    { id: "4", time: "14:00", description: "Vente comptant", amount: 320, type: "entree" },
    { id: "5", time: "15:30", description: "Remboursement client", amount: 40, type: "sortie" },
  ],
};

const defaultClients: Client[] = [
  {
    id: "1",
    name: "Pierre Dubois",
    email: "pierre.dubois@techcorp.fr",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de la Tech, 75001 Paris",
    company: "TechCorp Solutions",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Sophie Martin",
    email: "sophie.martin@webagency.com",
    phone: "+33 6 23 45 67 89",
    address: "456 Avenue du Web, 69002 Lyon",
    company: "Web Agency Lyon",
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "3",
    name: "Jean Petit",
    email: "jean.petit@startup.io",
    phone: "+33 6 34 56 78 90",
    address: "789 Boulevard Startup, 33000 Bordeaux",
    company: "Startup IO",
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "4",
    name: "Marie Bernard",
    email: "marie.bernard@consult.fr",
    phone: "+33 6 45 67 89 01",
    address: "321 Rue Consult, 31000 Toulouse",
    company: "Consult Pro",
    createdAt: "2026-02-10T10:00:00Z",
  },
];

const defaultInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "FAC-2026-001",
    clientId: "1",
    clientName: "Pierre Dubois",
    date: "2026-02-01",
    dueDate: "2026-03-01",
    items: [
      { id: "1", description: "Développement site web", quantity: 40, unitPrice: 150 },
      { id: "2", description: "Hébergement annuel", quantity: 1, unitPrice: 200 },
    ],
    subtotal: 6200,
    taxRate: 20,
    taxAmount: 1240,
    total: 7440,
    status: "payee",
    notes: "Paiement reçu le 15/02/2026",
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "2",
    invoiceNumber: "FAC-2026-002",
    clientId: "2",
    clientName: "Sophie Martin",
    date: "2026-02-05",
    dueDate: "2026-03-05",
    items: [
      { id: "1", description: "Refonte graphique", quantity: 20, unitPrice: 120 },
      { id: "2", description: "SEO optimisation", quantity: 10, unitPrice: 100 },
    ],
    subtotal: 3400,
    taxRate: 20,
    taxAmount: 680,
    total: 4080,
    status: "envoyee",
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-02-05T10:00:00Z",
  },
  {
    id: "3",
    invoiceNumber: "FAC-2026-003",
    clientId: "3",
    clientName: "Jean Petit",
    date: "2026-02-10",
    dueDate: "2026-02-25",
    items: [
      { id: "1", description: "Application mobile MVP", quantity: 60, unitPrice: 180 },
    ],
    subtotal: 10800,
    taxRate: 20,
    taxAmount: 2160,
    total: 12960,
    status: "en_retard",
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "4",
    invoiceNumber: "FAC-2026-004",
    clientId: "4",
    clientName: "Marie Bernard",
    date: "2026-02-15",
    dueDate: "2026-03-15",
    items: [
      { id: "1", description: "Audit financier", quantity: 8, unitPrice: 250 },
      { id: "2", description: "Rapport conseil", quantity: 1, unitPrice: 500 },
    ],
    subtotal: 2500,
    taxRate: 20,
    taxAmount: 500,
    total: 3000,
    status: "brouillon",
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
  },
];

// Store functions
export function getUsers(): (User & { password: string })[] {
  if (typeof window === "undefined") return defaultUsers;
  const stored = localStorage.getItem("geekfin_users");
  return stored ? JSON.parse(stored) : defaultUsers;
}

export function authenticate(username: string, password: string): User | null {
  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("geekfin_current_user");
  return stored ? JSON.parse(stored) : null;
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("geekfin_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("geekfin_current_user");
  }
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("geekfin_current_user");
}

// Operations
export function getOperations(): Operation[] {
  if (typeof window === "undefined") return defaultOperations;
  const stored = localStorage.getItem("geekfin_operations");
  return stored ? JSON.parse(stored) : defaultOperations;
}

export function saveOperations(operations: Operation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("geekfin_operations", JSON.stringify(operations));
}

export function addOperation(operation: Omit<Operation, "id" | "createdAt" | "updatedAt">): Operation {
  const operations = getOperations();
  const newOperation: Operation = {
    ...operation,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  operations.push(newOperation);
  saveOperations(operations);
  return newOperation;
}

export function updateOperation(id: string, updates: Partial<Operation>): Operation | null {
  const operations = getOperations();
  const index = operations.findIndex((op) => op.id === id);
  if (index === -1) return null;
  operations[index] = { ...operations[index], ...updates, updatedAt: new Date().toISOString() };
  saveOperations(operations);
  return operations[index];
}

export function deleteOperation(id: string): boolean {
  const operations = getOperations();
  const filtered = operations.filter((op) => op.id !== id);
  if (filtered.length === operations.length) return false;
  saveOperations(filtered);
  return true;
}

// Employees
export function getEmployees(): Employee[] {
  if (typeof window === "undefined") return defaultEmployees;
  const stored = localStorage.getItem("geekfin_employees");
  return stored ? JSON.parse(stored) : defaultEmployees;
}

export function saveEmployees(employees: Employee[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("geekfin_employees", JSON.stringify(employees));
}

export function addEmployee(employee: Omit<Employee, "id">): Employee {
  const employees = getEmployees();
  const newEmployee: Employee = {
    ...employee,
    id: Date.now().toString(),
  };
  employees.push(newEmployee);
  saveEmployees(employees);
  return newEmployee;
}

export function updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
  const employees = getEmployees();
  const index = employees.findIndex((e) => e.id === id);
  if (index === -1) return null;
  employees[index] = { ...employees[index], ...updates };
  saveEmployees(employees);
  return employees[index];
}

export function deleteEmployee(id: string): boolean {
  const employees = getEmployees();
  const filtered = employees.filter((e) => e.id !== id);
  if (filtered.length === employees.length) return false;
  saveEmployees(filtered);
  return true;
}

// Budgets
export function getBudgets(): Budget[] {
  if (typeof window === "undefined") return defaultBudgets;
  const stored = localStorage.getItem("geekfin_budgets");
  return stored ? JSON.parse(stored) : defaultBudgets;
}

export function saveBudgets(budgets: Budget[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("geekfin_budgets", JSON.stringify(budgets));
}

export function addBudget(budget: Omit<Budget, "id">): Budget {
  const budgets = getBudgets();
  const newBudget: Budget = {
    ...budget,
    id: Date.now().toString(),
  };
  budgets.push(newBudget);
  saveBudgets(budgets);
  return newBudget;
}

export function updateBudget(id: string, updates: Partial<Budget>): Budget | null {
  const budgets = getBudgets();
  const index = budgets.findIndex((b) => b.id === id);
  if (index === -1) return null;
  budgets[index] = { ...budgets[index], ...updates };
  saveBudgets(budgets);
  return budgets[index];
}

export function deleteBudget(id: string): boolean {
  const budgets = getBudgets();
  const filtered = budgets.filter((b) => b.id !== id);
  if (filtered.length === budgets.length) return false;
  saveBudgets(filtered);
  return true;
}

// Cash Register
export function getCashRegister(): CashRegister {
  if (typeof window === "undefined") return defaultCashRegister;
  const stored = localStorage.getItem("geekfin_cash_register");
  return stored ? JSON.parse(stored) : defaultCashRegister;
}

export function saveCashRegister(register: CashRegister): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("geekfin_cash_register", JSON.stringify(register));
}

export function addCashTransaction(transaction: Omit<CashRegister["transactions"][0], "id">): CashRegister {
  const register = getCashRegister();
  const newTransaction = { ...transaction, id: Date.now().toString() };
  register.transactions.push(newTransaction);
  
  // Recalculate closing balance
  const totalIn = register.transactions.filter((t) => t.type === "entree").reduce((sum, t) => sum + t.amount, 0);
  const totalOut = register.transactions.filter((t) => t.type === "sortie").reduce((sum, t) => sum + t.amount, 0);
  register.closingBalance = totalIn - totalOut;
  
  saveCashRegister(register);
  return register;
}

// Statistics helpers
export function getMonthlyStats(month?: string, year?: number) {
  const operations = getOperations();
  const now = new Date();
  const targetMonth = month || String(now.getMonth() + 1).padStart(2, "0");
  const targetYear = year || now.getFullYear();

  const filtered = operations.filter((op) => {
    const opDate = new Date(op.date);
    return (
      opDate.getMonth() + 1 === Number.parseInt(targetMonth) && opDate.getFullYear() === targetYear
    );
  });

  const totalRevenu = filtered
    .filter((op) => op.type === "revenu")
    .reduce((sum, op) => sum + op.amount, 0);

  const totalDepense = filtered
    .filter((op) => op.type === "depense")
    .reduce((sum, op) => sum + op.amount, 0);

  const byCategory = filtered.reduce(
    (acc, op) => {
      if (!acc[op.category]) {
        acc[op.category] = { revenu: 0, depense: 0 };
      }
      if (op.type === "revenu") {
        acc[op.category].revenu += op.amount;
      } else {
        acc[op.category].depense += op.amount;
      }
      return acc;
    },
    {} as Record<CategoryType, { revenu: number; depense: number }>
  );

  return {
    totalRevenu,
    totalDepense,
    balance: totalRevenu - totalDepense,
    operationsCount: filtered.length,
    byCategory,
  };
}

// Clients
export function getClients(): Client[] {
  if (typeof window === "undefined") return defaultClients;
  const stored = localStorage.getItem("geekfin_clients");
  return stored ? JSON.parse(stored) : defaultClients;
}

export function saveClients(clients: Client[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("geekfin_clients", JSON.stringify(clients));
}

export function addClient(client: Omit<Client, "id" | "createdAt">): Client {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  clients.push(newClient);
  saveClients(clients);
  return newClient;
}

export function updateClient(id: string, updates: Partial<Client>): Client | null {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return null;
  clients[index] = { ...clients[index], ...updates };
  saveClients(clients);
  return clients[index];
}

export function deleteClient(id: string): boolean {
  const clients = getClients();
  const filtered = clients.filter((c) => c.id !== id);
  if (filtered.length === clients.length) return false;
  saveClients(filtered);
  return true;
}

// Invoices
export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return defaultInvoices;
  const stored = localStorage.getItem("geekfin_invoices");
  return stored ? JSON.parse(stored) : defaultInvoices;
}

export function saveInvoices(invoices: Invoice[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("geekfin_invoices", JSON.stringify(invoices));
}

export function generateInvoiceNumber(): string {
  const invoices = getInvoices();
  const year = new Date().getFullYear();
  const existingNumbers = invoices
    .filter((inv) => inv.invoiceNumber.startsWith(`FAC-${year}`))
    .map((inv) => {
      const match = inv.invoiceNumber.match(/FAC-\d{4}-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
  const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  const newNumber = String(maxNumber + 1).padStart(3, "0");
  return `FAC-${year}-${newNumber}`;
}

export function addInvoice(invoice: Omit<Invoice, "id" | "invoiceNumber" | "createdAt" | "updatedAt">): Invoice {
  const invoices = getInvoices();
  const newInvoice: Invoice = {
    ...invoice,
    id: Date.now().toString(),
    invoiceNumber: generateInvoiceNumber(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  invoices.push(newInvoice);
  saveInvoices(invoices);
  return newInvoice;
}

export function updateInvoice(id: string, updates: Partial<Invoice>): Invoice | null {
  const invoices = getInvoices();
  const index = invoices.findIndex((inv) => inv.id === id);
  if (index === -1) return null;
  invoices[index] = { ...invoices[index], ...updates, updatedAt: new Date().toISOString() };
  saveInvoices(invoices);
  return invoices[index];
}

export function deleteInvoice(id: string): boolean {
  const invoices = getInvoices();
  const filtered = invoices.filter((inv) => inv.id !== id);
  if (filtered.length === invoices.length) return false;
  saveInvoices(filtered);
  return true;
}

// Invoice statistics
export function getInvoiceStats() {
  const invoices = getInvoices();
  const now = new Date();

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter((inv) => inv.status === "payee").reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === "envoyee" || inv.status === "brouillon")
    .reduce((sum, inv) => sum + inv.total, 0);
  const overdueAmount = invoices
    .filter((inv) => {
      if (inv.status !== "en_retard") return false;
      return new Date(inv.dueDate) < now;
    })
    .reduce((sum, inv) => sum + inv.total, 0);

  return {
    totalInvoices: invoices.length,
    totalAmount,
    paidAmount,
    pendingAmount,
    overdueAmount,
    paidCount: invoices.filter((inv) => inv.status === "payee").length,
    pendingCount: invoices.filter((inv) => inv.status === "envoyee" || inv.status === "brouillon").length,
    overdueCount: invoices.filter((inv) => {
      if (inv.status !== "en_retard") return false;
      return new Date(inv.dueDate) < now;
    }).length,
  };
}

// ============ KPI ANALYTICS ============

export function getMonthlyKPIs(month?: string, year?: number) {
  const operations = getOperations();
  const now = new Date();
  const targetMonth = month || String(now.getMonth() + 1).padStart(2, "0");
  const targetYear = year || now.getFullYear();

  const monthDate = new Date(parseInt(targetYear), parseInt(targetMonth) - 1, 1);
  const monthLabel = monthDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const filtered = operations.filter((op) => {
    const opDate = new Date(op.date);
    return (
      opDate.getMonth() + 1 === Number.parseInt(targetMonth) && opDate.getFullYear() === targetYear
    );
  });

  const totalRevenue = filtered.filter((op) => op.type === "revenu").reduce((sum, op) => sum + op.amount, 0);
  const totalExpense = filtered.filter((op) => op.type === "depense").reduce((sum, op) => sum + op.amount, 0);
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const averageTransaction = filtered.length > 0 ? (totalRevenue + totalExpense) / filtered.length : 0;

  return {
    month: targetMonth,
    year: targetYear,
    monthLabel,
    totalRevenue,
    totalExpense,
    netProfit,
    profitMargin,
    operationCount: filtered.length,
    averageTransaction,
  };
}

export function getCategoryKPIs(month?: string, year?: number) {
  const operations = getOperations();
  const now = new Date();
  const targetMonth = month || String(now.getMonth() + 1).padStart(2, "0");
  const targetYear = year || now.getFullYear();

  const filtered = operations.filter((op) => {
    const opDate = new Date(op.date);
    return (
      opDate.getMonth() + 1 === Number.parseInt(targetMonth) && opDate.getFullYear() === targetYear
    );
  });

  const totalRevenue = filtered.filter((op) => op.type === "revenu").reduce((sum, op) => sum + op.amount, 0);
  const totalExpense = filtered.filter((op) => op.type === "depense").reduce((sum, op) => sum + op.amount, 0);
  const grandTotal = totalRevenue + totalExpense;

  // Previous month data for trend calculation
  const prevMonthNum = parseInt(targetMonth) === 1 ? 12 : parseInt(targetMonth) - 1;
  const prevYear = parseInt(targetMonth) === 1 ? targetYear - 1 : targetYear;
  const prevFiltered = operations.filter((op) => {
    const opDate = new Date(op.date);
    return opDate.getMonth() + 1 === prevMonthNum && opDate.getFullYear() === prevYear;
  });

  const categoryData: Record<string, { revenue: number; expense: number; prevRevenue: number; prevExpense: number }> = {};

  for (const op of filtered) {
    if (!categoryData[op.category]) {
      categoryData[op.category] = { revenue: 0, expense: 0, prevRevenue: 0, prevExpense: 0 };
    }
    if (op.type === "revenu") {
      categoryData[op.category].revenue += op.amount;
    } else {
      categoryData[op.category].expense += op.amount;
    }
  }

  for (const op of prevFiltered) {
    if (!categoryData[op.category]) continue;
    if (op.type === "revenu") {
      categoryData[op.category].prevRevenue += op.amount;
    } else {
      categoryData[op.category].prevExpense += op.amount;
    }
  }

  const result = Object.entries(categoryData).map(([category, data]) => {
    const currentTotal = data.revenue + data.expense;
    const prevTotal = data.prevRevenue + data.prevExpense;
    const percentageOfTotal = grandTotal > 0 ? (currentTotal / grandTotal) * 100 : 0;

    let trend: "up" | "down" | "stable" = "stable";
    let trendValue = 0;

    if (prevTotal > 0) {
      trendValue = ((currentTotal - prevTotal) / prevTotal) * 100;
      if (trendValue > 5) trend = "up";
      else if (trendValue < -5) trend = "down";
    } else if (currentTotal > 0) {
      trend = "up";
      trendValue = 100;
    }

    return {
      category: category as CategoryType,
      label: CATEGORIES.find((c) => c.value === category)?.label || category,
      revenue: data.revenue,
      expense: data.expense,
      percentageOfTotal: parseFloat(percentageOfTotal.toFixed(1)),
      trend,
      trendValue: parseFloat(trendValue.toFixed(1)),
    };
  });

  return result.sort((a, b) => b.percentageOfTotal - a.percentageOfTotal);
}

export function getFinancialRatios(month?: string, year?: number) {
  const kpi = getMonthlyKPIs(month, year);
  const operations = getOperations();
  const targetMonth = month || String(new Date().getMonth() + 1).padStart(2, "0");
  const targetYear = year || new Date().getFullYear();

  const filtered = operations.filter((op) => {
    const opDate = new Date(op.date);
    return (
      opDate.getMonth() + 1 === Number.parseInt(targetMonth) && opDate.getFullYear() === targetYear
    );
  });

  // Calculate expenses by category
  const expensesByCategory = filtered
    .filter((op) => op.type === "depense")
    .reduce((acc, op) => {
      acc[op.category] = (acc[op.category] || 0) + op.amount;
      return acc;
    }, {} as Record<string, number>);

  // Working capital ratio (simplified - using cash register as working capital)
  const cashRegister = getCashRegister();
  const workingCapital = cashRegister.closingBalance;
  const currentMonthExpenses = kpi.totalExpense;
  const workingCapitalRatio = currentMonthExpenses > 0 ? workingCapital / currentMonthExpenses : 0;

  // Debt to equity ratio (simplified - using total expenses as debt proxy)
  const totalExpenses = kpi.totalExpense;
  const totalRevenue = kpi.totalRevenue;
  const debtToEquityRatio = totalRevenue > 0 ? totalExpenses / totalRevenue : 0;

  const grossMargin = kpi.totalRevenue > 0 ? ((kpi.totalRevenue - kpi.totalExpense) / kpi.totalRevenue) * 100 : 0;
  const netMargin = kpi.profitMargin;
  const expenseRatio = kpi.totalRevenue > 0 ? (kpi.totalExpense / kpi.totalRevenue) * 100 : 0;
  const revenueToExpenseRatio = kpi.totalExpense > 0 ? kpi.totalRevenue / kpi.totalExpense : 0;

  return {
    grossMargin: parseFloat(grossMargin.toFixed(1)),
    netMargin: parseFloat(netMargin.toFixed(1)),
    expenseRatio: parseFloat(expenseRatio.toFixed(1)),
    revenueToExpenseRatio: parseFloat(revenueToExpenseRatio.toFixed(2)),
    workingCapitalRatio: parseFloat(workingCapitalRatio.toFixed(2)),
    debtToEquityRatio: parseFloat(debtToEquityRatio.toFixed(2)),
  };
}

export function getKPIAlerts(month?: string, year?: number) {
  const kpi = getMonthlyKPIs(month, year);
  const ratios = getFinancialRatios(month, year);
  const operations = getOperations();
  const invoices = getInvoices();
  const alerts: Array<{
    id: string;
    type: "warning" | "danger" | "success";
    title: string;
    message: string;
    metric: string;
    threshold: number;
    currentValue: number;
  }> = [];

  // Profit margin alerts
  if (kpi.profitMargin < 0) {
    alerts.push({
      id: "alert-profit-negative",
      type: "danger",
      title: "Marge négative",
      message: `La marge bénéficiaire est de ${kpi.profitMargin.toFixed(1)}%. Les dépenses dépassent les revenus.`,
      metric: "Marge nette",
      threshold: 0,
      currentValue: kpi.profitMargin,
    });
  } else if (kpi.profitMargin < 10) {
    alerts.push({
      id: "alert-profit-low",
      type: "warning",
      title: "Marge faible",
      message: `La marge bénéficiaire de ${kpi.profitMargin.toFixed(1)}% est en dessous du seuil recommandé (10%).`,
      metric: "Marge nette",
      threshold: 10,
      currentValue: kpi.profitMargin,
    });
  } else {
    alerts.push({
      id: "alert-profit-good",
      type: "success",
      title: "Marge satisfaisante",
      message: `La marge bénéficiaire de ${kpi.profitMargin.toFixed(1)}% est bonne.`,
      metric: "Marge nette",
      threshold: 10,
      currentValue: kpi.profitMargin,
    });
  }

  // Expense ratio alerts
  if (ratios.expenseRatio > 90) {
    alerts.push({
      id: "alert-expense-high",
      type: "danger",
      title: "Ratio de dépenses élevé",
      message: `Les dépenses représentent ${ratios.expenseRatio.toFixed(1)}% des revenus.`,
      metric: "Ratio dépenses/revenus",
      threshold: 90,
      currentValue: ratios.expenseRatio,
    });
  } else if (ratios.expenseRatio > 70) {
    alerts.push({
      id: "alert-expense-warning",
      type: "warning",
      title: "Ratio de dépenses élevé",
      message: `Les dépenses représentent ${ratios.expenseRatio.toFixed(1)}% des revenus.`,
      metric: "Ratio dépenses/revenus",
      threshold: 70,
      currentValue: ratios.expenseRatio,
    });
  }

  // Overdue invoices alert
  const overdueInvoices = invoices.filter(
    (inv) => inv.status === "en_retard" || (inv.status === "envoyee" && new Date(inv.dueDate) < new Date())
  );
  if (overdueInvoices.length > 0) {
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);
    alerts.push({
      id: "alert-overdue",
      type: "warning",
      title: "Factures en retard",
      message: `${overdueInvoices.length} facture(s) en retard pour un total de ${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(overdueAmount)}`,
      metric: "Montant en retard",
      threshold: 0,
      currentValue: overdueAmount,
    });
  }

  // Cash flow alert
  const cashRegister = getCashRegister();
  if (cashRegister.closingBalance < 1000) {
    alerts.push({
      id: "alert-cash-low",
      type: "warning",
      title: "Solde de caisse faible",
      message: `Le solde de caisse est de ${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(cashRegister.closingBalance)}. Niveau critique.`,
      metric: "Solde de caisse",
      threshold: 1000,
      currentValue: cashRegister.closingBalance,
    });
  }

  return alerts;
}

export function getAnnualProjections() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  let ytdRevenue = 0;
  let ytdExpenses = 0;
  let monthsCount = 0;

  for (let i = 1; i <= currentMonth; i++) {
    const monthStr = String(i).padStart(2, "0");
    const kpi = getMonthlyKPIs(monthStr, currentYear);
    ytdRevenue += kpi.totalRevenue;
    ytdExpenses += kpi.totalExpense;
    if (kpi.operationCount > 0) monthsCount++;
  }

  const avgMonthlyRevenue = monthsCount > 0 ? ytdRevenue / monthsCount : 0;
  const avgMonthlyExpenses = monthsCount > 0 ? ytdExpenses / monthsCount : 0;
  const remainingMonths = 12 - currentMonth;

  const projectedRevenue = ytdRevenue + avgMonthlyRevenue * remainingMonths;
  const projectedExpenses = ytdExpenses + avgMonthlyExpenses * remainingMonths;
  const projectedProfit = projectedRevenue - projectedExpenses;
  const currentRunRate = avgMonthlyRevenue;

  return {
    projectedRevenue: parseFloat(projectedRevenue.toFixed(2)),
    projectedExpenses: parseFloat(projectedExpenses.toFixed(2)),
    projectedProfit: parseFloat(projectedProfit.toFixed(2)),
    currentRunRate: parseFloat(currentRunRate.toFixed(2)),
    projectedEndYearBalance: parseFloat(projectedProfit.toFixed(2)),
    ytdRevenue: parseFloat(ytdRevenue.toFixed(2)),
    ytdExpenses: parseFloat(ytdExpenses.toFixed(2)),
    ytdProfit: parseFloat((ytdRevenue - ytdExpenses).toFixed(2)),
  };
}

export function getLastYearComparison(currentMonth?: string, currentYear?: number) {
  const now = new Date();
  const month = currentMonth || String(now.getMonth() + 1).padStart(2, "0");
  const year = currentYear || now.getFullYear();

  const currentKpi = getMonthlyKPIs(month, year);
  const lastYear = year - 1;

  // Get same month last year
  const lastYearKpi = getMonthlyKPIs(month, lastYear);

  const revenueGrowth =
    lastYearKpi.totalRevenue > 0
      ? ((currentKpi.totalRevenue - lastYearKpi.totalRevenue) / lastYearKpi.totalRevenue) * 100
      : currentKpi.totalRevenue > 0
        ? 100
        : 0;

  const expenseGrowth =
    lastYearKpi.totalExpense > 0
      ? ((currentKpi.totalExpense - lastYearKpi.totalExpense) / lastYearKpi.totalExpense) * 100
      : currentKpi.totalExpense > 0
        ? 100
        : 0;

  const profitGrowth =
    lastYearKpi.netProfit !== 0
      ? ((currentKpi.netProfit - lastYearKpi.netProfit) / Math.abs(lastYearKpi.netProfit)) * 100
      : currentKpi.netProfit > 0
        ? 100
        : 0;

  return {
    currentMonth: currentKpi.monthLabel,
    lastYearMonth: lastYearKpi.monthLabel,
    currentRevenue: currentKpi.totalRevenue,
    lastYearRevenue: lastYearKpi.totalRevenue,
    currentExpense: currentKpi.totalExpense,
    lastYearExpense: lastYearKpi.totalExpense,
    currentProfit: currentKpi.netProfit,
    lastYearProfit: lastYearKpi.netProfit,
    revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
    expenseGrowth: parseFloat(expenseGrowth.toFixed(1)),
    profitGrowth: parseFloat(profitGrowth.toFixed(1)),
  };
}

export function getDetailedAnalysis(month?: string, year?: number) {
  const now = new Date();
  const targetMonth = month || String(now.getMonth() + 1).padStart(2, "0");
  const targetYear = year || now.getFullYear();

  // Get last 6 months KPIs
  const monthlyKPIs = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(targetYear, now.getMonth() - i, 1);
    const m = String(monthDate.getMonth() + 1).padStart(2, "0");
    const y = monthDate.getFullYear();
    monthlyKPIs.push(getMonthlyKPIs(m, y));
  }

  const categoryKPIs = getCategoryKPIs(targetMonth, targetYear);
  const ratios = getFinancialRatios(targetMonth, targetYear);
  const alerts = getKPIAlerts(targetMonth, targetYear);
  const projections = getAnnualProjections();
  const lastYearComparison = getLastYearComparison(targetMonth, targetYear);

  // Year to date
  let ytdRevenue = 0;
  let ytdExpenses = 0;

  for (let i = 1; i <= parseInt(targetMonth); i++) {
    const m = String(i).padStart(2, "0");
    const kpi = getMonthlyKPIs(m, targetYear);
    ytdRevenue += kpi.totalRevenue;
    ytdExpenses += kpi.totalExpense;
  }

  return {
    monthlyKPIs,
    categoryKPIs,
    ratios,
    alerts,
    projections,
    yearToDateRevenue: parseFloat(ytdRevenue.toFixed(2)),
    yearToDateExpenses: parseFloat(ytdExpenses.toFixed(2)),
    yearToDateProfit: parseFloat((ytdRevenue - ytdExpenses).toFixed(2)),
    lastYearComparison,
  };
}
