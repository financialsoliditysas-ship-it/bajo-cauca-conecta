import Link from "next/link";

export default function Page() {
  return (
    <section className="relative">
      <div className="container py-16 sm:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Conecta productos y servicios del <span className="text-sky-600">Bajo Cauca</span>
            </h1>
            <p className="mt-4 text-lg text-slate-700">
              Descubre emprendedores, comercios y oportunidades en Nechí, Caucasia, El Bagre, Zaragoza, Tarazá y Cáceres.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/listings" className="inline-flex items-center rounded-2xl px-5 py-3 bg-sky-600 text-white shadow-soft hover:bg-sky-700 transition">
                Explorar listados
              </Link>
              <Link href="/contacto" className="inline-flex items-center rounded-2xl px-5 py-3 border border-slate-300 hover:bg-slate-50 transition">
                Publicar un anuncio
              </Link>
            </div>
          </div>
          <div className="rounded-3xl shadow-soft overflow-hidden">
            <img src="https://images.unsplash.com/photo-1520975922284-d49a18b3c9ca?q=80&w=1600&auto=format&fit=crop" alt="Marketplace" />
          </div>
        </div>
      </div>

      <div className="container pb-16">
        <h2 className="text-xl font-semibold mb-4">Categorías destacadas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {["Productos","Servicios","Tecnología","Hogar","Moda","Alimentos"].map((c) => (
            <Link key={c} href={{ pathname: "/listings", query: { categoria: c } }}
              className="rounded-xl border p-3 text-center hover:border-sky-600 hover:text-sky-700 transition">
              {c}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
