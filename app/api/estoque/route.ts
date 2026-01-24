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

  return NextResponse.json(estoqueSerialized);
}

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { nome, descricao } = body;
//     if (!nome) {
//       return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
//     }
//     const newCategoria = await service.createCategoria({ nome, descricao });
//     const newCategoriaSerialized = {
//       ...newCategoria,
//       id: newCategoria.id.toString()
//     };
//     return NextResponse.json(newCategoriaSerialized, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Falha ao criar categoria' }, { status: 500 });
//   }
// }
