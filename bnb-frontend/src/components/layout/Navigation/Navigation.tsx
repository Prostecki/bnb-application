import Link from 'next/link';

export const Navigation = () => {
  return (
    <nav>
      <ul className="flex gap-4">
        <li>
          <Link href="/properties">Properties</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/register">Register</Link>
        </li>
      </ul>
    </nav>
  );
};
