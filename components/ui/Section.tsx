import type { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Section({ eyebrow, title, description, children }: SectionProps) {
  return (
    <section className="sentence-grid bg-paper-50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 rounded-md bg-white p-5 text-ink-950 shadow-soft ring-1 ring-ink-950/10 sm:p-7">
          <div className="grid gap-5 md:grid-cols-[0.9fr_1fr] md:items-end">
            <div>
              {eyebrow ? <p className="mb-3 text-xs font-black uppercase text-moss-700">{eyebrow}</p> : null}
              <h1 className="text-balance font-serif text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
            </div>
            {description ? <p className="max-w-2xl text-base leading-7 text-ink-650 md:justify-self-end md:text-right">{description}</p> : null}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
