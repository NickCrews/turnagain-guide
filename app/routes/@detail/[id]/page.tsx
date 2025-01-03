import { Modal } from "@/app/components/Modal";
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
    return <Modal mountId="modal-root">
      <RouteDetail item={items.getItem(p.id)} />
    </Modal>
}