import LoadingSpinner from "@/components/loading-spinner";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";
import { requireUnAuth } from "@/lib/auth-utils";
import { Suspense } from "react";

const Page = async () => {
  await requireUnAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordForm />;
    </Suspense>
  );
};

export default Page;
