import { env } from "@/env";

export default function supabaseLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${src}?width=${width}&quality=${quality || 75}`;
}
