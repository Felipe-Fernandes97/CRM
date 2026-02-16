'use client';

import dynamic from 'next/dynamic';

const LiquidChrome = dynamic(() => import('./LiquidChrome').then(mod => mod.default), {
  ssr: false,
});

export default function LiquidChromeWrapper() {
  return (
    <LiquidChrome
      baseColor={[0, 0, 0.05]}
      speed={0.21}
      amplitude={0.3}
      interactive={true}
    />
  );
}
