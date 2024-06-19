"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import slugify, { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import type StorageFileApi from "node_modules/.pnpm/@supabase+storage-js@2.6.0/node_modules/@supabase/storage-js/src/packages/StorageFileApi";
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

type SupabaseStorage = (typeof StorageFileApi)["prototype"];
type FileBody = Parameters<SupabaseStorage["uploadToSignedUrl"]>[2];
export default function SupabaseReactDropzone({ userId }: { userId: string; userInitials?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");

  const supabaseBrowserClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const [avatar, setAvatar] = useState<string | null>(`avatars/${userId}`);
  useEffect(() => {
    setStatus("idle");
  }, [avatar]);
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      // avif as well:
      "image/avif": [],
    },
    onDropAccepted: async (acceptedFiles) => {
      setAvatar(null);
      const { path, token }: { path: string; token: string } = await fetch("/api/supabase/storage").then(
        (res) => res.json()
      );

      const { data, error } = await supabaseBrowserClient.storage
        .from("avatars")
        .uploadToSignedUrl(path, token, acceptedFiles[0] as FileBody);
      if (typeof data?.fullPath === "string") {
        // @ts-expect-error acceptedFiles isn't typed
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setAvatar(`${data?.fullPath}?filename=${encodeURIComponent(slugify(acceptedFiles[0].path))}`);
      }
    },
  });

  // const acceptedFileItems = acceptedFiles.map((file) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));

  // const fileRejectionItems = fileRejections.map(({ file, errors }) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //     <ul>
  //       {errors.map((e) => (
  //         <li key={e.code}>{e.message}</li>
  //       ))}
  //     </ul>
  //   </li>
  // ));

  return (
    <div className="mx-auto grid w-full gap-4">
      {status === "error" ? (
        <div className="aspect-square size-16 rounded-md bg-muted" />
      ) : status === "loading" || !avatar ? (
        <Skeleton className="aspect-square size-16 rounded-md" />
      ) : (
        <Image
          alt="Expert image"
          className="aspect-square rounded-md object-cover"
          src={avatar}
          height="64"
          width="64"
          onLoadingComplete={() => setStatus("success")}
          onLoad={() => setStatus("loading")}
          onError={() => setStatus("error")}
        />
      )}
      <div
        {...getRootProps({
          className: cn(
            "dropzone border-dashed border px-3 py-8 rounded-md hover:border-foreground/40 cursor-pointer"
          ),
        })}>
        <input {...getInputProps()} />
        <p className="text-sm text-muted-foreground">Only *.jpeg, *.png and *.avif images will be accepted</p>
      </div>
    </div>
  );
}
