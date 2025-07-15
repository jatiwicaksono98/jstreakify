import { Button } from '../ui/button';
import Link from 'next/link';

import ZewuLogo from './logo-zewu';
import { HeartIcon } from 'lucide-react';

export default function ZewuNav() {
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
            <Button
              variant={'zewu'}
              className="flex items-center justify-center gap-1.5"
            >
              Terima Kasih
              <HeartIcon color="#8C6239" strokeWidth={4} size={7} />
              {/* <Lottie
                className="h-6"
                animationData={heartbeat}
                loop={false}
                autoplay
                lottieRef={lottieRef}
              /> */}
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
