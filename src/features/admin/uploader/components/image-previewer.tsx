import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Eye } from "lucide-react";
import Image from "next/image";

interface iAppProps {
  url: string;
}
const ImagePreviewer = ({ url }: iAppProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
          <div className="w-full h-60 rounded-lg bg-orange-50 relative">
            <Image src={url} fill alt="Course thumbnail" />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewer;
