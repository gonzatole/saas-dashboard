import Link from "next/link";
import {
  CheckCircle2, Shield, Bot, ClipboardList, AlertTriangle,
  BarChart3, ArrowRight, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/stripe";

const features = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Gestión de Riesgos",
    description: "Administra áreas de trabajo, trabajadores y categorías de riesgo según la normativa Ley 16.744.",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: <ClipboardList className="h-6 w-6" />,
    title: "Inspecciones Digitales",
    description: "Crea checklists personalizados, registra hallazgos y genera acciones correctivas automáticas.",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: "Reporte de Incidentes",
    description: "Registra accidentes y casi-accidentes, investiga causas raíz y gestiona acciones correctivas.",
    color: "text-red-500 bg-red-500/10",
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "Asistente IA",
    description: "Análisis de incidentes, sugerencias de acciones correctivas y consultas sobre normativa chilena.",
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Analytics de Riesgos",
    description: "Tendencias mensuales, score de cumplimiento y KPIs de prevención para tu empresa.",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Cumplimiento Legal",
    description: "Documenta tu programa de prevención según DS 40, DS 594 y Ley 16.744 de manera automatizada.",
    color: "text-teal-500 bg-teal-500/10",
  },
];

const testimonials = [
  {
    name: "Rodrigo Fuentes",
    role: "Prevencionista, Constructora Sur",
    text: "RiskGuard AI me ahorra 10 horas semanales. Reportes que antes hacía en Excel ahora se generan en segundos.",
    rating: 5,
  },
  {
    name: "Valentina Mora",
    role: "RRHH, Empresa Minera Norte",
    text: "La IA nos ayudó a identificar patrones de riesgo que no veíamos. Redujimos los incidentes en un 30% en 3 meses.",
    rating: 5,
  },
  {
    name: "Ignacio Pinto",
    role: "Gerente Operaciones, Logística Central",
    text: "Por fin una herramienta de prevención diseñada para PYMEs. Simple, potente y en castellano.",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">RiskGuard AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {["Características", "Precios", "Normativa"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Iniciar sesión</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Comenzar gratis</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6">
          <Badge variant="outline" className="mb-6 text-primary border-primary/40">
            🇨🇱 Diseñado para la normativa chilena — Ley 16.744
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
            Prevención de riesgos{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              potenciada por IA
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            La plataforma SaaS que ayuda a las PYMEs chilenas a cumplir con la Ley 16.744,
            gestionar inspecciones, incidentes y reducir accidentes con inteligencia artificial.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Comenzar gratis <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="px-8">
                Ver demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            ✓ Sin tarjeta de crédito · ✓ Setup en 5 minutos · ✓ 10 trabajadores gratis
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Todo lo que necesitas para prevenir
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Desde la inspección hasta el análisis de causas raíz. RiskGuard AI cubre
              todo el ciclo de gestión de riesgos laborales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card
                key={f.title}
                className="hover:border-primary/50 transition-all hover:shadow-md hover:-translate-y-1"
              >
                <CardHeader>
                  <div className={`w-fit p-3 rounded-xl ${f.color} mb-2`}>{f.icon}</div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20" id="precios">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Precios pensados para PYMEs chilenas
            </h2>
            <p className="text-muted-foreground">Sin tarifas ocultas. Cancela cuando quieras.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(PLANS).map((plan) => {
              const isPopular = plan.id === "PRO";
              return (
                <Card
                  key={plan.id}
                  className={`relative ${isPopular ? "border-primary ring-1 ring-primary" : ""}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground text-xs px-3">
                        Más popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black">${plan.price}</span>
                      <span className="text-muted-foreground mb-1">/mes</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.id === "FREE" ? "/register" : "/register"}>
                      <Button
                        variant={isPopular ? "default" : "outline"}
                        className="w-full"
                      >
                        {plan.id === "FREE" ? "Comenzar gratis" : `Probar ${plan.name}`}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">
              Empresas chilenas que confían en RiskGuard AI
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="hover:border-primary/50 transition-all">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-amber-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Cumple con la Ley 16.744 desde hoy
          </h2>
          <p className="text-muted-foreground mb-8">
            Únete a empresas chilenas que ya protegen a sus trabajadores con RiskGuard AI.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-10">
              Comenzar gratis — sin tarjeta{" "}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">RiskGuard AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 RiskGuard AI. Construido con Next.js 16 · Para PYMEs chilenas bajo Ley 16.744
          </p>
        </div>
      </footer>
    </div>
  );
}
