"use client";
import { useEffect, useMemo, useState } from "react";
import { uniqueCategorias, uniqueMunicipios } from "@/data/items";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBar() {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [categoria, setCategoria] = useState(sp.get("categoria") ?? "Todas");
  const [municipio, setMunicipio] = useState(sp.get("municipio") ?? "Todos");

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoria && categoria !== "Todas") params.set("categoria", categoria);
    if (municipio && municipio !== "Todos") params.set("municipio", municipio);
    const url = `/listings${params.toString() ? "?" + params.toString() : ""}`;
    router.replace(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, categoria, municipio]);

  const categorias = useMemo(() => ["Todas", ...uniqueCategorias], []);
  const municipios = useMemo(() => ["Todos", ...uniqueMunicipios], []);

  return (
    <div className="grid sm:grid-cols-3 gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar…"
        className="border rounded-xl px-4 py-3 w-full"
      />
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="border rounded-xl px-4 py-3">
        {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={municipio} onChange={(e) => setMunicipio(e.target.value)} className="border rounded-xl px-4 py-3">
        {municipios.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
  );
}
