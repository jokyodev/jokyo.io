"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDuration } from "@/utils";
import { PlayCircle, Lock, Play, Timer, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Hàm merge class của Shadcn

interface iAppProps {
  chapters: any;
}

const ChapterList = ({ chapters }: iAppProps) => {
  // Tổng số bài học
  const totalLessons = chapters.reduce(
    (acc: any, ch: any) => acc + ch.lessons.length,
    0,
  );

  return (
    <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Nội dung khóa học
            </CardTitle>
            <CardDescription className="mt-1">
              {chapters.length} chương • {totalLessons} bài học
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {chapters.map((chapter: any) => (
            <AccordionItem
              key={chapter.id}
              value={chapter.name}
              className="border rounded-xl px-4 bg-card/50 overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline py-4 group">
                <div className="flex items-center gap-3 text-left">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors">
                    {chapter.position + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base leading-none">
                      {chapter.name}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1.5 font-normal">
                      {chapter.lessons.length} bài học •{" "}
                      {formatDuration(
                        chapter.lessons.reduce(
                          (a: any, b: any) => a + b.duration,
                          0,
                        ),
                      )}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-4 space-y-1">
                {chapter.lessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className={cn(
                      "group flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer",
                      "hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border/50",
                      "active:scale-[0.98]",
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {lesson.isPreview ? (
                        <PlayCircle className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="text-sm font-medium truncate">
                        <span className="text-muted-foreground mr-1.5 font-normal tabular-nums">
                          {lesson.position}.
                        </span>
                        {lesson.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {lesson.isPreview && (
                        <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          Xem thử
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Timer className="w-3.5 h-3.5" />
                        <span className="text-xs tabular-nums">
                          {formatDuration(lesson.duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ChapterList;
