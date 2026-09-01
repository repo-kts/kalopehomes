import { Reveal } from '@/components/reveal';
import { steps } from '@/lib/site-content';
import { delay } from '@/lib/motion';

/**
 * T-04 · Sequential trace.
 *
 * One continuous rule rather than a segment per step — horizontal across four
 * columns from `lg`, vertical down the left below it. Diamond markers fade in
 * one after another, so the rule reads as being drawn past each step in turn.
 */
export function Process() {
  return (
    <Reveal id="process" className="bg-paper-deep px-6 py-16 sm:px-10 md:px-12 md:py-20">
      <div className="mb-10 md:mb-12">
        <div className="kh-fade-up mb-5 flex items-center gap-3 sm:gap-4">
          <span className="bg-accent h-0.5 w-9 shrink-0 sm:w-14" />
          <span className="text-muted text-[10px] tracking-[0.16em] uppercase sm:text-xs sm:tracking-[0.28em]">
            How it runs
          </span>
        </div>
        <h2 className="kh-fade-up font-display text-[clamp(2.25rem,5vw,4rem)] font-normal">
          From drawing to done
        </h2>
      </div>

      <div className="relative">
        {/* One rule, drawn once — horizontal on desktop, vertical below it. */}
        <div className="absolute top-[5px] right-0 left-0 hidden h-px lg:block">
          <div className="kh-line-x bg-ink/25 h-full origin-left" />
        </div>
        <div className="absolute top-2 bottom-2 left-[5px] w-px lg:hidden">
          <div className="kh-line-y bg-ink/25 h-full origin-top" />
        </div>

        <ol className="grid gap-9 lg:grid-cols-4 lg:gap-x-10">
          {steps.map((step, i) => {
            const dot = 0.2 + i * 0.15;
            return (
              <li key={step.num} className="relative pl-9 lg:pt-9 lg:pl-0">
                <span
                  className="kh-fade bg-accent absolute top-1 left-0 block size-2.5 rotate-45 lg:top-0 lg:left-0"
                  style={delay(dot)}
                />
                <div className="kh-fade-up" style={delay(dot + 0.08)}>
                  <span className="text-accent-deep font-display text-[15px]">{step.num}</span>
                  <h3 className="font-display mt-2 mb-2.5 text-[26px] leading-tight font-normal">
                    {step.name}
                  </h3>
                  <p className="text-body text-[15px] leading-[1.7]">{step.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Reveal>
  );
}
