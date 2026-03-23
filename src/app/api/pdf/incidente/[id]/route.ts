import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import React from 'react';
import type { DocumentProps } from '@react-pdf/renderer';
import { requireAuth } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/stripe';
import { IncidentPDF } from '@/lib/pdf/incident-template';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();

    const plan = (user.company?.plan ?? 'FREE') as keyof typeof PLANS;
    if (!PLANS[plan]?.limits?.exportPdf) {
      return NextResponse.json(
        { error: 'Esta función está disponible en los planes Pro y Enterprise.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const incident = await prisma.incident.findFirst({
      where: { id, companyId: user.companyId },
      include: {
        area: true,
        reportedBy: { select: { id: true, name: true, email: true } },
        category: true,
        workers: { select: { id: true, name: true, lastName: true, position: true } },
        correctiveActions: {
          include: { assignedTo: { select: { id: true, name: true } } },
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    if (!incident) {
      return NextResponse.json({ error: 'Incidente no encontrado.' }, { status: 404 });
    }

    const element = React.createElement(IncidentPDF, {
      data: {
        title: incident.title,
        description: incident.description,
        status: incident.status,
        severity: incident.severity,
        occurredAt: incident.occurredAt,
        createdAt: incident.createdAt,
        reportedBy: incident.reportedBy,
        area: incident.area,
        category: incident.category,
        workers: incident.workers,
        correctiveActions: incident.correctiveActions,
        companyName: user.company!.name,
      },
    }) as unknown as ReactElement<DocumentProps>;

    const buffer = await renderToBuffer(element);
    const bytes = new Uint8Array(buffer);
    const filename = `incidente-${incident.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(bytes.byteLength),
      },
    });
  } catch (error) {
    console.error('[PDF] incidente error:', error);
    return NextResponse.json({ error: 'Error al generar el PDF.' }, { status: 500 });
  }
}
