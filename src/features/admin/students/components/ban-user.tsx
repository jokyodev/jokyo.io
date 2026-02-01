"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { Ban } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface iAppProps {
  student: any;
}

const BanUser = ({ student }: iAppProps) => {
  const [banReason, setBanResson] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleBan = () => {
    startTransition(async () => {
      await authClient.admin.banUser({
        userId: student.id,
        banReason: banReason,
        banExpiresIn: 60 * 60 * 24 * 7,
      });
      toast.error("Khóa tài khoản thành công");
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Ban size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="text-red-600" size={20} />
            Chặn học viên
          </DialogTitle>
        </DialogHeader>

        {/* User Info Section */}
        <div className="flex items-center gap-4 p-4 mt-4 rounded-lg border ">
          <Avatar className="h-12 w-12 border-2  shadow-sm">
            <AvatarImage src={student.image || ""} />
            <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold ">{student.name}</span>
            <span className="text-xs ">{student.email}</span>
            <div className="mt-1">
              <Badge variant="outline" className="text-[10px] h-5 ">
                ID: {student.id.slice(0, 8)}...
              </Badge>
            </div>
          </div>
        </div>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Bạn có chắc chắn muốn chặn học viên này? Họ sẽ không thể đăng nhập
            hoặc truy cập vào các khóa học đã mua.
          </p>

          {/* Ở đây bạn có thể thêm Textarea để nhập banReason */}
          <Label htmlFor="reason" className="text-xs font-bold uppercase ">
            Lý do chặn
          </Label>
          <Textarea
            value={banReason}
            onChange={(event: any) => setBanResson(event.target.value)}
            id="reason"
            placeholder="Nhập lý do vi phạm..."
            className="mt-1.5 focus-visible:ring-red-500"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" type="button">
            Hủy
          </Button>
          <Button
            disabled={isPending}
            onClick={handleBan}
            variant="destructive"
            type="submit"
          >
            Xác nhận chặn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BanUser;
