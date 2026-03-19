import Link from 'next/link';
import { CheckCircle2, BarChart3, Users, Package, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Landing marketing del SaaS — Server Component (sin "use client")

const features = [
  { icon: <BarChart3 className="h-6 w-6" />, title: 'Analytics Avanzado', description: 'Visualiza ingresos, visitas y conversiones con gráficos interactivos en tiempo real.', color: 'text-blue-500 bg-blue-500/10' },
  { icon: <Users className="h-6 w-6" />, title: 'Gestión de Clientes', description: 'Administra tu base de clientes, planes de suscripción y seguimiento de churn.', color: 'text-violet-500 bg-violet-500/10' },
  { icon: <Package className="h-6 w-6" />, title: 'Catálogo de Productos', description: 'Crea, edita y archiva productos con filtros por categoría y estado.', color: 'text-emerald-500 bg-emerald-500/10' },
  { icon: <Zap className="h-6 w-6" />, title: 'Integraciones', description: 'Conecta con Stripe, Slack, GitHub, Zapier y más con un solo clic.', color: 'text-amber-500 bg-amber-500/10' },
];

const testimonials = [
  { name: 'María González', role: 'CEO, StartupTech', text: 'Implementamos SaaSPro en 2 días. El ROI fue inmediato — reducimos 15h semanales de trabajo manual.', rating: 5 },
  { name: 'Carlos Rodríguez', role: 'CTO, DataVision', text: 'Los analytics son increíbles. Por fin tenemos visibilidad real del rendimiento del negocio en tiempo real.', rating: 5 },
  { name: 'Ana Martínez', role: 'PM, EcommercePro', text: 'La mejor inversión del año. Nuestro equipo lo adoptó en horas, sin curva de aprendizaje.', rating: 5 },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Para proyectos personales y pruebas',
    features: ['5 productos', '100 clientes', '1 usuario', 'Analytics básico'],
    cta: 'Comenzar gratis',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'Para equipos y startups en crecimiento',
    features: ['50 productos', '1,000 clientes', '5 usuarios', 'Analytics avanzado', 'Soporte prioritario', 'Integraciones'],
    cta: 'Comenzar prueba gratis',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    description: 'Para empresas con necesidades críticas',
    features: ['Todo ilimitado', 'Usuarios ilimitados', 'Analytics premium', 'Soporte dedicado 24/7', 'SLA garantizado', 'Onboarding personalizado'],
    cta: 'Contactar ventas',
    popular: false,
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
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">SaaSPro</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['Características', 'Precios', 'Documentación'].map((item) => (
              <a key={item} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Iniciar sesión</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Probar demo</Button>
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
            🚀 Versión 2.0 disponible — Más rápido que nunca
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
            El Dashboard que{' '}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              escala con tu negocio
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Analytics, gestión de productos y clientes, facturación con Stripe y más de 20 integraciones.
            Todo lo que necesitas para operar tu SaaS.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                Ver demo en vivo <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8">
              Ver características
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            ✓ 14 días de prueba gratuita · ✓ Sin tarjeta de crédito · ✓ Setup en 5 minutos
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Todo lo que necesitas</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Una plataforma completa para gestionar y hacer crecer tu negocio SaaS.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="hover:border-primary/50 transition-all hover:shadow-md hover:-translate-y-1">
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
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Precios simples y transparentes</h2>
            <p className="text-muted-foreground">Sin tarifas ocultas. Cancela cuando quieras.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary ring-1 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs px-3">Más popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground mb-1">/mes</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
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
                  <Link href={plan.popular ? '/register' : '/dashboard'}>
                    <Button variant={plan.popular ? 'default' : 'outline'} className="w-full">
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">Empresas que confían en SaaSPro</h2>
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
                  <p className="text-sm text-muted-foreground italic">&ldquo;{t.text}&rdquo;</p>
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
            Listo para escalar tu negocio?
          </h2>
          <p className="text-muted-foreground mb-8">
            Únete a más de 500 empresas que ya usan SaaSPro para gestionar su crecimiento.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="px-10">
              Comenzar ahora — es gratis <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">SaaSPro</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 SaaSPro. Construido con Next.js 16 + Shadcn/ui</p>
        </div>
      </footer>
    </div>
  );
}
