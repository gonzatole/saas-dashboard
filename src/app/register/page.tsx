'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

const registerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  companyName: z.string().min(2, 'Nombre de empresa requerido'),
  companyRut: z.string().min(8, 'RUT inválido').max(12, 'RUT inválido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const benefits = ['14 días de prueba gratuita', 'Sin tarjeta de crédito', 'Setup en 5 minutos'];

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    const supabase = createClient();

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          company_name: data.companyName,
          company_rut: data.companyRut,
        },
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        setServerError('Este email ya está registrado. Intenta iniciar sesión.');
      } else {
        setServerError(authError.message);
      }
      return;
    }

    if (authData.user) {
      // 2. Crear company + user en nuestra DB via API route
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseId: authData.user.id,
          email: data.email,
          name: data.name,
          companyName: data.companyName,
          companyRut: data.companyRut,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error || 'Error al configurar la cuenta');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-3">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">RiskGuard AI</h1>
          <p className="text-sm text-muted-foreground mt-1">14 días de prueba gratuita — sin tarjeta</p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {benefits.map((b) => (
              <span key={b} className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
                <p className="text-xs text-destructive">{serverError}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="companyName">Nombre empresa</Label>
              <Input
                id="companyName"
                placeholder="Constructora Ejemplo SpA"
                {...register('companyName')}
                className={errors.companyName ? 'border-destructive' : ''}
              />
              {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="companyRut">RUT empresa</Label>
              <Input
                id="companyRut"
                placeholder="76.123.456-7"
                {...register('companyRut')}
                className={errors.companyRut ? 'border-destructive' : ''}
              />
              {errors.companyRut && <p className="text-xs text-destructive">{errors.companyRut.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email de trabajo</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mín. 8 caracteres"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite la contraseña"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            <p className="text-xs text-muted-foreground">
              Al registrarte aceptas los{' '}
              <a href="#" className="text-primary hover:underline">Términos de Servicio</a>{' '}
              y la{' '}
              <a href="#" className="text-primary hover:underline">Política de Privacidad</a>.
            </p>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta gratuita'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
