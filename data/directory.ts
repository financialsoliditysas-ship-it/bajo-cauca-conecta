export type DirectoryCategory =
  | "Comidas y Bebidas"
  | "Hogar"
  | "Salud"
  | "Belleza"
  | "Moda"
  | "Ferreteria"
  | "Servicios"
  | "Transporte"
  | "Emprendimientos";

export type DirectoryBusiness = {
  id: string;
  name: string;
  category: DirectoryCategory;
  neighborhood: string;
  description: string;
  hours: string;
  whatsapp: string;
  deliveries?: string;
  instagram?: string;
  facebook?: string;
  mapsUrl?: string;
  status: "Verificado" | "Destacado";
  source: string;
};

export const directoryCategories: Array<{
  name: DirectoryCategory;
  hint: string;
}> = [
  { name: "Comidas y Bebidas", hint: "Restaurantes, comidas rápidas y bebidas" },
  { name: "Hogar", hint: "Tiendas, variedades y productos de casa" },
  { name: "Salud", hint: "Droguerías, bienestar y atención local" },
  { name: "Belleza", hint: "Barberías, peluquerías y estética" },
  { name: "Moda", hint: "Ropa, calzado y accesorios" },
  { name: "Ferreteria", hint: "Materiales, herramientas y repuestos" },
  { name: "Servicios", hint: "Oficios, técnicos y soluciones" },
  { name: "Transporte", hint: "Mensajería, domicilios y movilidad" },
  { name: "Emprendimientos", hint: "Marcas locales y ventas por redes" }
];

export const directoryBusinesses: DirectoryBusiness[] = [
  {
    id: "demo-cocina-local",
    name: "Demo Cocina Local",
    category: "Comidas y Bebidas",
    neighborhood: "Centro",
    description: "Registro demo para mostrar restaurantes y comidas del directorio.",
    hours: "Consultar por WhatsApp",
    whatsapp: "+573000000001",
    status: "Destacado",
    source: "Demo no verificado"
  },
  {
    id: "demo-ferreteria-nechi",
    name: "Demo Ferretería Nechí",
    category: "Ferreteria",
    neighborhood: "Zona comercial",
    description: "Registro demo para mostrar búsqueda de ferreterías y materiales.",
    hours: "Consultar por WhatsApp",
    whatsapp: "+573000000002",
    status: "Verificado",
    source: "Demo no verificado"
  },
  {
    id: "demo-belleza-estilo",
    name: "Demo Belleza y Estilo",
    category: "Belleza",
    neighborhood: "Barrio por confirmar",
    description: "Registro demo para mostrar servicios de peluquería, barbería y estética.",
    hours: "Consultar por WhatsApp",
    whatsapp: "+573000000003",
    status: "Verificado",
    source: "Demo no verificado"
  },
  {
    id: "demo-salud-drogueria",
    name: "Demo Salud y Droguería",
    category: "Salud",
    neighborhood: "Centro",
    description: "Registro demo para mostrar farmacias, salud y bienestar.",
    hours: "Consultar por WhatsApp",
    whatsapp: "+573000000004",
    status: "Verificado",
    source: "Demo no verificado"
  },
  {
    id: "demo-moda-local",
    name: "Demo Moda Local",
    category: "Moda",
    neighborhood: "Nechí",
    description: "Registro demo para mostrar tiendas de ropa, calzado y accesorios.",
    hours: "Consultar por WhatsApp",
    whatsapp: "+573000000005",
    status: "Destacado",
    source: "Demo no verificado"
  },
  {
    id: "demo-servicios-tecnicos",
    name: "Demo Servicios Técnicos",
    category: "Servicios",
    neighborhood: "A domicilio",
    description: "Registro demo para mostrar reparaciones, oficios y servicios locales.",
    hours: "Consultar por WhatsApp",
    whatsapp: "+573000000006",
    status: "Verificado",
    source: "Demo no verificado"
  },
  {
    id: "demo-hogar-variedades",
    name: "Demo Hogar y Variedades",
    category: "Hogar",
    neighborhood: "Centro",
    description: "Registro demo para mostrar tiendas de hogar, misceláneas y variedades.",
    hours: "Consultar por WhatsApp",
    whatsapp: "+573000000007",
    status: "Verificado",
    source: "Demo no verificado"
  },
  {
    id: "demo-emprendimiento-nechi",
    name: "Demo Emprendimiento Nechí",
    category: "Emprendimientos",
    neighborhood: "Redes sociales",
    description: "Registro demo para mostrar emprendimientos que venden por WhatsApp y redes.",
    hours: "Consultar por WhatsApp",
    whatsapp: "+573000000008",
    status: "Destacado",
    source: "Demo no verificado"
  }
];
