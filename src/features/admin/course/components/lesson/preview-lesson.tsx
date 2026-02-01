import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getVideoUrl } from "@/utils";
import { Eye } from "lucide-react";

interface iAppProps {
  videoKey: string;
}

const PreviewLesson = ({ videoKey }: iAppProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xem video</DialogTitle>
        </DialogHeader>
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
          <iframe
            src={getVideoUrl(videoKey)}
            loading="lazy"
            allow="accelerometer;gyroscope;encrypted-media;picture-in-picture;"
            className="w-full h-full border-none"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewLesson;
