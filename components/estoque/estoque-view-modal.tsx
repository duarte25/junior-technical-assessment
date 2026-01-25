"use client";

import { estoqueMovimentacoesColumns } from "./estoque-movimentacoes-columns";
import { EstoqueMovimentacoes, useEstoqueMovimentacoes } from "@/hooks/use-estoque";
import { BaseModal } from "@/components/custom/base-modal";
import { EditEstoqueModal } from "./estoque-edit-modal";
import { AddEstoqueModal } from "./estoque-add-modal";
import { estoque } from "@/generated/prisma/client";
import { DataTable } from "../custom/data-table";
import { Button } from "../ui/button";
import { useState } from "react";

export function ViewEstoqueModal({
  isOpen,
  onClose,
  stock
}: {
  isOpen: boolean;
  onClose: () => void;
  stock: estoque
}) {

  const { data: estoqueMovimentacoes, isLoading, isError, error } = useEstoqueMovimentacoes(stock?.produto_id ?? "");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEstoqueMovi, setSelectedEstoqueMovi] = useState<EstoqueMovimentacoes | null>(
    null,
  );

  const handleEdit = (id: string) => {
    const stockToEdit = estoqueMovimentacoes?.find((cat) => cat.id === id);
    if (stockToEdit) {
      setSelectedEstoqueMovi(stockToEdit);
      setIsEditModalOpen(true);
    }
  };

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load estoque."}
      </div>
    );
  }

  return (
    <BaseModal
      title="Movimentações de estoque"
      description="Preencha movimentações de estoque"
      isOpen={isOpen}
      onClose={onClose}
      className="!max-w-full md:!max-w-[1000px] w-full h-full md:h-auto m-0 md:m-auto rounded-none md:rounded-lg"
    >
      <>
        <DataTable
          columns={estoqueMovimentacoesColumns}
          data={estoqueMovimentacoes || []}
          onEdit={handleEdit}
          isLoading={isLoading}
          actionButtons={[
            <Button key="new-product" onClick={() => setIsAddModalOpen(true)}>
              Nova movimentação
            </Button>,
          ]}
        />

        <AddEstoqueModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          produtoId={stock?.produto_id ?? ""}
          nomeProduto={stock?.produtos?.nome ?? ""}
        />
        <EditEstoqueModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          stock={selectedEstoqueMovi}
        />
      </>
    </BaseModal>
  );
}
