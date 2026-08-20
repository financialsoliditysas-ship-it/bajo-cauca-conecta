"use client";

import { FormEvent, useEffect, useState } from "react";

type UpdateBusiness = {
  name: string;
  category: string;
  neighborhood: string;
  description: string;
  hours: string;
  whatsapp: string;
  deliveries: string;
  instagram: string;
  facebook: string;
  mapsUrl: string;
  status: string;
};

export default function UpdateBusinessForm({ token }: { token: string }) {
  const [business, setBusiness] = useState<UpdateBusiness | null>(null);
  const [pageStatus, setPageStatus] = useState("Cargando enlace privado...");
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      try {
        const response = await fetch(`/api/actualizaciones/${token}`, {
          cache: "no-store"
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "No se pudo cargar el negocio.");
        }

        setBusiness(result.business);
        setPageStatus("");
      } catch (error) {
        setPageStatus(
          "Este enlace privado no existe, fue cambiado o no esta disponible."
        );
      }
    }

    loadBusiness();
  }, [token]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    const hasChanges = [
      "requestedChanges",
      "newDescription",
      "newWhatsapp",
      "newNeighborhood",
      "newHours",
      "deliveries",
      "instagram",
      "facebook",
      "mapsUrl"
    ].some((field) => String(payload[field] || "").trim());

    if (!hasChanges) {
      setSubmitStatus("Escribe al menos un dato para actualizar.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("Enviando solicitud...");

    try {
      const response = await fetch(`/api/actualizaciones/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo enviar la solicitud.");
      }

      form.reset();
      setSubmitStatus(
        "Solicitud recibida. Mercáu revisara el cambio antes de publicarlo."
      );
    } catch (error) {
      setSubmitStatus(
        "No se pudo enviar la solicitud. Intenta nuevamente o escribe por WhatsApp a Mercáu."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfaf6]">
      <section className="bg-emerald-950 py-12 text-white">
        <div className="container">
          <p className="text-sm font-extrabold uppercase tracking-normal text-amber-300">
            Link privado del negocio
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
            Actualizar ficha en Mercáu
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-emerald-50/85">
            Este enlace es privado para administrar la información de tu negocio.
            No lo compartas con otras personas. Los cambios enviados serán
            revisados antes de publicarse.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            {business ? (
              <>
                <p className="text-sm font-extrabold uppercase tracking-normal text-emerald-700">
                  Ficha actual
                </p>
                <h2 className="mt-2 text-3xl font-black leading-tight">
                  {business.name}
                </h2>
                <div className="mt-5 grid gap-3 text-sm text-slate-700">
                  <p><strong>Categoria:</strong> {business.category || "Por confirmar"}</p>
                  <p><strong>Direccion:</strong> {business.neighborhood || "Por confirmar"}</p>
                  <p><strong>WhatsApp:</strong> {business.whatsapp || "Por confirmar"}</p>
                  <p><strong>Horario:</strong> {business.hours || "Por confirmar"}</p>
                  <p><strong>Domicilios:</strong> {business.deliveries || "Consultar"}</p>
                  <p><strong>Estado:</strong> {business.status || "Pendiente"}</p>
                </div>
                <p className="mt-5 leading-7 text-slate-600">
                  {business.description || "Sin descripcion publicada."}
                </p>
              </>
            ) : (
              <p className="font-bold text-slate-700">{pageStatus}</p>
            )}
          </aside>

          <form
            onSubmit={onSubmit}
            className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:grid-cols-2"
          >
            <label className="grid gap-2 font-bold sm:col-span-2">
              Qué quieres cambiar
              <textarea
                name="requestedChanges"
                rows={5}
                placeholder="Ejemplo: cambie de numero, ahora atiendo hasta las 9 p.m. y hago domicilios."
                className="rounded-lg border px-4 py-3 font-normal"
              />
            </label>
            <label className="grid gap-2 font-bold sm:col-span-2">
              Nueva descripcion publica
              <textarea
                name="newDescription"
                rows={4}
                placeholder="Escribe aqui como quieres que aparezca la descripcion del negocio."
                className="rounded-lg border px-4 py-3 font-normal"
              />
            </label>
            <label className="grid gap-2 font-bold">
              WhatsApp de confirmacion
              <input
                name="confirmationWhatsapp"
                inputMode="tel"
                className="rounded-lg border px-4 py-3 font-normal"
              />
            </label>
            <label className="grid gap-2 font-bold">
              Nuevo WhatsApp
              <input
                name="newWhatsapp"
                inputMode="tel"
                className="rounded-lg border px-4 py-3 font-normal"
              />
            </label>
            <label className="grid gap-2 font-bold">
              Nueva direccion
              <input name="newNeighborhood" className="rounded-lg border px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 font-bold">
              Nuevo horario
              <input name="newHours" className="rounded-lg border px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 font-bold">
              Domicilios
              <select name="deliveries" className="rounded-lg border px-4 py-3 font-normal">
                <option value="">Sin cambio</option>
                <option>Consultar</option>
                <option>Si</option>
                <option>No</option>
              </select>
            </label>
            <label className="grid gap-2 font-bold">
              Instagram
              <input
                name="instagram"
                placeholder="@minegocio o link"
                className="rounded-lg border px-4 py-3 font-normal"
              />
            </label>
            <label className="grid gap-2 font-bold">
              Facebook
              <input
                name="facebook"
                placeholder="Nombre de pagina o link"
                className="rounded-lg border px-4 py-3 font-normal"
              />
            </label>
            <label className="grid gap-2 font-bold sm:col-span-2">
              Google Maps
              <input
                name="mapsUrl"
                placeholder="Link de ubicacion si lo tienes"
                className="rounded-lg border px-4 py-3 font-normal"
              />
            </label>
            <button
              type="submit"
              disabled={!business || isSubmitting}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-700 px-5 font-extrabold text-white disabled:opacity-60 sm:col-span-2"
            >
              {isSubmitting ? "Enviando..." : "Enviar solicitud de cambio"}
            </button>
            {submitStatus ? (
              <p className="font-bold text-emerald-900 sm:col-span-2">
                {submitStatus}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  );
}
