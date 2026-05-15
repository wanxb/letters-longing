import type { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Section({ eyebrow, title, description, children }: SectionProps) {
  return (
    <section className="bg-paper-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 grid gap-5 border-b border-paper-200 pb-6 md:grid-cols-[0.8fr_1fr] md:items-end">
          <div>
            {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-moss-700">{eyebrow}</p> : null}
            <h2 className="text-balance font-serif text-4xl font-semibold text-ink-950 sm:text-5xl">{title}</h2>
          </div>
          {description ? <p className="max-w-xl text-base leading-7 text-ink-650 md:justify-self-end md:text-right">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
