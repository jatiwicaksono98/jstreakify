'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import heart from '@/public/heart.json';

export default function HeartLogo() {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    // Play once on initial mount
    lottieRef.current?.play();
  }, []);

  const handlePlay = () => {
    // Manually restart the animation from beginning
    lottieRef.current?.stop();
    lottieRef.current?.play();
  };
  return (
    <Button
      variant="zewu"
      className="flex items-center justify-center gap-1.5 p-1.5"
      onClick={handlePlay}
    >
      {/* Terima Kasih */}
      {/* <HeartIcon color="#8C6239" strokeWidth={4} size={14} /> */}
      <Lottie
        className="h-16"
        animationData={heart}
        autoplay={false}
        loop={false}
        lottieRef={lottieRef}
      />
    </Button>
  );
}
