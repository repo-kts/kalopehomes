/**
 * Kalope Homes wordmark.
 *
 * The original design imported a static `public/logo.png` (410x115) that was
 * never committed to the repo, which broke the production build. Until the real
 * artwork is added, this renders a self-contained SVG wordmark that inherits
 * the surrounding text colour via `currentColor` and keeps the same footprint.
 *
 * To restore the real logo: drop the PNG at `public/logo.png` and swap this
 * back to a `next/image` static import.
 */
export function Logo() {
  return (
    <svg
      viewBox="0 0 410 115"
      role="img"
      aria-label="Kalope Homes"
      className="h-11 w-auto -translate-y-1 sm:h-12"
      fill="currentColor"
    >
      <text
        x="0"
        y="72"
        textLength="410"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="60"
        fontWeight={600}
      >
        Kalope
        <tspan fontWeight={400} letterSpacing="4">
          {' '}
          HOMES
        </tspan>
      </text>
    </svg>
  );
}
