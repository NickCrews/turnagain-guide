// import { MetadataEditor } from './metadata-editor';
import { Figure } from '@/figures';
import process from 'process';
// import { ProdStub, ProdStubProps } from '@/stub-in-prod';

export async function MetadataEditorSafe(props: { figure: Figure | null; onClose: () => void }) {
  // if (process.env.NODE_ENV === 'production') {
  //   return <div className="p-4 bg-red-100 text-red-700 rounded">Metadata editing is only available in development.</div>;
  // }
  // if (1 === 1) {
  //   return <div className="p-4 bg-red-100 text-red-700 rounded">Metadata editing is only available in development.</div>;
  // }
  // return <ProdStub<React.ElementType> importPath="./metadata-editor" props={{ figure: props.figure, onClose: props.onClose }} />;
  // return <div className="p-4 bg-yellow-100 text-yellow-700 rounded">Loading metadata editor...</div>;
  const { MetadataEditor } = await import('./metadata-editor');
  return <MetadataEditor figure={props.figure} onClose={props.onClose} />;
}