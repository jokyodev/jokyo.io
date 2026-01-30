import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { v4 as uuid } from "uuid";
export const imageRouter = createTRPCRouter({
  getUploadUrl: adminProcedure
    .input(
      z.object({
        fileExtension: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const fileName = uuid();
      const uploadUrl = `${process.env.BUNNY_STORAGE_REGION}/${process.env.BUNNY_STORAGE_ZONE_NAME}/${fileName}.${input.fileExtension}`;
      return {
        accessKey: process.env.BUNNY_STORAGE_API_KEY,
        uploadUrl: uploadUrl,
        fileId: fileName + "." + input.fileExtension,
      };
    }),

  getDeleteUrl: adminProcedure
    .input(
      z.object({
        fileName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deleteUrl = `${process.env.BUNNY_STORAGE_REGION}/${process.env.BUNNY_STORAGE_ZONE_NAME}/${input.fileName}`;
      return {
        accessKey: process.env.BUNNY_STORAGE_API_KEY,
        deleteUrl: deleteUrl,
      };
    }),
});
