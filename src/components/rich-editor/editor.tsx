"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menubar";
import TextAlign from "@tiptap/extension-text-align";
export function RichTextEditor({ field }: { field: any }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "border border-input p-5 dark:bg-black/50 min-h-[400px] focus:outline-none prose  prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      const value = JSON.stringify(editor.getJSON());
      field.onChange(value);
    },
  });
  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} defaultValue={"hehe"} />
    </div>
  );
}
