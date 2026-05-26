import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@/lib/supabase/server";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2";

export async function POST(request: NextRequest) {
  // Solo admins autenticados pueden generar presigned URLs
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { filename, contentType, folder = "uploads" } = await request.json();

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: "filename y contentType son requeridos" },
      { status: 400 }
    );
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "bin";
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
  const publicUrl = `${R2_PUBLIC_URL}/${key}`;

  return NextResponse.json({ signedUrl, publicUrl });
}
