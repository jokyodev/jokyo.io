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
import { signUpSchema, SignUpSchemaType } from "@/lib/zod-schemas/auth-schema";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BadgeQuestionMark, Loader, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SocialAuth from "./social-auth";

const SignupForm = () => {
  const router = useRouter();
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpSchemaType) => {
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (error) => {
          let msg = "";
          switch (error.error.code) {
            case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
              msg = "Địa chỉ email đã tồn tại";
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
        <CardTitle>Đăng ký tài khoản</CardTitle>
        <CardDescription>Tạo mới tài khoản để tiếp tục</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <SocialAuth />

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và Tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập đầy đủ họ và tên"
                      {...field}
                      className={cn("h-11")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
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
                  Đang tạo...
                </div>
              ) : (
                <>Tạo tài khoản</>
              )}
            </Button>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/signin"
                  className="underline text-black dark:text-white font-medium"
                >
                  Đăng nhập
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

export default SignupForm;
