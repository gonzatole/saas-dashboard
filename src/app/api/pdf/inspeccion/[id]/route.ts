import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import React from 'react';
import type { DocumentProps } from '@react-pdf/renderer';
import { requireAuth } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/stripe';
import { InspectionPDF } from '@/lib/pdf/inspection-template';

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

    const inspection = await prisma.inspection.findFirst({
      where: { id, companyId: user.companyId },
      include: {
        area: true,
        inspector: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            category: { select: { id: true, name: true, color: true } },
          },
          orderBy: { order: 'asc' },
        },
        correctiveActions: {
          include: { assignedTo: { select: { id: true, name: true } } },
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    if (!inspection) {
      return NextResponse.json({ error: 'Inspección no encontrada.' }, { status: 404 });
    }

    const element = React.createElement(InspectionPDF, {
      data: {
        title: inspection.title,
        status: inspection.status,
        createdAt: inspection.createdAt,
        scheduledDate: inspection.scheduledDate,
        inspector: inspection.inspector,
        area: inspection.area,
        items: inspection.items.map((item) => ({
          id: item.id,
          question: item.question,
          answer: item.answer as 'OK' | 'NO_OK' | 'NA' | null,
          observation: item.observation,
          riskLevel: item.riskLevel,
          category: item.category,
        })),
        correctiveActions: inspection.correctiveActions,
        companyName: user.company!.name,
      },
    }) as unknown as ReactElement<DocumentProps>;

    const buffer = await renderToBuffer(element);
    const bytes = new Uint8Array(buffer);
    const filename = `inspeccion-${inspection.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(bytes.byteLength),
      },
    });
  } catch (error) {
    console.error('[PDF] inspeccion error:', error);
    return NextResponse.json({ error: 'Error al generar el PDF.' }, { status: 500 });
  }
}
