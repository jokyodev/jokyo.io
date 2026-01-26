import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { PrismaClient } from "@/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { resend } from "./resent";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await resend.emails.send({
        from: "Jokyo.com <onboarding@resend.dev>",
        to: user.email,
        subject: "🔐 Đặt lại mật khẩu của bạn tại Jokyo.com",
        // Phiên bản text thuần dành cho các thiết bị cũ hoặc ứng dụng đọc mail đơn giản
        text: `Chào ${user.name},\n\nBạn đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập đường dẫn sau để tiếp tục: ${url}\n\nNếu không phải bạn yêu cầu, hãy bỏ qua email này.`,
        html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; }
        .logo { font-weight: bold; font-size: 24px; color: black; margin-bottom: 24px; text-align: center; }
        .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .title { font-size: 20px; font-weight: 600; margin-bottom: 16px; text-align: center; }
        .text { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; text-align: center; }
        .button-wrapper { text-align: center; margin-bottom: 24px; }
        .button { background-color: black; color: #ffffff !important; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block; }
        .footer { font-size: 12px; color: #9ca3af; text-align: center; margin-top: 32px; line-height: 1.5; }
        .link-text { word-break: break-all; color: #0891b2; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Jokyo<span style="color: #1a1a1a">.com</span></div>
        <div class="card">
          <h1 class="title">Đặt lại mật khẩu</h1>
          <p class="text">
            Chào <strong>${user.name || "bạn"}</strong>,<br>
            Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản Jokyo của bạn. Hãy nhấn vào nút bên dưới để bắt đầu:
          </p>
          <div class="button-wrapper">
            <a href="${url}" class="button">Thiết lập mật khẩu mới</a>
          </div>
          <p class="text" style="font-size: 13px;">
            Nếu nút trên không hoạt động, bạn có thể copy link này vào trình duyệt: <br>
            <span class="link-text">${url}</span>
          </p>
        </div>
        <div class="footer">
          Nếu bạn không yêu cầu đặt lại mật khẩu, bạn có thể an tâm bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi trừ khi bạn truy cập link trên.
          <br><br>
          © 2026 Jokyo Team. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
