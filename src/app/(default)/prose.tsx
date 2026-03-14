export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose p-4 mx-auto">
      {children}
    </div>
  );
}