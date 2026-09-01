import type { Metadata } from 'next';
import { Poppins, Roboto } from 'next/font/google';
import './globals.css';

// Matching livspace.com: Poppins for headings, Roboto for body.
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  // Headings all sit at 400. Livspace sets its own to 600 — add it here if
  // you want that heavier look.
  weight: '400',
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Kalope Homes · All-In-One Office & Home Solution',
  description:
    'Kalope Homes designs and builds office and home interiors with the precision of a drawing set. Every room composed, every transition considered.',
};

/** Finished state for each reveal class, used when scripts are unavailable. */
const NO_SCRIPT_CSS = `
  .kh-panel, .kh-blind { transform: scaleY(0) !important; }
  .kh-frame-l { transform: translateX(-101%) !important; }
  .kh-frame-r { transform: translateX(101%) !important; }
  .kh-rise, .kh-fade-up, .kh-fade { opacity: 1 !important; transform: none !important; }
  .kh-line-x { transform: scaleX(1) !important; }
  .kh-line-y { transform: scaleY(1) !important; }
  .kh-zoom { transform: none !important; }
  .kh-marquee { animation: none !important; }
  .kh-marquee-viewport { overflow-x: auto !important; }
`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${roboto.variable} ${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-clip font-sans">
        {/*
          The reveal system hides content until JavaScript sets `data-shown`.
          With scripts off that never happens and the page is just empty
          backgrounds, so drop every element straight into its finished state.
        */}
        <noscript>
          <style>{NO_SCRIPT_CSS}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
