import { requireAuth } from "@/lib/auth-utils";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  await requireAuth();

  return <>{children}</>;
};

export default Layout;
