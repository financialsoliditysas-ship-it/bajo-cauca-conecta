"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  DirectoryCategory,
  DirectoryBusiness,
  directoryBusinesses,
  directoryCategories
} from "@/data/directory";

const categoryInitials: Record<DirectoryCategory, string> = {
  Comida: "Co",
  Hogar: "Ho",
  Salud: "Sa",
  Belleza: "Be",
  Moda: "Mo",
  Ferreteria: "Fe",
  Servicios: "Se",
  Transporte: "Tr",
  Emprendimientos: "Em"
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function whatsappUrl(phone: string, businessName: string) {
  const cleaned = phone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(
    `Hola, vi ${businessName} en Mercaú y quiero mas informacion.`
  );

  return `https://wa.me/${cleaned}?text=${text}`;
}

function socialUrl(value: string | undefined, network: "instagram" | "facebook") {
  const clean = String(value || "").trim();
  if (!clean) return "";
  if (/^https?:\/\//i.test(clean)) return clean;

  const handle = clean.replace(/^@/, "").replace(/^\/+/, "");
  return network === "instagram"
    ? `https://instagram.com/${handle}`
    : `https://facebook.com/${handle}`;
}

function trackMetric(payload: Record<string, string>) {
  fetch("/api/metricas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: typeof window !== "undefined" ? window.location.pathname : "/",
      ...payload
    })
  }).catch(() => {});
}

export default function MercauDirectory() {
  const [activeCategory, setActiveCategory] = useState<DirectoryCategory | "">("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businesses, setBusinesses] =
    useState<DirectoryBusiness[]>(directoryBusinesses);
  const [directoryStatus, setDirectoryStatus] = useState(
    "Cargando negocios aprobados..."
  );

  async function loadBusinesses() {
    try {
      const response = await fetch("/api/negocios", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo cargar el directorio.");
      }

      if (Array.isArray(result.businesses) && result.businesses.length > 0) {
        setBusinesses(result.businesses);
        setDirectoryStatus(
          "Mostrando negocios aprobados desde Airtable."
        );
        return;
      }

      setBusinesses([]);
      setDirectoryStatus(
        "Todavia no hay negocios aprobados para mostrar."
      );
    } catch (error) {
      setBusinesses(directoryBusinesses);
      setDirectoryStatus(
        "No se pudo cargar Airtable. Mostrando datos demo temporalmente."
      );
    }
  }

  useEffect(() => {
    loadBusinesses();
    trackMetric({ type: "Visita", notes: "Home directorio" });
  }, []);

  const filteredBusinesses = useMemo(() => {
    const term = normalize(query);

    return businesses.filter((business) => {
      const categoryMatches = activeCategory
        ? business.category === activeCategory
        : true;
      const searchable = normalize(
        [
          business.name,
          business.category,
          business.neighborhood,
          business.description,
          business.status
        ].join(" ")
      );

      return categoryMatches && (!term || searchable.includes(term));
    });
  }, [activeCategory, businesses, query]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("Enviando inscripcion...");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo enviar.");
      }

      form.reset();
      setStatus("Inscripcion recibida. Queda pendiente de revision.");
      trackMetric({
        type: "Inscripcion enviada",
        businessName: String(payload.businessName || ""),
        category: String(payload.category || "")
      });
      loadBusinesses();
    } catch (error) {
      setStatus(
        "No se pudo conectar con Airtable en este entorno. Revisa las variables de Vercel."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="bg-emerald-950 text-white">
        <div className="container grid min-h-[calc(100vh-68px)] gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-end md:py-24">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-normal text-amber-300">
              Piloto Nechi
            </p>
            <h1 className="mt-3 text-6xl font-black leading-none sm:text-7xl md:text-8xl">
              Mercaú
            </h1>
            <p className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
              El directorio digital de Nechi
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/85">
              Encuentra negocios locales por categoria, contacta por WhatsApp y
              ayuda a construir la vitrina comercial del municipio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#inscripcion"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-amber-300 px-5 font-extrabold text-emerald-950"
              >
                Inscribir mi negocio
              </a>
              <a
                href="#directorio"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 font-extrabold text-emerald-950"
              >
                Explorar directorio
              </a>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              ["9", "Categorias"],
              ["2 min", "Registro"],
              ["WhatsApp", "Contacto directo"]
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-lg border border-white/25 bg-white/10 p-5"
              >
                <strong className="block text-2xl">{value}</strong>
                <span className="mt-1 block text-white/75">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf6] py-16 md:py-20">
        <div className="container">
          <p className="text-sm font-extrabold uppercase tracking-normal text-emerald-700">
            Buscar por categoria
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
            Lo que la gente necesita, organizado
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {directoryCategories.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => {
                  setActiveCategory((current) =>
                    current === category.name ? "" : category.name
                  );
                  trackMetric({
                    type: "Categoria",
                    category: category.name,
                    search: query
                  });
                }}
                className={`flex min-h-28 items-center gap-4 rounded-lg border bg-white p-5 text-left shadow-soft transition ${
                  activeCategory === category.name
                    ? "border-emerald-700 ring-4 ring-emerald-700/10"
                    : "border-slate-200 hover:border-emerald-700"
                }`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-100 font-black text-emerald-900">
                  {categoryInitials[category.name]}
                </span>
                <span>
                  <strong className="block">{category.name}</strong>
                  <span className="mt-1 block text-sm leading-5 text-slate-600">
                    {category.hint}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="directorio" className="bg-emerald-50 py-16 md:py-20">
        <div className="container">
          <p className="text-sm font-extrabold uppercase tracking-normal text-emerald-700">
            Directorio
          </p>
          <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
            Negocios visibles en Nechi
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <label className="grid flex-1 basis-80 gap-2 font-bold">
              Buscar
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="rounded-lg border border-slate-200 px-4 py-3 font-normal"
                type="search"
                placeholder="Comida, ferreteria, domicilio..."
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("");
                setQuery("");
              }}
              className="mt-auto inline-flex min-h-12 items-center rounded-lg bg-emerald-100 px-5 font-extrabold text-emerald-950"
            >
              Limpiar
            </button>
          </div>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            {directoryStatus}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((business) => (
              <article
                key={business.id}
                className="flex min-h-full flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-900">
                    {business.category}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 ${
                      business.status === "Destacado"
                        ? "bg-amber-200 text-amber-950"
                        : "bg-emerald-100 text-emerald-900"
                    }`}
                  >
                    {business.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black leading-tight">
                    {business.name}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {business.description}
                  </p>
                </div>

                <div className="grid gap-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="flex justify-between gap-4">
                    <span className="font-bold text-slate-900">Barrio/vereda</span>
                    <span className="text-right">{business.neighborhood}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-bold text-slate-900">Horario</span>
                    <span className="text-right">{business.hours}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-bold text-slate-900">Domicilios</span>
                    <span className="text-right">{business.deliveries || "Consultar"}</span>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                  <a
                    href={whatsappUrl(business.whatsapp, business.name)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackMetric({
                        type: "Clic WhatsApp",
                        businessId: business.id,
                        businessName: business.name,
                        category: business.category
                      })
                    }
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-300 px-4 font-extrabold text-emerald-950"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${business.whatsapp}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-100 px-4 font-extrabold text-emerald-950"
                  >
                    Llamar
                  </a>
                  {business.mapsUrl ? (
                    <a
                      href={business.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-100 px-4 font-extrabold text-slate-900"
                    >
                      Ubicacion
                    </a>
                  ) : null}
                  {business.instagram ? (
                    <a
                      href={socialUrl(business.instagram, "instagram")}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-100 px-4 font-extrabold text-slate-900"
                    >
                      Instagram
                    </a>
                  ) : null}
                  {business.facebook ? (
                    <a
                      href={socialUrl(business.facebook, "facebook")}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-100 px-4 font-extrabold text-slate-900"
                    >
                      Facebook
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          {filteredBusinesses.length === 0 ? (
            <div className="mt-8 rounded-lg border border-emerald-200 bg-white p-5 text-slate-700">
              No encontramos negocios con ese filtro.
            </div>
          ) : null}
        </div>
      </section>

      <section id="inscripcion" className="bg-[#fbfaf6] py-16 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-normal text-emerald-700">
              Inscripcion gratuita
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
              Agrega tu negocio al Directorio Digital de Nechi
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-slate-600">
              Tu solicitud queda como pendiente para revision. Cuando sea
              validada, el negocio puede mostrarse en el directorio y luego
              pasar a vender en Mercaú.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:grid-cols-2"
          >
            <label className="grid gap-2 font-bold">
              Nombre del negocio
              <input name="businessName" required className="rounded-lg border px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 font-bold">
              Propietario o contacto
              <input name="ownerName" required className="rounded-lg border px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 font-bold">
              WhatsApp
              <input name="whatsapp" required inputMode="tel" className="rounded-lg border px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 font-bold">
              Categoria
              <select name="category" required className="rounded-lg border px-4 py-3 font-normal">
                <option value="">Seleccionar categoria</option>
                {directoryCategories.map((category) => (
                  <option key={category.name}>{category.name}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 font-bold">
              Barrio o vereda
              <input name="neighborhood" className="rounded-lg border px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 font-bold">
              Horario
              <input name="hours" className="rounded-lg border px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 font-bold sm:col-span-2">
              Descripcion corta
              <textarea name="description" required rows={4} className="rounded-lg border px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 font-bold">
              Domicilios
              <select name="deliveries" className="rounded-lg border px-4 py-3 font-normal">
                <option>Consultar</option>
                <option>Si</option>
                <option>No</option>
              </select>
            </label>
            <label className="grid gap-2 font-bold">
              Quiere vender en Mercaú
              <select name="wantsMarketplace" className="rounded-lg border px-4 py-3 font-normal">
                <option>Despues</option>
                <option>Si</option>
              </select>
            </label>
            <label className="grid gap-2 font-bold">
              Instagram o usuario
              <input
                name="instagram"
                type="text"
                placeholder="@minegocio o instagram.com/minegocio"
                className="rounded-lg border px-4 py-3 font-normal"
              />
            </label>
            <label className="grid gap-2 font-bold">
              Facebook o nombre de la pagina
              <input
                name="facebook"
                type="text"
                placeholder="Mi Negocio Nechi o facebook.com/minegocio"
                className="rounded-lg border px-4 py-3 font-normal"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-700 px-5 font-extrabold text-white disabled:opacity-60 sm:col-span-2"
            >
              {isSubmitting ? "Enviando..." : "Enviar inscripcion"}
            </button>
            {status ? (
              <p className="font-bold text-emerald-900 sm:col-span-2">{status}</p>
            ) : null}
          </form>
        </div>
      </section>
    </>
  );
}
