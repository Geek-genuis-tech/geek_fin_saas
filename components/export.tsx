"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { getOperations, getEmployees, getBudgets, getMonthlyStats } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";
import { FileSpreadsheet, FileText, Download, Calendar, Filter } from "lucide-react";

export function Export() {
  const [exportType, setExportType] = useState<"operations" | "employees" | "budgets" | "report">("operations");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const exportToCSV = () => {
    setIsExporting(true);
    
    let csvContent = "";
    let filename = "";

    switch (exportType) {
      case "operations": {
        const operations = getOperations().filter((op) => {
          const matchesDateFrom = !dateFrom || op.date >= dateFrom;
          const matchesDateTo = !dateTo || op.date <= dateTo;
          return matchesDateFrom && matchesDateTo;
        });

        csvContent = "Date;Description;Type;Catégorie;Montant\n";
        operations.forEach((op) => {
          const categoryLabel = CATEGORIES.find((c) => c.value === op.category)?.label || op.category;
          csvContent += `${op.date};${op.description};${op.type === "revenu" ? "Revenu" : "Dépense"};${categoryLabel};${op.amount}\n`;
        });
        filename = `operations_${new Date().toISOString().split("T")[0]}.csv`;
        break;
      }

      case "employees": {
        const employees = getEmployees();
        csvContent = "Nom;Poste;Département;Email;Téléphone;Salaire;Date début;Statut\n";
        employees.forEach((emp) => {
          csvContent += `${emp.name};${emp.position};${emp.department};${emp.email};${emp.phone};${emp.salary};${emp.startDate};${emp.status}\n`;
        });
        filename = `employes_${new Date().toISOString().split("T")[0]}.csv`;
        break;
      }

      case "budgets": {
        const budgets = getBudgets();
        csvContent = "Catégorie;Budget Alloué;Dépensé;Reste;% Utilisé\n";
        budgets.forEach((b) => {
          const categoryLabel = CATEGORIES.find((c) => c.value === b.category)?.label || b.category;
          const remaining = b.allocated - b.spent;
          const percentage = ((b.spent / b.allocated) * 100).toFixed(1);
          csvContent += `${categoryLabel};${b.allocated};${b.spent};${remaining};${percentage}%\n`;
        });
        filename = `budgets_${new Date().toISOString().split("T")[0]}.csv`;
        break;
      }

      default:
        break;
    }

    // Download CSV
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    setTimeout(() => setIsExporting(false), 1000);
  };

  const exportToPDF = () => {
    setIsExporting(true);

    const stats = getMonthlyStats();
    const operations = getOperations().filter((op) => {
      const matchesDateFrom = !dateFrom || op.date >= dateFrom;
      const matchesDateTo = !dateTo || op.date <= dateTo;
      return matchesDateFrom && matchesDateTo;
    });

    // Create a printable HTML document
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setIsExporting(false);
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport GEEK-FIN</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a2e; }
          h1 { color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
          h2 { color: #1a1a2e; margin-top: 30px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
          .date { color: #666; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; }
          .stat-label { color: #666; font-size: 14px; }
          .stat-value { font-size: 24px; font-weight: bold; margin-top: 5px; }
          .positive { color: #10b981; }
          .negative { color: #ef4444; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
          th { background: #f9fafb; font-weight: 600; }
          tr:nth-child(even) { background: #f9fafb; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">GEEK-FIN</div>
          <div class="date">Rapport généré le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
        </div>
        
        <h1>Rapport Financier</h1>
        <p>Période: ${dateFrom || "Début"} - ${dateTo || "Aujourd'hui"}</p>
        
        <h2>Résumé</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Revenus</div>
            <div class="stat-value positive">${formatCurrency(stats.totalRevenu)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Dépenses</div>
            <div class="stat-value negative">${formatCurrency(stats.totalDepense)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Solde Net</div>
            <div class="stat-value ${stats.balance >= 0 ? "positive" : "negative"}">${formatCurrency(stats.balance)}</div>
          </div>
        </div>
        
        <h2>Détail des Opérations</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Catégorie</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            ${operations
              .map(
                (op) => `
              <tr>
                <td>${new Date(op.date).toLocaleDateString("fr-FR")}</td>
                <td>${op.description}</td>
                <td>${op.type === "revenu" ? "Revenu" : "Dépense"}</td>
                <td>${CATEGORIES.find((c) => c.value === op.category)?.label || op.category}</td>
                <td class="${op.type === "revenu" ? "positive" : "negative"}">${op.type === "revenu" ? "+" : "-"}${formatCurrency(op.amount)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Document généré automatiquement par GEEK-FIN - Application de Gestion Comptable</p>
          <p>© ${new Date().getFullYear()} GEEK-FIN. Tous droits réservés.</p>
        </div>
        
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Exports & Rapports</h1>
        <p className="text-muted-foreground">
          Exportez vos données au format Excel (CSV) ou PDF
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration de l'export</CardTitle>
            <CardDescription>Sélectionnez le type de données et la période</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Type de données</Label>
              <Select value={exportType} onValueChange={(v) => setExportType(v as typeof exportType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operations">Opérations financières</SelectItem>
                  <SelectItem value="employees">Liste des employés</SelectItem>
                  <SelectItem value="budgets">Suivi des budgets</SelectItem>
                  <SelectItem value="report">Rapport complet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(exportType === "operations" || exportType === "report") && (
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Période
                </Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom" className="text-sm text-muted-foreground">Du</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateTo" className="text-sm text-muted-foreground">Au</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {exportType === "report" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                />
                <Label htmlFor="includeCharts" className="text-sm">
                  Inclure les graphiques et statistiques
                </Label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions d'export</CardTitle>
            <CardDescription>Choisissez le format de sortie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <FileSpreadsheet className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Export Excel (CSV)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Format compatible avec Excel, Google Sheets et autres tableurs
                    </p>
                    <Button
                      className="mt-4"
                      onClick={exportToCSV}
                      disabled={isExporting || exportType === "report"}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isExporting ? "Export en cours..." : "Télécharger CSV"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Export PDF</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Rapport formaté prêt à imprimer ou partager
                    </p>
                    <Button
                      className="mt-4"
                      onClick={exportToPDF}
                      disabled={isExporting}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isExporting ? "Génération..." : "Générer PDF"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu des données</CardTitle>
          <CardDescription>
            {exportType === "operations" && "Aperçu des opérations financières à exporter"}
            {exportType === "employees" && "Aperçu de la liste des employés"}
            {exportType === "budgets" && "Aperçu du suivi budgétaire"}
            {exportType === "report" && "Le rapport inclura toutes les données ci-dessous"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {exportType === "operations" && (
            <div className="space-y-2">
              {getOperations()
                .filter((op) => {
                  const matchesDateFrom = !dateFrom || op.date >= dateFrom;
                  const matchesDateTo = !dateTo || op.date <= dateTo;
                  return matchesDateFrom && matchesDateTo;
                })
                .slice(0, 5)
                .map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{op.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(op.date).toLocaleDateString("fr-FR")} • {CATEGORIES.find((c) => c.value === op.category)?.label}
                      </p>
                    </div>
                    <span className={`font-semibold ${op.type === "revenu" ? "text-success" : "text-destructive"}`}>
                      {op.type === "revenu" ? "+" : "-"}{formatCurrency(op.amount)}
                    </span>
                  </div>
                ))}
              <p className="text-sm text-muted-foreground text-center pt-2">
                ... et {Math.max(0, getOperations().filter((op) => {
                  const matchesDateFrom = !dateFrom || op.date >= dateFrom;
                  const matchesDateTo = !dateTo || op.date <= dateTo;
                  return matchesDateFrom && matchesDateTo;
                }).length - 5)} autres opérations
              </p>
            </div>
          )}

          {exportType === "employees" && (
            <div className="space-y-2">
              {getEmployees().slice(0, 5).map((emp) => (
                <div key={emp.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {emp.position} • {emp.department}
                    </p>
                  </div>
                  <span className="font-semibold">{formatCurrency(emp.salary)}/mois</span>
                </div>
              ))}
            </div>
          )}

          {exportType === "budgets" && (
            <div className="space-y-2">
              {getBudgets().map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{CATEGORIES.find((c) => c.value === b.category)?.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(b.spent)} / {formatCurrency(b.allocated)}
                    </p>
                  </div>
                  <span className={`font-semibold ${b.spent <= b.allocated ? "text-success" : "text-destructive"}`}>
                    {((b.spent / b.allocated) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {exportType === "report" && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Le rapport complet inclura:</p>
              <ul className="mt-2 space-y-1">
                <li>Résumé des finances</li>
                <li>Détail des opérations</li>
                <li>Statistiques par catégorie</li>
                {includeCharts && <li>Graphiques et visualisations</li>}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
