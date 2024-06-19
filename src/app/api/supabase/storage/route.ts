import { auth } from "@/auth";
import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const {
      user: { id },
    } = session;
    // Generate signed upload url to use on client.
    const supabaseAdmin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabaseAdmin.storage
      .from("avatars")
      .createSignedUploadUrl(id, { upsert: true });
    console.log(error);
    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
