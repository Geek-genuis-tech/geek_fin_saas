"use client";

import React from "react"

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { Badge } from "@/components/ui/badge";
import { getCashRegister, addCashTransaction } from "@/lib/store";
import type { CashRegister as CashRegisterType, CashTransaction } from "@/lib/types";
import { Plus, Wallet, ArrowUpRight, ArrowDownRight, Clock, Calculator } from "lucide-react";

export function Caisse() {
  const [cashRegister, setCashRegister] = useState<CashRegisterType>(() => getCashRegister());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    time: new Date().toTimeString().slice(0, 5),
    description: "",
    amount: "",
    type: "entree" as "entree" | "sortie",
  });

  const totalEntrees = useMemo(() => {
    return cashRegister.transactions
      .filter((t) => t.type === "entree")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [cashRegister]);

  const totalSorties = useMemo(() => {
    return cashRegister.transactions
      .filter((t) => t.type === "sortie")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [cashRegister]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updated = addCashTransaction({
      time: formData.time,
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      type: formData.type,
    });
    
    setCashRegister(updated);
    setIsDialogOpen(false);
    setFormData({
      time: new Date().toTimeString().slice(0, 5),
      description: "",
      amount: "",
      type: "entree",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion de Caisse</h1>
          <p className="text-muted-foreground">
            Suivi des entrées et sorties - {new Date(cashRegister.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Nouvelle transaction</DialogTitle>
                <DialogDescription>
                  Enregistrez une entrée ou sortie de caisse
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Vente comptant"
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
                    onValueChange={(value) => setFormData({ ...formData, type: value as "entree" | "sortie" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entree">Entrée</SelectItem>
                      <SelectItem value="sortie">Sortie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ouverture</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(cashRegister.openingBalance)}</div>
            <p className="text-xs text-muted-foreground">Solde initial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Entrées</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalEntrees)}</div>
            <p className="text-xs text-muted-foreground">
              {cashRegister.transactions.filter((t) => t.type === "entree").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sorties</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalSorties)}</div>
            <p className="text-xs text-muted-foreground">
              {cashRegister.transactions.filter((t) => t.type === "sortie").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Solde Actuel</CardTitle>
            <Wallet className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(cashRegister.closingBalance)}</div>
            <p className="text-xs text-primary-foreground/60">En caisse</p>
          </CardContent>
        </Card>
      </div>

      {/* Calculator summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Récapitulatif</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-8">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ouverture</p>
              <p className="text-lg font-semibold">{formatCurrency(cashRegister.openingBalance)}</p>
            </div>
            <div className="flex items-center text-2xl text-muted-foreground">+</div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Entrées</p>
              <p className="text-lg font-semibold text-success">{formatCurrency(totalEntrees)}</p>
            </div>
            <div className="flex items-center text-2xl text-muted-foreground">-</div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Sorties</p>
              <p className="text-lg font-semibold text-destructive">{formatCurrency(totalSorties)}</p>
            </div>
            <div className="flex items-center text-2xl text-muted-foreground">=</div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Solde</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(cashRegister.closingBalance)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions du jour</CardTitle>
          <CardDescription>
            Historique chronologique des mouvements de caisse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Heure</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashRegister.transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Aucune transaction enregistrée
                    </TableCell>
                  </TableRow>
                ) : (
                  cashRegister.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono">{transaction.time}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "entree" ? "default" : "secondary"} className={transaction.type === "entree" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                          {transaction.type === "entree" ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {transaction.type === "entree" ? "Entrée" : "Sortie"}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${transaction.type === "entree" ? "text-success" : "text-destructive"}`}>
                        {transaction.type === "entree" ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>




    </div>
  );
}
