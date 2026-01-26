import ForgotPassword from "@/features/auth/components/forgot-password";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();

  return <ForgotPassword />;
};

export default Page;
