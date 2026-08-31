'use client';

import { useEffect, useId, useRef, useState } from 'react';

type SelectFieldProps = {
  label: string;
  placeholder: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
  labelClassName: string;
};

/**
 * A dropdown the site can actually style.
 *
 * A native `<select>` hands its option list to the operating system, which
 * draws it in system colours no CSS can reach — hence the grey-and-blue panel.
 * This is a listbox built from a button and a `<ul>`, so the open panel uses
 * the same paper, rules and type as everything else.
 *
 * It behaves like a real select: arrow keys move the highlight, Home and End
 * jump to the ends, Enter or Space picks, Escape closes and returns focus, and
 * clicking outside dismisses it. The chosen value rides in a hidden input so
 * the surrounding form still reads it straight off `FormData`.
 */
export function SelectField({
  label,
  placeholder,
  options,
  value,
  onChange,
  invalid,
  describedBy,
  labelClassName,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const listId = `${id}-list`;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  function choose(option: string) {
    onChange(option);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
          buttonRef.current?.focus();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlight(Math.max(0, options.indexOf(value)));
        } else {
          setHighlight((current) => Math.min(options.length - 1, current + 1));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (open) setHighlight((current) => Math.max(0, current - 1));
        break;
      case 'Home':
        if (open) {
          event.preventDefault();
          setHighlight(0);
        }
        break;
      case 'End':
        if (open) {
          event.preventDefault();
          setHighlight(options.length - 1);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) choose(options[highlight] ?? options[0]);
        else {
          setOpen(true);
          setHighlight(Math.max(0, options.indexOf(value)));
        }
        break;
      default:
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <span id={`${id}-label`} className={labelClassName}>
        {label}
      </span>

      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${id}-label`}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={() => {
          setOpen((current) => !current);
          setHighlight(Math.max(0, options.indexOf(value)));
        }}
        className={`border-rule focus-visible:border-ink flex w-full items-center justify-between gap-3 border-b bg-transparent px-0 py-3 text-left text-[16px] transition-colors duration-200 outline-none ${
          open ? 'border-ink' : ''
        } ${value ? 'text-ink' : 'text-muted'}`}
      >
        {value || placeholder}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          aria-hidden="true"
          className={`text-muted shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-option-${highlight}`}
          className="kh-menu border-rule bg-paper absolute inset-x-0 top-full z-30 mt-1 max-h-64 overflow-y-auto border py-1 shadow-2xl shadow-black/10"
        >
          {options.map((option, i) => {
            const selected = option === value;
            return (
              <li
                key={option}
                id={`${id}-option-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => choose(option)}
                className={`cursor-pointer px-4 py-2.5 text-[15px] transition-colors duration-150 ${
                  i === highlight ? 'bg-paper-deep' : ''
                } ${selected ? 'text-accent-deep' : 'text-body'}`}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
