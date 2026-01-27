"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signInSchema, SignInSchemaType } from "@/lib/zod-schemas/auth-schema";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BadgeQuestionMark, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SocialAuth from "./social-auth";

const SigninForm = () => {
  const router = useRouter();
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInSchemaType) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => router.push("/"),
        onError: (error) => {
          let msg = "";
          switch (error.error.code) {
            case "INVALID_EMAIL_OR_PASSWORD":
              msg = "Tên tài khoản hoặc mật khẩu không chính xác";
              break;
            default:
              msg = "Có lỗi xảy ra , vui lòng thử lại sau";
              break;
          }
          toast.error(msg);
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-110">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>Đăng nhập để tiếp tục học tập</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <SocialAuth />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      {...field}
                      className={cn("h-11")}
                      type="email"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      {...field}
                      className={cn("h-11")}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} className="w-full text-sm">
              {isPending ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang đăng nhập...
                </div>
              ) : (
                <>Đăng nhập</>
              )}
            </Button>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Bạn chưa có tài khoản?{" "}
                <Link
                  href="/signup"
                  className="underline text-black dark:text-white font-medium"
                >
                  Đăng ký
                </Link>{" "}
              </p>
              <Link
                href="/forgot-password"
                className="underline text-black dark:text-white font-medium text-xs flex items-center gap-1"
              >
                Quên mật khẩu {""}
                <BadgeQuestionMark size={16} />
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SigninForm;
