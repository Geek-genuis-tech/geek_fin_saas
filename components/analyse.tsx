"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getMonthlyKPIs,
  getCategoryKPIs,
  getFinancialRatios,
  getKPIAlerts,
  getAnnualProjections,
  getLastYearComparison,
  getDetailedAnalysis,
} from "@/lib/store";
import { CATEGORIES } from "@/lib/types";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Target,
  Activity,
  Wallet,
  Minus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Line,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const ALERT_COLORS = {
  danger: "bg-destructive/10 border-destructive/20 text-destructive",
  warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  success: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
};

export function Analyse() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const analysis = useMemo(() => getDetailedAnalysis(selectedMonth, selectedYear), [selectedMonth, selectedYear]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("fr-FR").format(value);
  };

const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Prepare chart data
  const evolutionData = useMemo(() => {
    return analysis.monthlyKPIs.map((kpi) => ({
      name: new Date(kpi.year, parseInt(kpi.month) - 1, 1).toLocaleDateString("fr-FR", { month: "short" }),
      revenus: kpi.totalRevenue,
      depenses: kpi.totalExpense,
      profit: kpi.netProfit,
      marge: kpi.profitMargin,
    }));
  }, [analysis.monthlyKPIs]);

  const categoryChartData = useMemo(() => {
    return analysis.categoryKPIs.map((cat) => ({
      name: cat.label,
      value: cat.revenue + cat.expense,
      revenue: cat.revenue,
      expense: cat.expense,
    }));
  }, [analysis.categoryKPIs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analyse Financière</h1>
          <p className="text-muted-foreground">
            KPIs avancés et indicateurs de performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, "0");
                const date = new Date(2024, i, 1);
                return (
                  <SelectItem key={month} value={month}>
                    {date.toLocaleDateString("fr-FR", { month: "long" })}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => setSelectedYear(parseInt(v))}
          >
            <SelectTrigger className="w-100">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards Row 1 - Core Financials */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Chiffre d'affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analysis.monthlyKPIs[analysis.monthlyKPIs.length - 1]?.totalRevenue || 0)}</div>
            <div className="flex items-center gap-1 text-xs">
              {analysis.lastYearComparison.revenueGrowth >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">{formatPercent(analysis.lastYearComparison.revenueGrowth)}</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">{formatPercent(analysis.lastYearComparison.revenueGrowth)}</span>
                </>
              )}
              <span className="text-muted-foreground">vs N-1</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Marge nette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercent(analysis.monthlyKPIs[analysis.monthlyKPIs.length - 1]?.profitMargin || 0)}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {(analysis.monthlyKPIs[analysis.monthlyKPIs.length - 1]?.profitMargin || 0) >= 10 ? (
                <Badge variant="outline" className="text-green-500 border-green-500">Bonne</Badge>
              ) : (analysis.monthlyKPIs[analysis.monthlyKPIs.length - 1]?.profitMargin || 0) >= 0 ? (
                <Badge variant="outline" className="text-yellow-500 border-yellow-500">Moyenne</Badge>
              ) : (
                <Badge variant="outline" className="text-red-500 border-red-500">Négative</Badge>
              )}
              <span className="text-muted-foreground">seuil: 10%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Profit net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(analysis.monthlyKPIs[analysis.monthlyKPIs.length - 1]?.netProfit || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(analysis.monthlyKPIs[analysis.monthlyKPIs.length - 1]?.netProfit || 0)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{analysis.monthlyKPIs[analysis.monthlyKPIs.length - 1]?.operationCount || 0} transactions</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Ratio Revenus/Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.ratios.revenueToExpenseRatio.toFixed(2)}x</div>
            <div className="flex items-center gap-1 text-xs">
              <span className={analysis.ratios.expenseRatio > 90 ? "text-red-500" : analysis.ratios.expenseRatio > 70 ? "text-yellow-500" : "text-green-500"}>
                {analysis.ratios.expenseRatio.toFixed(0)}% des revenus
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Ratios Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ratios Financiers
          </CardTitle>
          <CardDescription>Indicateurs clés de performance financière</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Marge Brute</span>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{analysis.ratios.grossMargin.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">
                {(analysis.ratios.grossMargin >= 30) ? "excellent" : (analysis.ratios.grossMargin >= 20) ? "bon" : "à améliorer"}
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Marge Nette</span>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{analysis.ratios.netMargin.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">
                {(analysis.ratios.netMargin >= 10) ? "rentable" : (analysis.ratios.netMargin >= 0) ? "équilibré" : "déficitaire"}
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Fonds de Roulement</span>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{analysis.ratios.workingCapitalRatio.toFixed(1)}x</div>
              <div className="text-xs text-muted-foreground">
                {(analysis.ratios.workingCapitalRatio >= 3) ? "solide" : (analysis.ratios.workingCapitalRatio >= 1) ? "correct" : "tendu"}
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Ratio d'Endettement</span>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{analysis.ratios.debtToEquityRatio.toFixed(2)}x</div>
              <div className="text-xs text-muted-foreground">
                {(analysis.ratios.debtToEquityRatio <= 0.5) ? "faible" : (analysis.ratios.debtToEquityRatio <= 1) ? "modéré" : "élevé"}
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Ratio de Dépenses</span>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{analysis.ratios.expenseRatio.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">
                {(analysis.ratios.expenseRatio <= 70) ? "contrôlé" : (analysis.ratios.expenseRatio <= 90) ? "attention" : "critique"}
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Année en cours</span>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.yearToDateProfit)}</div>
              <div className="text-xs text-muted-foreground">
                YTD: {formatCurrency(analysis.yearToDateRevenue)} / {formatCurrency(analysis.yearToDateExpenses)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different analysis views */}
      <Tabs defaultValue="evolution" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
          <TabsTrigger value="categories">Par Catégorie</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Financière</CardTitle>
              <CardDescription>Revenus, dépenses et profit sur les 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-100">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={evolutionData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenus"
                      stroke="hsl(var(--chart-2))"
                      fill="url(#colorRevenue)"
                      name="Revenus"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="hsl(var(--chart-1))"
                      fill="url(#colorProfit)"
                      name="Profit"
                      fillOpacity={0.5}
                    />
                    <Bar dataKey="depenses" fill="hsl(var(--chart-3))" name="Dépenses" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="marge" stroke="hsl(var(--chart-4))" name="Marge %" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Catégorie</CardTitle>
                <CardDescription>Distribution des revenus et dépenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-87.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance par Catégorie</CardTitle>
                <CardDescription>Tendance et répartition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.categoryKPIs.slice(0, 6).map((cat, index) => (
                    <div key={cat.category} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium">{cat.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(cat.revenue + cat.expense)} ({cat.percentageOfTotal}% du total)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-500">+{formatCurrency(cat.revenue)}</p>
                          <p className="text-xs text-red-500">-{formatCurrency(cat.expense)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(cat.trend)}
                          <span className={`text-xs font-medium ${
                            cat.trend === "up" ? "text-green-500" : cat.trend === "down" ? "text-red-500" : "text-gray-500"
                          }`}>
                            {cat.trendValue > 0 ? "+" : ""}{cat.trendValue.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison N vs N-1</CardTitle>
              <CardDescription>
                {analysis.lastYearComparison.currentMonth} vs {analysis.lastYearComparison.lastYearMonth}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-lg border text-center">
                  <p className="text-sm text-muted-foreground mb-2">Revenus</p>
                  <div className="text-3xl font-bold mb-2">
                    {formatCurrency(analysis.lastYearComparison.currentRevenue)}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {analysis.lastYearComparison.revenueGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`font-medium ${analysis.lastYearComparison.revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {formatPercent(analysis.lastYearComparison.revenueGrowth)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    vs {formatCurrency(analysis.lastYearComparison.lastYearRevenue)}
                  </p>
                </div>

                <div className="p-6 rounded-lg border text-center">
                  <p className="text-sm text-muted-foreground mb-2">Dépenses</p>
                  <div className="text-3xl font-bold mb-2">
                    {formatCurrency(analysis.lastYearComparison.currentExpense)}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {analysis.lastYearComparison.expenseGrowth <= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`font-medium ${analysis.lastYearComparison.expenseGrowth <= 0 ? "text-green-500" : "text-red-500"}`}>
                      {formatPercent(analysis.lastYearComparison.expenseGrowth)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    vs {formatCurrency(analysis.lastYearComparison.lastYearExpense)}
                  </p>
                </div>

                <div className="p-6 rounded-lg border text-center">
                  <p className="text-sm text-muted-foreground mb-2">Profit</p>
                  <div className={`text-3xl font-bold mb-2 ${analysis.lastYearComparison.currentProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {formatCurrency(analysis.lastYearComparison.currentProfit)}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {analysis.lastYearComparison.profitGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`font-medium ${analysis.lastYearComparison.profitGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {formatPercent(analysis.lastYearComparison.profitGrowth)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    vs {formatCurrency(analysis.lastYearComparison.lastYearProfit)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Projections Annuelles</CardTitle>
                <CardDescription>Estimation de fin d'année</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Revenus projetés</span>
                    <span className="text-xl font-bold text-green-500">
                      {formatCurrency(analysis.projections.projectedRevenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Dépenses projetées</span>
                    <span className="text-xl font-bold text-red-500">
                      {formatCurrency(analysis.projections.projectedExpenses)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-sm font-medium">Profit projeté</span>
                    <span className={`text-xl font-bold ${analysis.projections.projectedProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {formatCurrency(analysis.projections.projectedProfit)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Run rate actuel</span>
                    <span className="text-lg font-medium">
                      {formatCurrency(analysis.projections.currentRunRate)}/mois
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Année en Cours (YTD)</CardTitle>
                <CardDescription>Données cumulées à ce jour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Revenus YTD</span>
                    <span className="text-xl font-bold text-green-500">
                      {formatCurrency(analysis.yearToDateRevenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Dépenses YTD</span>
                    <span className="text-xl font-bold text-red-500">
                      {formatCurrency(analysis.yearToDateExpenses)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-sm font-medium">Profit YTD</span>
                    <span className={`text-xl font-bold ${analysis.yearToDateProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {formatCurrency(analysis.yearToDateProfit)}
                    </span>
                  </div>
                  <div className="h-25">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "YTD", revenue: analysis.yearToDateRevenue, expense: analysis.yearToDateExpenses },
                          { name: "Proj", revenue: analysis.projections.projectedRevenue, expense: analysis.projections.projectedExpenses },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="hsl(var(--chart-2))" name="Revenus" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="hsl(var(--chart-3))" name="Dépenses" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertes et Indicateurs
          </CardTitle>
          <CardDescription>Surveillance automatique des seuils financiers</CardDescription>
        </CardHeader>
        <CardContent>
          {analysis.alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="font-medium">Aucune alerte active</p>
              <p className="text-sm text-muted-foreground">Tous les indicateurs sont dans les normes</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {analysis.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${ALERT_COLORS[alert.type]}`}
                >
                  <div className="flex items-start gap-3">
                    {alert.type === "danger" && <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />}
                    {alert.type === "warning" && <Info className="h-5 w-5 shrink-0 mt-0.5" />}
                    {alert.type === "success" && <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm mt-1 opacity-80">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span>{alert.metric}: {alert.currentValue.toFixed(1)}</span>
                        <span>Seuil: {alert.threshold}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

