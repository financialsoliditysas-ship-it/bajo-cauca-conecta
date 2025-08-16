export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  municipio: "Nechí" | "Caucasia" | "El Bagre" | "Zaragoza" | "Tarazá" | "Cáceres";
  categoria: "Productos" | "Servicios" | "Tecnología" | "Hogar" | "Moda" | "Alimentos";
  image: string;
};

export const listings: Listing[] = [
  { id: "1",  title: "Café artesanal de Nechí", description: "Café tostado de microproductores, 500g.", price: 38000, municipio: "Nechí", categoria: "Alimentos", image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1200&auto=format&fit=crop" },
  { id: "2",  title: "Aretes de filigrana", description: "Joyería hecha a mano por artesanas locales.", price: 55000, municipio: "Zaragoza", categoria: "Moda", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop" },
  { id: "3",  title: "Servicio de mensajería urbana", description: "Eníos rápidos dentro de Caucasia.", price: 12000, municipio: "Caucasia", categoria: "Servicios", image: "https://images.unsplash.com/photo-1520881363902-a0ff4e722963?q=80&w=1200&auto=format&fit=crop" },
  { id: "4",  title: "Miel pura", description: "Miel natural cosechada en Tarazá.", price: 25000, municipio: "Tarazá", categoria: "Alimentos", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop" },
  { id: "5",  title: "Kit de herramientas", description: "Set completo para hogar y taller.", price: 150000, municipio: "El Bagre", categoria: "Hogar", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop" },
  { id: "6",  title: "Clases de inglés", description: "Tutorías personalizadas online o presenciales.", price: 40000, municipio: "Caucasia", categoria: "Servicios", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop" },
  { id: "7",  title: "Computador portátil", description: "Ideal para estudio y trabajo, 8GB RAM.", price: 1890000, municipio: "Zaragoza", categoria: "Tecnología", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop" },
  { id: "8",  title: "Uniformes escolares", description: "Confección a medida, entrega local.", price: 95000, municipio: "Cáceres", categoria: "Moda", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop" },
  { id: "9",  title: "Vegetales orgánicos", description: "Canasta semanal de productores locales.", price: 42000, municipio: "Nechí", categoria: "Alimentos", image: "https://images.unsplash.com/photo-1437750769465-301382cdf094?q=80&w=1200&auto=format&fit=crop" },
  { id: "10", title: "Servicio técnico celular", description: "Reparación de pantallas y baterías.", price: 70000, municipio: "El Bagre", categoria: "Servicios", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop" },
  { id: "11", title: "Decoración para el hogar", description: "Cuadros y artesanías en madera.", price: 65000, municipio: "Tarazá", categoria: "Hogar", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop" },
  { id: "12", title: "Plan de datos prepago", description: "Recargas y paquetes económicos.", price: 30000, municipio: "Caucasia", categoria: "Tecnología", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200&auto=format&fit=crop" },
  { id: "13", title: "Ropa deportiva", description: "Conjuntos para gym y running.", price: 80000, municipio: "Cáceres", categoria: "Moda", image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1200&auto=format&fit=crop" },
  { id: "14", title: "Ajo y cebolla al por mayor", description: "Distribución regional para comercios.", price: 220000, municipio: "Zaragoza", categoria: "Alimentos", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1200&auto=format&fit=crop" },
  { id: "15", title: "Servicios contables", description: "Declaraciones, NIIF, asesoría tributaria.", price: 120000, municipio: "Nechí", categoria: "Servicios", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop" },
  { id: "16", title: "Purificadores de agua", description: "Instalación y mantenimiento.", price: 350000, municipio: "El Bagre", categoria: "Hogar", image: "https://images.unsplash.com/photo-1509474520651-53cf6a805d77?q=80&w=1200&auto=format&fit=crop" },
  { id: "17", title: "Impresoras económicas", description: "Multifuncional WiFi para oficina y hogar.", price: 420000, municipio: "Caucasia", categoria: "Tecnología", image: "https://images.unsplash.com/photo-1586486855514-90463f179a1d?q=80&w=1200&auto=format&fit=crop" },
  { id: "18", title: "Sandalias artesanales", description: "Hechas a mano con cuero vacuno.", price: 60000, municipio: "Tarazá", categoria: "Moda", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop" },
  { id: "19", title: "Pan artesanal", description: "Masa madre, piezas frescas cada mañana.", price: 9000, municipio: "Nechí", categoria: "Alimentos", image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1200&auto=format&fit=crop" },
  { id: "20", title: "Mantenimiento de aires", description: "Limpieza y revisión técnica.", price: 150000, municipio: "Cáceres", categoria: "Servicios", image: "https://images.unsplash.com/photo-1581090465953-c70b8e35dc53?q=80&w=1200&auto=format&fit=crop" }
];

export const uniqueCategorias = Array.from(new Set(listings.map(l => l.categoria)));
export const uniqueMunicipios = Array.from(new Set(listings.map(l => l.municipio)));
