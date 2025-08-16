export const metadata = {
  title: "Contacto — Bajo Cauca Conecta",
  description: "Pauta o publica tu anuncio en el marketplace del Bajo Cauca."
};

export default function Page() {
  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold">Contacto</h1>
      <p className="mt-2 text-slate-700 max-w-2xl">
        Déjanos tus datos y te ayudamos a publicar tu anuncio o pauta. (Este formulario es de ejemplo;
        conecta tu propio backend o servicio de formularios).
      </p>
      <form className="mt-6 grid gap-4 max-w-xl">
        <input className="border rounded-xl px-4 py-3" placeholder="Nombre" />
        <input className="border rounded-xl px-4 py-3" placeholder="Correo" type="email" />
        <input className="border rounded-xl px-4 py-3" placeholder="WhatsApp" />
        <textarea className="border rounded-xl px-4 py-3" placeholder="Cuéntanos qué quieres publicar..." rows={5} />
        <button className="rounded-xl px-5 py-3 bg-sky-600 text-white hover:bg-sky-700">Enviar</button>
      </form>
    </div>
  );
}
