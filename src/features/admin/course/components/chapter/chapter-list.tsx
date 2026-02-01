import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Eye,
  GripVertical,
  Link2,
  Pencil,
  PlayCircle,
  Trash,
} from "lucide-react";
import RemoveChapter from "./remove-chapter";
import Link from "next/link";
import NewLesson from "../lesson/new-lesson";
import ChapterItem from "./chapter-item";

interface iAppProps {
  chapters: any;
}

const ChapterList = ({ chapters }: iAppProps) => {
  return (
    <Accordion type="multiple" className="space-y-4">
      {chapters.map((chapter: any) => (
        <ChapterItem key={chapter.id} chapter={chapter} />
      ))}
    </Accordion>
  );
};

export default ChapterList;
