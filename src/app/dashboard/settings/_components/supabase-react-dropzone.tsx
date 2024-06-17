"use client";

import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function SupabaseReactDropzone({ userId }: { userId?: string } = {}) {
  const supabaseBrowserClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const [avatar, setAvatar] = useState<string | null>(userId ? `avatars/${userId}` : null);
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
        .uploadToSignedUrl(path, token, acceptedFiles[0]);
      // console.log({ data, error });
      if(typeof data.fullPath === "string"){
        setAvatar(data.fullPath);
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
    <div className="mx-auto mt-4 grid w-full gap-2">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
        <em>(Only *.jpeg and *.png images will be accepted)</em>
      </div>

      {avatar && (
        <Image
          alt="Expert image"
          className="aspect-square rounded-md object-cover"
          src={avatar}
          height="64"
          width="64"
        />
      )}
    </div>
  );
}
