"use client";

import { updateEstoqueSchema, useUpdateStock, EstoqueMovimentacoes } from "@/hooks/use-estoque";
import { DynamicForm } from "@/components/custom/dynamic-form";
import { BaseModal } from "@/components/custom/base-modal";
import { toast } from "sonner";
import * as z from "zod";

export function EditEstoqueModal({
  isOpen,
  onClose,
  stock,
}: {
  isOpen: boolean;
  onClose: () => void;
  stock: EstoqueMovimentacoes | null;
}) {

  const updateStockMutation = useUpdateStock();

  const formFields = [
    {
      name: "tipo" as const,
      label: "Tipo de Movimentação",
      component: "select" as const,
      options: [
        { label: "Entrada", value: "entrada" },
        { label: "Saída", value: "saida" },
      ],
    },
    {
      name: "quantidade" as const,
      label: "Quantidade",
      placeholder: "Digite a nova quantidade",
      component: "input" as const,
      type: "number",
    },
  ];

  const handleSubmit = (data: z.infer<typeof updateEstoqueSchema>) => {
    if (!stock?.id) return;
    updateStockMutation.mutate(
      { ...data, id: stock.id },
      {
        onSuccess: () => {
          toast.success("Movimentação atualizada com sucesso!");
          onClose();
        },
        onError: (error) => {
          toast.error(`Erro ao atualizar movimentação: ${error.message}`);
        },
      },
    );
  };

  return (
    <BaseModal
      title="Editar Movimentação"
      description="Edite os detalhes da movimentação."
      isOpen={isOpen}
      onClose={onClose}
    >
      {stock && (
        <DynamicForm
          schema={updateEstoqueSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            id: stock.id,
            produto_id: stock.produto_id,
            quantidade: stock.quantidade,
            tipo: stock.tipo,
          }}
          fields={formFields}
          submitButtonText="Salvar Alterações"
          isSubmitting={updateStockMutation.isPending}
        />
      )}
    </BaseModal>
  );
}
