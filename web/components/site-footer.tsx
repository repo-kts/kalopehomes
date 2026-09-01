import Link from 'next/link';
import { consultation, nav, services, site } from '@/lib/site-content';

/**
 * The logo artwork is a light-ground mark, so the footer uses the wordmark as
 * type rather than dropping the image onto ink.
 */
/**
 * `showCta` exists for pages that already close with a booking prompt of their
 * own — two of them stacked a few hundred pixels apart just reads as a bug.
 */
export function SiteFooter({ showCta = true }: { showCta?: boolean } = {}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-muted-light">
      <div className="grid grid-cols-2 gap-x-6 gap-y-9 px-6 py-12 sm:px-10 md:px-12 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:gap-10">
        <div className="col-span-2 lg:col-span-1">
          <span className="text-paper font-display text-xl tracking-[0.06em] uppercase">
            {site.name}
          </span>
          <p className="text-accent mt-3 text-[13px] tracking-[0.14em] uppercase">{site.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-muted-dim mb-3.5 text-[12px] tracking-[0.2em] uppercase">Explore</h2>
          <ul className="space-y-1 text-[14px]">
            {nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-accent block py-1 transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-muted-dim mb-3.5 text-[12px] tracking-[0.2em] uppercase">Services</h2>
          <ul className="space-y-2 text-[14px]">
            {services.map((service) => (
              <li key={service.num}>
                <Link
                  href="/#services"
                  className="hover:text-accent block py-1 transition-colors duration-300"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h2 className="text-muted-dim mb-3.5 text-[12px] tracking-[0.2em] uppercase">Contact</h2>
          <a
            href={`tel:${consultation.phone.replace(/\s/g, '')}`}
            className="text-paper hover:text-accent font-display block text-xl transition-colors duration-300"
          >
            {consultation.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="hover:text-accent mt-2 block text-[14px] transition-colors duration-300"
          >
            {site.email}
          </a>
          <p className="text-muted-dim mt-3 text-[14px]">{consultation.address}</p>
          {showCta && (
            <Link
              href="/#book"
              className="bg-accent text-ink hover:bg-paper mt-5 inline-block px-5 py-2.5 text-[11.5px] tracking-[0.16em] uppercase transition-colors duration-300"
            >
              Book a consultancy
            </Link>
          )}
        </div>
      </div>

      <div className="border-rule-dark flex flex-col gap-2 border-t px-6 py-5 text-[12.5px] tracking-[0.1em] sm:px-10 md:flex-row md:items-center md:justify-between md:px-12">
        <span>
          © {year} {site.name}. All rights reserved.
        </span>
        <span className="text-muted-dim">{site.footerLine}</span>
      </div>
    </footer>
  );
}
