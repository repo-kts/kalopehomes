import Image from 'next/image';

import logo from '../public/logo.png';

/**
 * The Kalope Homes logo (from kalopehomes.com/logo-full.png).
 *
 * Imported statically so Next reads the real intrinsic size (500x500) and
 * keeps the aspect ratio exact; replacing `public/logo.png` updates it
 * automatically.
 */
export function Logo() {
  return (
    <Image
      src={logo}
      alt="Kalope Homes"
      priority
      sizes="(max-width: 640px) 64px, 80px"
      className="h-20 w-auto sm:h-24"
    />
  );
}
