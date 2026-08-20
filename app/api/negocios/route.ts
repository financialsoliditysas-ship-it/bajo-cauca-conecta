import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FIELD_IDS = {
  businessName: "fldZAuId3Z7tmNg1y",
  whatsapp: "fldCe1uBzTZhUZQMj",
  category: "fldyp3od5rTBa74il",
  neighborhood: "fldzy7nwjlebys4w0",
  description: "fldlAXHZlQY2PLtvX",
  hours: "fldGg2RLescrYR2Z6",
  status: "fldyyLYvoyMdiK13C",
  source: "fldOZnz4JnwxkLTYA"
};

const approvedStatuses = new Set(["Verificado", "Destacado"]);

function selectName(value: unknown) {
  if (typeof value === "object" && value && "name" in value) {
    return String((value as { name?: unknown }).name || "");
  }

  return String(value || "");
}

function text(fields: Record<string, unknown>, fieldId: string, fallback = "") {
  return String(fields[fieldId] || fallback).trim();
}

export async function GET() {
  const token = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_NEGOCIOS_TABLE_ID;

  if (!token || !baseId || !tableId) {
    return NextResponse.json(
      { error: "Airtable no esta configurado en este entorno." },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({
    pageSize: "100",
    returnFieldsByFieldId: "true",
    filterByFormula:
      "OR({Estado} = 'Verificado', {Estado} = 'Destacado')"
  });

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${tableId}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    }
  );

  const result = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "No se pudo cargar el directorio desde Airtable.",
        detail: result?.error?.message || result?.error || "Error desconocido"
      },
      { status: response.status }
    );
  }

  const businesses = (result.records || [])
    .map((record: { id: string; fields?: Record<string, unknown> }) => {
      const fields = record.fields || {};
      const status = selectName(fields[FIELD_IDS.status]);
      const category = selectName(fields[FIELD_IDS.category]);

      if (!approvedStatuses.has(status)) return null;

      return {
        id: record.id,
        name: text(fields, FIELD_IDS.businessName, "Negocio sin nombre"),
        category,
        neighborhood: text(fields, FIELD_IDS.neighborhood, "Nechi"),
        description: text(
          fields,
          FIELD_IDS.description,
          "Negocio local inscrito en el directorio."
        ),
        hours: text(fields, FIELD_IDS.hours, "Consultar por WhatsApp"),
        whatsapp: text(fields, FIELD_IDS.whatsapp),
        status,
        source: selectName(fields[FIELD_IDS.source]) || "Airtable"
      };
    })
    .filter(Boolean);

  return NextResponse.json({ businesses });
}
