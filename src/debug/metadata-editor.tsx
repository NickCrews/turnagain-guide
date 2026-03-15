'use client';

import { useState } from 'react';
import { type Figure } from '@/figures/index';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

interface MetadataEditorProps {
  figure: Figure | null;
  onClose: () => void;
}

interface EditableFields {
  title: string;
  description: string;
  lat: string;
  long: string;
  elevation: string;
  direction: string;
  datetime: string;
}

function figureToEditable(figure: Figure): EditableFields {
  return {
    title: figure.title ?? '',
    description: typeof figure.description === 'string' ? figure.description : '',
    lat: figure.coordinates?.lat?.toString() ?? '',
    long: figure.coordinates?.long?.toString() ?? '',
    elevation: figure.elevation?.toString() ?? '',
    direction: figure.direction?.toString() ?? '',
    datetime: figure.datetime ?? '',
  };
}

function generateTypeScript(imagePath: string, fields: EditableFields): string {
  const lines: string[] = [];

  if (fields.title) lines.push(`  title: ${JSON.stringify(fields.title)},`);
  if (fields.description) lines.push(`  description: ${JSON.stringify(fields.description)},`);
  if (fields.lat && fields.long) {
    lines.push(`  coordinates: { lat: ${fields.lat}, long: ${fields.long} },`);
  }
  if (fields.elevation) lines.push(`  elevation: ${fields.elevation},`);
  if (fields.direction) lines.push(`  direction: ${fields.direction},`);
  if (fields.datetime) lines.push(`  datetime: ${JSON.stringify(fields.datetime)},`);

  if (lines.length === 0) return `// No metadata fields filled in for ${imagePath}`;

  return [
    `// In imageRegistry/images.tsx, update the object for: ${imagePath}`,
    `// Merge these fields into the export:`,
    `{`,
    ...lines,
    `}`,
  ].join('\n');
}

export function MetadataEditor({ figure, onClose }: MetadataEditorProps) {
  const [fields, setFields] = useState<EditableFields>(
    figure ? figureToEditable(figure) : { title: '', description: '', lat: '', long: '', elevation: '', direction: '', datetime: '' }
  );
  const [copied, setCopied] = useState(false);

  const set = (key: keyof EditableFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields(f => ({ ...f, [key]: e.target.value }));
  };

  const tsOutput = figure ? generateTypeScript(figure.imagePath, fields) : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(tsOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Field label="Title" value={fields.title} onChange={set('title')} />
          <Field label="Datetime (ISO 8601)" value={fields.datetime} onChange={set('datetime')} placeholder="2024-03-15T10:30:00" />
          <Field label="Latitude" value={fields.lat} onChange={set('lat')} placeholder="60.7819" />
          <Field label="Longitude" value={fields.long} onChange={set('long')} placeholder="-149.1418" />
          <Field label="Elevation (meters)" value={fields.elevation} onChange={set('elevation')} placeholder="1139" />
          <Field label="Direction (°, 0=N)" value={fields.direction} onChange={set('direction')} placeholder="180" />
          <div className="col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Description (string only; JSX edit manually)</label>
            <textarea
              value={fields.description}
              onChange={set('description')}
              rows={2}
              className="w-full rounded border border-input bg-background px-2 py-1 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">TypeScript output — paste figures/registry.tsx</span>
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
