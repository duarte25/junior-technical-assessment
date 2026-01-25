import { NextResponse } from 'next/server';
import * as service from '@/services/categorias.service';
import { BusinessError } from '@/lib/errors';

interface Params {
  params: Promise<{ id: string; }>;
}

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const id = BigInt((await params).id);
    const categoria = await service.getCategoriaById(id);
    if (!categoria) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }
    const categoriaSerialized = {
      ...categoria,
      id: categoria.id.toString()
    };
    return NextResponse.json(categoriaSerialized, { status: 200 });
  } catch (error) {
    if (error instanceof BusinessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function PUT(
  request: Request, { params }: Params
) {
  try {
    const id = BigInt((await params).id);
    const body = await request.json();
    const { nome, descricao } = body;

    const updatedCategoria = await service.updateCategoria(id, { nome, descricao });
    const updatedCategoriaSerialized = {
      ...updatedCategoria,
      id: updatedCategoria.id.toString()
    };
    return NextResponse.json(updatedCategoriaSerialized);
  } catch (error) {
    if (error instanceof BusinessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, { params }: Params
) {
  try {
    const id = BigInt((await params).id);
    await service.deleteCategoria(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Produto não encontrado para exclusão' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Falha ao excluir produto' }, { status: 500 })
  }
}
