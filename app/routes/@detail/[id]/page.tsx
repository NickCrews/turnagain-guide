import { Modal } from "@/app/components/Modal";
import RouteDetail from "@/app/components/RouteDetail";
import { ItemCollection } from "@/app/routes/routes";

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