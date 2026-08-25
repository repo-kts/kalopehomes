import Image from 'next/image';

import logo from '@/public/logo.png';

/**
 * The supplied Kalope Homes logo, used as-is.
 *
 * `public/logo.png` is the transparent artwork with two non-logo artefacts
 * removed: the letterhead wedge that sat in the top-right corner, and the
 * empty margin around the mark. The mark itself — including the ® and the
 * tagline — is untouched.
 *
 * Imported statically so Next reads the real intrinsic size (410x115) and
 * keeps the aspect ratio exact; replacing the file updates it automatically.
 */
export function Logo() {
  return (
    <Image
      src={logo}
      alt="Kalope Homes"
      priority
      sizes="(max-width: 640px) 150px, 175px"
      className="h-11 w-auto -translate-y-1 sm:h-12"
    />
  );
}
