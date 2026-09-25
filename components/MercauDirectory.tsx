"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  DirectoryBusiness,
  DirectoryCategory,
  directoryCategories,
  directoryMunicipalities
} from "@/data/directory";

const categoryTheme: Record<DirectoryCategory, { label: string; initials: string; tone: string; terms: string[] }> = {
  "Comidas y Bebidas": {
    label: "Comidas y Bebidas",
    initials: "CB",
    tone: "from-red-500 to-orange-400",
    terms: ["comida", "restaurante", "bebida", "licor", "licorera", "almuerzo", "cena", "rapida", "domicilio"]
  },
  Hogar: {
    label: "Hogar",
    initials: "Ho",
    tone: "from-emerald-500 to-teal-500",
    terms: ["hogar", "tienda", "variedades", "casa", "aseo", "mercado"]
  },
  Salud: {
    label: "Salud",
    initials: "Sa",
    tone: "from-sky-500 to-cyan-500",
    terms: ["salud", "drogueria", "farmacia", "medicina", "bienestar"]
  },
  Belleza: {
    label: "Belleza",
    initials: "Be",
    tone: "from-pink-500 to-rose-400",
    terms: ["belleza", "barberia", "peluqueria", "unas", "salon", "estetica"]
  },
  Moda: {
    label: "Moda",
    initials: "Mo",
    tone: "from-violet-500 to-fuchsia-500",
    terms: ["moda", "ropa", "calzado", "tenis", "accesorios"]
  },
  Ferreteria: {
    label: "Ferretería",
    initials: "Fe",
    tone: "from-amber-500 to-yellow-500",
    terms: ["ferreteria", "herramientas", "materiales", "repuestos", "tornillos", "construccion"]
  },
  Servicios: {
    label: "Servicios",
    initials: "Se",
    tone: "from-blue-500 to-indigo-500",
    terms: ["servicio", "servicios", "arreglo", "reparacion", "ventilador", "ventiladores", "tecnico", "mantenimiento", "domicilios"]
  },
  Transporte: {
    label: "Transporte",
    initials: "Tr",
    tone: "from-slate-600 to-slate-800",
    terms: ["transporte", "moto", "taxi", "mensajeria", "domicilio", "domicilios", "envio"]
  },
  Emprendimientos: {
    label: "Emprendimientos",
    initials: "Em",
    tone: "from-green-500 to-lime-500",
    terms: ["emprendimiento", "emprendedor", "marca", "local", "redes"]
  }
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function displayCategory(category: string) {
  return category === "Ferreteria" ? "Ferretería" : category;
}

function normalizePhoneForColombia(phone: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("57")) return digits;
  if (digits.length === 10 && digits.startsWith("3")) return `57${digits}`;
  return digits;
}

function phoneForCall(phone: string) {
  const normalized = normalizePhoneForColombia(phone);
  return normalized ? `+${normalized}` : "";
}

function whatsappUrl(phone: string, businessName: string) {
  const normalized = normalizePhoneForColombia(phone);
  const text = encodeURIComponent(
    `Hola, vi ${businessName} en Mercáu y quiero más información.`
  );

  return normalized ? `https://wa.me/${normalized}?text=${text}` : "#";
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

function businessUrl(business: DirectoryBusiness) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.mercau.co";
  return `${origin}/negocios/${business.id}`;
}

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m21 21-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <path d="M20.8 5.9a5.1 5.1 0 0 0-7.2 0L12 7.5l-1.6-1.6a5.1 5.1 0 0 0-7.2 7.2L12 21l8.8-7.9a5.1 5.1 0 0 0 0-7.2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.5-4.4a8.4 8.4 0 1 1 15.5-4.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.8 8.6c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c-.1.2-.2.3 0 .5a6.5 6.5 0 0 0 2.9 2.5c.2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.7-.1l1.5.7c.3.1.5.3.5.5 0 .6-.3 1.3-.8 1.6-.5.4-1.6.7-3.7-.2-3.2-1.4-5.3-4.7-5.5-5-.1-.2-.9-1.2-.9-2.2 0-1 .5-1.5.7-1.7Z" fill="currentColor" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10h16l-1.2-5H5.2L4 10ZM6 10v9h12v-9M9 19v-5h6v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-1.5 pb-[calc(0.35rem+env(safe-area-inset-bottom))] pt-1 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden" aria-label="Navegación principal">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 text-[10px] font-bold text-slate-500">
        <a href="#" className="grid min-h-10 place-items-center rounded-xl text-red-600">
          <StoreIcon />
          Inicio
        </a>
        <a href="#directorio" className="grid min-h-10 place-items-center rounded-xl">
          <SearchIcon className="h-5 w-5" />
          Buscar
        </a>
        <a href="#directorio" className="grid min-h-10 place-items-center rounded-xl">
          <HeartIcon />
          Favoritos
        </a>
        <a href="#inscripcion" className="grid min-h-10 place-items-center rounded-xl">
          <MenuIcon />
          Mi cuenta
        </a>
      </div>
    </nav>
  );
}

function BusinessVisual({ business, compact = false }: { business: DirectoryBusiness; compact?: boolean }) {
  const theme = categoryTheme[business.category] || categoryTheme.Servicios;

  return (
    <div className={`relative grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br ${theme.tone} text-white ${compact ? "h-20 w-20 sm:h-24 sm:w-24" : "h-28 w-28 md:h-32 md:w-32"}`}>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_32%)]" />
      <span className="relative text-2xl font-black">{theme.initials}</span>
    </div>
  );
}

function BusinessCard({
  business,
  onOpen
}: {
  business: DirectoryBusiness;
  onOpen: (business: DirectoryBusiness) => void;
}) {
  const callPhone = phoneForCall(business.whatsapp);
  const hasWhatsapp = Boolean(normalizePhoneForColombia(business.whatsapp));
  const isFeatured = business.status === "Destacado";

  return (
    <article className="w-full min-w-0 rounded-[1.25rem] border border-slate-200 bg-white p-2 shadow-soft transition hover:-translate-y-0.5 hover:border-red-200 sm:p-3">
      <div className="flex min-w-0 gap-2 sm:gap-3">
        <button type="button" onClick={() => onOpen(business)} className="text-left" aria-label={`Ver ficha de ${business.name}`}>
          <BusinessVisual business={business} compact />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1.5 sm:gap-2">
            <button type="button" onClick={() => onOpen(business)} className="min-w-0 flex-1 text-left">
              <h3 className="line-clamp-2 text-sm font-black leading-tight text-slate-950 sm:text-base md:text-lg">{business.name}</h3>
            </button>
            <button type="button" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 sm:h-9 sm:w-9" aria-label="Guardar negocio">
              <HeartIcon />
            </button>
          </div>

          <p className="mt-0.5 text-xs font-semibold text-slate-700 sm:text-sm">{displayCategory(business.category)}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-slate-500 sm:text-xs">
            <span className="inline-flex items-center gap-1">
              <LocationIcon className="h-3.5 w-3.5" />
              {business.municipality}
            </span>
            {business.neighborhood ? <span>{business.neighborhood}</span> : null}
          </div>
          {isFeatured ? (
            <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-800">
              Destacado
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-[1fr_auto] gap-1.5 sm:gap-2">
        <a
          href={whatsappUrl(business.whatsapp, business.name)}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!hasWhatsapp}
          onClick={() =>
            trackMetric({
              type: "Clic WhatsApp",
              businessId: business.id,
              businessName: business.name,
              category: business.category
            })
          }
          className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-black text-white sm:min-h-10 ${hasWhatsapp ? "bg-emerald-700 hover:bg-emerald-800" : "pointer-events-none bg-slate-300"}`}
        >
          <WhatsappIcon />
          WhatsApp
        </a>
        <a
          href={callPhone ? `tel:${callPhone}` : "#"}
          aria-disabled={!callPhone}
          className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-black sm:min-h-10 ${callPhone ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "pointer-events-none bg-slate-100 text-slate-400"}`}
        >
          <PhoneIcon />
          <span className="hidden sm:inline">Llamar</span>
        </a>
      </div>
      <a href={`/negocios/${business.id}`} className="mt-2 inline-flex text-xs font-black text-red-600">
        Ver ficha completa
      </a>
    </article>
  );
}

function BusinessDetailModal({
  business,
  onClose
}: {
  business: DirectoryBusiness;
  onClose: () => void;
}) {
  const callPhone = phoneForCall(business.whatsapp);
  const url = businessUrl(business);
  const shareText = `Mira ${business.name} en Mercáu: ${url}`;

  async function shareBusiness() {
    if (navigator.share) {
      await navigator.share({ title: business.name, text: shareText, url });
      return;
    }
    await navigator.clipboard?.writeText(shareText);
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-end bg-slate-950/60 p-0 md:place-items-center md:p-6">
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-[2rem] bg-white shadow-soft md:max-w-2xl md:rounded-[2rem]">
        <div className="relative">
          <BusinessVisual business={business} />
          <div className="absolute left-4 top-4 flex gap-2">
            <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/95 font-black text-slate-900 shadow-soft" aria-label="Cerrar">
              <span aria-hidden="true">X</span>
            </button>
          </div>
        </div>

        <div className="p-5 md:p-7">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black leading-tight text-slate-950 md:text-3xl">{business.name}</h2>
              <p className="mt-1 font-bold text-slate-700">{displayCategory(business.category)}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-slate-500">
                <LocationIcon className="h-4 w-4" />
                {business.municipality}
                {business.neighborhood ? ` · ${business.neighborhood}` : ""}
              </p>
            </div>
            <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-600" aria-label="Guardar negocio">
              <HeartIcon />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
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
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-black text-white hover:bg-emerald-800"
            >
              <WhatsappIcon />
              WhatsApp
            </a>
            <a href={callPhone ? `tel:${callPhone}` : "#"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-black text-slate-900">
              <PhoneIcon />
              Llamar
            </a>
          </div>
          <button type="button" onClick={shareBusiness} className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-900">
            Compartir
          </button>

          <section className="mt-6">
            <h3 className="text-lg font-black text-slate-950">Qué ofrece</h3>
            <p className="mt-2 leading-7 text-slate-700">{business.description}</p>
          </section>

          <section className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <h3 className="text-lg font-black text-slate-950">Dónde atiende</h3>
            <p><strong>Municipio:</strong> {business.municipality}</p>
            <p><strong>Zona:</strong> {business.neighborhood || "Consultar"}</p>
            <p><strong>Domicilios:</strong> {business.deliveries === "Si" ? "Sí" : business.deliveries || "Consultar"}</p>
            <p><strong>Horario:</strong> {business.hours || "Consultar por WhatsApp"}</p>
          </section>

          <section className="mt-6 grid gap-2">
            <h3 className="text-lg font-black text-slate-950">Información del negocio</h3>
            {business.mapsUrl ? <a className="font-bold text-emerald-700 underline" href={business.mapsUrl} target="_blank" rel="noreferrer">Abrir ubicación</a> : null}
            {business.instagram ? <a className="font-bold text-emerald-700 underline" href={socialUrl(business.instagram, "instagram")} target="_blank" rel="noreferrer">Instagram</a> : null}
            {business.facebook ? <a className="font-bold text-emerald-700 underline" href={socialUrl(business.facebook, "facebook")} target="_blank" rel="noreferrer">Facebook</a> : null}
          </section>

          <a href="#inscripcion" onClick={onClose} className="mt-6 inline-flex w-full justify-center text-sm font-black text-red-600">
            Reportar datos incorrectos
          </a>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  query,
  municipality,
  onClearMunicipality,
  onClearSearch
}: {
  query: string;
  municipality: string;
  onClearMunicipality: () => void;
  onClearSearch: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-soft">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-slate-100 text-slate-500">
        <SearchIcon className="h-10 w-10" />
      </div>
      <h3 className="mt-5 text-2xl font-black text-slate-950">Aún no tenemos resultados aquí</h3>
      <p className="mx-auto mt-2 max-w-md leading-7 text-slate-600">
        No encontramos negocios que coincidan con
        {query ? ` "${query}"` : " esta búsqueda"}
        {municipality ? ` en ${municipality}` : ""}. Puedes probar con otra opción o ayudarnos a sumar ese negocio.
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <button type="button" onClick={onClearMunicipality} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-700 px-4 font-black text-emerald-800">
          Buscar en otro municipio
        </button>
        <button type="button" onClick={onClearSearch} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-4 font-black text-slate-900">
          Cambiar búsqueda
        </button>
        <a href="#inscripcion" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-red-600 px-4 font-black text-white">
          Inscribir mi negocio gratis
        </a>
      </div>
    </div>
  );
}

export default function MercauDirectory() {
  const [activeCategory, setActiveCategory] = useState<DirectoryCategory | "">("");
  const [activeMunicipality, setActiveMunicipality] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirectoryLoading, setIsDirectoryLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<DirectoryBusiness | null>(null);
  const [businesses, setBusinesses] = useState<DirectoryBusiness[]>([]);
  const [directoryStatus, setDirectoryStatus] = useState("Cargando negocios aprobados...");

  async function loadBusinesses() {
    setIsDirectoryLoading(true);

    try {
      const response = await fetch("/api/negocios", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo cargar el directorio.");
      }

      if (Array.isArray(result.businesses) && result.businesses.length > 0) {
        setBusinesses(result.businesses);
        setDirectoryStatus("Negocios aprobados para publicarse en Mercáu.");
        return;
      }

      setBusinesses([]);
      setDirectoryStatus("Todavía no hay negocios aprobados para mostrar.");
    } catch (error) {
      setBusinesses([]);
      setDirectoryStatus("No se pudo cargar el directorio en este momento. Intenta nuevamente en unos minutos.");
    } finally {
      setIsDirectoryLoading(false);
    }
  }

  useEffect(() => {
    loadBusinesses();
    trackMetric({ type: "Visita", notes: "Home directorio" });
  }, []);

  useEffect(() => {
    const search = query.trim();
    if (search.length < 3) return;

    const timer = window.setTimeout(() => {
      trackMetric({
        type: "Busqueda",
        search,
        category: activeCategory
      });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [activeCategory, query]);

  const filteredBusinesses = useMemo(() => {
    const term = normalize(query);

    return businesses.filter((business) => {
      const categoryMatches = activeCategory ? business.category === activeCategory : true;
      const municipalityMatches = activeMunicipality ? business.municipality === activeMunicipality : true;
      const categoryTerms = categoryTheme[business.category]?.terms || [];
      const searchable = normalize(
        [
          business.name,
          displayCategory(business.category),
          business.municipality,
          business.neighborhood,
          business.description,
          business.deliveries,
          ...categoryTerms
        ].join(" ")
      );

      return categoryMatches && municipalityMatches && (!term || searchable.includes(term));
    });
  }, [activeCategory, activeMunicipality, businesses, query]);

  const sortedBusinesses = useMemo(
    () =>
      [...filteredBusinesses].sort((a, b) => {
        if (a.status === "Destacado" && b.status !== "Destacado") return -1;
        if (a.status !== "Destacado" && b.status === "Destacado") return 1;
        return a.name.localeCompare(b.name);
      }),
    [filteredBusinesses]
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("Enviando inscripción...");

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
      setStatus("Inscripción recibida. Queda pendiente de revisión antes de publicarse.");
      trackMetric({
        type: "Inscripcion enviada",
        businessName: String(payload.businessName || ""),
        category: String(payload.category || "")
      });
      loadBusinesses();
    } catch (error) {
      setStatus("No se pudo enviar la inscripción. Revisa la conexión e intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const resultsLabel = isDirectoryLoading
    ? "Cargando resultados"
    : `${sortedBusinesses.length} ${sortedBusinesses.length === 1 ? "resultado" : "resultados"}`;

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-[#fbfaf6] pb-24 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6 md:py-3">
            <a href="#" className="flex items-center gap-3" aria-label="Inicio Mercáu">
              <img src="/logo-mercau.png" alt="Mercáu" className="h-11 w-11 rounded-2xl object-cover md:h-12 md:w-12" />
              <div>
                <strong className="block text-2xl font-black leading-none text-red-600 md:text-2xl">Mercáu</strong>
                <span className="block max-w-[12rem] truncate text-[11px] font-semibold text-slate-500 md:max-w-none md:text-sm">Directorio Digital del Bajo Cauca</span>
              </div>
            </a>
            <nav className="hidden items-center gap-2 text-sm font-black text-slate-700 md:flex">
              <a href="#directorio" className="rounded-xl px-4 py-2 hover:bg-slate-100">Explorar</a>
              <a href="#inscripcion" className="rounded-xl bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800">Inscribir mi negocio</a>
              <a href="#directorio" className="grid h-10 w-10 place-items-center rounded-full hover:bg-red-50 hover:text-red-600" aria-label="Favoritos"><HeartIcon /></a>
              <a href="#inscripcion" className="rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-100">Mi cuenta</a>
            </nav>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 md:hidden" aria-label="Abrir menú">
              <MenuIcon />
            </button>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-7xl min-w-0 gap-0 px-3 pb-4 pt-2 md:grid-cols-[1fr_0.9fr] md:items-center md:gap-6 md:px-6 md:py-8">
          <div className="min-w-0 overflow-hidden rounded-[1.5rem] md:order-2 md:rounded-[2rem]">
            <div className="relative h-32 min-w-0 overflow-hidden rounded-[1.5rem] sm:h-40 md:h-[25rem] md:rounded-[2rem]">
              <img src="/bajo-cauca-hero.png" alt="Paisaje visual del Bajo Cauca" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-5 left-4 right-4 text-white sm:bottom-4">
                <p className="text-[10px] font-black uppercase tracking-normal text-white/85 sm:text-sm md:text-base">Negocios locales, más cerca de ti</p>
                <h1 className="mt-0.5 max-w-[17rem] text-[1.35rem] font-black leading-tight sm:text-3xl md:max-w-sm md:text-5xl">
                  Encuentra negocios cerca de ti
                </h1>
                <p className="mt-0.5 max-w-[18rem] text-[11px] font-semibold text-white/90 sm:text-sm md:max-w-sm md:text-base">
                  Compra local. Apoya nuestra gente.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 -mt-3 min-w-0 md:order-1 md:mt-0">
            <div className="w-full min-w-0 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-soft md:rounded-[2rem] md:p-5">
              <label className="relative block">
                <span className="sr-only">Buscar negocio o servicio</span>
                <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 md:h-6 md:w-6" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  placeholder="¿Qué estás buscando hoy?"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none ring-red-600/20 placeholder:text-slate-400 focus:border-red-500 focus:ring-4 md:h-12 md:pl-12 md:text-base"
                />
              </label>

              <div className="mt-3 md:mt-4">
                <p className="text-xs font-black text-slate-950 md:text-sm">Filtra por municipio</p>
                <div className="no-scrollbar mt-2 flex max-w-full gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
                  {directoryMunicipalities.map((municipality) => (
                    <button
                      key={municipality}
                      type="button"
                      onClick={() => setActiveMunicipality((current) => (current === municipality ? "" : municipality))}
                      className={`min-h-9 shrink-0 rounded-full px-3 text-xs font-black transition md:min-h-11 md:px-4 md:text-sm ${
                        activeMunicipality === municipality
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {municipality}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-[1fr_auto] md:mt-4">
                <a href="#directorio" className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700 md:min-h-12 md:text-base">
                  Explorar directorio
                </a>
                <a href="#inscripcion" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white hover:bg-emerald-800 md:min-h-12 md:text-base">
                  <StoreIcon />
                  Inscribir mi negocio gratis
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl min-w-0 px-3 md:px-6">
          <div className="min-w-0 rounded-[1.5rem] bg-white p-3 shadow-soft md:rounded-[2rem] md:p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-black text-slate-950 md:text-xl">Categorías principales</h2>
              <button type="button" onClick={() => setActiveCategory("")} className="text-sm font-black text-emerald-700 underline">Ver todas</button>
            </div>
            <div className="no-scrollbar mt-3 flex max-w-full gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] md:mt-4 md:grid md:grid-cols-9 md:gap-3 md:overflow-visible">
              {directoryCategories.map((category) => {
                const theme = categoryTheme[category.name];
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => {
                      setActiveCategory((current) => (current === category.name ? "" : category.name));
                      trackMetric({ type: "Categoria", category: category.name, search: query });
                    }}
                    className={`grid min-h-20 w-20 shrink-0 place-items-center rounded-2xl border p-2 text-center transition sm:min-h-28 sm:w-28 sm:p-3 md:w-auto ${
                      activeCategory === category.name
                        ? "border-red-500 bg-red-50 ring-4 ring-red-600/10"
                        : "border-slate-200 bg-white hover:border-red-200"
                    }`}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${theme.tone} text-[11px] font-black text-white sm:h-12 sm:w-12 sm:text-sm`}>
                      {theme.initials}
                    </span>
                    <span className="mt-1.5 text-[11px] font-black leading-tight text-slate-950 sm:text-sm">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="directorio" className="mx-auto mt-4 grid w-full max-w-7xl min-w-0 gap-4 px-3 md:mt-6 md:grid-cols-[18rem_1fr] md:gap-5 md:px-6">
          <aside className="hidden self-start rounded-[2rem] bg-white p-5 shadow-soft md:block">
            <h2 className="text-lg font-black text-slate-950">Filtros</h2>
            <div className="mt-5">
              <p className="text-sm font-black text-slate-700">Municipio</p>
              <div className="mt-2 grid gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input type="radio" checked={activeMunicipality === ""} onChange={() => setActiveMunicipality("")} />
                  Todos
                </label>
                {directoryMunicipalities.map((municipality) => (
                  <label key={municipality} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input type="radio" checked={activeMunicipality === municipality} onChange={() => setActiveMunicipality(municipality)} />
                    {municipality}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-black text-slate-700">Categoría</p>
              <div className="mt-2 grid gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input type="radio" checked={activeCategory === ""} onChange={() => setActiveCategory("")} />
                  Todas
                </label>
                {directoryCategories.map((category) => (
                  <label key={category.name} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input type="radio" checked={activeCategory === category.name} onChange={() => setActiveCategory(category.name)} />
                    {displayCategory(category.name)}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="hidden min-w-0 rounded-[1.5rem] bg-white p-4 shadow-soft md:block md:rounded-[2rem] md:p-5">
              <div className="grid min-w-0 gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <label className="relative block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Buscar en el directorio</span>
                  <SearchIcon className="absolute bottom-4 left-4 h-5 w-5 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 font-semibold outline-none ring-red-600/20 placeholder:text-slate-400 focus:border-red-500 focus:ring-4"
                    type="search"
                    placeholder="Ferretería, arreglo de ventiladores, domicilios..."
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("");
                    setActiveMunicipality("");
                    setQuery("");
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-5 font-black text-slate-900 hover:bg-slate-200"
                >
                  Limpiar
                </button>
              </div>

              <div className="no-scrollbar mt-4 flex max-w-full gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] md:hidden">
                <button type="button" onClick={() => setActiveCategory("")} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-black ${activeCategory === "" ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                  Todos
                </button>
                {directoryCategories.slice(0, 5).map((category) => (
                  <button key={category.name} type="button" onClick={() => setActiveCategory(category.name)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-black ${activeCategory === category.name ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                    {displayCategory(category.name)}
                  </button>
                ))}
              </div>

              <div className="no-scrollbar mt-3 flex max-w-full gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] md:hidden">
                {directoryMunicipalities.map((municipality) => (
                  <button key={municipality} type="button" onClick={() => setActiveMunicipality((current) => (current === municipality ? "" : municipality))} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-black ${activeMunicipality === municipality ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                    {municipality}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap items-end justify-between gap-3 md:mt-5">
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-red-600 md:text-sm">Resultados</p>
                <h2 className="text-xl font-black text-slate-950 md:text-2xl">{resultsLabel}</h2>
                <p className="mt-1 text-xs font-semibold text-slate-500 md:text-sm">{directoryStatus}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-slate-700 shadow-soft sm:px-4 sm:text-sm">Ordenar por relevancia</span>
            </div>

            <div className="mt-3 grid min-w-0 gap-2.5 md:mt-4 md:gap-3">
              {isDirectoryLoading ? (
                <div className="rounded-[2rem] bg-white p-6 text-center font-bold text-slate-600 shadow-soft">Cargando negocios...</div>
              ) : sortedBusinesses.length > 0 ? (
                sortedBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} onOpen={setSelectedBusiness} />
                ))
              ) : (
                <EmptyState
                  query={query}
                  municipality={activeMunicipality}
                  onClearMunicipality={() => setActiveMunicipality("")}
                  onClearSearch={() => setQuery("")}
                />
              )}
            </div>
          </div>
        </section>

        <section id="inscripcion" className="mx-auto mt-8 max-w-7xl px-4 pb-10 md:px-6">
          <div className="grid gap-6 rounded-[2rem] bg-white p-5 shadow-soft md:grid-cols-[0.85fr_1.15fr] md:p-7">
            <div>
              <p className="text-sm font-black uppercase tracking-normal text-emerald-700">Inscripción gratuita</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
                Inscribe tu negocio en Mercáu
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                El formulario está pensado para celular. Tu solicitud queda en revisión y se publica cuando Mercáu apruebe la información.
              </p>
              <div className="mt-5 grid gap-3 text-sm font-bold text-slate-700">
                <p className="rounded-2xl bg-slate-50 p-4">1. Datos básicos del negocio.</p>
                <p className="rounded-2xl bg-slate-50 p-4">2. Municipio, categoría y contacto.</p>
                <p className="rounded-2xl bg-slate-50 p-4">3. Revisión antes de publicar.</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-black text-slate-800">
                Nombre del negocio
                <input name="businessName" required className="min-h-12 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20" />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-800">
                Propietario o contacto
                <input name="ownerName" required className="min-h-12 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20" />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-800">
                WhatsApp
                <input name="whatsapp" required inputMode="tel" placeholder="Ej: 3001234567" className="min-h-12 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20" />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-800">
                Categoría
                <select name="category" required className="min-h-12 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20">
                  <option value="">Seleccionar categoría</option>
                  {directoryCategories.map((category) => (
                    <option key={category.name} value={category.name}>{displayCategory(category.name)}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-800">
                Municipio
                <select name="municipality" required className="min-h-12 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20">
                  <option value="">Seleccionar municipio</option>
                  {directoryMunicipalities.map((municipality) => (
                    <option key={municipality} value={municipality}>{municipality}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-800">
                Barrio o vereda
                <input name="neighborhood" className="min-h-12 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20" />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-800 sm:col-span-2">
                Descripción corta
                <textarea name="description" required rows={3} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20" />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-800">
                Horario
                <input name="hours" placeholder="Ej: lunes a sábado" className="min-h-12 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20" />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-800">
                Domicilios
                <select name="deliveries" className="min-h-12 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20">
                  <option>Consultar</option>
                  <option value="Si">Sí</option>
                  <option>No</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-800">
                Instagram o usuario
                <input name="instagram" type="text" placeholder="@minegocio" className="min-h-12 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20" />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-800">
                Facebook o página
                <input name="facebook" type="text" placeholder="Mi Negocio" className="min-h-12 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20" />
              </label>
              <input type="hidden" name="wantsMarketplace" value="Después" />
              <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-red-600 px-5 py-4 font-black text-white hover:bg-red-700 disabled:opacity-60 sm:col-span-2">
                {isSubmitting ? "Enviando..." : "Enviar inscripción para revisión"}
              </button>
              {status ? <p className="rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-900 sm:col-span-2">{status}</p> : null}
            </form>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-red-600 text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm font-bold md:px-6">
            <strong className="text-2xl font-black">Mercáu</strong>
            <span>Cáceres · Caucasia · El Bagre · Nechí · Tarazá · Zaragoza</span>
            <span>Negocios locales, más oportunidades.</span>
          </div>
        </footer>
      </div>

      <BottomNav />

      {selectedBusiness ? (
        <BusinessDetailModal business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
      ) : null}
    </>
  );
}
