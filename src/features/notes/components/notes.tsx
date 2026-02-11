"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useVideoPlayer } from "@/context/video-player-provider";
import { useTRPC } from "@/trpc/client";
import { formatTime } from "@/utils";
import { NoteForm } from "./note-form";
import { NoteItem } from "./note-item";

const MAX_LENGTH = 200;
const MAX_NOTE = 1;

const Notes = ({ lessonId }: { lessonId: string }) => {
  const trpc = useTRPC();
  const { currentTime, seek, pause } = useVideoPlayer();
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: notes,
    isLoading,
    refetch,
  } = useQuery(trpc.noteRouter.getMany.queryOptions({ lessonId }));

  const addNoteMutation = useMutation(
    trpc.noteRouter.create.mutationOptions({
      onSuccess: () => {
        setIsAdding(false);
        setNewContent("");
        refetch();
        toast.success("Thêm thành công");
      },
    }),
  );

  const updateNoteMutation = useMutation(
    trpc.noteRouter.update.mutationOptions({
      onSuccess: () => {
        refetch();

        setIsEditing(false);
      },
      onError: (error) => {
        console.log(error);
      },
    }),
  );

  const handleUpdate = (id: string, content: string) => {
    updateNoteMutation.mutate({ noteId: id, content });
  };

  if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Ghi chú bài học</h3>

          {!isAdding && (notes?.length ?? 0) < MAX_NOTE && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsAdding(true);
                pause();
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        {notes?.length === 0 && (
          <span className="text-sm text-muted-foreground">
            Chưa có ghi chú nào
          </span>
        )}
      </div>

      {isAdding && (
        <NoteForm
          content={newContent}
          setContent={setNewContent}
          onSave={() =>
            addNoteMutation.mutate({
              lessonId,
              content: newContent,
              timestamp: Math.floor(currentTime),
            })
          }
          onCancel={() => setIsAdding(false)}
          isPending={addNoteMutation.isPending}
          maxLength={MAX_LENGTH}
          placeholder={`Ghi chú tại ${formatTime(currentTime)}...`}
        />
      )}

      <div className="space-y-3">
        {notes?.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            maxLength={MAX_LENGTH}
            onUpdate={handleUpdate}
            onSeek={seek}
            isUpdating={updateNoteMutation.isPending}
            refetch={refetch}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        ))}
      </div>
    </div>
  );
};

export default Notes;
