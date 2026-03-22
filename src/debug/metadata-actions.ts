'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';
import metadata from '@/figures/metadata';
import {
  type EditableMetadataFields,
  parseEditableMetadata,
  renderMetadataModule,
  upsertFigureMetadata,
} from '@/figures/metadata-codegen';

export interface SaveMetadataActionState {
  ok: boolean;
  message: string;
  errors: string[];
}

const EMPTY_STATE: SaveMetadataActionState = {
  ok: false,
  message: '',
  errors: [],
};

export async function saveFigureMetadataAction(
  previousState: SaveMetadataActionState = EMPTY_STATE,
  payload: { id: string; fields: EditableMetadataFields },
): Promise<SaveMetadataActionState> {
  void previousState;
  const { metadata: parsed, errors } = parseEditableMetadata(payload.id, payload.fields);
  if (errors.length > 0) {
    return {
      ok: false,
      message: 'Could not save metadata.',
      errors,
    };
  }

  const nextMetadata = upsertFigureMetadata(metadata, parsed);
  const filePath = join(process.cwd(), 'src', 'figures', 'metadata.ts');
  await writeFile(filePath, renderMetadataModule(nextMetadata), 'utf8');

  return {
    ok: true,
    message: `Saved metadata for ${payload.id}.`,
    errors: [],
  };
}