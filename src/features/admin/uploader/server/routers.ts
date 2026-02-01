import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { v4 as uuid } from "uuid";
import axios from "axios";
export const imageRouter = createTRPCRouter({
  createUploadUrl: adminProcedure
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

  createDeleteUrl: adminProcedure
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

export const videoRouter = createTRPCRouter({
  create: adminProcedure.mutation(async ({ ctx, input }) => {
    const uploadUrl = `${process.env.NEXT_PUBLIC_BUNNY_STREAM_BASE_URL}/library/${process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID}/videos`;
    const videoName = uuid();
    const response = await axios.post(
      uploadUrl,
      {
        title: videoName,
      },
      {
        headers: {
          AccessKey: process.env.BUNNY_STREAM_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );
    return {
      guid: response.data.guid,
      accessKey: process.env.BUNNY_STREAM_API_KEY,
    };
  }),
  createDeleteVideoUrl: adminProcedure
    .input(
      z.object({
        guid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deleteVideoUrl = `${process.env.NEXT_PUBLIC_BUNNY_STREAM_BASE_URL}/library/${process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID}/videos/${input.guid}`;

      return {
        accessKey: process.env.BUNNY_STREAM_API_KEY,
        deleteVideoUrl: deleteVideoUrl,
      };
    }),
});
