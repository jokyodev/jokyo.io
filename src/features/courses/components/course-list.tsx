import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RouterOutputs } from "@/trpc/init";

type CoursesType = RouterOutputs["clientCourse"]["getAll"];

interface iAppProps {
  courses: CoursesType;
}
const CourseList = ({ courses }: iAppProps) => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-extrabold ">Khóa học hiện có</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-7">
        {courses.map((course) => {
          return (
            <Card className="" key={course.id}>
              <CardHeader>
                <img
                  src={`${process.env.NEXT_PUBLIC_BUNNY_IMAGES_CDN}/${course.thumbnailKey}`}
                />
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CourseList;
