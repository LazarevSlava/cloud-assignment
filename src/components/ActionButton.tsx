import type { PropsWithChildren } from 'react';

type Kind = 'primary' | 'secondary' | 'danger';

export function ActionButton({
    children,
    kind = 'primary',
    disabled,
}: PropsWithChildren<{ kind?: Kind; disabled?: boolean }>) {
    const base =
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
    const styles =
        kind === 'primary'
            ? 'bg-cz-orange hover:brightness-95 text-cz-white shadow'
            : kind === 'secondary'
            ? 'bg-cz-violet hover:brightness-110 text-cz-white shadow'
            : 'bg-cz-ink hover:brightness-110 text-cz-white shadow';
    return (
        <button
            type="submit"
            className={`${base} ${styles}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
