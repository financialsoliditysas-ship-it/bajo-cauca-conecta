import Link from "next/link";
import { Listing } from "@/data/items";

type Props = { item: Listing };

export default function ListingCard({ item }: Props) {
  return (
    <Link href={`/listings/${item.id}`} className="block border rounded-2xl overflow-hidden hover:shadow-soft transition">
      <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1">{item.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-2 mt-1">{item.description}</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-medium">${"{"}item.price.toLocaleString(){"}"}</span>
          <span className="text-slate-500">{item.municipio}</span>
        </div>
      </div>
    </Link>
  );
}
