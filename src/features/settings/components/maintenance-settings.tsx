"use client";
import LoadingSpinner from "@/components/loading-spinner";
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
import {
  maintenanceSchema,
  MaintenanceSchemaType,
} from "@/lib/zod-schemas/maintenance-schema";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CircleCheckBig, Lightbulb, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const MaintenanceSettings = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateMaintenance = useMutation(
    trpc.settingRouter.updateMaintenance.mutationOptions({
      onSuccess: () => {
        toast.success("Bật chế độ bảo trì hoàn tất");
        queryClient.invalidateQueries({
          queryKey: trpc.settingRouter.getSiteConfig.queryKey(),
        });
      },
      onError: () => {
        toast.error("Thao tác thất bại");
      },
    }),
  );

  const { data: siteConfig, isLoading } = useQuery(
    trpc.settingRouter.getSiteConfig.queryOptions(),
  );

  const disableMaintenance = useMutation(
    trpc.settingRouter.disableMaintenance.mutationOptions({
      onSuccess: () => {
        toast.success("Bảo trì hoàn tất");
        queryClient.invalidateQueries({
          queryKey: trpc.settingRouter.getSiteConfig.queryKey(),
        });
      },
      onError: (error: any) => {
        toast.error("Có lỗi xảy ra khi mở lại server");
      },
    }),
  );

  const form = useForm<MaintenanceSchemaType>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      maintenanceMsg:
        "Hệ thống đang bảo trì để nâng cấp bài học. Vui lòng quay lại sau!",
      maintenanceStart: new Date(), // Hoặc dùng new Date() nếu muốn mặc định là ngay bây giờ
      maintenanceEnd: new Date(),
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const onSubmit = (values: MaintenanceSchemaType) => {
    updateMaintenance.mutateAsync({
      maintenanceMsg: values.maintenanceMsg,
      maintenanceStart: values.maintenanceStart!,
      maintenanceEnd: values.maintenanceEnd!,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Bảo trì hệ thống
          {siteConfig?.maintenanceMode && (
            <Button
              disabled={disableMaintenance.isPending}
              onClick={() => disableMaintenance.mutate()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium"
            >
              {disableMaintenance.isPending ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Đang tắt bảo trì
                </>
              ) : (
                <>
                  <CircleCheckBig /> Hoàn tất bảo trì
                </>
              )}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors);
            })}
            className="flex flex-col gap-5"
          >
            <FormField
              name="maintenanceMsg"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel> Lý do bảo trì</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={siteConfig?.maintenanceMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                name="maintenanceStart"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        disabled={siteConfig?.maintenanceMode}
                        value={
                          field.value instanceof Date
                            ? new Date(
                                field.value.getTime() -
                                  field.value.getTimezoneOffset() * 60000,
                              )
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        // Khi người dùng chọn xong, chuyển chuỗi ngược lại thành Date object cho Form
                        onChange={(e) => {
                          const dateStr = e.target.value;
                          field.onChange(
                            dateStr ? new Date(dateStr) : undefined,
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="maintenanceEnd"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian kết thúc (Dự kiến)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={siteConfig?.maintenanceMode}
                        type="datetime-local"
                        value={
                          field.value instanceof Date
                            ? new Date(
                                field.value.getTime() -
                                  field.value.getTimezoneOffset() * 60000,
                              )
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        onChange={(e) => {
                          const dateStr = e.target.value;
                          field.onChange(
                            dateStr ? new Date(dateStr) : undefined,
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={
                updateMaintenance.isPending || siteConfig?.maintenanceMode
              }
            >
              {updateMaintenance.isPending ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Xin chờ
                </>
              ) : (
                <>Bắt đầu bảo trì</>
              )}
            </Button>
            <div className="mt-4 p-4 rounded-lg  border flex gap-3">
              <Lightbulb className=" shrink-0" size={18} />
              <div>
                <p className="text-sm font-semibold ">Mẹo nhỏ cho Admin</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Nên đặt thời gian kết thúc sớm hơn thực tế 15 phút. Điều này
                  giúp bạn có thời gian kiểm tra lại hệ thống trước khi học viên
                  ồ ạt truy cập.
                </p>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceSettings;
