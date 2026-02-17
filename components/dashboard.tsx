"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOperations, getMonthlyStats } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function Dashboard() {
  const stats = useMemo(() => getMonthlyStats(), []);
  const operations = useMemo(() => getOperations(), []);

  // Generate last 6 months data for area chart
  const monthlyData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const monthStats = getMonthlyStats(month, year);
      
      data.push({
        name: date.toLocaleDateString("fr-FR", { month: "short" }),
        revenus: monthStats.totalRevenu,
        depenses: monthStats.totalDepense,
      });
    }
    
    return data;
  }, []);

  // Category distribution for pie chart
  const categoryData = useMemo(() => {
    const data: { name: string; value: number }[] = [];
    
    for (const [category, values] of Object.entries(stats.byCategory)) {
      const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label || category;
      if (values.depense > 0) {
        data.push({ name: categoryLabel, value: values.depense });
      }
    }
    
    return data.sort((a, b) => b.value - a.value).slice(0, 5);
  }, [stats]);

  // Recent operations
  const recentOperations = useMemo(() => {
    return [...operations]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [operations]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de vos finances - {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenus du mois</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(stats.totalRevenu)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-success" />
              <span>+12% vs mois dernier</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dépenses du mois</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(stats.totalDepense)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-3 w-3 text-destructive" />
              <span>-5% vs mois dernier</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Solde</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.balance >= 0 ? "text-success" : "text-destructive"}`}>
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Résultat net du mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opérations</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.operationsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Transactions ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Area Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Évolution sur 6 mois</CardTitle>
            <CardDescription>Comparaison des revenus et dépenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenus"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorRevenus)"
                    name="Revenus"
                  />
                  <Area
                    type="monotone"
                    dataKey="depenses"
                    stroke="hsl(var(--chart-3))"
                    fillOpacity={1}
                    fill="url(#colorDepenses)"
                    name="Dépenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Répartition des dépenses</CardTitle>
            <CardDescription>Par catégorie ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
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
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Opérations récentes</CardTitle>
          <CardDescription>Les 5 dernières transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOperations.map((op) => (
              <div
                key={op.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      op.type === "revenu" ? "bg-success/10" : "bg-destructive/10"
                    }`}
                  >
                    {op.type === "revenu" ? (
                      <ArrowUpRight className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{op.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(op.date).toLocaleDateString("fr-FR")} • {CATEGORIES.find((c) => c.value === op.category)?.label}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-semibold ${
                    op.type === "revenu" ? "text-success" : "text-destructive"
                  }`}
                >
                  {op.type === "revenu" ? "+" : "-"}{formatCurrency(op.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
