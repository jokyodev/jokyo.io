"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const UserButton = () => {
  const { data } = authClient.useSession();

  return (
    <Button variant="outline" size="icon" className="rounded-sm">
      <Image
        src={data?.user.image || "/logo.png"}
        width={30}
        height={30}
        alt="User"
        className="rounded-sm"
      />
    </Button>
  );
};

export default UserButton;
