import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/app/header';
import ExplorerWithRouter from '@/app/routes/[[...id]]/explorer';
import { getAllFigures } from '@/figures';

function findFigure(id: string) {
  return getAllFigures().find((figure) => figure.id === id) ?? null;
}

function getMetadataDescription(figure: NonNullable<ReturnType<typeof findFigure>>) {
  return typeof figure.description === 'string'
    ? figure.description
    : figure.altText ?? undefined;
}

export function generateStaticParams() {
  return getAllFigures().map((figure) => ({ id: figure.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const figure = findFigure(id);

  if (!figure) {
    return {
      title: 'Image not found',
    };
  }

  return {
    title: figure.title,
    description: getMetadataDescription(figure),
  };
}

export default async function FigurePage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const figure = findFigure(id);

  if (!figure) {
    notFound();
  }

  // Render the one explorer pre-set to figure mode for this figure, rather than
  // booting a separate map. A cold load has no prior fullscreen map to pinch
  // from, so the view renders directly in its final (map-already-shrunk) state.
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 min-h-0">
        <ExplorerWithRouter selectedItemId={null} initialFigureId={figure.id} />
      </main>
      <div id="modal-root" />
    </div>
  );
}