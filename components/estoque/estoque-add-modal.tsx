"use client";

import { DynamicForm } from "@/components/custom/dynamic-form";
import { useCreateMovimentacao } from "@/hooks/use-estoque";
import { BaseModal } from "@/components/custom/base-modal";
import { toast } from "sonner";
import * as z from "zod";

// Schema para movimentação
const movimentacaoSchema = z.object({
  produto_id: z.string(),
  quantidade: z.coerce.number().min(1, "A quantidade deve ser maior que 0"),
  tipo: z.enum(["entrada", "saida"]),
});

export function AddEstoqueModal({
  isOpen,
  onClose,
  produtoId, // Recebendo o ID do produto
  nomeProduto,
}: {
  isOpen: boolean;
  onClose: () => void;
  produtoId: string;
  nomeProduto?: string;
}) {
  const createMovimentacaoMutation = useCreateMovimentacao();

  const formFields = [
    {
      name: "tipo" as const,
      label: "Tipo de Movimentação",
      component: "select" as const,
      options: [
        { label: "Entrada (Soma)", value: "entrada" },
        { label: "Saída (Subtrai)", value: "saida" },
      ],
    },
    {
      name: "quantidade" as const,
      label: "Quantidade",
      placeholder: "Digite a quantidade",
      type: "number",
      component: "input" as const,
    },
  ];

  const handleSubmit = (data: z.infer<typeof movimentacaoSchema>) => {
    createMovimentacaoMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Movimentação registrada com sucesso!");
        onClose();
      },
      onError: (error) => {
        toast.error(`Erro ao criar movimentação: ${error.message}`);
      },
    });
  };

  return (
    <BaseModal
      title={`Movimentar Estoque: ${nomeProduto}`}
      description="Registre uma entrada ou saída de mercadoria."
      isOpen={isOpen}
      onClose={onClose}
    >
      <DynamicForm
        schema={movimentacaoSchema}
        onSubmit={handleSubmit}
        fields={formFields}
        defaultValues={{
          produto_id: produtoId,
          quantidade: 0,
          tipo: "entrada",
        }}
        submitButtonText="Confirmar Movimentação"
        isSubmitting={createMovimentacaoMutation.isPending}
      />
    </BaseModal>
  );
}