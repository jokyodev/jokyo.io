import { RouterOutputs } from "@/trpc/init";

import PurchasesItem from "./purchased-item";

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
