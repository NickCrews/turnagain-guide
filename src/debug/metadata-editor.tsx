'use client';

import { useActionState, useState } from 'react';
import { type Figure } from '@/figures/index';
import {
  type EditableMetadataFields,
  parseEditableMetadata,
  renderMetadataEntrySnippet,
} from '@/figures/metadata-codegen';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { saveFigureMetadataAction } from './metadata-actions';
import { Check, Copy } from 'lucide-react';

interface MetadataEditorProps {
  figure: Figure | null;
  onClose: () => void;
}

function figureToEditable(figure: Figure): EditableMetadataFields {
  return {
    lat: figure.subject_coordinates?.lat?.toString() ?? '',
    long: figure.subject_coordinates?.long?.toString() ?? '',
    elevation: figure.subject_elevation?.toString() ?? '',
    direction: figure.direction?.toString() ?? '',
    datetime: figure.datetime ?? '',
  };
}

const INITIAL_STATE = { ok: false, message: '', errors: [] };

export function MetadataEditor({ figure, onClose }: MetadataEditorProps) {
  const [fields, setFields] = useState<EditableMetadataFields>(
    figure ? figureToEditable(figure) : { lat: '', long: '', elevation: '', direction: '', datetime: '' },
  );
  const [actionState, submitAction, pending] = useActionState(saveFigureMetadataAction, INITIAL_STATE);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof EditableMetadataFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields(f => ({ ...f, [key]: e.target.value }));
  };

  const parsed = figure ? parseEditableMetadata(figure.id, fields) : null;
  const tsOutput = parsed ? renderMetadataEntrySnippet(parsed.metadata) : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(tsOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!figure) {
      return;
    }
    submitAction({ id: figure.id, fields });
  };

  if (!figure) return null;

  return (
    <Dialog open={!!figure} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogTitle className="font-mono text-sm text-muted-foreground">
          Edit Metadata: {figure.id}
        </DialogTitle>

        <div className="mt-1 mb-3">
          <img
            src={figure.imagePath}
            alt={figure.id}
            className="rounded-md max-h-40 object-contain bg-muted"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Datetime (ISO 8601)" value={fields.datetime} onChange={set('datetime')} placeholder="2024-03-15T10:30:00" />
          <Field label="Latitude" value={fields.lat} onChange={set('lat')} placeholder="60.7819" />
          <Field label="Longitude" value={fields.long} onChange={set('long')} placeholder="-149.1418" />
          <Field label="Elevation (meters)" value={fields.elevation} onChange={set('elevation')} placeholder="1139" />
          <Field label="Direction (°, 0=N)" value={fields.direction} onChange={set('direction')} placeholder="180" />
        </div>

        {(parsed?.errors.length || actionState.errors.length || actionState.message) ? (
          <div className="mt-3 rounded border border-border/60 bg-muted/50 p-2 text-xs font-mono">
            {parsed?.errors.map(err => (
              <p key={err} className="text-destructive">{err}</p>
            ))}
            {actionState.errors.map(err => (
              <p key={`server-${err}`} className="text-destructive">{err}</p>
            ))}
            {actionState.message ? (
              <p className={actionState.ok ? 'text-emerald-600' : 'text-muted-foreground'}>{actionState.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-3">
          <Button onClick={handleSave} disabled={pending || (parsed?.errors.length ?? 0) > 0} className="h-8 text-xs">
            {pending ? 'Saving…' : 'Save to metadata.ts'}
          </Button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">Entry preview for metadata.ts</span>
            <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1 h-7 text-xs">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{tsOutput}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded border border-input bg-background px-2 py-1 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}
