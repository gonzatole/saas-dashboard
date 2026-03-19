'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Save, Shield, Bell, Puzzle } from 'lucide-react';

const integrations = [
  { name: 'Stripe', description: 'Procesamiento de pagos', connected: true, icon: '💳' },
  { name: 'Slack', description: 'Notificaciones del equipo', connected: false, icon: '💬' },
  { name: 'GitHub', description: 'Control de versiones', connected: true, icon: '🐙' },
  { name: 'Zapier', description: 'Automatización de flujos', connected: false, icon: '⚡' },
  { name: 'Mailchimp', description: 'Email marketing', connected: false, icon: '📧' },
  { name: 'Google Analytics', description: 'Analytics web', connected: true, icon: '📊' },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newCustomer: true,
    newSale: true,
    weeklyReport: true,
    securityAlerts: true,
    marketingEmails: false,
    productUpdates: true,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Configuración" subtitle="Administra tu perfil y preferencias" />

      <main className="flex-1 p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-1.5" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-1.5" />
              Seguridad
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Puzzle className="h-4 w-4 mr-1.5" />
              Integraciones
            </TabsTrigger>
          </TabsList>

          {/* GENERAL */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Información de Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">G</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Cambiar foto</Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG hasta 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Nombre</Label>
                    <Input defaultValue="Gonzalo" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Apellido</Label>
                    <Input defaultValue="Dev" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="gonzalo@ejemplo.com" />
                </div>

                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea
                    defaultValue="Desarrollador Full Stack especializado en Angular, React y Node.js."
                    rows={3}
                  />
                </div>

                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICACIONES */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preferencias de Notificaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    newCustomer: 'Nuevo cliente registrado',
                    newSale: 'Nueva venta completada',
                    weeklyReport: 'Reporte semanal',
                    securityAlerts: 'Alertas de seguridad',
                    marketingEmails: 'Emails de marketing',
                    productUpdates: 'Actualizaciones del producto',
                  };
                  return (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">{labels[key]}</p>
                        <p className="text-xs text-muted-foreground">Recibir notificación por email</p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEGURIDAD */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cambiar Contraseña</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Contraseña actual</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nueva contraseña</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Confirmar nueva contraseña</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button>Actualizar contraseña</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Autenticación de Dos Factores</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">2FA con app autenticadora</p>
                    <p className="text-xs text-muted-foreground">Añade una capa extra de seguridad a tu cuenta</p>
                  </div>
                  <Switch />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* INTEGRACIONES */}
          <TabsContent value="integrations">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integration) => (
                <Card key={integration.name}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{integration.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{integration.name}</p>
                          <span className={`text-xs font-medium ${integration.connected ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                            {integration.connected ? 'Conectado' : 'Sin conectar'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                        <Button
                          variant={integration.connected ? 'outline' : 'default'}
                          size="sm"
                          className="mt-3"
                        >
                          {integration.connected ? 'Desconectar' : 'Conectar'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
