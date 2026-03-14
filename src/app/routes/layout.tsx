import Header from "../components/header";

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 min-h-0">
        {children}
      </main>
      <div id="modal-root" />
    </div>
  );
}