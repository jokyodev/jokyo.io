import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { GripVertical, Link2, Pencil } from "lucide-react";
import RemoveChapter from "./remove-chapter";

import NewLesson from "../lesson/new-lesson";
import LessonList from "../lesson/lesson-list";

interface iAppProps {
  chapter: any;
}

const ChapterItem = ({ chapter }: iAppProps) => {
  return (
    <AccordionItem
      value={chapter.id}
      key={chapter.id}
      className="border rounded-xl px-4 overflow-hidden shadow-sm"
    >
      <div className="flex items-center gap-x-2">
        {/* Grip Icon tách biệt khỏi Trigger để chuẩn bị cho DND sau này */}
        <div className="cursor-grab  p-2 rounded-md transition">
          <GripVertical className="h-5 w-5 " />
        </div>

        <AccordionTrigger className="hover:no-underline py-4 flex-1">
          <div className="flex items-center gap-x-2">
            <span className="flex items-center justify-center h-6 w-6 rounded-full  text-[10px] font-bold">
              {chapter.position + 1}
            </span>
            <p className="font-semibold text-sm ">{chapter.name}</p>
          </div>
        </AccordionTrigger>

        {/* Actions Area */}
        <div className="flex items-center gap-x-2 ml-auto pr-2">
          {chapter.externalLink && (
            <Link2 size={16} className="text-blue-500" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-blue-600"
          >
            <Pencil size={16} />
          </Button>
          <RemoveChapter chapter={chapter} />
        </div>
      </div>

      <AccordionContent className="pt-0 pb-4">
        <div className="mt-2 space-y-2 border-l-2 border-slate-100 ml-4 pl-4">
          {chapter.lessons.length === 0 && (
            <p className="text-xs text-muted-foreground py-2 italic">
              Chưa có bài học trong chương này
            </p>
          )}

          <LessonList courseId={chapter.courseId} lessons={chapter.lessons} />

          <div className="pt-2">
            <NewLesson courseId={chapter.courseId} chapterId={chapter.id} />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ChapterItem;
