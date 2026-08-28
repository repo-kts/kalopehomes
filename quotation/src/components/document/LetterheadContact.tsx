import type { CSSProperties } from 'react';
import iconEmail from '@/assets/icon-email.png';
import iconPhone from '@/assets/icon-phone.png';
import iconWeb from '@/assets/icon-web.png';
import type { CompanyContact } from '@/types/quotation';

/**
 * The contact lines in the letterhead footer, drawn as live text so they can be
 * edited. The letterhead PNG has this block erased (see `styles/document.css`);
 * the icons are cropped straight out of it, so they stay pixel-identical.
 *
 * Every measurement below is the position the baked-in original occupied, in
 * millimetres from the top-left of the A4 page.
 */
const LINES: {
  key: keyof CompanyContact;
  icon: string;
  alt: string;
  iconLeft: number;
  iconTop: number;
  iconWidth: number;
  iconHeight: number;
  textTop: number;
  italic?: boolean;
}[] = [
  {
    key: 'phone',
    icon: iconPhone,
    alt: 'Phone',
    iconLeft: 19.651,
    iconTop: 248.363,
    iconWidth: 2.624,
    iconHeight: 2.836,
    textTop: 247.94,
  },
  {
    key: 'email',
    icon: iconEmail,
    alt: 'Email',
    iconLeft: 19.482,
    iconTop: 254.42,
    iconWidth: 2.942,
    iconHeight: 2.074,
    textTop: 253.53,
  },
  {
    key: 'website',
    icon: iconWeb,
    alt: 'Website',
    iconLeft: 19.63,
    iconTop: 259.818,
    iconWidth: 2.667,
    iconHeight: 2.582,
    textTop: 259.12,
    italic: true,
  },
];

const mm = (value: number) => `${value}mm`;

export function LetterheadContact({ company }: { company: CompanyContact }) {
  return (
    <div className="letterhead-contact" aria-label="Company contact details">
      {LINES.map((line) => {
        const value = company[line.key].trim();
        // An empty field takes its icon with it rather than leaving it orphaned.
        if (!value) return null;
        return (
          <div key={line.key}>
            <img
              className="letterhead-contact__icon"
              src={line.icon}
              alt={line.alt}
              style={
                {
                  left: mm(line.iconLeft),
                  top: mm(line.iconTop),
                  width: mm(line.iconWidth),
                  height: mm(line.iconHeight),
                } as CSSProperties
              }
            />
            <span
              className={`letterhead-contact__text${line.italic ? ' is-italic' : ''}`}
              style={{ top: mm(line.textTop) }}
            >
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
