"use client";
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menubar";
import TextAlign from "@tiptap/extension-text-align";

export function RichTextEditor({ field }: { field: any }) {
  // Dùng một biến state để kiểm soát việc set nội dung lần đầu (Tránh loop)
  const [isInitialized, setIsInitialized] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "border border-input p-5 min-h-[400px] focus:outline-none prose dark:prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      // LUÔN LUÔN onChange ra một chuỗi JSON string
      const jsonString = JSON.stringify(editor.getJSON());
      field.onChange(jsonString);
    },
  });

  // Đổ dữ liệu từ field vào Editor khi load trang
  useEffect(() => {
    if (editor && field.value && !isInitialized) {
      try {
        // Parse chuỗi nhận được từ field.value
        const content =
          typeof field.value === "string"
            ? JSON.parse(field.value)
            : field.value;

        editor.commands.setContent(content);
        setIsInitialized(true);
      } catch (error) {
        console.error("Lỗi parse JSON Tiptap:", error);
      }
    }
  }, [editor, field.value, isInitialized]);

  return (
    <div className="w-full border rounded-md overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
