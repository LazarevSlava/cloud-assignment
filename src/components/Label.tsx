import type { PropsWithChildren } from 'react';

export function Label({
    htmlFor,
    children,
}: PropsWithChildren<{ htmlFor: string }>) {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-sm font-medium text-cz-ink/90 mb-1"
        >
            {children}
        </label>
    );
}
