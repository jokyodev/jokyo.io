import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StickyNote } from "lucide-react";

const Notes = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl px-5 transition-all"
        >
          <StickyNote size={18} className="text-orange-500" />
          <span className="font-medium">Ghis chú</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ghi chú</DialogTitle>
          <DialogDescription>
            Ghi chú cho bài học - cài đặt vps
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Notes;
