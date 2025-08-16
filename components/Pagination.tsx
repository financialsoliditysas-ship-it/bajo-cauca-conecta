"use client";
import { useMemo } from "react";

type Props = {
  total: number;
  page: number;
  perPage: number;
  onPageChange: (p: number) => void;
};

export default function Pagination({ total, page, perPage, onPageChange }: Props) {
  const last = Math.max(1, Math.ceil(total / perPage));
  const pages = useMemo(() => {
    const arr: number[] = [];
    for (let i = 1; i <= last; i++) arr.push(i);
    return arr;
  }, [last]);

  if (last <= 1) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="px-3 py-2 border rounded-lg disabled:opacity-50"
        disabled={page === 1}
      >
        Anterior
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-2 border rounded-lg ${p === page ? "bg-sky-600 text-white" : ""}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(last, page + 1))}
        className="px-3 py-2 border rounded-lg disabled:opacity-50"
        disabled={page === last}
      >
        Siguiente
      </button>
    </div>
  );
}
