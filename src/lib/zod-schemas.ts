import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(1, { error: "Họ và tên không được để trống" }),
    email: z.email({ error: "Địa chỉ email không hợp lệ" }),
    password: z.string().min(8, { error: "Mật khẩu phải có ít nhất 8 ký tự" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Mật khẩu xác nhận không chính xác",
  });

export const signInSchema = z.object({
  email: z.email({ error: "Địa chỉ email không hợp lệ" }),
  password: z.string().min(8, { error: "Mật khẩu phải có ít nhất 8 ký tự" }),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;
