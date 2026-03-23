'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, MapPin, CheckCircle2, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createArea } from '@/actions/areas';
import { areaSchema } from '@/lib/validations/worker';
import type { AreaFormData } from '@/lib/validations/worker';

const RISK_LEVELS = [
  { value: 'LOW', label: 'Bajo', color: 'border-emerald-300 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  { value: 'MEDIUM', label: 'Medio', color: 'border-yellow-300 bg-yellow-50 text-yellow-700', dot: 'bg-yellow-500' },
  { value: 'HIGH', label: 'Alto', color: 'border-orange-300 bg-orange-50 text-orange-700', dot: 'bg-orange-500' },
  { value: 'CRITICAL', label: 'Crítico', color: 'border-red-300 bg-red-50 text-red-700', dot: 'bg-red-500' },
] as const;

const STEPS = [
  { id: 1, label: 'Bienvenida' },
  { id: 2, label: 'Primera área' },
  { id: 3, label: '¡Listo!' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<AreaFormData>({
      resolver: zodResolver(areaSchema),
      defaultValues: { riskLevel: 'MEDIUM' },
    });

  const selectedRisk = watch('riskLevel');

  const onSubmit = async (data: AreaFormData) => {
    setError(null);
    const result = await createArea(data);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-3">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">RiskGuard AI</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-colors ${
                step > s.id
                  ? 'bg-primary text-primary-foreground'
                  : step === s.id
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
              </div>
              <span className={`text-xs hidden sm:block ${step === s.id ? 'font-semibold' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 mx-1 ${step > s.id ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Bienvenida ── */}
        {step === 1 && (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Building2 className="h-9 w-9 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Bienvenido a RiskGuard AI</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vamos a configurar tu cuenta en 2 minutos. Primero crearemos
                tu primera <strong>área de trabajo</strong> — el espacio físico
                donde se realizan las inspecciones de seguridad.
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-left space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ejemplos de áreas</p>
              {['Bodega principal', 'Planta de producción', 'Obra civil sector A', 'Oficinas administrativas'].map((ex) => (
                <div key={ex} className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {ex}
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => setStep(2)}>
              Comenzar configuración
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Crear primera área ── */}
        {step === 2 && (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold">Crea tu primera área</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Define el espacio donde se realizarán las inspecciones.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name">Nombre del área *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Bodega principal"
                  {...register('name')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  placeholder="Ej: Piso 2, sector norte"
                  {...register('location')}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Nivel de riesgo *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {RISK_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setValue('riskLevel', level.value)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        selectedRisk === level.value
                          ? level.color + ' ring-2 ring-offset-1 ring-current'
                          : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/40'
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${level.dot}`} />
                      {level.label}
                    </button>
                  ))}
                </div>
                {errors.riskLevel && <p className="text-xs text-destructive">{errors.riskLevel.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Descripción <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                <Textarea
                  id="description"
                  placeholder="Describe brevemente las actividades que se realizan en esta área..."
                  rows={2}
                  {...register('description')}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Atrás
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando...' : 'Crear área'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ── Step 3: ¡Listo! ── */}
        {step === 3 && (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">¡Todo listo!</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tu primera área fue creada. Ahora puedes comenzar a realizar
                inspecciones, registrar incidentes y usar el asistente IA.
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-left space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Próximos pasos sugeridos</p>
              {[
                'Agrega trabajadores a tu área',
                'Crea tu primera inspección de seguridad',
                'Explora el asistente IA de RiskGuard',
              ].map((tip, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {tip}
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => router.push('/dashboard')}>
              Ir al dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
