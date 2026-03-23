import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer';

// ─── Styles ──────────────────────────────────────────────────────────────────

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
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  headerLeft: { flex: 1 },
  appName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#2563eb', marginBottom: 2 },
  appSubtitle: { fontSize: 8, color: '#64748b' },
  headerRight: { alignItems: 'flex-end' },
  docTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  docDate: { fontSize: 8, color: '#64748b' },
  // Section
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
  // Info grid
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
  // Score box
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 14,
  },
  scoreBig: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#16a34a' },
  scoreDetail: { fontSize: 8, color: '#166534', lineHeight: 1.6 },
  // Items
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemRowAlt: { backgroundColor: '#f8fafc' },
  itemNum: { width: 16, fontSize: 8, color: '#94a3b8', paddingTop: 1 },
  itemContent: { flex: 1 },
  itemQuestion: { fontSize: 9 },
  itemObs: { fontSize: 8, color: '#64748b', marginTop: 2 },
  itemMeta: { flexDirection: 'row', gap: 6, marginTop: 3 },
  itemCat: { fontSize: 7, color: '#94a3b8' },
  badge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3, fontSize: 7.5, fontFamily: 'Helvetica-Bold' },
  badgeOk: { backgroundColor: '#dcfce7', color: '#16a34a' },
  badgeNok: { backgroundColor: '#fee2e2', color: '#dc2626' },
  badgeNa: { backgroundColor: '#f1f5f9', color: '#94a3b8' },
  // Actions
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
  // Footer
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

// ─── Types ───────────────────────────────────────────────────────────────────

type AnswerType = 'OK' | 'NO_OK' | 'NA';

interface InspectionItem {
  id: string;
  question: string;
  answer: AnswerType | null;
  observation: string | null;
  riskLevel: string | null;
  category: { name: string; color: string } | null;
}

interface CorrectiveAction {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  assignedTo: { name: string };
}

interface InspectionData {
  title: string;
  status: string;
  createdAt: Date;
  scheduledDate: Date | null;
  inspector: { name: string; email: string };
  area: { name: string; riskLevel: string } | null;
  items: InspectionItem[];
  correctiveActions: CorrectiveAction[];
  companyName: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador', IN_PROGRESS: 'En progreso', COMPLETED: 'Completada', REVIEWED: 'Revisada',
};
const RISK_LABELS: Record<string, string> = {
  LOW: 'Bajo', MEDIUM: 'Medio', HIGH: 'Alto', CRITICAL: 'Crítico',
};
const ACTION_STATUS: Record<string, string> = {
  PENDING: 'Pendiente', IN_PROGRESS: 'En progreso', COMPLETED: 'Completada', OVERDUE: 'Vencida',
};

// ─── Component ───────────────────────────────────────────────────────────────

export function InspectionPDF({ data }: { data: InspectionData }) {
  const okCount = data.items.filter((i) => i.answer === 'OK').length;
  const noOkCount = data.items.filter((i) => i.answer === 'NO_OK').length;
  const naCount = data.items.filter((i) => i.answer === 'NA').length;
  const total = okCount + noOkCount || 1;
  const score = data.items.length > 0 ? Math.round((okCount / total) * 100) : null;

  const scoreColor = score === null ? '#64748b' : score >= 80 ? '#16a34a' : score >= 60 ? '#ca8a04' : '#dc2626';

  const dateStr = new Date(data.scheduledDate ?? data.createdAt).toLocaleDateString('es-CL');
  const now = new Date().toLocaleDateString('es-CL');

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
            <Text style={styles.docTitle}>Informe de Inspección</Text>
            <Text style={styles.docDate}>Generado: {now}</Text>
          </View>
        </View>

        {/* Score */}
        {score !== null && (
          <View style={[styles.scoreBox, {
            backgroundColor: score >= 80 ? '#f0fdf4' : score >= 60 ? '#fefce8' : '#fef2f2',
            borderColor: score >= 80 ? '#bbf7d0' : score >= 60 ? '#fde68a' : '#fecaca',
          }]}>
            <Text style={[styles.scoreBig, { color: scoreColor }]}>{score}%</Text>
            <View>
              <Text style={[styles.scoreDetail, { color: scoreColor }]}>Puntaje de cumplimiento</Text>
              <Text style={[styles.scoreDetail, { color: scoreColor }]}>
                ✓ {okCount} OK   ✗ {noOkCount} No cumple   — {naCount} N/A
              </Text>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información general</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Título</Text>
              <Text style={styles.infoValue}>{data.title}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Estado</Text>
              <Text style={styles.infoValue}>{STATUS_LABELS[data.status] ?? data.status}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{dateStr}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Inspector</Text>
              <Text style={styles.infoValue}>{data.inspector.name}</Text>
            </View>
            {data.area && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Área</Text>
                <Text style={styles.infoValue}>{data.area.name} · {RISK_LABELS[data.area.riskLevel] ?? data.area.riskLevel}</Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Empresa</Text>
              <Text style={styles.infoValue}>{data.companyName}</Text>
            </View>
          </View>
        </View>

        {/* Items */}
        {data.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ítems de verificación ({data.items.length})</Text>
            {data.items.map((item, idx) => (
              <View key={item.id} style={[styles.itemRow, idx % 2 === 1 ? styles.itemRowAlt : {}]}>
                <Text style={styles.itemNum}>{idx + 1}</Text>
                <View style={styles.itemContent}>
                  <Text style={styles.itemQuestion}>{item.question}</Text>
                  {item.observation ? <Text style={styles.itemObs}>{item.observation}</Text> : null}
                  {item.category ? (
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemCat}>{item.category.name}</Text>
                    </View>
                  ) : null}
                </View>
                <View>
                  {item.answer === 'OK' && <Text style={[styles.badge, styles.badgeOk]}>OK</Text>}
                  {item.answer === 'NO_OK' && <Text style={[styles.badge, styles.badgeNok]}>NO CUMPLE</Text>}
                  {(item.answer === 'NA' || !item.answer) && <Text style={[styles.badge, styles.badgeNa]}>N/A</Text>}
                </View>
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
