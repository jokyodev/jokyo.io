import { Accordion } from "@/components/ui/accordion";

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
