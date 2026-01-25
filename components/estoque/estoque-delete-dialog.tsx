"use client";


import { useDeleteMovimentacao } from "@/hooks/use-estoque";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DeleteStocktDialog({
  isOpen,
  onClose,
  productId,
}: {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
}) {
  const deleteMovimentacaoMutation = useDeleteMovimentacao();

  const handleDelete = () => {
    if (!productId) return;
    deleteMovimentacaoMutation.mutate(productId, {
      onSuccess: () => {
        toast.success("Movimentação excluída com sucesso!");
        onClose();
      },
      onError: (error) => {
        toast.error(`Erro ao excluir movimentação: ${error.message}`);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente a movimentação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMovimentacaoMutation.isPending}
          >
            {deleteMovimentacaoMutation.isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}