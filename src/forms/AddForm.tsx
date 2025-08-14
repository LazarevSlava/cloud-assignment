import { useState } from 'react';
import { ActionButton, Input, SectionCard } from '../components';
import { api } from '../lib/api';

export function AddForm({
    disabled,
    onStatus,
}: {
    disabled: boolean;
    onStatus: (s: string) => void;
}) {
    const [addId, setAddId] = useState('');

    async function onAdd(e: React.FormEvent) {
        e.preventDefault();
        onStatus('');
        try {
            const id = addId.trim();
            if (!id) throw new Error('ID is empty');
            setAddId('');
            const data = await api.putCustomer(id);
            onStatus(`✅ Added: ${data.id}`);
        } catch (err: any) {
            onStatus(`❌ ${err.message}`);
        }
    }

    return (
        <SectionCard title="Add ID" hint="Adds this ID to the database">
            <form onSubmit={onAdd} className="space-y-3">
                <div>
                    <label htmlFor="addId" className="sr-only">
                        Customer ID
                    </label>
                    <Input
                        id="addId"
                        value={addId}
                        onChange={setAddId}
                        placeholder="Enter ID (e.g., abc123)"
                        disabled={disabled}
                    />
                </div>
                <ActionButton disabled={disabled} kind="primary">
                    Add
                </ActionButton>
            </form>
        </SectionCard>
    );
}
