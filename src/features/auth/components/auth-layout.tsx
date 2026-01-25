import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

import Image from "next/image";
import { Quote } from "lucide-react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-svh grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col items-center justify-center border">
        {/* LOGO */}
        <div className="flex items-center gap-2 justify-center">
          <Image
            src="/logo.png"
            width={30}
            height={30}
            alt="Jokyo.io"
            className="rounded-sm"
          />
          <span className="font-bold">Jokyo.com</span>
        </div>

        <div className="py-3 w-full flex items-center justify-center">
          {children}
        </div>
      </div>
      <div className="flex items-center justify-center bg-linear-to-br from-indigo-500 to-indigo-900">
        <div className="w-full max-w-100 py-10 bg-white rounded-lg px-10">
          <p className="text-muted-foreground text-sm">
            Lập trình không chỉ là viết mã, mà là nghệ thuật giải quyết vấn đề
            và kiến tạo tương lai. Mỗi dòng code sạch là một viên gạch xây nên
            thế giới số đầy kỳ diệu.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div>
              <Image
                src="/logo.png"
                width={42}
                height={42}
                alt="Duong Quoc Thu"
                className="rounded-full border-2 border-cyan-500/50 p-0.5"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">
                @duongquocthu
              </span>
              <span className="text-muted-foreground text-xs font-medium  tracking-wider">
                Software Developer
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
