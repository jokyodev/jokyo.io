type Params = Promise<{
  courseSlug: string;
}>;
interface iAppProps {
  params: Params;
}
const Page = async ({ params }: iAppProps) => {
  const { courseSlug } = await params;

  return <div>Learn page</div>;
};

export default Page;
