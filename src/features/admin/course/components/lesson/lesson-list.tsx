import LessonItem from "./lesson-item";

interface iAppProps {
  courseId: string;
  lessons: any;
}

const LessonList = ({ courseId, lessons }: iAppProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      {lessons?.map((lesson: any) => {
        return (
          <LessonItem key={lesson.id} courseId={courseId} lesson={lesson} />
        );
      })}
    </div>
  );
};

export default LessonList;
