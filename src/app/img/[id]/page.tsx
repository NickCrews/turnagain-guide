import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Lightbox } from '@/figures/lightbox';
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
    title: figure.title ?? figure.id,
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

  return (
    <main className="min-h-screen bg-background">
      <Lightbox figures={[figure]} index={0} />
    </main>
  );
}