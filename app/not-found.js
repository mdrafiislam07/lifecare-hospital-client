import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="container center-page">
      <h1>Page not found</h1>
      <p>this page does not exist</p>
      <Link href="/" className="btn btn-primary">Go Home Page</Link>
    </section>
  );
}
