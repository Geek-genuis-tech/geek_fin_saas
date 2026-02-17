"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getClients,
  getInvoices,
  addClient,
  updateClient,
  deleteClient,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceStats,
} from "@/lib/store";
import type { Client, Invoice, InvoiceItem, InvoiceStatus } from "@/lib/types";
import { INVOICE_STATUS_LABELS } from "@/lib/types";
import {
  Plus,
  FileText,
  Users,
  Trash2,
  Edit,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Printer,
  Building,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Facturation() {
  const [clients, setClients] = useState<Client[]>(() => getClients());
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInvoices());
  const [activeTab, setActiveTab] = useState("invoices");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [clientFormData, setClientFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  });

  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);
  const [invoiceFormData, setInvoiceFormData] = useState({
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    taxRate: 20,
    notes: "",
  });
  const [invoiceItems, setInvoiceItems] = useState<Omit<InvoiceItem, "id">[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const stats = useMemo(() => getInvoiceStats(), [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [invoices, statusFilter, searchQuery]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const variants: Record<InvoiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
      brouillon: "secondary",
      envoyee: "default",
      payee: "default",
      en_retard: "destructive",
      annulee: "outline",
    };

    const icons: Record<InvoiceStatus, React.ReactNode> = {
      brouillon: <Edit className="h-3 w-3 mr-1" />,
      envoyee: <Send className="h-3 w-3 mr-1" />,
      payee: <CheckCircle className="h-3 w-3 mr-1" />,
      en_retard: <AlertTriangle className="h-3 w-3 mr-1" />,
      annulee: <XCircle className="h-3 w-3 mr-1" />,
    };

    const colors: Record<InvoiceStatus, string> = {
      brouillon: "bg-gray-500",
      envoyee: "bg-blue-500",
      payee: "bg-green-500",
      en_retard: "bg-red-500",
      annulee: "bg-gray-400",
    };

    return (
      <Badge variant={variants[status]} className={`${colors[status]} text-white gap-1`}>
        {icons[status]}
        {INVOICE_STATUS_LABELS[status]}
      </Badge>
    );
  };

  // Client CRUD
  const handleOpenClientDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setClientFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        company: client.company || "",
      });
    } else {
      setEditingClient(null);
      setClientFormData({ name: "", email: "", phone: "", address: "", company: "" });
    }
    setIsClientDialogOpen(true);
  };

  const handleSubmitClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient.id, clientFormData);
    } else {
      addClient(clientFormData);
    }
    setClients(getClients());
    setIsClientDialogOpen(false);
  };

  const handleConfirmDeleteClient = () => {
    if (deleteClientId) {
      deleteClient(deleteClientId);
      setClients(getClients());
      setDeleteClientId(null);
    }
  };

  // Invoice CRUD
  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setInvoiceFormData({
      clientId: clients[0]?.id || "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      taxRate: 20,
      notes: "",
    });
    setInvoiceItems([{ description: "", quantity: 1, unitPrice: 0 }]);
    setIsInvoiceDialogOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setInvoiceFormData({
      clientId: invoice.clientId,
      date: invoice.date,
      dueDate: invoice.dueDate,
      taxRate: invoice.taxRate,
      notes: invoice.notes || "",
    });
    setInvoiceItems(invoice.items.map(({ id, ...item }) => item));
    setIsInvoiceDialogOpen(true);
  };

  const calculateInvoiceTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = (subtotal * invoiceFormData.taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSaveInvoice = () => {
    const { subtotal, taxAmount, total } = calculateInvoiceTotals();
    const client = clients.find((c) => c.id === invoiceFormData.clientId);

    if (!client) return;

    const invoiceData = {
      clientId: invoiceFormData.clientId,
      clientName: client.name,
      date: invoiceFormData.date,
      dueDate: invoiceFormData.dueDate,
      items: invoiceItems.map((item) => ({ ...item, id: Date.now().toString() + Math.random() })),
      subtotal,
      taxRate: invoiceFormData.taxRate,
      taxAmount,
      total,
      status: "brouillon" as InvoiceStatus,
      notes: invoiceFormData.notes,
    };

    if (editingInvoice) {
      updateInvoice(editingInvoice.id, invoiceData);
    } else {
      addInvoice(invoiceData);
    }
    setInvoices(getInvoices());
    setIsInvoiceDialogOpen(false);
  };

  const handleDeleteInvoice = () => {
    if (deleteInvoiceId) {
      deleteInvoice(deleteInvoiceId);
      setInvoices(getInvoices());
      setDeleteInvoiceId(null);
    }
  };

  const handleStatusChange = (id: string, newStatus: InvoiceStatus) => {
    updateInvoice(id, { status: newStatus });
    setInvoices(getInvoices());
  };

  // Item management
  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const updateInvoiceItem = (index: number, field: keyof Omit<InvoiceItem, "id">, value: string | number) => {
    const newItems = [...invoiceItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceItems(newItems);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Facturation</h1>
          <p className="text-muted-foreground">
            Gestion des clients et des factures
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => handleOpenClientDialog()}>
                <Users className="mr-2 h-4 w-4" />
                Nouveau client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
              <form onSubmit={handleSubmitClient}>
                <DialogHeader>
                  <DialogTitle>{editingClient ? "Modifier le client" : "Nouveau client"}</DialogTitle>
                  <DialogDescription>
                    {editingClient ? "Mettez à jour les informations du client" : "Ajoutez un nouveau client"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client-name">Nom complet *</Label>
                    <Input
                      id="client-name"
                      value={clientFormData.name}
                      onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })}
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="client-company">Entreprise</Label>
                    <Input
                      id="client-company"
                      value={clientFormData.company}
                      onChange={(e) => setClientFormData({ ...clientFormData, company: e.target.value })}
                      placeholder="Société ABC"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="client-email">Email *</Label>
                    <Input
                      id="client-email"
                      type="email"
                      value={clientFormData.email}
                      onChange={(e) => setClientFormData({ ...clientFormData, email: e.target.value })}
                      placeholder="jean@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="client-phone">Téléphone *</Label>
                    <Input
                      id="client-phone"
                      value={clientFormData.phone}
                      onChange={(e) => setClientFormData({ ...clientFormData, phone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="client-address">Adresse *</Label>
                    <Textarea
                      id="client-address"
                      value={clientFormData.address}
                      onChange={(e) => setClientFormData({ ...clientFormData, address: e.target.value })}
                      placeholder="123 Rue Example, 75001 Paris"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsClientDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={!clientFormData.name || !clientFormData.email}>
                    Enregistrer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddInvoice}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle facture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingInvoice ? "Modifier la facture" : "Nouvelle facture"}</DialogTitle>
                <DialogDescription>
                  {editingInvoice ? `Édition de ${editingInvoice.invoiceNumber}` : "Créez une nouvelle facture"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Client and Dates */}
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="lg:col-span-1 grid gap-2">
                    <Label htmlFor="invoice-client">Client *</Label>
                    <Select
                      value={invoiceFormData.clientId}
                      onValueChange={(value) => setInvoiceFormData({ ...invoiceFormData, clientId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} {client.company && `(${client.company})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="invoice-date">Date *</Label>
                    <Input
                      id="invoice-date"
                      type="date"
                      value={invoiceFormData.date}
                      onChange={(e) => setInvoiceFormData({ ...invoiceFormData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="invoice-due-date">Date d'échéance *</Label>
                    <Input
                      id="invoice-due-date"
                      type="date"
                      value={invoiceFormData.dueDate}
                      onChange={(e) => setInvoiceFormData({ ...invoiceFormData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Articles</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter un article
                    </Button>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="flex-1">Description</TableHead>
                          <TableHead className="w-25">Quantité</TableHead>
                          <TableHead className="w-30">Prix unitaire</TableHead>
                          <TableHead className="w-30 text-right">Total</TableHead>
                          <TableHead className="w-12.5"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoiceItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Input
                                value={item.description}
                                onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                                placeholder="Description de l'article"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateInvoiceItem(index, "quantity", parseInt(e.target.value) || 1)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => updateInvoiceItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </TableCell>
                            <TableCell>
                              {invoiceItems.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeInvoiceItem(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-75 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{formatCurrency(calculateInvoiceTotals().subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground">TVA (%)</span>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        className="w-20 text-right"
                        value={invoiceFormData.taxRate}
                        onChange={(e) => setInvoiceFormData({ ...invoiceFormData, taxRate: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Montant TVA</span>
                      <span>{formatCurrency(calculateInvoiceTotals().taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(calculateInvoiceTotals().total)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="grid gap-2">
                  <Label htmlFor="invoice-notes">Notes</Label>
                  <Textarea
                    id="invoice-notes"
                    value={invoiceFormData.notes}
                    onChange={(e) => setInvoiceFormData({ ...invoiceFormData, notes: e.target.value })}
                    placeholder="Conditions de paiement, notes diverses..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveInvoice}
                  disabled={!invoiceFormData.clientId || !invoiceFormData.dueDate || invoiceItems.every((i) => !i.description)}
                >
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Factures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.totalAmount)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payées</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.paidCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.paidAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.pendingAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En retard</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdueCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.overdueAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Factures
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clients
          </TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro ou client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="envoyee">Envoyée</SelectItem>
                <SelectItem value="payee">Payée</SelectItem>
                <SelectItem value="en_retard">En retard</SelectItem>
                <SelectItem value="annulee">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoices Table */}
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-35">Numéro</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead className="w-30">Date</TableHead>
                      <TableHead className="w-30">Échéance</TableHead>
                      <TableHead className="text-right w-30">Montant</TableHead>
                      <TableHead className="w-35">Statut</TableHead>
                      <TableHead className="w-25 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Aucune facture trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.clientName}</TableCell>
                          <TableCell>{new Date(invoice.date).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell>{new Date(invoice.dueDate).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(invoice.total)}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEditInvoice(invoice)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Modifier</span>
                              </Button>
                              <Select
                                value={invoice.status}
                                onValueChange={(value) => handleStatusChange(invoice.id, value as InvoiceStatus)}
                              >
                                <SelectTrigger className="h-8 w-8 p-0 border-0">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent align="end">
                                  <SelectItem value="brouillon">Brouillon</SelectItem>
                                  <SelectItem value="envoyee">Envoyée</SelectItem>
                                  <SelectItem value="payee">Payée</SelectItem>
                                  <SelectItem value="en_retard">En retard</SelectItem>
                                  <SelectItem value="annulee">Annulée</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteInvoiceId(invoice.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        {client.company && (
                          <p className="text-sm text-muted-foreground">{client.company}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenClientDialog(client)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteClientId(client.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.address}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialogs */}
      <AlertDialog open={!!deleteClientId} onOpenChange={() => setDeleteClientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteClient} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteInvoiceId} onOpenChange={() => setDeleteInvoiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

