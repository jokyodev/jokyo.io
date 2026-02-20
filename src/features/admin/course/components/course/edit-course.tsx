"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfo from "./basic-info";

import CourseStructure from "./course-structure";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loading-spinner";

interface iAppProps {
  courseId: string;
}

const EditCourse = ({ courseId }: iAppProps) => {
  const trpc = useTRPC();
  const {
    data: course,
    isLoading,
    error,
  } = useQuery(
    trpc.course.getOne.queryOptions({
      courseId: courseId,
    }),
  );
  if (isLoading) return <LoadingSpinner />;
  console.log(error);

  if (!course) return <p>Co loi xay ra</p>;

  const safeCourse = JSON.parse(JSON.stringify(course));

  return (
    <Tabs className="w-full" defaultValue="course-structure">
      <TabsList className="w-full">
        <TabsTrigger value="basic-info">Thông tin khóa học</TabsTrigger>
        <TabsTrigger value="course-structure">Cấu trúc khóa học</TabsTrigger>
      </TabsList>

      <TabsContent value="basic-info">
        <BasicInfo course={safeCourse} />
      </TabsContent>
      <TabsContent value="course-structure">
        <CourseStructure course={safeCourse} />
      </TabsContent>
    </Tabs>
  );
};

export default EditCourse;
