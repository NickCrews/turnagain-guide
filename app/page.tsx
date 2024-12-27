import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Link href="/cached">cached on initial load</Link>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/about"
        >
          About
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/license"
        >
          License
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          // TODO: Update this link
          href="mailto:nicholas.b.crews+turnagain.guide@gmail.com"
        >
          Suggest an edit
        </Link>
      </footer>
    </div>
  );
}
