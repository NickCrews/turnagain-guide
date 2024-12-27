import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h1>This page is now available offline!</h1>
      <Link href="/">
        back home
      </Link>
    </div>
  );
}