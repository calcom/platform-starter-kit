"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import { User } from "lucide-react";
import Image from "next/image";
import type StorageFileApi from "node_modules/.pnpm/@supabase+storage-js@2.6.0/node_modules/@supabase/storage-js/src/packages/StorageFileApi";
import React, { type SyntheticEvent, useState } from "react";
import { useDropzone } from "react-dropzone";

type SupabaseStorage = (typeof StorageFileApi)["prototype"];
type FileBody = Parameters<SupabaseStorage["uploadToSignedUrl"]>[2];
export default function SupabaseReactDropzone({
  userId,
  userInitials,
}: {
  userId: string;
  userInitials?: string;
}) {
  const [error, setError] = useState<SyntheticEvent<HTMLImageElement, Event> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabaseBrowserClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const [avatar, setAvatar] = useState<string | null>(`avatars/${userId}`);
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDropAccepted: async (acceptedFiles) => {
      setAvatar(null);
      // console.log(acceptedFiles);
      const { path, token }: { path: string; token: string } = await fetch("/api/supabase/storage").then(
        (res) => res.json()
      );

      const { data, error } = await supabaseBrowserClient.storage
        .from("avatars")
        .uploadToSignedUrl(path, token, acceptedFiles[0] as FileBody);
      // console.log({ data, error });
      if (typeof data?.fullPath === "string") {
        setAvatar(data?.fullPath);
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
    <div className="mx-auto grid w-full gap-2">
      {isLoading && <Skeleton className="size-16" />}
      {avatar && (
        <Avatar>
          <Image
            alt="Expert image"
            className="aspect-square rounded-md object-cover"
            src={avatar}
            height="64"
            width="64"
            onLoadingComplete={() => setIsLoading(false)}
            onError={setError}
          />
          <AvatarFallback>{userInitials?.toLocaleUpperCase() ?? <User className="size-16" />}</AvatarFallback>
        </Avatar>
      )}
      {error && (
        <Avatar>
          <User className="size-full" />
        </Avatar>
      )}
      <div {...getRootProps({ className: cn("dropzone border-dashed border p-8 rounded-md") })}>
        <input {...getInputProps()} />
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
        <em>(Only *.jpeg and *.png images will be accepted)</em>
      </div>
    </div>
  );
}
