import { RouterOutputs } from "@/trpc/init";
import CourseItem from "./course-item";
import PurchasesItem from "./purchased-item";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon, Folder } from "lucide-react";

type CoursesType = RouterOutputs["clientCourse"]["getAll"];

interface iAppProps {
  courses: CoursesType;
}

const PurchasedList = ({ courses }: iAppProps) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-7">
        {courses.map((course: any) => {
          return <PurchasesItem key={course.id} course={course} />;
        })}
      </div>
    </div>
  );
};

export default PurchasedList;
