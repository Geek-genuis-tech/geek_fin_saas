"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { getBudgets, updateBudget, addBudget, deleteBudget, getMonthlyStats } from "@/lib/store";
import { CATEGORIES, type Budget as BudgetType } from "@/lib/types";
import type { CategoryType } from "@/lib/types";
import { Pencil, Trash2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function Budget() {
  const [budgets, setBudgets] = useState<BudgetType[]>(() => getBudgets());
  const [editingBudget, setEditingBudget] = useState<BudgetType | null>(null);
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newBudgetData, setNewBudgetData] = useState({
    category: "" as CategoryType,
    allocated: "",
    month: String(new Date().getMonth() + 1).padStart(2, "0"),
    year: new Date().getFullYear(),
  });

  const stats = useMemo(() => getMonthlyStats(), []);

  const totalAllocated = useMemo(() => budgets.reduce((sum, b) => sum + b.allocated, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((sum, b) => sum + b.spent, 0), [budgets]);
  const remainingBudget = totalAllocated - totalSpent;

  const chartData = useMemo(() => {
    return budgets.map((b) => ({
      name: CATEGORIES.find((c) => c.value === b.category)?.label || b.category,
      alloue: b.allocated,
      depense: b.spent,
      reste: Math.max(0, b.allocated - b.spent),
    }));
  }, [budgets]);

  const handleEditBudget = (budget: BudgetType) => {
    setEditingBudget(budget);
    setAllocatedAmount(budget.allocated.toString());
  };

  const handleSaveBudget = () => {
    if (editingBudget) {
      updateBudget(editingBudget.id, { allocated: Number.parseFloat(allocatedAmount) });
      setBudgets(getBudgets());
      setEditingBudget(null);
    }
  };

  const handleAddBudget = () => {
    if (newBudgetData.category && newBudgetData.allocated) {
      addBudget({
        category: newBudgetData.category,
        allocated: Number.parseFloat(newBudgetData.allocated),
        spent: 0,
        month: newBudgetData.month,
        year: newBudgetData.year,
      });
      setBudgets(getBudgets());
      setIsAddDialogOpen(false);
      setNewBudgetData({
        category: "" as CategoryType,
        allocated: "",
        month: String(new Date().getMonth() + 1).padStart(2, "0"),
        year: new Date().getFullYear(),
      });
    }
  };

  const handleDeleteBudget = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteBudget(deleteId);
      setBudgets(getBudgets());
      setDeleteId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const getProgressColor = (spent: number, allocated: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage >= 100) return "bg-destructive";
    if (percentage >= 80) return "bg-warning";
    return "bg-success";
  };

  const getStatusBadge = (spent: number, allocated: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage >= 100) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Dépassé
        </Badge>
      );
    }
    if (percentage >= 80) {
      return (
        <Badge className="bg-warning text-warning-foreground gap-1">
          <AlertTriangle className="h-3 w-3" />
          Attention
        </Badge>
      );
    }
    return (
      <Badge className="bg-success text-success-foreground gap-1">
        <CheckCircle2 className="h-3 w-3" />
        En règle
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion du Budget</h1>
          <p className="text-muted-foreground">
            Suivi des allocations et dépenses par catégorie - {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Total Alloué</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAllocated)}</div>
            <p className="text-xs text-muted-foreground">Pour le mois en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Dépensé</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalSpent)}</div>
            <Progress
              value={(totalSpent / totalAllocated) * 100}
              className="mt-2 h-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {((totalSpent / totalAllocated) * 100).toFixed(1)}% du budget utilisé
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Restant</CardTitle>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${remainingBudget >= 0 ? "bg-success/10" : "bg-destructive/10"}`}>
              {remainingBudget >= 0 ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-success" : "text-destructive"}`}>
              {formatCurrency(remainingBudget)}
            </div>
            <p className="text-xs text-muted-foreground">Disponible ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Comparaison Budget vs Dépenses</CardTitle>
          <CardDescription>Par catégorie de dépenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tickFormatter={(v) => `${v / 1000}k€`} className="text-xs" />
                <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="alloue" name="Budget alloué" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="depense" name="Dépensé" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Budget Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.allocated) * 100;
          const categoryLabel = CATEGORIES.find((c) => c.value === budget.category)?.label || budget.category;

          return (
            <Card key={budget.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{categoryLabel}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(budget.spent, budget.allocated)}
                    <Button variant="ghost" size="icon" onClick={() => handleEditBudget(budget)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(budget.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dépensé</span>
                    <span className="font-medium">{formatCurrency(budget.spent)}</span>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={`h-2 ${getProgressColor(budget.spent, budget.allocated)}`}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{formatCurrency(budget.allocated)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reste</span>
                    <span className={`font-semibold ${budget.allocated - budget.spent >= 0 ? "text-success" : "text-destructive"}`}>
                      {formatCurrency(budget.allocated - budget.spent)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Nouveau budget</DialogTitle>
            <DialogDescription>
              Créez un nouveau budget pour une catégorie
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="budget-category">Catégorie *</Label>
              <Select
                value={newBudgetData.category}
                onValueChange={(value) => setNewBudgetData({ ...newBudgetData, category: value as CategoryType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((cat) => !budgets.some((b) => b.category === cat.value)).map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget-allocated">Montant alloué (EUR) *</Label>
              <Input
                id="budget-allocated"
                type="number"
                step="100"
                min="0"
                placeholder="0"
                value={newBudgetData.allocated}
                onChange={(e) => setNewBudgetData({ ...newBudgetData, allocated: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget-month">Mois</Label>
              <Select
                value={newBudgetData.month}
                onValueChange={(value) => setNewBudgetData({ ...newBudgetData, month: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = String(i + 1).padStart(2, "0");
                    const monthName = new Date(2000, i, 1).toLocaleDateString("fr-FR", { month: "long" });
                    return (
                      <SelectItem key={month} value={month}>
                        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddBudget} disabled={!newBudgetData.category || !newBudgetData.allocated}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Modifier le budget</DialogTitle>
            <DialogDescription>
              Ajustez le montant alloué pour {editingBudget && CATEGORIES.find((c) => c.value === editingBudget.category)?.label}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="allocated">Montant alloué (EUR)</Label>
              <Input
                id="allocated"
                type="number"
                step="100"
                min="0"
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBudget(null)}>
              Annuler
            </Button>
            <Button onClick={handleSaveBudget}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce budget ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
