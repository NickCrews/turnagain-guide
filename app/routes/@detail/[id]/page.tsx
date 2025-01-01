import { ItemCollection } from "../../routes";
import RouteDetail from "./RouteDetail";

const items = await ItemCollection.fromFile();

export async function generateStaticParams() {
  return items.getItems().map((item) => ({ id: item.id }));
}

export default async function RouteDetailPage (
  {params}: {params: Promise<{id: string}>}
) {
    const p = await params;
    return <RouteDetail item={items.getItem(p.id)} mountId="modal-root" />;
}