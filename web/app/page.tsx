import { BestSelling } from '@/components/best-selling';
import { BookConsultation } from '@/components/book-consultation';
import { Hero } from '@/components/hero';
import { Projects } from '@/components/projects';
import { Reviews } from '@/components/reviews';
import { RoomSequence } from '@/components/room-sequence';
import { Services } from '@/components/services';
import { SiteFooter } from '@/components/site-footer';
import { Studio } from '@/components/studio';

/**
 * The hero is driven by slides published in the admin, so the page prerenders
 * with what is live and refreshes every five minutes.
 */
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <RoomSequence />
        <Projects />
        <BestSelling />
        <Services />
        <Studio />
        <Reviews />
        <BookConsultation />
      </main>
      <SiteFooter />
    </>
  );
}
