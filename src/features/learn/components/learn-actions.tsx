"use client";

import { useState } from "react";
import Notes from "@/features/notes/components/notes";
import { StickyNote, FolderArchive, Code2 } from "lucide-react";
import ResourcesLinks from "./resources-links";

type TabKey = "notes" | "resources" | "source";
interface iAppProps {
  lessonId: string;
}
const LearnActions = ({ lessonId }: iAppProps) => {
  const [tab, setTab] = useState<TabKey>("notes");

  return (
    <div className="mt-1 mb-10 w-full">
      {/* Tabs header */}
      <div className="flex w-full items-center gap-2 border-b border-b-zinc-200 bg-white p-2 ">
        <TabButton
          active={tab === "notes"}
          onClick={() => setTab("notes")}
          icon={<StickyNote size={18} />}
          label="Ghi chú"
        />
        <TabButton
          active={tab === "resources"}
          onClick={() => setTab("resources")}
          icon={<FolderArchive size={18} />}
          label="Tài nguyên"
        />
        <TabButton
          active={tab === "source"}
          onClick={() => setTab("source")}
          icon={<Code2 size={18} />}
          label="Final source code"
        />
      </div>

      {/* Tab content */}
      <div className="mt-4 rounded-sm border border-zinc-200 bg-white p-4 shadow-sm">
        {tab === "notes" && (
          <div>
            <Notes lessonId={lessonId} />
          </div>
        )}

        {tab === "resources" && <ResourcesLinks />}

        {tab === "source" && (
          <div className="text-sm text-zinc-600">
            {/* TODO: source code component */}
            Source code sẽ hiển thị ở đây.
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnActions;

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
        "active:scale-[0.98]",
        active
          ? "bg-zinc-100 text-black border "
          : "text-zinc-700 hover:bg-zinc-100",
      ].join(" ")}
      type="button"
    >
      <span className={active ? "text-zinc-600" : "text-zinc-500"}>{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
