"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import { listings } from "@/data/items";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "next/navigation";

const PER_PAGE = 12;

// Separate component that uses useSearchParams, wrapped in Suspense
function ListingsContent() {
  const sp = useSearchParams();
  const [page, setPage] = useState(1);

  // Reset page when search params change
  useEffect(() => {
    setPage(1);
  }, [sp.toString()]);

  // Filter listings based on query, category, and municipality
  const filtered = useMemo(() => {
    const q = (sp.get("q") ?? "").toLowerCase();
    const categoria = sp.get("categoria");
    const municipio = sp.get("municipio");
    return listings.filter((it) => {
      const matchQ = q
        ? it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q)
        : true;
      const matchC = categoria ? it.categoria === categoria : true;
      const matchM = municipio ? it.municipio === municipio : true;
      return matchQ && matchC && matchM;
    });
  }, [sp]);

  // Paginate the filtered results
  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  return (
    <div className="container py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Listados</h1>
          <p className="mt-2 text-slate-600">{filtered.length} resultados encontrados</p>
        </div>
        <FilterBar />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {paginated.map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}
      </div>
      <Pagination
        total={filtered.length}
        perPage={PER_PAGE}
       Page={page}
        onPageChange={setPage}
      />
    </div>
  );
}

export default function Page() {
  // Wrap in Suspense to satisfy useSearchParams requirement
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
