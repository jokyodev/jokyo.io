"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/lib/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, Loader, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    startTransition(async () => {
      await authClient.requestPasswordReset(
        {
          email: values.email,
          redirectTo: "/reset-password",
        },
        {
          onSuccess: () => {
            setIsSent(true);
          },
          onError: (error) => {
            toast.error("Có lỗi xảy ra , vui lòng thử lại sau");
          },
        },
      );
    });
  };

  return (
    <Card className="w-full max-w-110">
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription>
          Tìm lại mật khẩu cho tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSent ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Địa chỉ email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          required
                          placeholder="example@gmail.com"
                          {...field}
                          className={cn("h-10")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Xin chờ
                  </div>
                ) : (
                  <>Lấy lại mật khẩu</>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-2">
            <Alert className=" dark:bg-black">
              <CheckCircle2Icon />
              <AlertTitle>Yêu cầu lấy lại mật khẩu thành công</AlertTitle>
              <AlertDescription>
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn ,
                vui lòng kiểm tra hồm thư để tiếp tục
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
