export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    // this is the height of the header, I cant figure out a way to get it to
    // work out without hardcoding it.
    <div className="h-[calc(100dvh-4rem)]">
      {children}
      <div id="modal-root" />
    </div>
  );
}