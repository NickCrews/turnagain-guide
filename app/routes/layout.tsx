import Header from "../components/Header";

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 min-h-0">
        {children}
      </main>
      <div id="modal-root" />
    </div>
  );
}