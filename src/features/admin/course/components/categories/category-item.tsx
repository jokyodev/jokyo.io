import { RouterOutputs } from "@/trpc/init";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
type Category = RouterOutputs["category"]["getAll"][number];

const CategoryItem = ({
  index,
  category,
}: {
  index: number;
  category: Category;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const remove = useMutation(
    trpc.category.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Xóa danh mục thành công");
        queryClient.invalidateQueries({
          queryKey: trpc.category.getAll.queryKey(),
        });
      },
      onError: (error) => {
        console.log("Xóa danh mục thất bại");
      },
    }),
  );

  const removeCategory = async (categoryId: string) => {
    remove.mutate({
      categoryId: categoryId,
    });
  };
  return (
    <TableRow key={category.id}>
      <TableCell>{index}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell className="space-x-1">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Trash />
        </Button>
        <Button
          onClick={() => removeCategory(category.id)}
          className="bg-red-400 hover:bg-red-500 text-white"
        >
          <Pencil />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CategoryItem;
