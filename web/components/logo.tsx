import Image from 'next/image';

import logo from '../public/logo.png';

/**
 * The Kalope Homes logo (from kalopehomes.com/logo-full.png).
 *
 * The file is cropped to the artwork's bounding box (338x180). The supplied
 * PNG was a 500x500 square with the lockup floating in the middle, so 64% of
 * its height was transparent padding and every height class was mostly
 * sizing empty space.
 *
 * Imported statically so Next reads the real intrinsic size and keeps the
 * aspect ratio exact; replacing `public/logo.png` updates it automatically.
 */
export function Logo() {
  return (
    <Image
      src={logo}
      alt="Kalope Homes"
      priority
      sizes="(max-width: 640px) 90px, 105px"
      className="h-12 w-auto -translate-y-0.5 sm:h-14"
    />
  );
}
