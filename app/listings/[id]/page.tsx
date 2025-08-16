import { listings } from "@/data/items";
import { notFound } from "next/navigation";

// Props type for dynamic routing with id parameter
type Props = { params: { id: string } };

// Generate metadata dynamically based on the listing's title and description
export async function generateMetadata({ params }: Props) {
  const item = listings.find((x) => x.id === params.id);
  if (!item) return { title: "No encontrado" };
  return {
    title: `${item.title} — Bajo Cauca Conecta`,
    description: item.description,
  };
}

// Default page component fetching the listing by id
export default function Page({ params }: Props) {
  const item = listings.find((x) => x.id === params.id);
  if (!item) return notFound();

  return (
    <div className="container py-10 grid md:grid-cols-2 gap-8">
      <div className="rounded-2xl overflow-hidden border">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-[360px] object-cover"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{item.title}</h1>
        <p className="mt-2 text-slate-700">{item.description}</p>

                <div className="mt-2 text-slate-600">Municipio: {item.municipio} · Categoría: {item.categoria}</div>
        </div>

        <div className="mt-6">
          <a
            href="/contacto"
            className="inline-flex items-center rounded-xl px-5 py-3 bg-sky-600 text-white hover:bg-sky-700"
          >
            Contactar
          </a>
        </div>
      </div>
    </div>
  );
}
