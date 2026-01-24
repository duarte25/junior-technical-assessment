"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Estoque } from "@/hooks/use-estoque";
import { format } from "date-fns";

export const estoqueColumns: ColumnDef<Estoque>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "atualizado_em",
    header: "Atualizado",
    cell: ({ row }) => {
      const date = new Date(row.getValue("atualizado_em"));
      return format(date, "dd/MM/yyyy HH:mm");
    },
  },
  {
    accessorKey: "produtos.nome",
    header: "Produto",
  },
  {
    accessorKey: "quantidade",
    header: "Quantidade",
  },
];
