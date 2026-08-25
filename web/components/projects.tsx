import Image from 'next/image';

import { Reveal } from '@/components/reveal';
import { projects } from '@/lib/site-content';
import { delay } from '@/lib/motion';

/** T-02 · Blind reveal — three horizontal blinds lift off each project photo. */
export function Projects() {
  return (
    <Reveal id="projects" className="bg-ink text-paper px-6 py-16 sm:px-10 md:px-12 md:py-20">
      <h2 className="kh-fade-up mb-14 font-serif text-[clamp(2.25rem,5vw,4rem)] font-normal md:mb-16">
        Selected projects
      </h2>

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => {
          const base = i * 0.15;
          return (
            <div key={project.name} className="flex flex-col gap-[18px]">
              <div className="relative h-[22rem] overflow-hidden lg:h-[23.75rem]">
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 z-[5] flex flex-col">
                  {[0, 1, 2].map((b) => (
                    <div
                      key={b}
                      className="kh-blind bg-ink flex-1"
                      style={delay(base + b * 0.12)}
                    />
                  ))}
                </div>
              </div>

              <div
                className="kh-fade-up flex items-baseline justify-between"
                style={delay(base + 0.24)}
              >
                <div>
                  <div className="font-serif text-[22px]">{project.name}</div>
                  <div className="text-muted-light mt-1 text-[13px]">{project.meta}</div>
                </div>
                <span className="text-accent font-serif text-[15px]">{project.num}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
