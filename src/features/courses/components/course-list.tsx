import { RouterOutputs } from "@/trpc/init";
import CourseItem from "./course-item";

type CoursesType = RouterOutputs["clientCourse"]["getAll"];

interface iAppProps {
  courses: CoursesType;
}
const CourseList = ({ courses }: iAppProps) => {
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-5">
        {courses.map((course: any) => {
          return <CourseItem key={course.id} course={course} />;
        })}
      </div>
    </div>
  );
};

export default CourseList;
