'use client';
import { Button } from '../ui/button';
import Link from 'next/link';
import Lottie from 'lottie-react';
import heartbeat from '@/public/heartbeat.json';
import { useRef, useEffect } from 'react';
import ZewuLogo from './logo-zewu';
import { Heart, HeartIcon, HeartPulse } from 'lucide-react';

export default function ZewuNav() {
  const lottieRef = useRef<any>(null);
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); // Set to half speed
    }
  }, []);

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
