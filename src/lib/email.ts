import { Resend } from 'resend';

// Lazy initialization — avoids crash at build time when RESEND_API_KEY is not set
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');
  return _resend;
}

const FROM = 'RiskGuard AI <noreply@riskguard.ai>';

// ─── Welcome email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail({
  to,
  name,
  companyName,
}: {
  to: string;
  name: string;
  companyName: string;
}) {
  if (!process.env.RESEND_API_KEY) return; // silently skip if key not configured

  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Bienvenido a RiskGuard AI, ${name}`,
    html: welcomeHtml({ name, companyName }),
  });
}

// ─── Action overdue notification ──────────────────────────────────────────────

export async function sendActionOverdueEmail({
  to,
  name,
  actionTitle,
  dueDate,
  dashboardUrl,
}: {
  to: string;
  name: string;
  actionTitle: string;
  dueDate: Date;
  dashboardUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Acción correctiva vencida: ${actionTitle}`,
    html: overdueHtml({ name, actionTitle, dueDate, dashboardUrl }),
  });
}

// ─── HTML templates ───────────────────────────────────────────────────────────

function welcomeHtml({ name, companyName }: { name: string; companyName: string }) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
        <!-- Header -->
        <tr>
          <td style="background:#2563eb;padding:32px 40px;text-align:center">
            <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700">🛡️ RiskGuard AI</p>
            <p style="margin:8px 0 0;color:#bfdbfe;font-size:13px">Prevención de Riesgos Laborales · Ley 16.744</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px">
            <h1 style="margin:0 0 16px;font-size:20px;color:#1e293b">¡Bienvenido, ${name}!</h1>
            <p style="margin:0 0 16px;color:#475569;line-height:1.7">
              Tu cuenta para <strong>${companyName}</strong> ha sido creada exitosamente.
              Ahora tienes acceso a todas las herramientas de gestión de prevención de riesgos.
            </p>
            <p style="margin:0 0 24px;color:#475569;line-height:1.7">
              Tu prueba gratuita de <strong>14 días</strong> incluye todas las funciones del plan Pro.
            </p>
            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px">
              <tr>
                <td style="background:#2563eb;border-radius:8px">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://riskguard.ai'}/dashboard"
                     style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px">
                    Ir a mi dashboard →
                  </a>
                </td>
              </tr>
            </table>
            <!-- Features -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:20px">
              <tr><td>
                <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Qué puedes hacer</p>
                ${[
                  '✓ Crear inspecciones de seguridad y registrar ítems',
                  '✓ Registrar incidentes y acciones correctivas',
                  '✓ Gestionar trabajadores y áreas de trabajo',
                  '✓ Usar el asistente IA para análisis de riesgos',
                ].map(f => `<p style="margin:0 0 6px;font-size:13px;color:#475569">${f}</p>`).join('')}
              </td></tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0">
            <p style="margin:0;font-size:11px;color:#94a3b8">
              RiskGuard AI · Santiago, Chile<br>
              Si no creaste esta cuenta, ignora este correo.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function overdueHtml({
  name, actionTitle, dueDate, dashboardUrl,
}: { name: string; actionTitle: string; dueDate: Date; dashboardUrl: string }) {
  const dateStr = dueDate.toLocaleDateString('es-CL');
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
        <tr>
          <td style="background:#dc2626;padding:32px 40px;text-align:center">
            <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700">⚠️ RiskGuard AI</p>
            <p style="margin:8px 0 0;color:#fecaca;font-size:13px">Alerta de acción vencida</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px">
            <h1 style="margin:0 0 16px;font-size:18px;color:#1e293b">Hola ${name},</h1>
            <p style="margin:0 0 16px;color:#475569;line-height:1.7">
              La siguiente acción correctiva está <strong style="color:#dc2626">vencida</strong>:
            </p>
            <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-bottom:24px">
              <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#991b1b">${actionTitle}</p>
              <p style="margin:0;font-size:12px;color:#dc2626">Fecha límite: ${dateStr}</p>
            </div>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto">
              <tr>
                <td style="background:#dc2626;border-radius:8px">
                  <a href="${dashboardUrl}"
                     style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px">
                    Ver acción en el dashboard →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0">
            <p style="margin:0;font-size:11px;color:#94a3b8">RiskGuard AI · Santiago, Chile</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
