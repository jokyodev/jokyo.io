import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouterOutputs } from "@/trpc/init";
import { Pencil, Trash } from "lucide-react";
import CategoryItem from "@/features/admin/course/components/categories/category-item";

type CategoriesListType = RouterOutputs["category"]["getAll"];
type Category = RouterOutputs["category"]["getAll"][number];

const AllCategories = ({ categories }: { categories: CategoriesListType }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Xem toàn bộ</Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Tất cả danh mục</DialogTitle>
        </DialogHeader>
        {categories.length >= 1 ? (
          <>
            <Table>
              <TableCaption>Danh mục</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.map((category: Category, index: number) => (
                  <CategoryItem
                    key={category.id}
                    index={index}
                    category={category}
                  />
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <>
            <span className="text-muted-foreground">Không có danh mục</span>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AllCategories;
