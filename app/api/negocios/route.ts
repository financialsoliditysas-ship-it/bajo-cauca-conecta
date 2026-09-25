import { NextResponse } from "next/server";
import { loadDirectoryBusinesses } from "@/lib/airtable-directory";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const businesses = await loadDirectoryBusinesses();
    return NextResponse.json({ businesses });
  } catch (error) {
    return NextResponse.json(
      {
        error: "No se pudo cargar el directorio desde Airtable.",
        detail: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 503 }
    );
  }
}
