"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ResourcesLinks = () => {
  const trpc = useTRPC();
  const [links, setLinks] = useState<string[]>([]);

  const params = useParams();
  const courseSlug = params?.courseSlug?.toString() || "";
  const { data, isLoading } = useQuery(
    trpc.resourceRouter.getAll.queryOptions({
      courseSlug: courseSlug,
    }),
  );

  useEffect(() => {
    if (data?.resourcesLinks) {
      const linksArray = data?.resourcesLinks?.split("\n") || [];
      setLinks(linksArray);
    }
  }, [isLoading, data?.resourcesLinks]);

  if (isLoading)
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Đang tải tài nguyên</span>
      </div>
    );
  return (
    <div>
      <div>
        {links.length === 0 && (
          <span className="text-sm text-muted-foreground">
            Không có tài nguyên
          </span>
        )}
        {links.length > 0 && (
          <>
            <h3 className="uppercase  font-medium mb-2">Liên kết</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {links.map((link, index) => {
                const split = link.split(":");
                return (
                  <div key={index} className="border py-2 px-2 rounded-sm ">
                    <p className="text-sm text-zinc-600">
                      {split[0]}
                      {":"}
                      <Link
                        href={`${split[1]}:${split[2]}`}
                        target="_blank"
                        className="text-green-500 block"
                      >
                        {split[1]}:{split[2].substring(0, 20)}...
                      </Link>
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResourcesLinks;
