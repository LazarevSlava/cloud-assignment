import { useMemo, useState } from 'react';
import { Status } from './components';
import { AddForm } from './forms/AddForm';
import { CheckForm } from './forms/CheckForm';
import { DeleteForm } from './forms/DeleteForm';
import { ENV } from './lib/env';

export default function App() {
    const [msg, setMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const disabled = useMemo(() => loading, [loading]);

    function withLoading<T extends (...args: any[]) => Promise<any>>(fn: T) {
        return async (...args: Parameters<T>) => {
            setLoading(true);
            try {
                return await fn(...args);
            } finally {
                setLoading(false);
            }
        };
    }

    function handleGetStartedClick() {
        const el = document.getElementById('actions');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        const input = document.getElementById(
            'addId'
        ) as HTMLInputElement | null;
        if (input) {
            setTimeout(() => input.focus(), 500);
        }
    }

    return (
        <div className="min-h-screen bg-cz-ink text-cz-white">
            <header className="bg-gradient-to-r from-cz-deep via-cz-mid to-cz-violet pt-8 pb-12 md:pb-6">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <p className="text-cz-yellow text-sm tracking-wide uppercase">
                        Your Cloud
                    </p>
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mt-2">
                        Customer IDs Console
                    </h1>
                    <p className="text-cz-muted mt-2 max-w-2xl">
                        Add, check, and delete customer IDs via a secure AWS
                        REST API. Built with Lambda, API Gateway, and DynamoDB.
                    </p>
                    <div className="mt-5">
                        <button
                            onClick={handleGetStartedClick}
                            className="inline-flex items-center gap-2 bg-cz-orange hover:brightness-95 text-cz-white font-semibold px-6 py-3 rounded-full shadow cursor-pointer"
                        >
                            Get started <span aria-hidden>→</span>
                        </button>
                    </div>
                </div>
            </header>

            <main id="actions" className="-mt-8 md:-mt-12 pb-16">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AddForm
                            disabled={disabled}
                            onStatus={(s) => setMsg(s || null)}
                        />
                        <CheckForm
                            disabled={disabled}
                            onStatus={(s) => setMsg(s || null)}
                        />
                        <DeleteForm
                            disabled={disabled}
                            onStatus={(s) => setMsg(s || null)}
                        />
                    </div>
                    <div className="mt-6 min-h-[50px]">
                        <Status msg={msg} />
                    </div>
                    <div className="mt-8 text-sm text-cz-muted">
                        API:
                        <code className="ml-1 bg-black/40 border border-cz-muted/30 px-2 py-1 rounded-md">
                            {ENV.apiBase}
                        </code>
                    </div>
                </div>
            </main>

            <footer className="border-t border-cz-muted/20 bg-cz-ink/70">
                <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-cz-muted flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <span>
                        © {new Date().getFullYear()} Customer IDs Console
                    </span>
                    <span className="opacity-80">
                        AWS: Lambda • API Gateway • DynamoDB • Step Functions
                    </span>
                </div>
            </footer>
        </div>
    );
}
