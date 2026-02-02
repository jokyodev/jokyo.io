"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useQueryClient } from "@tanstack/react-query";
import { Ban, LockOpen, ShieldAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface iAppProps {
  student: any;
}

const BanUser = ({ student }: iAppProps) => {
  const [banReason, setBanResson] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const handleBan = () => {
    startTransition(async () => {
      await authClient.admin.banUser({
        userId: student.id,
        banReason: banReason,
        banExpiresIn: 60 * 60 * 24 * 7,
      });
      toast.error("Khóa tài khoản thành công");
      setOpen(false);
    });
  };

  const handleUnban = () => {
    startTransition(async () => {
      await authClient.admin.unbanUser({
        userId: student.id,
      });
      toast.success("Mở khóa tài khoản thành công");
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button variant={student.banned ? "secondary" : "destructive"}>
          {student.banned ? <LockOpen size={18} /> : <Ban size={18} />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {student.banned ? (
              <>
                <LockOpen size={18} />
              </>
            ) : (
              <>
                <Ban className="text-red-600" size={20} />
              </>
            )}
            {student.banned ? "Mở chặn học viên" : "Chặn học viên"}
          </DialogTitle>
        </DialogHeader>

        {/* User Info Section */}
        {!student.banned ? (
          <>
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
                Bạn có chắc chắn muốn chặn học viên này? Họ sẽ không thể đăng
                nhập hoặc truy cập vào các khóa học đã mua.
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
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 p-4 mt-4 rounded-lg border bg-linear-to-br from-zinc-800 to-zinc-900 ">
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
            <Alert
              variant="destructive"
              className="bg-destructive/5 border-destructive/20 mt-4"
            >
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle className="font-bold tracking-tight">
                Tài khoản bị khóa
              </AlertTitle>
              <AlertDescription className="text-sm opacity-90">
                <span className="font-semibold text-destructive">Lý do:</span>{" "}
                {student.banReason || "Vi phạm điều khoản cộng đồng"}
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button variant="outline" type="button">
                Hủy
              </Button>
              <Button disabled={isPending} onClick={handleUnban} type="submit">
                Xác nhận mở
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BanUser;
