import SigninForm from "@/features/auth/components/signin-form";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();
  return <SigninForm />;
};

export default Page;
