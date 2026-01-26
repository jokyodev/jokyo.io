import ResetPasswordForm from "@/features/auth/components/reset-password-form";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();

  return <ResetPasswordForm />;
};

export default Page;
