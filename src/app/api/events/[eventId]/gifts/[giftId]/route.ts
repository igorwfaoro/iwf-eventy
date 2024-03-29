import { NextResponse } from 'next/server';
import { createGiftServerService } from '../../../../../../services/server/gift.server-service';

interface Params {
  params: { eventId: string; giftId: string };
}

const giftService = createGiftServerService();

export async function GET(_: Request, { params }: Params) {
  const gift = await giftService.getById(Number(params.giftId));

  return NextResponse.json(gift);
}

export async function PUT(req: Request, { params }: Params) {
  const input = await req.json();

  const gift = await giftService.update({
    eventId: Number(params.eventId),
    id: Number(params.giftId),
    input
  });

  return NextResponse.json(gift);
}

export async function DELETE(_: Request, { params }: Params) {
  await giftService.remove(Number(params.eventId), Number(params.giftId));

  return NextResponse.json({ ok: true });
}
