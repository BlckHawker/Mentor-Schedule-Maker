
import Link from 'next/link';
export default function Home() {
  return (
      <div>
        <h1>Home Page</h1>
        <Link href="./mentor/">Go to Mentor Page</Link><br/>
        <Link href="./schedule/">Go to Schedule Page</Link>

      </div>
  );
}
