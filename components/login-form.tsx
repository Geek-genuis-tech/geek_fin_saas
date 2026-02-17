"use client";

import React from "react"

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BarChart3, Shield, TrendingUp, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await login(username, password);
    if (!success) {
      setError("Identifiants incorrects. Veuillez réessayer.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar text-sidebar-foreground flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">GEEK-FIN</span>
          </div>
        </div>
        
        <div className="space-y-8">
          <h1 className="text-4xl font-bold leading-tight text-balance">
            Gérez vos finances avec simplicité et efficacité
          </h1>
          <p className="text-lg text-sidebar-foreground/70">
            Solution complète de gestion comptable pour PME : opérations, budgets, caisse et ressources humaines.
          </p>
          
          <div className="grid gap-6 pt-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Suivi en temps réel</h3>
                <p className="text-sm text-sidebar-foreground/60">Visualisez vos revenus et dépenses instantanément</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Sécurisé</h3>
                <p className="text-sm text-sidebar-foreground/60">Contrôle d'accès par rôles utilisateurs</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-sidebar-foreground/50">
          © 2026 GEEK-FIN. Tous droits réservés.
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">GEEK-FIN</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre espace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Compte de démonstration :</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-mono bg-background px-1 rounded">admin</span> / <span className="font-mono bg-background px-1 rounded">admin123</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
