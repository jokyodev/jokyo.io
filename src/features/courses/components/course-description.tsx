"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";

const CourseDescription = ({ content }: { content: any }) => {
  // Memoize HTML để không phải parse lại mỗi lần component render
  const outputHTML = useMemo(() => {
    if (!content) return "";

    // Nếu content là string (do JSON.stringify), thì parse nó ra lại
    const jsonContent =
      typeof content === "string" ? JSON.parse(content) : content;

    try {
      return generateHTML(jsonContent, [
        StarterKit,
        // Nếu bạn có thêm extension nào (như Image, Table) thì thêm vào đây
      ]);
    } catch (error) {
      console.error("Lỗi parse nội dung Tiptap:", error);
      return "";
    }
  }, [content]);

  return (
    <div className="my-5 w-full max-w-4xl mx-auto py-10 px-6 bg-card rounded-3xl border shadow-sm">
      <div className="flex items-center gap-2 mb-8 text-primary font-bold uppercase tracking-widest text-xs">
        <span className="w-8 h-0.5 bg-primary"></span>
        Nội dung chi tiết
      </div>

      <article
        className={cn(
          "prose prose-zinc dark:prose-invert max-w-none",
          "prose-headings:scroll-m-20 prose-h1:text-3xl prose-h1:font-black",
          "prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10",
          "prose-p:text-muted-foreground prose-p:leading-relaxed text-[16px]",
          "prose-hr:my-8 prose-hr:border-border",
          "prose-strong:text-foreground prose-strong:font-bold",
          "prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:p-4 prose-blockquote:rounded-r-lg",
        )}
        dangerouslySetInnerHTML={{ __html: outputHTML }}
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-muted/50 border border-dashed flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
            🚀
          </div>
          <p className="text-sm font-medium">Học qua dự án thực tế</p>
        </div>
        <div className="p-4 rounded-2xl bg-muted/50 border border-dashed flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
            💎
          </div>
          <p className="text-sm font-medium">Cấp chứng chỉ hoàn thành</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDescription;
