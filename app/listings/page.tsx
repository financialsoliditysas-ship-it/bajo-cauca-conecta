"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import { listings } from "@/data/items";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "next/navigation";

const PER_PAGE = 12;

function ListingsInner() {
  const sp = useSearchParams();
  const [page, setPage] = useState(1);

  // Reset the page when the search params change
  useEffect(() => {
    setPage(1);
  }, [sp.toString()]);

  // Filter listings based on query, category and municipality
  const filtered = useMemo(() => {
    const q = (sp.get("q") ?? "").toLowerCase();
    const municipio = sp.get("municipio") ?? "";
    const categoria = sp.get("categoria") ?? "";
    return listings.filter((it) => {
      const matchQ = q
        ? it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q)
        : true;
      const matchM = municipio ? it.municipio === municipio : true;
      const matchC = categoria ? it.categoria === categoria : true;
      return matchQ && matchM && matchC;
    });
  }, [sp]);

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
            <Pagination
              total={total}
              page={page}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />
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
