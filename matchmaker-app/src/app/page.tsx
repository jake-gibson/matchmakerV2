import Link from 'next/link';

export default function Home() {
  //This is the component that is rendered at '/' (root endpoint)

  return (
    <main>
      <h1>Welcome to Matchmaker</h1>
      <Link href="/admin">Go to Admin Page</Link>
    </main>
  );
}
