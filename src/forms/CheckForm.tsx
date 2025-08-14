import { useState } from 'react';
import { ActionButton, Input, SectionCard } from '../components';
import { api } from '../lib/api';

export function CheckForm({
    disabled,
    onStatus,
}: {
    disabled: boolean;
    onStatus: (s: string) => void;
}) {
    const [checkId, setCheckId] = useState('');

    async function onCheck(e: React.FormEvent) {
        e.preventDefault();
        onStatus('');
        try {
            const id = checkId.trim();
            if (!id) throw new Error('ID is empty');
            setCheckId('');
            const r = await api.getCustomer(id);
            onStatus(
                r.exists
                    ? `🟢 Found in table: ${r.id}`
                    : `⚪️ Not in table: ${r.id}`
            );
        } catch (err: any) {
            onStatus(`❌ ${err.message}`);
        }
    }

    return (
        <SectionCard
            title="Check ID"
            hint="Checks if the ID is in the database"
        >
            <form onSubmit={onCheck} className="space-y-3">
                <div>
                    <label htmlFor="checkId" className="sr-only">
                        Customer ID
                    </label>
                    <Input
                        id="checkId"
                        value={checkId}
                        onChange={setCheckId}
                        placeholder="Enter ID (e.g., abc123)"
                        disabled={disabled}
                    />
                </div>
                <ActionButton disabled={disabled} kind="secondary">
                    Check
                </ActionButton>
            </form>
        </SectionCard>
    );
}
