import type { PropsWithChildren } from 'react';

export function SectionCard({
    title,
    hint,
    children,
}: PropsWithChildren<{ title: string; hint?: string }>) {
    return (
        <section className="bg-white/95 backdrop-blur rounded-2xl shadow-lg p-5 border border-cz-muted/20 flex flex-col min-h-56">
            <header className="mb-4">
                <h2 className="text-lg font-semibold text-cz-ink flex items-center gap-2">
                    <span className="inline-block w-1.5 h-5 rounded-full bg-cz-violet" />
                    {title}
                </h2>
                {hint ? (
                    <p className="text-sm text-cz-ink/70 mt-1 leading-snug">
                        {hint}
                    </p>
                ) : null}
            </header>

            {}
            <div className="mt-auto">{children}</div>
        </section>
    );
}
