import Link from 'next/link';
import ZewuLogo from './logo-zewu';
import HeartLogo from './logo-heart';
import { auth } from '@/server/auth';

export default async function ZewuNav() {
  const session = await auth();

  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href="/" aria-label="zewu logo">
              <ZewuLogo />
            </Link>
          </li>

          <li>
            <HeartLogo />
          </li>
        </ul>
      </nav>
    </header>
  );
}
