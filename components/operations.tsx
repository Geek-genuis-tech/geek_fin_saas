"use client";

import React from "react"

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { getOperations, addOperation, updateOperation, deleteOperation } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { CATEGORIES, type Operation, type OperationType, type CategoryType } from "@/lib/types";
import { Plus, Pencil, Trash2, Search, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function Operations() {
  const { user } = useAuth();
  const [operations, setOperations] = useState<Operation[]>(() => getOperations());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<OperationType | "all">("all");
  const [filterCategory, setFilterCategory] = useState<CategoryType | "all">("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "revenu" as OperationType,
    category: "ventes" as CategoryType,
  });

  const filteredOperations = useMemo(() => {
    return operations.filter((op) => {
      const matchesSearch = op.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || op.type === filterType;
      const matchesCategory = filterCategory === "all" || op.category === filterCategory;
      const matchesDateFrom = !filterDateFrom || op.date >= filterDateFrom;
      const matchesDateTo = !filterDateTo || op.date <= filterDateTo;

      return matchesSearch && matchesType && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [operations, searchTerm, filterType, filterCategory, filterDateFrom, filterDateTo]);

  const sortedOperations = useMemo(() => {
    return [...filteredOperations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredOperations]);

  const handleOpenDialog = (operation?: Operation) => {
    if (operation) {
      setEditingOperation(operation);
      setFormData({
        date: operation.date,
        description: operation.description,
        amount: operation.amount.toString(),
        type: operation.type,
        category: operation.category,
      });
    } else {
      setEditingOperation(null);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        type: "revenu",
        category: "ventes",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOperation) {
      const updated = updateOperation(editingOperation.id, {
        ...formData,
        amount: Number.parseFloat(formData.amount),
      });
      if (updated) {
        setOperations(getOperations());
      }
    } else {
      addOperation({
        ...formData,
        amount: Number.parseFloat(formData.amount),
        createdBy: user?.id || "",
      });
      setOperations(getOperations());
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteOperation(deleteId);
      setOperations(getOperations());
      setDeleteId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCategory("all");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Opérations</h1>
          <p className="text-muted-foreground">Gérez vos revenus et dépenses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une opération
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingOperation ? "Modifier l'opération" : "Nouvelle opération"}
                </DialogTitle>
                <DialogDescription>
                  {editingOperation
                    ? "Modifiez les détails de l'opération"
                    : "Ajoutez une nouvelle transaction financière"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Vente produit X"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Montant (EUR)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as OperationType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenu">Revenu</SelectItem>
                      <SelectItem value="depense">Dépense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as CategoryType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingOperation ? "Enregistrer" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Filtres</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as OperationType | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="revenu">Revenu</SelectItem>
                <SelectItem value="depense">Dépense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as CategoryType | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="Du"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Au"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
              <Button variant="outline" size="icon" onClick={clearFilters} title="Effacer les filtres">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des opérations</CardTitle>
          <CardDescription>
            {filteredOperations.length} opération{filteredOperations.length > 1 ? "s" : ""} trouvée{filteredOperations.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOperations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucune opération trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedOperations.map((op) => (
                    <TableRow key={op.id}>
                      <TableCell className="font-medium">
                        {new Date(op.date).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>{op.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {CATEGORIES.find((c) => c.value === op.category)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {op.type === "revenu" ? (
                            <ArrowUpRight className="h-4 w-4 text-success" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-destructive" />
                          )}
                          <span className={op.type === "revenu" ? "text-success" : "text-destructive"}>
                            {op.type === "revenu" ? "Revenu" : "Dépense"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${op.type === "revenu" ? "text-success" : "text-destructive"}`}>
                        {op.type === "revenu" ? "+" : "-"}{formatCurrency(op.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(op)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(op.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette opération ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
