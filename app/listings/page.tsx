"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import Pagination from "@/components/Pagination";
import { listings } from "@/data/items";

const PER_PAGE = 12;

function ListingsInner() {
  const search = useSearchParams();
  const page = Number(search.get("page") || "1");
  const q = (search.get("q") || "").toLowerCase();
  const municipio = search.get("municipio") || "";
  const categoria = search.get("categoria") || "";

  const filtered = useMemo(() => {
    return listings.filter((it) => {
      const okQ = q
        ? (it.title?.toLowerCase().includes(q) ||
           it.description?.toLowerCase().includes(q))
        : true;
      const okM = municipio ? it.municipio === municipio : true;
      const okC = categoria ? it.categoria === categoria : true;
      return okQ && okM && okC;
    });
  }, [q, municipio, categoria]);

  const total = filtered.length;
  const start = (page - 1) * PER_PAGE;
  const paged = filtered.slice(start, start + PER_PAGE);

  return (
    <div className="container py-10">
      <FilterBar />
      {paged.length === 0 ? (
        <div className="mt-10 text-slate-600">No hay resultados.</div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Pagination total={total} page={page} perPage={PER_PAGE} />
          </div>
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="container py-10">Cargando…</div>}>
      <ListingsInner />
    </Suspense>
  );
}
