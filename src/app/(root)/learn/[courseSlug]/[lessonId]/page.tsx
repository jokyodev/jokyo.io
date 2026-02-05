type Params = Promise<{
  lessonId: String;
}>;
interface iAppProps {
  params: Params;
}

const Page = async ({ params }: iAppProps) => {
  const { lessonId } = await params;

  return <div>{lessonId}</div>;
};

export default Page;
