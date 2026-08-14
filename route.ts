import { NextRequest, NextResponse } from "next/server";

const FIELD_IDS = {
  businessName: "fldZAuId3Z7tmNg1y",
  ownerName: "fldnTNuAH1PTyItul",
  whatsapp: "fldCe1uBzTZhUZQMj",
  category: "fldyp3od5rTBa74il",
  municipality: "fldAziT6B2rW6HcyT",
  neighborhood: "fldzy7nwjlebys4w0",
  description: "fldlAXHZlQY2PLtvX",
  hours: "fldGg2RLescrYR2Z6",
  deliveries: "fldmIVPP97MTqrUfZ",
  wantsMarketplace: "fldQaB5YMQonivZKG",
  instagram: "fldkT6oBXKONCkak6",
  facebook: "fldC9M9vXoMFhdqUK",
  status: "fldyyLYvoyMdiK13C",
  source: "fldOZnz4JnwxkLTYA",
  notes: "fldrZ1LUWRcvKklVQ"
};

const allowedCategories = new Set([
  "Comida",
  "Hogar",
  "Salud",
  "Belleza",
  "Moda",
  "Ferreteria",
  "Servicios",
  "Transporte",
  "Emprendimientos"
]);

function cleanText(value: unknown, max = 240) {
  return String(value || "").trim().slice(0, max);
}

function normalizePhone(value: unknown) {
  return cleanText(value, 32).replace(/[^\d+]/g, "");
}

export async function POST(request: NextRequest) {
  const token = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_NEGOCIOS_TABLE_ID;

  if (!token || !baseId || !tableId) {
    return NextResponse.json(
      { error: "Airtable no esta configurado en este entorno." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const businessName = cleanText(body.businessName, 100);
  const ownerName = cleanText(body.ownerName, 100);
  const whatsapp = normalizePhone(body.whatsapp);
  const category = allowedCategories.has(body.category) ? body.category : "";

  if (!businessName || !ownerName || !whatsapp || !category) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios." },
      { status: 400 }
    );
  }

  const fields: Record<string, string> = {
    [FIELD_IDS.businessName]: businessName,
    [FIELD_IDS.ownerName]: ownerName,
    [FIELD_IDS.whatsapp]: whatsapp,
    [FIELD_IDS.category]: category,
    [FIELD_IDS.municipality]: "Nechi",
    [FIELD_IDS.neighborhood]: cleanText(body.neighborhood, 100),
    [FIELD_IDS.description]: cleanText(body.description, 600),
    [FIELD_IDS.hours]: cleanText(body.hours, 80) || "Consultar por WhatsApp",
    [FIELD_IDS.deliveries]:
      body.deliveries === "Si" ? "Si" : body.deliveries === "No" ? "No" : "Consultar",
    [FIELD_IDS.wantsMarketplace]: body.wantsMarketplace === "Si" ? "Si" : "Despues",
    [FIELD_IDS.instagram]: cleanText(body.instagram, 180),
    [FIELD_IDS.facebook]: cleanText(body.facebook, 180),
    [FIELD_IDS.status]: "Pendiente",
    [FIELD_IDS.source]: "Formulario",
    [FIELD_IDS.notes]: "Inscripcion recibida desde el MVP publico de Mercau."
  };

  Object.keys(fields).forEach((key) => {
    if (!fields[key]) delete fields[key];
  });

  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields, typecast: true })
  });

  const result = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "No se pudo crear el registro en Airtable.",
        detail: result?.error?.message || result?.error || "Error desconocido"
      },
      { status: response.status }
    );
  }

  return NextResponse.json(
    { ok: true, recordId: result.id, status: "Pendiente" },
    { status: 201 }
  );
}
