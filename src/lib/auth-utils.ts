import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
  // if (!session) return redirect("/signin");
};
export const requireUnAuth = async () => {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
  // if (session) redirect("/");
};

export const requireAdmin = async () => {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
  // if (!session) return redirect("/signin");
  // const isAdmin = session.user.role === "admin";
  // if (!isAdmin) return redirect("/");
};
