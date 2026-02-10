"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface NoteFormProps {
  content: string;
  setContent: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
  placeholder?: string;
  maxLength: number;
  saveLabel?: string;
}

export const NoteForm = ({
  content,
  setContent,
  onSave,
  onCancel,
  isPending,
  placeholder,
  maxLength,
  saveLabel = "Lưu",
}: NoteFormProps) => {
  const isOverLimit = content.length > maxLength;

  return (
    <div className="flex flex-col gap-3 p-3 border rounded-lg bg-muted/30">
      <div className="space-y-1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-20 resize-none bg-background text-sm"
          autoFocus
        />
        <div
          className={`text-[10px] text-right ${isOverLimit ? "text-red-500" : "text-muted-foreground"}`}
        >
          {content.length}/{maxLength}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="h-8 text-xs text-pink-600"
        >
          Hủy
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={isPending || !content.trim() || isOverLimit}
          className="h-8 text-xs bg-green-600 hover:bg-green-700"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
          {saveLabel}
        </Button>
      </div>
    </div>
  );
};
