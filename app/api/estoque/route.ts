import * as service from '@/services/estoque.service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('q') || undefined;

  const estoque = await service.getAllEstoque(term);

  const estoqueSerialized = estoque.map(item =>
    JSON.parse(JSON.stringify(item, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))
  );

  return NextResponse.json(estoqueSerialized, { status: 200 });
}