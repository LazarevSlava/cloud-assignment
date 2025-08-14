import type { ChangeEvent } from 'react';

export function Input({
    id,
    value,
    onChange,
    placeholder,
    disabled,
}: {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
}) {
    return (
        <input
            id={id}
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
            }
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            className="w-full rounded-xl px-3.5 py-2.5 border border-cz-muted/40 bg-white text-cz-ink placeholder:text-cz-muted/80 outline-none focus:ring-2 focus:ring-cz-violet/60 focus:border-cz-violet/60 disabled:opacity-60"
        />
    );
}
