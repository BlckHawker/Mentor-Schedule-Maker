
import Link from 'next/link';
export default function Home() {
  return (
      <div>
        <h1>Home Page</h1>
        <button><Link href="./mentor/">Go to Mentor Page</Link></button>
      </div>
  );
}
