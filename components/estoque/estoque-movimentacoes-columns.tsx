"use client";

import { EstoqueMovimentacoes } from "@/hooks/use-estoque";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const estoqueMovimentacoesColumns: ColumnDef<EstoqueMovimentacoes>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "criado_em",
    header: "Criação",
    cell: ({ row }) => {
      const date = new Date(row.getValue("criado_em"));
      return format(date, "dd/MM/yyyy HH:mm");
    },
  },
  {
    accessorKey: "produtos.nome",
    header: "Produto",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
];
