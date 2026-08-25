'use client';

import { useState, type FormEvent } from 'react';

import { Reveal } from '@/components/reveal';
import { consultation, site } from '@/lib/site-content';
import { delay } from '@/lib/motion';

type Errors = Partial<Record<'name' | 'phone' | 'email' | 'projectType', string>>;

const FIELD =
  'w-full border border-rule bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-200 focus:border-ink';
const LABEL = 'mb-2 block text-[12px] tracking-[0.16em] text-muted uppercase';

/**
 * T-09 · Book a consultancy.
 *
 * Submitting hands the enquiry to the visitor's mail client, so the form works
 * with no backend. To capture enquiries server-side instead, replace the body
 * of `handleSubmit` with a POST to the `api` app and drop the `mailto` step.
 */
export function BookConsultation() {
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const projectType = String(data.get('projectType') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const next: Errors = {};
    if (!name) next.name = 'Please tell us your name.';
    if (!phone) next.phone = 'We need a number to call you back on.';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'That email address does not look right.';
    }
    if (!projectType) next.projectType = 'Please choose a project type.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Project type: ${projectType}`,
      '',
      message || '(No additional details)',
    ]
      .filter(Boolean)
      .join('\n');

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `Consultancy request: ${projectType}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Reveal id="book" className="bg-paper-deep px-6 py-16 sm:px-10 md:px-12 md:py-20">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-18">
        <div>
          <div className="kh-fade-up mb-5 flex items-center gap-4">
            <span className="bg-accent h-0.5 w-14" />
            <span className="text-muted text-xs tracking-[0.28em] uppercase">
              No cost, no obligation
            </span>
          </div>

          <h2 className="kh-fade-up font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] font-normal">
            {consultation.heading}
          </h2>

          <p
            className="kh-fade-up text-body mt-6 max-w-[30rem] text-[16.5px] leading-[1.75]"
            style={delay(0.15)}
          >
            {consultation.body}
          </p>

          <ul className="mt-9 space-y-4">
            {consultation.points.map((point, i) => (
              <li
                key={point}
                className="kh-fade-up text-body flex items-start gap-3.5 text-[15.5px]"
                style={delay(0.3 + i * 0.1)}
              >
                <span className="bg-accent mt-2 size-2 shrink-0" />
                {point}
              </li>
            ))}
          </ul>

          <div className="kh-fade-up border-rule mt-10 border-t pt-8" style={delay(0.6)}>
            <a
              href={`tel:${consultation.phone.replace(/\s/g, '')}`}
              className="text-ink hover:text-accent-deep block font-serif text-2xl transition-colors duration-300"
            >
              {consultation.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="text-body hover:text-accent-deep mt-1 block text-[15px] transition-colors duration-300"
            >
              {site.email}
            </a>
            <p className="text-muted mt-3 text-[14px]">{consultation.address}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="kh-fade-up" style={delay(0.2)}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                className={FIELD}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-accent-deep mt-1.5 text-[13px]">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className={LABEL} htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={FIELD}
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-accent-deep mt-1.5 text-[13px]">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label className={LABEL} htmlFor="email">
              Email <span className="normal-case">(optional)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={FIELD}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-accent-deep mt-1.5 text-[13px]">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mt-5">
            <label className={LABEL} htmlFor="projectType">
              Project type
            </label>
            <select
              id="projectType"
              name="projectType"
              defaultValue=""
              className={FIELD}
              aria-invalid={Boolean(errors.projectType)}
              aria-describedby={errors.projectType ? 'projectType-error' : undefined}
            >
              <option value="" disabled>
                Select one…
              </option>
              {consultation.projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.projectType && (
              <p id="projectType-error" className="text-accent-deep mt-1.5 text-[13px]">
                {errors.projectType}
              </p>
            )}
          </div>

          <div className="mt-5">
            <label className={LABEL} htmlFor="message">
              Tell us about the space <span className="normal-case">(optional)</span>
            </label>
            <textarea id="message" name="message" rows={4} className={FIELD} />
          </div>

          <button
            type="submit"
            className="bg-ink text-paper hover:bg-accent hover:text-ink mt-7 w-full px-8 py-4 text-[13px] tracking-[0.16em] uppercase transition-colors duration-300 sm:w-auto"
          >
            Request a callback
          </button>
        </form>
      </div>
    </Reveal>
  );
}
