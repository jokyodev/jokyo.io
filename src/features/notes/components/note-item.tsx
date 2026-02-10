"use client";

import { useState } from "react";
import { Edit2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils";
import { NoteForm } from "./note-form"; // Import component trên
import DeleteNote from "./delete-note";
import { useVideoPlayer } from "@/context/video-player-provider";

interface NoteItemProps {
  note: any;
  onUpdate: (id: string, content: string) => void;
  onSeek: (time: number) => void;
  isUpdating: boolean;
  maxLength: number;
  refetch: () => void;
}

export const NoteItem = ({
  note,
  onUpdate,
  onSeek,
  isUpdating,
  maxLength,
  refetch,
}: NoteItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);

  const { seek, play } = useVideoPlayer();

  if (isEditing) {
    return (
      <NoteForm
        content={editContent}
        setContent={setEditContent}
        onSave={() => onUpdate(note.id, editContent)}
        onCancel={() => setIsEditing(false)}
        isPending={isUpdating}
        maxLength={maxLength}
        saveLabel="Cập nhật"
      />
    );
  }

  return (
    <div className="p-3 border rounded-lg hover:border-primary/50 transition-all group relative">
      <div className="flex justify-between items-start mb-1">
        <div
          className="text-xs font-semibold text-primary cursor-pointer hover:underline"
          onClick={() => onSeek(note.timestamp)}
        >
          {formatTime(note.timestamp)}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={() => {
              seek(note.timestamp);
              play();
            }}
            size="icon"
            className="w-6 h-6"
            variant="ghost"
          >
            <Play className="w-3 h-3 text-green-500 " />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-3 w-3 text-muted-foreground" />
          </Button>
          <DeleteNote noteId={note.id} refetch={refetch} />
        </div>
      </div>
      <p className="text-sm text-foreground break-words">{note.content}</p>
    </div>
  );
};
