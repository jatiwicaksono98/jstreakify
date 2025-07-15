'use client';
import Image from 'next/image';
import { Button } from '../ui/button';

export default function ZewuLogo() {
  return (
    <Button variant={'zewu'} className="flex items-center justify-center p-1.5">
      <Image
        src="/zewu-logo.png"
        alt="Zewu Logo"
        width={40}
        height={40}
        priority
      />
    </Button>
  );
}
