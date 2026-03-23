import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1a1a1a',
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#dc2626',
  },
  headerLeft: { flex: 1 },
  appName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#dc2626', marginBottom: 2 },
  appSubtitle: { fontSize: 8, color: '#64748b' },
  headerRight: { alignItems: 'flex-end' },
  docTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  docDate: { fontSize: 8, color: '#64748b' },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoItem: {
    width: '30%',
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoLabel: { fontSize: 7, color: '#94a3b8', marginBottom: 2 },
  infoValue: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  severityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 6,
    marginBottom: 14,
    borderWidth: 1,
  },
  severityLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  severityDesc: { fontSize: 8, marginTop: 2 },
  descBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  descText: { fontSize: 9, lineHeight: 1.6 },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  workerName: { fontSize: 9, fontFamily: 'Helvetica-Bold', flex: 1 },
  workerPos: { fontSize: 8, color: '#64748b' },
  actionRow: {
    padding: 8,
    marginBottom: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fef3c7',
    backgroundColor: '#fffbeb',
  },
  actionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  actionDesc: { fontSize: 8, color: '#64748b', marginBottom: 4 },
  actionMeta: { flexDirection: 'row', gap: 12 },
  actionMetaText: { fontSize: 7.5, color: '#92400e' },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: '#94a3b8' },
});

const SEVERITY_STYLES: Record<string, { bg: string; border: string; color: string; label: string }> = {
  NEAR_MISS: { bg: '#f8fafc', border: '#e2e8f0', color: '#475569', label: 'Casi accidente' },
  MINOR:     { bg: '#fefce8', border: '#fde68a', color: '#854d0e', label: 'Leve' },
  MODERATE:  { bg: '#fff7ed', border: '#fed7aa', color: '#9a3412', label: 'Moderado' },
  SERIOUS:   { bg: '#fef2f2', border: '#fecaca', color: '#991b1b', label: 'Grave' },
  FATAL:     { bg: '#fef2f2', border: '#f87171', color: '#7f1d1d', label: 'Fatal' },
};

const STATUS_LABELS: Record<string, string> = {
  REPORTED: 'Reportado', INVESTIGATING: 'Investigando',
  ACTION_PENDING: 'Acción pendiente', CLOSED: 'Cerrado',
};
const ACTION_STATUS: Record<string, string> = {
  PENDING: 'Pendiente', IN_PROGRESS: 'En progreso', COMPLETED: 'Completada', OVERDUE: 'Vencida',
};

interface IncidentData {
  title: string;
  description: string;
  status: string;
  severity: string;
  occurredAt: Date;
  createdAt: Date;
  reportedBy: { name: string; email: string };
  area: { name: string } | null;
  category: { name: string } | null;
  workers: { id: string; name: string; lastName: string; position: string | null }[];
  correctiveActions: {
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: Date;
    assignedTo: { name: string };
  }[];
  companyName: string;
}

export function IncidentPDF({ data }: { data: IncidentData }) {
  const severity = SEVERITY_STYLES[data.severity] ?? SEVERITY_STYLES.MINOR;
  const now = new Date().toLocaleDateString('es-CL');
  const occurredStr = new Date(data.occurredAt).toLocaleDateString('es-CL');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.appName}>RiskGuard AI</Text>
            <Text style={styles.appSubtitle}>Plataforma de Prevención de Riesgos · Ley 16.744</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>Informe de Incidente</Text>
            <Text style={styles.docDate}>Generado: {now}</Text>
          </View>
        </View>

        {/* Severity */}
        <View style={[styles.severityBox, { backgroundColor: severity.bg, borderColor: severity.border }]}>
          <View>
            <Text style={[styles.severityLabel, { color: severity.color }]}>{severity.label}</Text>
            <Text style={[styles.severityDesc, { color: severity.color }]}>
              Estado: {STATUS_LABELS[data.status] ?? data.status}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información general</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Título</Text>
              <Text style={styles.infoValue}>{data.title}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha de ocurrencia</Text>
              <Text style={styles.infoValue}>{occurredStr}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Reportado por</Text>
              <Text style={styles.infoValue}>{data.reportedBy.name}</Text>
            </View>
            {data.area && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Área</Text>
                <Text style={styles.infoValue}>{data.area.name}</Text>
              </View>
            )}
            {data.category && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Categoría</Text>
                <Text style={styles.infoValue}>{data.category.name}</Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Empresa</Text>
              <Text style={styles.infoValue}>{data.companyName}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción del incidente</Text>
          <View style={styles.descBox}>
            <Text style={styles.descText}>{data.description}</Text>
          </View>
        </View>

        {/* Workers */}
        {data.workers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trabajadores involucrados ({data.workers.length})</Text>
            {data.workers.map((w) => (
              <View key={w.id} style={styles.workerRow}>
                <Text style={styles.workerName}>{w.name} {w.lastName}</Text>
                {w.position && <Text style={styles.workerPos}>{w.position}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Corrective Actions */}
        {data.correctiveActions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones correctivas ({data.correctiveActions.length})</Text>
            {data.correctiveActions.map((action) => (
              <View key={action.id} style={styles.actionRow}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDesc}>{action.description}</Text>
                <View style={styles.actionMeta}>
                  <Text style={styles.actionMetaText}>Estado: {ACTION_STATUS[action.status] ?? action.status}</Text>
                  <Text style={styles.actionMetaText}>Vence: {new Date(action.dueDate).toLocaleDateString('es-CL')}</Text>
                  <Text style={styles.actionMetaText}>Responsable: {action.assignedTo.name}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>RiskGuard AI · {data.companyName}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          } />
        </View>
      </Page>
    </Document>
  );
}
