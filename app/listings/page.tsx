"use client";
import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import { listings } from "@/data/items";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "next/navigation";

const PER_PAGE = 12;

export default function Page() {
  const sp = useSearchParams();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [sp.toString()]);

  const filtered = useMemo(() => {
    const q = (sp.get("q") ?? "").toLowerCase();
    const categoria = sp.get("categoria");
    const municipio = sp.get("municipio");
    return listings.filter((it) => {
      const matchQ = q ? (it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q)) : true;
      const matchC = categoria ? it.categoria === categoria : true;
      const matchM = municipio ? it.municipio === municipio : true;
      return matchQ && matchC && matchM;
    });
  }, [sp]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  return (
    <div className="container py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Listados</h1>
          <p className="text-slate-600">{filtered.length} resultados</p>
        </div>
      </div>
      <FilterBar />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {paginated.map((item) => <ListingCard key={item.id} item={item} />)}
      </div>
      <Pagination total={filtered.length} page={page} perPage={PER_PAGE} onPageChange={setPage} />
    </div>
  );
}
