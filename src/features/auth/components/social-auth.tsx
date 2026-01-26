import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
const SocialAuth = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const googleAuth = () => {
    startTransition(async () => {
      await authClient.signIn.social(
        {
          provider: "google",
        },
        {
          onSuccess: () => {},
          onError: (error) => {
            toast.error("Có lỗi xảy ra , vui lòng thử lại sau.");
          },
        },
      );
    });
  };

  const githubAuth = async () => {
    startTransition(async () => {
      await authClient.signIn.social(
        {
          provider: "github",
        },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: (error) => {
            toast.error("Có lỗi xảy ra , vui lòng thử lại sau.");
          },
        },
      );
    });
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-2">
      <Button
        disabled={isPending}
        onClick={googleAuth}
        type="button"
        variant="outline"
      >
        <Image src="/google.svg" width={20} height={20} alt="Google" />
        Tiếp tục với Google
      </Button>
      <Button
        disabled={isPending}
        type="button"
        onClick={githubAuth}
        variant="outline"
      >
        <Image src="/github.svg" width={20} height={20} alt="Github" />
        Tiếp tục với Github
      </Button>
    </div>
  );
};

export default SocialAuth;
