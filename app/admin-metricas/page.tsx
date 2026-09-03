"use client";

import { FormEvent, useState } from "react";

type CountItem = {
  label: string;
  count: number;
};

type MetricsData = {
  summary: {
    visitas: number;
    clicsWhatsApp: number;
    negociosInscritos: number;
    negociosAprobados: number;
  };
  statusCounts: CountItem[];
  categoriasMasBuscadas: CountItem[];
  busquedas: CountItem[];
  whatsappPorNegocio: CountItem[];
  ultimosEventos: Array<{
    tipo: string;
    negocio: string;
    categoria: string;
    busqueda: string;
    ruta: string;
    fecha: string;
    notas: string;
  }>;
};

const emptyData: MetricsData = {
  summary: {
    visitas: 0,
    clicsWhatsApp: 0,
    negociosInscritos: 0,
    negociosAprobados: 0
  },
  statusCounts: [],
  categoriasMasBuscadas: [],
  busquedas: [],
  whatsappPorNegocio: [],
  ultimosEventos: []
};

function formatDate(value: string) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function MetricCard(props: { label: string; value: number; helper: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm font-bold text-slate-500">{props.label}</p>
      <strong className="mt-3 block text-4xl font-black text-emerald-950">
        {props.value}
      </strong>
      <span className="mt-2 block text-sm leading-6 text-slate-600">
        {props.helper}
      </span>
    </article>
  );
}

function Ranking(props: { title: string; items: CountItem[]; empty: string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-xl font-black text-emerald-950">{props.title}</h2>
      <div className="mt-4 grid gap-3">
        {props.items.length > 0 ? (
          props.items.map((item) => (
            <div key={item.label} className="grid grid-cols-[1fr_auto] gap-3 text-sm">
              <span className="truncate font-bold text-slate-700">{item.label}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-black text-emerald-900">
                {item.count}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm leading-6 text-slate-500">{props.empty}</p>
        )}
      </div>
    </section>
  );
}

export default function AdminMetricasPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<MetricsData>(emptyData);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  async function loadMetrics(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsLoading(true);
    setStatus("Cargando metricas...");

    try {
      const response = await fetch("/api/admin/metricas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudieron cargar las metricas.");
      }

      setData(result);
      setIsUnlocked(true);
      setStatus("Metricas actualizadas.");
    } catch (error) {
      setIsUnlocked(false);
      setStatus(error instanceof Error ? error.message : "No se pudo cargar.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfaf6] py-10">
      <div className="container">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-normal text-emerald-700">
              Panel privado
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-emerald-950 md:text-6xl">
              Metricas Mercáu
            </h1>
          </div>
          <a
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg bg-emerald-100 px-4 font-extrabold text-emerald-950"
          >
            Ver directorio
          </a>
        </header>

        <form
          onSubmit={loadMetrics}
          className="mt-8 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:grid-cols-[1fr_auto]"
        >
          <label className="grid gap-2 font-bold">
            Clave del panel
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal"
              placeholder="Escribe la clave"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-auto inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-700 px-5 font-extrabold text-white disabled:opacity-60"
          >
            {isLoading ? "Cargando..." : "Entrar"}
          </button>
        </form>

        {status ? (
          <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 font-bold text-emerald-900">
            {status}
          </p>
        ) : null}

        {isUnlocked ? (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Visitas"
                value={data.summary.visitas}
                helper="Entradas registradas al directorio."
              />
              <MetricCard
                label="Clics WhatsApp"
                value={data.summary.clicsWhatsApp}
                helper="Personas que intentaron contactar negocios."
              />
              <MetricCard
                label="Negocios inscritos"
                value={data.summary.negociosInscritos}
                helper="Total de registros en Airtable."
              />
              <MetricCard
                label="Negocios aprobados"
                value={data.summary.negociosAprobados}
                helper="Verificados o destacados visibles."
              />
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-2">
              <Ranking
                title="Categorias mas buscadas"
                items={data.categoriasMasBuscadas}
                empty="Todavia no hay clics de categoria."
              />
              <Ranking
                title="WhatsApp por negocio"
                items={data.whatsappPorNegocio}
                empty="Todavia no hay clics de WhatsApp."
              />
              <Ranking
                title="Busquedas escritas"
                items={data.busquedas}
                empty="Todavia no hay busquedas escritas registradas."
              />
              <Ranking
                title="Estados de negocios"
                items={data.statusCounts}
                empty="Todavia no hay negocios registrados."
              />
            </section>

            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <h2 className="text-xl font-black text-emerald-950">Ultimos eventos</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="py-3 pr-4">Tipo</th>
                      <th className="py-3 pr-4">Negocio</th>
                      <th className="py-3 pr-4">Categoria</th>
                      <th className="py-3 pr-4">Busqueda</th>
                      <th className="py-3 pr-4">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ultimosEventos.length > 0 ? (
                      data.ultimosEventos.map((event, index) => (
                        <tr key={`${event.fecha}-${index}`} className="border-b">
                          <td className="py-3 pr-4 font-bold">{event.tipo || "Evento"}</td>
                          <td className="py-3 pr-4">{event.negocio || "-"}</td>
                          <td className="py-3 pr-4">{event.categoria || "-"}</td>
                          <td className="py-3 pr-4">{event.busqueda || "-"}</td>
                          <td className="py-3 pr-4">{formatDate(event.fecha)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-4 text-slate-500" colSpan={5}>
                          Todavia no hay eventos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
