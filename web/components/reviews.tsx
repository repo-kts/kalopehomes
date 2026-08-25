import { Reveal } from '@/components/reveal';
import { reviews } from '@/lib/site-content';
import { delay } from '@/lib/motion';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-accent flex gap-1" role="img" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" className={n <= rating ? '' : 'opacity-25'}>
          ★
        </span>
      ))}
    </div>
  );
}

/**
 * T-08 · Reviews marquee.
 *
 * The cards run side by side on a loop that pauses on hover or keyboard focus.
 * The list is rendered four times — every copy after the first is hidden from
 * assistive tech — so the track can translate exactly one list-width and repeat
 * seamlessly without the tail showing on a wide screen.
 *
 * The quotes in `lib/site-content.ts` are placeholders, not real customers.
 * See the warning above `reviews` there before publishing.
 */
export function Reviews() {
  return (
    <Reveal id="reviews" className="bg-ink text-paper py-16 md:py-20">
      <div className="mb-10 px-6 sm:px-10 md:mb-12 md:px-12">
        <div className="kh-fade-up mb-5 flex items-center gap-3 sm:gap-4">
          <span className="bg-accent h-0.5 w-9 shrink-0 sm:w-14" />
          <span className="text-muted-dim text-[10px] tracking-[0.16em] uppercase sm:text-xs sm:tracking-[0.28em]">
            In their words
          </span>
        </div>
        <h2 className="kh-fade-up font-serif text-[clamp(2.25rem,5vw,4rem)] font-normal">
          Customer reviews
        </h2>
      </div>

      <div className="kh-fade kh-marquee-viewport" style={delay(0.25)}>
        <div className="kh-marquee flex w-max">
          {[0, 1, 2, 3].map((copy) => (
            <ul key={copy} className="flex" aria-hidden={copy > 0 || undefined}>
              {reviews.map((review) => (
                <li key={review.quote} className="mr-6 w-[18rem] shrink-0 sm:mr-7 sm:w-[23rem]">
                  <figure className="border-rule-dark flex h-full flex-col justify-between border p-7">
                    <Stars rating={review.rating} />
                    <blockquote className="text-muted-light mt-5 text-[15.5px] leading-[1.65]">
                      “{review.quote}”
                    </blockquote>
                    <figcaption className="mt-7 flex items-center gap-3.5">
                      <span className="bg-accent text-ink flex size-10 shrink-0 items-center justify-center rounded-full font-serif text-[14px]">
                        {review.initials}
                      </span>
                      <span>
                        <span className="text-paper block font-serif text-[16px]">
                          {review.name}
                        </span>
                        <span className="text-muted-dim mt-0.5 block text-[12.5px]">
                          {review.meta}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
